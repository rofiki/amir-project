import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, lastValueFrom, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistSubService } from 'src/app/services/homemaker/checklist-sub.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';

@Component({
  selector: 'app-checklist-edit',
  templateUrl: './checklist-edit.component.html',
  styleUrls: ['./checklist-edit.component.css']
})
export class ChecklistEditComponent implements OnInit, OnDestroy {

  modalRef?: BsModalRef;
  subscriptions = new Subscription(); // modal

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public isProcess2: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว
  public id: any = this.activatedRoute.snapshot.paramMap.get('id');

  public frm!: FormGroup;
  public frm2!: FormGroup;
  public frmEditSub!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public itemSubRef: any;
  public loadingDel: any;

  public formEditSub: any = false; // สำหรับเรียก form edit หัวข้อ
  public itemSubEditRef: any;  // สำหรับเรียก form edit หัวข้อ

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: ChecklistService,
    private checklistSubService: ChecklistSubService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private fbEditSub: FormBuilder,
    private modalService: BsModalService

  ) { }

  ngOnInit() {

    this.getData();
    // this.getSubData();
    this.formGroup();
    this.formSubGroup();

  }

  formGroup() {
    this.frm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      // roomId: this.fb.control(this.roomId),
    });
  }

  formSubGroup() {
    this.frm2 = this.fb2.group({
      checklistSubName: this.fb2.control('', [Validators.required]),
    });
  }

  formEditSubGroup() {
    this.frmEditSub = this.fbEditSub.group({
      checklistSubName: this.fbEditSub.control('', [Validators.required]),
    });
  }

  async getData() {

    const token = this.auth.getToken();
    // this.isProcess = true;

    this.itemSubRef = await lastValueFrom(this.checklistSubService.findByChecklistId(this.id, token));

    this.service.findById(this.id, token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(r => {
        this.itemRef = r.data;
        this.isProcess = false;
        this.isProcess2 = false;
      });

  }

  onSubmit() {

    this.isProcess = true;
    let params = this.frm.value;

    params.id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess = true;
      const token = this.auth.getToken();

      this.service.update(params, this.id, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.isProcess = false;
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist'], { relativeTo: this.activatedRoute });
          }

        });

    }
  }

  onSubmit2() {

    this.isProcess2 = true;
    let params = this.frm2.value;

    params.checklist_id = this.id;

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess2 = true;
      const token = this.auth.getToken();

      this.checklistSubService.create(params, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.isProcess2 = false;
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            // this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist'], { relativeTo: this.activatedRoute });
            this.getData();
            this.formSubGroup();
          }

        });

    }
  }

  onSubmit3(id:any) {

    this.isProcess2 = true;
    let params = this.frmEditSub.value;
    params.id = id;

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess2 = true;
      const token = this.auth.getToken();

      this.checklistSubService.update(params, id, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(res => {

          if (res.status) {
            this.isProcess2 = false;
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.getData();
            this.frmEditSub.reset();
            this.formEditSub = false;
          }

        });

    }
  }

  delSub(id:any){
    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess2 = true;
      const token = this.auth.getToken();

      this.checklistSubService.delete(id, token).subscribe(res => {
        if (res.status) {
          this.isProcess2 = false;
          this.toastr.success('บันทึกข้อมูล', 'ลบหัวข้อสำเร็จ', { timeOut: 1000, progressBar: true, });
          // this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist/edit',id], { relativeTo: this.activatedRoute });
          this.getData();
        }
      });

    }
  }

  del(id: any) {

    if (confirm('ยืนยันการทำรายการ!')) {
      this.loadingDel = true;
      const token = this.auth.getToken();
      this.service.delete(id, token).subscribe(res => {

        if (res.status) {
          this.loadingDel = false;
          this.toastr.success('บันทึกข้อมูล', 'ลบข้อมูลสำเร็จ', { timeOut: 1000, progressBar: true, });
          this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist'], { relativeTo: this.activatedRoute });
        }
      });
    }
  }

  async showEditSub(id:any){

    this.formEditSub = true;
    const token = this.auth.getToken();

    this.formEditSubGroup();
    this.itemSubEditRef = await lastValueFrom(this.checklistSubService.findById(id, token));
  }

  hideEditSub(){
    
    this.frmEditSub.reset();
    this.formEditSub = false;
  }

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
