import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceField'
})
export class InvoiceFieldPipe implements PipeTransform {
  transform(value: any, field: string): any {
    const root = this.firstRecord(value);
    const booking = this.booking(root);
    const leadPax = this.leadPax(root, booking);
    const itinerary = this.first(root.BookingItineraryDetails, root.itinerary, root.ItineraryDetails, root.BookingItinerary, booking.itinerary);
    const activity = root.ItenaryData || root.ItineraryData || root.ActivityData || {};

    switch (field) {
      case 'invoiceNumber':
        return this.invoiceNumber(root, booking);
      case 'invoiceDate':
        return this.firstDate(this.value(root, booking, itinerary, leadPax, ['InvoiceDate', 'invoice_date', 'created_at', 'CreatedDatetime', 'BookedOn', 'booking_date'])) || new Date();
      case 'bookingReference':
        return this.value(root, booking, itinerary, ['AppReference', 'app_reference', 'App_Reference', 'BookingReference', 'booking_reference', 'ConfirmationReference', 'Booking_Id']) || 'N/A';
      case 'customerName':
        return this.customerName(root, booking, leadPax);
      case 'customerAddress':
        return this.value(leadPax, booking, root, ['Address', 'address', 'Address1', 'address1', 'adress1', 'billing_address']) || 'N/A';
      case 'customerGstin':
        return this.value(leadPax, booking, root, ['GSTIN', 'GstNo', 'gst_number', 'gstin']) || 'Unregistered';
      case 'customerMobile':
        return this.customerMobile(root, booking, leadPax);
      case 'customerEmail':
        return this.value(leadPax, booking, root, ['Email', 'email', 'holder_email', 'customer_email']) || 'N/A';
      case 'serviceBooked':
        return this.serviceBooked(root, booking, activity, itinerary);
      case 'vendorName':
        return this.value(booking, root, activity, itinerary, ['VendorName', 'vendor_name', 'ServiceProvider', 'provider_name', 'HotelName', 'hotel_name', 'SupplierName', 'supplier_name', 'CarSupplierName', 'operator_name', 'operator', 'BusinessName']) || 'N/A';
      case 'bookingDate':
        return this.value(booking, root, itinerary, leadPax, ['BookedOn', 'created_at', 'CreatedDatetime', 'booking_date', 'BookingDate']) || '';
      case 'travelPeriod':
        return this.travelPeriod(root, booking, itinerary);
      case 'startDate':
        return this.formatDisplayDate(this.value(booking, root, itinerary, ['HotelCheckIn', 'hotel_check_in', 'CheckIn', 'travelDate', 'from_date', 'CarFromDate', 'departure_datetime', 'departure_date', 'start_date', 'journey_date'])) || '';
      case 'endDate':
        return this.formatDisplayDate(this.value(booking, root, itinerary, ['HotelCheckOut', 'hotel_check_out', 'CheckOut', 'ToDate', 'to_date', 'CarToDate', 'arrival_datetime', 'return_date', 'end_date', 'journey_end_date'])) || '';
      case 'startTime':
        return this.formatDisplayTime(this.value(booking, root, itinerary, ['PickUpTime', 'pickup_time', 'start_time', 'journey_time', 'departure_datetime', 'departure_time', 'activity_timing'])) || 'N/A';
      case 'nights':
        return this.nights(root, booking, itinerary);
      case 'guestCount':
        return this.guestCount(root, booking);
      case 'bookingAmount':
        return this.amount(root, booking, itinerary, ['BaseFare', 'basic_fare', 'TotalFare', 'total_fare', 'total_price', 'SupplierTotalFare', 'totalAmount', 'total_amount']);
      case 'convenienceFee':
        return this.amount(root, booking, itinerary, ['ConvinenceAmount', 'ConvenienceFee', 'convenience_fee', 'convinence', 'convienence', 'service_fee']);
      case 'discount':
        return this.amount(root, booking, itinerary, ['Discount', 'discount', 'discount_value', 'discountAmount', 'seller_discount']);
      case 'rewardPoints':
        return this.amount(root, booking, itinerary, ['reward_points', 'RewardPoints', 'rewardPoints', 'reward_discount', 'RewardDiscount']);
      case 'totalAmount':
        return this.totalAmount(root, booking, itinerary);
      case 'currency':
        return this.value(root, booking, itinerary, ['Currency', 'currency', 'currency_code', 'api_currency']) || 'INR';
      default:
        return '';
    }
  }

