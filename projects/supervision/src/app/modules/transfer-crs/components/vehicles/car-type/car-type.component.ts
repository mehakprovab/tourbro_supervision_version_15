import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSlideToggleChange } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-car-type',
  templateUrl: './car-type.component.html',
  styleUrls: ['./car-type.component.scss']
})
export class CarTypeComponent implements OnInit {

carTypeForm: FormGroup;
  saveTextName: string = 'Save';
  isSubmitted = false;
  enabledForm = true;

  carTypeList: any[] = [];
  loading = false;
  searchSpin = false;

  id: number;

  private destroy$ = new Subject<void>();

  displayColumn = [
    'Sl.No',
    'Status',
    'Car Type',
    'Capacity',
    'Action'
  ];

  constructor(
    private fb: FormBuilder,
    private apiHandler: ApiHandlerService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCarTypeList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ FORM
  createForm() {
    this.carTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      capacity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: [1]
    });
  }

  // ✅ SAVE
  onSave() {
    this.isSubmitted = true;

    if (this.carTypeForm.invalid) {
      this.swal.alert.oops('Please fill all required fields');
      return;
    }

    this.loading = true;

    const payload = {
      name: this.carTypeForm.value.name,
      capacity: Number(this.carTypeForm.value.capacity),
      status: this.carTypeForm.value.status ? 1 : 0
    };

    this.apiHandler.apiHandler('createCarType', 'POST', {}, {}, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.isSubmitted = false;

          if (res.Status) {
            this.swal.alert.success(res.Message);
            this.carTypeForm.reset({ status: 1 });
            this.getCarTypeList();
          } else {
            this.swal.alert.oops(res.Message);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // ✅ UPDATE
  onUpdate() {
    this.isSubmitted = true;

    if (this.carTypeForm.invalid) {
      this.swal.alert.oops('Please fill all required fields');
      return;
    }

    this.loading = true;

    const payload = {
      id: this.id,
      name: this.carTypeForm.value.name,
      capacity: this.carTypeForm.value.capacity,
      // status: this.carTypeForm.value.status ? 1 : 0
    };

    this.apiHandler.apiHandler('updateCarType', 'POST', {}, {}, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.isSubmitted = false;

          if (res.Status) {
            this.swal.alert.success(res.Message);
            this.carTypeForm.reset({ status: 1 });
            this.saveTextName = 'Save';
            this.getCarTypeList();
          } else {
            this.swal.alert.oops(res.Message);
          }
        }
      });
  }

  // ✅ LIST
  getCarTypeList() {
    this.searchSpin = true;

    this.apiHandler.apiHandler('carTypeList', 'POST', {}, {}, {})
      .subscribe((res: any) => {
        this.searchSpin = false;
        this.carTypeList = res.data || [];
      });
  }

  // ✅ EDIT
  onEdit(data: any) {
    console.log(data,"data")
    this.id = data.id;
    this.saveTextName = 'Update';

    this.carTypeForm.patchValue({
      name: data.name,
      capacity: data.capacity,
      status: data.status === 1
    });

    window.scroll({ top: 0, behavior: 'smooth' });
  }

  // ✅ DELETE
  onDelete(id: number) {
    this.swal.alert.delete((action: boolean) => {
      if (!action) return;

      this.apiHandler.apiHandler('deleteCarType', 'POST', {}, {}, { id })
        .subscribe(() => {
          this.swal.alert.success('Deleted successfully');
          this.getCarTypeList();
        });
    });
  }

  // ✅ STATUS TOGGLE
  onStatusChange(event: MatSlideToggleChange, id: number) {
    const payload = {
      id,
      status: event.checked ? 1 : 0
    };

    this.apiHandler.apiHandler('updateStatusCarType', 'POST', {}, {}, payload)
      .subscribe(() => this.getCarTypeList());
  }

  // ✅ CANCEL
  onCancel() {
    this.carTypeForm.reset({ status: 1 });
    this.saveTextName = 'Save';
    this.isSubmitted = false;
  }
}
