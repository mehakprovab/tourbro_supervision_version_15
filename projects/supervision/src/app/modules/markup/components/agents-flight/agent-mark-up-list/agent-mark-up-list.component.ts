import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';


let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-mark-up-list',
    templateUrl: './agent-mark-up-list.component.html',
    styleUrls: ['./agent-mark-up-list.component.scss']
})
export class AgentMarkUpListComponent implements OnInit {

    @Output() toUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  noData: boolean = true;
  markupList: Array<any> = [];
  agentList: any;
  agencyDetails: any;
  airlineLogoUrl = "https://Booking 247.com/airline_logo/";
  selectedAgent:any;
  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'airline_name', value: 'Supplier Name' },
      { key: 'group_name', value: 'Group Name' },
      { key: 'value', value: 'Value' },

      { key: 'action', value: 'Action' }
  ];
  respAgentData: Array<any> = [];
  constructor(
      private apiHandlerService: ApiHandlerService,
      private fb: FormBuilder,
      private markupService: MarkupService,
      private cd: ChangeDetectorRef,
      private swalService: SwalService
  ) { }

  ngOnInit() {
       this.getUsersList()
      this.getB2bMarkupList();
  }

  delete(id) {
      this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.getB2bMarkupList();
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

  getB2bMarkupList() {
      this.noData=true;
      this.markupList=[];
      let req = {};
      req['module_type'] = 'b2b_flight';
      req['type'] = 'supplier';
    // req['type'] = 'agent_group';

      this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, req).subscribe(resp => {
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
    console.log("data",data)
      this.markupService.toUpdateData.next(data);
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
  getUsersList() {
    this.noData=true;
    // this.respData=[];
    this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {},
        { "status": 1,})
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                this.noData = false;
                this.respAgentData = resp.data || [];
            }
            else {
                this.noData = false;
                this.respAgentData=[];
            }
        }, (err) => {
            this.noData = false;
            this.respAgentData=[];
        });
}
  selectedAgentList(agent){
    this.selectedAgent = 0;
    if(agent.group_id != '0'){
    const agentData = agent;
    const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(agentData.group_id));
     
     if (selectedAgent !== undefined) {
        this.selectedAgent = selectedAgent.name;
     } else {
        this.selectedAgent = 0;
     }
     
    }else{
        return  0; 
    }
    return  this.selectedAgent;
}

}
