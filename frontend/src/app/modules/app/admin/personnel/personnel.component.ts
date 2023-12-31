import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { PersonnelService } from 'src/app/services/app/personnel.service';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;
  public loadingData: boolean = false;

  public frm!: FormGroup;
  public getToken: any;
  public itemRef: any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private service: PersonnelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    // get token
    const token: any = localStorage.getItem('token');
    // check token
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
      // console.log(this.getToken);
    }

    this.getData();
  }

  async getData() {

    this.loadingData = true;
    const token = this.getToken.access_token;
    this.service.findAll(token).subscribe(r => {
      this.itemRef = r;
      this.loadingData = false;
      console.log(this.itemRef)
    });
    // this.itemRef = await lastValueFrom(this.service.findAll(token));
    
  }

  del(id: any) { }

}
