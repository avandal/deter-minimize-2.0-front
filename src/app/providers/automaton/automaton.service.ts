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
  private url: string = "http://10.0.1.54:8081/deter-minimize-2.0/";

  constructor(private http: HttpClient) {}

  public open(text: string): Observable<State[]> {
    return this.http.put<State[]>(this.url + "open/", text,  {
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
