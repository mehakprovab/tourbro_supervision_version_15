import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';

@Component({
    selector: 'app-flight-details-fare',
    templateUrl: './flight-details-fare.component.html',
    styleUrls: ['./flight-details-fare.component.scss']
})
export class FlightDetailsFareComponent implements OnInit, OnDestroy {

    @Input() flight: any;
    isCollapsed: boolean = true;
    fareRuleData = '';
    noData: boolean = false;
    childProp: any = '';

    protected subs = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
    }

    isAdult(flight: any) {
        return flight.Price.PassengerBreakup.hasOwnProperty('ADT');
    }

    isYouth(flight: any) {
        console.log(flight.Price.PassengerBreakup)
        return flight.Price.PassengerBreakup.hasOwnProperty('YTH');
    }

    isChild(flight: any) {
        if (flight.Price.PassengerBreakup.hasOwnProperty('CHD'))
            this.childProp = 'CHD';
        else if (flight.Price.PassengerBreakup.hasOwnProperty('CNN'))
            this.childProp = 'CNN';
        else if (flight.Price.PassengerBreakup.hasOwnProperty('C09'))
            this.childProp = 'CNN';
        return flight.Price.PassengerBreakup.hasOwnProperty('CHD') || flight.Price.PassengerBreakup.hasOwnProperty('CNN') || flight.Price.PassengerBreakup.hasOwnProperty('C09');
    }

    isInfant(flight: any) {
        return flight.Price.PassengerBreakup.hasOwnProperty('INF');
    }

    getFareRule(flight) {
        let fareRuleData = {
            ResultToken: flight.searchResultToken ? flight.searchResultToken : flight.ResultToken,
            booking_source: flight.booking_source
        }
        this.subs.sink = this.apiHandlerService.apiHandler('fareRule', 'POST', '', '', fareRuleData).subscribe(res => {
            if (res.Status) {
                if (res.data.length) {
                    this.noData = false;
                    this.fareRuleData = res.data;
                } else {
                    this.noData = true;
                }
            }
        }, err => {
            this.noData = true;
            this.swalService.alert.oops(err.error.Message);
        });
        this.isCollapsed = !this.isCollapsed;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    getAdultBaseFare(flight) {
        const price = flight.Price.PassengerBreakup.ADT.BasePrice *
           flight.Price.PassengerBreakup.ADT.PassengerCount;
        return price;
    }

    getAdultFare(flight) {
       const price = flight.Price.PassengerBreakup.ADT.Tax *
        flight.Price.PassengerBreakup.ADT.PassengerCount;
    return price;
    }

    getAdultTotalFare(flight) {
        const price = flight.Price.PassengerBreakup.ADT.TotalPrice *
            flight.Price.PassengerBreakup.ADT.PassengerCount;
        return price;
    }

    getYouthBaseFare(flight) {
        const price = flight.Price.PassengerBreakup.YTH.BasePrice *
        flight.Price.PassengerBreakup.YTH.PassengerCount;
        return price;
    }

    getYouthFare(flight) {
        const price = flight.Price.PassengerBreakup.YTH.Tax  *
        flight.Price.PassengerBreakup.YTH.PassengerCount;
        return price;
    }

    getYouthTotalFare(flight) {
        const price = flight.Price.PassengerBreakup.YTH.TotalPrice  *
        flight.Price.PassengerBreakup.YTH.PassengerCount;
        return price;
    }

    getChildBaseFare(flight) {
        const price = flight.Price.PassengerBreakup.CHD.BasePrice *
        flight.Price.PassengerBreakup.CHD.PassengerCount;
        return price;
    }

    getChildFare(flight) {
        const price = flight.Price.PassengerBreakup.CHD.Tax  *
        flight.Price.PassengerBreakup.CHD.PassengerCount;
        return price;
    }

    getChildTotalFare(flight) {
        const price = flight.Price.PassengerBreakup.CHD.TotalPrice  *
        flight.Price.PassengerBreakup.CHD.PassengerCount;
        return price;
    }

    getChildCNNBaseFare(flight) {
        const price = flight.Price.PassengerBreakup.CNN.BasePrice *
        flight.Price.PassengerBreakup.CNN.PassengerCount;
        return price;
    }

    getChildCNNFare(flight) {
        const price = flight.Price.PassengerBreakup.CNN.Tax  *
        flight.Price.PassengerBreakup.CNN.PassengerCount;
        return price;
    }

    getChildCNNTotalFare(flight) {
        const price = flight.Price.PassengerBreakup.CNN.TotalPrice *
        flight.Price.PassengerBreakup.CNN.PassengerCount;
        return price;
    }

    getChildC09BaseFare(flight) {
        const price = flight.Price.PassengerBreakup.C09.BasePrice *
        flight.Price.PassengerBreakup.C09.PassengerCount;
        return price;
    }

    getChildC09Fare(flight) {
        const price = flight.Price.PassengerBreakup.C09.Tax  *
        flight.Price.PassengerBreakup.C09.PassengerCount;
        return price;
    }

    getChildC09TotalFare(flight) {
        const price = flight.Price.PassengerBreakup.C09.TotalPrice  *
        flight.Price.PassengerBreakup.C09.PassengerCount;
        return price;
    }

    getInfantBaseFare(flight) {
        const price = flight.Price.PassengerBreakup.INF.BasePrice *
        flight.Price.PassengerBreakup.INF.PassengerCount;
        return price;
    }

    getInfantFare(flight) {
        const price = flight.Price.PassengerBreakup.INF.Tax  *
        flight.Price.PassengerBreakup.INF.PassengerCount;
        return price;
    }

    getInfantTotalFare(flight) {
        const price = flight.Price.PassengerBreakup.INF.TotalPrice  *
        flight.Price.PassengerBreakup.INF.PassengerCount;
        return price;
    }

}


