import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ListItem {
  Sno: number;
  BankLogo: string;
  AccountName: string;
  AccountNumber: number;
  BankName: string;
  BranchName: string;
  IFSCCode: string;
  PAN: string;
  CreatedOn: string;
  Status: string;
  Action: string;

}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ListItem[] = [
  {
    "Sno": 1,
    "BankLogo": "",
    "AccountName": "Test",
    "AccountNumber": 1234567890,
    "BankName": "Test Bank",
    "BranchName": "Electronic City",
    "IFSCCode": "sds12121",
    "PAN": "123456",
    "CreatedOn": "15 Nov 2016 Tue",
    "Status": "InactiveActivate",
    "Action": "Update"
  },
  {
    "Sno": 2,
    "BankLogo": "",
    "AccountName": "Provab Tecnosoft",
    "AccountNumber": 9876543210123456,
    "BankName": "ICICI Bank",
    "BranchName": "Electronic City",
    "IFSCCode": "ICICI2121",
    "PAN": "245678",
    "CreatedOn": "02 Feb 2016 Tue",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 3,
    "BankLogo": "",
    "AccountName": "Provab",
    "AccountNumber": 1234567890,
    "BankName": "HDFC",
    "BranchName": "Jayanagar 4th Block",
    "IFSCCode": "HDFC1234",
    "PAN": "9874561230",
    "CreatedOn": "02 Feb 2016 Tue",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 4,
    "BankLogo": "",
    "AccountName": "TEST",
    "AccountNumber": 10245872154874876,
    "BankName": "TEst",
    "BranchName": "Test",
    "IFSCCode": "HDFC1021",
    "PAN": "BEA123",
    "CreatedOn": "09 Mar 2018 Fri",
    "Status": "InactiveActivate",
    "Action": "Update"
  },
  {
    "Sno": 5,
    "BankLogo": "",
    "AccountName": "test",
    "AccountNumber": 213423423423,
    "BankName": "bangalore",
    "BranchName": "hdfc",
    "IFSCCode": "hdfc564654",
    "PAN": "gh76786t",
    "CreatedOn": "23 Jul 2018 Mon",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 6,
    "BankLogo": "",
    "AccountName": "Test",
    "AccountNumber": 1234567890,
    "BankName": "HDFC",
    "BranchName": "E City",
    "IFSCCode": "IFSC001",
    "PAN": "BEA00122",
    "CreatedOn": "18 Jun 2019 Tue",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 7,
    "BankLogo": "",
    "AccountName": "Balu",
    "AccountNumber": 1234567890,
    "BankName": "HDFC",
    "BranchName": "E City",
    "IFSCCode": "IFSC001",
    "PAN": "BEA12345",
    "CreatedOn": "18 Jun 2019 Tue",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 8,
    "BankLogo": "",
    "AccountName": "Provab",
    "AccountNumber": 8754125445,
    "BankName": "Ghandravaa",
    "BranchName": "Bangalore",
    "IFSCCode": "PRBNJ4545454545",
    "PAN": "PAN5456245",
    "CreatedOn": "20 Jun 2019 Thu",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  },
  {
    "Sno": 9,
    "BankLogo": "",
    "AccountName": "Savings",
    "AccountNumber": 98765432987654,
    "BankName": "SBI",
    "BranchName": "Bangalore",
    "IFSCCode": "34543dsfsdf",
    "PAN": "dsr24234234",
    "CreatedOn": "21 Jun 2019 Fri",
    "Status": "ActiveDeactivate",
    "Action": "Update"
  }
 ];

/**
 * Data source for the List view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ListDataSource extends DataSource<ListItem> {
  data: ListItem[] = EXAMPLE_DATA;
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
  connect(): Observable<ListItem[]> {
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
  private getPagedData(data: ListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ListItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'Sno': return compare(+a.Sno, +b.Sno, isAsc);
        case 'AccountName': return compare(a.AccountName, b.AccountName, isAsc);
        case 'BankName': return compare(a.BankName, b.BankName, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
