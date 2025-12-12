import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RewardsB2cComponent } from '../rewards-b2c/rewards-b2c.component';
import { AddManageRewardsComponent } from './add-manage-rewards/add-manage-rewards.component';
import { SetRewardRangeComponent } from './set-reward-range/set-reward-range.component';
import { RewardsConversionComponent } from './rewards-conversion/rewards-conversion.component';
import { RewardsReportsComponent } from './rewards-reports/rewards-reports.component';
import { RewardB2CRoutingModule } from './rewards-b2c.routing.module';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
  declarations: [RewardsB2cComponent, AddManageRewardsComponent, SetRewardRangeComponent, RewardsConversionComponent, RewardsReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgbModule,
    RewardB2CRoutingModule,
    LayoutsModule
  ]
})
export class RewardsB2cModule { }
