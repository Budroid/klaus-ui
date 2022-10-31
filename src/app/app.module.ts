import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import { RadarComponent } from './view/radar/radar.component';
import { SystemPaneComponent } from './view/system-pane/system-pane.component';
import { ProgressPaneComponent } from './view/progress-pane/progress-pane.component';
import { SessionsPaneComponent } from './view/sessions-pane/sessions-pane.component';
import { NetworkListPaneComponent } from './view/network-pane/network-list-pane.component';
import { NetworkSliderComponent } from './view/network-slider/network-slider.component';
import { ProcessingPaneComponent } from './view/processing-pane/processing-pane.component';
import { InteractivePaneComponent } from './view/interactive-pane/interactive-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    RadarComponent,
    SystemPaneComponent,
    ProgressPaneComponent,
    SessionsPaneComponent,
    NetworkListPaneComponent,
    NetworkSliderComponent,
    ProcessingPaneComponent,
    InteractivePaneComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken
    }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
