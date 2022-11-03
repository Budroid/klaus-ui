import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HackService {

  constructor(private http: HttpClient) { }

  hackUrl = 'http://'+ environment.scannerUrl1 +':2133/hack';

  startHack(hackStarted: boolean) {
    return this.http.post<boolean>(this.hackUrl, hackStarted);
  }
}
