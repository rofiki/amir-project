import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { RoomService } from 'src/app/services/homemaker/room.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';

import { RoomAddHomemakerService } from 'src/app/services/homemaker/room-add-homemaker.service';

@Component({
  selector: 'app-room-add-homemaker',
  templateUrl: './room-add-homemaker.component.html',
  styleUrls: ['./room-add-homemaker.component.css']
})
export class RoomAddHomemakerComponent implements OnInit, OnDestroy {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว
  public roomId?: any;

  public frm!: FormGroup;
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
    private fb: FormBuilder,
    // private modalService: BsModalService,
    public bsModalRef: BsModalRef

  ) { }

  ngOnInit(): void {

    this.loadingData = true;
    this.formGroup();
    this.getData();
    this.getHomemaker();
  }

  formGroup() {
    this.frm = this.fb.group({
      homemaker: this.fb.control('', [Validators.required]),
      // roomId: this.fb.control(this.roomId),
    });
  }

  async getHomemaker() {
    const token = this.auth.getToken();
    this.homeMakerService.findAll(token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(r => {

        this.roomAddHomemakerService.findById(this.roomId, token)
          .pipe(takeUntil(this.destroySubject))
          .subscribe(s => {

            // กรองเอารายชื่อที่เป็นแม่บ้านแล้ว ออก
            for (let i = 0; i < r.data.length; i++) {
              s.data.forEach((dataS: any) => {
                if (r?.data[i]?.id == dataS.homemaker_id) {
                  r.data[i] = null;
                }
              });
            }
          });

        this.homeMakerRef = r;
      });
  }

  getData() {
    const token = this.auth.getToken();
    this.roomAddHomemakerService.findById(this.roomId, token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(res => {
        this.itemRef = res;
      }, error => {
        console.log('error', error.status)
      });
  }

  delHomeMaker(id: any) {

    if (confirm('ยืนยันการลบข้อมูล!')) {
      this.isProcess = true;
      const token = this.auth.getToken();
      this.roomAddHomemakerService.delete(id, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {
          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.getHomemaker();
            this.formGroup();
            this.getData();
            this.isProcess = false;
          } else {
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
      this.roomAddHomemakerService.create(params, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {
          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.isProcess = false;
            this.getHomemaker();
            this.formGroup();
            this.getData();
          }
        });

    }
  }

  dropdown() {
    console.log('dropdown', this.itemRef)
  }

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
