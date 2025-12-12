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
                if (resp.Status) {
                    this.socialNetworkData = resp.data;
                    this.noData=false;
                    let items = this.regConfig.get('items') as FormArray;
                    for (let val of resp.data) {
                        items.push(this.fb.group({
                            id: new FormControl(val.id),
                            social_media_name: new FormControl(val.social_media_name, [Validators.required]),
                            url: new FormControl(val.url, [Validators.required]),
                            created_by_id: new FormControl(val.created_by_id),
                            status: new FormControl(val.status),
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

    update(doc): void {
        const data = {
            id: doc.value.id,
            url: doc.value.url,
            status: doc.value.status
        }
        this.apiHandlerService.apiHandler('updateManageSocialLink', 'post', {}, {}, data)
        .pipe(
            finalize( () => this.isUpdated = true),
            untilDestroyed(this),
        )
        .subscribe( resp => {
            if(resp.statusCode == 200 || resp.statusCode == 201){
                this.isUpdated = true;
                this.swalService.alert.update();
            } else {
                this.isUpdated = false;
                log.debug(resp.Data)
                this.swalService.alert.oops();
            }
        });
    }

    createForm() {
        this.regConfig = this.fb.group({
            items: new FormArray([])
        });
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
