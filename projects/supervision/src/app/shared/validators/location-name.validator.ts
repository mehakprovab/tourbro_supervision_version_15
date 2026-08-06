import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ALPHANUMERIC_LOCATION_NAME = /^(?!\s*$)[A-Za-z0-9 ]+$/;
const CITY_LOCATION_NAME = /^(?!\s*$)[A-Za-z ]+$/;

export function locationNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    return ALPHANUMERIC_LOCATION_NAME.test(String(value))
      ? null
      : { invalidLocationName: true };
  };
}

export function cityLocationNameValidator(options: { allowCommaSeparated?: boolean } = {}): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const cityNames = options.allowCommaSeparated
      ? String(value).split(',').map(city => city.trim())
      : [String(value)];

    return cityNames.every(city => CITY_LOCATION_NAME.test(city))
      ? null
      : { invalidLocationName: true };
  };
}
