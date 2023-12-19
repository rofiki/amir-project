import { Component, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/app/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public xtoggle: boolean = true;
  public BASE_URL: string = this.appService.BASE_URL;

  public getToken: any;

  constructor(
    private appService: AppService, @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {

    this.auth.checkToken();
    let token: any = this.auth.getToken();
    let getRole: any = this.auth.getRole();
    let getUser: any = this.auth.getUser();

    console.log(getRole);

    let aaa:any = localStorage.getItem('token')
    console.log(jwtDecode(aaa))
    // const token: any = localStorage.getItem('token');
    // if (!token) {
    //   window.location.href = this.BASE_URL + '/login';
    // } else {
      
    // }

  }

}
