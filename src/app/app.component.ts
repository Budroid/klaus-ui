import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Map, MapMouseEvent, SymbolLayout} from "mapbox-gl";

import {LocationService} from "./service/location.service";
import {ScanService} from "./service/scan.service";
import {NetworkService} from "./service/network.service";

import {Stomp} from "@stomp/stompjs";
import {environment} from "../environments/environment";
import {faLocationCrosshairs} from '@fortawesome/free-solid-svg-icons';
import {Network} from "./model/network";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'klaus';
  currentLocation: any = [5.874548394, 52.413900073]
  scanStarted: boolean = false
  scannedNetworks: Network[] = []
  faLocationCrosshairs: any = faLocationCrosshairs
  scanFinished: boolean = false;
  processingData: boolean = false;
  // @ts-ignore
  map: Map;
  interactive: boolean = false;
  data: {
    type: "FeatureCollection",
    features: Network[]
  } = {
    type: 'FeatureCollection',
    features: []
  }
  layout:SymbolLayout = {
    'text-field': ["format", ["get", "ssid"]],
    'text-anchor': 'bottom',
    'text-justify': 'center',
    'text-offset':["literal", [2, -2]],
    'text-allow-overlap': true,
    'text-size': 9,
    'icon-image': 'defaultMarker',
    'icon-size': 1,
    'icon-allow-overlap': true,
  }
  defaultLayer = {
    id: 'default',
    layout: this.layout,
    paint:  {
      "icon-color": "blue",
      "text-color": "blue"
    }
  }
  poppedUpNetwork:any =  {
    geometry: {
      type: "Point",
      coordinates: [0, 0]
    }
  }
  stages = [
    {
      id:1,
      name:"Scan",
      description: "Scan the area to find attackable networks",
      completed: false
    },{
      id:2,
      name:"Locate",
      description: "Estimate the location of the networks",
      completed: false
    },{
      id:3,
      name:"Hack",
      description: "Attack all accesspoints to obtain crackable hashes",
      completed: false
    },{
      id:4,
      name:"Crack",
      description: "Crack the hashes found in the previous stage to obtain the PSK",
      completed: false
    }
  ]
  constructor(private locationService: LocationService,
              private scanService: ScanService,
              private networkService: NetworkService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Setup websocket communication
    const stompClient = Stomp.client("ws://" + environment.scannerUrl1 + ":2133/test")
    stompClient.debug = () => {
    };
    stompClient.connect({}, (frame: string) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/networks', (message) => {
        //console.log(message.body)
        this.scannedNetworks = JSON.parse(message.body);
      });
    });

    // Get our GPS location
    this.locate();
  }

  scan() {
    // call api to start or stop the scan
    if(!this.scanStarted) this.scannedNetworks = [];
    this.scanService.startScan(this.scanStarted).subscribe((data:boolean) => {
      if(!data){
        this.stopScan();
      }
      this.scanStarted = data;
    })
  }

  stopScan() {
    this.processingData = true;
    // Create bssid list for the extra info
    let bssidList: string[] = this.scannedNetworks.reduce((acc, obj) => {
      return acc.concat(obj.properties.accessPoints.map(ap => ap.bssid));
    }, ([] as string[]));
    // Get the extra info
    this.networkService.getExtraInfo(bssidList).subscribe((data: any) => {
      this.scannedNetworks.forEach(scannedNetwork => {
        scannedNetwork.properties.accessPoints.forEach(ap => {
          if(ap && ap.bssid){
            ap.vendor = data[ap.bssid]?.vendor || "Unknown";
            ap.uptime = data[ap.bssid]?.uptime || "Unknown";
          }else{
            console.log("Wat is hier aan de hand:")
            console.log(ap)
            console.log(ap.bssid)
            console.log(data[ap.bssid])
          }
        })
      })
      // Select the first network
      this.selectNetwork(this.scannedNetworks[0])

      // Give te features (networks) an ID
      this.scannedNetworks = this.scannedNetworks.map((network, index) => {
          network.id = index + 1;
          network.type = "Feature"
          return network;
        });

      this.scanFinished = true
      this.processingData = false;
      this.toStage(2);
    });
  }

  selectNetwork(network: Network) {
    // Fixed bug: popup tip stays visible when selecting a non-plotted network
    if(document.getElementsByClassName("mapboxgl-popup-tip")[0]){
      document.getElementsByClassName("mapboxgl-popup-tip")[0].remove();
    }

    this.scannedNetworks.forEach(scannedNetwork => scannedNetwork.properties.active = false);
    network.properties.active = true;
    this.setPoppedUpNetwork()
    this.changeDetector.detectChanges();
  }

  next() {
    // @ts-ignore
    let indexNewActive = this.scannedNetworks.indexOf(this.activeNetwork) + 1;
    if(indexNewActive == this.scannedNetworks.length) indexNewActive = 0;
    this.selectNetwork(this.scannedNetworks[indexNewActive]);
  }

  prev() {
    // @ts-ignore
    let indexNewActive = this.scannedNetworks.indexOf(this.activeNetwork) - 1;
    if(indexNewActive == -1) indexNewActive = this.scannedNetworks.length - 1;
    this.selectNetwork(this.scannedNetworks[indexNewActive]);
  }

  startLocate() {
    // Change cursor
    this.interactive = true;
    this.changeDetector.detectChanges();
    this.map.getCanvas().style.cursor = "crosshair"
    this.map.on('click', (e) => {
      if(this.interactive){

        // @ts-ignore
        this.activeNetwork.geometry = {
          type: "Point",
          coordinates: [e.lngLat.lng, e.lngLat.lat]
        }
        this.data =  {
          type: "FeatureCollection",
          features: this.scannedNetworks.filter(network => network.geometry)
        };
        this.setPoppedUpNetwork()
        this.map.getCanvas().style.cursor = "unset"
        this.interactive = false;
        // Check if all networks are plotted
        if(this.scannedNetworks.length === this.data.features.length){
          this.toStage(3);
        }
        this.changeDetector.detectChanges();
      }
    });
  }

  get activeNetwork(){
    console.log("get activeNetwork called")
    return this.scannedNetworks.find(network => network.properties.active)
  }

  setPoppedUpNetwork() {
    console.log("get poppedUpNetwork called")
    let poppedUpNetWork: any = {
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
    let activeNetwork = {...this.activeNetwork}
    if (activeNetwork && activeNetwork.geometry && activeNetwork.properties) {
      poppedUpNetWork.properties = {
        ssid:activeNetwork.properties.ssid,
      }
      poppedUpNetWork.geometry = activeNetwork.geometry;
    }

    this.poppedUpNetwork = poppedUpNetWork;
  }

  mapLoaded($event: Map) {
    this.map = $event;
    let image = new Image(40,  40)
    image.onload = () =>{
      this.map.addImage("defaultMarker", image, {sdf: true})
    }
    image.src = "../assets/router-wireless.svg"
  }

  selectNetworkFromLayer(evt: MapMouseEvent) {
    console.log("SELECT")
    // let network = this.data.features.find(feature => feature.id === (<any>evt).features[0].id);
    let network = this.scannedNetworks.find(feature => feature.id === (<any>evt).features[0].id);
    this.selectNetwork(network as Network)
  }

  locate() {
    this.locationService.getLocation().subscribe((data: number[]) => {
      this.currentLocation = data
    });
  }

  private toStage(stageId: number) {
    let currentstage = this.stages.find(stage => stage.id === stageId -1)
    // @ts-ignore
    currentstage.completed = true;
  }
}
