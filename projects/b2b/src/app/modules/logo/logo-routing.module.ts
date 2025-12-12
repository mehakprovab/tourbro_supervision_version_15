import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { LogoComponent } from './logo/logo.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: LogoComponent,
        data: { extraParameter: 'logoMenus' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoRoutingModule { }
