import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '../../../../core/services/until-destroyed';
import { Logger } from '../../../../core/logger/logger.service';
import { SwalService } from '../../../../core/services/swal.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

const log = new Logger('SocialNetworksComponent')

@Component({
    selector: 'app-social-networks',
    templateUrl: './social-networks.component.html',
    styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit, OnDestroy {
    socialNetworkData: Array<any> = [];
    dataNotFound: boolean = true;
    isUpdated: boolean = false;
    displayColumn: string[] = ['Sl No.', 'Social Network', 'Url', 'Status'];
    url: any;
    status: any;
    regConfig: FormGroup;
    noData:boolean=true ;
    updatingIds = new Set<number>();
    private readonly urlPattern = /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+(?:[\/?#][^\s]*)?$/i;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.apiHandlerService.apiHandler('socialNetwork', 'post')
            .pipe(
                finalize(() => this.dataNotFound = false),
                untilDestroyed(this)
            )
            .subscribe(resp => {
                log.debug(resp);
                const records = Array.isArray(resp && resp.data)
                    ? resp.data
                    : (Array.isArray(resp && resp.Data) ? resp.Data : []);
                if (this.isSuccessfulResponse(resp) && records.length) {
                    this.socialNetworkData = records;
                    this.noData=false;
                    let items = this.regConfig.get('items') as FormArray;
                    items.clear();
                    for (let val of records) {
                        items.push(this.fb.group({
                            id: new FormControl(val.id),
                            social_media_name: new FormControl(val.social_media_name, [Validators.required]),
                            url: new FormControl(val.url || '', [Validators.pattern(this.urlPattern)]),
                            created_by_id: new FormControl(val.created_by_id),
                            status: new FormControl(String(val.status), [Validators.required]),
                        }));
                    }
                }
                else{
                    this.noData=false;
                    this.socialNetworkData=[];
                }
            }, (err) => {
                this.noData = false;
                this.socialNetworkData = [];
            });
    }

    update(doc: FormGroup): void {
        doc.get('url').markAsTouched();
        doc.get('status').markAsTouched();
        if (doc.invalid || (doc.value.status === '1' && !doc.value.url)) {
            return;
        }

        const data = {
            id: doc.value.id,
            url: (doc.value.url || '').trim(),
            status: String(doc.value.status)
        }
        this.updatingIds.add(data.id);
        this.apiHandlerService.apiHandler('updateManageSocialLink', 'post', {}, {}, data)
        .pipe(
            finalize(() => this.updatingIds.delete(data.id)),
            untilDestroyed(this),
        )
        .subscribe( resp => {
            if (this.isSuccessfulResponse(resp)) {
                this.isUpdated = true;
                this.swalService.alert.update();
            } else {
                this.isUpdated = false;
                log.debug(resp.Data)
                this.swalService.alert.oops();
            }
        });
    }

    onStatusChange(doc: FormGroup): void {
        this.update(doc);
    }

    isUpdating(doc: FormGroup): boolean {
        return this.updatingIds.has(doc.get('id').value);
    }

    private isSuccessfulResponse(resp: any): boolean {
        return !!resp && (
            resp.Status === true ||
            resp.status === true ||
            resp.statusCode === 200 ||
            resp.statusCode === 201
        );
    }

    createForm() {
        this.regConfig = this.fb.group({
            items: new FormArray([])
        });
    }

    isUrlRequired(doc: FormGroup): boolean {
        return doc.get('status').value === '1' && !doc.get('url').value;
    }

    ngOnDestroy() {

    }

}


function getData() {
    return [
        {
            '#': 1,
            'Social Network': 'facebook',
            Url: 'https//www.facebook.com/',
            Action: true,
        },
        {
            '#': 2,
            'Social Network': 'twitter',
            Url: 'https://plus.google.com/travelomatix',
            Action: false,
        },
        {
            '#': 3,
            'Social Network': 'googleplus',
            Url: 'https://twitter.com/',
            Action: true,
        },
        {
            '#': 4,
            'Social Network': 'linkedin',
            Url: 'https://www.youtube.com/',
            Action: true,
        },
    ]
}
