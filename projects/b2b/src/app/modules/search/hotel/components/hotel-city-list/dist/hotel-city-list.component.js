"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelCityListComponent = void 0;
// tslint:disable:no-string-literal
// tslint:disable:curly
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var logger_service_1 = require("../../../../../core/logger/logger.service");
var core_2 = require("@angular/core");
var log = new logger_service_1.Logger('HotelCityList');
var HotelCityListComponent = /** @class */ (function () {
    function HotelCityListComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.getAirports = [];
        this.whichCity = new core_2.EventEmitter();
    }
    HotelCityListComponent.prototype.ngOnInit = function () {
        this.createForm();
    };
    HotelCityListComponent.prototype.createForm = function () {
        this.regConfig = this.formBuilder.group({
            checkArray: this.formBuilder.array([], [forms_1.Validators.required])
        });
    };
    HotelCityListComponent.prototype.ngOnChanges = function (changes) {
        this.getAirports = changes.getAirports.currentValue;
        var customAirports = [];
        this.getAirports.map(function (val, i, arr) {
            var pushedInSubAirport = false;
            for (var _i = 0, customAirports_1 = customAirports; _i < customAirports_1.length; _i++) {
                var v = customAirports_1[_i];
                if (v.AirportCity === (val.SubPriority ?
                    val.AirportCity : '')) {
                    if (!v['SubAirport'])
                        Object.assign(v, { SubAirport: [] });
                    v['SubAirport'].push(val);
                    pushedInSubAirport = true;
                    break;
                }
            }
            if (!pushedInSubAirport)
                customAirports.push(val);
        });
        this.getAirports = customAirports;
        // console.log(this.getAirports);
        // log.debug(JSON.stringify(this.getAirports));
    };
    Object.defineProperty(HotelCityListComponent.prototype, "hasViewList", {
        get: function () {
            try {
                if (this.getAirports.length)
                    return true;
                else
                    return false;
            }
            catch (error) {
                // console.log(error);
            }
        },
        enumerable: false,
        configurable: true
    });
    HotelCityListComponent.prototype.onAirportSelect = function (cityObj, inputFor) {
        cityObj['inputFor'] = inputFor;
        this.whichCity.emit(cityObj);
        this.getAirports.length = 0;
    };
    HotelCityListComponent.prototype.onCheckBoxChange = function (e) {
        var checkArray = this.regConfig.get('checkArray');
        if (e.target.checked) {
            checkArray.push(new forms_1.FormControl(e.target.value));
            // console.log(checkArray);
        }
        else {
            var i_1 = 0;
            checkArray.controls.forEach(function (item) {
                if (item.value === e.target.value) {
                    checkArray.removeAt(i_1);
                    return;
                }
                i_1++;
            });
        }
    };
    __decorate([
        core_1.Input()
    ], HotelCityListComponent.prototype, "getAirports");
    __decorate([
        core_1.Input()
    ], HotelCityListComponent.prototype, "inputFor");
    __decorate([
        core_1.Output()
    ], HotelCityListComponent.prototype, "whichCity");
    HotelCityListComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-city-list',
            templateUrl: './hotel-city-list.component.html',
            styleUrls: ['./hotel-city-list.component.scss']
        })
    ], HotelCityListComponent);
    return HotelCityListComponent;
}());
exports.HotelCityListComponent = HotelCityListComponent;
