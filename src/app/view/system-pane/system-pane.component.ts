import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-system-pane',
  templateUrl: './system-pane.component.html',
  styleUrls: ['./system-pane.component.css']
})
export class SystemPaneComponent implements OnInit {

  @Output() locateEvent = new EventEmitter<void>()
  @Input() scanStarted: boolean = false;

  faArrowsRotate: any = faArrowsRotate;


  constructor() {
  }

  ngOnInit(): void {
  }

  locate() {
    this.locateEvent.emit();
  }
}
