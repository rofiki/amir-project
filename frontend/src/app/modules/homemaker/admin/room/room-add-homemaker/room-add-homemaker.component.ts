import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { RoomService } from 'src/app/services/homemaker/room.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';
import { PersonnelService } from 'src/app/services/app/personnel.service';

import { Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { RoomAddHomemakerService } from 'src/app/services/homemaker/room-add-homemaker.service';

@Component({
  selector: 'app-room-add-homemaker',
  templateUrl: './room-add-homemaker.component.html',
  styleUrls: ['./room-add-homemaker.component.css']
})
export class RoomAddHomemakerComponent implements OnInit {

  modalRef?: BsModalRef;

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public frm2!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public homeMakerRef: any;
  public personnelRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: RoomService,
    private homeMakerService: HomemakerService,
    private roomAddHomemakerService: RoomAddHomemakerService,
    private personnelService: PersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef

  ) { }

  ngOnInit(): void {

    this.formGroup();
    this.getData();
    this.getHomemaker();
  }

  formGroup()
  {
    this.frm = this.fb.group({
      homemaker: this.fb.control('', [Validators.required]),
      // roomId: this.fb.control(this.roomId),
    });
  }

  async getHomemaker() {
    const token = this.auth.getToken();
    this.homeMakerRef = await lastValueFrom(this.homeMakerService.findAll(token));
  }

  public  roomId?: any;
  getData() {
    const token = this.auth.getToken();
    this.roomAddHomemakerService.findById(this.roomId, token).subscribe(res => {
      this.itemRef = res;
      console.log('roomAddHomemaker Data',this.itemRef)
    }, error =>{
      console.log('error',error.status)
    });
  }

  delHomeMaker(id: any) {

    if (confirm('ยืนยันการลบข้อมูล!')) {
      this.isProcess = true;
      const token = this.auth.getToken();
      this.roomAddHomemakerService.delete(id, token).subscribe(res => {
        if(res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.getData();
          this.isProcess = false;
        }else{
          this.toastr.error('ผลการทำรายการ', 'ลบข้อมูลไม่สำเร็จ กรุณาติดต่อผู้ดูแลระบบ', { timeOut: 1500, progressBar: true, });
          this.isProcess = false;
        }
      });
    }
  }

  onSubmit() {
    
    let params = this.frm.value;
    params.roomId = this.roomId;

    if (confirm('ยืนยันการทำรายการ!')) {
      this.isProcess = true;
      const token = this.auth.getToken();
      this.roomAddHomemakerService.create(params, token).subscribe(res => {
        if (res.status) {
          this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
          this.isProcess = false;
          this.formGroup();
          this.getData();
        }
      });

    }
  }

}
