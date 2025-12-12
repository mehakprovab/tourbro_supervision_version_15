import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';

let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-b2c-markup-detail',
    templateUrl: './agent-b2c-markup-detail.component.html',
    styleUrls: ['./agent-b2c-markup-detail.component.scss']
})
export class AgentB2cMarkupDetailComponent implements OnInit {

    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    noData: boolean = true;
    markupList: Array<any> = [];
    agentList: any;
    agencyDetails: any;
    airlineLogoUrl = "https://Booking247.com/airline_logo/";

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_name', value: 'Airlines' },
        // { key: 'value_type', value: 'Value Type' },
        { key: 'value', value: 'Value (%)' },
        { key: 'segments', value: 'Segment List (%)' },
        { key: 'action', value: 'Action' }
    ];
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private markupService: MarkupService,
        private cd: ChangeDetectorRef,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.getB2cMarkupList();
    }

    delete(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.getB2cMarkupList();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = JSON.parse(segment);
        return segment_list;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.cd.detach();
        this.markupService.agentMarkupB2CDetails.next({});
    }

    getB2cMarkupList() {
        this.noData=true;
        this.markupList=[];
        let req = {};
        req['module_type'] = 'b2c_flight';
        req['type'] = "specific";
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, req).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.markupList = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
            }
            else{
                this.noData=false;
                this.markupList=[];
            }
        }, (err) => {
            this.noData = false;
            this.markupList = [];
        });
    }


    updateMarkup(data) {
        this.markupService.toUpdateB2CData.next(data);
        this.markupService.isEditMode = true;
        this.toUpdate.emit({ tabId: 'default_markup', data });
    }

    deleteMarkup(data) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.delete(data.id);
            } else {
                console.log("Not delete")
            }
        })
    }

    getSegmentList(data) {
        let segmentValue = (data.match(/-?(\d+)/));
        return `- ${segmentValue[1]}`;
    }


}
