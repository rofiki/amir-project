import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// import { Bootstrap5Module } from 'src/app/modules/bootstrap5/bootstrap5.module';

// ระบบ กำหนดสิทธิ์ใช้งานระบบของเจ้าหน้าที่
// layout
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { RoleComponent } from './role/role.component';
import { ThaiDatePipe } from 'src/app/pipe/thaidate.pipe';

//Admin
import { UserAdminComponent } from './user-admin/user-admin.component';
import { UserAdminEditComponent } from './user-admin/edit/edit.component';
import { UserAdminAddComponent } from './user-admin/add/add.component';
import { ResetPasswordComponent } from './user-admin/reset-password/reset-password.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    // ThaiDatePipe,
    HomeComponent,
    EmployeeComponent,
    DepartmentComponent,
    JobPositionComponent,
    RoleComponent,
    UserAdminComponent,
    UserAdminEditComponent,
    UserAdminAddComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,

    AdminRoutingModule, // ระบบ Admin
    // Bootstrap5Module, // all ngx-bootstrap module
    HttpClientModule,
    ReactiveFormsModule,

    // layour
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  providers: []
})
export class AdminModule { }
