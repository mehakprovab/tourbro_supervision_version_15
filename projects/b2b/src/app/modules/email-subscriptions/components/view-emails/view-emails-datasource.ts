import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ViewEmailsItem {
  Sno: number;
  Email: string;
  Status: string;
  Action: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ViewEmailsItem[] = [
  {
    "Sno": 1,
    "Email": "santhuprovab@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 2,
    "Email": "rakesn@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 3,
    "Email": "naven@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 4,
    "Email": "anitha.g@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 5,
    "Email": "balu@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 6,
    "Email": "cnrakesh12345@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 7,
    "Email": "jain@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 8,
    "Email": "nitu.provab@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 9,
    "Email": "leenaroselyn.provab@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  },
  {
    "Sno": 10,
    "Email": "cshiremath.provab@gmail.com",
    "Status": "InactiveActive",
    "Action": "Delete"
  }
 ];

/**
 * Data source for the ViewEmails view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ViewEmailsDataSource extends DataSource<ViewEmailsItem> {
  data: ViewEmailsItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ViewEmailsItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ViewEmailsItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ViewEmailsItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'Sno': return compare(+a.Sno, +b.Sno, isAsc);
        case 'Email': return compare(a.Email, b.Email, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
