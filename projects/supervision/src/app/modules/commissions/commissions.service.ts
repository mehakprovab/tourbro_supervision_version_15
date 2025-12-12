import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommissionsService {

    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentCommissionDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    selectedAgent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor() { }
}
