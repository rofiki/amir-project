import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { ChecklistService } from 'src/app/services/homemaker/checklist.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit, OnDestroy {

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
    // private fb: FormBuilder,

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

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
