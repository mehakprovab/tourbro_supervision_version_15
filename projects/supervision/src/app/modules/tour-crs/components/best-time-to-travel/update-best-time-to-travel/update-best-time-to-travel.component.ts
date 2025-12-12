import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment';
import { SubSink } from 'subsink';
import { TourCrsService } from '../../../tour-crs.service';
import { CmsService } from '../../../../cms/cms.service';
let respDataCopy: Array<any> = [];
const baseUrl = environment.baseUrl
@Component({
  selector: 'app-update-best-time-to-travel',
  templateUrl: './update-best-time-to-travel.component.html',
  styleUrls: ['./update-best-time-to-travel.component.scss']
})
export class UpdateBestTimeToTravelComponent implements OnInit {
    @Output() staticContentTab = new EventEmitter<any>();
    galleryDataList:any[]=[];
    countryForm:FormGroup;
    subSunk=new SubSink();
    countryId:number;
    searchSpin:boolean=true;
    noData: boolean = true;
    collectionSize: number = 100;
    respData: Array<any> = [];
    pageSize = 100;
    page = 1;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'S No.' },
        { key: 'status', value: 'Image' },
        { key: 'city', value: 'City Name' },
        { key: 'packages', value: 'Packages' },
        { key: 'price', value: 'Price' },
        { key: 'action', value: 'Action' },
    ];
    constructor(private fb:FormBuilder, private swalService:SwalService,private route:ActivatedRoute,
                private apiHandlerService:ApiHandlerService, private router:Router,
                private tourservice:TourCrsService,
                private cmsService: CmsService,) { }
  
    ngOnInit() {
        this.getContentList()
    }
  
   
    getContentList() {
        let data = {
            "filter": {
            }
        }
        this.subSunk.sink = this.cmsService.getBestTimeToContent(data).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = false;
                this.respData=[];
            }
        }, (err) => {
            this.noData = false;
            this.respData=[];
          })
    }
      updateContent(data) {
        console.log("data",data)
        this.cmsService.StaticContent.next(data);
        this.staticContentTab.emit({ tabId: 'add_update_staticPage', data });
    }
    deleteContent(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.confirmDelete(id);
            } 
        })
    }
    confirmDelete(id) {
        this.subSunk.sink = this.cmsService.deleteBestTimeContent({ "id": id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Record deleted successfully.");
                    this.getContentList();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops(err.message);
            }
            );
    }
    getImage(img) {
        return `${baseUrl  + img}`;
    }

}
