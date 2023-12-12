import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Bootstrap5Module } from 'src/app/modules/bootstrap5/bootstrap5.module';

import { ThaiDatePipe } from './pipe/thaidate.pipe';
import { LogoutComponent } from './logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    ThaiDatePipe,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    NotFoundComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Bootstrap5Module, // all ngx-bootstrap module

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
