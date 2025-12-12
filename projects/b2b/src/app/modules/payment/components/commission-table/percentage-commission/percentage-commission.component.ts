import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-percentage-commission',
    templateUrl: './percentage-commission.component.html',
    styleUrls: ['./percentage-commission.component.scss']
})
export class PercentageCommissionComponent implements OnInit {

    items: Array<{}> = [
    ];
    noData: boolean = true;
    subSunk = new SubSink();

    constructor(
        private apiHandlerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('commissionList', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201 && resp.data.length) {
                    this.noData = false;
                    resp.data.map(val => {
                        let module = val.module_type.split("_")[1];
                        switch (module) {
                            case 'flight':
                                val['icon'] = "fa fa-plane";
                                val['moduleName'] = 'FLIGHT';
                                break;
                            case 'hotel':
                                val['icon'] = "fa fa-bed";
                                val['moduleName'] = 'HOTEL';
                                break;
                            case 'car':
                                val['icon'] = "fa fa-car";
                                val['moduleName'] = 'CAR';
                                break;
                            case 'insurance':
                                val['icon'] = "fa fa-umbrella";
                                val['moduleName'] = 'INSURANCE';
                                break;
                            case 'activity':
                                val['icon'] = "fa fa-plane";
                                val['moduleName'] = 'ACTIVITY';
                                break;
                        }
                    });
                    this.items = resp['data'];
                }
            })
    }

}
