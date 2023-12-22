import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private apiUrl: string = this.dbService.getServiceURL() + '/province';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
  ) { }

  public findAll(): Observable<any> {
    return this.http.get(this.apiUrl + '', {
      headers: {
        'content-type': 'application/json',
      }
    });
  }

  public findById(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id, {
      headers: {
        'content-type': 'application/json',
      }
    });
  }

}
