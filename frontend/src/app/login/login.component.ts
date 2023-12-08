import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/app/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public componentDestroyed$: Subject<boolean> = new Subject()
  public isProcess: boolean = false;
  public loginForm!: FormGroup;

  constructor(
    private appService: AppService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,

    private toastr: ToastrService
  ) { }

  ngOnInit():void {
    console.log(localStorage.getItem('token'))
    this.checkIsLogin();
    // const token: any = localStorage.getItem('token');
    // this.getToken = jwtDecode(token);
    // console.log('token', token)
    // if (token) {
    //   this.gettoken = jwtDecode('kk');
    //   console.log(this.gettoken);
    // }

    // this.auth.tokenDecode();

    // console.log(this.auth.token)
    // if(this.auth.tokenDecode()){
    //   this.auth.tokenDecode()?.jti;
    //   console.log('sss')
    // // แสดงหน้า html
    // this.user = this.auth.decodeToken;
    // console.log('getUser',this.user)
    // // this.loginDate = this.auth.getLoginDate();
    // // this.role = this.auth.getRole();
    // }


    //form login
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.loginForm.value;

    this.auth.login(params).subscribe(res => {

      if (res.status) {

        localStorage.setItem('token', res.token);
        localStorage.setItem('loginDate', res.loginDate);

        let user: any = jwtDecode(res.token);

        this.toastr.success('ยินดีต้อนรับ: ' + user.user.firstname, 'เข้าสู่ระบบสำเร็จ', { timeOut: 1500, progressBar: true, });

        setTimeout(() => {
          window.location.href = this.BASE_URL + 'admin';
          this.isProcess = false;
        }, 1500);

      } else {
        console.log('login failed');
      }
    }, error => {
      this.isProcess = false;
      if (error.status === 401) {
        console.log('error', error);
        this.toastr.error('Email หรือ Password ของคุณไม่ถูกต้อง', 'เข้าสู่ระบบไม่สำเร็จ', { timeOut: 1500, progressBar: true, });
        this.loginForm.reset();
      }

    });

  }

  logout()
  {
    if(confirm('ยืนยันออกจากระบบ!')){

      localStorage.removeItem("token");
      localStorage.removeItem("loginDate");
      this.toastr.warning('ออกจากระบบ', 'คุณได้ออกจากระบบเรียบร้อย', { timeOut: 1500, progressBar: true, });

      setTimeout(() => {
        window.location.reload();
        this.isProcess = false;
      }, 1500);      
    }

  }

  checkIsLogin()
  {
    if(localStorage.getItem('token'))
    {
      window.location.href = this.BASE_URL + '/logout';
    }
  }

}
