import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { UserPermissionResolve } from '../../auth/user-permission.resolve';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve:{         
        userpermissions:UserPermissionResolve  
      } ,
    children: [
      {path: '', component: DashboardComponent, data: {extraParameter: 'materialFormControls'}},
      {path: 'b2b-dashboard', component: DashboardComponent, data: {extraParameter: 'materialFormControls'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
