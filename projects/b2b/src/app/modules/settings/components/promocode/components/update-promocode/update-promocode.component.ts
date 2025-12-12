import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-update-promocode',
  templateUrl: './update-promocode.component.html',
  styleUrls: ['./update-promocode.component.scss']
})
export class UpdatePromocodeComponent implements OnInit {
  
  @Input() label: any;
  constructor() { }

  ngOnInit() {
  }

}
