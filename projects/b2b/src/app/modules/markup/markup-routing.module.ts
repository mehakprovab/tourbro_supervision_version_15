import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  FlightComponent,
  BusComponent,
  HotelComponent,
  TransfersComponent,
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { MarkupComponent } from './markup.component';
import { ActivityComponent } from './components/activity/activity.component';
import { TourComponent } from './components/tour/tour.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: MarkupComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'flight',
        component: FlightComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'bus',
        component: BusComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'hotel',
        component: HotelComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'transfer',
        component: TransfersComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'activity',
        component: ActivityComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'tour',
        component: TourComponent,
        data: {extraParameter: 'markupMenus'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkupRoutingModule { }
