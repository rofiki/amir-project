import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomtypeComponent } from './admin/roomtype/roomtype.component';
import { ChecklistComponent } from './admin/checklist/checklist.component';
import { RoomComponent } from './admin/room/room.component';
import { HomemakerComponent } from './admin/homemaker/homemaker.component';
import { EditComponent } from './admin/roomtype/edit/edit.component';
import { HomemakerAddComponent } from './admin/homemaker/homemaker-add/homemaker-add.component';
import { HomemakerEditComponent } from './admin/homemaker/homemaker-edit/homemaker-edit.component';
import { RoomAddComponent } from './admin/room/room-add/room-add.component';
import { RoomEditComponent } from './admin/room/room-edit/room-edit.component';
import { ChecklistAddComponent } from './admin/checklist/checklist-add/checklist-add.component';
import { ChecklistEditComponent } from './admin/checklist/checklist-edit/checklist-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // ประเภทห้อง
  { path: 'admin/roomtype', component: RoomtypeComponent },
  { path: 'admin/roomtype/edit/:id', component: EditComponent },

  // checklsit
  { path: 'admin/checklist', component: ChecklistComponent },
  { path: 'admin/checklist/add', component: ChecklistAddComponent },
  { path: 'admin/checklist/edit/:id', component: ChecklistEditComponent },

  // ห้อง
  { path: 'admin/room', component: RoomComponent },
  { path: 'admin/room/add', component: RoomAddComponent },
  { path: 'admin/room/edit/:id', component: RoomEditComponent },

  // แม่บ้าน
  { path: 'admin/homemaker', component: HomemakerComponent },
  { path: 'admin/homemaker/add', component: HomemakerAddComponent },
  { path: 'admin/homemaker/edit/:id', component: HomemakerEditComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomemakerRoutingModule { }
