import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/app/auth.service';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  public BASE_URL: string = this.appService.BASE_URL;
  public isProcess: boolean = false;

  public getToken: any;
  public itemRef:any;


  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    
    const token: any = localStorage.getItem('token');
    if (!token) {
      window.location.href = this.BASE_URL + '/login';
    } else {
      this.getToken = jwtDecode(token);
    }

    this.getData();


  }

  public getData()
  {
    const headers = this.getToken.access_token;
    this.auth.findAll(headers).subscribe(res =>{
      // console.log(res);
      this.itemRef = res;
    });
  }

  edit(id: number) {
    this.router.navigate([this.BASE_URL + '/admin/admin/edit', id], { relativeTo: this.activatedRoute });
  }
}
