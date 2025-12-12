import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BankAccountDetailsService implements OnDestroy {

    isUpdateBankAccount: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor() { }

    ngOnDestroy() { }
}
