import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    
    defaultCurrency = "GBP"
    countryCode = "91"; // USA phone_code
    countryId = "91,"; // USA 

    constructor() { }
    
}