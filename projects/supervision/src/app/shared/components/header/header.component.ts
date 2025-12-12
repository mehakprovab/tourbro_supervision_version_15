import {Component, HostBinding, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ThemeOptions} from '../../../theme-options';
import { environment } from 'projects/supervision/src/environments/environment';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  showUser:boolean =true;
  constructor(public globals: ThemeOptions) {
  }

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;
  loggedInUser: any;
  @select('config') public config$: Observable<any>;
  ngOnInit(){
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    if (this.loggedInUser['auth_role_id'] === 6 || this.loggedInUser['auth_role_id'] === 7 ){
     this.showUser = false;
    }
    }
  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }
  getImage(img) {
    return `${baseUrl  + img}`
  
}

}
