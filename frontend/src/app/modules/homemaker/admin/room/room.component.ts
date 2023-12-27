import { Component, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RoomService } from 'src/app/services/homemaker/room.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';
import { PersonnelService } from 'src/app/services/app/personnel.service';
import { RoomAddHomemakerComponent } from './room-add-homemaker/room-add-homemaker.component';

import { combineLatest, Subscription } from 'rxjs';
import { RoomAddHomemakerService } from 'src/app/services/homemaker/room-add-homemaker.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  modalRef?: BsModalRef;
  subscriptions = new Subscription();

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
    private personnelService: PersonnelService,
    private roomAddHomemakerService: RoomAddHomemakerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {

    this.getData();
    // this.getRoomAddHomemakerData();
    // this.getPersonnel();
  }

  // ดึงข้อมูลห้อง
  async getData() {

    this.loadingData = true;
    const token = this.auth.getToken();
    this.service.findAll(token).subscribe(r => {
      this.itemRef = r;
      console.log('itemRef',this.itemRef.data)

      const fromDb = undefined;
      const arr:any = fromDb || [];
      let i=0;
      this.itemRef.data.forEach((data:any, index:any) => {
        let homemaker = lastValueFrom(this.roomAddHomemakerService.findById(1, token));

        data.homemaker = homemaker;
        arr[i] = data;
        i++;
      });
      console.log('arr',arr);

      // let a:any;
      // let b: any;
      // a = this.itemRef.data;
      // let i=0;
      // a.forEach(function(data:any, index:any) {
      //   b[0] = {ss:'55555'
      //   };
      //   console.log(i);
      //   i++;
      // });

      // this.itemRef.data.homemaker = lastValueFrom(this.homeMakerService.findById(this.itemRef, token));
      this.loadingData = false;
      // this.homeMakerRef
    });

  }

  del(id: any) { }

  // ##### function แม่บ้าน
  openModalHomeMaker(roomId: any) {
    const initialState: ModalOptions = { initialState: { roomId: roomId, } };
    this.modalRef = this.modalService.show(RoomAddHomemakerComponent, initialState);
    this.modalRef.setClass('modal-lg');

    this.subscriptions.add(
      this.modalService.onHide.subscribe((reason: string | any) => {
        console.log('reason');
        // if (typeof reason !== 'string') {
        //   reason = `onHide(), modalId is : ${reason.id}`;
        // }
        // const _reason = reason ? `, dismissed by ${reason}` : '';
        // this.messages.push(`onHide event has been fired${_reason}`);
      })
    );
  }
  // getHomeMakerData(roomId: any) {
  //   const token = this.auth.getToken();
  //   // let getData = lastValueFrom(this.homeMakerService.findById(roomId, token));
  //   // this.homeMakerRef = lastValueFrom(this.homeMakerService.findById(roomId, token));
  //   return roomId;
  // }

  // getRoomAddHomemakerData() {
  //   const token = this.auth.getToken();
  //   this.roomAddHomemakerService.findById(1, token).subscribe(res => {
  //     this.itemRef = res;
  //     console.log('roomAddHomemaker Data',this.itemRef.data)
  //   }, error =>{
  //     console.log('error',error.status)
  //   });
  // }

  openModalPersonnel(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }

  openModalChecklist(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }

  delPersonnel(id: any) {
    if (confirm('ยืนยันการทำรายการ!')) {
      console.log(id)
    }
  }

  delChecklist(id: any) {
    if (confirm('ยืนยันการทำรายการ!')) {
      console.log(id)
    }
  }



  // async getPersonnel() {
  //   const token = this.auth.getToken();
  //   this.personnelRef = await lastValueFrom(this.personnelService.findAll(token));
  //   console.log('personnel', this.personnelRef)
  // }

}
