import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    
    defaultCurrency = "GBP"
    countryCode = "1"; // USA phone_code
    countryId = "281,"; // USA 

    constructor() { }
    
}