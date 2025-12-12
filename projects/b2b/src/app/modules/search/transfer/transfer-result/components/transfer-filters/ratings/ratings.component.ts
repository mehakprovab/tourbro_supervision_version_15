import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransferService } from '../../../../transfer.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  regConfig: FormGroup;
  transfer: any;
  selectedRatings: any = [];

  constructor(private fb: FormBuilder,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.transferService.transferCopy.subscribe(data => {
      this.transfer = data;
    });
    this.transferService.clearTransferRatings.subscribe(data => {
      if (data) {
        this.createForm();
        this.selectedRatings=[];
        this.transferService.ratings.next([]);
        this.transferService.filterByRatings();
      }
    });
  }

  createForm(){
    this.regConfig = this.fb.group({
      ratings: this.fb.array(this.getRatingRanges())
    });
  }
  getRatingRanges(): FormGroup[] {
    const ranges = [
      { name: 'Poor 0* - 1*', value: '0-1' },
      { name: 'Fair 1* - 2*', value: '1-2' },
      { name: 'Good 2* - 3*', value: '2-3' },
      { name: 'Very Good 3* - 4*', value: '3-4' },
      { name: 'Excellent 4* - 5*', value: '4-5' }
    ];

    return ranges.map(range => this.fb.group({
      name: range.name,
      value: range.value,
      isChecked: false
    }));
  }

  filterByRatings(isChecked: boolean, value: string): void {
    this.updateSelectedRatings(isChecked, value);
    this.transferService.filterByRatings();
  }

  updateSelectedRatings(isChecked: boolean, value: string): void {
    if (isChecked) {
      this.selectedRatings.push(value);
    } else {
      const index = this.selectedRatings.indexOf(value);
      if (index > -1) {
        this.selectedRatings.splice(index, 1);
      }
    }
    this.transferService.ratings.next(this.selectedRatings);
  }

}
