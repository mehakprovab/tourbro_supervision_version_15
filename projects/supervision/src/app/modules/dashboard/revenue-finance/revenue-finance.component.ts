import { AfterViewInit, Component, Input, OnChanges, OnInit } from "@angular/core";
import { EChartsOption  } from 'echarts';
import { DropDownAnimation } from "../animation";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

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
    @Input() averageBookingData: any = {};
    @Input() vendorRevenueData: any = {};
    @Input() supplierView: boolean = false;

    public options: EChartsOption;
    public vendorOptions: EChartsOption;
    public modulePieOptions: EChartsOption;
    public vendorPieOptions: EChartsOption;
    public isOpen: boolean = false;
    public isOpenRevenue: boolean = false;
    public moduleWiseRevenueData: any = {};
    public vendorWiseRevenueApiData: any = {};

    constructor(
        private apiHandlerService: ApiHandlerService
    ) {}

    ngOnInit(): void {
        this.getRevenueGraphData();
    }

    ngAfterViewInit() {
        this.getChart();
    }

    ngOnChanges(): void {
        this.getChart();
    }

    public getChart() {
        const moduleItems = this.getChartItems(
            [this.moduleWiseRevenueData, this.averageBookingData, this.dashboardMetricsData, this.moduleRevenueData],
            ['moduleLevel', 'moduleWiseRevenue', 'moduleRevenue', 'modules', 'totalGrossBookingValueModuleWise', 'module_wise_revenue']
        );
        const vendorItems = this.getChartItems(
            [this.vendorWiseRevenueApiData, this.dashboardMetricsData, this.vendorRevenueData],
            ['data', 'vendorWiseRevenue', 'vendorRevenue', 'vendors', 'vendor_wise_revenue']
        );

        this.options = {
   tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => this.formatChartValue(value),
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
  data: moduleItems.map(item => this.roundToTwo(item.value)),
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
    valueFormatter: (value) => this.formatChartValue(value),
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
  data: vendorItems.map(item => this.roundToTwo(item.value)),
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
        this.modulePieOptions = this.getPieChartOptions(moduleItems, 'Module-wise Revenue');
        this.vendorPieOptions = this.getPieChartOptions(vendorItems, 'Vendor-wise Revenue');
    }

    private getPieChartOptions(items: { name: string; value: number }[], title: string): EChartsOption {
        const colors = [
            'rgba(250, 46, 236, 1)',
            'rgba(168, 46, 250, 1)',
            'rgba(22, 159, 59, 1)',
            'rgba(255, 180, 27, 1)',
            'rgba(203, 203, 52, 1)',
            'rgba(97, 52, 203, 1)',
            'rgba(46, 213, 250, 1)'
        ];

        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => `${params.name}<br/>${this.formatChartValue(params.value)}`
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    label: {
                        show: true,
                        formatter: (params: any) => `${params.name}\n${this.formatChartValue(params.value)}`
                    },
                    data: items.map((item, index) => ({
                        value: this.roundToTwo(item.value),
                        name: item.name,
                        itemStyle: {
                            color: colors[index % colors.length]
                        }
                    })),
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

    public getRevenueGraphData(): void {
        forkJoin({
            moduleWiseRevenue: this.getSafeRevenueRequest('moduleWiseRevenue'),
            vendorWiseRevenue: this.getSafeRevenueRequest('VendorWiseRevenue')
        }).subscribe((resp: any) => {
            this.moduleWiseRevenueData = this.getResponseData(resp.moduleWiseRevenue);
            this.vendorWiseRevenueApiData = this.getResponseData(resp.vendorWiseRevenue);
            this.getChart();
        });
    }

    private getSafeRevenueRequest(topic: string) {
        return this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {})
            .pipe(catchError(() => of({ statusCode: 500, data: {} })));
    }

    private getResponseData(resp: any): any {
        return resp && (resp.data !== undefined ? resp.data : resp.Data !== undefined ? resp.Data : resp);
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

        const fullName = [item.first_name, item.last_name].filter(Boolean).join(' ');
        const value = item.module || item.module_name || item.moduleName || item.vendor || item.vendor_name
            || item.vendorName || item.business_name || fullName || item.email || item.name || item.label || item.category
            || (item.vendor_id ? `Vendor ${item.vendor_id}` : '');
        if (value) {
            return this.formatName(value);
        }
        return '';
    }

    private getNumber(item: any): number {
        if (item === null || item === undefined) {
            return NaN;
        }

        if (typeof item !== 'object') {
            return this.toNumber(item);
        }

        const keys = [
            'revenue',
            'totalRevenue',
            'total_revenue',
            'grossBookingValue',
            'totalGrossBookingValue',
            'amount',
            'total',
            'value',
            'count'
        ];
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

    public displayNumber(value: any): number {
        return this.roundToTwo(value);
    }

    private roundToTwo(value: any): number {
        const numberValue = this.toNumber(value);
        return isNaN(numberValue) ? 0 : Number(numberValue.toFixed(2));
    }

    private formatChartValue(value: any): string {
        return this.roundToTwo(value).toFixed(2);
    }

    private formatName(value: any): string {
        return String(value || '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
