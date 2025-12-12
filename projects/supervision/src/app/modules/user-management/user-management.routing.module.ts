
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { ManageB2cActiveComponent } from './manage-b2c/manage-b2c-active/manage-b2c-active.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { ManageB2cInactiveComponent } from './manage-b2c/manage-b2c-active/manage-b2c-inactive/manage-b2c-inactive.component';
import { CreateB2cComponent } from './manage-b2c/manage-b2c-active/create-b2c/create-b2c.component';
import { ManageListComponent } from './manage-b2c/manage-b2c-active/manage-list/manage-list.component';
import { B2BActiveComponent } from './manage-agent/b2b/manageAgent/b2-b-active/b2-b-active.component';
import { ManageActiveCreateB2BComponent } from './manage-agent/b2b/manageAgent/b2-b-active/manage-active-create-b2-b/manage-active-create-b2-b.component';
import { B2bActiveListComponent } from './manage-agent/b2b/manageAgent/b2-b-active/b2b-active-list/b2b-active-list.component';
import { SubAdminActiveComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active.component';
import { CreateSubAdminComponent } from './manage-subAdmin/subAdmin-active/create-sub-admin/create-sub-admin.component';
import { SubAdminActiveListComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active-list/sub-admin-active-list.component';
import { AdminProfileComponent } from './users/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { ManageSupplierComponent } from './manage-supplier/manage-supplier.component';
import { CreateSupplierComponent } from './manage-supplier/create-supplier/create-supplier.component';
import { SupplierListComponent } from './manage-supplier/supplier-list/supplier-list.component';
import { SupplierInactiveListComponent } from './manage-supplier/manage-supplier-inactive/supplier-inactive-list/supplier-inactive-list.component';
import { AgentGroupingListComponent } from './manage-agent-grouping/agent-grouping-list/agent-grouping-list.component';
import { ManageInactiveAgentGroupingComponent } from './manage-agent-grouping/manage-inactive-agent-grouping/manage-inactive-agent-grouping.component';
import { CreateAgentGroupingComponent } from './manage-agent-grouping/create-agent-grouping/create-agent-grouping.component';
import { ManageAgentGroupingComponent } from './manage-agent-grouping/manage-agent-grouping.component';
import { ManageSupplierInactiveComponent } from './manage-supplier/manage-supplier-inactive/manage-supplier-inactive.component';

import { ManageSupplierNewlistingComponent } from './manage-supplier/manage-supplier-newlisting/manage-supplier-newlisting.component';
import { ManageAgentNewListingComponent } from './manage-agent/b2b/manageAgent/b2-b-active/manage-agent-new-listing/manage-agent-new-listing.component';

const routes: Routes = [
{
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
        {
            path: 'manage-b2c/active',
            canActivate: [AuthGuard],
            component: ManageB2cActiveComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2c/create-b2c',
            canActivate: [AuthGuard],
            component: CreateB2cComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2c/manage-list',
            canActivate: [AuthGuard],
            component: ManageListComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2c/inactive',
            canActivate: [AuthGuard],
            component: ManageB2cInactiveComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2c/inactive-list',
            canActivate: [AuthGuard],
            component: ManageB2cInactiveComponent, 
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2b/active',
            canActivate: [AuthGuard],
            component: B2BActiveComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'manage-b2b/in-active',
            canActivate: [AuthGuard],
            component: B2BActiveComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'manage-b2b/active/create-b2b',
            canActivate: [AuthGuard],
            component: ManageActiveCreateB2BComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'b2b/active/list',
            canActivate: [AuthGuard],
            component: B2bActiveListComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'subAdmin/active',
            canActivate: [AuthGuard],
            component: SubAdminActiveComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/in-active',
            canActivate: [AuthGuard],
            component: SubAdminActiveComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/active/create/subAdmin',
            canActivate: [AuthGuard],
            component: CreateSubAdminComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/active/list',
            canActivate: [AuthGuard],
            component: SubAdminActiveListComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'manage-supplier/active',
            canActivate: [AuthGuard],
            component: ManageSupplierComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-supplier/in-active',
            canActivate: [AuthGuard],
            component: ManageSupplierInactiveComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-supplier/new-listing',
            canActivate: [AuthGuard],
            component: ManageSupplierNewlistingComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-b2b/new-listing',
            canActivate: [AuthGuard],
            component: ManageAgentNewListingComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'manage-agent/active',
            canActivate: [AuthGuard],
            component: ManageAgentGroupingComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-agent/in-active',
            canActivate: [AuthGuard],
            component: ManageInactiveAgentGroupingComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-supplier/list',
            canActivate: [AuthGuard],
            component: SupplierListComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-supplier/create',
            canActivate: [AuthGuard],
            component: CreateSupplierComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'manage-agent/create',
            canActivate: [AuthGuard],
            component: CreateAgentGroupingComponent,
            data: { extraParameter: 'manageB2CMenus' }
        },
        {
            path: 'admin-profile',
            component: AdminProfileComponent,
            data: { extraParameter: '' }
        },
        {
            path: 'change-password',
            component: ChangePasswordComponent,
            data: { extraParameter: '' }
        },
        {
            path: 'privileges',
            component: PrivilegesComponent,
            data: { extraParameter: '' }
        }
    ]
}
 
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}