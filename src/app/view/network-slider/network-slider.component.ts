import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Network} from "../../model/network";
import {faLocationCrosshairs} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-network-slider',
  templateUrl: './network-slider.component.html',
  styleUrls: ['./network-slider.component.css']
})
export class NetworkSliderComponent implements OnInit {

  @Input() scannedNetworks: Network[] | undefined;
  @Input() currentStage: number | undefined;

  @Output() startLocateEvent = new EventEmitter<void>();
  @Output() prevEvent= new EventEmitter<void>();
  @Output() nextEvent= new EventEmitter<void>();

  faLocationCrosshairs: any = faLocationCrosshairs;

  constructor() {
  }

  ngOnInit(): void {
  }

  startLocate() {
    this.startLocateEvent.emit();
  }

  prev() {
    this.prevEvent.emit();
  }

  next() {
    this.nextEvent.emit();
  }
}
