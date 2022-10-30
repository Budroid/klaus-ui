import {Component, Input, OnInit} from '@angular/core';
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-system-pane',
  templateUrl: './system-pane.component.html',
  styleUrls: ['./system-pane.component.css']
})
export class SystemPaneComponent implements OnInit {

  // @ts-ignore
  @Input() locate: () => void;

  faArrowsRotate: any = faArrowsRotate;

  @Input() scanStarted: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
