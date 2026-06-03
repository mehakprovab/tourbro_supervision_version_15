import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
 cityForm: FormGroup;
 selectedImageFile: File | null = null;
imagePreviewUrl: string | ArrayBuffer | null = null;
  stateDataList: Array<any> = [];
  subSunk = new SubSink();

  @Output() insertedRecord = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit() {
    this.createCityForm();
    this.getStateList();
  }

  // ✅ Create Form
createCityForm() {
  this.cityForm = this.fb.group({
    stateId: ['', Validators.required],
    cityName: ['', [Validators.required, this.inputValidator]],
    status: [1, Validators.required],
    CityImage: ['', Validators.required],           // ✅ New field
    discription: ['', [Validators.required, Validators.minLength(5)]],  // ✅ New field
    hourly_rental: [false, Validators.required],    // ✅ New field
    hourly_durations: ['', Validators.required]     // ✅ New field
  });
}

onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    
    // Preview image
    const reader = new FileReader();
reader.onload = (e) => {
  this.imagePreviewUrl = (e.target as FileReader).result as string;
};
    reader.readAsDataURL(file);
    
    this.cityForm.get('CityImage').setValue(file.name);
  }
}
onStatusChange(event: any) {
  const isChecked = event.target.checked;
  this.cityForm.get('status').setValue(isChecked ? 1 : 0);
}
  // ✅ Get State List (Update API if needed)
  getStateList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterState', 'post', {}, {}, {})
      .subscribe((response: any) => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.stateDataList = response.data.data;
          this.sortState();
        }
      });
  }

  // ✅ Sort State
  sortState() {
    this.stateDataList.sort((a, b) => a.name.localeCompare(b.name));
  }

  // ✅ Save City
 onCitySave() {
  if (this.cityForm.valid) {
    const formData = new FormData();  // ✅ Use FormData for file upload
    
    const cityNames = this.cityForm.get('cityName').value.split(',');
    const stateId = this.cityForm.get('stateId').value;
    const status = this.cityForm.get('status').value;
    const discription = this.cityForm.get('discription').value;
    const hourly_rental = this.cityForm.get('hourly_rental').value;
    const hourly_durations = this.cityForm.get('hourly_durations').value;

    cityNames.forEach(city => {
      formData.append('city_name', city.trim());
      formData.append('state_id', stateId);
      formData.append('status', status);
      formData.append('discription', discription);
      formData.append('hourly_rental', hourly_rental);
      formData.append('hourly_durations', hourly_durations);
      formData.append('type', 'City');
      
      if (this.selectedImageFile) {
        formData.append('CityImage', this.selectedImageFile, this.selectedImageFile.name);
      }

      this.subSunk.sink = this.apiHandlerService.apiHandler(
        'addMasterCity',
        'post',
        {},
        {},
        formData  // ✅ Send FormData instead of payload object
      ).subscribe(
        (response: any) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            this.swalService.alert.success(`City "${city.trim()}" saved successfully`);
            this.insertedRecord.emit(response.data);
            this.cityForm.reset();
            this.selectedImageFile = null;
            this.imagePreviewUrl = null;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Error occurred');
        }
      );
    });
  }
}

  // ✅ Custom Validator
  inputValidator(control: FormControl) {
    const value = control.value;

    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      return { startOrEndSpace: true };
    }

    if (value && /\d+/.test(value)) {
      return { invalidString: true };
    }

    return null;
  }

  validateInput() {
    this.cityForm.get('cityName').markAsTouched();
  }
}