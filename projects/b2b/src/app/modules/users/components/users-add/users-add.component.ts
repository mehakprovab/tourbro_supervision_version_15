import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit {

  usersForm = this.fb.group({
    user_id: 1,
    title: 'INVALIDIP',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    country_code: 'INVALIDIP',
    phone: '',
    address: '',
    status: '',
    user_type: 'INVALIDIP',
    email: '',
    password: '',
    confirm_password: '',
    language_preference: ''
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  onSubmit(t){
  }

}
