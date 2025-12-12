import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { untilDestroyed } from '../../../../core/services/until-destroyed';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const log = new Logger('LatestMembersComponent');

@Component({
    selector: 'app-latest-members',
    templateUrl: './latest-members.component.html',
    styleUrls: ['./latest-members.component.scss']
})
export class LatestMembersComponent implements OnInit, OnDestroy {

    latestMembers: object[] = [];
    howManyB2bUser: number = 0;
    howManyB2cUser: number = 0;
    howManySupAdminUser: number = 0;
    supscription: Subscription;
    noDataFound: boolean = true;
    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    ngOnInit() {
        this.apiHandlerService.apiHandler('latestMembers', 'post', '', '', {
            'offset': 0,
            'limit': 10
        })
        .pipe( finalize( () => { }) ,untilDestroyed(this))
        .subscribe(resp => {
            log.debug(resp);
            if (resp['Status']) {
                this.noDataFound = false;
                this.latestMembers = resp['Data'];
                this.latestMembers.forEach((val, index, arr) => {
                    if (val['user_type'] == 'B2B User')
                        this.howManyB2bUser++;
                    else if (val['user_type'] == 'B2C User')
                        this.howManyB2cUser++;
                    else this.howManySupAdminUser++;
                })
            }
        })
    }

    ngOnDestroy() {

    }

}
