import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente para gestionar los datos de certificación.
 * @export
 * @component
 */
@Component({
  selector: 'app-datos-certificacion',
  templateUrl: './datos-certificacion.component.html',
  styleUrl: './datos-certificacion.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TituloComponent],
})
/**   * Componente DatosCertificacionComponent.
 * Proporciona la funcionalidad para gestionar los datos de certificación,
 * incluyendo un formulario reactivo que muestra la certificación SAT.
 */
export class DatosCertificacionComponent implements OnChanges{
  /**
   * Formulario reactivo para la certificación.
   * @type {FormGroup}
   */
  certificionForm!: FormGroup;

  /**
   * Indica si se deben mostrar los campos en la interfaz.
   * @type {boolean}
   */
  @Input() showFields: boolean = false;

  /**   * Indica si se deben mostrar las fechas en la interfaz.
   * @type {boolean}
   */
  public showFecha: boolean = false;

  /**   * Datos de certificación SAT.
   * @type {string | null}
   */
  @Input() certificacionSAT: string | null = '';

  /**
   * Constructor de la clase.
   * Inicializa el formulario reactivo `certificionForm` con el valor "Si" y deshabilitado.
   * @param {FormBuilder} fb - Instancia de `FormBuilder` utilizada para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    this.certificionForm = this.fb.group({
      certificion: [{ value: this.certificacionSAT, disabled: true }], // El campo de certificación con valor "Si" y deshabilitado.
      fechaInicio: [{ value: '', disabled: true }],
      fechaFin: [{ value: '', disabled: true }],
    });
  }

  /**   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza el valor del campo `certificion` en el formulario reactivo con el valor de `certificacionSAT`.
   */
  ngOnChanges(): void {
    this.certificionForm.patchValue({
      certificion: this.certificacionSAT,
      fechaInicio: '',
      fechaFin: '',
    });
    this.showFecha = this.showFields
  }
}
