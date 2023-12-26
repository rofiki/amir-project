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

  // @Input() title:string = 'test room-add-homemaker';
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

  public overlay = false;
  // public value1 = 'CA';
  public data1: any = [
    {
      label: 'AAAAA',
      options: [
        { value: 'AK', label: 'Alaska' },
        { value: 'AK222', label: 'Alaska222' }
      ],
    }
  ]

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


  title?: string;
  closeBtnName?: string;
  list: string[] = [];
  roomId?: any;



  ngOnInit(): void {

    this.formGroup();
    this.getData();
    this.getHomemaker();
  }

  async getHomemaker() {
    const token = this.auth.getToken();
    this.homeMakerRef = await lastValueFrom(this.homeMakerService.findAll(token));
  }

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
    if (confirm('ยืนยันการทำรายการ!')) {
      console.log(id)
    }
  }

  // onSubmit(id:any){

  // }
  formGroup()
  {
    this.frm = this.fb.group({
      homemaker: this.fb.control('', [Validators.required]),
      // roomId: this.fb.control(this.roomId),
    });
  }

  onSubmit() {
    this.isProcess = true;
    let params = this.frm.value;
    params.roomId = this.roomId;

    if (confirm('ยืนยันการทำรายการ!')) {
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

  // change(key: string, event: Event) {
  //   console.log(key, event);
  // }
  // search(text: string) {
  //   this.data1 = text
  //       ? (JSON.parse(JSON.stringify(this.data1)) as Select2Option[]).filter(
  //             option => option.label.toLowerCase().indexOf(text.toLowerCase()) > -1,
  //         )
  //       : JSON.parse(JSON.stringify(this.data1));
  // }
  // update(key: string, event: Select2UpdateEvent<any>) {
  //   console.log(event.value);
  // }
  // value1 = 'CA';

}
