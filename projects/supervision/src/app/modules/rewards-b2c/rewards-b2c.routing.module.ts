import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AddManageRewardsComponent } from './add-manage-rewards/add-manage-rewards.component';
import { SetRewardRangeComponent } from './set-reward-range/set-reward-range.component';
import { RewardsConversionComponent } from './rewards-conversion/rewards-conversion.component';
import { RewardsReportsComponent } from './rewards-reports/rewards-reports.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'addManageRewards',
        component: AddManageRewardsComponent,
        data: {extraParameter: 'rewards-b2c-Menus'}
      },
      {
        path: 'setRewardsRange',
        component: SetRewardRangeComponent,
        data: {extraParameter: 'rewards-b2c-Menus'}
      },
      {
        path: 'rewardsConversion',
        component: RewardsConversionComponent,
        data: {extraParameter: 'rewards-b2c-Menus'}
      },
      {
        path: 'rewardsReports',
        component: RewardsReportsComponent,
        data: {extraParameter: 'rewards-b2c-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardB2CRoutingModule { }
