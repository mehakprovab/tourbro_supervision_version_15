import {
    DevToolsExtension,
    NgRedux,
    NgReduxModule,
} from "@angular-redux/store";
import { LayoutModule } from "@angular/cdk/layout";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { LightboxModule } from "@ngx-gallery/lightbox";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { BnNgIdleService } from "bn-ng-idle";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { ExportAsService } from "ngx-export-as";
import { NgxLoadingModule } from "ngx-loading";
import { CarouselModule } from "ngx-owl-carousel-o";
import {
    PerfectScrollbarConfigInterface,
    PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { DomainInterceptor } from "./core/interceptor/domain.interceptor";
import { DomainLogoModule } from "./modules/domain-logo/domain-logo.module";
import { BaggageAlertComponent } from "./modules/search/flight/booking/confirm-passenger/modals/baggage-alert/baggage-alert.component";
import { SharedModule } from "./shared/shared.module";
import { ThemeOptions } from "./theme-options";
import { ArchitectUIState, rootReducer } from "./ThemeOptions/store";
import { ConfigActions } from "./ThemeOptions/store/config.actions";
import { IntercomModule } from 'ng-intercom';
import { CartModule } from '../app/modules/cart-booking/cart.module';
import { CustomDialogWrapperComponent } from "./modules/custom-dialog-wrapper/custom-dialog-wrapper.component";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
};

@NgModule({
    declarations: [
        AppComponent,
        BaggageAlertComponent,
        CustomDialogWrapperComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CartModule,
        NgReduxModule,
        NgxLoadingModule.forRoot({}),
        NgBootstrapFormValidationModule.forRoot(),
        LoadingBarRouterModule,
        SlickCarouselModule,
        MatProgressSpinnerModule,
        CoreModule,
        SharedModule,
        LayoutModule,
        CarouselModule,
        LightboxModule,
        IntercomModule.forRoot({
            appId: 'dk38ebhh', // from your Intercom config
            updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
        }),
        AppRoutingModule,
        DomainLogoModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DomainInterceptor,
            multi: true,
        },

        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            // DROPZONE_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
            // DEFAULT_DROPZONE_CONFIG,
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        ConfigActions,
        ThemeOptions,
        BnNgIdleService,
        ExportAsService
    ],
    entryComponents: [BaggageAlertComponent, CustomDialogWrapperComponent],
    exports: [MatProgressSpinnerModule, BaggageAlertComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        private ngRedux: NgRedux<ArchitectUIState>,
        devTool: DevToolsExtension
    ) {
        this.ngRedux.configureStore(
            rootReducer,
            {} as ArchitectUIState,
            [],
            [devTool.isEnabled() ? devTool.enhancer() : (f) => f]
        );
    }
}
