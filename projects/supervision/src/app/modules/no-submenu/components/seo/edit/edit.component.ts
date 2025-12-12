import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SEOService } from '../seo.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

const log = new Logger('EditComponent');

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    @Input() getDataToUpDate: any;
    @Output() someEvent = new EventEmitter<boolean>(false);
    regConfig: FormGroup;
    constructor(
        private seoService: SEOService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private _router: Router
    ) {
        this.createForm();
    }

    ngOnInit() {
        log.debug(this.getDataToUpDate);
        if (this.getDataToUpDate) {
            this.regConfig.patchValue({
                title: this.getDataToUpDate.title,
                keyword: this.getDataToUpDate.keyword,
                description: this.getDataToUpDate.description,
                module: this.getDataToUpDate.module
            })
        }
    }
    onSubmit() {
        log.debug(this.regConfig.value);
        if (!this.regConfig.valid) {
            this.swalService.alert.oops();
            return;
        }
        const data = Object.assign({
            seo_id: this.getDataToUpDate.id,
            status: this.getDataToUpDate.status,
        }, this.regConfig.value);
        this.seoService.update(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.swalService.alert.update();
                this.reloadComponent();
            } else if (resp.statusCode == 404)
                this.swalService.alert.error();
            else if (resp.statusCode == 400){
                this.swalService.alert.oops('Sorry..! Please edit the data!!!');
            }
        })
    }
    createForm() {
        this.regConfig = this.fb.group({
            title: new FormControl('', [Validators.required]),
            keyword: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            module: new FormControl('', [Validators.required])
        })
    }
    reloadComponent() {
        this._router.routeReuseStrategy.shouldReuseRoute = () => false;
        this._router.onSameUrlNavigation = 'reload';
        this._router.navigate(['/seo']);
    }
    goBack() {
        this.someEvent.next(true);
    }
}
