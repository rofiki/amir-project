import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';

import { jwtDecode } from 'jwt-decode';
import { RoomtypeService } from 'src/app/services/homemaker/roomtype.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadData: boolean = false;
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');

  public frm!: FormGroup;
  public getToken: any;
  public itemRef:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: RoomtypeService,
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

    this.getData();

    this.frm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      desc: this.fb.control(''),
    });

  }

  async getData() {

    const headers = this.getToken.access_token;

    if (this.id) {
      this.isProcess = true;
      let itemEdit = await lastValueFrom(this.service.findById(this.id, headers));
      if (itemEdit) {
        this.itemRef = itemEdit.data;
        console.log(this.itemRef)
      }
      this.isProcess = false;
    }
  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;
    params.id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) 
    {
      const headers = this.getToken.access_token;
      this.service.update(params,headers).subscribe( res =>{

        if(res.status){
          this.isProcess = false;
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, }); 
          this.router.navigate([this.BASE_URL + '/homemaker/admin/roomtype'], { relativeTo: this.activatedRoute });
        }
      });
    }
  }

}
