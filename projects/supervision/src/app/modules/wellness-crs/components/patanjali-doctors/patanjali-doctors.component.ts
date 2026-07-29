import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-patanjali-doctors',
  templateUrl: './patanjali-doctors.component.html',
  styleUrls: ['./patanjali-doctors.component.scss']
})
export class PatanjaliDoctorsComponent implements OnInit {
  doctorForm: FormGroup;
  doctors: any[] = [];
  editingDoctor: any = null;
  loading = false;
  selectedImage: File = null;
imagePreview: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDoctors();
  }

  createForm(): void {
    this.doctorForm = this.formBuilder.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      opd_days: ['', Validators.required],
      opd_start_time: ['', Validators.required],
      opd_end_time: ['', Validators.required]
    });
  }

  getDoctors(): void {
    this.loading = true;
    this.apiHandlerService.apiHandler('patanjaliWellnessDoctorsList', 'post',{},{},{}).subscribe(
      (response) => {
        this.loading = false;
        this.doctors = this.normalizeDoctors(response);
      },
      () => {
        this.loading = false;
        this.doctors = [];
      }
    );
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      this.swalService.alert.oops('Please fill all required doctor details.');
      return;
    }

    const payload = {
      name: this.doctorForm.value.name,
      specialization: this.doctorForm.value.specialization,
      opd_days: this.doctorForm.value.opd_days,
      opd_start_time: this.formatTime(this.doctorForm.value.opd_start_time),
      opd_end_time: this.formatTime(this.doctorForm.value.opd_end_time)
    };

    const isEdit = !!this.editingDoctor;
    const id = this.getDoctorId(this.editingDoctor);
    if (isEdit && !id) {
      this.swalService.alert.oops('Doctor id not found.');
      return;
    }
    if (isEdit) {
      payload['id'] = id;
    }
    const topic = isEdit ? 'patanjaliWellnessDoctorUpdate' : 'patanjaliWellnessDoctors';

    this.loading = true;
    this.apiHandlerService.apiHandler(topic, 'post', {}, {}, payload).subscribe(
(response) => {

  this.loading = false;

  if (
    response &&
    (response.statusCode === 200 ||
      response.statusCode === 201 ||
      response.success)
  ) {

    // get doctor id

    const doctorId =
      response.data?.id ||
      response.data?._id ||
      response.data.insertId ||
      response.insertId ||
      response.doctor_id;
console.log('Doctor saved successfully with id:', doctorId);  
console.log('Selected image:', this.selectedImage);
    if (this.selectedImage && doctorId) {

      this.uploadDoctorImage(doctorId);

    } else {

      this.swalService.alert.success(
        isEdit
          ? 'Doctor updated successfully.'
          : 'Doctor uploaded successfully.'
      );

      this.resetForm();

      this.getDoctors();
    }

    return;
  }

  this.swalService.alert.oops(
    response?.Message ||
      response?.message ||
      'Doctor data save failed.'
  );

},
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err, 'Doctor data save failed.'));
      }
    );
  }

editDoctor(doctor: any): void {

  this.editingDoctor = doctor;

  this.imagePreview = doctor.doctor_image || null;

  this.selectedImage = null;

  this.doctorForm.patchValue({
    name: doctor.name,
    specialization: doctor.specialization,
    opd_days: doctor.opd_days,
    opd_start_time: this.toTimeInput(doctor.opd_start_time),
    opd_end_time: this.toTimeInput(doctor.opd_end_time)
  });

}

  deleteDoctor(doctor: any): void {
    const id = this.getDoctorId(doctor);
    if (!id) {
      this.swalService.alert.oops('Doctor id not found.');
      return;
    }

    this.swalService.alert.delete((action) => {
      if (!action) {
        return;
      }

      this.loading = true;
      this.apiHandlerService.apiHandler('patanjaliWellnessDoctorDelete', 'post', {}, {}, { id }).subscribe(
        (response) => {
          this.loading = false;
          if (response && (response.statusCode === 200 || response.statusCode === 201 || response.success)) {
            this.swalService.alert.success('Doctor data deleted successfully.');
            this.getDoctors();
            return;
          }
          this.swalService.alert.oops(response && (response.Message || response.message) || 'Doctor data delete failed.');
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.swalService.alert.error(this.getErrorMessage(err, 'Doctor data delete failed.'));
        }
      );
    });
  }

  resetForm(): void {
    this.editingDoctor = null;

  this.selectedImage = null;

  this.imagePreview = null;
    this.doctorForm.reset({
      name: '',
      specialization: '',
      opd_days: '',
      opd_start_time: '',
      opd_end_time: ''
    });
  }

  getDoctorId(doctor: any): any {
    return doctor && (doctor.id || doctor._id || doctor.doctor_id);
  }

  private formatTime(value: string): string {
    if (!value) {
      return value;
    }
    return value.length === 5 ? `${value}:00` : value;
  }

  private toTimeInput(value: string): string {
    return value ? value.substring(0, 5) : '';
  }

  private normalizeDoctors(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    if (response && response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response && Array.isArray(response.doctors)) {
      return response.doctors;
    }
    return [];
  }

  private getErrorMessage(err: HttpErrorResponse, fallback: string): string {
    return err && err.error && (err.error.Message || err.error.message) ? (err.error.Message || err.error.message) : fallback;
  }

  onImageSelected(event: any): void {

  if (!event.target.files.length) {
    return;
  }

  const file = event.target.files[0];

  if (!file.type.startsWith('image/')) {
    this.swalService.alert.oops('Please select a valid image.');
    return;
  }

  this.selectedImage = file;

  const reader = new FileReader();

  reader.onload = () => {
    this.imagePreview = reader.result;
  };

  reader.readAsDataURL(file);
}
uploadDoctorImage(id: number): void {
console.log('Uploading doctor image for doctor id:', id);
  if (!this.selectedImage) {
    this.getDoctors();
    return;
  }

  const formData = new FormData();

  formData.append('id', id.toString());
  formData.append('DoctorImage', this.selectedImage);

  this.apiHandlerService
    .apiHandler(
      'uploadDoctorImage',
      'post',
      {},
      {},
      formData
    )
    .subscribe(
      () => {

        this.swalService.alert.success('Doctor data uploaded successfully.');

        this.resetForm();

        this.getDoctors();

      },
      () => {

        this.swalService.alert.oops(
          'Doctor saved successfully, but image upload failed.'
        );

        this.resetForm();

        this.getDoctors();

      }
    );
}
}
