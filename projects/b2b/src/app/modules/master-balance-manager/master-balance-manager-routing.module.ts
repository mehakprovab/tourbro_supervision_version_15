import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AgentsComponent
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'agents',
        component: AgentsComponent,
        data: {extraParameter: 'masterBalanceManagerMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterBalanceManagerRoutingModule { }
