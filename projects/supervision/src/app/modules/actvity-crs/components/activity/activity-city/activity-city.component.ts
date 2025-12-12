import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray: Array<any> = [];
@Component({
    selector: 'app-activity-city',
    templateUrl: './activity-city.component.html',
    styleUrls: ['./activity-city.component.scss']
})

export class ActivityCityComponent implements OnInit {
    @ViewChild('destination_name', { static: false }) destination_name: ElementRef<HTMLElement>;
    
    enabledForm: boolean = false;
    editForm: boolean = false;
    activityCityDataList: any[] = [];
    displayColumn: string[] = ['Sl. No.','Country Name', 'City Name'];
    subSunk = new SubSink();
    pageSize = 20;
    page = 1;
    collectionSize: number;
    searchText: string = '';
    activityCityDataListForSort: any[] = [];
    searchSpin: boolean = true;

    public submittedVehicle: boolean = false;
    public addCityForm: FormGroup;
    public countryList: any;
    public saveTextTitle: string = 'Save';
    public activityCityId: number;
    public countryListSelect: any;
    public selectedCountryName: any;
    public loggedInUser: any;

    constructor(private fb: FormBuilder, private swalService: SwalService, private apiHandlerService: ApiHandlerService) {
    }

    ngOnInit() {
        const currentDomainUser = localStorage.getItem('currentDomainUser');
      this.loggedInUser = JSON.parse(currentDomainUser);
      if (this.loggedInUser.auth_role_id !== 7) {
      this.displayColumn.push('Action')
    }
        this.getActivityCityData();
        this.createTypeForm();
        this.getCounrtyList();
    }

    createTypeForm() {
        this.addCityForm = this.fb.group({
            city_name: ['', Validators.required],
            country_name: ['', Validators.required]
        })
    };

    onActivityCitySave() {
        const req = this.addCityForm.value;
        const payLoad = {
            "CityName": req.city_name,
            "CountryId": this.selectedCountryName.id,
            "CountryName": this.selectedCountryName.CountryName,
            "CountryCode": this.selectedCountryName.CountryCode
        }
        this.apiHandlerService.apiHandler('addActivityCity', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.swalService.alert.success('City Added Successfully');
                    this.addCityForm.reset();
                    this.enabledForm = false;
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            },
            error: (err) => {
                console.log(err);
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    onAddButtonClicked() {
        this.enabledForm = !this.enabledForm;
    }

    getActivityCityData() {
        const req = {
            CountryName: ''
            }
        this.subSunk.sink = this.apiHandlerService.apiHandler('activityCityList', 'post', {}, {}, req)
            .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.activityCityDataList = response.data || [];
                    this.activityCityDataListForSort = this.activityCityDataList;
                    this.collectionSize = this.activityCityDataList.length;
                    this.searchSpin = false;
                } else {
                    this.activityCityDataList = [];
                }
            });
    }

    onDeletedRecord(inputRecordToDeleted: any) {
        //api call to delete the record
        this.swalService.alert.delete((action) => {
            if (action) {
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteActivityCity', 'post', {}, {},
                    { "id": inputRecordToDeleted.id })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success("Tour Region data has been deleted successfully");
                            this.getActivityCityData();
                        }
                    }, (err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    });
            }
        })
    }

    insertedRecordReceived(event) {
        this.activityCityDataList.unshift(event);
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.activityCityDataListForSort];
        if (!sort.active || sort.direction === '') {
            this.activityCityDataList = data;
            return;
        }
        this.activityCityDataList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
                case 'Tour Theme': return this.compare(a.tour_subtheme.toLowerCase(), b.tour_subtheme.toLowerCase(), isAsc);
                case 'Current State': return this.compare(a.status, b.status, isAsc);
                case 'State Change': return this.compare(a.status, b.status, isAsc);
                default: return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get f() {
        return this.addCityForm.controls;
    }

    onEditCity(id) {
        const activityCityDataList = this.activityCityDataList.filter(data => data.origin === id);
        console.log(activityCityDataList)
        this.activityCityId = id;
        window.scroll({top: 0, behavior: 'smooth'});
        this.addCityForm.patchValue({
            city_name: activityCityDataList[0].CityName,
            country_name: id
        });
        this.enabledForm = true;
        this.saveTextTitle = 'Update';
    }

    updateCity() {
        const req = this.addCityForm.value;
        const payLoad = {
            "origin": req.city_name,
            "CityName": this.selectedCountryName.id,
            "CountryCode": this.selectedCountryName.CountryCode
        }
        this.apiHandlerService.apiHandler('editActivityCity', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.swalService.alert.success('City Updated Successfully');
                    this.addCityForm.reset();
                    this.enabledForm = false;
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            },
            error: (err) => {
                console.log(err);
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    getCounrtyList() {
        this.apiHandlerService.apiHandler('activityCountryList', 'POST',{},{},{}).subscribe({
            next: (res) => {
                console.log(res);
                if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                    this.countryList = res.data;
                } else {
                    this.countryList = [];
                }
            }, error: (err) => {
                console.log(err);
                this.countryList = true;
            }
        })
    }

    getAutoCompleteLocations(event) {
        let target = event.target as HTMLInputElement;
        if (target && target.value) {
            const city_name = target.value.trim();
            const cityName = target.value.trim();
            const countryName = this.selectedCountryName.CountryName;
            this.apiHandlerService.apiHandler('getAutoComplete', 'POST',{},{},{cityName,
                countryName
            }).subscribe({
            next: (res) => {
                console.log(res);
                if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                    this.countryListSelect = res.data;
                } else {
                    this.countryListSelect = [];
                }
            }, error: (err) => {
                console.log(err);
                this.countryListSelect = true;
            }
        })
        } else {
            this.countryListSelect = [];
        }
    }

    selectedLocation(event) {
        console.log(event);
        if(event) {
            this.addCityForm.patchValue({
                city_name: event['CityName']
            });
            this.countryListSelect = [];
        }
    }

    getActivityCityList(event) {
        console.log(event)
        const selectedId = event.target.value;
        const selectedCountry = this.countryList.find(c => c.id == selectedId);
        this.selectedCountryName = selectedCountry;
        const req = {
            CountryName: selectedCountry.CountryName,
        }
        console.log(selectedCountry)
    }

}