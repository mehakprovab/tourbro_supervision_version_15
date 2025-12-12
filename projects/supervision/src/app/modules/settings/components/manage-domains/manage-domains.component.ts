import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '../../../../core/services/until-destroyed';
import { Logger } from '../../../../core/logger/logger.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SwalService } from '../../../../core/services/swal.service';
import { SubSink } from 'subsink';
import { UtilityService } from '../../../../core/services/utility.service';

const log = new Logger('ManageDomainsComponent');

@Component({
    selector: 'app-manage-domains',
    templateUrl: './manage-domains.component.html',
    styleUrls: ['./manage-domains.component.scss']
})
export class ManageDomainsComponent implements OnInit, OnDestroy {
    regConfig: FormGroup;
    submitted = false;
    subscription: Subscription;
    noData: boolean = true;
    manageDomainData: any;
    countryListData: object[] = [];
    cityListData: object[] = [];
    subSunk = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private util: UtilityService
    ) { this.createForm(); }

    ngOnInit() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
            .pipe(
                finalize(() => {
                    this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.manageDomainData = resp.data[0];
                    const { domain_name, email, address, phone } = this.manageDomainData;
                    this.regConfig.patchValue(
                        {
                            domain_name,
                            email,
                            address,
                            phone,
                        });
                }

            });
    }

    onSubmit() {
        this.submitted = true;
        if (this.regConfig.invalid) {
            return;
        }
        let data = Object.assign({}, {
            domain_name: this.regConfig.value.domain_name,
            domain_email: this.regConfig.value.email,
            domain_phone: this.regConfig.value.phone,
            domain_address: this.regConfig.value.address
        });
        this.subSunk.sink = this.apiHandlerService.apiHandler('UpdateDomain', 'post', {}, {}, data)
            .pipe(
                finalize(() => {
                    this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update();
                }
                else {
                    this.swalService.alert.oops('Oops..! Sorry no data updated');
                }
            })
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            domain_name: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            email: new FormControl('', [Validators.email, Validators.maxLength(120)]),
            phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(120), Validators.maxLength(13), Validators.pattern(this.util.regExp.phone)]),
            address: new FormControl('', [Validators.required, Validators.maxLength(300)]),
        })
    }

    getCountries() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', {}, {}, {})
            .pipe(
                finalize(() => {
                    this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug(resp);
                if (resp.Status)
                    this.countryListData = resp.Data['popular_countries'];
            });
    }

    onCountryOptnSelected(event) {
        const iso_country_code = event.target.value
        this.getCities(iso_country_code);
    }

    getCities(iso_country_code) {
        this.apiHandlerService.apiHandler('cityList', 'post', {}, {}, { iso_country_code })
            .pipe(
                finalize(() => {
                    this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                if (resp.Status)
                    this.cityListData = resp.Data;
            })
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
