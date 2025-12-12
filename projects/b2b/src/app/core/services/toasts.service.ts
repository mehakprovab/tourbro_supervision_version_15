import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastsParamsI { text: string; type: string; }


@Injectable({
  providedIn: 'root'
})
export class ToastsService {
  subject: Subject<any> = new Subject();
  constructor() { }

  toast(params: ToastsParamsI) {
    let type: string, icon: string;
    switch (params.type) {
      case 'success':
        type = 'success';
        icon = 'fa fa-check-circle';
        break;
      case 'error':
        type = 'danger';
        icon = 'fa fa-exclamation-circle';
        break;
      default:
        break;
    }
    const dataObj = {
      type,
      icon,
      text: params.text,
    };
    this.subject.next(dataObj);
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
