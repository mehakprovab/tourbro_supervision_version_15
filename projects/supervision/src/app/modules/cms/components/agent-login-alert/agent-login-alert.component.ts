import { Component, OnInit, OnDestroy } from '@angular/core';
import { CmsService } from '../../cms.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-agent-login-alert',
    templateUrl: './agent-login-alert.component.html',
    styleUrls: ['./agent-login-alert.component.scss']
})
export class AgentLoginAlertComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    addOrupdate: boolean;
    regConfig: FormGroup;

    public model = {
        editorData: ''
    };

    public editorConfig = {
        type: "divarea",
        uiColor: '#FFFFFF',
        forcePasteAsPlainText: true,
        allowedContent: false,
    }

    constructor(
        private cmsService: CmsService,
        private swalService: SwalService,
        private fb: FormBuilder
    ) {
       
    }

    ngOnInit() {
        this.creatForm();
        this.getLoginAlert();
    }

    creatForm(){
        this.regConfig = this.fb.group({
            editorData: new FormControl('')
        })
    }


    getLoginAlert() {
        this.subSunk.sink = this.cmsService.getAlertData()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.model.editorData = resp.data[0].login_alert_description;
                    this.addOrupdate = resp.data.length == 0 ? true : false;
                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }


    onSubmit() {
        if (!this.model.editorData)
        return;
        let data = { login_alert_description: this.model.editorData }

        if (!this.addOrupdate) {
            Object.assign(data, { id: 1 })
        }
        this.subSunk.sink = this.cmsService.postAlertData(data, this.addOrupdate)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    console.log(resp);
                    this.swalService.alert.success("Alert Updated Successfully.");
                    this.getLoginAlert();
                    this.addOrupdate = resp.data == '' || [] ? true : false;
                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })

    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
