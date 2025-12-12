import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-account-system',
  templateUrl: './search-account-system.component.html',
  styleUrls: ['./search-account-system.component.scss']
})
export class SearchAccountSystemComponent implements OnInit {
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue'
    };
  constructor(private fb: FormBuilder) {
    
   }

  ngOnInit() {
  }

  openDate() {
    this.isOpen = true;
}


}
