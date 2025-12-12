import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { Logger } from '../../../../core/logger/logger.service';

const logger = new Logger('LoggedInUsersComponent');

@Component({
  selector: 'app-logged-in-users',
  templateUrl: './logged-in-users.component.html',
  styleUrls: ['./logged-in-users.component.scss']
})
export class LoggedInUsersComponent implements OnInit {

  loggedInUsers: object[] = [];
  displayedColumns: string[] = ['#', 'Image', 'Name', 'Contact', 'User Type', 'IP', 'Login Since'];

  constructor(
    private apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.apiHandlerService.apiHandler( 'loggedInUserList', 'post', '', '',
      { offset: 0, limit: 10 }
    ).subscribe(resp => {
      logger.debug(resp);
      if (resp.Status) {
        this.loggedInUsers = resp.Data['logged_in_user_list'];
      }
    })
  }

}
