import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/app/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public BASE_URL:string = this.appService.BASE_URL;
  public componentDestroyed$: Subject<boolean> = new Subject()
  public isProcess: boolean = false;
  public loginForm!: FormGroup;

  constructor( 
    private appService:AppService,
    private auth: AuthService,
    private fb: FormBuilder,
    ){}
    
    ngOnInit(): void {

      this.loginForm = this.fb.group({
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [Validators.required]),
      });

    }

    onSubmit()
    {
      this.isProcess = true;
      let params = this.loginForm.value;

      this.auth.login(params).subscribe(res => {
        console.log('res',res);
        console.log('res2',res.headers.get('X-Custom-Header'));
      });

    }
    
}
