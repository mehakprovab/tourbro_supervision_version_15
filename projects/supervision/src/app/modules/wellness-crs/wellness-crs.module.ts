import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WellnessCrsRoutingModule } from './wellness-crs-routing.module';
import { WellnessCenterListComponent } from './components/wellness-center-list/wellness-center-list.component';
import { TherapyTypeComponent } from './components/therapy-type/therapy-type.component';
import { TreatmentsComponent } from './components/treatments/treatments.component';
import { HealthGoalsConditionComponent } from './components/health-goals-condition/health-goals-condition.component';
import { PackageTypeComponent } from './components/package-type/package-type.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { WellnessListComponent } from './components/wellness-center-list/wellness-list/wellness-list.component';
import { AddUpdateWellnessComponent } from './components/wellness-center-list/add-update-wellness/add-update-wellness.component';
import { NgbAccordionModule, NgbCollapseModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutsModule } from '../../layout/layout.module';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from 'ckeditor4-angular';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { WellnessCrsDetailsComponent } from './components/wellness-center-list/wellness-crs-details/wellness-crs-details.component';
import { TherapyListComponent } from './components/therapy-type/therapy-list/therapy-list.component';
import { AddUpdateTherapyListComponent } from './components/therapy-type/add-update-therapy-list/add-update-therapy-list.component';
import { FacilitiesListComponent } from './components/facilities/facilities-list/facilities-list.component';
import { AddUpdateFacilitiesListComponent } from './components/facilities/add-update-facilities-list/add-update-facilities-list.component';
import { HealthGoalsListComponent } from './components/health-goals-condition/health-goals-list/health-goals-list.component';
import { AddUpdateHealthGoalTypeComponent } from './components/health-goals-condition/add-update-health-goal-type/add-update-health-goal-type.component';
import { MealTypeListComponent } from './components/meal-plan/meal-type-list/meal-type-list.component';
import { AddUpdateMealTypeListComponent } from './components/meal-plan/add-update-meal-type-list/add-update-meal-type-list.component';
import { PackageTypeListComponent } from './components/package-type/package-type-list/package-type-list.component';
import { AddUpdatePackageTypeListComponent } from './components/package-type/add-update-package-type-list/add-update-package-type-list.component';
import { TreatmentTypeListComponent } from './components/treatments/treatment-type-list/treatment-type-list.component';
import { AddUpdateTreatmentTypeListComponent } from './components/treatments/add-update-treatment-type-list/add-update-treatment-type-list.component';
// import { WellnessImagesComponent } from './components/wellness-center-list/wellness-images/wellness-images.component';
import { HotelCrsModule } from '../hotel-crs/hotel-crs.module';
import { WellnessPackageRateComponent } from './components/wellness-center-list/wellness-package-rate/wellness-package-rate.component';
import { WellnessTaxComponent } from './components/wellness-center-list/wellness-tax/wellness-tax.component';
import { WellnessPriceComponent } from './components/wellness-center-list/wellness-price/wellness-price.component';
import { WellnessChildPolicyComponent } from './components/wellness-center-list/wellness-child-policy/wellness-child-policy.component';
import { WellnessCrsComponent } from './wellness-crs.component';
import { PatanjaliWellnessGalleryComponent } from './components/patanjali-wellness-gallery/patanjali-wellness-gallery.component';
import { PatanjaliDoctorsComponent } from './components/patanjali-doctors/patanjali-doctors.component';
@NgModule({
  declarations: [
    WellnessCenterListComponent,
    TherapyTypeComponent,
    TreatmentsComponent,
    HealthGoalsConditionComponent,
    PackageTypeComponent,
    MealPlanComponent,
    FacilitiesComponent,
    WellnessCrsComponent,
    WellnessListComponent,
    AddUpdateWellnessComponent,
    WellnessCrsDetailsComponent,
    TherapyListComponent,
    AddUpdateTherapyListComponent,
    FacilitiesListComponent,
    AddUpdateFacilitiesListComponent,
    HealthGoalsListComponent,
    AddUpdateHealthGoalTypeComponent,
    MealTypeListComponent,
    AddUpdateMealTypeListComponent,
    PackageTypeListComponent,
    AddUpdatePackageTypeListComponent,
    TreatmentTypeListComponent,
    AddUpdateTreatmentTypeListComponent,
    WellnessPackageRateComponent,
    WellnessTaxComponent,
    WellnessPriceComponent,
    WellnessChildPolicyComponent,
    WellnessCrsComponent,
    PatanjaliWellnessGalleryComponent,
    PatanjaliDoctorsComponent
    // WellnessImagesComponent
  ],
  imports: [
    CommonModule,
    WellnessCrsRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbNavModule,
    LayoutsModule,
    NgbAccordionModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
    CKEditorModule,
    HotelCrsModule


  ]
})
export class WellnessCrsModule { }
