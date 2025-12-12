import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SwalService } from "projects/b2b/src/app/core/services/swal.service";
import { UtilityService } from "projects/b2b/src/app/core/services/utility.service";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SubSink } from "subsink";
@Component({
    selector: "app-import-pnr",
    templateUrl: "./import-pnr.component.html",
    styleUrls: ["./import-pnr.component.scss"],
})
export class ImportPnrComponent implements OnInit {
    isSubmitted = false;
    regConfig: FormGroup;
    private subSunk = new SubSink();
    respData: Array<any> = [];
    noData: boolean = true;
    filteredOptions: Observable<string[]>;
    agent_id: string = "";
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    constructor(
        public fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private util: UtilityService,
        private router: Router
    ) { }

    createForm = this.fb.group({
        agent: new FormControl('', [Validators.required]),
        selectedApi: new FormControl("", [Validators.required]),
        pnr: new FormControl("", [Validators.required])
    });

    ngOnInit() {
        this.getAgentList();
    }

    getAgentList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userList', 'post', {}, {}, {
            auth_role_id: 2,
            status: 1
        }).subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.respData = resp.data;
                this.setFilteredmarkup_id();
            }
        });
    }

    onSubmit(): void {
        if (!this.createForm.valid) {
            return;
        }
        this.loading = true;
        this.generateAppreference();
    }

    generateAppreference() {
        let req = {
            module: "flight"
        };
        this.subSunk.sink = this.apiHandlerService
            .apiHandler("createAppReference", "post", {}, {}, req)
            .subscribe((resp) => {
                if (resp && (resp.statusCode == 200 || resp.statusCode == 201)) {
                    this.directImportPNR(resp.data);
                }
                else {
                    this.loading = false;
                    this.swalService.alert.oops(resp.Message);

                }
            }, (errorResponse) => {
                this.loading = false;
                this.swalService.alert.oops(errorResponse.error.Message);
            });
    }

    directImportPNR(appReference) {
        let req = {
            AgentId: this.agent_id,
            booking_source: this.createForm.value.selectedApi,
            PNR: this.createForm.value.pnr,
            AppReference: appReference,
            BookingFrom: "B2B"
        };
        this.subSunk.sink = this.apiHandlerService
            .apiHandler("directImportPNR", "post", {}, {}, req)
            .subscribe((resp) => {
                if (resp && (resp.statusCode == 200 || resp.statusCode == 201)) {
                    localStorage.setItem('importPNRResponse', JSON.stringify(resp.data));
                    this.router.navigate(['/import-pnr-details']);
                }
                else {
                    this.loading = false;
                    this.swalService.alert.oops(resp.Message);

                }
            }, (errorResponse) => {
                this.loading = false;
                this.swalService.alert.oops(errorResponse.error.Message);
            });
    }

    setFilteredmarkup_id() {
        this.filteredOptions = this.createForm.controls.agent.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.respData.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
    }

    onSelectionChanged(event) {
        this.agent_id = event.option.id;
    }

    reset() {
        this.createForm.reset();
        this.createForm.patchValue({
            selectedApi: ''
        })
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
