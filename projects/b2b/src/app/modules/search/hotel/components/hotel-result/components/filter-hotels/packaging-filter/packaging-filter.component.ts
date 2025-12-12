import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../../../../hotel.service';

@Component({
  selector: 'app-packaging-filter',
  templateUrl: './packaging-filter.component.html',
  styleUrls: ['./packaging-filter.component.scss']
})
export class PackagingFilterComponent implements OnInit {

    public packagesForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) { }

  ngOnInit() {
    this.onPageLoad();
  }

  onPageLoad() {
    this.createForm();
  }

  createForm() {
    this.packagesForm = this.fb.group({
        packaging: ['all']
    })
  }

  packageFilter(event) {
    let type_package = event.target.value;
    this.hotelService.packagingFilter.next(type_package);
    this.hotelService.filterByPackage();
  }
}