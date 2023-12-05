import { Component } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public BASE_URL:string = this.appService.BASE_URL;

  constructor( private appService:AppService){}

}
