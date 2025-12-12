import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainLogoService implements OnInit {
 domainLogo = new BehaviorSubject<object>([]);

  constructor() { }

  ngOnInit(){
    console.log("domainLogo",this.domainLogo)
  }

}
