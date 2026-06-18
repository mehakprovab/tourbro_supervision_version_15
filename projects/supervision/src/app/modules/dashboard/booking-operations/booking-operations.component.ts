import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";

@Component({
    selector: 'app-booking-operations',
    templateUrl: './booking-operations.component.html',
    styleUrls: ['./booking-operations.component.scss']
})

export class BookingOperationsComponent implements OnInit, OnChanges {
    @Input() paymentPending: any = 0;
    @Input() paymentReceived: any = 0;
    @Input() paymentFailed: any = 0;
    @Input() paymentPendingData: any = {};
    @Input() paymentCompletedData: any = {};
    @Input() serviceDeliveredCancelledCountData: any = {};
    @Input() vendorConfirmationPending: any = 0;
    @Input() confirmed: any = 0;
    @Input() voucherTicketPending: any = 0;
    @Input() travelUpcoming: any = 0;
    @Input() completed: any = 0;
    @Input() cancelled: any = 0;
    @Input() refundInitiated: any = 0;
    @Input() refundCompleted: any = 0;
    enquiryGenerated: any = 0;
    enquiryGeneratedFilter = 'today';

    cardFilters = {
        paymentPending: 'today',
        paymentReceived: 'today',
        completed: 'today',
        cancelled: 'today'
    };

    cardValueOverrides = {};

