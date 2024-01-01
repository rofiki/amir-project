import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';

@Component({
  selector: 'app-checklist-add',
  templateUrl: './checklist-add.component.html',
  styleUrls: ['./checklist-add.component.css']
})
export class ChecklistAddComponent implements OnInit, OnDestroy {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว


  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;
  public roomTypeRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: ChecklistService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    this.formGroup();

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
        .subscribe(res => {
          // console.log(res)
          if (res.status) {
            this.toastr.success('บันทึกข้อมูล', 'บันทึกข้อมูลเรียบร้อย', { timeOut: 1000, progressBar: true, });
            this.isProcess = false;
            this.router.navigate([this.BASE_URL + '/homemaker/admin/checklist'], { relativeTo: this.activatedRoute });
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
