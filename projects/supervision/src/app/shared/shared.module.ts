import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { TrendModule } from 'ngx-trend';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree';
import { OptionsDrawerComponent } from '../ThemeOptions/options-drawer/options-drawer.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { HeaderComponent } from './components/header/header.component';
import { DotsComponent } from './components/header/elements/dots/dots.component';
import { SearchBoxComponent } from './components/header/elements/search-box/search-box.component';
import { MegamenuComponent } from './components/header/elements/mega-menu/mega-menu.component';
import { MegapopoverComponent } from './components/header/elements/mega-menu/elements/megapopover/megapopover.component';
import { UserBoxComponent } from './components/header/elements/user-box/user-box.component';
import { DrawerComponent } from './components/header/elements/drawer/drawer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LogoComponent } from './components/sidebar/elements/logo/logo.component';
import { FooterComponent } from './components/footer/footer.component';
import { FooterDotsComponent } from './components/footer/elements/footer-dots/footer-dots.component';
import { FooterMenuComponent } from './components/footer/elements/footer-menu/footer-menu.component';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxLoadingModule } from 'ngx-loading';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MapPipe } from "./pipes/map.pipe";

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
        MapPipe,
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
        NgxLoadingModule
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
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        NgbModule,
        AngularFontAwesomeModule,
        RoundProgressModule,
        TrendModule,
        NgBootstrapFormValidationModule,
        NgxLoadingModule,
        BsDatepickerModule,
    ]
})
export class SharedModule { }