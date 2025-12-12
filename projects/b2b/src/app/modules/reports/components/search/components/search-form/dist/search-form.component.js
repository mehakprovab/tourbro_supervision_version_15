"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SearchFormComponent = void 0;
var core_1 = require("@angular/core");
var SearchFormComponent = /** @class */ (function () {
    function SearchFormComponent(fb) {
        this.fb = fb;
        this.searchFormEvent = new core_1.EventEmitter();
        this.createSearchForm();
        var currentYear = new Date().getFullYear();
        // this.fromMinDate = new Date();
        // this.fromMaxDate = new Date(currentYear + 1, 11, 31);
        this.toMinDate = new Date();
        this.toMaxDate = new Date(currentYear + 1, 11, 31);
    }
    SearchFormComponent.prototype.ngOnInit = function () {
    };
    SearchFormComponent.prototype.addEvent = function (type, event) {
        this.toMinDate = event.value ? event.value : new Date();
    };
    SearchFormComponent.prototype.createSearchForm = function () {
        this.searchForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
            transactionId: ['']
        });
    };
    SearchFormComponent.prototype.onSubmit = function () {
        console.log(this.searchForm.value);
        this.searchFormEvent.emit(this.searchForm.value);
    };
    SearchFormComponent.prototype.resetSearch = function () {
        this.searchForm.reset();
        this.searchFormEvent.emit(this.searchForm.value);
    };
    __decorate([
        core_1.Output()
    ], SearchFormComponent.prototype, "searchFormEvent");
    SearchFormComponent = __decorate([
        core_1.Component({
            selector: 'app-search-form',
            templateUrl: './search-form.component.html',
            styleUrls: ['./search-form.component.scss']
        })
    ], SearchFormComponent);
    return SearchFormComponent;
}());
exports.SearchFormComponent = SearchFormComponent;