    filterOptions = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'This Week', value: 'thisWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'This Year', value: 'thisYear' },
        { label: 'All', value: 'all' }
    ];

    constructor(
        private apiHandlerService: ApiHandlerService,
    ) {}

    get bookingOperationCards() {
        return [
            {
                key: 'paymentPending',
                label: 'Payment Pending',
                value: this.getCardValue('paymentPending', this.paymentPendingData, [
                    'paymentPending',
                    'pendingPayment',
                    'pendingPayments',
                    'paymentPendingCount',
                    'count',
                    'total'
                ], this.paymentPending),
                filter: true
            },
            {
                key: 'paymentReceived',
                label: 'Payment Received',
                value: this.getCardValue('paymentReceived', this.paymentCompletedData, [
                    'paymentCompleted',
                    'completedPayment',
                    'completedPayments',
                    'paymentCompletedCount',
                    'count',
                    'total'
                ], this.paymentReceived),
                filter: true
            },
            { label: 'Vendor Confirmation Pending', value: this.vendorConfirmationPending, filter: false },
            { label: 'Confirmed', value: this.confirmed, filter: false },
            { label: 'Voucher / Ticket Pending', value: this.voucherTicketPending, filter: false },
            { label: 'Travel Upcoming', value: this.travelUpcoming, filter: false },
            {
                key: 'completed',
                label: 'Completed',
                value: this.getCardValue('completed', this.serviceDeliveredCancelledCountData, [
                    'serviceDeliveredCount',
                    'deliveredCount',
                    'delivered',
                    'completed',
                    'success',
                    'totalDelivered'
                ], this.completed),
                filter: true
            },
            {
                key: 'cancelled',
                label: 'Cancelled',
                value: this.getCardValue('cancelled', this.serviceDeliveredCancelledCountData, [
                    'serviceCancelledCount',
                    'cancelledCount',
                    'cancelled',
                    'canceled',
                    'totalCancelled'
                ], this.cancelled),
                filter: true
            },
            { label: 'Refund Initiated', value: this.refundInitiated, filter: false },
            { label: 'Refund Completed', value: this.refundCompleted, filter: false },
        ];
    }

    onCardFilterChange(cardKey: string, value: string): void {
        if (this.cardFilters[cardKey] !== undefined) {
            this.cardFilters[cardKey] = value;
            delete this.cardValueOverrides[cardKey];
            this.loadFilteredCardValue(cardKey);
        }
    }

    getCardFilter(cardKey: string): string {
        return this.cardFilters[cardKey] || 'today';
    }

    getEventValue(event: Event): string {
        return (event.target as HTMLSelectElement).value;
    }

    onEnquiryGeneratedFilterChange(value: string): void {
        this.enquiryGeneratedFilter = value;
        this.loadEnquiryGenerated();
    }

    private loadEnquiryGenerated(): void {
        const payload = this.getLeadFilterPayload(this.enquiryGeneratedFilter);

        this.apiHandlerService.apiHandler('enquiryGenerated', 'post', {}, {}, payload).subscribe(
            (resp) => {
                const responseData = resp && resp.data !== undefined ? resp.data : resp;
                const value = this.getFilteredApiValue(responseData, this.enquiryGeneratedFilter, [
                    'enquiryGenerated',
                    'enquiry_generated',
                    'enquiryGeneratedCount',
                    'generatedEnquiry',
                    'generatedEnquiries',
                    'leadGenerated',
                    'leadGeneratedCount',
                    'leads',
                    'count',
                    'total'
                ]);
                this.enquiryGenerated = value !== undefined && value !== null && value !== '' ? value : 0;
            },
            () => {
                this.enquiryGenerated = 0;
            }
        );
    }

    private getLeadFilterPayload(selectedFilter: string): any {
        if (selectedFilter === 'all') {
            return {};
        }

        return this.getFilterPayload(selectedFilter);
    }

    private getCardValue(cardKey: string, source: any, totalKeys: string[], fallback: any = 0): any {
        if (this.cardValueOverrides[cardKey] !== undefined) {
            return this.cardValueOverrides[cardKey];
        }

        return this.getFilteredValue(source, this.getCardFilter(cardKey), totalKeys, fallback);
    }

    private loadFilteredCardValue(cardKey: string): void {
        const config = this.getCardApiConfig(cardKey);
        if (!config) {
            return;
        }

        const selectedFilter = this.getCardFilter(cardKey);
        const payload = this.getFilterPayload(selectedFilter);

        this.apiHandlerService.apiHandler(config.topic, 'post', {}, {}, payload).subscribe(
            (resp) => {
                const responseData = resp && resp.data !== undefined ? resp.data : resp;
                const filteredValue = this.getFilteredApiValue(responseData, selectedFilter, config.keys);
                this.cardValueOverrides[cardKey] = filteredValue !== undefined && filteredValue !== null && filteredValue !== ''
                    ? filteredValue
                    : this.getLocalCardValue(cardKey);
            },
            () => {
                this.cardValueOverrides[cardKey] = this.getLocalCardValue(cardKey);
            }
        );
    }

    private getFilteredApiValue(source: any, selectedFilter: string, totalKeys: string[]): any {
        const filteredValue = this.findFilteredDashboardValue(source, selectedFilter, totalKeys);

        if (filteredValue !== undefined && filteredValue !== null && filteredValue !== '') {
            return filteredValue;
        }

        return this.findDashboardValue(source, totalKeys);
    }

    private getFilterPayload(selectedFilter: string): any {
        const range = this.getDateRange(selectedFilter);
        const apiFilter = this.getApiFilterValue(selectedFilter);
        const payload: any = {
            filter: selectedFilter,
            period: selectedFilter,
            duration: selectedFilter,
            dateFilter: selectedFilter,
            date_filter: selectedFilter,
            type: selectedFilter,
            range: selectedFilter,
            reportFilter: apiFilter,
            booked_from_date: range.from,
            booked_to_date: range.to,
            from_date: range.from,
            to_date: range.to,
            fromDate: range.from,
            toDate: range.to,
            start_date: range.from,
            end_date: range.to,
            startDate: range.from,
            endDate: range.to
        };

        if (selectedFilter === 'all') {
            delete payload.booked_from_date;
            delete payload.booked_to_date;
            delete payload.from_date;
            delete payload.to_date;
            delete payload.fromDate;
            delete payload.toDate;
            delete payload.start_date;
            delete payload.end_date;
            delete payload.startDate;
            delete payload.endDate;
        }

        return payload;
    }

    private getApiFilterValue(selectedFilter: string): string {
        switch (selectedFilter) {
            case 'today': return 'Today';
            case 'yesterday': return 'Yesterday';
            case 'thisWeek': return 'This Week';
            case 'thisMonth': return 'This Month';
            case 'thisYear': return 'This Year';
            default: return 'All';
        }
    }

    private getDateRange(selectedFilter: string): { from: string; to: string } {
        const today = new Date();
        const from = new Date(today);
        const to = new Date(today);

        switch (selectedFilter) {
            case 'yesterday':
                from.setDate(today.getDate() - 1);
                to.setDate(today.getDate() - 1);
                break;
            case 'thisWeek': {
                const day = today.getDay();
                const mondayOffset = day === 0 ? -6 : 1 - day;
                from.setDate(today.getDate() + mondayOffset);
                break;
            }
            case 'thisMonth':
                from.setDate(1);
                break;
            case 'thisYear':
                from.setMonth(0, 1);
                break;
            default:
                break;
        }

        return {
            from: this.formatDate(from),
            to: this.formatDate(to)
        };
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private getCardApiConfig(cardKey: string): any {
        switch (cardKey) {
            case 'paymentPending':
                return {
                    topic: 'paymentPending',
                    keys: ['paymentPending', 'pendingPayment', 'pendingPayments', 'paymentPendingCount', 'count', 'total']
                };
            case 'paymentReceived':
                return {
                    topic: 'paymentCompleted',
                    keys: ['paymentCompleted', 'completedPayment', 'completedPayments', 'paymentCompletedCount', 'count', 'total']
                };
            case 'completed':
                return {
                    topic: 'serviceDeliveredCancelledCount',
                    keys: ['serviceDeliveredCount', 'deliveredCount', 'delivered', 'completed', 'success', 'totalDelivered']
                };
            case 'cancelled':
                return {
                    topic: 'serviceDeliveredCancelledCount',
                    keys: ['serviceCancelledCount', 'cancelledCount', 'cancelled', 'canceled', 'totalCancelled']
                };
            default:
                return null;
        }
    }

    private getLocalCardValue(cardKey: string): any {
        const config = this.getCardApiConfig(cardKey);
        if (!config) {
            return 0;
        }

        switch (cardKey) {
            case 'paymentPending':
                return this.getFilteredValue(this.paymentPendingData, this.getCardFilter(cardKey), config.keys, this.paymentPending);
            case 'paymentReceived':
                return this.getFilteredValue(this.paymentCompletedData, this.getCardFilter(cardKey), config.keys, this.paymentReceived);
            case 'completed':
                return this.getFilteredValue(this.serviceDeliveredCancelledCountData, this.getCardFilter(cardKey), config.keys, this.completed);
            case 'cancelled':
                return this.getFilteredValue(this.serviceDeliveredCancelledCountData, this.getCardFilter(cardKey), config.keys, this.cancelled);
            default:
                return 0;
        }
    }

    private getFilteredValue(source: any, selectedFilter: string, totalKeys: string[], fallback: any = 0): any {
        const value = selectedFilter === 'all'
            ? this.findDashboardValue(source, totalKeys)
            : this.findFilteredDashboardValue(source, selectedFilter, totalKeys);

        return value !== undefined && value !== null && value !== '' ? value : fallback;
    }

    private findFilteredDashboardValue(source: any, selectedFilter: string, totalKeys: string[]): any {
        if (!source) {
            return undefined;
        }

        const filterKeys = this.getFilterAliases(selectedFilter);
        for (const filterKey of filterKeys) {
            const bucket = this.findExactDashboardValue(source, filterKey);
            const value = this.findDashboardValue(bucket, totalKeys);
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }

        const directKeys = [];
        filterKeys.forEach(filterKey => {
            totalKeys.forEach(totalKey => {
                directKeys.push(`${filterKey}${this.capitalize(totalKey)}`);
                directKeys.push(`${totalKey}${this.capitalize(filterKey)}`);
                directKeys.push(`${filterKey}_${totalKey}`);
                directKeys.push(`${totalKey}_${filterKey}`);
            });
        });

        return this.findDashboardValue(source, directKeys.concat(totalKeys));
    }

    private getFilterAliases(filter: string): string[] {
        switch (filter) {
            case 'today': return ['today', 'Today', 'currentDay'];
            case 'yesterday': return ['yesterday', 'Yesterday', 'lastDay'];
            case 'thisWeek': return ['thisWeek', 'week', 'currentWeek'];
            case 'thisMonth': return ['thisMonth', 'month', 'currentMonth'];
            case 'thisYear': return ['thisYear', 'year', 'currentYear'];
            default: return ['all', 'All', 'total'];
        }
    }

    private findDashboardValue(source: any, keys: string[]): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return source;
        }

        if (Array.isArray(source)) {
            for (const item of source) {
                const value = this.findDashboardValue(item, keys);
                if (value !== undefined && value !== null && value !== '') {
                    return value;
                }
            }
            return undefined;
        }

        for (const key of keys) {
            if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
                return source[key];
            }
        }

        for (const key of Object.keys(source)) {
            const value = this.findDashboardValue(source[key], keys);
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }

        return undefined;
    }

    private findExactDashboardValue(source: any, key: string): any {
        if (source === null || source === undefined || typeof source !== 'object') {
            return undefined;
        }

        if (Array.isArray(source)) {
            for (const item of source) {
                const value = this.findExactDashboardValue(item, key);
                if (value !== undefined && value !== null && value !== '') {
                    return value;
                }
            }
            return undefined;
        }

        return source[key];
    }

    private capitalize(value: string): string {
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }

    ngOnInit(): void {
        this.loadEnquiryGenerated();
    }

    ngOnChanges(): void {
        this.cardValueOverrides = {};
    }
}
