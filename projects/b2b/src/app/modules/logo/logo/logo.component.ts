import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { LogoService } from '../logo.service';
import { UtilityService } from '../../../core/services/utility.service';

const log = new Logger('logo/LogoComponent');

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnDestroy {

    regConfig: FormGroup;
    @ViewChild('theFile', { static: true }) theFile: ElementRef;
    constructor(
        private fb: FormBuilder,
        private logoService: LogoService,
        private swalService: SwalService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.createForm();
        this.getDomainLogo();
    }

    onFileSelected($event) {
        const file = $event.target.files[0];
        this.regConfig.get('logo_name').setValue(file);

    }

    getDomainLogo() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'domainLogo';
        this.logoService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.regConfig.get('logo_name').setValue(resp.data['logo']);
                } else { log.debug('oops noData found', resp); }
            });

    }

    onSubmit() {
        if (this.regConfig.invalid)
            return;

        const formData = new FormData();
        formData.append('logo_name', this.regConfig.get('logo_name').value);
        formData.append('agent_id', this.utility.readStorage('currentUser', sessionStorage)['user_id']);
        const data = [{ data: formData }];
        data['topic'] = 'updateDomainLogo';
        log.debug(data);
        this.logoService.update(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.regConfig.reset();
                    this.swalService.alert.success(resp.msg);
                }
                else
                    this.swalService.alert.oops(resp.msg);
            })
    }
    onReset() {
        this.regConfig.reset();
    }

    createForm() {
        this.regConfig = this.fb.group({
            logo_name: new FormControl('', [Validators.required]),
        })
    }

    ngOnDestroy() { }

}
