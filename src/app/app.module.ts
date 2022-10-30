import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import { RadarComponent } from './radar/radar.component';
import { SystemPaneComponent } from './system-pane/system-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    RadarComponent,
    SystemPaneComponent,
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
