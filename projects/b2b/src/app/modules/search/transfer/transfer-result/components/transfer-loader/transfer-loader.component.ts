import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-loader',
  templateUrl: './transfer-loader.component.html',
  styleUrls: ['./transfer-loader.component.scss']
})
export class TransferLoaderComponent implements OnInit {
  transferInfo: any
  tmxtransferApi: boolean = false;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.transferInfo = this.data.data.value;
  }
}
