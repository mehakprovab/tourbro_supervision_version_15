import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const prodution = environment.production;

@Injectable({
    providedIn: 'root'
})

export class ConfService {

    constructor(){}
    config() {
        if (prodution) {
            return {
                voucher: 'http://3.7.156.89/reports/flight-voucher'
            }
        } else return {
            voucher: '/reports/flight-voucher'
        }
    }

}

