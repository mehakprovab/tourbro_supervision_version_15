import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

interface SupplierDetailField {
  label: string;
  value: string;
  documentUrl?: string;
  documentName?: string;
}

interface SupplierDetailSection {
  title: string;
  fields: SupplierDetailField[];
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
  detailSections: SupplierDetailSection[] = [];

  private titleList$: Observable<any[]>;
  private countryList$: Observable<any[]>;

  private readonly hiddenFields = [
    'password', 'confirm_password', 'password_digest', 'access_token', 'refresh_token',
    'token', 'secret', 'otp', 'pin'
  ];

  private readonly serviceLabels = {
    stays: 'Stays',
    'yatra-packages': 'Yatra Packages',
    experiences: 'Experiences',
    cabs: 'Cabs',
    'travel-heli': 'Travel & Heli Services',
    'wellness-retreat': 'Wellness Retreat',
    transfer: 'Cabs',
    heli: 'Travel & Heli Services'
  };

  private readonly detailSectionDefinitions = [
    {
      title: 'Company Manager Details',
      fields: [
        { label: 'Title', aliases: ['title', 'title_id'], type: 'title' },
        { label: 'First Name', aliases: ['first_name', 'firstname', 'firstName'] },
        { label: 'Last Name', aliases: ['last_name', 'lastname', 'lastName'] },
        { label: 'Phone Number', aliases: ['phone_number', 'phone', 'mobile', 'contact'] },
        { label: 'Email', aliases: ['email'] },
        { label: 'Country Code', aliases: ['manager_country_code', 'PhoneCode', 'phone_code'] }
      ]
    },
    {
      title: 'Supplier Company Details',
      fields: [
        { label: 'Registered Legal Name', aliases: ['registered_legal_name', 'legal_name'] },
        { label: 'Company Trade Name', aliases: ['trade_name', 'company_trade_name'] },
        { label: 'Chain Name', aliases: ['chain_name'] },
        { label: 'Company Website', aliases: ['company_website', 'website'] },
        { label: 'Registration Number', aliases: ['registration_number'] },
        { label: 'Country Of Registration', aliases: ['country_of_registration'], type: 'country' },
        { label: 'PAN Number', aliases: ['pan_number'] },
        { label: 'Aadhaar Number', aliases: ['aadhaar_number', 'aadhar_number'] },
        { label: 'License Number', aliases: ['license_number', 'licence_number'] },
        { label: 'Office Phone Number', aliases: ['office_phone'] },
        { label: 'Alternative Company Email Id', aliases: ['alt_company_email', 'alternative_company_email'] }
      ]
    },
    {
      title: 'Supplier Company Address',
      fields: [
        { label: 'Address Line1', aliases: ['address_line1', 'address1'] },
        { label: 'Address Line2', aliases: ['address_line2', 'address2'] },
        { label: 'Country', aliases: ['country'], type: 'country' },
        { label: 'State', aliases: ['state', 'state_name'] },
        { label: 'City', aliases: ['city', 'city_name'] },
        { label: 'Zip/Postal Code', aliases: ['zip_code', 'zipcode', 'postal_code', 'pincode'] }
      ]
    },
    {
      title: 'Supplier Accounting Details',
      fields: [
        { label: 'Accounting Email ID', aliases: ['accounting_email'] },
        { label: 'Accounting Phone Number', aliases: ['accounting_phone'] },
        { label: 'Bank Name', aliases: ['bank_name'] },
        { label: 'Bank Branch Address', aliases: ['branch_address'] },
        { label: 'Bank Account Holder Name', aliases: ['account_holder_name'] },
        { label: 'Account Number', aliases: ['account_number'] },
        { label: 'IFSC Code', aliases: ['ifsc_code'] }
      ]
    },
    {
      title: 'Services You Provide',
      fields: [
        { label: 'Selected Services', aliases: ['services', 'selectedServices', 'selectedSuppliers'], type: 'services' }
      ]
    },
    {
      title: 'Account Details',
      fields: [
        { label: 'Created At', aliases: ['created_at', 'createdAt', 'created_date'], type: 'date' },
        { label: 'Account Creation Time', aliases: ['created_datetime', 'account_creation_time', 'created_time', 'created_at', 'createdAt'], type: 'time' },
        { label: 'Status', aliases: ['status'], type: 'status' }
      ]
    }
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
    this.detailSections = [];

    forkJoin({
      response: this.apiHandlerService.apiHandler('supplierDetail', 'post', {}, {}, {
        supplier_id: supplierId,
        id: supplierId
      }),
      titles: this.getTitleList(),
      countries: this.getCountryList()
    }).subscribe({
      next: ({ response, titles, countries }: any) => {
        this.loading = false;
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          this.errorMessage = response.Message || 'Unable to load supplier details.';
          return;
        }

        const details = this.extractSupplierDetails(response);
        const mergedDetails = this.normalizeDetails({ ...this.supplier, ...details });
        this.detailSections = this.buildDetailSections(mergedDetails, titles, countries);
        const sectionLabels = this.detailSections.reduce((labels: string[], section) => {
          return labels.concat(section.fields.map(field => field.label));
        }, []);
        const fields = this.flattenDetails(mergedDetails)
          .filter(field => field.documentUrl || sectionLabels.indexOf(field.label) === -1);
        this.documentFields = fields.filter(field => !!field.documentUrl);
        this.detailFields = fields.filter(field => !field.documentUrl);
        if (!this.detailSections.length && !this.detailFields.length && !this.documentFields.length) {
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
    return {
      ...rootDetails,
      ...this.parseObjectLike(user),
      ...this.parseObjectLike(supplier)
    };
  }

  private normalizeDetails(details: any): any {
    const normalized = { ...details };
    Object.keys(normalized).forEach(key => {
      normalized[key] = this.parseJsonLike(normalized[key]);
    });

    return normalized;
  }

  private buildDetailSections(details: any, titles: any[], countries: any[]): SupplierDetailSection[] {
    return this.detailSectionDefinitions.map(section => {
      const fields = section.fields.reduce((result: SupplierDetailField[], field: any) => {
        const value = this.getFirstAvailableValue(details, field.aliases);
        if (value === null || value === undefined || value === '') {
          return result;
        }

        result.push({
          label: field.label,
          value: this.formatFieldValue(value, field.type, titles, countries)
        });
        return result;
      }, []);

      return { title: section.title, fields };
    }).filter(section => section.fields.length);
  }

  private getFirstAvailableValue(details: any, aliases: string[]): any {
    for (const alias of aliases) {
      if (details[alias] !== null && details[alias] !== undefined && details[alias] !== '') {
        return details[alias];
      }
    }

    return null;
  }

  private formatFieldValue(value: any, type: string, titles: any[], countries: any[]): string {
    if (type === 'title') {
      return this.getTitleName(value, titles);
    }
    if (type === 'country') {
      return this.getCountryName(value, countries);
    }
    if (type === 'services') {
      return this.formatServices(value);
    }
    if (type === 'datetime') {
      return this.formatDateTime(value);
    }
    if (type === 'date') {
      return this.formatDateTime(value, 'date');
    }
    if (type === 'time') {
      return this.formatDateTime(value, 'time');
    }
    if (type === 'status') {
      return this.formatValue(value, 'status');
    }
    return this.formatValue(value, '');
  }

  private parseObjectLike(value: any): any {
    const parsed = this.parseJsonLike(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  }

  private parseJsonLike(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) {
      return value;
    }

    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return value;
    }
  }

  private getTitleList(): Observable<any[]> {
    if (!this.titleList$) {
      this.titleList$ = this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {}, {}).pipe(
        map((resp: any) => resp && Array.isArray(resp.data) ? resp.data : []),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.titleList$;
  }

  private getCountryList(): Observable<any[]> {
    if (!this.countryList$) {
      this.countryList$ = this.apiHandlerService.apiHandler('countryList', 'post', '', '').pipe(
        map((resp: any) => {
          const data = resp && resp.data;
          if (Array.isArray(data)) {
            return data;
          }
          return [
            ...(data && Array.isArray(data.popular_countries) ? data.popular_countries : []),
            ...(data && Array.isArray(data.countries) ? data.countries : [])
          ];
        }),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.countryList$;
  }

  private getTitleName(value: any, titles: any[]): string {
    if (value && typeof value === 'object') {
      return value.title || value.name || this.formatValue(value, '');
    }

    const title = titles.find(item => item.id == value || item.title == value || item.name == value);
    return title ? (title.title || title.name || String(value)) : String(value);
  }

  private getCountryName(value: any, countries: any[]): string {
    if (value && typeof value === 'object') {
      return value.name || value.country_name || this.formatValue(value, '');
    }

    const country = countries.find(item => item.id == value || item.name == value || item.country_name == value);
    return country ? (country.name || country.country_name || String(value)) : String(value);
  }

  private formatServices(value: any): string {
    const services = this.normalizeServices(value);
    if (!services.length) {
      return this.formatValue(value, '');
    }

    return services.map(service => this.serviceLabels[service] || this.formatLabel(service)).join(', ');
  }

  private normalizeServices(value: any): string[] {
    const parsed = this.parseJsonLike(value);
    const values = Array.isArray(parsed) ? parsed : String(parsed || '').split(',');

    return values.reduce((result: string[], item: any) => {
      const parsedItem = this.parseJsonLike(item);
      const serviceValues = Array.isArray(parsedItem) ? parsedItem : [parsedItem];
      serviceValues.forEach(service => {
        const serviceName = String(service || '').trim();
        if (serviceName && result.indexOf(serviceName) === -1) {
          result.push(serviceName);
        }
      });
      return result;
    }, []);
  }

  private formatDateTime(value: any, mode: 'date' | 'time' | 'datetime' = 'datetime'): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const timestamp = typeof value === 'number' || /^[0-9]+$/.test(String(value))
      ? Number(value)
      : null;
    const date = timestamp
      ? new Date(timestamp < 100000000000 ? timestamp * 1000 : timestamp)
      : new Date(value);

    if (isNaN(date.getTime())) {
      return String(value);
    }

    if (mode === 'date') {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    if (mode === 'time') {
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
