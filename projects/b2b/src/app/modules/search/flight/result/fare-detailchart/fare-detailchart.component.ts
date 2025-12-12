import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SubSink } from 'subsink';
import { FlightService } from '../../flight.service';

@Component({
  selector: 'app-fare-detailchart',
  templateUrl: './fare-detailchart.component.html',
  styleUrls: ['./fare-detailchart.component.scss']
})
export class FareDetailchartComponent implements OnInit,OnChanges {
  protected subs = new SubSink();
  @Input() oneWayCalendarList: any[] = [];
  @Input() roundTripCalendarList: any[] = [];
  
  departureDates: string[] = [];
  returnDates: string[] = [];
  flightMap: Map<string, any[]> = new Map();

  constructor(
    private flightService: FlightService,
    private cd: ChangeDetectorRef
  ) { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roundTripCalendarList']) {
      this.processFlightData();
    }
  }
  clearData(): void {
    this.departureDates = [];
    this.returnDates = [];
    this.flightMap.clear();
  }
  processFlightData(): void {
    this.clearData();
    if (!this.roundTripCalendarList || this.roundTripCalendarList.length === 0) {
      return;
    }

    const flightMap = new Map<string, any[]>();

    this.roundTripCalendarList.forEach(flights => {
      flights.forEach(flight => {
        const depDate = flight.OnwardFlightDate.split('T')[0];
        const retDate = flight.ReturnFlightDate.split('T')[0];

        if (!this.departureDates.includes(depDate)) {
          this.departureDates.push(depDate);
        }
        if (!this.returnDates.includes(retDate)) {
          this.returnDates.push(retDate);
        }

        const key = `${depDate}-${retDate}`;
        if (!flightMap.has(key)) {
          flightMap.set(key, []);
        }
        flightMap.get(key)!.push(flight);
      });
    });

    this.departureDates.sort();
    this.returnDates.sort();
    this.flightMap = flightMap;

    this.cd.detectChanges(); // Ensure the view updates
  }

  getFlight(departureDate: string, returnDate: string): any {
    const key = `${departureDate}-${returnDate}`;
    const flights = this.flightMap.get(key);
  
    if (flights && flights.length > 0) {
      return flights[0]; 
    }
  
    return null; 
  }
  
  handleFlightClick(flight: any): void {
    const searchData = flight.SearchData;
    this.flightService.flights.next([]);
    this.flightService.loading.next(true)
    this.flightService.calenderData.next([]);
    this.flightService.calenderData.next(searchData)
    this.flightService.searchResultApi(searchData);
  }
  handleOneFlightClick(flight: any) {
    const searchData = flight.SearchData;
    //this.flightService.flights.next([]);
    this.flightService.loading.next(true)
    this.flightService.calenderData.next([]);
    this.flightService.calenderData.next(searchData)
    this.flightService.searchResultApi(searchData);
   
}

}

