import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { EChartsOption  } from 'echarts';
import { DropDownAnimation } from "../animation";

@Component({
    selector: 'app-revenue-finance',
    templateUrl:'./revenue-finance.component.html',
    styleUrls:['./revenue-finance.component.scss'],
    animations: [DropDownAnimation]
})

export class RevenueFinanceComponent implements OnInit , AfterViewInit {
    @Input() grossMargin: any = 0;
    @Input() markupEarned: any = 0;
    @Input() convenienceFee: any = 0;
    @Input() discountCost: any = 0;
    @Input() refundAmount: any = 0;
    @Input() paymentSuccessRate: any = 0;
    @Input() paymentFailedRate: any = 0;
    @Input() customerReceivables: any = 0;

    public options: EChartsOption;
    public pieChart: EChartsOption;
    public isOpen: boolean = false;
    public isOpenRevenue: boolean = false;

    ngOnInit(): void {
        // this.getChart();
    }

    public pieChartData() {
      this.pieChart = {
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

    ngAfterViewInit() {
        this.getChart();
        this.pieChartData();
    }

    public getChart() {
        this.options = {
   tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue']
  },
  yAxis: {
    type: 'value'
  },
  series: {
  type: 'bar',
  data: [120, 200],
  itemStyle: {
    color: function(params) {
      const colors = [
        '#5470C6',
        '#91CC75',
      ];
      return colors[params.dataIndex];
    }
  }
}
};
    }
}
