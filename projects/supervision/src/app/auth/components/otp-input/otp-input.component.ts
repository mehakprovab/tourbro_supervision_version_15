import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ng-otp-input',
  template: `
    <input
      class="form-control text-center"
      [attr.maxlength]="length"
      [ngStyle]="inputStyles"
      [type]="isPasswordInput ? 'password' : 'text'"
      [value]="value"
      [placeholder]="placeholder"
      (input)="onInput($event)"
    />
  `
})
export class OtpInputComponent {
  @Input() config: any = {};
  @Output() onInputChange = new EventEmitter<string>();

  value = '';

  get length(): number {
    return this.config && this.config.length ? this.config.length : 6;
  }

  get inputStyles(): any {
    return this.config && this.config.inputStyles ? this.config.inputStyles : {};
  }

  get isPasswordInput(): boolean {
    return !!(this.config && this.config.isPasswordInput);
  }

  get placeholder(): string {
    return this.config && this.config.placeholder ? this.config.placeholder : '';
  }

  setValue(value: string): void {
    this.value = value || '';
    this.onInputChange.emit(this.value);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let nextValue = input.value || '';

    if (this.config && this.config.allowNumbersOnly) {
      nextValue = nextValue.replace(/\D/g, '');
    }

    nextValue = nextValue.slice(0, this.length);
    this.value = nextValue;
    input.value = nextValue;
    this.onInputChange.emit(this.value);
  }
}
