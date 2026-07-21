import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from 'projects/supervision/src/environments/environment.prod';

interface SupplierDetailField {
  label: string;
  value: string;
  documentUrl?: string;
  documentName?: string;
}

@Component({
  selector: 'app-supplier-details-modal',
  templateUrl: './supplier-details-modal.component.html',
  styleUrls: ['./supplier-details-modal.component.scss']
})
export class SupplierDetailsModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() supplier: any;
  @Output() closed = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  detailFields: SupplierDetailField[] = [];
  documentFields: SupplierDetailField[] = [];

  private readonly hiddenFields = [
    'password', 'confirm_password', 'password_digest', 'access_token', 'refresh_token',
    'token', 'secret', 'otp', 'pin'
  ];

  constructor(private apiHandlerService: ApiHandlerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.visible || changes.supplier) && this.visible && this.supplier) {
      this.loadSupplierDetails();
    }
  }

  close(): void {
    this.closed.emit();
  }

  private loadSupplierDetails(): void {
    const supplierId = this.supplier.supplier_id || this.supplier.id;
    this.loading = true;
    this.errorMessage = '';
    this.detailFields = [];
    this.documentFields = [];

    this.apiHandlerService.apiHandler('supplierDetail', 'post', {}, {}, {
      supplier_id: supplierId,
      id: supplierId
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          this.errorMessage = response.Message || 'Unable to load supplier details.';
          return;
        }

        const details = this.extractSupplierDetails(response);
        const fields = this.flattenDetails({ ...this.supplier, ...details });
        this.documentFields = fields.filter(field => !!field.documentUrl);
        this.detailFields = fields.filter(field => !field.documentUrl);
        if (!this.detailFields.length && !this.documentFields.length) {
          this.errorMessage = 'Supplier details were not found.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load supplier details.';
      }
    });
  }

  private extractSupplierDetails(response: any): any {
    let details = response && response.data;
    while (details && !Array.isArray(details) && details.data) {
      details = details.data;
    }
    if (Array.isArray(details)) {
      details = details[0];
    }
    if (!details || typeof details !== 'object') {
      return {};
    }

    const { user, supplier, ...rootDetails } = details;
    return { ...rootDetails, ...(user || {}), ...(supplier || {}) };
  }

  private flattenDetails(value: any, prefix = ''): SupplierDetailField[] {
    if (!value || typeof value !== 'object') {
      return [];
    }

    return Object.keys(value).reduce((fields: SupplierDetailField[], key: string) => {
      if (this.hiddenFields.some(hidden => key.toLowerCase().includes(hidden))) {
        return fields;
      }

      const currentValue = value[key];
      if (currentValue === null || currentValue === undefined || currentValue === '') {
        return fields;
      }

      const path = prefix ? `${prefix} ${key}` : key;
      if (!Array.isArray(currentValue) && typeof currentValue === 'object') {
        return fields.concat(this.flattenDetails(currentValue, path));
      }

      const documentUrl = this.getDocumentUrl(path, currentValue);
      fields.push({
        label: this.formatLabel(path),
        value: this.formatValue(currentValue, key),
        documentUrl,
        documentName: documentUrl ? this.getDocumentName(currentValue, path) : undefined
      });
      return fields;
    }, []);
  }

  private formatLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  private formatValue(value: any, key: string): string {
    if (key.toLowerCase() === 'status') {
      if (value === true || value === 1 || value === '1') {
        return 'Active';
      }
      if (value === false || value === 0 || value === '0') {
        return 'Inactive';
      }
      if (value === 2 || value === '2') {
        return 'Under Verification';
      }
    }
    if (Array.isArray(value)) {
      return value.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }

  private getDocumentUrl(key: string, value: any): string | undefined {
    const normalizedKey = key.toLowerCase();
    const lastKey = normalizedKey.split(' ').pop();
    const isNamedSupplierDocument = ['pan', 'pan_document', 'aadhaar', 'aadhar', 'aadhaar_document',
      'aadhar_document', 'license', 'licence', 'license_document', 'licence_document'].includes(lastKey);
    const isDocumentField = (normalizedKey.includes('document') || normalizedKey.includes('attachment') ||
      normalizedKey.includes('upload') || normalizedKey.includes('license_file') ||
      normalizedKey.includes('pan_file') || normalizedKey.includes('aadhaar_file') ||
      normalizedKey.includes('aadhar_file') || isNamedSupplierDocument) && !normalizedKey.endsWith('_name');

    if (!isDocumentField || typeof value !== 'string' || !value.trim()) {
      return undefined;
    }

    const path = value.trim();
    if (/^(https?:|blob:|data:)/i.test(path)) {
      return path;
    }
    if (path.startsWith('//')) {
      return `https:${path}`;
    }
    return `${environment.b2c_url.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private getDocumentName(value: string, key: string): string {
    const cleanValue = value.split('?')[0];
    const fileName = cleanValue.substring(cleanValue.lastIndexOf('/') + 1);
    return fileName || `${this.formatLabel(key)} document`;
  }

  getDocumentLabel(field: SupplierDetailField): string {
    const label = field.label.toLowerCase();
    if (label.includes('pan')) {
      return 'PAN Document';
    }
    if (label.includes('aadhaar') || label.includes('aadhar')) {
      return 'Aadhaar Document';
    }
    if (label.includes('license') || label.includes('licence')) {
      return 'License Document';
    }
    return field.label;
  }
}
