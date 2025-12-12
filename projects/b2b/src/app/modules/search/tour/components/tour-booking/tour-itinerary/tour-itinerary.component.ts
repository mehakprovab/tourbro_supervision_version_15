import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../tour.service';


export interface NgbPanelChangeEvent {
  nextState: boolean;
  panelId: string;
  preventDefault: () => void;
}


@Component({
  selector: 'app-tour-itinerary',
  templateUrl: './tour-itinerary.component.html',

  styleUrls: ['./tour-itinerary.component.scss'],
})
export class TourItineraryComponent implements OnInit {

  lastPanelId: string = null;
  defaultPanelId: string = "panel1";

  panelShadow($event: NgbPanelChangeEvent, shadow) {
    console.log($event);

    const { nextState } = $event;

    const activePanelId = $event.panelId;
    const activePanelElem = document.getElementById(activePanelId);

    if (!shadow.isExpanded(activePanelId)) {
      activePanelElem.parentElement.classList.add("open");
    }

    if(!this.lastPanelId) this.lastPanelId = this.defaultPanelId;

    if (this.lastPanelId) {
      const lastPanelElem = document.getElementById(this.lastPanelId);

      if (this.lastPanelId === activePanelId && nextState === false)
        activePanelElem.parentElement.classList.remove("open");
      else if (this.lastPanelId !== activePanelId && nextState === true) {
        lastPanelElem.parentElement.classList.remove("open");
      }

    }

    this.lastPanelId = $event.panelId;
  }

  activeItem: string;
  activeVisitDayItem: string;

  isCollapsed = false;
  activePanels: string[] = [];  // Track which panels are open
  tourDayDetails: { [key: number]: { program_title: string, program_des: string } } = {}; // Store content for each day
  itineraryVisitDay: number[] = [];
  tourDayTabToShow: { name: string, value: boolean }[] = [];
  tourDetails: any = {}; 
  selectedTourDay: string = '';
  selectedTourDayTitle: string = '';
  selectedTourDayDes: string = '';
  dayNumber: number = 0;

  constructor( private tourService:TourService,

  ) { }

  ngOnInit(): void {
    //this.setActiveItem('Overview');
    this.getTourDetailsData();
    // if(this.itineraryVisitDay){
    //   this.setActiveVisitDayItem('Day1')
    // }
  }

  setActiveItem(selectedTab: string): void {
    // this.activeItem = selectedTab;
    // //document.querySelector(selectedTab).scrollIntoView({behavior:"smooth"});
    // //setting avtive tab to false 
    // this.tabToShow.forEach(tab => {
    //   if(tab.value==true){
    //     tab.value = false;
    //   }
    // });
    // // setting currenlty clicked property to active show respective page will be shown in UI
    // const tab=this.tabToShow.find(item => item.name === selectedTab);
    // if (tab) {
    //   tab.value = true;
    // }
  }

  getTourDetailsData() {
    const result = JSON.parse(sessionStorage.getItem('tourBookingInfo') || '{}');
    if (result && Object.keys(result).length > 0) {
      this.tourDetails = result;
      this.itineraryTab(result.duration);
    }
  }
  
  itineraryTab(duration: string) {
    const numberDayString = duration.split("Days")[0].trim();
    const noOfDays = parseInt(numberDayString, 10);
    this.itineraryVisitDay = []; // Reset array to avoid duplicate entries
    this.tourDayTabToShow = [];
    
    for (let i = 1; i <= noOfDays; i++) {
      this.itineraryVisitDay.push(i);
      this.tourDayTabToShow.push({
        name: `Day ${i}`,
        value: false
      });
    }
  }
  
  togglePanel(panelId: string, day: number) {
    const index = this.activePanels.indexOf(panelId);
    
    if (index === -1) {
      // Load the content first before adding the panel to the active list
      this.loadDayDetails(day);
      
      // Wait for the content to be available before opening the panel
      setTimeout(() => {
        this.activePanels.push(panelId);
      }, 50); // Adding a slight delay ensures Angular updates the view
    } else {
      // Close the panel
      this.activePanels.splice(index, 1);
    }
  }
  
  
  loadDayDetails(day: number) {
    const dayData = this.tourDetails.itinerary.find((item: any) => +item.visited_city_day === day);
    if (dayData) {
      this.tourDayDetails[day] = {
        program_title: dayData.program_title,
        program_des: dayData.program_des
      };
    }
  }
  
  
  setActiveVisitDayItem(selectedTab: string): void {
    this.activeVisitDayItem = selectedTab;
    this.tourDayTabToShow.forEach(tab => tab.value = false);
    const tab = this.tourDayTabToShow.find(item => item.name === selectedTab);
    if (tab) {
      tab.value = true;
    }
    this.tourDayDesInfo(selectedTab);
  }
  
  tourDayDesInfo(selectedDay: string) {
    this.selectedTourDay = selectedDay;
    const dayMatch = selectedDay.match(/\d+/);
    this.dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : 0;
    
    const dayData = this.tourDetails.itinerary.find((item: any) => item.visited_city_day === this.dayNumber);
    if (dayData) {
      this.selectedTourDayDes = dayData.program_des;
      this.selectedTourDayTitle = dayData.program_title;
    }
  }

  // scrolloverview(el:any) {
  //   el.scrollIntoView({behavior:"smooth"});
  // }

  scrolloverview(elem: string) {
    console.log(elem);
    document.querySelector(elem).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  
  showFullTerms = false;
showFullCancel = false;
maxLength = 300; // characters to show initially

toggleTerms() {
  this.showFullTerms = !this.showFullTerms;
}

toggleCancel() {
  this.showFullCancel = !this.showFullCancel;
}

getShortText(text: string, showFull: boolean): string {
  if (!text) return '';
  return showFull || text.length <= this.maxLength
    ? text
    : text.substring(0, this.maxLength) + '...';
}

isTextTruncated(text: string): boolean {
  return text && text.length > this.maxLength;
}


}

