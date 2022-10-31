import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-progress-pane',
  templateUrl: './progress-pane.component.html',
  styleUrls: ['./progress-pane.component.css']
})
export class ProgressPaneComponent implements OnInit {

  @Output() scanEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }


  scan() {
    this.scanEvent.emit();
  }
}
