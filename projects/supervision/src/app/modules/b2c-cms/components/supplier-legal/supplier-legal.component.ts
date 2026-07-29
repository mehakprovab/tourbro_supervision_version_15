import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-supplier-legal',
  templateUrl: './supplier-legal.component.html',
  styleUrls: ['./supplier-legal.component.scss']
})
export class SupplierLegalComponent implements OnInit {
  legalForm: FormGroup;
  contentTypes = [
    { value: 'terms', label: 'Terms & Conditions' },
    { value: 'privacy', label: 'Privacy Policy' },
    { value: 'refund', label: 'Refund Policy' }
  ];
  editorConfig = {
    type: 'divarea',
    uiColor: '#FFFFFF',
    forcePasteAsPlainText: true,
    allowedContent: false,
  };
  isLoading = false;
  currentContent: any = null;

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadContent(this.contentTypes[0].value);
  }

  createForm(): void {
    this.legalForm = this.fb.group({
      contentType: new FormControl(this.contentTypes[0].value, [Validators.required]),
      content: new FormControl('', [Validators.required])
    });
  }

  onContentTypeChange(): void {
    const type = this.legalForm.get('contentType')?.value;
    this.loadContent(type);
  }

  loadContent(type: string): void {
    this.isLoading = true;
    this.legalForm.patchValue({ content: '' }, { emitEvent: false });

    this.apiHandlerService.apiHandler('supplierContentList', 'post', {}, {}, { content_type: type })
      .subscribe({
        next: (resp: any) => {
          const list = Array.isArray(resp?.data) ? resp.data : [];
          const item = list[0] || null;
          this.currentContent = item;
          this.legalForm.patchValue({
            content: item?.content || item?.terms_and_conditions || item?.description || ''
          }, { emitEvent: false });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.currentContent = null;
          this.legalForm.patchValue({ content: '' }, { emitEvent: false });
        }
      });
  }

  onSubmit(): void {
    if (this.legalForm.invalid) {
      this.swalService.alert.oops('Please select a content type and enter content.');
      return;
    }

    const type = this.legalForm.get('contentType')?.value;
    const payload = {
      content_type: type,
      content: this.legalForm.get('content')?.value,
      id: this.currentContent?.id
    };

    const request$ = this.currentContent?.id
      ? this.apiHandlerService.apiHandler('updateSupplierContent', 'post', {}, {}, payload)
      : this.apiHandlerService.apiHandler('addSupplierContent', 'post', {}, {}, payload);

    request$.subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.swalService.alert.success('Supplier legal content saved successfully.');
          this.loadContent(type);
        } else {
          this.swalService.alert.oops();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      }
    });
  }
}
