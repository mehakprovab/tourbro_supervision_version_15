import { Pipe, PipeTransform } from '@angular/core';
import { splitInvoiceConvenienceFee } from '../utils/invoice-convenience-fee';

@Pipe({ name: 'invoiceConvenienceFee' })
export class InvoiceConvenienceFeePipe implements PipeTransform {
    transform(value: any) {
        return splitInvoiceConvenienceFee(value);
    }
}
