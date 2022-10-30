import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) { }

  extraInfoUrl = 'http://'+ environment.scannerUrl1 +':2133/wirelessnetwork/extra?';

  getExtraInfo(bssidList:string[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({'networks': bssidList});
    return this.http.get(this.extraInfoUrl + queryParams.toString());
  }
}
