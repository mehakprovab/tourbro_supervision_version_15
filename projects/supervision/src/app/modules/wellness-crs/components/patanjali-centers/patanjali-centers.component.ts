import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-patanjali-centers',
  templateUrl: './patanjali-centers.component.html',
  styleUrls: ['./patanjali-centers.component.scss']
})
export class PatanjaliCentersComponent implements OnInit {
  centerForm: FormGroup;
  centers: any[] = [];
  editingCenter: any = null;
  loading = false;
  countData = 0;
  pageSize = 10;
  page = 1;

  constructor(
    private formBuilder: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCenters();
    this.getCentersCount();
  }

  createForm(): void {
    this.centerForm = this.formBuilder.group({
      center_code: ['', Validators.required],
      center_name: ['', Validators.required],
      contact_email: [''],
      contact_phone: [''],
      country_name: [''],
      city_name: [''],
      address: [''],
      status: [true]
    });
  }

  getCenters(event?: any): void {
    if (event) {
      this.pageSize = event;
    }

    const request = {
      offset: (this.page - 1) * this.pageSize,
      limit: this.pageSize
    };

    this.loading = true;
    this.apiHandlerService.apiHandler('patanjaliCenterList', 'post', {}, {}, request).subscribe(
      (response) => {
        this.loading = false;
        this.centers = this.normalizeCenters(response);
      },
      () => {
        this.loading = false;
        this.centers = [];
      }
    );
  }

  getCentersCount(): void {
    this.apiHandlerService.apiHandler('patanjaliCentersCount', 'post', {}, {}, {}).subscribe(
      (response) => {
        this.countData = this.normalizeCount(response);
      },
      () => {
        this.countData = 0;
      }
    );
  }

  saveCenter(): void {
    if (this.centerForm.invalid) {
      this.centerForm.markAllAsTouched();
      this.swalService.alert.oops('Please fill all required center details.');
      return;
    }

    const payload = {
      center_code: this.centerForm.value.center_code,
      center_name: this.centerForm.value.center_name,
      contact_email: this.centerForm.value.contact_email,
      contact_phone: this.centerForm.value.contact_phone,
      country_name: this.centerForm.value.country_name,
      city_name: this.centerForm.value.city_name,
      address: this.centerForm.value.address,
      status: this.centerForm.value.status ? 1 : 0
    };

    const isEdit = !!this.editingCenter;
    const id = this.getCenterId(this.editingCenter);
    if (isEdit && !id) {
      this.swalService.alert.oops('Patanjali center id not found.');
      return;
    }
    if (isEdit) {
      payload['id'] = id;
    }

    const topic = isEdit ? 'editPatanjaliCenter' : 'addPatanjaliCenter';

    this.loading = true;
    this.apiHandlerService.apiHandler(topic, 'post', {}, {}, payload).subscribe(
      (response) => {
        this.loading = false;
        if (this.isSuccess(response)) {
          this.swalService.alert.success(isEdit ? 'Patanjali center updated successfully.' : 'Patanjali center added successfully.');
          this.resetForm();
          this.getCenters();
          this.getCentersCount();
          return;
        }
        this.swalService.alert.oops(response && (response.Message || response.message) || 'Patanjali center save failed.');
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err, 'Patanjali center save failed.'));
      }
    );
  }

  editCenter(center: any): void {
    this.editingCenter = center;
    this.centerForm.patchValue({
      center_code: center.center_code || '',
      center_name: center.center_name || center.name || '',
      contact_email: center.contact_email || center.email || '',
      contact_phone: center.contact_phone || center.phone || '',
      country_name: center.country_name || '',
      city_name: center.city_name || '',
      address: center.address || '',
      status: center.status === true || center.status === 1 || center.status === '1'
    });
  }

  deleteCenter(center: any): void {
    const centerCode = center && center.center_code;
    if (!centerCode) {
      this.swalService.alert.oops('Patanjali center code not found.');
      return;
    }

    this.swalService.alert.delete((action) => {
      if (!action) {
        return;
      }

      this.loading = true;
      this.apiHandlerService.apiHandler('deletePatanjaliCenter', 'post', {}, {}, { center_code: centerCode }).subscribe(
        (response) => {
          this.loading = false;
          if (this.isSuccess(response)) {
            this.swalService.alert.success('Patanjali center deleted successfully.');
            this.getCenters();
            this.getCentersCount();
            return;
          }
          this.swalService.alert.oops(response && (response.Message || response.message) || 'Patanjali center delete failed.');
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.swalService.alert.error(this.getErrorMessage(err, 'Patanjali center delete failed.'));
        }
      );
    });
  }

  resetForm(): void {
    this.editingCenter = null;
    this.centerForm.reset({
      center_code: '',
      center_name: '',
      contact_email: '',
      contact_phone: '',
      country_name: '',
      city_name: '',
      address: '',
      status: true
    });
  }

  openGallery(): void {
    this.router.navigate(['/wellnesscrs/patanjali-wellness/upload-gallery']);
  }

  openDoctors(): void {
    this.router.navigate(['/wellnesscrs/patanjali-wellness/doctors']);
  }

  getCenterId(center: any): any {
    return center && (center.id || center._id || center.center_id);
  }

  private normalizeCenters(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    if (response && response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response && Array.isArray(response.centers)) {
      return response.centers;
    }
    return [];
  }

  private normalizeCount(response: any): number {
    if (!response) {
      return 0;
    }
    if (typeof response.data === 'number') {
      return response.data;
    }
    if (response.data && typeof response.data.patanjali_centers_count === 'number') {
      return response.data.patanjali_centers_count;
    }
    if (response.data && typeof response.data.count === 'number') {
      return response.data.count;
    }
    if (typeof response.count === 'number') {
      return response.count;
    }
    return this.centers.length;
  }

  private isSuccess(response: any): boolean {
    return response && (response.Status === true || response.statusCode === 200 || response.statusCode === 201 || response.success);
  }

  private getErrorMessage(err: HttpErrorResponse, fallback: string): string {
    return err && err.error && (err.error.Message || err.error.message) ? (err.error.Message || err.error.message) : fallback;
  }
}
