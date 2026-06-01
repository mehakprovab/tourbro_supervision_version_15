import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-or-modify-about-faq',
  templateUrl: './add-or-modify-about-faq.component.html',
  styleUrls: ['./add-or-modify-about-faq.component.scss']
})
export class AddOrModifyAboutFaqComponent implements OnInit {

 
   @ViewChild('tabs', { static: true })
tabs!: NgbNav;
   activeIdString = "staticpage_list";
 constructor() { }
 
 ngOnInit() {
 }
 beforeChange(e){
     
 }
 
 triggerTab(data: any) {
   if (data) {
       this.tabs.select(data.tabId);
   }
 }
 
 }
 