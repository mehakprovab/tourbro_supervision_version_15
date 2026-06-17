import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})

export class CustomerComponent implements OnInit, OnChanges {
    @Input() totalCustomersData: any;
    totalCustomers: any = 0;
    totalCustomersFilter: string = 'today';
    dashboardFilterOptions = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'This Week', value: 'thisWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'All', value: 'all' }
    ];

    ngOnInit(): void {
        this.updateTotalCustomers();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.totalCustomersData) {
            this.updateTotalCustomers();
        }
    }

    onTotalCustomersFilterChange(): void {
        this.updateTotalCustomers();
    }

    updateTotalCustomers(): void {
        this.totalCustomers = this.extractDashboardValue(this.totalCustomersData, this.totalCustomersFilter, [
            'totalCustomers',
            'totalCustomer',
            'total_registered_users',
            'totalRegisteredUsers',
            'registeredUsers',
            'customerCount',
            'count',
            'total'
        ]);
    }

    extractDashboardValue(source: any, selectedFilter: string, totalKeys: string[]): any {
        const keys = selectedFilter === 'all' ? totalKeys : [selectedFilter];
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
            return source.length ? this.findDashboardValue(source[0], keys) : undefined;
        }

        for (const key of keys) {
            if (source[key] !== undefined && source[key] !== null) {
                return source[key];
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
}
