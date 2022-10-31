import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons"
import {Stage} from "../../model/stage";

@Component({
  selector: 'app-progress-pane',
  templateUrl: './progress-pane.component.html',
  styleUrls: ['./progress-pane.component.css']
})
export class ProgressPaneComponent implements OnInit {

  @Input() stages:Stage[] = [];
  @Output() scanEvent = new EventEmitter();

  faCircleCheck:any = faCircleCheck


  constructor() {
  }

  ngOnInit(): void {
  }

  get currentStage(){
    let currentStage = this.stages.find(stage => !stage.completed)
    if(!currentStage){
      console.log("All stages completed")
    }
   return currentStage
  }

  scan() {
    this.scanEvent.emit();
  }
}
