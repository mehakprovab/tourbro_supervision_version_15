import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxLoadingModule } from 'ngx-loading';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TrendModule } from 'ngx-trend';
import { RangeSliderModule } from '../modules/range-slider/range-slider.module';
import {
    AgentDetailsComponent,
    CurrencyBoxComponent, DotsComponent, DrawerComponent, FooterComponent,
    FooterDotsComponent,
    FooterMenuComponent, HeaderComponent, LogoComponent, MegamenuComponent,
    MegapopoverComponent, OptionsDrawerComponent,
    PageTitleComponent, SearchBoxComponent, SidebarComponent, UserBoxComponent
} from './components';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { MapPipe } from './pipes/map.pipe';

@NgModule({
    declarations: [
        OptionsDrawerComponent,
        PageTitleComponent,
        HeaderComponent,
        DotsComponent,
        SearchBoxComponent,
        MegamenuComponent,
        MegapopoverComponent,
        UserBoxComponent,
        DrawerComponent,
        SidebarComponent,
        LogoComponent,
        FooterComponent,
        FooterDotsComponent,
        FooterMenuComponent,
        EscapeHtmlPipe,
        AgentDetailsComponent,
        CurrencyBoxComponent,
        MapPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PerfectScrollbarModule,
        NgbModule,
        AngularFontAwesomeModule,
        RoundProgressModule,
        TrendModule,
        NgBootstrapFormValidationModule,
        NgxLoadingModule,
        RangeSliderModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatStepperModule,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTreeModule,
        MatRippleModule,
    ],
    exports: [
        OptionsDrawerComponent,
        PageTitleComponent,
        HeaderComponent,
        DotsComponent,
        SearchBoxComponent,
        MegamenuComponent,
        MegapopoverComponent,
        UserBoxComponent,
        DrawerComponent,
        SidebarComponent,
        LogoComponent,
        FooterComponent,
        FooterDotsComponent,
        FooterMenuComponent,
        EscapeHtmlPipe,
        MapPipe,
        AgentDetailsComponent,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatStepperModule,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTreeModule,
        MatRippleModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        NgbModule,
        AngularFontAwesomeModule,
        RoundProgressModule,
        TrendModule,
        NgBootstrapFormValidationModule,
        NgxLoadingModule,
        RangeSliderModule,
        SlickCarouselModule
    ]
})
export class SharedModule { }