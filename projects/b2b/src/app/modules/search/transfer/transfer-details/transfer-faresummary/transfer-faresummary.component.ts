import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { TransferService } from '../../transfer.service';


@Component({
  selector: 'app-transfer-faresummary',
  templateUrl: './transfer-faresummary.component.html',
  styleUrls: ['./transfer-faresummary.component.scss']
})
export class TransferFaresummaryComponent implements OnInit {
  @Input() noOfTravellers:any;
  @Input() blockedTransfer:any;
  @Input() confirmDetails:any;
  @Input() grandTotal: any;
  @Input() convienienceFee: any
  protected subs = new SubSink();
  promocode:any;
  discount_value:number= 0.00;
  name = 'SNF';
  showDetails = true;
  extrasValue:number=0.00;

  constructor(
    private transferService: TransferService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
  }
  
  showFare() {
    this.name = this.name === 'SNF' ? 'HNF' : 'SNF';
    this.showDetails = this.name === 'HNF' ? false : true;
    this.cdRef.detectChanges();
}
}
