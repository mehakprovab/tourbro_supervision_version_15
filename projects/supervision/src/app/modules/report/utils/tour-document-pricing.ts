export function getTourDocumentPricing(data: any, showAdminFields: boolean) {
    const booking = data?.BookingDetails || {};
    const amount = (...values: any[]): number | null => {
        for (const value of values) {
            if (value == null || value === '') continue;
            const parsed = Number(String(value).replace(/,/g, ''));
            if (Number.isFinite(parsed)) return parsed;
        }
        return null;
    };
    if (!showAdminFields) {
        const baseFare = amount(booking.SupplierTotalFare);
        return {
            currency: booking.api_currency || 'INR',
            rows: [{ label: 'Supplier Base Price', amount: baseFare }],
            promoCode: null,
            total: baseFare
        };
    }
    const rows = [{ label: 'Adult Fare', amount: amount(booking.basic_fare, booking.BaseFare) }];
    if (Number(booking.ChildCount) > 0) {
        rows.push({ label: 'Child Fare', amount: amount(booking.child_fare) });
    }
    if (amount(booking.optional_tours_price)) {
        rows.push({ label: 'Optional Tour', amount: amount(booking.optional_tours_price) });
    }
    rows.push(
        { label: 'Admin Markup', amount: amount(booking.Markup, booking.admin_markup, booking.markup) ?? 0 },
        { label: 'Convenience Fee', amount: amount(booking.convenience_fee, booking.Convenience_fee, booking.ConvenienceFee) ?? 0 },
        { label: 'Discount', amount: -(amount(booking.discount, booking.Discount) ?? 0) },
        { label: 'Reward Discount', amount: -(amount(booking.reward_discount, booking.RewardDiscount) ?? 0) }
    );
    const promoCode = booking.PromoCode || booking.promo_code;
    return {
        currency: booking.currency_code || 'INR',
        rows,
        promoCode: promoCode && promoCode !== 'null' ? promoCode : 'N/A',
        total: amount(booking.TotalFare)
    };
}
