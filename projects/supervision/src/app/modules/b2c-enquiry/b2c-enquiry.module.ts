import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { B2cEnquiryComponent } from './b2c-enquiry.component';
import { B2cEnquiryRoutingModule } from './b2c-enquiry.routing.module';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
  declarations: [B2cEnquiryComponent],
  imports: [
    CommonModule,
    B2cEnquiryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgbModule,
    LayoutsModule,
  ]
})
export class B2cEnquiryModule { }
