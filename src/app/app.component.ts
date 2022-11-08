import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Expression, Map, MapMouseEvent, SymbolLayout, SymbolPaint} from "mapbox-gl";

import mergelData from "/home/robert/hcxtools/hcxdumptool/klaus/test/mergel.json";

import {LocationService} from "./service/location.service";
import {ScanService} from "./service/scan.service";
import {NetworkService} from "./service/network.service";
import {HackService} from "./service/hack.service";

import {Stomp} from "@stomp/stompjs";
import {environment} from "../environments/environment";
import {faLocationCrosshairs} from '@fortawesome/free-solid-svg-icons';
import {Network} from "./model/network";
import {HackInfo} from "./model/hackInfo";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ opacity: 0 }))
      ]),
      state('*', style({ opacity: 1 })),
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'klaus';
  currentLocation: any = [5.874548394, 52.4138]
  currentStage = 1;
  scanStarted: boolean = false
  scannedNetworks: Network[] = []
  hackStarted: boolean = false
  faLocationCrosshairs: any = faLocationCrosshairs
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
  paintColor: Expression = [
    "case",
    ["==", ["get", "hacked"], true], "red",
    ["==", ["get", "hacked"], false], "blue",
    "blue"
  ]
  paint: SymbolPaint = {
    "text-color": this.paintColor,
    "icon-color": this.paintColor
  }
  defaultLayer = {
    id: 'default',
    layout: this.layout,
    paint: this.paint
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
      colors: ["#0000ff", "#120e4c"],
      completed: false
    },{
      id:2,
      name:"Locate",
      description: "Estimate the location of the networks",
      color: ["#0000ff", "#120e4c", "#4763c088"],
      completed: false
    },{
      id:3,
      name:"Hack",
      description: "Attack all accesspoints to obtain crackable hashes",
      color: ["#ff0000", "#560909", "#C0475588"],
      completed: false
    },{
      id:4,
      name:"Crack",
      description: "Crack the hashes found in the previous stage to obtain the PSK",
      color: ["#9dff00", "#1e591e", "#61C04787"],
      completed: false
    }
  ]
  constructor(private locationService: LocationService,
              private scanService: ScanService,
              private networkService: NetworkService,
              private hackService: HackService,
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

      stompClient.subscribe('/topic/hacks', (message) => {
        console.log("info recieved")
        let hackInfolist: HackInfo[] = JSON.parse(message.body);
        infoList:for (let hackInfo of hackInfolist) {
          for (let scannedNetwork of this.scannedNetworks) {
            if (scannedNetwork.properties.ssid === hackInfo.ssid) {

              scannedNetwork.properties.hacked = true;
              for (let ap of scannedNetwork.properties.accessPoints) {
                if (ap.bssid === hackInfo.ap) {
                  if (ap.hashLines) {
                    console.log("Adding hashline to existing AP")
                    ap.hashLines.push(hackInfo.hashLine);
                  } else {
                    ap.hashLines = [hackInfo.hashLine]
                  }
                  continue infoList;
                }
              }
              console.log("Adding AP to existing network")
              scannedNetwork.properties.accessPoints.push({
                hashLines: [hackInfo.hashLine],
                vendor: "Unknown",
                uptime: "Unknown",
                rssi: -100,
                channel: 0,
                bssid: hackInfo.ap
              })
              continue infoList;
            }
          }
          console.log("Adding new network to the list")
          // @ts-ignore
          this.scannedNetworks.push({
            id: this.scannedNetworks.length + 1,
            type: "Feature",
            properties: {
              ssid: hackInfo.ssid,
              hacked: true,
              accessPoints: [{
                bssid: hackInfo.ap,
                hashLines: [hackInfo.hashLine],
                channel: 0,
                rssi: hackInfo?.rssi || -101,
                uptime: "Unknown",
                vendor: "Unknown"
              }],
              active: false
            },
          })
        }
        this.scannedNetworks.sort((a, b) => {
          let rssiA = Math.max(...a.properties.accessPoints.map(ap => ap.rssi));
          let rssiB = Math.max(...b.properties.accessPoints.map(ap => ap.rssi));
          return rssiA < rssiB ? 1 : -1;
        })
        this.redrawMap();
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
      }else{
        this.map.flyTo({zoom:19, center:[this.currentLocation[0] + 0.0002, this.currentLocation[1]], duration:1000})
      }
      this.scanStarted = data;
    })
  }

  stopScan() {
    this.map.flyTo({zoom:18, center:[this.currentLocation[0], this.currentLocation[1]], duration:1000})
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
    this.map.flyTo({zoom:19, center:[this.currentLocation[0], this.currentLocation[1]], duration:1000})
    this.map.on('click', (e) => {
      if(this.interactive){

        // @ts-ignore
        this.activeNetwork.geometry = {
          type: "Point",
          coordinates: [e.lngLat.lng, e.lngLat.lat]
        }
        this.redrawMap();
        this.setPoppedUpNetwork()
        this.map.flyTo({zoom:18, center:[this.currentLocation[0], this.currentLocation[1]], duration:1000})
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

  private redrawMap() {
    this.data = {
      type: "FeatureCollection",
      features: this.scannedNetworks.filter(network => network.geometry)
    };
  }

  get activeNetwork(){
    return this.scannedNetworks.find(network => network.properties.active)
  }

  setPoppedUpNetwork() {
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
      // Set popup color
      let root = document.querySelector(':root');
      let popupColor = "blue"
      if(activeNetwork.properties.hacked){
        popupColor = "red";
      }
      // @ts-ignore
      root.style.setProperty('--popup-color', popupColor);
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
    this.currentStage = stageId;
    let newStage = this.stages.find(stage => stage.id === stageId)
    let root = document.querySelector(':root');
    // @ts-ignore
    root.style.setProperty('--stage-color', newStage.color[0]);
    // @ts-ignore
    root.style.setProperty('--stage-color-dark', newStage.color[1]);
    // @ts-ignore
    root.style.setProperty('--stage-color-radar', newStage.color[2]);
    // @ts-ignore
    this.map.setPaintProperty("road-label", 'text-color', newStage?.color[0]);
  }

  hack() {
    // call api to start or stop the hack
    this.hackService.startHack(this.hackStarted).subscribe((data:boolean) => {
      this.hackStarted = data;

      if(data){
        this.map.flyTo({zoom:19, center:[this.currentLocation[0] + 0.0002, this.currentLocation[1]], duration:1000})
      }else{
        this.map.flyTo({zoom:18, center:[this.currentLocation[0], this.currentLocation[1]], duration:1000})
      }

      this.changeDetector.detectChanges();
    })
  }

  load() {
    this.data = mergelData;
    this.scannedNetworks = this.data.features;
    this.setPoppedUpNetwork();
    this.stages.filter(stage => stage.id < 3).forEach(stage => stage.completed = true)
    this.toStage(3)
    this.changeDetector.detectChanges();
  }
}
