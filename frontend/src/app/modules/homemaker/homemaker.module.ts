import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// layout
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

import { PaginationModule } from '../pagination/pagination/pagination.module';

import { HomemakerRoutingModule } from './homemaker-routing.module';
import { HomeComponent } from './home/home.component';
import { RoomtypeComponent } from './admin/roomtype/roomtype.component';
import { AddComponent } from './admin/roomtype/add/add.component';
import { EditComponent } from './admin/roomtype/edit/edit.component';
import { ChecklistComponent } from './admin/checklist/checklist.component';
import { HomemakerComponent } from './admin/homemaker/homemaker.component';
import { RoomComponent } from './admin/room/room.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HomemakerAddComponent } from './admin/homemaker/homemaker-add/homemaker-add.component';
import { HomemakerEditComponent } from './admin/homemaker/homemaker-edit/homemaker-edit.component';
import { HomemakerResetPasswordComponent } from './admin/homemaker/homemaker-reset-password/homemaker-reset-password.component';
import { RoomAddComponent } from './admin/room/room-add/room-add.component';
import { RoomEditComponent } from './admin/room/room-edit/room-edit.component';
import { RoomAddHomemakerComponent } from './admin/room/room-add-homemaker/room-add-homemaker.component';
import { Select2Module } from 'ng-select2-component';
import { RoomAddPersonnelComponent } from './admin/room/room-add-personnel/room-add-personnel.component';
import { ChecklistAddComponent } from './admin/checklist/checklist-add/checklist-add.component';
import { ChecklistEditComponent } from './admin/checklist/checklist-edit/checklist-edit.component';
import { RoomAddChecklistComponent } from './admin/room/room-add-checklist/room-add-checklist.component';
import { ChecklistDetailComponent } from './admin/checklist/checklist-detail/checklist-detail.component';
import { ChecklistAddChoiceComponent } from './admin/checklist/checklist-add-choice/checklist-add-choice.component';



@NgModule({
  declarations: [
    HomeComponent,
    RoomtypeComponent,
    AddComponent,
    EditComponent,
    ChecklistComponent,
    HomemakerComponent,
    RoomComponent,
    HomemakerAddComponent,
    HomemakerEditComponent,
    HomemakerResetPasswordComponent,
    RoomAddComponent,
    RoomEditComponent,
    RoomAddHomemakerComponent,
    RoomAddPersonnelComponent,
    ChecklistAddComponent,
    ChecklistEditComponent,
    RoomAddChecklistComponent,
    ChecklistDetailComponent,
    ChecklistAddChoiceComponent
  ],
  imports: [
    CommonModule,
    HomemakerRoutingModule,

    // layour
    HeaderComponent,
    FooterComponent,
    SidebarComponent,

    HttpClientModule,
    ReactiveFormsModule,

    Select2Module,

    PaginationModule
  ]
})
export class HomemakerModule { }
