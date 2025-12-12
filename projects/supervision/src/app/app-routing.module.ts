
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'header',
        loadChildren: () => import('./modules/header/header.module').then(m => m.HeaderModule)
    },
 
    {
        path: 'group',
        loadChildren: () => import('./modules/group-booking/group-booking.module').then(m => m.GroupBookingModule)
    },
    {
        path: 'masterbalance',
        loadChildren: () => import('./modules/master-balance/master-balance.module').then(m => m.MasterBalanceModule)
    },
    {
        path: 'account',
        loadChildren: () => import('./modules/account-manager/account-manager.module').then(m => m.AccountManagerModule)
    },
    {
        path: 'bank',
        loadChildren: () => import('./modules/bank-account-details/bank-account-details.module').then(m => m.BankAccountDetailsModule)
    },
    {
        path: 'b2creward',
        loadChildren: () => import('./modules/rewards-b2c/rewards-b2c.module').then(m => m.RewardsB2cModule)
    },
    {
        path: 'tour-crs',
        loadChildren: () => import('../app/modules/tour-crs/tour-crs.module').then(m => m.TourCRSModule,
        )
    },
    {
        path: 'supplier',
        loadChildren: () => import('./modules/supplier-management/supplier-management.module').then(m => m.SupplierManagementModule)
    },
    {
        path: 'B2C',
        loadChildren: () => import('./modules/b2c-enquiry/b2c-enquiry.module').then(m => m.B2cEnquiryModule,
        )
    },

    {
        path: 'B2C-Subscribed',
        loadChildren: () => import('./modules/b2c-subscribed-emails/b2c-subscribed-emails.module').then(m => m.B2cSubscribedEmailsModule,
        )
    },
    {
        path: 'manage',
        loadChildren: () => import('./modules/manage-country-state-city/manage-country-state-city.module').then(m => m.ManageCountryStateCityModule,
        )
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule,
        )
    },
    {
        path: 'user',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule,
        )
    },
    {
        path: 'report',
        loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule,
        )
    },
    {
        path: 'cms',
        loadChildren: () => import('./modules/cms/cms.module').then(m => m.CmsModule,
        )
    },
    {
        path: 'commissions',
        loadChildren: () => import('./modules/commissions/commissions.module').then(m => m.CommissionsModule,
        )
    },
    {
        path: 'b2c-cms',
        loadChildren: () => import('./modules/b2c-cms/b2c-cms.module').then(m => m.B2cCmsModuleModule,
        )
    },
    {
        path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,

            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
