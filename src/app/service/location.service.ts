import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  locationUrl = 'http://'+environment.scannerUrl1+':2133/gps/location';

  getLocation() {
    return this.http.get<number[]>(this.locationUrl);
  }

}
