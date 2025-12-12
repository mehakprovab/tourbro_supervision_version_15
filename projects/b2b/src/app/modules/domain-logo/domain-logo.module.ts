import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomainLogoComponent } from "./domain-logo.component";
import { DomainLogoRoutingModule } from "./domain-logo.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LayoutsModule } from "../../layout/layout.module";

@NgModule({
  declarations: [DomainLogoComponent],
  imports: [
    CommonModule,
    DomainLogoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    LayoutsModule
  ],
})
export class DomainLogoModule {}
