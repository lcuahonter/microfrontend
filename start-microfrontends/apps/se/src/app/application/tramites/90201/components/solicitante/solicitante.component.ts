import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';


/**
 * Componente Solicitante que se utiliza para mostrar y gestionar los Solicitante.
 * 
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * ReactiveFormsModule y AlertComponent para mostrar información y permitir al usuario seleccionar y agregar tratados.
 * 
 * @component
 */

@Component({
  selector: 'app-solicitante',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,TituloComponent],
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
})
export class SolicitanteComponent implements OnInit {

  /**
   * Un grupo de formularios que representa el formulario de solicitud.
   * Este grupo de formularios contiene controles y validadores para los campos del formulario de solicitud.
   */
  public solicitudForm!: FormGroup;


  /**
   * Constructor para SolicitanteComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios.
   */
  constructor(private fb: FormBuilder) {
    this.establecerSolicitudForm();
   }

  /**
   * Gancho de ciclo de vida que se llama después de que se inicializan las propiedades enlazadas a datos de una directiva.
   * Inicializa el componente configurando los valores del formulario.
   * 
   */
  ngOnInit(): void {
    this.establecerValoresDeFormulario();
  }

  /**
   * Inicializa el solicitudForm con un conjunto de controles de formulario.
   * Cada control se inicializa con un valor de cadena vacío y está deshabilitado.
   * Los controles del formulario incluyen:
   * - rfc: El RFC (Registro Federal de Contribuyentes) del solicitante.
   * - denominacion: La denominación o nombre del solicitante.
   * - actividadEconomica: La actividad económica del solicitante.
   * - correoElectronico: La dirección de correo electrónico del solicitante.
   */
  public establecerSolicitudForm(): void {
    this.solicitudForm = this.fb.group({
      rfc: [{value: '',disabled: true}],
      denominacion: [{value: '',disabled: true}],
      actividadEconomica: [{value: '',disabled: true}],
      correoElectronico: [{value: '',disabled: true}]
    });
  }

  /**
   * Establece valores predeterminados para los campos del formulario en el solicitudForm.
   * 
   * Este método asigna valores predefinidos a los siguientes controles del formulario:
   * - 'rfc': Establece el valor a 'AALM87326'.
   * - 'denominacion': Establece el valor a 'SVHGSA ASCV 332'.
   * - 'actividadEconomica': Establece el valor a 'SIMa gsys'.
   * - 'correoElectronico': Establece el valor a 'SV US'.
   * 
   * @returns {void}
   */
  public establecerValoresDeFormulario(): void {
    this.solicitudForm.get('rfc')?.setValue('AALM87326');
    this.solicitudForm.get('denominacion')?.setValue('SVHGSA ASCV 332');
    this.solicitudForm.get('actividadEconomica')?.setValue('SIMa gsys');
    this.solicitudForm.get('correoElectronico')?.setValue('SV US');
  }


}
