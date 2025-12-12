import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss']
})
export class SearchHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


// monthly recap report -
highcharts = Highcharts;

chartOptions =
{
  "chart": {
    "type": "column"
  },
  "title": {
    "text": "Monthly Search Hits"
  },
  "subtitle": {
    "text": "2020-2021"
  },
  "xAxis": {
    "categories": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    "crosshair": true
  },
  "yAxis": {
    "min": 0,
    "title": {
      "text": "Search Hits"
    },
    stackLabels: {
      enabled: true,
      style: {
          fontWeight: 'bold',
          color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
          ) || 'gray'
      }
  }
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor: 'white',
        // Highcharts.defaultOptions.legend.backgroundColor || 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
},
  "tooltip": {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
},
  "plotOptions": {
    "column": {
      stacking: 'normal',
            dataLabels: {
                enabled: true
            }
    }
  },
  "series": [{
    "name": "Flight",
    "data": [ 0, 71, 0, 129, 0, 76, 5, 8, 21, 94, 0, 4]

  }, {
    "name": "Hotel",
    "data": [83, 78, 98, 34, 106, 5, 10, 1, 12, 35, 0, 23]

  },
  {
    "name": "Bus",
    "data": [48, 38, 3, 44, 40, 43, 90, 0, 4, 2, 3, 5]

  }, {
    "name": "Activites",
    "data": [44, 32, 35, 39, 5, 7, 57, 0, 6, 3, 68, 11]

  },
  {
    "name": "Transfers",
    "data": [48, 88, 39, 41, 47, 83, 10, 6, 3, 0, 3, 5]

  },

]
}


}
