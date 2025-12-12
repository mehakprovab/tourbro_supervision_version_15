import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Logger } from '../../../../../../core/logger/logger.service';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';

const log = new Logger

@Component({
    selector: 'app-send-itinerary',
    templateUrl: './send-itinerary.component.html',
    styleUrls: ['./send-itinerary.component.scss']
})
export class SendItineraryComponent implements OnInit, OnDestroy {

    @Input('flight') flight: any;

    regConfig: FormGroup;

    protected subs = new SubSink();
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.regConfig = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.email, Validators.minLength(1)]),
            markup: new FormControl('', [Validators.maxLength(40), Validators.minLength(0)])
        })

    }

    onSubmit() {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.regConfig.invalid) {
            return false;
        } else {
            this.subs.sink = this.apiHandlerService.apiHandler('sendItinerary','POST','','',{
                ResultToken: this.flight.ResultToken,
                email: this.regConfig.get('email').value,
                markup_value: this.regConfig.get('markup').value,
                UserId:currentUser['id']
            }).subscribe(res => {
                this.swalService.alert.success('Email sent successfully!');
                this.regConfig.markAsUntouched();
            }, (err) => {
                this.swalService.alert.oops(err.message);
            });
            
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    
}
