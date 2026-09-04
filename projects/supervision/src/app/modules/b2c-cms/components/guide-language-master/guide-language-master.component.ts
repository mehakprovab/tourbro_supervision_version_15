import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-guide-language-master',
  templateUrl: './guide-language-master.component.html',
  styleUrls: ['./guide-language-master.component.scss']
})
export class GuideLanguageMasterComponent implements OnInit, OnDestroy {
  languageForm: FormGroup;
  displayColumn: string[] = ['Sl. No.', 'Status', 'Language Name', 'Action'];
  languageMasterDataList: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  searchText = '';
  searchSpin = true;
  saveTextName = 'Add';
  langId: number;
  loading = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  loggedInUser: any = {};

  private subSunk = new SubSink();

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.loggedInUser = currentDomainUser ? JSON.parse(currentDomainUser) : {};
    this.createLanguageForm();
    this.getLanguageList();
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

  createLanguageForm(): void {
    this.languageForm = this.fb.group({
      language: ['', Validators.required]
    });
  }

  getLanguageList(): void {
    this.searchSpin = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('listGuideLanguage', 'POST', {}, {}, {}).subscribe({
      next: (res) => {
        if (this.isSuccessResponse(res)) {
          const list = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : []);
          this.languageMasterDataList = list;
          this.collectionSize = list.length;
          this.resetForm();
        } else {
          this.languageMasterDataList = [];
          this.collectionSize = 0;
        }
        this.searchSpin = false;
      },
      error: () => {
        this.languageMasterDataList = [];
        this.collectionSize = 0;
        this.searchSpin = false;
      }
    });
  }

  onLanguageMasterSave(): void {
    if (!this.languageForm.valid) {
      this.languageForm.markAllAsTouched();
      return;
    }

    const formValue = this.languageForm.value;
    const req = this.saveTextName === 'Add'
      ? { language: formValue.language }
      : { id: this.langId, language: formValue.language };
    const apiEndPoint = this.saveTextName === 'Add' ? 'addGuideLanguage' : 'updateGuideLanguage';

    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler(apiEndPoint, 'POST', {}, {}, req).subscribe({
      next: (res) => {
        this.loading = false;
        if (this.isSuccessResponse(res)) {
          const alertMessage = this.saveTextName === 'Add' ? 'Language Added Successfully' : 'Language Updated Successfully';
          this.swalService.alert.success(alertMessage);
          this.getLanguageList();
        } else {
          this.swalService.alert.oops(res.Message || res.message || 'Unable to save language');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err));
      }
    });
  }

  onEditLanguage(id: number, data: any): void {
    this.langId = id;
    window.scroll({ top: 0, behavior: 'smooth' });
    this.saveTextName = 'Update';
    this.languageForm.patchValue({
      language: this.getLanguageName(data)
    });
  }

  onDeletedRecord(id: number): void {
    const req = { id };
    this.swalService.alert.delete((action) => {
      if (!action) return;

      this.loading = true;
      this.subSunk.sink = this.apiHandlerService.apiHandler('deleteGuideLanguage', 'POST', {}, {}, req).subscribe({
        next: (response) => {
          this.loading = false;
          if (this.isSuccessResponse(response)) {
            this.swalService.alert.success('Language has been deleted successfully');
            this.getLanguageList();
          } else {
            this.swalService.alert.oops(response.Message || response.message || 'Unable to delete language');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.swalService.alert.error(this.getErrorMessage(err));
        }
      });
    });
  }

  onUpdateStatus(event: MatSlideToggleChange, item: any): void {
    const previousStatus = item.status;
    const req = {
      id: item.id,
      status: event.checked ? 1 : 0
    };

    this.subSunk.sink = this.apiHandlerService.apiHandler('updateGuideLanguage', 'POST', {}, {}, req).subscribe({
      next: (res) => {
        if (this.isSuccessResponse(res)) {
          this.swalService.alert.success('Status Updated Successfully.');
          this.getLanguageList();
        } else {
          item.status = previousStatus;
          this.swalService.alert.oops(res.Message || res.message || 'Unable to update status');
        }
      },
      error: (err: HttpErrorResponse) => {
        item.status = previousStatus;
        this.swalService.alert.error(this.getErrorMessage(err));
      }
    });
  }

  resetForm(): void {
    this.languageForm.reset();
    this.saveTextName = 'Add';
    this.langId = null;
  }

  getLanguageName(item: any): string {
    return item && (item.guide_language_name || item.language_name || item.guide_language || '');
  }

  getFilteredLanguageList(): any[] {
    const searchValue = (this.searchText || '').toString().toLowerCase().trim();
    if (!searchValue) {
      return this.languageMasterDataList;
    }

    return this.languageMasterDataList.filter((item) => {
      const language = this.getLanguageName(item).toLowerCase();
      const status = this.isActive(item) ? 'active' : 'inactive';
      return language.includes(searchValue) || status.includes(searchValue);
    });
  }

  isActive(item: any): boolean {
    return item && (item.status === 1 || item.status === true || item.status === '1');
  }

  showActionButtons(authId?: number, loggedInId?: number): boolean {
    if (this.loggedInUser.auth_role_id === 3 || this.loggedInUser.auth_role_id === 1) {
      return true;
    }

    if (this.loggedInUser.auth_role_id === 7) {
      return this.loggedInUser.id === loggedInId;
    }

    return true;
  }

  private isSuccessResponse(res: any): boolean {
    return !!res && (
      res.Status === true ||
      res.status === true ||
      res.statusCode === 200 ||
      res.statusCode === 201
    );
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    return (err.error && (err.error.Message || err.error.message)) || 'Something went wrong';
  }
}
