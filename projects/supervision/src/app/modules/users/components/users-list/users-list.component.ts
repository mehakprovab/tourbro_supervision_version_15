import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { UsersService } from '../../users.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material';

const log = new Logger('users/UsersListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: '#' },
        { key: "login_status", value: 'LoginStatus' },
        { key: "first_name", value: 'Name' },
        { key: "phone", value: 'Contact' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    status;

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private api: ApiHandlerService,
        private usersService: UsersService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getUserList();
    }

    getUserList(): void {
        const data = [{ user_type: 3, user_status: 1, offset: 0, limit: 10 }]
        data['topic'] = 'userList';
        this.usersService.fetch(data)
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data.user_list;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else if (resp.statusCode == 404) {
                    this.noData = true;
                    this.swalService.alert.error();
                }
            });
    }

    onStatusUpdate(val, index): void {
        log.debug(val);
        const data = [{ user_id: val['user_id'] }];
        data['topic'] = 'editUser';
        this.usersService.fetch(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    const data = [{
                        title: resp.data['title'] || '',
                        first_name: resp.data['first_name'] || '',
                        last_name: resp.data['last_name'] || '',
                        date_of_birth: resp.data['date_of_birth'] || '',
                        country_code: resp.data['country_code'] || '',
                        phone: resp.data['phone'] || '',
                        address: resp.data['address'] || '',
                        status: val['status'] ? 1 : 0,
                        city_code: resp.data['city_code'] || val['city_name'] || '',
                        business_name: resp.data['business_name'] || '',
                        business_phone: resp.data['business_phone'] || val['business_phone'] || '',
                        business_number: resp.data['business_number'] || '',
                        user_id: resp.data['user_id'] || '',
                        user_type: resp.data['user_type'] || '',
                    }];
                    data['topic'] = 'updateUser';
                    log.debug("data to update status", data);
                    this.usersService.update(data).subscribe(resp => {
                        if (resp.statusCode == 200){
                            this.respData.splice(index, 1);
                            respDataCopy = [...this.respData];
                            this.collectionSize = respDataCopy.length;
                            this.swalService.alert.update();
                        }
                        else
                            this.swalService.alert.oops();
                    })
                } else {
                    this.swalService.alert.opps();
                }
            });

    }

    updateUser(data) {
        this.toUpdate.emit({ tabId: 'add_user', user: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                first_name: objData.first_name,
                phone: objData.phone,
                email: objData.email,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'first_name': return this.utility.compare('' + a.first_name, '' + b.first_name, isAsc);
                case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                default: return 0;
            }
        });
    }

}
