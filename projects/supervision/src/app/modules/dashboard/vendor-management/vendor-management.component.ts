import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EChartsOption  } from 'echarts';
import { DropDownAnimation } from "../animation";

@Component({
    selector: 'app-vendor-management',
    templateUrl: './vendor-management.component.html',
    styleUrls: ['./vendor-management.component.scss'],
    animations: [DropDownAnimation]
})

export class VendorManagementComponent implements OnInit, OnChanges {
    @Input() totalVendors: any = 0;
    @Input() activeVendors: any = 0;
    @Input() pendingVendors: any = 0;
    @Input() vendorCategoryData: any = {};
    @Input() vendorLocationData: any = {};
    @Input() packageInventoryData: any = {};
    @Input() packageRevenueData: any = {};
    @Input() packageBookingData: any = {};

    public options: EChartsOption;
    public locationOptions: EChartsOption;
    public isOpen: boolean = true;
    public isLocationOpen: boolean = true;
    public vendorLocations: any[] = [];
    public totalActivePackages: any = 0;
    public inactivePackages: any = 0;
    public availableInventory: any = 0;
    public packageRevenue: any = 0;
    public packageBookings: any = 0;

    ngOnInit(): void {
        this.updateVendorDashboard();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateVendorDashboard();
    }

    updateVendorDashboard(): void {
        this.vendorLocations = this.toChartItems(this.vendorLocationData);
        this.totalActivePackages = this.extractDashboardValue(this.packageInventoryData, [
            'totalActivePackages',
            'total_active_packages',
            'totalactivepackages',
            'activePackages',
            'active_packages',
            'activePackage',
            'activePackageCount',
            'totalActive',
            'active',
            'totalActivePackageCount',
            'activeCount'
        ]);
        this.inactivePackages = this.extractDashboardValue(this.packageInventoryData, [
            'inactivePackages',
            'totalInactivePackages',
            'total_inactive_packages',
            'inactive_packages',
            'inactivePackage',
            'inactivePackageCount',
            'totalInactive',
            'inactive',
            'totalInactivePackageCount',
            'inactiveCount'
        ]);
        this.availableInventory = this.extractDashboardValue(this.packageInventoryData, [
            'availableInventory',
            'inventory',
            'available',
            'totalInventory'
        ]);
        this.packageRevenue = this.extractDashboardValue(this.packageRevenueData, [
            'totalRevenue',
            'packageRevenue',
            'packageWiseRevenue',
            'totalGrossBookingValuePackageWise',
            'totalGrossBookingValue',
            'grossBookingValue',
            'gross_booking_value',
            'revenue',
            'amount',
            'total'
        ]);
        this.packageRevenue = this.packageRevenue || this.extractDashboardValue(this.packageBookingData, [
            'totalRevenue',
            'packageRevenue',
            'packageWiseRevenue',
            'totalGrossBookingValue',
            'grossBookingValue',
            'revenue',
            'amount'
        ]);
        this.packageBookings = this.extractDashboardValue(this.packageBookingData, [
            'totalBookings',
            'packageBookings',
            'packageBooking',
            'averageBookingValue',
            'avgBookingValue',
            'average_booking_value',
            'avg_booking_value',
            'bookings',
            'bookingCount',
            'count',
            'total'
        ]);
        this.packageBookings = this.packageBookings || this.extractDashboardValue(this.packageRevenueData, [
            'totalBookings',
            'packageBookings',
            'packageBooking',
            'bookings',
            'bookingCount',
            'count'
        ]);
        this.getLoadPieChart();
        this.getLoadLocationChart();
    }

    public getLoadPieChart() {
        this.options = this.buildPieChartOptions('Vendor Category', this.vendorCategoryData);
    }

    public getLoadLocationChart() {
        this.locationOptions = this.buildPieChartOptions('Vendor Location', this.vendorLocationData);
    }

