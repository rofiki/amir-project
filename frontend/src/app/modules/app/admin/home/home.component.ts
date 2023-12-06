import {  Component, } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public BASE_URL: string = this.appService.BASE_URL;

  constructor(private appService: AppService,){}

}
