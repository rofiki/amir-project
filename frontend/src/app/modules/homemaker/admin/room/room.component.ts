import { Component, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { jwtDecode } from 'jwt-decode';
import { RoomService } from 'src/app/services/homemaker/room.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';
import { PersonnelService } from 'src/app/services/app/personnel.service';
import { RoomAddHomemakerComponent } from './room-add-homemaker/room-add-homemaker.component';

import { combineLatest, Subscription, lastValueFrom, take, takeUntil, Subject } from 'rxjs';
import { RoomAddHomemakerService } from 'src/app/services/homemaker/room-add-homemaker.service';
import { RoomAddPersonnelComponent } from './room-add-personnel/room-add-personnel.component';
import { RoomAddPersonnelService } from 'src/app/services/homemaker/room-add-personnel.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  modalRef?: BsModalRef;
  subscriptions = new Subscription(); // modal
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public frm2!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public roomAddHomemakerRef: any;
  public roomAddHomemakerRefTest: any;
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
    private roomAddPersonnelService:RoomAddPersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {

    this.getData();
    // this.getPersonnel();
  }

  // ดึงข้อมูลห้อง
  async getData() {

    this.loadingData = true;
    const token = this.auth.getToken();
    this.service.findAll(token)
    .pipe(takeUntil(this.destroySubject))
    .subscribe(r => {
      this.itemRef = r;

      const fromDb = undefined;
      const arr:any = fromDb || [];

      this.itemRef.data.forEach((data:any) => {
        
        this.roomAddHomemakerService.findById(data.roomId, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(roomAddHomemaker => {
          data.homemaker = roomAddHomemaker.data;
        });

        this.roomAddPersonnelService.findById(data.roomId, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(roomAddPersonnel => {
          data.personnel = roomAddPersonnel.data;
        });

      });
      this.loadingData = false;
    });

  }

  del(id: any) { }

  // ##### modal แม่บ้าน
  openModalHomeMaker(roomId: any) {
    const initialState: ModalOptions = { initialState: { roomId: roomId, } };
    this.modalRef = this.modalService.show(RoomAddHomemakerComponent, initialState);
    this.modalRef.setClass('modal-lg');

    this.subscriptions.add(
      this.modalService.onHide.subscribe((reason: string | any) => {
        this.getData();
      })
    );
  }

    // ##### modal ผู้ดูแล
  openModalPersonnel(roomId:any) {
    const initialState: ModalOptions = { initialState: { roomId: roomId, } };
    this.modalRef = this.modalService.show(RoomAddPersonnelComponent, initialState);
    this.modalRef.setClass('modal-lg');

    this.subscriptions.add(
      this.modalService.onHide.subscribe((reason: string | any) => {
        this.getData();
      })
    );  }

  // ##### modal check list
  openModalChecklist(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
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

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
  }
  

}
