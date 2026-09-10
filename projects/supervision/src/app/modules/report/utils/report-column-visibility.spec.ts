import { canViewAdminReportFields, filterAdminReportColumns } from './report-column-visibility';

describe('report column visibility', () => {
    it('keeps admin fields and removes them for both supplier roles, including string IDs', () => {
        const sessionUser = spyOn(sessionStorage, 'getItem');
        spyOn(localStorage, 'getItem').and.returnValue(null);
        [1, '1', 6, '6', 7, '7'].forEach(role => {
            sessionUser.and.returnValue(JSON.stringify({ auth_role_id: role }));
            expect(canViewAdminReportFields()).toBe(Number(role) === 1);
        });
    });

    it('uses the domain user when there is no supervision session and hides fields for invalid users', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(null);
        const domainUser = spyOn(localStorage, 'getItem');
        domainUser.and.returnValue(JSON.stringify({ auth_role_id: '7' }));
        expect(canViewAdminReportFields()).toBe(false);
        domainUser.and.returnValue(JSON.stringify({ auth_role_id: 1 }));
        expect(canViewAdminReportFields()).toBe(true);
        [null, '{}', 'invalid'].forEach(value => {
            domainUser.and.returnValue(value);
            expect(canViewAdminReportFields()).toBe(false);
        });
    });

    it('filters financial fields without removing supplier fares, currency, or booking dates', () => {
        const allowed = ['Base Fare', 'Supplier Net Fare', 'Currency', 'BookedOn', 'Cancellation Charges'];
        const restricted = ['Admin Markup', 'Discount', 'Convenience Fee', 'Customer Price',
            'Promo Code', 'Promocode', 'Promocode Amount', 'Payment Mode', 'Payment Status', 'Paid On', 'Reward Discount', 'Payment Method'];
        const columns = allowed.concat(restricted).map(value => ({ value }));
        expect(filterAdminReportColumns(columns, false).map(column => column.value)).toEqual(allowed);
        expect(filterAdminReportColumns(columns, true)).toBe(columns);
        expect(columns.length).toBe(allowed.length + restricted.length);
    });

    it('supports dynamic package labels and existing report-specific supplier restrictions', () => {
        const columns = [{ label: 'Package Reference' }, { label: 'Customer Paid Amount' },
            { label: 'Payment Status' }, { label: 'Total Net' }];
        expect(filterAdminReportColumns(columns, false, ['Total Net'])).toEqual([columns[0]]);
    });
});
