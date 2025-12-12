import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "b2b/auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "set-balance-alert",
    loadChildren: () =>
      import("./modules/balance-alert/balance-alert.module").then(
        (m) => m.BalanceAlertModule
      ),
  },
  {
    path: "commission",
    loadChildren: () =>
      import("./modules/commission/commission.module").then(
        (m) => m.CommissionModule
      ),
  },
  {
    path: "logo",
    loadChildren: () =>
      import("./modules/logo/logo.module").then((m) => m.LogoModule),
  },
  {
    path: "markup",
    loadChildren: () =>
      import("./modules/markup/markup.module").then((m) => m.MarkupModule),
  },
  {
    path: "other",
    loadChildren: () =>
      import("./modules/other/other.module").then((m) => m.OtherModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('../app/modules/cart-booking/cart.module').then(m => m.CartModule)
  },
  
  {
    path: "payment",
    loadChildren: () =>
      import("./modules/payment/payment.module").then((m) => m.PaymentModule),
  },
  {
    path: "queues",
    loadChildren: () =>
      import("./modules/queues/queues.module").then((m) => m.QueuesModule),
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./modules/reports/reports.module").then((m) => m.ReportsModule),
  },
  {
    path: "administrator",
    loadChildren: () =>
      import("./modules/administrator/administrator.module").then(
        (m) => m.AdministratorModule
      ),
  },
  {
    path: "search",
    loadChildren: () =>
      import("./modules/search/search.module").then((m) => m.SearchModule),
  },
  {
    path: "support-tickets",
    loadChildren: () =>
      import("./modules/support-tickets/support-tickets.module").then(
        (m) => m.SupportTicketsModule
      ),
  },
  {
    path: "domain-logo",
    loadChildren: () =>
      import("./modules/domain-logo/domain-logo.module").then(
        (m) => m.DomainLogoModule
      ),
  },
  {
    path: "users",
    loadChildren: () =>
      import("./modules/users/users.module").then((m) => m.UsersModule),
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      onSameUrlNavigation: "ignore",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
