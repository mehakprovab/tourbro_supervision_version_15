import { Injectable } from '@angular/core';
import { ApiHandlerService } from '../../core/api-handlers';
import { untilDestroyed } from '../../core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TransferCrsService {
    seasonList = new BehaviorSubject<any>('');
     roomDetailList = new BehaviorSubject<any>('');
     addedHotelDetail = new BehaviorSubject<any>('');
     RoomImage =new BehaviorSubject<boolean>(false);
     roomId= new BehaviorSubject<any>('');
     showPrice=new BehaviorSubject<boolean>(false);
     showCancel=new BehaviorSubject<boolean>(false);
     updateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
     transferUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
     updatTransferData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
        private apiHandlerService: ApiHandlerService,
        private httpClient: HttpClient
    ) { }

    
     fetch(data?: any): Observable<any> {
        console.log("data",data)
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }
    
     update(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='uploadHotelLogo' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

  
    ngOnDestroy() { }


}
