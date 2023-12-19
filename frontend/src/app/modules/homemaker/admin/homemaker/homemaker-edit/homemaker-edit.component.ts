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
  selector: 'app-homemaker-edit',
  templateUrl: './homemaker-edit.component.html',
  styleUrls: ['./homemaker-edit.component.css']
})
export class HomemakerEditComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingDel: boolean = false;
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
    }

    this.getPrename();
    this.getData();

    this.frm = this.fb.group({
      prename: this.fb.control('', [Validators.required]),
      fname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      lname: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Zก-๙ \-\']+')]),
      nname: this.fb.control('', []),
      address: this.fb.control('', []),
      // gendar: this.fb.control('', [Validators.required]),
      idcard: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(13)]),
      lineId: this.fb.control('', []),
      phone: this.fb.control('', [Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      active: this.fb.control('Active', []),
    }
    );

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;

    if (params.prename == 1) {
      params.gendar = 1
    } else {
      params.gendar = 2;
    }

    params.id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.getToken.access_token;
      this.service.update(params, this.id, headers).subscribe(res => {

        if (res.status) {
          this.isProcess = false;
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/homemaker/admin/homemaker'], { relativeTo: this.activatedRoute });
        }
      });
    }
  }

  del(id: any) {

    if (confirm('ยืนยันการทำรายการ!')) {
      this.loadingDel = true;
      const headers = this.getToken.access_token;
      this.service.delete(id, headers).subscribe(res => {

        if (res.status) {
          this.loadingDel = false;
          this.toastr.success('บันทึกข้อมูล', 'ลบข้อมูลสำเร็จ', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/homemaker/admin/homemaker'], { relativeTo: this.activatedRoute });
        }
      });
    }
  }

  async getData() {

    const headers = this.getToken.access_token;

    if (this.id) {
      this.isProcess = true;
      let itemEdit = await lastValueFrom(this.service.findById(this.id, headers));
      if (itemEdit) {
        this.itemRef = itemEdit.data;
      }
      this.isProcess = false;
    }
  }

  async getPrename() {
    this.prenameRef = await lastValueFrom(this.prenameService.findAll());
  }
}
