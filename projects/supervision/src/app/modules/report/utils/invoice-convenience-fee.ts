/** Split a GST-inclusive fee, keeping the displayed components equal to the fee. */
export function splitInvoiceConvenienceFee(value: any) {
    const parsed = Number(String(value ?? 0).replace(/,/g, ''));
    const totalPaise = Math.round((Number.isFinite(parsed) ? parsed : 0) * 100);
    const basePaise = Math.round(totalPaise / 1.18);
    return [
        { label: 'Convenience Amount', amount: basePaise / 100 },
        { label: 'GST (18%)', amount: (totalPaise - basePaise) / 100 }
    ];
}

export function splitInvoicePricingRows(rows: { label: string; amount: number | null }[]) {
    return rows.reduce((result, row) => result.concat(
        row.label === 'Convenience Fee' ? splitInvoiceConvenienceFee(row.amount) : [row]
    ), [] as { label: string; amount: number | null }[]);
}
