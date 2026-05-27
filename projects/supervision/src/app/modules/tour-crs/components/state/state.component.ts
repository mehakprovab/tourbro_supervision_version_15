import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray:Array<any>=[]

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
enabledForm: boolean = false;
  editForm: boolean = false;

  stateDataList: any[] = [];
  stateDataListForSort: any[] = [];

  displayColumn: string[] = ['Sl. No.', 'State', 'Current State', 'Actions'];

  pageSize = 100;
  page = 1;
  collectionSize: number;

  searchText: string = '';
  searchSpin: boolean = true;

  subSunk = new SubSink();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit() {
    this.getStateData();
  }

  onAddButtonClicked() {
    this.enabledForm = !this.enabledForm;
  }

  // ✅ GET STATE LIST
  getStateData() {
    this.searchSpin = true;

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterState', 'post', {}, {}, {})
      .subscribe(response => {

        if (response && (response.statusCode === 200 || response.statusCode === 201)) {

          const states = response.data.data || [];

          this.stateDataList = states;
          this.stateDataListForSort = [...states];
          this.collectionSize = states.length;

        } else {
          this.swalService.alert.error(response.Message || 'Failed to load states');
        }

        this.searchSpin = false;

      }, error => {
        this.searchSpin = false;
        this.swalService.alert.error('Server error');
      });
  }

  // ✅ DELETE STATE
  onDeletedRecord(item: any) {
    this.swalService.alert.delete((action) => {
      if (action) {
        this.subSunk.sink = this.apiHandlerService
          .apiHandler('deleteMasterState', 'post', {}, {}, { id: item.id })
          .subscribe(response => {
            if ((response.statusCode === 200 || response.statusCode === 201)) {
              this.swalService.alert.success("State deleted successfully");
              this.getStateData();
            }
          }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err.error.Message);
          });
      }
    });
  }

  // ✅ AFTER ADD
  insertedRecordReceived() {
    this.getStateData();
  }

  // ✅ SORT
  sortData(sort: Sort) {
    const data = [...this.stateDataListForSort];

    if (!sort.active || sort.direction === '') {
      this.stateDataList = data;
      return;
    }

    this.stateDataList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'Sl. No.': return this.compare(a.id, b.id, isAsc);
        case 'State': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'Current State': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    if (a == null) return 1;
    if (b == null) return -1;
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}