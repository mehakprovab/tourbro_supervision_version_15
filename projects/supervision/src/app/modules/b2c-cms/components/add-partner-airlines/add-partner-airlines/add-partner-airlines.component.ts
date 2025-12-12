import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-add-partner-airlines',
  templateUrl: './add-partner-airlines.component.html',
  styleUrls: ['./add-partner-airlines.component.scss']
})
export class AddOrModifyPartnerAirlinesComponent implements OnInit, OnDestroy {

  @ViewChild('labelImport', { static: false })
  labelImport: ElementRef;
  onFileChange(files: FileList) {
      this.flightImage = "";
      this.labelImport.nativeElement.innerText = Array.from(files)
          .map(f => f.name)
          .join(', ');
      this.fileToUpload = files.item(0);
      const file = files[0];
      if (file && file.size) {
          let result=this.validateFileSize(file.size);
          if(!result){
              this.fileToUpload=null;
              this.flightImage = "";
              this.imageSrc=""
              this.labelImport.nativeElement.value = null;
              this.labelImport.nativeElement.innerText="Upload Image";
              this.regConfig.controls['image'].reset()
              return;
          }
      }
      if (file.name) {
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
          reader.readAsDataURL(file);
      }
  }
  private subSunk = new SubSink();
  fileToUpload: File = null;
  imageSrc;
  regConfig: FormGroup;

  pageSize = 100;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'action', value: 'Action' },
      { key: 'status', value: 'Status' },
      { key: 'image', value: 'Image' },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  cabinClassLists: Array<any> = [];
  segments: {} = {};
  locationsOrigin: Array<any> = [];
  locationsDestination: Array<any> = [];
  lastKeyupTstamp: number = 0;
  btnName: string = "Add";
  flightImage: string = "";

  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private swalService: SwalService) { }

  ngOnInit() {
    this.onPageLoad();
  }

  onPageLoad() {
    this.createForm();
    this.getAirLinesList();
  }

  validateFileSize(fileSize) {
    if (fileSize >1048576) {
        this.swalService.alert.oops("Maximum upload file size: 1 MB");
        const imageControlControl = this.regConfig.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();
        return false;
    }
    else {
        return true
    }
}

createForm() {
  this.regConfig = this.fb.group({
      image: new FormControl('', [Validators.required]),
      id: new FormControl(''),
  });
}



getAirLinesList() {
  this.noData = true;
  this.subSunk.sink = this.apiHandlerService.apiHandler('getPartnerAirlines', 'post', {}, {},{} )
    .subscribe(resp => {
      console.log(resp);
        if (resp && resp.data) {
          this.respData = resp.data;
          this.noData = false;
        }
        else {
          this.respData = [];
          this.noData = false;
        }
    }, (err) => {
      this.respData = [];
      this.noData = false;
      this.swalService.alert.oops(err.message);
    });
}

addOrUpdatePartnerAirlineImage() {
  if (!this.regConfig.valid) {
    return;
  }
  let req = new FormData();
  if(this.fileToUpload)
  req.append('image',this.fileToUpload);
  if(this.regConfig.value.image && !this.fileToUpload)
    req.append('image',this.regConfig.value.image);
    req.append('status',"1");
  this.subSunk.sink = this.apiHandlerService.apiHandler('addPartnerAirlines', 'post', {}, {}, req)
  .subscribe(resp => {
    console.log(resp);
      if (resp && resp.data) {
          this.swalService.alert.success("Added Successfully.");
          this.getAirLinesList();
          this.onReset();
      }
  }, (err) => {
      this.swalService.alert.oops(err.message);
  });
}

onReset() {
  this.btnName = 'Add';
  this.fileToUpload = null;
  this.imageSrc = "";
  this.flightImage = "";
  this.regConfig.reset();
  this.labelImport.nativeElement.innerText="Upload Image";
  const imageControlControl = this.regConfig.get('image');
  imageControlControl.setValidators([Validators.required]);
  imageControlControl.updateValueAndValidity();
}


deleteList(id) {
  this.swalService.alert.delete(willDelete => {
      if (willDelete) {
          this.deleteOldImage(id);
      } else {
          console.log("Not delete")
      }
  })
}

deleteOldImage(id) {
  this.subSunk.sink = this.apiHandlerService.apiHandler('deletePartnerAirlines', 'post', {}, {}, { "id": id })
      .subscribe(resp => {
          if (resp && resp.data) {
              this.swalService.alert.success("Deleted successfully.");
              this.getAirLinesList();
          }
      }, (err) => {
          this.swalService.alert.oops(err.message);
      });
}

updateStatus(id, status) {
  this.subSunk.sink = this.apiHandlerService.apiHandler('updateAirlineStatus', 'post', {}, {}, { "id": id, "status": status })
  .subscribe(resp => {
      if (resp && resp.data) {
          this.swalService.alert.success("Status updated successfully.");
          this.getAirLinesList();
      }
  }, (err) => {
      this.swalService.alert.oops(err.message);
  });
}

getImage(img) {
  return `${baseUrl + '/flight/flight-service/getAirlineImage/' + img}`;
}

ngOnDestroy() {
  this.subSunk.unsubscribe();
}
}