  private firstRecord(value: any): any {
    return Array.isArray(value) ? (value[0] || {}) : (value || {});
  }

  private booking(root: any): any {
    return this.firstRecord(root.BookingDetails || root.bookingDetails || root.booking || root.BookingDeatils || root);
  }

  private first(...values: any[]): any {
    for (const value of values) {
      if (Array.isArray(value) && value.length) {
        return value[0];
      }
      if (value && !Array.isArray(value)) {
        return value;
      }
    }
    return {};
  }

  private value(...args: any[]): any {
    const keys = args.pop();
    for (const source of args) {
      if (!source) {
        continue;
      }
      for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
          return source[key];
        }
      }
    }
    return '';
  }

  private leadPax(root: any, booking: any): any {
    const paxList = []
      .concat(root.BookingPaxDetails || [])
      .concat(root.paxDetails || [])
      .concat(root.PaxDetails || [])
      .concat(root.PassengerDetails || [])
      .concat(root.passengers || [])
      .concat(root.pax_details || [])
      .concat(root.pax || [])
      .concat(booking.BookingPaxDetails || [])
      .concat(booking.pax || []);

    return paxList.find((pax: any) => pax && (
      pax.LeadPax === true || pax.LeadPax === 1 || pax.is_lead_pax === 1 || pax.IsLeadPax === 1
    )) || paxList[0] || {};
  }

  private invoiceNumber(root: any, booking: any): string {
    const explicit = this.value(root, booking, ['InvoiceNumber', 'invoice_number', 'merchantInvoiceNumber']);
    if (explicit) {
      return explicit;
    }
    const reference = this.value(root, booking, ['AppReference', 'app_reference', 'App_Reference', 'BookingReference', 'booking_reference']);
    const suffix = reference && String(reference).includes('-') ? String(reference).split('-')[1] : reference;
    return suffix ? `INV-${suffix}` : 'N/A';
  }

  private customerName(root: any, booking: any, leadPax: any): string {
    const direct = this.value(leadPax, booking, root, ['name', 'customer_name', 'holder_name']);
    if (direct) {
      return direct;
    }
    const title = this.value(leadPax, ['Title', 'title', 'pax_title']);
    const first = this.value(leadPax, ['FirstName', 'first_name', 'pax_first_name']);
    const last = this.value(leadPax, ['LastName', 'last_name', 'pax_last_name']);
    return [title, first, last].filter(Boolean).join(' ') || 'N/A';
  }

  private customerMobile(root: any, booking: any, leadPax: any): string {
    const code = this.value(leadPax, booking, root, ['PhoneCode', 'phone_code']);
    const mobile = this.value(leadPax, booking, root, ['PhoneNumber', 'phone_number', 'mobile_number', 'Mobile', 'mobile', 'Phone', 'phone', 'holder_contact', 'customer_phone']);
    return mobile ? `${code ? `+${code} ` : ''}${mobile}` : 'N/A';
  }

  private serviceBooked(root: any, booking: any, activity: any, itinerary: any): string {
    const from = this.value(root, booking, itinerary, ['from_city', 'origin', 'pickup_location', 'source', 'JourneyFrom', 'departure_from']);
    const to = this.value(root, booking, itinerary, ['to_city', 'destination', 'drop_location', 'JourneyTo', 'arrival_to']);
    const service = this.value(booking, root, activity, itinerary, ['package_name', 'activity_name', 'ProductName', 'HotelName', 'hotel_name', 'CarName', 'bus_name', 'bus_type', 'operator_name', 'operator', 'transfer_name', 'title']);
    return service || (from || to ? `${from || ''}${from && to ? ' to ' : ''}${to || ''}` : 'N/A');
  }

  private travelPeriod(root: any, booking: any, itinerary: any): string {
    const from = this.value(booking, root, itinerary, ['HotelCheckIn', 'hotel_check_in', 'CheckIn', 'travelDate', 'from_date', 'CarFromDate', 'departure_date', 'start_date', 'journey_date']);
    const to = this.value(booking, root, itinerary, ['HotelCheckOut', 'hotel_check_out', 'CheckOut', 'ToDate', 'to_date', 'CarToDate', 'return_date', 'end_date', 'journey_end_date']);
    if (from && to) {
      return `${this.formatDisplayDate(from)} to ${this.formatDisplayDate(to)}`;
    }
    return this.formatDisplayDate(from || to) || 'N/A';
  }

  private nights(root: any, booking: any, itinerary: any): string {
    const from = this.value(booking, root, itinerary, ['HotelCheckIn', 'hotel_check_in', 'CheckIn', 'travelDate', 'from_date', 'CarFromDate', 'departure_date', 'start_date', 'journey_date']);
    const to = this.value(booking, root, itinerary, ['HotelCheckOut', 'hotel_check_out', 'CheckOut', 'ToDate', 'to_date', 'CarToDate', 'return_date', 'end_date', 'journey_end_date']);
    const checkIn = this.toDate(from);
    const checkOut = this.toDate(to);

    if (checkIn && checkOut) {
      const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
      if (diff >= 0) {
        return `${diff} Night${diff === 1 ? '' : 's'}`;
      }
    }

    const fallback = this.value(booking, root, ['NoOfNights', 'no_of_nights', 'Nights', 'duration_days', 'duration']);
    if (!fallback) {
      return 'N/A';
    }
    if (isNaN(Number(fallback))) {
      return fallback;
    }
    return `${fallback} Night${Number(fallback) === 1 ? '' : 's'}`;
  }

  private toDate(value: any): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(this.firstDate(value) || value);
    if (isNaN(date.getTime())) {
      return null;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private firstDate(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    const parts = value.split(/\s+to\s+/i);
    return parts[0] || value;
  }

  private formatDisplayDate(value: any): string {
    const firstValue = this.firstDate(value);
    if (!firstValue) {
      return '';
    }

    const date = firstValue instanceof Date ? firstValue : new Date(firstValue);
    if (isNaN(date.getTime())) {
      return String(firstValue);
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  }

  private formatDisplayTime(value: any): string {
    const firstValue = this.firstDate(value);
    if (!firstValue) {
      return '';
    }

    const date = firstValue instanceof Date ? firstValue : new Date(firstValue);
    if (isNaN(date.getTime())) {
      return String(firstValue);
    }

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private guestCount(root: any, booking: any): string {
    const adults = Number(this.value(booking, root, ['AdultCount', 'adult_count', 'adults', 'NoOfAdults']) || 0);
    const children = Number(this.value(booking, root, ['ChildCount', 'child_count', 'children', 'NoOfChilds']) || 0);
    const paxCount = this.leadPaxCount(root, booking);
    const parts = [];
    if (adults) {
      parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    }
    if (children) {
      parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    }
    return parts.join(', ') || (paxCount ? `${paxCount} Guest${paxCount > 1 ? 's' : ''}` : 'N/A');
  }

  private leadPaxCount(root: any, booking: any): number {
    const lists = [root.BookingPaxDetails, root.paxDetails, root.PaxDetails, root.PassengerDetails, root.passengers, root.pax_details, root.pax, booking.pax];
    const list = lists.find(value => Array.isArray(value) && value.length);
    return list ? list.length : 0;
  }

  private amount(root: any, booking: any, itinerary: any, keys: string[]): number {
    const value = this.value(root, booking, itinerary, keys);
    const numberValue = Number(String(value || 0).replace(/,/g, ''));
    return isNaN(numberValue) ? 0 : numberValue;
  }

  private totalAmount(root: any, booking: any, itinerary: any): number {
    const explicit = this.amount(root, booking, itinerary, ['TotalFare', 'totalNet', 'total_after_discount', 'total_price', 'TotalAmount', 'total_amount', 'total_fare']);
    if (explicit) {
      return explicit;
    }
    return this.amount(root, booking, itinerary, ['BaseFare', 'basic_fare', 'totalAmount'])
      + this.amount(root, booking, itinerary, ['ConvenienceFee', 'convenience_fee', 'convinence', 'service_fee'])
      + this.amount(root, booking, itinerary, ['GST', 'gst_value', 'Tax', 'tax']);
  }
}
