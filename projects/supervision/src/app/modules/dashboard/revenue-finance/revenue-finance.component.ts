import { AfterViewInit, Component, Input, OnChanges, OnInit } from "@angular/core";
import { EChartsOption  } from 'echarts';
import { DropDownAnimation } from "../animation";

@Component({
    selector: 'app-revenue-finance',
    templateUrl:'./revenue-finance.component.html',
    styleUrls:['./revenue-finance.component.scss'],
    animations: [DropDownAnimation]
})

export class RevenueFinanceComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() grossMargin: any = 0;
    @Input() markupEarned: any = 0;
    @Input() convenienceFee: any = 0;
    @Input() discountCost: any = 0;
    @Input() refundAmount: any = 0;
    @Input() paymentSuccessRate: any = 0;
    @Input() paymentFailedRate: any = 0;
    @Input() customerReceivables: any = 0;
    @Input() dashboardMetricsData: any = {};
    @Input() paymentMetricsData: any = {};
    @Input() moduleRevenueData: any = {};
    @Input() vendorRevenueData: any = {};

    public options: EChartsOption;
    public vendorOptions: EChartsOption;
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

    ngOnChanges(): void {
        this.getChart();
        this.pieChartData();
    }

    public getChart() {
        const moduleItems = this.getChartItems(
            [this.dashboardMetricsData, this.moduleRevenueData],
            ['moduleWiseRevenue', 'moduleRevenue', 'modules', 'totalGrossBookingValueModuleWise', 'module_wise_revenue']
        );
        const vendorItems = this.getChartItems(
            [this.dashboardMetricsData, this.vendorRevenueData],
            ['vendorWiseRevenue', 'vendorRevenue', 'vendors', 'vendor_wise_revenue']
        );

        this.options = {
   tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: moduleItems.map(item => item.name)
  },
  yAxis: {
    type: 'value'
  },
  series: {
  type: 'bar',
  data: moduleItems.map(item => item.value),
  itemStyle: {
    color: function(params) {
      const colors = [
        '#5470C6',
        '#91CC75',
        '#FAC858',
        '#EE6666',
        '#73C0DE',
        '#3BA272',
        '#FC8452'
      ];
      return colors[params.dataIndex % colors.length];
    }
  }
}
};
        this.vendorOptions = {
   tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: vendorItems.map(item => item.name)
  },
  yAxis: {
    type: 'value'
  },
  series: {
  type: 'bar',
  data: vendorItems.map(item => item.value),
  itemStyle: {
    color: function(params) {
      const colors = [
        '#5470C6',
        '#91CC75',
        '#FAC858',
        '#EE6666',
        '#73C0DE',
        '#3BA272',
        '#FC8452'
      ];
      return colors[params.dataIndex % colors.length];
    }
  }
}
};
    }

    private getChartItems(sources: any[], preferredKeys: string[]): { name: string; value: number }[] {
        for (const source of sources) {
            const data = this.findPreferredArray(source, preferredKeys);
            const items = this.mapChartArray(data);
            if (items.length) {
                return items;
            }
        }

        for (const source of sources) {
            const items = this.mapChartObject(source);
            if (items.length) {
                return items;
            }
        }

        return [{ name: 'No Data', value: 0 }];
    }

    private findPreferredArray(source: any, preferredKeys: string[]): any[] {
        if (!source || typeof source !== 'object') {
            return [];
        }

        if (Array.isArray(source)) {
            return source;
        }

        for (const key of preferredKeys) {
            if (Array.isArray(source[key])) {
                return source[key];
            }

            if (source[key] && typeof source[key] === 'object') {
                const nested = this.findPreferredArray(source[key], preferredKeys);
                if (nested.length) {
                    return nested;
                }
            }
        }

        for (const value of Object.values(source)) {
            const nested = this.findPreferredArray(value, preferredKeys);
            if (nested.length) {
                return nested;
            }
        }

        return [];
    }

    private mapChartArray(data: any[]): { name: string; value: number }[] {
        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .map(item => ({
                name: this.getName(item),
                value: this.getNumber(item)
            }))
            .filter(item => item.name && !isNaN(item.value));
    }

    private mapChartObject(source: any): { name: string; value: number }[] {
        if (!source || typeof source !== 'object' || Array.isArray(source)) {
            return [];
        }

        return Object.entries(source)
            .filter(([, value]) => typeof value === 'number' || typeof value === 'string')
            .map(([key, value]) => ({
                name: this.formatName(key),
                value: this.toNumber(value)
            }))
            .filter(item => item.name && !isNaN(item.value));
    }

    private getName(item: any): string {
        if (!item || typeof item !== 'object') {
            return '';
        }

        const value = item.module || item.module_name || item.moduleName || item.vendor || item.vendor_name
            || item.vendorName || item.business_name || item.name || item.label || item.category;
        return value ? this.formatName(value) : '';
    }

    private getNumber(item: any): number {
        if (item === null || item === undefined) {
            return NaN;
        }

        if (typeof item !== 'object') {
            return this.toNumber(item);
        }

        const keys = ['revenue', 'totalRevenue', 'grossBookingValue', 'totalGrossBookingValue', 'amount', 'total', 'value', 'count'];
        for (const key of keys) {
            if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
                return this.toNumber(item[key]);
            }
        }

        return NaN;
    }

    private toNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            return Number(value.replace(/,/g, ''));
        }

        return NaN;
    }

    private formatName(value: any): string {
        return String(value || '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
