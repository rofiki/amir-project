import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { PrenameService } from 'src/app/services/homemaker/prename.service';
import { PersonnelService } from 'src/app/services/app/personnel.service';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-personnel-add',
  templateUrl: './personnel-add.component.html',
  styleUrls: ['./personnel-add.component.css']
})
export class PersonnelAddComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

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
    private prenameService: PrenameService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,

    private localeService: BsLocaleService,

  ) { }

  ngOnInit(): void {

    this.localeService.use('th');

    this.getPrename();

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
      // gendar: this.fb.control('', [Validators.required]), //เพศ เลือกจากคำนำหน้า
      idcard: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(13)]),
      phone: this.fb.control('', [Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
      active: this.fb.control('Active', []),
      date_of_birth: this.fb.control('', []),
      jobPosition: this.fb.control('', [Validators.required]),

      // ส่วน user
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password_confirm: this.fb.control(null, [Validators.required,]),
    }
      , {
        validators: matchpassword
      }
    );

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;
    params.personnel_code = null; // รหัสพนักงาน ทำตั้งไว้เผื่อต้องทำ
    params.date_of_birth = this.datePipe.transform(params.date_of_birth, 'yyyy-MM-dd hh:mm:ss') ?? null;

    if (params.prename == 1) {
      params.gendar = 1
    } else {
      params.gendar = 2;
    }

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.auth.getToken();
      this.service.create(params, headers).subscribe(res => {
        // console.log(res)
        if (res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.isProcess = false;
          this.router.navigate([this.BASE_URL + '/admin/personnel'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }

  async getPrename() {
    this.prenameRef = await lastValueFrom(this.prenameService.findAll());
  }

}
