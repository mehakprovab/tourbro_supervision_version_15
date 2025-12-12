import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TravellerAgencyComponent } from '../traveller-agency/traveller-agency.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';


@Component({
    selector: 'app-traveller-info',
    templateUrl: './traveller-info.component.html',
    styleUrls: ['./traveller-info.component.scss']
})
export class TravellerInfoComponent implements OnInit,OnDestroy {
    private subSunk = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService,
        public diloagRef: MatDialogRef<TravellerAgencyComponent>,
        @Inject(MAT_DIALOG_DATA) public data
        
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            let Countries = res.data.popular_countries.concat(res.data.countries);
            let country = Countries.find(list => list.id === this.data.country);
            this.data.country = country.name;
        });
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
