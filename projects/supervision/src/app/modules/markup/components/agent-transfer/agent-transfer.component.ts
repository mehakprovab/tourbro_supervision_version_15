import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { MarkupService } from '../../markup.service';

@Component({
  selector: 'app-agent-transfer',
  templateUrl: './agent-transfer.component.html',
  styleUrls: ['./agent-transfer.component.scss']
})
export class AgentTransferComponent implements OnInit {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    respData: Array<any> = [];
    defaultCurrency: string = 'USD';
    supplierList :Array<any> = [];
    noData: boolean = true;
    respAgentData: Array<any> = [];
    booking_source:any;
    agent_id:string="";
    markupList: Array<any> = [];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'agent_name', value: 'Agent Name' },
        { key: 'supplier', value: 'Supplier Name' },
        { key: 'value', value: 'Value' },
        { key: 'action', value: 'Action' }
    ];
    selectedAgent:any;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private util: UtilityService,
        private appService: AppService,
        private markupService: MarkupService,
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.getUsersList();
        this.getSuppliers();
       this.getMarkupList();
    }
    
    getMarkupList(){
        this.noData=true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
        "module_type": "b2b_transfer",
        "type": "agent_group",
        "user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
        "is_deleted": 0
    }).subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.noData=false;
            this.respData = resp.data;
            const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(this.respData[0].group_id));
            this.agent_id=selectedAgent.id;
            // this.regConfig.patchValue({
            //     markupType: this.respData[0].value_type,
            //     markupValue: this.respData[0].value,
            //     suppliers:"Hoppa",
            //     agent_id:selectedAgent.name

            // })
          
        } else {
            this.noData=false;
            this.swalService.alert.oops();
        }
    }, (err: HttpErrorResponse) => {
        this.noData=false;
        this.swalService.alert.oops();
    });
}
        selectedAgentList(agent){
            if(agent.group_id != '0'){
            const agentData = agent;
            const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(agentData.group_id));
            return this.selectedAgent = selectedAgent.name;
            }else{
                return  0; 
            }
            // return  this.selectedAgent;
     }
    createForm() {
        this.regConfig = this.fb.group({
            markupType: ['percentage', Validators.required],
            markupValue: ['', Validators.required],
            agent_id: [null, Validators.required],
            suppliers:['', Validators.required],
        });
    }

    onSubmit(val) {
        if (this.regConfig.invalid)
            return;

        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {},
            {
                // "type": "generic",
                "fare_type": "Public",
                "module_type": "b2b_transfer",
                "flight_airline_id": 0,
                "supplier":this.booking_source,
                "type":"agent_group",
                "group_id":this.agent_id.toString(),
                "value": parseInt(this.regConfig.get('markupValue').value),
                "value_type": this.regConfig.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency,
                "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            }).subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.regConfig.reset();
                    this.getMarkupList();
                }
            })

    }
    getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "transfer",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }
    getUsersList() {
        this.noData=true;
        this.respData=[];
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
       onSelectionChanged(event) {
        this.agent_id= event.option.id;
    }
    selectedLocation(suppliers) {
        this.booking_source = `${suppliers['source_key']}`;
        return;
    }
    delete(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.getMarkupList();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = JSON.parse(segment);
        return segment_list;
    }

  

    // getB2cMarkupList() {
    //     this.noData=true;
    //     this.markupList=[];
    //     let req = {};
    //     req['module_type'] = 'b2c_flight';
    //     req['type'] = "specific";
    //     this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, req).subscribe(resp => {
    //         if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
    //             this.noData = false;
    //             this.markupList = resp.data || [];
    //             respDataCopy = JSON.parse(JSON.stringify(resp.data));
    //         }
    //         else{
    //             this.noData=false;
    //             this.markupList=[];
    //         }
    //     }, (err) => {
    //         this.noData = false;
    //         this.markupList = [];
    //     });
    // }


    updateMarkup(data) {
        this.markupService.toUpdateB2CData.next(data);
        this.markupService.isEditMode = true;
        // this.toUpdate.emit({ tabId: 'default_markup', data });
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

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
        getSupplier(data) {
        if(data) {
            return JSON.parse(data);
        }
    }
}
