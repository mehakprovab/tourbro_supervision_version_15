import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ThemeOptions } from '../../../../../theme-options';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { FlightService } from '../../../../../modules/search/flight/flight.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-currency-box',
    templateUrl: './currency-box.component.html',
})
export class CurrencyBoxComponent implements OnInit {
    @ViewChildren(NgbDropdown) currencyButton: QueryList<NgbDropdown>;

    public currencies = {top_currencies: [], other_currencies: []};
    public selectedCurrency = sessionStorage.getItem('selectedCurrency') || 'USD';
    public selectedCurrencyFlag = sessionStorage.getItem('selectedCurrencyFlag');
    constructor(
        public globals: ThemeOptions,
        public apiHandlerService: ApiHandlerService,
        public flightService: FlightService,
    ) {
        // console.log(this.selectedCurrency);
    }

    ngOnInit() {
        this.apiHandlerService.apiHandler('currencyList', 'POST').subscribe(res => {
            if (res == null ? false : res.Status == true) {
                this.currencies = res.Data.CurrencyList;
                this.selectedCurrency = res.Data['SelectedCurrency'] || this.selectedCurrency;
            } else {
                // alert('Something went wrong, please try again.');
            }
        });
    }

    changeCurrency(currency: string, currency_flag: string) {        
        this.flightService.currentCurrency.next(currency);
        this.apiHandlerService.apiHandler('currencyConversionRate', 'POST', '', '', {
            to_currency: currency
        }).subscribe(res => {
            if (res == null ? false : res.Status == true) {
                const currentRate = res.data.CurrencyConversionRate['USD' + currency];
                this.flightService.currentCurrencyRate.next(parseFloat(currentRate));
                if (this.flightService.searchFlightSubmitted) {
                    this.flightService.getResponse(this.flightService.searchResponseCopy.value);
                }
                if (this.flightService.bookingFlightData.value) {
                    const result = this.flightService.changeCurrencyUpdateFareQuote(this.flightService.bookingFlightData.value);
                    this.flightService.bookingFlightData.next(result);
                }
                if (this.flightService.extraServices.value) {
                    const result = this.flightService.changeCurrencyExtraServices(this.flightService.extraServices.value);
                    this.flightService.extraServices.next(result);
                }
                if (this.flightService.CommitBookingResponse.value) {
                    const result = this.flightService.changeCurrencyCommitBooking(this.flightService.CommitBookingResponse.value);
                    this.flightService.CommitBookingResponse.next(result);
                }
                if (this.flightService.FinalBookingResponse.value) {
                    const result = this.flightService.changeCurrencyFinalBooking(this.flightService.FinalBookingResponse.value);
                    this.flightService.FinalBookingResponse.next(result);
                }
                this.selectedCurrency = currency;
                this.selectedCurrencyFlag = currency_flag;
                sessionStorage.setItem("selectedCurrency", currency);
                sessionStorage.setItem("selectedCurrencyFlag", currency_flag);
            } else {
            }
            this.currencyButton.first.close();
        });
    }

}
