import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';

const log = new Logger('LatestMembersComponent');

@Component({
    selector: 'app-latest-members',
    templateUrl: './latest-members.component.html',
    styleUrls: ['./latest-members.component.scss']
})
export class LatestMembersComponent implements OnInit, OnDestroy {

    latestMembers: object[] = [];
    howManySubAgentUser: number = 0;
    howManyAgentUser: number = 0;
    howManyStaffUser: number = 0;
    supscription: Subscription;
    noDataFound: boolean = true;
    subSunk = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('latestMembers', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.noDataFound = false;
                    this.latestMembers = resp['data'];
                    this.latestMembers.forEach((val, index, arr) => {
                        if (val['authRole']['name'] == 'Sub Agent')
                            this.howManySubAgentUser++;
                        else if (val['authRole']['name'] == 'Agent')
                            this.howManyAgentUser++;
                        else if (val['authRole']['name'] == 'Staff')
                            this.howManyStaffUser++;
                    })
                }
            })
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
