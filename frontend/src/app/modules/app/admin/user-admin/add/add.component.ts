import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class UserAdminAddComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;

  public frm!: FormGroup;
  public getToken: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    // get Token
    const token: any = localStorage.getItem('token');
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
      console.log(this.getToken);
    }

    // เช็ค password confirmpassword เหมือนกันไหม
    const matchpassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

      let password = control.get('password');
      let confirmPassword = control.get('password_confirm');

      if (password && confirmPassword && password?.value != confirmPassword?.value) {
        return {
          passwordMatchError: true,
        }
      }

      return null;
    }

    this.frm = this.fb.group({
      firstname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      lastname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password_confirm: this.fb.control(null, [Validators.required,])
    }
      , {
        validators: matchpassword
      }
    );

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;
    
    if (confirm('ยืนยันการทำรายการ!')) 
    {
      const headers = this.getToken.access_token;
      this.auth.registerAdmin(params,headers).subscribe( res =>{
        console.log(res)
        if(res.status){
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, }); 
          this.router.navigate([this.BASE_URL + '/admin/admin'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }

}
