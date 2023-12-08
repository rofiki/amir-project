import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
// import { Bootstrap5Module } from 'src/app/modules/bootstrap5/bootstrap5.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { EmployeeComponent } from './employee/employee.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { RoleComponent } from './role/role.component';
import { UserAdminComponent } from './user-admin/user-admin.component';



@NgModule({
  declarations: [
    HomeComponent,
    EmployeeComponent,
    DepartmentComponent,
    JobPositionComponent,
    RoleComponent,
    UserAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    // Bootstrap5Module, // all ngx-bootstrap module
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  providers: [] 
})
export class AdminModule { }
