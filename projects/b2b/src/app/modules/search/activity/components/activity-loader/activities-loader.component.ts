import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-activities-loader',
  templateUrl: './activities-loader.component.html',
  styleUrls: ['./activities-loader.component.scss']
})
export class ActivitiesLoaderComponent implements OnInit {
  activityInfo: any


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.activityInfo = this.data.data;
  }
}