import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DbService } from '../db.service';
import { Observable } from 'rxjs';

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
  ) {}

  public login(params: {}): Observable<any> {
    return this.http.post(this.apiUrl, params, this.headers);
  }

  // public logout(params: {}): Observable<any> {
  // {
  //   return {}
  // }
}