import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../../../theme-options';
import { faCheck, faCloudArrowDown, faEllipsisV, faFile, faFileExcel, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
})
export class DrawerComponent implements OnInit {
   faFile = faFile
       faCloudArrowDown = faCloudArrowDown
        faFilePdf = faFilePdf
        faFileExcel = faFileExcel
        faTrash = faTrash
        faCheck=faCheck
        faEllipsisV = faEllipsisV
  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  constructor(public globals: ThemeOptions) {
  }

  ngOnInit() {
  }

}
