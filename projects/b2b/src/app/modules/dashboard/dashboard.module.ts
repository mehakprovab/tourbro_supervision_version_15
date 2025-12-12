import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { FullCalendarModule } from "@fullcalendar/angular"; // for FullCalendar!
import { HighchartsChartModule } from "highcharts-angular";
import { SearchModule } from "../search/search.module";
import { CartModule } from "../cart-booking/cart.module";
import {
  LatestMembersComponent,
  RecentBookingTransactionsComponent,
} from "./components";
import { LayoutsModule } from "../../layout/layout.module";

@NgModule({
  declarations: [
    DashboardComponent,
    LatestMembersComponent,
    RecentBookingTransactionsComponent,
  ],

  imports: [
    DashboardRoutingModule,
    SearchModule,
    FullCalendarModule,
    HighchartsChartModule,
    CartModule,
    LayoutsModule,
  ],
})
export class DashboardModule {}
