import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MarkupB2bService } from '../markup-b2b.service';

let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-markup-b2b-details',
    templateUrl: './agent-markup-b2b-details.component.html',
    styleUrls: ['./agent-markup-b2b-details.component.scss']
})
export class AgentMarkupB2bDetailsComponent implements OnInit, OnDestroy {

    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    noData: boolean = true;
    markupList: Array<any> = [];
    agentList: any;
    agencyDetails: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_name', value: 'Airlines' },
        { key: 'value_type', value: 'Value Type' },
        { key: 'value', value: 'Value' },
        { key: 'segments', value: 'Segment List' },
        { key: 'action', value: 'Action' }
    ];
    airLineLogoUrl: string = 'https://booking247.com:4018/b2b/airline_logo/';
    constructor(
        private apiHandlerService: ApiHandlerService,
        private markupService: MarkupB2bService,
        private cd: ChangeDetectorRef,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.getB2bMarkupList();
    }

    delete(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.getB2bMarkupList();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = segment ? JSON.parse(segment) : null;
        return segment_list;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.cd.detach();
        this.markupService.agentMarkupB2BDetails.next({});
    }

    getB2bMarkupList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('markupList', 'post', {}, {}, {
            "module_type": "b2b_flight",
            "is_deleted": 0
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.markupList = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
            }
        })
    }


    updateMarkup(data) {
        this.markupService.toUpdateB2BData.next(data);
        this.markupService.isEditMode = true;
        this.toUpdate.emit({ tabId: 'default_markup', data });
    }

    deleteMarkup(data) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.delete(data.id);
            } else {
            }
        })
    }

}
