import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkupB2bService {

    toUpdateB2BData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentMarkupB2BDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    isEditMode = false;

    constructor() { }
}
