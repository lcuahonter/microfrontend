import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormUtils {
  static getTextError(errors: ValidationErrors | null) {
    if (!errors) return null;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
        case 'typeDocumentRequired':
        case 'dateRequired':
        case 'caatRequired':
        case 'iataRequired':
        case 'guideNumberRequired':
        case 'startDateRequired':
        case 'endDateRequired':
        case 'manifestRequired':
        case 'masterRequired':
        case 'customRequired':
        case 'broadcastDateRequired':
        case 'numFlightRequired':
        case 'transferDateRequired':
        case 'atLeastOneRequired':
        case 'guideManifestRequired':
        case 'issueDate':
          return 'Este campo es obligatorio';
        case 'missingStartDate':
          return 'Selecciona primero fecha de inicio';
        case 'invalidTimeFormat':
          return 'La hora indicada no es válida';
        case 'email':
          return 'El formato no es el correcto';
        case 'invalidWaybillFormat':
          return 'La guía no tiene formato válido';
        default:
          return `Error no controlado ${key}`;
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    // Get control-level errors
    const controlErrors = form.controls[fieldName].errors ?? {};

    // Get form-level errors that match or relate to this field
    const formErrors = Object.entries(form.errors ?? {}).reduce((acc, [key, value]) => {
      // Include errors that reference this specific field
      if (key.toLowerCase().includes(fieldName.toLowerCase())) {
        acc[key] = value;
      }
      return acc;
    }, {} as ValidationErrors);

    // Merge both control and filtered form-level errors
    const mergedErrors = { ...controlErrors, ...formErrors };

    // Use getTextError to return the message
    return FormUtils.getTextError(mergedErrors);
  }

  static formHasError(form: FormGroup, key: string, fieldName: string): boolean {
    if (!form.errors) return false;

    if (fieldName) {
      return form.errors.hasOwnProperty(key) && form.controls[fieldName].touched;
    }

    return form.errors.hasOwnProperty(key);
  }

  static fieldIsTouched(form: FormGroup, fieldName: string): boolean {
    if (!form.controls[fieldName]) return false;

    return form.controls[fieldName].touched;
  }

  static conditionalRequiredValidator(
    triggerControl: string,
    triggerValues: any | any[], // puede ser un valor o un array
    targetControl: string,
  ): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      if (!(form instanceof FormGroup)) return null;

      const trigger = form.get(triggerControl);
      const target = form.get(targetControl);
      if (!trigger || !target) return null;

      const normalize = (value: any): any => {
        if (value === 'null' || value === '' || value === undefined) return null;
        return value;
      };

      const triggerVal = normalize(trigger.value);
      const targetVal = normalize(target.value);

      const triggers = Array.isArray(triggerValues) ? triggerValues : [triggerValues];

      // Si el trigger coincide con alguno de los valores y target está vacío → error
      if (triggers.includes(triggerVal) && (targetVal === null || targetVal === '')) {
        return { [`${targetControl}Required`]: true };
      }

      return null;
    };
  }

  static valueSelected(form: FormGroup, fieldName: string, value: any): boolean {
    if (!form.controls[fieldName]) return false;

    return form.controls[fieldName].value === value;
  }

  static atLeastOneRequiredValidator(fields: string[]): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      if (!(form instanceof FormGroup)) return null;

      const hasAtLeastOne = fields.some((field) => !!form.get(field)?.value);

      return hasAtLeastOne ? null : { atLeastOneRequired: true };
    };
  }

  static timeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null; // no valida si está vacío (para usar junto con Validators.required)

      // Expresión regular HH:mm (24h)
      const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      // Si no coincide con el patrón, retorna error
      if (!regex.test(value)) {
        return { invalidTimeFormat: true };
      }

      return null; // válido
    };
  }

  static emailFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null; // no valida si el campo está vacío

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      return emailRegex.test(value) ? null : { invalidEmailFormat: true };
    };
  }

  static waybillNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const regex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{8}$/;

      return regex.test(value) ? null : { invalidWaybillFormat: true };
    };
  }
}
