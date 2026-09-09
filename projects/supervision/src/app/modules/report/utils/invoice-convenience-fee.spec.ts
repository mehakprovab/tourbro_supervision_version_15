import { splitInvoiceConvenienceFee, splitInvoicePricingRows } from './invoice-convenience-fee';

describe('invoice convenience fee GST breakdown', () => {
    it('extracts inclusive GST rather than adding tax to the invoice', () => {
        expect(splitInvoiceConvenienceFee(118)).toEqual([
            { label: 'Convenience Amount', amount: 100 },
            { label: 'GST (18%)', amount: 18 }
        ]);
    });

    it('keeps rounded components equal to the original fee', () => {
        [0, 0.01, 1, 99.99, 100, 118, 1234.56, -118].forEach(total => {
            const rows = splitInvoiceConvenienceFee(total);
            expect(Math.round(rows.reduce((sum, row) => sum + row.amount, 0) * 100))
                .toBe(Math.round(total * 100));
        });
        expect(splitInvoiceConvenienceFee('1,180.00')[0].amount).toBe(1000);
    });

    it('handles missing fees and preserves supplier rows and original voucher pricing', () => {
        [null, undefined, '', 'invalid'].forEach(value => {
            expect(splitInvoiceConvenienceFee(value).map(row => row.amount)).toEqual([0, 0]);
        });
        const rows = [{ label: 'Base Fare', amount: 500 }, { label: 'Convenience Fee', amount: 118 }];
        expect(splitInvoicePricingRows(rows).length).toBe(3);
        expect(rows[1]).toEqual({ label: 'Convenience Fee', amount: 118 });
        const supplier = [{ label: 'Supplier Base Price', amount: 400 }];
        expect(splitInvoicePricingRows(supplier)).toEqual(supplier);
    });
});
