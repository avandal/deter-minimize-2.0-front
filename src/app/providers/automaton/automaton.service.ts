import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from 'src/app/models/state';

export interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutomatonService {
  private url: string = "http://10.0.1.54:8080/deter-minimize-2.0/";

  constructor(private http: HttpClient) {}

  public getStates(): Observable<State[]> {
    let filename = "/home/excilys/eclipse-workspace/deter-minimize/graphs/graph3.grv";
    return this.http.put<State[]>(this.url + "open/", filename,  {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  public getMaxDimension(): Observable<Dimension> {
    return this.http.get<Dimension>(this.url + "states/dimension/", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
