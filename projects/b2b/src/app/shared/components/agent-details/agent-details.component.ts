import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from '../../../core/services/utility.service';
import { ThemeOptions } from '../../../theme-options';


const log = new Logger('SharedModule/AgentDetailsComponent');

@Component({
    selector: 'app-agent-details',
    templateUrl: './agent-details.component.html',
    styleUrls: ['./agent-details.component.scss'],
})
export class AgentDetailsComponent implements OnInit, OnDestroy {
    noData: boolean = true;
    respData: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utilityService: UtilityService,
        public global: ThemeOptions,
        private utility: UtilityService 
    ) { }
    ngOnInit(): void {
            this.fetchAgentDetails();
    }

    fetchAgentDetails(): void {
        this.apiHandlerService.apiHandler('agentDetails', 'post', {}, {}, { agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] })
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if (resp.Status) {
                    this.noData = false;
                    this.respData = resp.Data;
                } else {
                    log.debug('no data found', resp);
                }
            })
    }

    get getStyle() {
        let styles = {
            'width': this.global.toggleSidebar ? '93%' : '77%'
        }
        return styles;
    }

    ngOnDestroy() { }
}