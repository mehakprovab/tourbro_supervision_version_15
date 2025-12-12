import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit() {
    console.log(
      'activatedRoute', this.activatedRoute,
      'router', this.router,
    );
  }

}
