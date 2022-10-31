import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faWifiStrong} from '@fortawesome/free-solid-svg-icons';
import {Network} from "../../model/network";

@Component({
  selector: 'app-networklist-pane',
  templateUrl: './network-list-pane.component.html',
  styleUrls: ['./network-list-pane.component.css']
})
export class NetworkListPaneComponent implements OnInit {

  @Input() scannedNetworks: Network[] | undefined;
  @Output() selectNetworkEvent:any = new EventEmitter<Network>()

  faWifiStrong: any = faWifiStrong

  constructor() {
  }

  ngOnInit(): void {
  }

  getSignalClass(network: Network) {
    let signal = Math.max(...network.properties.accessPoints.map(o => o.rssi));
    if (signal > -50) return "wifi_1";
    if (signal > -80) return "wifi_2";
    if (signal > -90) return "wifi_3";
    return "wifi_4";
  }

  selectNetwork(network: Network) {
    this.selectNetworkEvent.emit(network)
  }
}
