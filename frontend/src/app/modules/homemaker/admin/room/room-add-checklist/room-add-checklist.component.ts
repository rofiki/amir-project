import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';
import { RoomAddChecklistService } from 'src/app/services/homemaker/room-add-checklist.service';

@Component({
  selector: 'app-room-add-checklist',
  templateUrl: './room-add-checklist.component.html',
  styleUrls: ['./room-add-checklist.component.css']
})
export class RoomAddChecklistComponent implements OnInit, OnDestroy {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public checklistRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private roomAddChecklistService: RoomAddChecklistService,
    private checklistService: ChecklistService,
    private fb: FormBuilder,
    public bsModalRef: BsModalRef

  ) { }

  ngOnInit(): void {

    this.formGroup();
    this.getData();
    this.getChecklist();

  }

  public roomId?: any;  // @input จาก room.component
  getData() {

    const token = this.auth.getToken();
    
    this.roomAddChecklistService.findById(this.roomId, token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(res => {
        this.itemRef = res;
      }, error => {
        console.log('error', error.status)
      });
  }

  formGroup() {
    this.frm = this.fb.group({
      checklist: this.fb.control('', [Validators.required]),
    });
  }

  async getChecklist() {

    const token = this.auth.getToken();

    this.checklistService.findAll(token)
      .pipe()
      .subscribe( r => {
        this.roomAddChecklistService.findById(this.roomId, token)
          .pipe(takeUntil(this.destroySubject))
          .subscribe(s => {
            // กรองเอารายชื่อที่เลือกแล้วออก
            for (let i = 0; i < r.data.length; i++) {
              s.data.forEach((dataS: any) => {
                if (r?.data[i]?.checklist_id == dataS.checklist_id) {
                  r.data[i] = null;
                }
              });
            }
          });

        this.checklistRef = r;

      });

  }

  delChecklist(id: any) {

    if (confirm('ยืนยันการลบข้อมูล!')) {

      this.isProcess = true;
      const token = this.auth.getToken();

      this.roomAddChecklistService.delete(id, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.formGroup();
            this.getChecklist();
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
    params.roomId = this.roomId; // @input จาก room.component

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess = true;
      const token = this.auth.getToken();

      this.roomAddChecklistService.create(params, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.isProcess = false;
            this.formGroup();
            this.getChecklist();
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
