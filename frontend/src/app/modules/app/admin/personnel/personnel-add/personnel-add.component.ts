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
import { ProvinceService } from 'src/app/services/province.service';


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
  public provinceRef: any;
  public amphurRef: any;
  public activeRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: PersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,

    private localeService: BsLocaleService,

    private prenameService: PrenameService,
    private provinceService: ProvinceService

  ) { }

  ngOnInit(): void {

    this.localeService.use('th');

    this.getPrename();
    this.getProvince();

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
      // gendar: this.fb.control('', [Validators.required]), //เพศ เลือกจากคำนำหน้า
      idcard: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(13)]),
      active: this.fb.control('Active', []),
      date_of_birth: this.fb.control('', []),
      jobPosition: this.fb.control('', [Validators.required]),

      // ชุดนี้ต้องแยกตารางทีหลัง เพราะสามารถมีที่อยู่ได้มากกว่า 1
      address: this.fb.control('', []),
      province: this.fb.control('', [Validators.required]),
      amphur: this.fb.control('', [Validators.required]),
      postCode: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(5)]),
      phone: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),

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

    let params = this.frm.value;
    params.personnel_code = null; // รหัสพนักงาน ทำตั้งไว้เผื่อต้องทำ
    params.date_of_birth = this.datePipe.transform(params.date_of_birth, 'yyyy-MM-dd hh:mm:ss') ?? null;

    if (params.prename == 1) {
      params.gendar = 1
    } else {
      params.gendar = 2;
    }

    if (confirm('ยืนยันการทำรายการ!')) {
      this.isProcess = true;

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

  async getProvince() {

    this.amphurRef = ''
    this.provinceRef = await lastValueFrom(this.provinceService.findAll());
    console.log(this.provinceRef)
    console.log(this.amphurRef)
  }

  async getPrename() {
    this.prenameRef = await lastValueFrom(this.prenameService.findAll());
  }

  getActive() {
    this.activeRef = [{ id: 'Active', name: 'Active' }, { id: 'Deactive', name: 'Deactive' }];
  }

  _change(id: any) {
    this.provinceService.findById(id).subscribe(res => {
      this.amphurRef = res;
    })
  }

}
