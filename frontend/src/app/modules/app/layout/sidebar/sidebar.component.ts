import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public getToken: any;


  constructor(private appService: AppService){}

  ngOnInit(): void {
        // get Token
        const token: any = localStorage.getItem('token');
        if (!token) {
        } else {
          this.getToken = jwtDecode(token);
        }
  }

}
