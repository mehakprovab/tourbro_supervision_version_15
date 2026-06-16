import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-geo-route',
    templateUrl: './geo-route.component.html',
    styleUrls: ['./geo-route.component.scss']
})

export class GeoRouteComponent implements OnInit {
    public geoRoutes = [
  'Revenue by Destination',
  'Booking by Route',
  'Enquiries by State',
  'Vendor Coverage by Region'
];
    ngOnInit(): void {
        
    }
}