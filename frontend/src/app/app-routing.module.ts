import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },

  // App Administrator
  { path: 'admin', loadChildren: () => import('./modules/app/admin/admin.module').then((m) => m.AdminModule) },

  { path: 'homemaker', loadChildren: () => import('./modules/homemaker/homemaker.module').then((m) => m.HomemakerModule) },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
