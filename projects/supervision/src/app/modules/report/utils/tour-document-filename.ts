export function getTourDocumentFilename(type: 'Voucher' | 'Invoice', data: any, reference?: string): string {
  const booking = data && data.BookingDetails;
  const candidates = [
    booking && booking.app_reference,
    booking && booking.AppReference,
    booking && booking.App_Reference,
    data && data.app_reference,
    data && data.AppReference,
    data && data.App_Reference,
    reference
  ];
  const validReference = candidates.find(value => typeof value === 'string'
    && value.trim() && !/^(undefined|null)$/i.test(value.trim()));
  const suffix = validReference
    ? validReference.trim().replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').replace(/\.pdf$/i, '')
    : '';
  return `Tour ${type}${suffix ? ' - ' + suffix : ''}.pdf`;
}
