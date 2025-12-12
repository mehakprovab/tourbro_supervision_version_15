import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHandlerService } from '../../core/api-handlers/api-handlers.service';
import { map, shareReplay } from 'rxjs/operators';
import { untilDestroyed } from '../../core/services/until-destroyed';

@Injectable({
    providedIn: 'root'
})
export class MarkupService {

    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentMarkupDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    selectedAgent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    toUpdateB2CData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    toUpdateB2CSupplierData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentMarkupB2CDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    isEditMode = false;
    constructor(private apiHandlerService: ApiHandlerService,) { }

   
}