function tempFareRules() {
    return {
        Status: 1,
        Message: '',
        Data: {
            FareRule: {
                FareRuleDetail: [
                    {
                        Origin: 'BLR',
                        Destination: 'MAA',
                        Airline: 'AI',
                        FareRules: 'TP APPLICATION AND OTHER CONDITIONS\nRULE - 302/AI04\nUNLESS OTHERWISE SPECIFIED\nECONOMY FARES ON DOMESTIC SECTORS\n APPLICATION\n   AREA\n     THESE FARES APPLY\n     WITHIN INDIA.\n   CLASS OF SERVICE\n     THESE FARES APPLY FOR ECONOMY CLASS SERVICE.\n   TYPES OF TRANSPORTATION\n     THIS RULE GOVERNS ONE-WAY FARES.\n     FARES GOVERNED BY THIS RULE CAN BE USED TO CREATE\n     ONE-WAY/ROUND-TRIP/CIRCLE-TRIP JOURNEYS.\n   ON SPECIFIED DOMESTIC SECTORS.<br/>SEASONALITY\nNONE FOR -AP8 TYPE FARES WITH FOOTNOTE 4B<br/>FLIGHT APPLICATION\nFOR FARES WITH FOOTNOTE 4B\n  THE FARE COMPONENT MUST BE ON\n      ONE OR MORE OF THE FOLLOWING\n        ANY AI FLIGHT OPERATED BY AI.<br/>ADVANCE RES/TICKETING\nFOR -AP8 TYPE FARES\n  RESERVATIONS ARE REQUIRED FOR ALL SECTORS.\n  TICKETING MUST BE COMPLETED AT LEAST 8 DAYS BEFORE\n  DEPARTURE.\n         NOTE -\n          TICKETING AND BOOKING TRANSACTIONS  TO BE\n          COMPLETED  SIMULTANEOUSLY AND ONLY CONFIRMED\n          TICKETS TO BE ISSUED<br/>MAXIMUM STAY\nNONE FOR ONE WAY FARES<br/>STOPOVERS\nUNLESS OTHERWISE SPECIFIED\n  NO STOPOVERS PERMITTED.<br/>TRANSFERS\nUNLESS OTHERWISE SPECIFIED\n  TRANSFERS NOT PERMITTED ON THE FARE COMPONENT\n    FARE BREAK AND EMBEDDED SURFACE SECTORS NOT PERMITTED ON\n     THE FARE COMPONENT.<br/>PERMITTED COMBINATIONS\nUNLESS OTHERWISE SPECIFIED\n   DOUBLE OPEN JAWS NOT PERMITTED.\n   APPLICABLE ADD-ON CONSTRUCTION IS ADDRESSED IN\n   MISCELLANEOUS PROVISIONS - CATEGORY 23.\n  END-ON-END\n    END-ON-END COMBINATIONS PERMITTED WITH AI DOMESTIC\n    FARES. VALIDATE ALL FARE COMPONENTS. SIDE TRIPS\n    PERMITTED.\n  OPEN JAWS/ROUND TRIPS/CIRCLE TRIPS\n    FARES MAY BE COMBINED ON A HALF ROUND TRIP BASIS WITH AI\n    FARES\n    -TO FORM SINGLE OPEN JAWS\n    -TO FORM ROUND TRIPS\n    -TO FORM CIRCLE TRIPS\n   PROVIDED -\n     COMBINATIONS ARE WITH ANY FARE FOR CARRIER AI IN ANY\n      RULE IN THIS TARIFF.<br/>BLACKOUT DATES\nFOR -AP8 TYPE FARES WITH FOOTNOTE 4B\n  TRAVEL IS NOT PERMITTED 24MAR 20 THROUGH 30JUN 20.<br/>SURCHARGES\nFOR S- TYPE FARES\n  THE PROVISIONS BELOW APPLY ONLY AS FOLLOWS -\n  TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN INDIA\n  AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n    A SURCHARGE OF USD 4.52 PER COUPON WILL BE ADDED TO THE\n    APPLICABLE FARE FOR TRAVEL.\n    PROVIDED TRAVEL IS ON ONE OR MORE OF THE FOLLOWING\n      ANY AI FLIGHT OPERATED BY AI.<br/>TRAVEL RESTRICTIONS\n UNLESS OTHERWISE SPECIFIED\n  VALID FOR TRAVEL COMMENCING ON/AFTER 27SEP 19.<br/>SALES RESTRICTIONS\nUNLESS OTHERWISE SPECIFIED\n  FARES MAY ONLY BE SOLD BY AI.\n  TICKETS MUST BE ISSUED ON AI.\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI.\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI.\n  SALE IS RESTRICTED TO SPECIFIC AGENTS.\n  TICKETS MUST BE ISSUED ON AI.\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  OR - SALE IS RESTRICTED TO SPECIFIC AGENTS.\n       TICKETS MUST BE ISSUED ON AI AND MAY NOT BE SOLD IN\n       INDIA AND MAY ONLY BE SOLD IN AREA 1/AREA 2/AREA 3\n  FARES MAY ONLY BE SOLD BY AI OR HR.\n  TICKETS MUST BE ISSUED ON AI OR HR AND MAY NOT BE SOLD IN\n  ALBANIA/AUSTRALIA/AUSTRIA/BAHRAIN/BANGLADESH/BELGIUM/\n  LUXEMBOURG/BOSNIA AND HERZEGOVINA/CAMBODIA/CANADA/BERMUDA/\n  CHINA/TAIWAN, PROVINCE OF/COSTA RICA/CYPRUS/CZECH\n  REPUBLIC/EGYPT/FINLAND/FRANCE/GERMANY/GREECE/HONG KONG,\n  SAR, CHINA/HUNGARY/INDIA/INDONESIA/IRELAND/ISRAEL/ITALY/\n  JAPAN/JORDAN\n  OR - FARES MAY ONLY BE SOLD BY AI OR HR.\n       TICKETS MUST BE ISSUED ON AI OR HR AND MAY NOT BE\n       SOLD IN KAZAKHSTAN/KYRGYZSTAN/KUWAIT/LEBANON/\n       LIECHTENSTEIN/MALAYSIA/MEXICO/MOLDOVA,REPUBLIC OF/\n       MONTENEGRO/NICARAGUA/NEPAL/NETHERLANDS/NEW ZEALAND/\n       PANAMA/PHILIPPINES/ROMANIA/RUSSIA/SAUDI ARABIA/\n       SERBIA/SINGAPORE/SLOVAKIA/SLOVENIA/SOUTH AFRICA/\n       KOREA, REPUBLIC OF/SPAIN AND CANARY ISLANDS/SRI\n       LANKA/SWITZERLAND/THAILAND/TURKEY/UNITED KINGDOM\n  OR - FARES MAY ONLY BE SOLD BY AI OR HR.\n       TICKETS MUST BE ISSUED ON AI OR HR AND MAY NOT BE\n       SOLD IN THE UNITED STATES/WEST AFRICA/SOUTHERN\n       AFRICA/EAST AFRICA/SCANDINAVIA/MIDDLE EAST AND MAY\n       ONLY BE SOLD IN AREA 1/AREA 2/AREA 3<br/>PENALTIES\nWITHIN INDIA FOR S- TYPE FARES\n  CHANGES/CANCELLATIONS\n    BEFORE DEPARTURE\n      PER COUPON CHARGE USD 45.16 FOR CANCEL/REISSUE/\n        REVALIDATION.\n         NOTE -\n          TEXT BELOW NOT VALIDATED FOR AUTOPRICING.\n          RE-ISSUANCE / RE-VALIDATION / CANCELLATION FEE -\n          USD 45.16 OR BASIC FARE WHICH EVER IS LOWER TILL\n          24 HR BEFORE DEP. NOT PERMITTED LESS\n          THAN 24 HOURS BEFORE DEPARTURE.\n          --------------------------------------------------\n          THE CHANGE/REISSUE CHARGE IS NON - REFUNDABLE\n          --------------------------------------------------\n          NO RE-VALIDATION OR CANCELLATION FEE WOULD BE APPL\n          ICABLE ON INFANT TICKETS.\n          --------------------------------------------------\n          CANCELLATION FEE OF PARTLY USED TICKET\n          DEDUCT ONEWAY FARE AND LEVIES FOR THE TRAVELLED\n          SECTOR PLUS CANCELLATION FEE.\n          --------------------------------------------------\n          IN CASE OF CHANGE TO HIGHER RBD FOR TRAVEL ON THE\n          SAME DAY/SAME FLIGHT/RE-ISSUANCE FEE WILL NOT BE\n          APPLICABLE.ONLY DIFFERENCE IN TOTAL FARE IS TO BE\n          COLLECTED.\n          --------------------------------------------------\n          FOR WAIVER OF PENALTY ON ACCOUNT OF DEATH OF\n          PASSENGER OR IMMEDIATE FAMILY MEMBER PLS REFER\n          LAST PAGE\n          --------------------------------------------------\n          RESERVATIONS BOOKED MORE THAN 7 DAYS PRIOR TO\n          COMMENCEMENT OF TRAVEL MAY BE CANCELLED OR\n          AMENDED WITHIN 24 HOURS OF BOOKING TICKET WITHOUT\n          PENALTY.RESERVATIONS BOOKED WITHIN 7 DAYS OF\n          COMMENCEMENT OF TRAVEL ARE SUBJECT TO THE\n          APPLICABLE CANCELLATION PENALTY.\n    CHANGES/CANCELLATIONS PERMITTED FOR NO-SHOW.\n         NOTE -\n          TEXT BELOW NOT VALIDATED FOR AUTOPRICING.\n          CHANGES / CANCELLATION FEE IF CANCELLED\n          LESS THAN 24 HOUR BEFORE DEPARTURE - 100 PERCENT\n          OF BASIC FARE WILL BE FORFEITED.\n          --------------------------------------------------\n          THE CHANGE/REISSUE CHARGE IS NON - REFUNDABLE\n          --------------------------------------------------\n          CHARGES ARE NON-COMMISISONABLE.  APPLICABLE GST\n          WILL BE ADDITIONAL.\n          --------------------------------------------------\n          AIR INDIA NO-SHOW WAIVER AT AIRPORT - FOR RBDS -\n          H/K/Q/V/W/G/L/U/T/S/E IN CASE THE PASSENGER HAS\n          REPORTED AT THE AIRPORT AFTER CLOSURE OF COUNTER\n          BUT BEFORE DEPARTURE OF FLIGHT WOULD BE PERMITTED\n          TO ROLL OVER ON NO-SHOW AT A CHARGE OF USD 52.69          --------------------------------------------------\n          THIS WILL BE AUTHORISED AT THE AIRPORT AT THE\n          TIME OF FLIGHT ONLY AND CANNOT BE LEVIED/ WAIVED\n          AT CBO.\n          --------------------------------------------------\n          THE WAIVER OF NO-SHOW IN SUCH CASES TO BE\n          AUTHORISED BY THE DUTY MANAGER.\n          --------------------------------------------------\n          FURTHER FARE DIFFERENCE IF ANY AS PER THE RBD /\n          FARE BASIS AVAILABLE / APPLICABLE ON THE NEXT\n          AVAILABLE FLIGHT WILL HAVE TO BE CHARGED FROM THE\n          PASSENGER IN ADDITION TO THE ROLL-OVER CHARGE.\n          --------------------------------------------------\n          FOR WAIVER OF PENALTY ON ACCOUNT OF DEATH OF\n          PASSENGER OR IMMEDIATE FAMILY MEMBER PLS REFER\n          LAST PAGE\n         NOTE -\n          IN CASE OF DEATH OF A PASSENGER OR IMMEDIATE\n          FAMILY MEMBER BEFORE COMMENCEMENT OF TRAVEL\n          PENALTY CHARGES STAND WAIVED OFF. THE ABOVE IS\n          APPLICABLE ONLY WHEN TICKET IS PURCHASED BEFORE\n          DEATH OF PASSENGER OR IMMEDIATE FAMILY MEMBER IS\n          OCCURRED.\n          -------------------------------------------------\n          IMMEDIATE FAMILY SHALL BE LIMITED TO SPOUSE\n          CHILDREN INCLUDING ADOPTED CHILDREN PARENTS\n          BROTHERS SISTERS GRAND-PARENTS GRANDCHILDREN FA\n          FATHER IN LAW MOTHER IN LAW SISTER IN LAW BROTHER\n          IN LAW SON IN LAW AND DAUGHTER IN LAW\n          -----------------------------------------------\n          IN CASE OF DEATH OF A PASSENGER OR IMMEDIATE\n          FAMILY MEMBER OCCURRED AFTER COMMENCEMENT OF\n          TRAVEL PENALTY CHARGES STAND WAIVED OFF.\n          -------------------------------------------------\n          IN CASE OF DEATH OF PASSENGER OCCURRED AFTER\n          COMMENCEMENT OF TRAVEL ACCOMPANYING PASSENGER MAY\n          TERMINATE TRAVEL OR INTERRUPT TRAVEL UNTIL\n          COMPLETION OF FORMALITIES AND RELIGIOUS CUSTOMS\n          IF ANY BUT IN NO EVENT LATER THAN FORTY FIVE 45\n          DAYS AFTER TRAVEL IS INTERRUPTED. THE TICKET OF\n          RETURNING PASSENGERS WILL BE ENDORSED RETURN\n          ACCOUNT DEATH NAME  AND SUCH ENDORSEMENT SHALL BE\n          AUTHENTICATED BY VALIDATION OR OTHER DUTY MANAGER\n          OFFICIAL STAMP. REFUND MAY BE ARRANGED. RE-\n          ROUTING MAY BE PERMITTED APPLICABLE PENALTY IF\n          ANY MAY BE WAIVED. DIFFERENCE OF FARE NEEDS TO BE\n          COLLECTED.\n          ----------------------------------------------\n          FOR RETURN-ONWARD TICKER REFUND DEDUCT ONE WAY\n          FARE AND LEVIES FOR THE TRAVELLED SECTOR AND\n          BALANCE AMOUNT MAY BE REFUNDED.\n          -----------------------------------------------\n          PENALTY ON ABOVE ACCOUNT IS WAIVED FOR FIRST\n          TRANSACTION ONLY. SUBSEQUENT TRANSACTION IF ANY\n          WILL ATTRACT APPLICABLE PENALTY.<br/>TICKET ENDORSEMENT\nFOR S- TYPE FARES\n  THE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED -\n  NON ENDORSABLE/ CHANGE/ - AND - CANCELLATION/NO-SHOW FEE-\n  AND - APPLY PER SECTOR - IN THE ENDORSEMENT BOX.<br/>CHILDREN DISCOUNTS\nFOR ONE WAY FARES\n  ACCOMPANIED CHILD 2-11 - CHARGE 100 PERCENT OF THE FARE\n  OR - 1ST INFANT UNDER 2 WITHOUT A SEAT - CHARGE USD 18.82       .\n         RESULTING FARE IS A ONE-WAY.\n             TICKETING CODE - BASE FARE CODE PLUS IN.<br/>MISCELLANEOUS PROVISIONS\nUNLESS OTHERWISE SPECIFIED\n  THIS FARE MUST NOT BE USED AS THE HIGH OR THE LOW FARE\n  WHEN CALCULATING A DIFFERENTIAL. THIS FARE MAY BE USED AS\n  THE THROUGH FARE WHEN PRICING A FARE COMPONENT WITH OR\n  WITHOUT A DIFFERENTIAL.<br/>GROUPS\nNONE UNLESS OTHERWISE SPECIFIED<br/>VOLUNTARY CHANGES\nDO A CATEGORY 31 SPECIFIC TEXT ENTRY TO VIEW CONTENTS\nALSO REFERENCE 16 PENALTIES - FOR ADDITIONAL CHANGE INFORMATION<br/>'
                    }
                ]
            }
        }
    }
}