import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HotelCrsService } from '../../../../hotel-crs/hotel-crs.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
const log = new Logger('Wellness tax component');

@Component({
  selector: 'app-wellness-child-policy',
  templateUrl: './wellness-child-policy.component.html',
  styleUrls: ['./wellness-child-policy.component.scss']
})
export class WellnessChildPolicyComponent implements OnInit {

  @Input() wellnessOne: any;
  hotelTypeForm!: FormGroup;
  public submitted: boolean = false;
  public currencyList: any;
  public wellnessTaxList: any;
  public editTax: any;
  public loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;

   @ViewChild('tabs', { static: true }) public tabs: NgbNav;
  activeIdString = 'list_wellness_child_policy';
  id: any;

  constructor(
    private fb: FormBuilder,
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private route: ActivatedRoute, 
  ) { }

  
onTabSelected(event: any) {
  this.activeIdString = event.nextId;
  // this.router.navigate([], {
  //     queryParams: {
  //       tab: event.nextId
  //     },
  //     queryParamsHandling: 'merge',
  //     replaceUrl: true
  //   });
}

triggerTab(data: any) {
//   console.log("data",data)
//   this.activeIdString = 'add_wellness_package';
//  this.router.navigate([], {
//       queryParams: {
//         tab: 'add_wellness_package'
//       },
//       queryParamsHandling: 'merge',
//       replaceUrl: true
//     });
//     this.tabs.select(data.tabId)
    
}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      if (params['tab']) {
        this.activeIdString = params['tab'];
      }
    });
    this.createForm();
    this.getWellnessChildPolicyList();
  }

  get f() { return this.hotelTypeForm.controls; }

  hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
    }
createForm(): void {
        this.hotelTypeForm = this.fb.group({
            description: new FormControl(''),
            status: new FormControl(true),
        });
    }
    resetForm() {
        this.wellnessOne = {};
        this.hotelTypeForm.reset({
            description: '',
            status: true,
        });

    }

    createChildPolicy() {
      let formData 
      if(this.id) {
        formData = {
        ...this.hotelTypeForm.value,
        center_code: this.wellnessOne.center_code
      }
      } else {
        formData = {
        ...this.hotelTypeForm.value,
        center_code: this.wellnessOne.center_code
      }
      }
      
      let data = Object.assign({}, formData);
      data = [data];
      data['topic'] = "saveChildPolicy";
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
            // console.log('Wellness Center created successfully:', resp);
            this.swalService.alert.success('Children Policy created successfully.');
            this.activeIdString = 'list_wellness_child_policy';
            this.getWellnessChildPolicyList();
            
          }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });

    }

     getWellnessChildPolicyList() {
      this.id = '';
    const data = [{center_code: this.wellnessOne.center_code }];
        data["topic"] = "childrenPolicyList";
      this.wellnessCrsService.fetch(data).subscribe((res) => {
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
          this.wellnessTaxList = res.data || [];
        }
      }, (err) => {
        console.error(err);
      });
  }

  updatePackageTax(wellness) {
    this.editTax = wellness;
    this.activeIdString = 'add_wellness_child_policy';
    this.id = wellness.id;
    this.hotelTypeForm.patchValue(wellness)
  }

  deletePackageTax(id) {
      this.swalService.alert.delete((action) => {
            if (action) {
              const data = [{ id: id }];
              data["topic"] = "deleteChildPolicy";
              this.wellnessCrsService.fetch(data).subscribe(
                (response) => {
                  if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success(
                      `Child Policy has been deleted successfully`,
                    );
                    this.getWellnessChildPolicyList();
                  }
                },
                (err: HttpErrorResponse) => {
                  this.swalService.alert.error(err["error"]["Message"]);
                },
              );
            }
          });
  }

}
