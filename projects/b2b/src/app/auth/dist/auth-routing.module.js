"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var pages_layout_component_1 = require("../layout/pages-layout/pages-layout.component");
var components_1 = require("./components");
var routes = [
    {
        path: '',
        component: pages_layout_component_1.PagesLayoutComponent,
        children: [
            { path: 'login', component: components_1.LoginComponent, data: { extraParameter: '' } },
            { path: 'register', component: components_1.RegisterComponent, data: { extraParameter: '' } },
            { path: 'forgot-password', component: components_1.ForgotPasswordComponent, data: { extraParameter: '' } }
        ]
    }
];
var AuthRoutingModule = /** @class */ (function () {
    function AuthRoutingModule() {
    }
    AuthRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], AuthRoutingModule);
    return AuthRoutingModule;
}());
exports.AuthRoutingModule = AuthRoutingModule;
