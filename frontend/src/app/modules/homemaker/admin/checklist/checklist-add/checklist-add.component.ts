import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';
import { ChecklistAddChoiceComponent } from '../checklist-add-choice/checklist-add-choice.component';

@Component({
  selector: 'app-checklist-add',
  templateUrl: './checklist-add.component.html',
  styleUrls: ['./checklist-add.component.css']
})
export class ChecklistAddComponent implements OnInit, OnDestroy {

  modalRef?: BsModalRef;
  subscriptions = new Subscription(); // modal

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว


  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  // public roomTypeRef: any;
  public choiceRef: any;
  public randomId: any = Math.floor(Math.random() * 10001);

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: ChecklistService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {

    this.formGroup();
    console.log(this.randomId)

  }

  formGroup() {
    this.frm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      // roomId: this.fb.control(this.roomId),
    });
  }

  onSubmit() {

    let params = this.frm.value;

    if (confirm('ยืนยันการทำรายการ!')) {

      this.isProcess = true;
      const token = this.auth.getToken();

      this.service.create(params, token)
        .pipe(takeUntil(this.destroySubject))
        .subscribe((res:any) => {
          // console.log(res)
          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.isProcess = false;
            this.choiceRef = res.data;
            console.log(this.choiceRef);

            this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist/edit',res.data.checklist_id], { relativeTo: this.activatedRoute });
          }
        });
    }
  }

  // ##### modal
  openModalAddChoice(randomId:any) {
    // let randomId:any;
    // Math.floor(Math.random() * 10);
    const initialState: ModalOptions = { initialState: { randomId: randomId } };
    this.modalRef = this.modalService.show(ChecklistAddChoiceComponent, initialState);
    this.modalRef.setClass('modal-lg');

    // this.subscriptions.add(
    //   this.modalService.onHide.subscribe((reason: string | any) => {
    //     this.getData();
    //   })
    // );
  }

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
