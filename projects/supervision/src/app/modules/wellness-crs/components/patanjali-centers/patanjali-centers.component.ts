import { Subject, of } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from 'projects/supervision/src/environments/environment';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { locationNameValidator } from 'projects/supervision/src/app/shared/validators/location-name.validator';

@Component({
  selector: 'app-patanjali-centers',
  templateUrl: './patanjali-centers.component.html',
  styleUrls: ['./patanjali-centers.component.scss']
})
export class PatanjaliCentersComponent implements OnInit, OnDestroy {
  cityOptions: any[] = [];
  stateOptions: any[] = [];
  private destroy$ = new Subject<void>();
  private refreshCities$ = new Subject<void>();
  private countryId: any;
  centerForm: FormGroup;
  @ViewChild('centerimageInput') centerimageInput: ElementRef<HTMLInputElement>;
  selectedImage: File = null;
  existingImage = '';
  imageError = '';
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
    this.setupLocationAutocomplete();
    this.getCenters();
    this.getCentersCount();
  }

  createForm(): void {
    this.centerForm = this.formBuilder.group({
      image: ['', Validators.required],
      center_name: ['', [Validators.required, locationNameValidator()]],
      city_name: ['', Validators.required],
      state: ['', [Validators.required, locationNameValidator()]],
      status: [true]
    });
  }

  private setupLocationAutocomplete(): void {
    this.centerForm.get('state').valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.centerForm.get('city_name').setValue('');
      this.refreshCities$.next();
    });

    this.refreshCities$.pipe(
      switchMap(() => {
        this.cityOptions = [];
        const stateName = (this.centerForm.get('state').value || '').trim().toLowerCase();
        const state = this.stateOptions.find(option => option.name.toLowerCase() === stateName);
        if (!state || !this.countryId) {
          return of({ data: { data: [] } });
        }
        return this.apiHandlerService.apiHandler('getMasterCityList', 'post', {}, {}, {
          id: this.countryId,
          stateId: state.id
        }).pipe(catchError(() => of({ data: { data: [] } })));
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.cityOptions = Array.isArray(response.data) ? response.data
        : response.data && Array.isArray(response.data.data) ? response.data.data : [];
    });

    this.apiHandlerService.apiHandler('supervisionCountryLists', 'post', {}, {}).pipe(
      switchMap(response => {
        const india = (response.data || []).find(country => country.name.toLowerCase() === 'india');
        if (!india) {
          return of({ data: { data: [] } });
        }
        this.countryId = india.id;
        return this.apiHandlerService.apiHandler('getMasterState', 'post', {}, {}, { country_id: india.id });
      }),
      catchError(() => of({ data: { data: [] } })),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.stateOptions = response.data && Array.isArray(response.data.data) ? response.data.data : [];
      this.refreshCities$.next();
    });
  }

  get filteredStates(): any[] {
    const search = (this.centerForm.get('state').value || '').toLowerCase();
    return this.stateOptions.filter(state => state.name.toLowerCase().includes(search));
  }

  get filteredCities(): any[] {
    const stateName = (this.centerForm.get('state').value || '').trim().toLowerCase();
    const state = this.stateOptions.find(option => option.name.toLowerCase() === stateName);
    if (!state) {
      return [];
    }
    const search = (this.centerForm.get('city_name').value || '').trim().toLowerCase();
    return this.cityOptions.filter(city =>
      (city.cityName || city.name || '').toLowerCase().includes(search)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (this.centerForm.invalid || this.imageError) {
      this.centerForm.markAllAsTouched();
      return;
    }

    const payload = new FormData();
    payload.append('status', this.centerForm.value.status ? '1' : '0');
    ['center_name', 'city_name', 'state'].forEach(key => {
      payload.append(key, this.centerForm.value[key].trim());
    });
    if (this.selectedImage) {
      payload.append('image', this.selectedImage, this.selectedImage.name);
    } else if (this.existingImage) {
      payload.append('image', this.existingImage);
    }

    const isEdit = !!this.editingCenter;
    const id = this.getCenterId(this.editingCenter);
    if (isEdit && !id) {
      this.swalService.alert.oops('Patanjali center id not found.');
      return;
    }
    if (isEdit) {
      payload.append('id', String(id));
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
        this.swalService.alert.oops(this.getResponseMessage(response, 'Patanjali center save failed.'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err, 'Patanjali center save failed.'));
      }
    );
  }

  editCenter(center: any): void {
    this.resetForm();
    this.editingCenter = center;
    this.existingImage = this.getCenterimage(center)[0] || '';
    this.centerForm.patchValue({
      image: this.existingImage,
      center_name: center.center_name || center.name || '',
      state: center.state_name || center.state || '',
      city_name: center.city_name || center.city || '',
      status: this.isCenterActive(center)
    });
  }

  getCenterimage(center: any): string[] {
    let image = center.images || center.image || [];
    if (typeof image === 'string') {
      try {
        image = JSON.parse(image);
      } catch {
        image = [image];
      }
    }
    return (Array.isArray(image) ? image : [image])
      .filter(image => typeof image === 'string' && image.trim());
  }

  getImageUrl(image: string): string {
    const value = (image || '').trim();
    if (!value || /^(https?:|data:|blob:)/i.test(value)) {
      return value;
    }
    return `https://tourbro.com/node/dist/apps/supervision/uploads/wellness/patanjali-images/${value.replace(/^\/+/, '')}`;
  }

  isCenterActive(center: any): boolean {
    return center.status === true || center.status === 1 || center.status === '1';
  }

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.imageError = '';
    this.selectedImage = null;
    this.centerForm.get('image').markAsTouched();
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (files.length > 1) {
      this.imageError = 'Please select only one image.';
      input.value = '';
    } else if (files.some(file => !/\.(jpe?g|png|webp)$/i.test(file.name)
      || (file.type && !allowedTypes.includes(file.type)))) {
      this.imageError = 'Only JPEG, JPG, PNG, and WEBP image are allowed.';
      input.value = '';
    } else {
      this.selectedImage = files[0] || null;
    }
    this.centerForm.patchValue({
      image: this.selectedImage || this.existingImage
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
          this.swalService.alert.oops(this.getResponseMessage(response, 'Patanjali center delete failed.'));
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
    this.selectedImage = null;
    this.existingImage = '';
    this.imageError = '';
    if (this.centerimageInput) {
      this.centerimageInput.nativeElement.value = '';
    }
    this.centerForm.reset({ image: '', center_name: '', city_name: '', state: '', status: true });
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

  private getResponseMessage(response: any, fallback: string): string {
    if (!response) {
      return fallback;
    }
    return response.Message || response.message || response.error || response.data && (response.data.Message || response.data.message) || fallback;
  }

  private getErrorMessage(err: HttpErrorResponse, fallback: string): string {
    return err && err.error ? this.getResponseMessage(err.error, fallback) : fallback;
  }
}
