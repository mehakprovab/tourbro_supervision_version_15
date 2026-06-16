import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { HighchartsChartModule } from 'highcharts-angular';
import { LatestMembersComponent, RecentBookingTransactionsComponent } from './components';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RevenueFinanceComponent } from './revenue-finance/revenue-finance.component';
import { CustomerComponent } from './customer/customer.component';
import { BookingOperationsComponent } from './booking-operations/booking-operations.component';
import { GeoRouteComponent } from './geo-route/geo-route.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';

//Charts Import
import * as echarts from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LegendComponent } from 'echarts/components';
echarts.use([BarChart, GridComponent, CanvasRenderer, TooltipComponent,PieChart,LegendComponent]);

@NgModule({
  
  declarations: [
    DashboardComponent,
    LatestMembersComponent,
    RecentBookingTransactionsComponent,
    RevenueFinanceComponent,
    CustomerComponent,
    GeoRouteComponent,
    VendorManagementComponent,
    BookingOperationsComponent
  ],

  imports: [
    CommonModule,
    DashboardRoutingModule,
    FullCalendarModule,
    HighchartsChartModule,
    SharedModule,
    TooltipModule.forRoot(),
    NgxEchartsModule.forRoot({echarts})
  ]
})
export class DashboardModule { }
