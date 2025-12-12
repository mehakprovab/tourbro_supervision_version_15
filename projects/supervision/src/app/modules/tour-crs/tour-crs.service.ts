import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TourCrsService {
    isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    StaticContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelAirlineData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    updatedPriceManagement: BehaviorSubject<any> = new BehaviorSubject<any>({});
    getTourManagementData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    editTourCityData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    updateGallery(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateGalleryList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
   
   
    addGallery(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('addGallery', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
   
 
    getGalleryContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('getGalleryList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    deleteGallery(id): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteGalleryList', 'post', {}, {},id)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }
    ngOnDestroy() { }
    updateWhyChooseUs(data): Observable<any> {
        return this.apiHandlerService.apiHandler('whyChooseUsUpdate', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    updateTouristList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateTouristList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    updateBestTimetoTavel(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateBestTimeToTravelList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    addWhyChooseUs(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('whyChooseUsAdd', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    addTouristAttraction(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('addTouristList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    addBestTimeToTravel(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('addBestTimeToTravelList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    getTouristAttractionContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('getTouristList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    getWhyChooseUsContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('whyChooseUsRecordList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    getBestTimeToContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('getBestTimeToTravelList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    deleteBestTimeContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteBestTimeToTravelList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

}