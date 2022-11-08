import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons"
import {Stage} from "../../model/stage";
import {SafeUrl} from "@angular/platform-browser";
import {Network} from "../../model/network";

@Component({
  selector: 'app-progress-pane',
  templateUrl: './progress-pane.component.html',
  styleUrls: ['./progress-pane.component.css']
})
export class ProgressPaneComponent implements OnInit {

  @Input() stages:Stage[] = [];
  @Input() currentStage: number | undefined;
  @Input() data:{
    type: "FeatureCollection",
    features: Network[]
  } = {
    type: 'FeatureCollection',
    features: []
  }
  @Output() scanEvent = new EventEmitter();
  @Output() hackEvent = new EventEmitter();
  @Output() loadEvent = new EventEmitter();

  faCircleCheck:any = faCircleCheck


  constructor() {
  }

  ngOnInit(): void {
  }

  scan() {
    this.scanEvent.emit();
  }

  hack() {
    this.hackEvent.emit();
  }

  load(){
    this.loadEvent.emit();
  }

  get dataUri(): SafeUrl {
    const jsonData = JSON.stringify(this.data);
    // return this.sanitizer.bypassSecurityTrustUrl(uri);
    return 'data:application/json;charset=UTF-8,' + encodeURIComponent(jsonData);
  }
}
