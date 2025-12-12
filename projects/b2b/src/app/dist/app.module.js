"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var animations_1 = require("@angular/platform-browser/animations");
var store_1 = require("@angular-redux/store");
var store_2 = require("./ThemeOptions/store");
var config_actions_1 = require("./ThemeOptions/store/config.actions");
var app_routing_module_1 = require("./app-routing.module");
var router_1 = require("@ngx-loading-bar/router");
var http_1 = require("@angular/common/http");
var app_component_1 = require("./app.component");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var ngx_loading_1 = require("ngx-loading");
var ngx_slick_carousel_1 = require("ngx-slick-carousel");
var theme_options_1 = require("./theme-options");
var core_module_1 = require("./core/core.module");
var router_2 = require("@angular/router");
// import { PagesLayoutComponent } from './layout/pages-layout/pages-layout.component';
// import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
var layout_1 = require("@angular/cdk/layout");
var domain_interceptor_1 = require("./core/interceptor/domain.interceptor");
var ng_bootstrap_form_validation_1 = require("ng-bootstrap-form-validation");
// import { BnNgIdleService } from 'bn-ng-idle';
// import { ExportAsModule } from 'ngx-export-as';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var AppModule = /** @class */ (function () {
    function AppModule(ngRedux, devTool) {
        this.ngRedux = ngRedux;
        this.ngRedux.configureStore(store_2.rootReducer, {}, [], [devTool.isEnabled() ? devTool.enhancer() : function (f) { return f; }]);
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                router_2.RouterModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                // BsDatepickerModule.forRoot(),
                http_1.HttpClientModule,
                store_1.NgReduxModule,
                ngx_loading_1.NgxLoadingModule.forRoot({}),
                ng_bootstrap_form_validation_1.NgBootstrapFormValidationModule.forRoot(),
                router_1.LoadingBarRouterModule,
                ngx_slick_carousel_1.SlickCarouselModule,
                core_module_1.CoreModule,
                // SharedModule,
                // DashboardModule,
                layout_1.LayoutModule,
                // LayoutsModule,
                /*AuthModule,
                UsersModule,
                ReportsModule,
                AccountsModule,
                QueuesModule,
                CommissionModule,
                SettingsModule,
                MarkupModule,
                MasterBalanceManagerModule,
                EmailSubscriptionsModule,
                CmsModule,
                OfflineModule,
                NoSubmenuModule,
                SearchModule,
                PaymentModule,
                BalanceAlertModule,
                LogoModule,
                OtherModule,*/
                // ExportAsModule,
                app_routing_module_1.AppRoutingModule,
            ],
            providers: [
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: domain_interceptor_1.DomainInterceptor,
                    multi: true
                },
                {
                    provide: ngx_perfect_scrollbar_1.PERFECT_SCROLLBAR_CONFIG,
                    // DROPZONE_CONFIG,
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                },
                config_actions_1.ConfigActions,
                theme_options_1.ThemeOptions
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
