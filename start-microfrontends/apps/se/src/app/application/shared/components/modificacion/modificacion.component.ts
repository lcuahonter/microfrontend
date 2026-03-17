import {
  CONFIGURACION_DOMICILIO,
  CONFIGURACION_EXPORTACION,
  CONFIGURACION_IMPORTACION,
  EMPRESA_SUBMANUFACTURERA_ENCABEZADO_DE_TABLA,
} from '../../constantes/modificacion.enum';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  DatosDelDomicilio,
  EmpresaSubmanufacturera,
  ExportacionImportacionDatos,
  Modificacion,
} from '../../models/modificacion.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Componente que maneja la eliminación y modificación de datos relacionados con un trámite.
 * Proporciona una interfaz para visualizar y editar información como domicilios,
 * servicios de exportación e importación, y empresas submanufactureras.
 */
@Component({
  selector: 'app-eliminacion-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './modificacion.component.html',
  styleUrls: ['./modificacion.component.scss'],
})
export class EliminacionModificacionComponent<T> implements OnChanges, OnInit {
  /**
   * Grupo de formulario para el formulario de solicitud.
   * @property {FormGroup} modificacionForm
   */
  modificacionForm!: FormGroup;

  /**
   * Datos relacionados con la modificación del trámite.
   * @property {Modificacion} datosModificacion
   */
  @Input() datosModificacion: Modificacion | undefined;

  /**
   * Número de procedimiento del trámite.
   * @property {number} procedimiento
   */
  @Input() procedimiento!: number;

  /**
   * Enumeración para la selección de tablas.
   * @property {typeof TablaSeleccion} TablaSeleccion
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de la tabla para los datos de exportación.
   * @property {ConfiguracionColumna<ExportacionImportacionDatos>[]} exportacionTablaConfiguracion
   */
  exportacionTablaConfiguracion: ConfiguracionColumna<ExportacionImportacionDatos>[] =
    CONFIGURACION_EXPORTACION;

  /**
   * Configuración de la tabla para los datos de importación.
   * @property {ConfiguracionColumna<ExportacionImportacionDatos>[]} importacionTablaConfiguracion
   */
  importacionTablaConfiguracion: ConfiguracionColumna<ExportacionImportacionDatos>[] =
    CONFIGURACION_IMPORTACION;

  /**
   * Configuración de la tabla para los datos de domicilios.
   * @property {ConfiguracionColumna<DatosDelDomicilio>[]} domiciliosTablaConfiguracion
   */
  domiciliosTablaConfiguracion: ConfiguracionColumna<DatosDelDomicilio>[] =
    CONFIGURACION_DOMICILIO;

  /**
   * Configuración de la tabla para las empresas submanufactureras.
   * @property {ConfiguracionColumna<EmpresaSubmanufacturera>[]} submanufacturerasTablaConfiguracion
   */
  submanufacturerasTablaConfiguracion: ConfiguracionColumna<EmpresaSubmanufacturera>[] =
    EMPRESA_SUBMANUFACTURERA_ENCABEZADO_DE_TABLA;

  /**
   * Arreglo que almacena datos de exportación para la tabla dinámica.
   *
   * Este arreglo se utiliza para gestionar y mostrar información
   * relacionada con los servicios de exportación en la tabla de datos.
   * @property {ExportacionImportacionDatos[]} exportacionImportacionDatos
   */
  @Input() exportacionDatosTabla: ExportacionImportacionDatos[] = [];

  /**
   * Arreglo que almacena datos de importación para la tabla dinámica.
   *
   * Este arreglo se utiliza para gestionar y mostrar información
   * relacionada con los servicios de importación en la tabla de datos.
   * @property {ExportacionImportacionDatos[]} importacionDatosTabla
   */
  @Input() importacionDatosTabla: ExportacionImportacionDatos[] = [];

  /**
   * Arreglo que almacena datos de domicilios para la tabla dinámica.
   *
   * Este arreglo se utiliza para gestionar y mostrar información
   * relacionada con los domicilios en la tabla de datos.
   * @property {DatosDelDomicilio[]} domiciliosDatosTabla
   */
  @Input() domiciliosDatosTabla: DatosDelDomicilio[] = [];

  /*
   * Arreglo que almacena datos de empresas submanufactureras.
   *
   * Este arreglo se utiliza para gestionar y mostrar información
   * relacionada con las empresas submanufactureras en la tabla de datos.
   */
  @Input() submanufacturerasTablaDatos: EmpresaSubmanufacturera[] = [];

