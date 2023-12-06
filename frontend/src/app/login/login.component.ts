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

  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.loginForm.value;

    this.auth.login(params).subscribe(res => {
      console.log('res', res);
      if (res.status) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('loginDate', res.loginDate);

        let user:any = jwtDecode(res.token);

        this.toastr.success('ยินดีต้อนรับ: '+ user.user.firstname, 'เข้าสู่ระบบสำเร็จ');
        this.router.navigate(['/admin']);
      } else {
        console.log('login failed');
      }
    });

  }

}
