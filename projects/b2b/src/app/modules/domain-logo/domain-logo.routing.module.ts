import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { DomainLogoComponent } from "./domain-logo.component";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: DomainLogoComponent,
        data: { extraParameter: "materialFormControls" },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DomainLogoRoutingModule {}
