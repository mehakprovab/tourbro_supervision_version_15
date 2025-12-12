import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { HighchartsChartModule } from 'highcharts-angular';
import { LatestMembersComponent, RecentBookingTransactionsComponent } from './components';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  
  declarations: [
    DashboardComponent,
    LatestMembersComponent,
    RecentBookingTransactionsComponent,
  ],

  imports: [
    CommonModule,
    DashboardRoutingModule,
    FullCalendarModule,
    HighchartsChartModule,
    SharedModule,
    TooltipModule.forRoot(),
  ]
})
export class DashboardModule { }
