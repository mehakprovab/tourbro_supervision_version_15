import { DataSource } from "@angular/cdk/collections";
import { Observable } from 'rxjs';
import { ApiHandlerService } from '../api-handlers';
import { map } from 'rxjs/operators';

export class UserDataSource extends DataSource<any> {
    constructor(private api: ApiHandlerService) {
        super();
    }
    connect(): Observable<any[]> {
        return this.api
            .apiHandler('userList', 'POST', '', '', {
                user_type: 4,
                user_status: 1,
                offset: 0,
                limit: 10
            })
            .pipe(map(res => res.Data.user_list));
    }
    disconnect() { }
}