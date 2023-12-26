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

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

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
    private personnelService: PersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {

    // this.frm = this.fb.group({
    //   homemaker: this.fb.control('', [Validators.required]),
    // });

    // this.frm2 = this.fb.group({
    //   personnel: this.fb.control('', [Validators.required]),
    // });

    this.getData();
    // this.getPersonnel();
  }

  async getData() {

    this.loadingData = true;
    const token = this.auth.getToken();
    this.service.findAll(token).subscribe(r => {
      this.itemRef = r;
      this.loadingData = false;
      // console.log(this.itemRef)
    });

  }

  del(id: any) { }

  openModalHomeMaker(roomId:any) {
    const initialState: ModalOptions = { initialState: { roomId: roomId,}};
    this.modalRef = this.modalService.show(RoomAddHomemakerComponent, initialState);
    this.modalRef.setClass('modal-lg');
  }

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
