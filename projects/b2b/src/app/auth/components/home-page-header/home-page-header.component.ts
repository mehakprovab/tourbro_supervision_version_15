import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { ApiHandlerService } from '../../../core/api-handlers';
// import { AuthService } from '../../../core/authentication/auth.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

const log = new Logger('auth/HomePageHeaderComponent');
@Component({
    selector: 'app-home-page-header',
    templateUrl: './home-page-header.component.html',
    styleUrls: ['./home-page-header.component.scss']
})

export class HomePageHeaderComponent implements OnInit, OnDestroy {
    protected subSunk = new SubSink();
    domainInfo: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getDomainInfo();
        
    }

    getDomainInfo() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.domainInfo = res.data[0];
                    this.authService.manageDomainRes.next(this.domainInfo);
                    localStorage.setItem('manageDomainInfo', JSON.stringify(this.domainInfo));
                }
            }, (err: HttpErrorResponse) => {
                log.debug(err);
                console.error(err);
            });
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    b2bSupplierReg() {
        localStorage.removeItem('selectedSuppliers')
    }

    dmcLoginNavigate(type) {
        let dmclogin;
        if(type === 'dmc') {
            dmclogin = 'https://booking247.com/dmc/#/auth/login'
            window.open(dmclogin, '_blank')
        }
        if (type === 'b2b-direct') {
            dmclogin = 'https://booking247.com/supplier/#/auth/login'
            window.open(dmclogin, '_blank')
        }

    }

}