    buildPieChartOptions(seriesName: string, source: any): EChartsOption {
        const chartData = this.toChartItems(source)
            .map((item, index) => ({
                value: this.roundToTwo(item.value),
                name: item.name,
                itemStyle: { color: this.getChartColor(index) }
            }))
            .filter(item => item.value > 0);

        return {
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => `${params.name}<br/>${this.formatNumber(params.value)}`
            },
            series: [
                {
                    name: seriesName,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    label: {
                        show: true,
                        formatter: (params: any) => `${params.name}\n${this.formatNumber(params.value)}`
                    },
                    data: chartData.length ? chartData : [{ value: 0, name: 'No Data' }],
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

    toChartItems(source: any): any[] {
        const data = source && source.data !== undefined ? source.data : source;

        if (!data) {
            return [];
        }

        if (Array.isArray(data)) {
            const chartItems = data.map(item => ({
                name: this.getItemName(item),
                value: this.getItemValue(item)
            })).filter(item => item.name);

            return this.aggregateChartItems(chartItems);
        }

        const breakdown = data.categoryBreakdown || data.locationBreakdown || data.breakdown || data.categories || data.locations || data.items;
        if (breakdown) {
            return this.toChartItems(breakdown);
        }

        if (typeof data === 'object') {
            return Object.keys(data)
                .filter(key => typeof data[key] !== 'object')
                .map(key => ({
                    name: this.formatLabel(key),
                    value: data[key] || 0
                }));
        }

        return [];
    }

    getItemName(item: any): string {
        if (item === null || item === undefined) {
            return '';
        }

        if (typeof item !== 'object') {
            return String(item);
        }

        const name = item.name || item.category || item.vendorCategory || item.location || item.city || item.country_name || item.country || item.state || item.label || item.type;
        return name ? this.formatLabel(String(name)) : '';
    }

    getItemValue(item: any): any {
        if (item === null || item === undefined) {
            return 0;
        }

        if (typeof item !== 'object') {
            return item;
        }

        return item.count || item.total || item.value || item.amount || item.revenue;
    }

    aggregateChartItems(items: any[]): any[] {
        const totals = items.reduce((acc, item) => {
            const value = this.toNumber(item.value);
            const count = item.value === undefined || item.value === null || item.value === '' ? 1 : value;
            acc[item.name] = (acc[item.name] || 0) + count;
            return acc;
        }, {});

        return Object.keys(totals).map(name => ({
            name,
            value: totals[name]
        }));
    }

    extractDashboardValue(source: any, keys: string[]): any {
        const value = this.findDashboardValue(source, keys);
        return value !== undefined && value !== null && value !== '' ? value : 0;
    }

    findDashboardValue(source: any, keys: string[]): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return source;
        }

        if (Array.isArray(source)) {
            const values = source
                .map(item => this.findDashboardValue(item, keys))
                .filter(value => value !== undefined && value !== null && value !== '');
            const numericValues = values.map(value => this.toNumber(value)).filter(value => !isNaN(value));
            return numericValues.length ? numericValues.reduce((total, value) => total + value, 0) : values[0];
        }

        for (const key of keys) {
            if (source[key] !== undefined && source[key] !== null) {
                return typeof source[key] === 'object' ? this.findDashboardValue(source[key], keys) : source[key];
            }
        }

        for (const value of Object.values(source)) {
            const nestedValue = this.findDashboardValue(value, keys);
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                return nestedValue;
            }
        }

        return undefined;
    }

    toNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            return Number(value.replace(/,/g, ''));
        }

        return Number(value) || 0;
    }

    roundToTwo(value: any): number {
        return Number(this.toNumber(value).toFixed(2));
    }

    formatNumber(value: any): string {
        return this.roundToTwo(value).toFixed(2);
    }

    formatLabel(value: string): string {
        return String(value || '')
            .replace(/[_-]+/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    getChartColor(index: number): string {
        const colors = [
            'rgba(250, 46, 236, 1)',
            'rgba(168, 46, 250, 1)',
            'rgba(22, 159, 59, 1)',
            'rgba(255, 180, 27, 1)',
            'rgba(203, 203, 52, 1)',
            'rgba(97, 52, 203, 1)',
            'rgba(46, 213, 250, 1)'
        ];
        return colors[index % colors.length];
    }
}
