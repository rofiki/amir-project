import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomemakerService {

  private apiUrl: string = this.dbService.getServiceURL() + '/homemaker';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public create(params: {}, headers:any): Observable<any> {

    return this.http.post(this.apiUrl + '/homemaker',params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findAll(headers:any): Observable<any> {

    return this.http.get(this.apiUrl + '/homemaker', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }


  public findById(id:any, headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/homemaker/' + id, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public update(params: {}, id:any, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/homemaker/' + id, params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  // จะไปใช้ updatePassword ของ auth
  public updatePassword(params: {}, id:any, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/reset/password/' + id, params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public delete(id: any, headers:any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/homemaker/' + id,{
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

}
