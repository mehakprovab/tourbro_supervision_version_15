import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { interval } from 'rxjs';

const log = new Logger('header/DotsComponent');

@Component({
    selector: 'app-dots',
    templateUrl: './dots.component.html',
    styleUrls: ['./dots.component.scss']
})
export class DotsComponent implements OnInit,OnDestroy {
    private subSink = new SubSink();
    public bellIcon: string = "assets/images/login-images/assets/bell.png";

    noData: boolean = true;
    respData: Array<any> = [];
    activationCount : any;
    
    constructor(
        private headerService: HeaderService,
        private utility: UtilityService,
        private apiHadlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getLatestEventNotfications();

        this.subSink.sink = interval(60000 * 3).subscribe(() =>{
            this.getLatestEventNotfications();
          //  this.getActiveNotificationCount();
        })
    }

    getLatestEventNotfications() {
        this.subSink.sink = this.apiHadlerService.apiHandler('notifications', 'POST',{},{},{"active":false})
        .subscribe(res => {
            if (res.statusCode == 200 || res.statusCode==201) {
               this.respData = res.data;
               let viewed = this.respData.filter(obj => obj.viewed_datetime == null)
               this.activationCount = viewed.length
               this.cdr.detectChanges()
            }
        });
    }

    getActiveNotificationCount(){
        this.subSink.sink = this.apiHadlerService.apiHandler('activeNotificationCount', 'POST',{},{},{})
        .subscribe(res => {
            if (res.statusCode == 200 || res.statusCode==201) {
               this.activationCount = res.data[0]['count'];
               this.cdr.detectChanges()
            }
        });
    }

    viewNotifications(){
        if(this.respData && this.respData.length > 0){
            const ids = this.respData.map(a=>a.timeline_id)
            const req = {ids:ids}
            this.subSink.sink = this.apiHadlerService.apiHandler('updateViewedNotifications', 'POST',{},{},req)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode==201) {
                }
            });
        }
        
    }

    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

}
