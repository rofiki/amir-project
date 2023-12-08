import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = this.dbService.getServiceURL();

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }


  public login(params: {}): Observable<any> {
    return this.http.post(this.apiUrl + '/login', params, {
      headers: {
        'content-type': 'application/json'
      }
    });
  }


  public logout(headers: any): Observable<any> {
    return this.http.delete(this.apiUrl + '/logout', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }
}