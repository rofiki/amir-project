import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { PersonnelService } from 'src/app/services/app/personnel.service';

@Component({
  selector: 'app-personnel-reset-password',
  templateUrl: './personnel-reset-password.component.html',
  styleUrls: ['./personnel-reset-password.component.css']
})
export class PersonnelResetPasswordComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public prenameRef: any;
  public gendarRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: PersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

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
      password: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password_confirm: this.fb.control(null, [Validators.required,])
    }
    , {
      validators: matchpassword
    }
    );

  }

  async getData() {

    const headers = this.auth.getToken();

    if (this.id) {
      this.isProcess = true;
      let itemEdit = await lastValueFrom(this.service.findById(this.id, headers));
      if (itemEdit) {
        this.itemRef = itemEdit.data;
      }
      this.isProcess = false;
    }
  }

  async onSubmit(){

    const headers = this.auth.getToken();

    let params = this.frm.value;
    let item = await lastValueFrom(this.service.findById(this.id, headers));
    let uid = item.data.user_id;

    console.log(uid)
    if (confirm('ยืนยันการทำรายการ!')) 
    {
      this.isProcess = true;
      params.id = uid;
      this.service.updatePassword(params,uid,headers).subscribe( res =>{

        this.isProcess = false;
        if(res.status){
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, }); 
          this.router.navigate([this.BASE_URL + '/admin/personnel'], { relativeTo: this.activatedRoute });
        }
      });
    }
  }

}
