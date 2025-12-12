import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';

const log = new Logger('header/DotsComponent');

@Component({
    selector: 'app-dots',
    templateUrl: './dots.component.html',
    styleUrls: ['./dots.component.scss']
})
export class DotsComponent implements OnInit {

    noData: boolean = true;
    respData: Array<any> = [];

    constructor(
        private headerService: HeaderService
    ) { }

    ngOnInit() {
        this.getLatestEventNotfications();

    }

    getLatestEventNotfications() {
        const data = [{ 
            user_id: 80,
        }]
        data['topic'] = 'latestEventNotfications'
        this.headerService.fetch(data)
            .subscribe( resp => {
                if(resp.statusCode == 200){
                    this.noData = false;
                    this.respData = resp.data['latestnotifications'];
                    log.debug(this.respData);
                }
            })
    }
}
