import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
let respDataCopy: Array<any> = [];
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss']
})
export class SeasonListComponent implements OnInit {
    @Input() hotelOne: object = {};
    seasonList: any;
    noDataMessage: string;
    @Output() toUpdate = new EventEmitter<any>();
    pageSize = 10;
    page = 1;
    collectionSize: number;
  constructor(private hotelCrsService: HotelCrsService,
    private swalService: SwalService,) { }


  ngOnInit() {
    // let hotel_id = this.hotelOne['id']
    this.getSeasonList();
    
  }
getSeasonList(){
    const data = [{ offset: 0, limit: 6}]
    data['topic'] = 'hotelSeasonList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.seasonList = resp.data;
                respDataCopy = [...this.seasonList];
                this.collectionSize = respDataCopy.length;
                console.log(" this.seasonList", this.seasonList)
            }
            else if (resp.statusCode == 404) {
                this.noDataMessage = "No records found"
            }
        })
}
  updateHotelAmenity(data) {
    console.log(data)
    this.toUpdate.emit({ tabId: 'add_hotel_amenity',seasonData:data});
}
deleteSeasonType(season){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{id:season['id']}]
            data['topic'] = 'deleteSeason';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Hotel Room has been deleted successfully`);
                        this.getSeasonList();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}

onStatusUpdate(val, index): void {
    const formattedDate1 = moment(val.from_date).format("YYYY/MM/DD");
    const formattedDate2 = moment(val.to_date).format("YYYY/MM/DD");
    console.log("val",val)
    let data = Object.assign({},);
    data['id']=val['id']
    data['form_date']=formattedDate1;
    data['to_date']=formattedDate2;
    data['status']= val['status'] ? false : true;
    data = [data];
    data['topic'] = 'updateSeason';
            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.getSeasonList();
                    this.swalService.alert.update();
                }
                else
                    this.swalService.alert.oops();
            })
  }
}
