import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number | string, currency: string): string {
    if (value == null || isNaN(Number(value))) return ''; // Handle invalid or undefined input
    const [whole, decimal] = Number(value).toFixed(2).split('.');

    let words = this.convertNumberToWords(parseInt(whole)) + ` ${currency}`;
    if (decimal && parseInt(decimal) > 0 )
     {
     if (currency == 'INR' || currency == 'BDT' || currency == 'PKR') {
      words += ` and ${this.convertNumberToWords(parseInt(decimal))} Paisa`;
     }else{
      words += ` and ${this.convertNumberToWords(parseInt(decimal))} Cent`;
     }
}
    return words.trim();
  }

  private convertNumberToWords(num: number): string {
    const belowTwenty = [
      'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion'];

    if (num < 20) return belowTwenty[num];
    if (num < 100) return `${tens[Math.floor(num / 10) - 2]} ${num % 10 ? belowTwenty[num % 10] : ''}`.trim();

    let word = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = this.convertChunkToWords(chunk, belowTwenty, tens);
        word = `${chunkWords} ${scales[scaleIndex]} ${word}`.trim();
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return word.trim();
  }

  private convertChunkToWords(chunk: number, belowTwenty: string[], tens: string[]): string {
    let words = '';

    if (chunk >= 100) {
      words += `${belowTwenty[Math.floor(chunk / 100)]} Hundred `;
      chunk %= 100;
    }

    if (chunk >= 20) {
      words += `${tens[Math.floor(chunk / 10) - 2]} `;
      chunk %= 10;
    }

    if (chunk > 0) {
      words += `${belowTwenty[chunk]} `;
    }

    return words.trim();
  }
}
