# InputFilaComponent
The InputFilaComponent is a reusable Angular standalone component that provides a file input field with validation support. It is designed for selecting files such as certificates (.cer, .key) and includes built-in validation for required fields and maximum file size.

# Features
1. Supports binding with Reactive Forms
2. Accepts file type restrictions via accept
3. Emits events when a file is selected or when the file dialog is canceled
4. Supports required field validation
5. Supports maximum file size validation using a directive (MaxFileSizeDirective)
6. Displays custom error messages for validation states

# Inputs           # Type            # Description

`labelNombre`      `string`          Label text displayed above the input.
`formControl`      `FormControl`     Reactive form control bound to the input.
`required`         `boolean`         Whether the field is mandatory.
`id`               `string`          Unique ID for the input field.
`accept`           `string`          Allowed file types (e.g., `.cer`, `.key`, `.pdf`).
`filaSize`         `number`          Max allowed file size in bytes (default can be set in directive).

# Outputs                    # Type    # Description
`filaSeleccionadaEvento`     `File`    Emits the selected file when a user chooses one.
`archivoDialogCancelar`      `string`  Emits when the file dialog is closed without selecting a file.

# Validation

1. Required: If required=true, the component validates that a file is selected.
2. File Size: Uses MaxFileSizeDirective to validate maximum file size (filaSize in bytes).
Example:
  - filaSize="307200" → maximum allowed size is 300 KB
  - If exceeded, Angular adds the fileSize error to the control

# Usage

<lib-input-fila
  [labelNombre]="'Certificate (cer)'"
  [formControl]="FormCertificado.controls.cer"
  [required]="true"
  [id]="'cer'"
  [accept]="'.cer'"
  (filaSeleccionadaEvento)="handleFile('cer', $event)"
  (archivoDialogCancelar)="dialogoCancelar('cerFileName')"
  [filaSize]="307200" <!-- Max size: 300 KB -->
></lib-input-fila>

<!-- Required validation -->
@if (!FormCertificado.get('cerFileName')?.value && FormCertificado.get('cerFileName')?.touched) {
  <div class="d-grid mt-2">
    <span class="mensaje-error">This field is required.</span>
  </div>
}

<!-- Custom error messages -->
@if (certFileError) {
  <div class="d-grid mt-2">
    <span class="mensaje-error">{{ certFileError }}</span>
  </div>
}

<!-- File size validation -->
@if (FormCertificado.get('cerFileName')?.hasError('fileSize')) {
  <span class="mensaje-error">The file exceeds the maximum allowed size of 2 MB.</span>
}




