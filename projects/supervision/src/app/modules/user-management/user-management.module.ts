import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-management.routing.module';
import { CreateB2cComponent } from './manage-b2c/manage-b2c-active/create-b2c/create-b2c.component';
import { ManageListComponent } from './manage-b2c/manage-b2c-active/manage-list/manage-list.component';
import { ManageB2cInactiveComponent } from './manage-b2c/manage-b2c-active/manage-b2c-inactive/manage-b2c-inactive.component';
import { InactiveListComponent } from './manage-b2c/manage-b2c-active/manage-b2c-inactive/inactive-list/inactive-list.component';
import { ManageB2cActiveComponent } from './manage-b2c/manage-b2c-active/manage-b2c-active.component';
import { LayoutsModule } from '../../layout/layout.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { B2BActiveComponent } from './manage-agent/b2b/manageAgent/b2-b-active/b2-b-active.component';
import { ManageActiveCreateB2BComponent } from './manage-agent/b2b/manageAgent/b2-b-active/manage-active-create-b2-b/manage-active-create-b2-b.component';
import { B2bActiveListComponent } from './manage-agent/b2b/manageAgent/b2-b-active/b2b-active-list/b2b-active-list.component';
import { SubAdminActiveComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active.component';
import { CreateSubAdminComponent } from './manage-subAdmin/subAdmin-active/create-sub-admin/create-sub-admin.component';
import { SubAdminActiveListComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active-list/sub-admin-active-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminProfileComponent } from './users/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { ManageSupplierComponent } from './manage-supplier/manage-supplier.component';
import { CreateSupplierComponent } from './manage-supplier/create-supplier/create-supplier.component';
import { SupplierListComponent } from './manage-supplier/supplier-list/supplier-list.component';
import { ManageSupplierInactiveComponent } from './manage-supplier/manage-supplier-inactive/manage-supplier-inactive.component';
import { SupplierInactiveListComponent } from './manage-supplier/manage-supplier-inactive/supplier-inactive-list/supplier-inactive-list.component';
import { ManageAgentGroupingComponent } from './manage-agent-grouping/manage-agent-grouping.component';
import { CreateAgentGroupingComponent } from './manage-agent-grouping/create-agent-grouping/create-agent-grouping.component';
import { ManageInactiveAgentGroupingComponent } from './manage-agent-grouping/manage-inactive-agent-grouping/manage-inactive-agent-grouping.component';
import { AgentGroupingListComponent } from './manage-agent-grouping/agent-grouping-list/agent-grouping-list.component';

import { InactiveAgentGroupListComponent } from './manage-agent-grouping/manage-inactive-agent-grouping/inactive-agent-group-list/inactive-agent-group-list.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ManageSupplierNewlistingComponent } from './manage-supplier/manage-supplier-newlisting/manage-supplier-newlisting.component';
import { SupplierNewListingComponent } from './manage-supplier/manage-supplier-newlisting/supplier-new-listing/supplier-new-listing.component';
import { ManageAgentNewListingComponent } from './manage-agent/b2b/manageAgent/b2-b-active/manage-agent-new-listing/manage-agent-new-listing.component';
import { AgentNewListingComponent } from './manage-agent/b2b/manageAgent/b2-b-active/manage-agent-new-listing/agent-new-listing/agent-new-listing.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [CreateB2cComponent, ManageListComponent, ManageB2cInactiveComponent, InactiveListComponent, ManageB2cActiveComponent, B2BActiveComponent, ManageActiveCreateB2BComponent,
        AdminProfileComponent, ChangePasswordComponent,B2bActiveListComponent,SubAdminActiveComponent,CreateSubAdminComponent,SubAdminActiveListComponent,PrivilegesComponent,ManageSupplierComponent,CreateSupplierComponent,
        SupplierListComponent,ManageSupplierInactiveComponent,SupplierInactiveListComponent,ManageAgentGroupingComponent,CreateAgentGroupingComponent,ManageInactiveAgentGroupingComponent,AgentGroupingListComponent,
        SupplierNewListingComponent,InactiveAgentGroupListComponent,AgentNewListingComponent,ManageSupplierNewlistingComponent,ManageAgentNewListingComponent

    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        LayoutsModule,
        Ng2SearchPipeModule,
        SharedModule,
        BsDropdownModule,
        NgxIntlTelInputModule,
        NgbNavModule,
        
    ]
})
export class UserManagementModule { }
