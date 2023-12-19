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
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css']
})
export class RoomAddComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public roomTypeRef: any;

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

    if (confirm('ยืนยันการทำรายการ!')) {
      const headers = this.getToken.access_token;
      this.service.create(params, headers).subscribe(res => {
        // console.log(res)
        if (res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.isProcess = false;
          this.router.navigate([this.BASE_URL + '/homemaker/admin/room'], { relativeTo: this.activatedRoute });
        }
      });

    }
  }

  async getRoomType() {
    const headers = this.getToken.access_token;
    this.roomTypeRef = await lastValueFrom(this.roomTypeService.findAll(headers));
    console.log('room',this.roomTypeRef)
  }

}
