import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-personnel-edit',
  templateUrl: './personnel-edit.component.html',
  styleUrls: ['./personnel-edit.component.css']
})
export class PersonnelEditComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingDel: boolean = false;
  public loadingPage: boolean = true;
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');

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

      address: this.fb.control('', []),
      province: this.fb.control('', [Validators.required]),
      amphur: this.fb.control('', [Validators.required]),
      postCode: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(5)]),
      phone: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),

      email: this.fb.control('', [Validators.required, Validators.email]),
    });

    this.getData();
    this.getActive();



  }

  async getData() {

    const headers = this.auth.getToken();

    if (this.id) {

      this.isProcess = true;
      let itemEdit = await lastValueFrom(this.service.findById(this.id, headers));

      if (itemEdit) {

        this.itemRef = itemEdit.data;
        this.provinceRef = await lastValueFrom(this.provinceService.findAll());
        this.getPrename();

        // แปลงรูปแบบวันที่
        if (this.itemRef.date_of_birth) {
          this.frm.patchValue({
            date_of_birth: new Date(this.itemRef.date_of_birth),
          });
        }

        this.isProcess = false;
      }


    }
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

  onSubmit() {
    
    let params = this.frm.value;
    params.personnel_code = null; // รหัสพนักงาน ทำตั้งไว้เผื่อต้องทำ
    params.date_of_birth = this.datePipe.transform(params.date_of_birth, 'yyyy-MM-dd hh:mm:ss') ?? null;
    params.id = this.id;

    if (params.prename == 1) {
      params.gendar = 1
    } else {
      params.gendar = 2;
    }

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess = true;
      const headers = this.auth.getToken();
      this.service.update(params, this.id, headers).subscribe(res => {

        if (res.status) {
          this.isProcess = false;
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/admin/personnel'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }

  del(id: any) {

    if (confirm('ยืนยันการทำรายการ!')) {

      this.loadingDel = true;
      const headers = this.auth.getToken();

      this.service.delete(id, headers).subscribe(res => {
        if (res.status) {
          this.loadingDel = false;
          this.toastr.success('บันทึกข้อมูล', 'ลบข้อมูลสำเร็จ', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/admin/personnel'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }


}


