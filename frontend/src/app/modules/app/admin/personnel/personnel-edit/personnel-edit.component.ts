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
  selector: 'app-personnel-edit',
  templateUrl: './personnel-edit.component.html',
  styleUrls: ['./personnel-edit.component.css']
})
export class PersonnelEditComponent implements OnInit {

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

    console.log('getToken', this.auth.getToken());
    console.log('getRole', this.auth.getRole());
    console.log('getUser', this.auth.getUser());

    this.getPrename();

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

      email: this.fb.control('', [Validators.required, Validators.email]),
    }
    );
  }

  async getPrename() {
    this.prenameRef = await lastValueFrom(this.prenameService.findAll());
  }

  onSubmit() {

  }

}