  /**
   * Indica si el formulario está en modo de solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * @property {boolean} soloLectura
   */
  @Input() soloLectura: boolean = false;

  /**
   * Evento que se emite cuando se alterna un valor en la tabla.
   * Proporciona información sobre la fila y la columna afectadas.
   * @property {EventEmitter<{ row: unknown; column: string }>} valorDeAlternancia
   */
  @Output() valorDeAlternancia: EventEmitter<{
    row: unknown;
    column: string;
  }> = new EventEmitter<{ row: unknown; column: string }>();

  /**
   * Evento que se emite cuando se alterna un valor en la tabla de exportación.
   * @property {EventEmitter<{ row: unknown; column: string }>} exportacionValorDeAlternancia
   * @description Emite un objeto que contiene la fila y la columna afectadas.
   */
  @Output() exportacionValorDeAlternancia: EventEmitter<{
    row: unknown;
    column: string;
  }> = new EventEmitter<{ row: unknown; column: string }>();

  /**
   * Evento que se emite cuando se alterna un valor en la tabla de importación.
   * @property {EventEmitter<{ row: unknown; column: string }>} importacionValorDeAlternancia
   * @description Emite un objeto que contiene la fila y la columna afectadas.
   */
  @Output() importacionValorDeAlternancia: EventEmitter<{
    row: unknown;
    column: string;
  }> = new EventEmitter<{ row: unknown; column: string }>();

  /**
   * Constructor para la clase ModificacionComponent.
   * @param fb - FormBuilder para crear el grupo de formulario.
   */
  constructor(private fb: FormBuilder) {
    this.modificacionForm = this.fb.group({
      rfc: [{ value: '', disabled: true }],
      representacionFederal: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      programa: [{ value: '', disabled: true }],
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura los valores iniciales del formulario si los datos de modificación están disponibles.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.datosModificacion) {
      this.actualizarValoresFormulario();
    }
  }

  /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza los valores del formulario si los datos de modificación cambian.
   * @method ngOnChanges
   * @param {SimpleChanges} changes - Cambios detectados en las propiedades de entrada.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['datosModificacion'] &&
      this.datosModificacion &&
      this.modificacionForm
    ) {
      this.actualizarValoresFormulario();
    }
  }

  /**
   * Actualiza los valores del formulario con los datos de modificación proporcionados.
   * @method actualizarValoresFormulario
   * @returns {void}
   */
  actualizarValoresFormulario(): void {
    this.modificacionForm.patchValue({
      rfc: this.datosModificacion?.rfc || '',
      representacionFederal: this.datosModificacion?.representacionFederal || '',
      tipo: this.datosModificacion?.tipo || '',
      programa: this.datosModificacion?.programa || '',
    });
  }

  /**
   * Maneja el evento de alternancia de valor en la tabla.
   * Emite el evento `valorDeAlternancia` con la información de la fila y columna afectadas.
   * @method onAlternarValor
   * @param {{ row: unknown; column: string }} event - Evento que contiene la fila y columna.
   * @returns {void}
   */
  onAlternarValor(event: { row: unknown; column: string }): void {
    this.valorDeAlternancia.emit(event);
  }

  /**
  * Maneja el evento de alternancia de valor en la tabla de exportación.
  * Emite el evento `exportacionValorDeAlternancia` con la fila y columna afectadas.
  *
  * @param {Object} event - Objeto que contiene la fila y columna afectadas.
  * @param {unknown} event.row - La fila afectada.
  * @param {string} event.column - La columna afectada.
  * @returns {void}
  */
  onAlternarExportacionValor(event: { row: unknown; column: string }): void {
    this.exportacionValorDeAlternancia.emit(event);
  }

  /**  
   * Maneja el evento de alternancia de valor en la tabla de importación.
   * Emite el evento `importacionValorDeAlternancia` con la fila y columna afectadas.
   *
   * @param {Object} event - Objeto que contiene la fila y columna afectadas.
   * @param {unknown} event.row - La fila afectada.
   * @param {string} event.column - La columna afectada.
   * @returns {void}
   */
  onAlternarImportacionValor(event: { row: unknown; column: string }): void {
    this.importacionValorDeAlternancia.emit(event);
  } 
}