export function getHotelDocumentPricing(data: any, showAdminFields: boolean) {
    const booking = data?.BookingDetails || {};
    let cancellation = booking.CancellationReason;
    if (typeof cancellation === 'string') {
        try {
            cancellation = JSON.parse(cancellation);
        } catch {
            cancellation = {};
        }
    }
    const amount = (value: any): number | null => {
        if (value == null || value === '') return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };
    if (!showAdminFields) {
        const baseFare = amount(cancellation?.hotelBody?.SupplierPrice)
            ?? amount(booking.DomainOrigin === 'CRS' ? booking.API_Payable_Price : booking.Netfare_In_API_Currency);
        return {
            currency: booking.API_Currency || booking.Currency || 'INR',
            rows: [{ label: 'Supplier Base Price', amount: baseFare }],
            total: baseFare
        };
    }
    const itinerary = data?.BookingItineraryDetails || [];
    const baseFare = itinerary.length
        ? itinerary.reduce((sum, room) => sum + (amount(room.RoomPrice) ?? 0), 0)
        : (amount(booking.BaseFare) ?? amount(booking.TotalFare) ?? 0);
    return {
        currency: booking.Currency || 'INR',
        rows: [
            { label: 'Base Fare', amount: baseFare },
            { label: 'Convenience Fee', amount: amount(booking.ConvinenceAmount) ?? 0 },
            { label: 'Promo Discount', amount: -(amount(booking.Discount) ?? 0) },
            { label: 'Reward Discount', amount: -(amount(booking.reward_discount) ?? amount(booking.RewardDiscount) ?? 0) }
        ],
        total: amount(booking.TotalAmount) ?? amount(booking.TotalFare) ?? 0
    };
}
