import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// layout
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

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
    HomemakerEditComponent
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
  ]
})
export class HomemakerModule { }
