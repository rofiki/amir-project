import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';

import { jwtDecode } from 'jwt-decode';
import { DepartmentService } from 'src/app/services/app/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public itemRef:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: DepartmentService,
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

    this.frm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      dep_main: this.fb.control(''),
    });

    this.getData();
  }

  async getData() {

    this.loadingData = true;
    const token = this.getToken.access_token;
    this.service.findAll(token).subscribe( r => {
      this.itemRef = r;
      this.loadingData = false;
      console.log(this.itemRef)
    });
    // this.itemRef = await lastValueFrom(this.service.findAll(token));
    // console.log(this.itemRef)
  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.getToken.access_token;
      // console.log('headers',headers)
      this.service.create(params, headers).subscribe(res => {
        console.log(res)
        if (res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.getData();
          this.isProcess = false;
          this.frm.reset();
        }
      });

    }
  }

  del(id:any) {
    if (confirm('ยืนยันการลบข้อมูล!')) {
      const headers = this.getToken.access_token;
      // console.log('headers',headers)
      this.service.delete(id, headers).subscribe(res => {
        console.log(res)
        if (res.status) {
          this.toastr.success('ลบข้อมูล', 'ลบข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.getData();
        }
      });

    }
  }

}
