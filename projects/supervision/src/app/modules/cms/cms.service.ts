import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CmsService {
    isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    StaticContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelAirlineData: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    updateContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateStaticPageContent', 'post', {}, {},data)
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
    addAgentFaq(data): Observable<any> {
        return this.apiHandlerService.apiHandler('addAgentFaq', 'post', {}, {},data)
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
  addFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('AddFaq', 'post', {}, {},data)
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
addCustomerFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('AddCustomerFaq', 'post', {}, {},data)
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
addserviceFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('AddServiceFaq', 'post', {}, {},data)
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

addaboutFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('AddAboutFaq', 'post', {}, {},data)
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
updateAgentFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('updateAgentFaq', 'post', {}, {},data)
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

updateFaq(data): Observable<any> {
    return this.apiHandlerService.apiHandler('UpdateFaq', 'post', {}, {},data)
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
deleteFaq(id): Observable<any> {
    return this.apiHandlerService.apiHandler('DeleteFaq', 'post', {}, {},id)
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
deleteAgentFaq(id): Observable<any> {
    return this.apiHandlerService.apiHandler('deleteAgentFaq', 'post', {}, {},id)
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
getFaqList(data): Observable<any> {
    return this.apiHandlerService.apiHandler('ListFaq', 'post', {}, {},data)
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
getAgentFaqList(data): Observable<any> {
    return this.apiHandlerService.apiHandler('listAgentFaq', 'post', {}, {},data)
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
getCustomerFaqList(data): Observable<any> {
    return this.apiHandlerService.apiHandler('ListCustomerFaq', 'post', {}, {},data)
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

getserviceFaqList(data): Observable<any> {
    return this.apiHandlerService.apiHandler('ListServiceFaq', 'post', {}, {},data)
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

getaboutFaqList(data): Observable<any> {
    return this.apiHandlerService.apiHandler('ListAboutFaq', 'post', {}, {},data)
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
    addContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('addStaticPageContent', 'post', {}, {},data)
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

    getStaticContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('staticPageContentList', 'post', {}, {},data)
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
    airlineHotelPartnerList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('airlineHotelPartnerList', 'post', {}, {},data)
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

    fetchTitleList(): Observable<any> {
        return this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {})
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

    getAlertData(): Observable<any> {
        return this.apiHandlerService.apiHandler('getAgentLoginAlert', 'post', {}, {})
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

    postAlertData(data,urlfilter): Observable<any> {
        let apiCall = urlfilter ? "addAgentLoginAlert" : "updateAgentLoginAlert";
        return this.apiHandlerService.apiHandler(apiCall, 'post', {}, {}, data)
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

    fetchSliderList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'post', {}, {},data)
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

    updateSliderListStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatCoreSliderSettingStatus', 'post', {}, {},data)
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

    updateContentListStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatCoreStaticPageContentStatus', 'post', {}, {},data)
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

    updateAgentFaqListStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateAgentFaqStatus', 'post', {}, {},data)
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

    updateIncludeMasterStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateIncludeMasterStatus', 'post', {}, {},data)
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


    updatePackageMasterStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatePackageMasterStatus', 'post', {}, {},data)
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

    updateAirlineHotelPartnerStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateAirlineHotelPartnerStatus', 'post', {}, {},data)
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
    deleteAirlineHotelPartner(data): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteAirlineHotelPartnerImage', 'post', {}, {},data)
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

    deleteSliderContent(id): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteCoreSliderSettings', 'post', {}, {},id)
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


    deleteStaticPageContent(id): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteStaticPageContent', 'post', {}, {},id)
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
    updateIncludeMaster(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateIncludeMaster', 'post', {}, {},data)
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


    updatePackageMaster(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatePackageMasterList', 'post', {}, {},data)
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

    addIncludeMaster(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('addIncludeMaster', 'post', {}, {},data)
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

    addCityPacakageMaster(data): Observable<any> {
        
        return this.apiHandlerService.apiHandler('addCityPacakageMaster', 'post', {}, {},data)
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

    getPackageIncludeList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('getPackageIncludeList', 'post', {}, {},data)
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


    getPackageMasterList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('PackageMasterList', 'post', {}, {},data)
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

    deleteIncludeMaster(data): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteIncludeMaster', 'post', {}, {},data)
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


    deletePackageMaster(data): Observable<any> {
        return this.apiHandlerService.apiHandler('deletePackageMasterList', 'post', {}, {},data)
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
    ngOnDestroy() { }

}
