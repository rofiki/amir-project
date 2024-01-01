import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PersonnelService } from 'src/app/services/app/personnel.service';
import { RoomAddPersonnelService } from 'src/app/services/homemaker/room-add-personnel.service';

@Component({
  selector: 'app-room-add-personnel',
  templateUrl: './room-add-personnel.component.html',
  styleUrls: ['./room-add-personnel.component.css']
})
export class RoomAddPersonnelComponent implements OnInit, OnDestroy {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public homeMakerRef: any;
  public personnelRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private roomAddPersonnelService: RoomAddPersonnelService,
    private personnelService: PersonnelService,
    private fb: FormBuilder,
    public bsModalRef: BsModalRef

  ) { }

  ngOnInit(): void {

    this.formGroup();
    this.getData();
    this.getPersonnel();

  }

  public roomId?: any;
  getData() {

    const token = this.auth.getToken();
    
    this.roomAddPersonnelService.findById(this.roomId, token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(res => {
        this.itemRef = res;
      }, error => {
        console.log('error', error.status)
      });
  }

  formGroup() {
    this.frm = this.fb.group({
      personnel: this.fb.control('', [Validators.required]),
    });
  }

  async getPersonnel() {

    const token = this.auth.getToken();

    this.personnelService.findAll(token)
      .pipe()
      .subscribe( r => {

        this.roomAddPersonnelService.findById(this.roomId, token)
          .pipe(takeUntil(this.destroySubject))
          .subscribe(s => {

            // กรองเอารายชื่อที่เป็นแม่บ้านแล้ว ออก
            for (let i = 0; i < r.data.length; i++) {
              s.data.forEach((dataS: any) => {
                if (r?.data[i]?.id == dataS.personnel_id) {
                  r.data[i] = null;
                }
              });
            }
          });

        this.personnelRef = r;

      });

  }

  delPersonnel(id: any) {

    if (confirm('ยืนยันการลบข้อมูล!')) {

      this.isProcess = true;
      const token = this.auth.getToken();

      this.roomAddPersonnelService.delete(id, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.formGroup();
            this.getPersonnel();
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

      this.roomAddPersonnelService.create(params, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.isProcess = false;
            this.formGroup();
            this.getPersonnel();
            this.getData();
          }

        });

    }
  }

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
