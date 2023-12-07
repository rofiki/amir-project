import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = this.dbService.getServiceURL() + '/login';
  private headers: any = {
    headers: new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ')
  }

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public login(params: {}): Observable<any> {
    return this.http.post(this.apiUrl, params, this.headers);
  }

  public isLoginToken() {

    let token: any = localStorage.getItem('token');

    if (token) {
      let tokenDecode: any = jwtDecode(token);
      let token_type = tokenDecode.token_type;

      return {
        token: token,
        user: tokenDecode.user,
        headers: token_type + ' ' + tokenDecode.access_token
      }
    } else {
      return null;
    }
    return null;
  }

  // public token(): Observable<any> {
  //   let token:any = localStorage.getItem('token');
  //   // jwtDecode(token);
  //   return token;
  // }

  public token = {
    test: 'test'
  }

  // public logout(params: {}): Observable<any> {
  // {
  //   return {}
  // }
}