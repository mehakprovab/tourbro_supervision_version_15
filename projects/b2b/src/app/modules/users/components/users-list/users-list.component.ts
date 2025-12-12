import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ThemePalette } from '@angular/material/core';

export interface PeriodicElement {
  Sno: number;
  LoginStatus: boolean;
  Name: string;
  Contact: string;
  Status: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {Sno: 1, LoginStatus: true, Name: 'Customer', Contact: '9876543211-pujarani.provab@gmail.com', Status: 1},
  {Sno: 2, LoginStatus: true, Name: 'Ms yztest yz', Contact: '7777777777-test@gmail.com', Status: 1},
  {Sno: 3, LoginStatus: true, Name: 'Ms Priya C P', Contact: '7654321098-rakeshprovab44@gmail.com', Status: 1},
  {Sno: 4, LoginStatus: true, Name: 'Mr Tester provab', Contact: '9876543210-test123@gmail.com', Status: 1},
  {Sno: 5, LoginStatus: true, Name: 'Mr Tester provab', Contact: '9876543210-test@gmail.com', Status: 1},
  {Sno: 6, LoginStatus: true, Name: 'Miss Leena Roselyn b', Contact: '9876543210-leenaroselyn@gmail.com', Status: 1},
  {Sno: 7, LoginStatus: true, Name: 'Mr Chaha Kuamt', Contact: '8754125412-cshhh@gmail.com', Status: 1},
  {Sno: 8, LoginStatus: true, Name: 'Mr Custoner test', Contact: '-387541254-santhuprovab@gmail.com', Status: 1},
  {Sno: 9, LoginStatus: true, Name: 'Mr Chaaa Kumarr', Contact: '7795326947-cshiremath24@gmail.com', Status: 1},
  {Sno: 10, LoginStatus: true, Name: 'Mr Cghnadrs Kumarr', Contact: '8754125412-cshire@gmail.com', Status: 1},
];

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['Sno', 'LoginStatus', 'Name', 'Contact', 'Status'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  
  constructor() { }

  ngOnInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
