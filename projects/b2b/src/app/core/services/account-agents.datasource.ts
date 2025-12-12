import { DataSource } from '@angular/cdk/table';
import { AccountAgent } from '../../model/account-agent';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { AccountAgentsService } from './account-agents.service';
import { catchError, finalize } from 'rxjs/operators';

export class AccountAgentsDataSource implements DataSource<AccountAgent> {

    private subject = new BehaviorSubject<AccountAgent[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private accountAgentsService: AccountAgentsService) { }

    loadAccountAgents(
        filter: string,
        sortDirection: string,
        pageIndex: number,
        pageSize: number) {

        this.loadingSubject.next(true);

        this.accountAgentsService.findAccountAgents(filter, sortDirection, pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => this.subject.next(lessons));

    }

    connect(collectionViewer: CollectionViewer): Observable<AccountAgent[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }

}