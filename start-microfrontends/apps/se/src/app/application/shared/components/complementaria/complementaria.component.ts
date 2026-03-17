import {
  CONFIGURACION_PLANTAS,
  CONFIGURACION_SERVICIOS_IMMEX,
  CONFIGURACION_SOCIOS,
} from '../../constantes/complementaria.enum';
import {
  Complimentaria,
  Empresas,
  Plantas,
  ServiciosImmex,
} from '../../models/complementaria.model';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import { Component, Input, OnChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Componente que muestra la información complementaria relacionada con un trámite,
 * incluyendo socios, fedatarios, operaciones, empresas, plantas y servicios IMMEX.
 */
@Component({
  selector: 'app-complementaria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './complementaria.component.html',
  styleUrl: './complementaria.component.scss',
})
export class ComplementariaComponent<T> implements OnChanges {
  /**
   * Número de procedimiento del trámite.
   * @property {number} procedimiento
   */
  @Input() procedimiento!: number;

  /**
   * Configuración de los socios.
   * @property {ConfiguracionColumna<Complimentaria>[]} configuracionSocios
   */
  configuracionSocios: ConfiguracionColumna<Complimentaria>[] =
    CONFIGURACION_SOCIOS;

  /**
   * Configuración de los federetarios.
   * @property {ConfiguracionColumna<T>[]} configuracionFederetios
   */
  @Input() configuracionFederetios: ConfiguracionColumna<T>[] = [];

  /**
   * Configuración de las operaciones.
   * @property {ConfiguracionColumna<T>[]} configuracionOperacion
   */
  @Input() configuracionOperacion: ConfiguracionColumna<T>[] = [];

  /**
   * Configuración de las empresas.
   * @property {ConfiguracionColumna<Empresas>[]} configuracionEmpresas
   */
  @Input() configuracionEmpresas: ConfiguracionColumna<Empresas>[] = [];

  /**
   * Configuración de las plantas.
   * @property {ConfiguracionColumna<Plantas>[]} configuracionPlanta
   */
  @Input() configuracionPlanta: ConfiguracionColumna<Plantas>[] = this.procedimiento === 80303 ? [] : CONFIGURACION_PLANTAS;

  /**
   * Configuración de los servicios IMMEX.
   * @property {ConfiguracionColumna<ServiciosImmex>[]} configuracionServiciosImmex
   */
  configuracionServiciosImmex: ConfiguracionColumna<ServiciosImmex>[] =
    CONFIGURACION_SERVICIOS_IMMEX;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * @type {T[]}
   */
  @Input() datosFederetarios: T[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {T[]}
   */
  @Input() datosOperacions: T[] = [];

  /**
   * Datos de la complimentaria obtenidos desde el servicio.
   * @type {Complimentaria[]}
   */
  @Input() datosSocios: Complimentaria[] = [];

  /**
   * Datos de las empresas obtenidos desde el servicio.
   * @type {Empresas[]}
   */
  @Input() datosEmpresas: Empresas[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Plantas[]}
   */
  @Input() datosPlanta: Plantas[] = [];

  /**
   * Arreglo que contiene los datos de modificación relacionados con los servicios.
   *
   * @type {ServiciosImmex[]}
   */
  @Input() datosServiciosImmex: ServiciosImmex[] = [];

  /**
   * Formulario reactivo para la certificación.
   * @type {FormGroup}
   */
  certificacionForm!: FormGroup;

  /**
   * Certificación SAT proporcionada como entrada al componente.
   */
  @Input() certificacionSAT: string = '';

  /**
   * Tipo de programa IMMEX.
   */
  @Input() tipoPrograma: string = '';

  /**
   * Constante que define los tipos de programa IMMEX.
   */
  TIPO_PROGRAMA = {
    IMMEX_SERVICIOS: 'Immex servicios',
    IMMEX_INDUSTRIAL: 'Immex industrial'
  }

  /**
   * Constructor de la clase.
   * Inicializa el formulario reactivo `certificacionForm` con el valor "Si" y deshabilitado.
   * @param {FormBuilder} fb - Instancia de `FormBuilder` utilizada para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    this.certificacionForm = this.fb.group({
      certificacion: [{ value: '', disabled: true }], // El campo de certificación con valor "Si" y deshabilitado.
    });
  }
  
  /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza el valor del campo `certificacion` en el formulario reactivo `certificionForm`
   * con el valor de la propiedad de entrada `certificacionSAT`.
   */
  ngOnChanges(): void{
    if (this.certificacionSAT) {
      this.certificacionForm.patchValue({
        certificacion: this.certificacionSAT,
      });
    }
  }
}