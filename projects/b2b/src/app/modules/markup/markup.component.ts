import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-markup',
    templateUrl: './markup.component.html',
    styleUrls: ['./markup.component.scss']
})

export class MarkupComponent implements OnInit {
    navLinks = [
        {
            label: 'Flight',
            icon: 'fa fa-plane',
            component: 'flight'
        },
    ]

    constructor() { }

    ngOnInit() {
    }
    onSelect() {

    }
}
