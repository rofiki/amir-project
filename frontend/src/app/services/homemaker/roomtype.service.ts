import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {

  private apiUrl: string = this.dbService.getServiceURL() + '/homemaker';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public create(params: {}, headers:any): Observable<any> {

    return this.http.post(this.apiUrl + '/roomtype',params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findAll(headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/roomtype', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findById(id:any, headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/roomtype/' + id, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public update(params: {}, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/roomtype/edit', params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public delete(id: any, headers:any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/roomtype/' + id,{
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }
}
