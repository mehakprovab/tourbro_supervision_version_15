import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from 'projects/supervision/src/app/modules/cms/cms.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-update-faq-widget',
  templateUrl: './add-update-faq-widget.component.html',
  styleUrls: ['./add-update-faq-widget.component.scss']
})
export class AddUpdateFaqWidgetComponent implements OnInit {

  @Output() staticContentTab = new EventEmitter<any>();
    regConfig: FormGroup;
    private subSunk = new SubSink();
    addOrUpdate;
    public model = {
        editorData: ''
    };
  constructor(private fb: FormBuilder, private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cmsService: CmsService,
    private utility: UtilityService) { }

  ngOnInit() {
    this.createForm();
    this.getToUpdate()
  }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            question: new FormControl('', [Validators.required]),
            answer: new FormControl('',[Validators.required]),
            
        });
    }


onSubmit() {
   // console.log(this.addOrUpdate,this.regConfig.value);

    if (this.regConfig.invalid) {
        return;
    }
    let req = JSON.parse(JSON.stringify(this.regConfig.value));
    //console.log(this.addOrUpdate,typeof req.id);
    req['data_source'] = "b2c";
    switch (this.addOrUpdate) {
        case 'add':
            this.subSunk.sink = this.cmsService.addAgentFaq(req)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("Content added successfully.");
                        this.regConfig.reset();
                        this.staticContentTab.emit({ tabId: 'staticpage_list' });
                    } else {
                        this.swalService.alert.oops();
                    }
                }, (err: HttpErrorResponse) => {
                    console.error(err);
                    this.swalService.alert.oops();
                })
            break;
        case 'update':
            delete req.title;
            
            this.subSunk.sink = this.cmsService.updateAgentFaq(req)
                .subscribe(resp => {
                    console.log("error", resp);
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("Content updated successfully.");
                        this.regConfig.reset();
                        this.staticContentTab.emit({ tabId: 'staticpage_list' });
                    } else {
                        this.swalService.alert.oops();
                    }
                }, (err: HttpErrorResponse) => {
                    console.error(err);
                    this.swalService.alert.oops();
                })
            break;
        default:
            break;
    }

}
getToUpdate() {

    this.subSunk.sink = this.cmsService.StaticContent.subscribe(data => {
        console.log(data)
        if (!this.utility.isEmpty(data)) {

            this.addOrUpdate = 'update';
            this.regConfig.patchValue({
                id: data.id ? data.id : '',
                question: data.question ? data.question : '', 
                answer: data.answer ? data.answer : '',
             
                // status: data.status ? data.status : '',
    

            }, { emitEvent: false })
            this.model.editorData=data.page_description;
        }else{
          this.addOrUpdate = 'add';
        }
    })
} 

    onReset(){
        this.cmsService.StaticContent.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
        this.regConfig.patchValue({
            page_description: '',
        })
    } 

}

