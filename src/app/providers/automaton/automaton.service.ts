import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomatonService {
  private url: string = "http://10.0.1.54:8080/deter-minimize-2.0/";

  constructor(private http: HttpClient) {}

  public getTest(): Observable<string> {
    return this.http.get<string>(this.url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
