import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomtypeComponent } from './admin/roomtype/roomtype.component';
import { ChecklistComponent } from './admin/checklist/checklist.component';
import { RoomComponent } from './admin/room/room.component';
import { HomemakerComponent } from './admin/homemaker/homemaker.component';
import { EditComponent } from './admin/roomtype/edit/edit.component';
// import { EditComponent } from './admin/homemaker/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'admin/roomtype', component: RoomtypeComponent },
  { path: 'admin/roomtype/edit/:id', component: EditComponent },
  
  { path: 'admin/checklist', component: ChecklistComponent },
  { path: 'admin/room', component: RoomComponent },
  { path: 'admin/homemaker', component: HomemakerComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomemakerRoutingModule { }
