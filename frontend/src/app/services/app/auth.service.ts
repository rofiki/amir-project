import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // public tokenDecode:any;

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
    return this.http.delete(this.apiUrl + '/auth/logout', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  // private decode()
  // {
  //   const token: any = localStorage.getItem('token');
  //   if (!token) {
  //     return null;
  //   } else {
  //     return jwtDecode(token);
  //   }
  // }





// ##############################################################
  //Admin
  public loginAdmin(params: {}): Observable<any> {
    return this.http.post(this.apiUrl + '/loginadmin', params, {
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  public registerAdmin(params: {}, headers:any): Observable<any> {
    return this.http.post(this.apiUrl + '/admin/register', params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findAll(headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/admin', {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public findById(id:any, headers:any): Observable<any> {
    return this.http.get(this.apiUrl + '/admin/' + id, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public update(params: {}, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/admin', params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }

  public updatePassword(params: {}, headers:any): Observable<any> {
    return this.http.put(this.apiUrl + '/auth', params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + headers
      }
    });
  }
}
