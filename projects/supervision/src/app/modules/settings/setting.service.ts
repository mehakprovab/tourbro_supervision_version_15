import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingService {

    isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
    promoCodeUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    domainLogo = new BehaviorSubject<object>([]);
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private httpClient: HttpClient
    ) { }

    ngOnDestroy() { }
}
