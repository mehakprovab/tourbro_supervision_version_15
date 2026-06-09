import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'ng-otp-input',
  template: `
    <div class="otp-input-wrapper">
      <input
        #otpInput
        *ngFor="let cell of cells; let index = index"
        class="form-control text-center otp-input-cell"
        maxlength="1"
        autocomplete="one-time-code"
        [ngStyle]="inputStyles"
        [type]="isPasswordInput ? 'password' : 'text'"
        [value]="otpValues[index] || ''"
        [placeholder]="placeholder"
        (input)="onInput($event, index)"
        (keydown)="onKeyDown($event, index)"
        (paste)="onPaste($event)"
      />
    </div>
  `,
  styles: [`
    .otp-input-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      flex-wrap: nowrap;
    }

    .otp-input-cell {
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      padding: 0;
    }
  `]
})
export class OtpInputComponent {
  @Input() config: any = {};
  @Output() onInputChange = new EventEmitter<string>();
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef<HTMLInputElement>>;

  otpValues: string[] = [];

  get length(): number {
    return this.config && this.config.length ? this.config.length : 6;
  }

  get cells(): number[] {
    return Array.from({ length: this.length }, (_, index) => index);
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
    const nextValue = this.cleanValue(value || '');
    this.otpValues = nextValue.split('').slice(0, this.length);
    this.emitValue();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const nextValue = this.cleanValue(input.value || '');

    if (!nextValue) {
      this.otpValues[index] = '';
      input.value = '';
      this.emitValue();
      return;
    }

    this.otpValues[index] = nextValue.charAt(nextValue.length - 1);
    input.value = this.otpValues[index];
    this.focusInput(index + 1);
    this.emitValue();
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Backspace') {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.value) {
      return;
    }

    this.otpValues[index - 1] = '';
    this.focusInput(index - 1);
    this.emitValue();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedValue = this.cleanValue(event.clipboardData ? event.clipboardData.getData('text') : '');
    this.setValue(pastedValue);
    this.focusInput(Math.min(pastedValue.length, this.length - 1));
  }

  private cleanValue(value: string): string {
    const nextValue = this.config && this.config.allowNumbersOnly
      ? value.replace(/\D/g, '')
      : value;

    return nextValue.slice(0, this.length);
  }

  private emitValue(): void {
    this.onInputChange.emit(this.otpValues.join('').slice(0, this.length));
  }

  private focusInput(index: number): void {
    const input = this.otpInputs && this.otpInputs.toArray()[index];

    if (input) {
      input.nativeElement.focus();
    }
  }
}
