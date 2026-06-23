import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';

export interface ReportPaymentData {
  appReference: string;
  source: string;
  name: string;
  phone: string;
  email: string;
  amount: number;
}

@Component({
  selector: 'app-report-payment-modal',
  templateUrl: './report-payment-modal.component.html',
  styleUrls: ['./report-payment-modal.component.scss']
})
export class ReportPaymentModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() payment: ReportPaymentData;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() paymentSuccess = new EventEmitter<void>();

  paymentForm: FormGroup;
  paymentGateways: any[] = [];
  gatewayResponse: any;
  loading = false;
  walletAvailable = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && this.visible && this.payment && this.payment.appReference) {
      this.submitted = false;
      this.paymentForm.reset();
      this.paymentGateways = [];
      this.gatewayResponse = null;
      this.loadPaymentOptions();
    }
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  confirm(): void {
    this.submitted = true;
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const method = this.paymentForm.value.paymentMethod;
    if (method === 'wallet') {
      this.payFromWallet();
      return;
    }
    if (method === 'barclay') {
      this.submitCardGateway();
    }
  }

  private loadPaymentOptions(): void {
    const user = this.getCurrentUser();
    this.loading = true;
    this.apiHandlerService.apiHandler('getPaymentGateWays', 'post', {}, {}, { user_id: user.id || 0 })
      .subscribe((response: any) => {
        if (response && [200, 201].includes(response.statusCode) && Array.isArray(response.data) && response.data.length) {
          this.paymentGateways = response.data;
          this.prepareCardPayment();
          this.checkWallet();
        } else {
          this.loading = false;
          this.swalService.alert.oops('No payment gateway enabled.');
          this.close();
        }
      }, () => {
        this.loading = false;
        this.swalService.alert.oops('Unable to load payment gateways.');
        this.close();
      });
  }

  private prepareCardPayment(): void {
    const timestamp = new Date().getTime().toString();
    const user = this.getCurrentUser();
    const payload = {
      app_reference: this.payment.appReference,
      order_id: `${timestamp.substring(10)}${timestamp.substring(0, 7)}${timestamp.substring(7)}`,
      payment_type: 'Barclay',
      merchantInvoiceNumber: `INV-${this.payment.appReference}`,
      source: this.payment.source,
      name: this.payment.name,
      phone: this.payment.phone,
      userId: user.id || 0,
      email: this.payment.email
    };

    this.apiHandlerService.apiHandler('initiatePaymentReport', 'post', {}, {}, payload)
      .subscribe((response: any) => {
        this.loading = false;
        if (response && response.data && response.data.paymentUrl) {
          this.gatewayResponse = response.data;
        }
      }, () => {
        this.loading = false;
      });
  }

  private checkWallet(): void {
    this.apiHandlerService.apiHandler('checkWalletBalance', 'post', {}, {}, {
      app_reference: this.payment.appReference
    }).subscribe((response: any) => {
      const balance = response && response.data && response.data[0];
      this.walletAvailable = !!balance && Number(balance.ticketFare) <= Number(balance.userWalletBalance);
    }, () => {
      this.walletAvailable = false;
    });
  }

  private payFromWallet(): void {
    this.loading = true;
    this.apiHandlerService.apiHandler('deductFromWallet', 'post', {}, {}, {
      app_reference: this.payment.appReference
    }).subscribe((response: any) => {
      this.loading = false;
      if (response && response.data) {
        this.swalService.alert.success('Your transaction was successful.');
        this.paymentSuccess.emit();
        this.close();
      } else {
        this.swalService.alert.oops('Unable to complete the wallet payment.');
      }
    }, () => {
      this.loading = false;
      this.swalService.alert.oops('Your wallet balance is not sufficient.');
    });
  }

  private submitCardGateway(): void {
    if (!this.gatewayResponse || !this.gatewayResponse.paymentUrl) {
      this.swalService.alert.oops('Card payment is not ready. Please try again.');
      return;
    }

    const form = document.createElement('form');
    form.method = 'post';
    form.action = this.gatewayResponse.paymentUrl;
    Object.keys(this.gatewayResponse).forEach(key => {
      if (key === 'paymentUrl' || this.gatewayResponse[key] === null || this.gatewayResponse[key] === undefined) {
        return;
      }
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key === 'SHASign' ? 'SHASIGN' : key;
      input.value = String(this.gatewayResponse[key]);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  supportsGateway(name: string): boolean {
    return this.paymentGateways.some(gateway => String(gateway.remarks || '').toLowerCase() === name);
  }

  private getCurrentUser(): any {
    const raw = sessionStorage.getItem('currentSupervisionUser') || sessionStorage.getItem('currentUser');
    if (!raw) {
      return {};
    }
    try {
      const user = JSON.parse(raw);
      return user && user.data ? user.data : user;
    } catch (_) {
      return {};
    }
  }
}
