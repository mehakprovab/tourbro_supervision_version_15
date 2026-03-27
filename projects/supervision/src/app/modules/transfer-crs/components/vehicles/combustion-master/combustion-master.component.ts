import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-combustion-master',
  templateUrl: './combustion-master.component.html',
  styleUrls: ['./combustion-master.component.scss']
})
export class CombustionMasterComponent implements OnInit {

   form: FormGroup;
  list: any[] = [];

  searchText = '';
  saveText = 'Save';
  enabledForm = true;
  isSubmitted = false;
  loading = false;

  id: number;

  page = 1;
  pageSize = 20;
  collectionSize = 0;

  constructor(
    private fb: FormBuilder,
    private api: ApiHandlerService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getList();
  }

  createForm() {
    this.form = this.fb.group({
      type: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      status: [1]
    });
  }

  onSave() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.swal.alert.oops('Please fill required fields');
      return;
    }

    this.loading = true;

    const payload = {
      type: this.form.value.type,
      status: this.form.value.status ? 1 : 0
    };

    this.api.apiHandler('addVehicleCombustion', 'POST', {}, {}, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.Status) {
            this.swal.alert.success(res.Message);
            this.form.reset({ status: 1 });
            this.getList();
            this.isSubmitted = false;
          }
        },
        error: () => this.loading = false
      });
  }

  onUpdate() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.swal.alert.oops('Please fill required fields');
      return;
    }

    this.loading = true;

    const payload = {
      id: this.id,
      type: this.form.value.type,
      // status: this.form.value.status ? 1 : 0
    };

    this.api.apiHandler('updateVehicleCombustion', 'POST', {}, {}, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.Status) {
            this.swal.alert.success(res.Message);
            this.form.reset({ status: 1 });
            this.saveText = 'Save';
            this.getList();
            this.isSubmitted = false;
          }
        },
        error: () => this.loading = false
      });
  }

  getList() {
    this.loading = true;

    this.api.apiHandler('VehicleCombustionList', 'POST', {}, {}, {})
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.list = res.data || [];
          this.collectionSize = this.list.length;
        },
        error: () => this.loading = false
      });
  }

  onEdit(item: any) {
    this.id = item.id;
    this.saveText = 'Update';

    this.form.patchValue({
      type: item.type,
      status: item.status === 1
    });

    window.scroll({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: number) {
    this.swal.alert.delete((confirm) => {
      if (!confirm) return;

      this.api.apiHandler('deleteCombustionList', 'POST', {}, {}, { id })
        .subscribe(() => {
          this.swal.alert.success('Deleted successfully');
          this.getList();
        });
    });
  }

  onCancel() {
    this.saveText = 'Save';
    this.form.reset({ status: 1 });
    this.isSubmitted = false;
  }

  onStatusChange(event: MatSlideToggleChange, id: number) {
    const payload = {
      id,
      status: event.checked ? 1 : 0
    };

    this.api.apiHandler('updateStatusVehicleCombustion', 'POST', {}, {}, payload)
      .subscribe(() => this.getList());
  }
}