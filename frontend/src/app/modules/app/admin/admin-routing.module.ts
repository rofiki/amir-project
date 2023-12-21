import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { RoleComponent } from './role/role.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { UserAdminAddComponent } from './user-admin/add/add.component';
import { UserAdminEditComponent } from './user-admin/edit/edit.component';
import { ResetPasswordComponent } from './user-admin/reset-password/reset-password.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { PersonnelAddComponent } from './personnel/personnel-add/personnel-add.component';
import { PersonnelEditComponent } from './personnel/personnel-edit/personnel-edit.component';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // แผนก
  { path: 'department', component: DepartmentComponent },

  // ตำแหน่ง
  { path: 'jobposition', component: JobPositionComponent },

  //บุคลากร
  { path: 'personnel', component: PersonnelComponent },
  { path: 'personnel/add', component: PersonnelAddComponent },
  { path: 'personnel/edit/:id', component: PersonnelEditComponent },

  { path: 'role', component: RoleComponent },

  // useradmin
  { path: 'admin', component: UserAdminComponent },
  { path: 'admin/add', component: UserAdminAddComponent },
  { path: 'admin/edit/:id', component: UserAdminEditComponent },
  { path: 'admin/resetpassword/:id', component: ResetPasswordComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
