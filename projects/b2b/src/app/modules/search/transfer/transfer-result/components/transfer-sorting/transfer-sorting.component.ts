import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../../transfer.service';

@Component({
  selector: 'app-transfer-sorting',
  templateUrl: './transfer-sorting.component.html',
  styleUrls: ['./transfer-sorting.component.scss']
})
export class TransferSortingComponent implements OnInit {
  byBest = true;
  active = 'byName';
  byName = true;
  byPrice = true;
  byStars = true;
  constructor(
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
  }

  sortByName(internalCall: boolean = false) {
    this.active = 'byName';
    this.byName = internalCall ? this.byName : !this.byName;
    let sortedTransfer;
    const transfers = this.transferService.transfer.value;
    if (this.byName) {
      sortedTransfer = transfers.sort((a, b) => {
        const resultA = a['ProductName'].toUpperCase();
        const resultB = b['ProductName'].toUpperCase();
        return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
      });
    } else { // descending order
      sortedTransfer = transfers.sort((a, b) => {
        const resultA = a['ProductName'].toUpperCase();
        const resultB = b['ProductName'].toUpperCase();
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
      });
    }
    this.transferService.transfer.next(sortedTransfer);
  }

  sortByStars(internalCall: boolean = false) {
    this.active = 'byStars';
    this.byStars = internalCall ? this.byStars : !this.byStars;
    let sortedTransfers;
    const transfer = this.transferService.transfer.value;
    if (this.byStars) {
      sortedTransfers = transfer.sort((a, b) => {
        const resultA = Number(a['StarRating'] ? a['StarRating'] : 0);
        const resultB = Number(b['StarRating'] ? b['StarRating'] : 0);
        return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
      });
    } else { // descending order
      sortedTransfers = transfer.sort((a, b) => {
        const resultA = Number(a['StarRating']);
        const resultB = Number(b['StarRating']);
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
      });
    }
    this.transferService.transfer.next(sortedTransfers);
  }

  sortByPrice(internalCall: boolean = false) {
    this.active = 'byPrice';
    this.byPrice = internalCall ? this.byPrice : !this.byPrice;
    let sortedTransfer;
    const transfers = this.transferService.transfer.value;
    if (this.byPrice) {
      sortedTransfer = transfers.sort((a, b) => {
            const resultA = Number(a['Price']['TotalDisplayFare'] ? a['Price']['TotalDisplayFare'] : 0);
            const resultB = Number(b['Price']['TotalDisplayFare'] ? b['Price']['TotalDisplayFare'] : 0);
            return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
        });
    } else { // descending order
      sortedTransfer = transfers.sort((a, b) => {
            const resultA = Number(a['Price']['TotalDisplayFare']);
            const resultB = Number(b['Price']['TotalDisplayFare']);
            return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
        });
    }
    this.transferService.transfer.next(sortedTransfer);
}
}