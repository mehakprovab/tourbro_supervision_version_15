import { AbstractControl, ValidationErrors } from '@angular/forms';

export function richTextRequired(control: AbstractControl): ValidationErrors | null {
  const content = document.createElement('div');
  content.innerHTML = control.value || '';
  const text = (content.textContent || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  return text ? null : { required: true };
}
