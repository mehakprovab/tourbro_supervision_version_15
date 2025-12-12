import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../../../../transfer.service';

@Component({
  selector: 'app-transfer-name',
  templateUrl: './transfer-name.component.html',
  styleUrls: ['./transfer-name.component.scss']
})
export class TransferNameComponent implements OnInit {
  public searchIcon: string = "assets/images/awesome-search.png";
  @ViewChild('searchInputRef', { static: true }) searchInputRef: ElementRef;

  constructor(
    private transferService: TransferService
  ) { }

  ngOnInit() {
    this.transferService.clearTransferName.subscribe(flag => {
      if (flag) {
        this.clearTransferName();
      }
    });
  }

  searchHotels(searchText: string) {
    this.transferService.filterByTransferName(searchText);
  }

  clearTransferName() {
    this.searchInputRef.nativeElement.value = ''; // Clear the value of the input field
    this.transferService.filterByTransferName(undefined);
  }

}