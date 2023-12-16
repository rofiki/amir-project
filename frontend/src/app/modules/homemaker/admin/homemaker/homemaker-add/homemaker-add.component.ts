import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { PrenameService } from 'src/app/services/homemaker/prename.service';

@Component({
  selector: 'app-homemaker-add',
  templateUrl: './homemaker-add.component.html',
  styleUrls: ['./homemaker-add.component.css']
})
export class HomemakerAddComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public prenameRef:any;
  public gendarRef:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: HomemakerService,
    private prenameService: PrenameService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    // get token
    const token: any = localStorage.getItem('token');
    // check token
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
      // console.log(this.getToken);
    }

    this.getPrename();
    this.getGendar();

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
      prename: this.fb.control('', [Validators.required]),
      fname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      lname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      nname: this.fb.control('', []),
      address: this.fb.control('', []),
      gendar: this.fb.control('', [Validators.required]),
      idcard: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(13)]),
      lineId: this.fb.control('', []),
      phone: this.fb.control('', [Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password_confirm: this.fb.control(null, [Validators.required,]),
      active: this.fb.control('Active', []),
    }
      , {
        validators: matchpassword
      }
    );

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.getToken.access_token;
      console.log(params);
      console.log('headers',headers)
      this.service.create(params, headers).subscribe(res => {
        // console.log(res)
        if (res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.isProcess = false;
          this.router.navigate([this.BASE_URL + '/homemaker/admin/homemaker'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }

  async getPrename() {
    this.prenameRef = await lastValueFrom(this.prenameService.findAll());
  }

  getGendar() {
    this.gendarRef = [{id:1,name:"ชาย"},{id:2,name:"หญิง"}]
  }

}
