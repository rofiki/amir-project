import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { HomemakerService } from 'src/app/services/homemaker/homemaker.service';
import { Subject, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-homemaker',
  templateUrl: './homemaker.component.html',
  styleUrls: ['./homemaker.component.css']
})
export class HomemakerComponent implements OnInit, OnDestroy {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;
  private destroySubject: Subject<void> = new Subject(); // รวม subscribe เพื่อ unsub ทีเดียว

  public frm!: FormGroup;
  public itemRef: any;
  public meta:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: HomemakerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.getData();
  }

  async getData() {

    this.loadingData = true;
    const token = this.auth.getToken();
    this.service.findAll(token).subscribe(r => {
      this.itemRef = r;
      this.meta = r.meta;
      this.loadingData = false;
      console.log(this.itemRef)
    });
    // this.itemRef = await lastValueFrom(this.service.findAll(token));
    
  }

  del(id: any) { }

  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

}
