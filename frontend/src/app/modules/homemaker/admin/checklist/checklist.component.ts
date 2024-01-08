import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';
import { ChecklistDetailComponent } from './checklist-detail/checklist-detail.component';
import { ChecklistAddChoiceComponent } from './checklist-add-choice/checklist-add-choice.component';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit, OnDestroy {

  modalRef?: BsModalRef;
  subscriptions = new Subscription(); // modal
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public itemRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: ChecklistService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {

    this.getData();
  }

  async getData() {

    this.loadingData = true;
    const token = this.auth.getToken();

    this.service.findAll(token)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(r => {
        this.itemRef = r;
        this.loadingData = false;
        // console.log(r);
      });

  }

  // ##### modal check list
  openModalChecklist(checklist_id: any) {
    const initialState: ModalOptions = { initialState: { checklist_id: checklist_id, } };
    this.modalRef = this.modalService.show(ChecklistDetailComponent, initialState);
    this.modalRef.setClass('modal-lg');

    // this.subscriptions.add(
    //   this.modalService.onHide.subscribe((reason: string | any) => {
    //     this.getData();
    //   })
    // );
  }

    // ##### modal check list
    openModalManageChecklist(checklist_id: any) {
      const initialState: ModalOptions = { initialState: { checklist_id: checklist_id, } };
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
