import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/app/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;

  public user: any;
  public loginDate: any = localStorage.getItem('loginDate');
  public role: any;

  public getToken: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
    }

  }

  logout() {
    if (confirm('ยืนยันออกจากระบบ!')) {

      const headers = this.getToken.access_token;

      this.isProcess = true;

      this.auth.logout(headers).subscribe(res => {

        if (res.status) 
        {
          localStorage.removeItem("token");
          localStorage.removeItem("loginDate");
          this.toastr.warning('ออกจากระบบ', 'คุณได้ออกจากระบบเรียบร้อย', { timeOut: 1000, progressBar: true, });

          setTimeout(() => {
            //   // window.location.href = this.BASE_URL + 'login';  
          }, 1000);
        }

      });
    }

  }

}
