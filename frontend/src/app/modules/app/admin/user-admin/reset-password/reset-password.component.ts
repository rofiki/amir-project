import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');
  public itemRef:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {

    // get Token
    console.log('id',this.id)
    const token: any = localStorage.getItem('token');
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
    }

    this.getData();

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

    // form แก้ไขข้อมูลส่วนตัว
    this.frm = this.fb.group({
      // firstname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      // lastname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      // email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password_confirm: this.fb.control(null, [Validators.required,])
    }
    , {
      validators: matchpassword
    }
  );

  }

  async getData(){

    const headers = this.getToken.access_token;

    if (this.id) {
      this.isProcess = true;
      let itemEdit = await lastValueFrom(this.auth.findById(this.id, headers));
      if (itemEdit) {
        this.itemRef = itemEdit.data;									
      }
      this.isProcess = false;
    }
  }

  onSave(){
    this.isProcess = true;
    let params = this.frm.value;
    params.id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) 
    {
      const headers = this.getToken.access_token;
      console.log(headers);
      this.auth.updatePassword(params,headers).subscribe( res =>{

        console.log(res)

        if(res.status){
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, }); 
          this.router.navigate([this.BASE_URL + '/admin/useradmin'], { relativeTo: this.activatedRoute });
        }
      });
      console.log (params)
    }

  }

}
