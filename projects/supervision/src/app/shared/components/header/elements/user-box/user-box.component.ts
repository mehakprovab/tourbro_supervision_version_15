import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeOptions } from '../../../../../theme-options';
import { AuthService } from '../../../../../auth/auth.service';
import { environment } from '../../../../../../environments/environment.prod';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {
  
currentUser: any = {};
imageURL: string = "./assets/images/avatars/1.jpg";
showUser: boolean =true;
  constructor(
    public globals: ThemeOptions,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
    console.log("")
    if(this.currentUser['image'] && this.currentUser['image']!=""){
      this.imageURL = `${baseUrl+this.currentUser['image']}`; 
    }
    if (this.currentUser['auth_role_id'] == 6 ){
      this.showUser = false;
     }
  }

  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
