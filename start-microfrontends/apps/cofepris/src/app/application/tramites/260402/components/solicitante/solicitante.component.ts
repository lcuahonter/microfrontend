import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


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
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
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
      rfc: [{ value: '', disabled: true }],
      denominacion: [{ value: '', disabled: true }],
      actividadEconomica: [{ value: '', disabled: true }],
      correoElectronico: [{ value: '', disabled: true }],
      pais: [{ value: '', disabled: true }],
      codigoPostal: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      municipioAlcaldia: [{ value: '', disabled: true }],
      localidad: [{ value: '', disabled: true }],
      colonia: [{ value: '', disabled: true }],
      calle: [{ value: '', disabled: true }],
      numeroExterior: [{ value: '', disabled: true }],
      numeroInterior: [{ value: '', disabled: true }],
      lada: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }]
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
    this.solicitudForm.get('pais')?.setValue('ESTADOS UNIDOS MEXICANOS');
      this.solicitudForm.get('codigoPostal')?.setValue('81210');
      this.solicitudForm.get('estado')?.setValue('SINALOA');
      this.solicitudForm.get('municipioAlcaldia')?.setValue('AHOME');
      this.solicitudForm.get('localidad')?.setValue('LOS MOCHIS');
      this.solicitudForm.get('colonia')?.setValue('MIGUEL HIDALGO');
      this.solicitudForm.get('calle')?.setValue('CAMINO VIEJO');
      this.solicitudForm.get('numeroExterior')?.setValue('1353')
  }


}
