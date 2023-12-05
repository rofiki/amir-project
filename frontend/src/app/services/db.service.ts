import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private path = environment.API_URL

  constructor() {  }


  public getServiceURL () : any {
    return this.path;
  }

}
