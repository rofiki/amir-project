import { Component, Inject, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/app/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public xtoggle:boolean = true;
  public BASE_URL: string = this.appService.BASE_URL;

  public getToken: any;

  constructor(
    private appService: AppService, 
    private auth: AuthService,
    @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,
    ){}

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');
    this.getToken = jwtDecode(token);


  }

  toggle(){
    this.xtoggle = this.xtoggle ? false : true;
    if(this.xtoggle){
      this.renderer.removeClass(this.document.body, 'sb-sidenav-toggled');
    }
  
    if(!this.xtoggle){
      this.renderer.addClass(this.document.body, 'sb-sidenav-toggled');
    }
    
  }
}
