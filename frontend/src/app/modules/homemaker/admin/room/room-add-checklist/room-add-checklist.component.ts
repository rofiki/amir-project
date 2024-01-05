import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
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
  public homeMakerRef: any;
  public personnelRef: any;

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

  async getChecklist() {

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

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
