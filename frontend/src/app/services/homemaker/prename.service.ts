import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrenameService {


  private apiUrl: string = this.dbService.getServiceURL() + '/prename';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public create(params: {}, headers:any): Observable<any> {

    return this.http.post(this.apiUrl + '',params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findAll(): Observable<any> {
    return this.http.get(this.apiUrl + '', {
      headers: {
        'content-type': 'application/json',
        // 'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findById(id:any, headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public update(params: {}, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/edit', params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public delete(id: any, headers:any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/' + id,{
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }
}
