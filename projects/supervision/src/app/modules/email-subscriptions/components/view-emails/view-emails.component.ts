import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ViewEmailsDataSource, ViewEmailsItem } from './view-emails-datasource';

@Component({
  selector: 'app-view-emails',
  templateUrl: './view-emails.component.html',
  styleUrls: ['./view-emails.component.scss']
})
export class ViewEmailsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<ViewEmailsItem>;
  dataSource: ViewEmailsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['Sno', 'Email', 'Status', 'Action'];

  ngOnInit() {
    this.dataSource = new ViewEmailsDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
