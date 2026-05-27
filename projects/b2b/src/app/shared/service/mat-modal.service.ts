/**
 * Generic Material Modal Open Service.
 * Author: Rajesh Malakar,
 * Email: rajeshmbg3@gmail.com
 */

// tslint:disable:no-redundant-jsdoc
import { Injectable, OnDestroy, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

export interface ModalConfigDataI {
  component: any;
  width?: string;
  height?: string;
  disableClose?: boolean;
  data?: any;
}

export const ModalConfigDefault = {
  component: '', width: '300px', height: 'auto', disableClose: false, autoFocus: true
};

/**
   * this function is to check empty object
   * if empty return true else false
   * @param obj object to be passed
   * @returns boolean true | false
   */
function isEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

@Injectable({
  providedIn: 'root'
})
export class MatModalService implements OnDestroy {

  emitter: Subject<any> = new Subject();

  constructor(
    private matDialog: MatDialog,
    // private conf: ConfService
  ) { }
  /**
   * This function is to open the modals dinamically
   * @param ModalConfigDataI modalConfigData
   * @memberof MatModalService
   */
  openDialog(modalConfigData: ModalConfigDataI): any {
    if (!modalConfigData.data) {
      delete modalConfigData.data;
    }
    const dialogRef = this.matDialog.open(modalConfigData.component, modalConfigData);
    dialogRef.afterClosed().subscribe(result => {
      if (!isEmpty(result)) {
        result.noData = false;
        this.emitter.next(result);
      } else {
        result = {};
        result.noData = true;
        this.emitter.next(result);
      }
    });
  }
  /**
   * This function is to receive any data passed form the calling component
   * (i.e. here it will be modal component)to the called component
   * (i.e. component where this service is injected)
   */
  getData(): Observable<any> {
    return this.emitter.asObservable();
  }

  ngOnDestroy() {
    this.emitter.unsubscribe();
  }
}
