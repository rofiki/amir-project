import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RoomService } from 'src/app/services/homemaker/room.service';
import { RoomtypeService } from 'src/app/services/homemaker/roomtype.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public roomTypeRef: any;
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');


  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: RoomService,
    private roomTypeService: RoomtypeService,
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

    this.getRoomType();
    this.getData();

    this.frm = this.fb.group({
      typeId: this.fb.control('', [Validators.required]),
      name: this.fb.control('', [Validators.required]),
      builder: this.fb.control('', []),
      floor: this.fb.control('', [Validators.pattern("^[0-9]*$")]),
      location: this.fb.control('', []),
      desc: this.fb.control('', []),
    });

  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;

    params.id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.getToken.access_token;
      this.service.update(params, this.id, headers).subscribe(res => {

        if (res.status) {
          this.isProcess = false;
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/homemaker/admin/room'], { relativeTo: this.activatedRoute });
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
        console.log(this.itemRef)
      }
      this.isProcess = false;
    }
  }

  async getRoomType() {
    const headers = this.getToken.access_token;
    this.roomTypeRef = await lastValueFrom(this.roomTypeService.findAll(headers));
  }

}
