import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  constructor(private http: HttpClient) { }

  scanUrl = 'http://'+ environment.scannerUrl1 +':2133/scan';

  startScan(scanStarted: boolean) {
    return this.http.post<boolean>(this.scanUrl, scanStarted);
  }
}
