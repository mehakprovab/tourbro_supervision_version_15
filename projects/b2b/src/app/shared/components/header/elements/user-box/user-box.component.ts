import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeOptions } from '../../../../../theme-options';
import { AuthService } from '../../../../../auth/auth.service';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {
  

  constructor(
    public globals: ThemeOptions,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  onLogout(){
    // console.log('test test');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
