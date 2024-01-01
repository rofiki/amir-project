import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomAddChecklistService {

  private apiUrl: string = this.dbService.getServiceURL() + '/homemaker/roomchecklist';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public create(params: {}, token:any): Observable<any> {

    return this.http.post(this.apiUrl + '',params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

  public findAll(token:any): Observable<any> {
    return this.http.get(this.apiUrl + '', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

  public findById(id:any, token:any): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

  public update(params: {}, id:any, token:any): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

  public delete(id: any, token:any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/' + id,{
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }
}
