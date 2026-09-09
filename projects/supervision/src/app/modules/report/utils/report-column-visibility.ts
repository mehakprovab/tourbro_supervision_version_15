/** Supplier roles used by the supervision reports (hotel supplier and DMC). */
export function canViewAdminReportFields(): boolean {
    const storedUser = sessionStorage.getItem('currentSupervisionUser') || localStorage.getItem('currentDomainUser');
    try {
        const user = JSON.parse(storedUser || 'null');
        const role = Number(user && user.auth_role_id);
        return role > 0 && role !== 6 && role !== 7;
    } catch {
        return false;
    }
}

export function filterAdminReportColumns<T extends { value?: string; label?: string }>(
    columns: T[], showAdminFields: boolean, supplierHiddenLabels: string[] = []
): T[] {
    if (showAdminFields) {
        return columns;
    }
    return columns.filter(column => {
        const label = (column.value || column.label || '').trim();
        const normalized = label.toLowerCase().replace(/[^a-z]/g, '');
        return !supplierHiddenLabels.includes(label) &&
            !normalized.includes('discount') &&
            !['adminmarkup', 'conveniencefee', 'paymentmode', 'paymentmethod',
              'paymentstatus', 'paidon', 'customerprice', 'customeramount',
              'customerpaidamount', 'promocodeamount'].includes(normalized);
    });
}
