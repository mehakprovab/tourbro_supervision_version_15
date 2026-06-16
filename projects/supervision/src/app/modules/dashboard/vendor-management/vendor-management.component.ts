import { Component, OnInit, AfterViewInit } from "@angular/core";
import { EChartsOption  } from 'echarts';
import { DropDownAnimation } from "../animation";

@Component({
    selector: 'app-vendor-management',
    templateUrl: './vendor-management.component.html',
    styleUrls: ['./vendor-management.component.scss'],
    animations: [DropDownAnimation]
})

export class VendorManagementComponent implements OnInit, AfterViewInit {
    public options: EChartsOption;
    public isOpen: boolean = true;

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        this.getLoadPieChart();
    }
    public getLoadPieChart() {
           this.options = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%','70%'],
       label: {
        show: true,
        formatter: '{b}\n{c}' // Name + Value
      },
      data: [
        { value: 1048, name: 'Heli',itemStyle: { color: 'rgba(250, 46, 236, 1)' } },
        { value: 735, name: 'Wellness',itemStyle: { color: 'rgba(168, 46, 250, 1)' } },
        { value: 580, name: 'Char Dham',itemStyle: { color: 'rgba(22, 159, 59, 1)' } },
        { value: 484, name: 'Vaishno Devi',itemStyle: { color: 'rgba(255, 180, 27, 1)' } },
        { value: 300, name: 'Hotels',itemStyle: { color: 'rgba(203, 203, 52, 1)' } },
         { value: 300, name: 'Transport',itemStyle: { color: 'rgba(97, 52, 203, 1)' } },
          { value: 300, name: 'Experience',itemStyle: { color: 'rgba(46, 213, 250, 1)' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
    }
}