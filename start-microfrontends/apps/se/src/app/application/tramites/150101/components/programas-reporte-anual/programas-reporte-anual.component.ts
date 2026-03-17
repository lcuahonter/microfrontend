import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ConfiguracionColumna, ENVIRONMENT, NotificacionesComponent, TablaDinamicaComponent, TituloComponent, doDeepCopy, getValidDatos } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, LoginQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Notificacion } from '@ng-mf/data-access-user';
import { ProgramasReporte } from '../../models/programas-reporte.model';
import { ReporteFechas } from '../../models/programas-reporte.model';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { Solicitud150101State } from '../../estados/solicitud150101.store';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { Subject } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name ProgramasReporteAnnualComponent
 * @description
 * Este componente se utiliza para gestionar el reporte anual de programas.
 * Proporciona una interfaz para visualizar y seleccionar programas, así como para administrar las fechas del reporte anual.
 *
 * @selector app-programas-reporte-annual
 * @templateUrl ./programas-reporte-annual.component.html
 * @styleUrl ./programas-reporte-annual.component.scss
 *
 * @example
 * <app-programas-reporte-annual></app-programas-reporte-annual>
 *
 * @implements OnInit, OnDestroy
 */

import { ValidationErrors } from '@angular/forms';

/**
 * 
 * @param control 
 * @returns 
 */

function integerValidator(control: AbstractControl): ValidationErrors | null {
  const VALUE = control.value;
  if (VALUE === null || VALUE === '' || VALUE === undefined) {
    return null;
  }

  const NUMVALUE = Number(VALUE);
  if (isNaN(NUMVALUE) || !Number.isInteger(NUMVALUE) || NUMVALUE < 0) {
    return { 'notInteger': { value: control.value } };
  }

  return null;
}

@Component({
  selector: 'app-programas-reporte-anual',
  templateUrl: './programas-reporte-anual.component.html',
  styleUrl: './programas-reporte-anual.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    BsDatepickerModule,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
})
export class ProgramasReporteAnnualComponent implements OnDestroy {
  /** Formulario reactivo para administrar los datos del reporte anual */
  periodoReporteAnual!: FormGroup;
  /**
   * @description Configuración del componente `BsDatepicker`.
   * Permite establecer el formato de la fecha y restringir la selección a nivel de mes y año.
   *
   * @property {string} dateInputFormat - Define el formato de la fecha mostrada en el campo de entrada (MM/YYYY).
   * @property {string} minMode - Establece el modo mínimo de selección en el selector (mes).
   */
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM-YYYY', // Formato de entrada: mes-año
    minMode: 'month', // Solo permite seleccionar mes y año
  };

  /**
      * @public
      * @property {Notificacion} nuevaNotificacion
      * @description Representa una nueva notificación que se utilizará en el componente.
      * @command Este campo debe ser inicializado antes de su uso.
      */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description Evento que se emite al seleccionar una fila de la tabla.
   * Emite un valor booleano para indicar si la fila ha sido seleccionada.
   * @type {EventEmitter<boolean>}
   */
  @Output() filaDeInformeSeleccionada = new EventEmitter<boolean>();

  /**
   * @property {Solicitud150101State} solicitud150101State
   * @description Estado actual de la solicitud 150101.
   */
  solicitud150101State: Solicitud150101State = {} as Solicitud150101State;

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * @property {TablaSeleccion} solicitudSeleccionTabla
   * @description Configuración de selección de la tabla (RADIO, CHECKBOX, etc.).
   */
  solicitudSeleccionTabla = TablaSeleccion.RADIO;

  /**
   * @property {ProgramasReporte[]} solicitudDatos
   * @description Lista de datos de programas obtenidos para el reporte.
   */
  solicitudDatos: ProgramasReporte[] = [];

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;
  /** @property {boolean} mostrarAlerta
   * @description Indica si se debe mostrar una alerta al usuario.
   */
  public mostrarAlerta: boolean = false;

  /**
   * @property {ConfiguracionColumna<ProgramasReporte>[]} solicitudConfiguracionTabla
   * @description Configuración de las columnas de la tabla para mostrar los datos de programas.
   */
  solicitudConfiguracionTabla: ConfiguracionColumna<ProgramasReporte>[] = [
    {
      encabezado: 'Número/Registro de programa',
      clave: (item: ProgramasReporte) => item.folioPrograma,
      orden: 1,
    },
    {
      encabezado: 'Tipo programa',
      clave: (item: ProgramasReporte) => item.tipoPrograma,
      orden: 2,
    },
    {
      encabezado: 'Modalidad',
      clave: (item: ProgramasReporte) => item.modalidad,
      orden: 3,
    },
    {
      encabezado: 'Estatus',
      clave: (item: ProgramasReporte) => item.estatus,
      orden: 4,
    },
  ];

  // Valor de RFC de ejemplo
  private loginRfc: string = '';
  /**
   * @property {ProgramasReporte[]} solicitudDatosGuardados
   * @description Datos de programas guardados que se reciben como entrada en el componente.
   */
  private _solicitudDatosGuardados: ProgramasReporte[] = [];
  /**
   * @description Datos de programas guardados que se reciben como entrada en el componente.
   */
  @Input() set solicitudDatosGuardados(value: ProgramasReporte[]) {
    this._solicitudDatosGuardados = value;
    this.solicitudDatos = value; // Always update internal data
    // Optionally, re-initialize table or form here if needed
  }
  /** 
   * @description Obtiene los datos de programas guardados. 
   */
  get solicitudDatosGuardados(): ProgramasReporte[] {
    return this._solicitudDatosGuardados;
  }

  /**
   * @constructor
   * @param {FormBuilder} fb - Constructor para formularios reactivos.
   * @param {Solicitud150101Store} solicitud150101Store - Store para manejar el estado de la solicitud.
   * @param {Solicitud150101Query} solicitud150101Query - Query para seleccionar datos del estado.
   * @param {SolicitudService} solicitudService - Servicio para manejar solicitudes relacionadas.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones de formularios.
   * @param {ConsultaioQuery} consultaioQuery - Query para manejar el estado de la consulta.
   */
  constructor(
    public fb: FormBuilder,
    public solicitud150101Store: Solicitud150101Store,
    public solicitud150101Query: Solicitud150101Query,
    public solicitudService: SolicitudService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private loginQuery: LoginQuery,
  ) {
    this.inicializarFormulario();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.mostrarAlerta = seccionState.update;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();

    this.solicitud150101Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150101State) => {
          this.solicitud150101State = respuesta;
          if (this.periodoReporteAnual) {
            this.periodoReporteAnual.patchValue({
              reporteAnualFechaInicio: respuesta.reporteAnualFechaInicio,
              reporteAnualFechaFin: respuesta.reporteAnualFechaFin,
              folioPrograma: respuesta.folioPrograma,
              modalidad: respuesta.modalidad,
              tipoPrograma: respuesta.tipoPrograma,
              estatus: respuesta.estatus,
            });
          }
        })
      )
      .subscribe();

    if (this.solicitud150101Query.getValue().solicitudDato?.length) {
      this.solicitudDatos = this.solicitud150101Query.getValue().solicitudDato ?? [];
    } else {
      if(!this.mostrarAlerta) {
        this.obtenerProgramasReporte();
      }
    }
  }

  /**
   * @method inicializarFormulario
   * @description
   * Inicializa el formulario `periodoReporteAnual` con los valores actuales del estado de la solicitud.
   * Establece los valores iniciales y el estado habilitado/deshabilitado de los controles.
   * Este método debe llamarse al crear el componente o cuando se actualiza el estado de la solicitud.
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.periodoReporteAnual = this.fb.group({
      reporteAnualFechaInicio: [
        {
          value: this.solicitud150101State?.reporteAnualFechaInicio, disabled: true 
        },
      ],
      reporteAnualFechaFin: [
        {
          value: this.solicitud150101State?.reporteAnualFechaFin, disabled: true
        },
      ],
      folioPrograma: [
        { value: this.solicitud150101State?.folioPrograma, disabled: true },
      ],
      modalidad: [
        { value: this.solicitud150101State?.modalidad, disabled: true },
      ],
      tipoPrograma: [
        { value: this.solicitud150101State?.tipoPrograma, disabled: true },
      ],
      estatus: [{ value: this.solicitud150101State?.estatus, disabled: true }],
      // Add validation for numeric fields
      ventasTotales: ['', [Validators.required, integerValidator]],
      totalExportaciones: ['', [Validators.required, integerValidator]]
    });

    // Commented now for future validation use
    // Add value change listeners for validation
    // this.periodoReporteAnual.get('ventasTotales')?.valueChanges.subscribe(value => {
    //   this.validateIntegerField('ventasTotales', value, 'Ventas totales (a):');
    // });

    // Commented now for future validation use
    // this.periodoReporteAnual.get('totalExportaciones')?.valueChanges.subscribe(value => {
    //   this.validateIntegerField('totalExportaciones', value, 'Total exportaciones (b):');
    // });
  }

  /**
   * @method validateIntegerField
   * @description Validates if a field contains a valid integer value and shows notification if invalid
   * @param fieldName - Name of the form field
   * @param value - Value to validate
   * @param fieldLabel - Label to show in error message
   */
  validateIntegerField(fieldName: string, value: string | number | null | undefined, fieldLabel: string): void {
    const CONTROL = this.periodoReporteAnual.get(fieldName);

    if (value !== null && value !== '' && value !== undefined) {
      const NUMVALUE = Number(value);
      if (isNaN(NUMVALUE) || !Number.isInteger(NUMVALUE) || NUMVALUE < 0) {
        // Set field to 0 and show notification
        CONTROL?.setValue('0', { emitEvent: false });
        this.showValidationAlert(fieldLabel);
      }
    }
  }

  /**
   * @method showValidationAlert
   * @description Shows validation alert for invalid integer input
   * @param fieldName - Name of the field that failed validation
   */
  showValidationAlert(fieldName: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: 'Valor inválido',
      mensaje: `${fieldName} debe ser un número entero válido. El campo se ha establecido en 0.`,
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @method showAlert
   * @description Shows a general alert notification
   */
  showAlert(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'info',
      modo: 'action',
      titulo: '',
      mensaje: 'El Reporte Anual de el(los) programa(s) seleccionado(s) ha sido presentado anteriormente. Seleccionar otro programa para presentar Reporte Anual.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario `periodoReporteAnual` basado en si el formulario está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilita el campo `periodoReporteAnual`.
   * Si no está deshabilitado, se habilita el campo `periodoReporteAnual`.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.periodoReporteAnual.disable();
    }
  }

  /**
   * @method obtenerProgramasReporte
   * @description
   * Método para obtener la lista de programas de reporte anual desde el servicio.
   * Actualiza la propiedad `solicitudDatos` con los datos obtenidos.
   *
   * @returns {void}
   */
  obtenerProgramasReporte(): void {
    this.solicitudService
      .obtenerProgramasReporte(this.loginRfc)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta: Record<string, unknown>) => {
          const API_RESPONSE = doDeepCopy(respuesta);
          this.solicitud150101Store.setReporteAnualFechaInicio(this.formatDateToMonthYear(API_RESPONSE?.datos[0]?.fechaInicioVigencia));
          this.solicitud150101Store.setReporteAnualFechaFin(this.formatDateToMonthYear(API_RESPONSE?.datos[0]?.fechaFinVigencia));
          const DATOS = respuesta?.['datos'] as Array<unknown> | undefined;
          if (Array.isArray(DATOS) && DATOS.length) {
            const PROGRAMAS = DATOS.map((item) => {
              const PROGRAMA = item as ProgramasReporte;
              return {
                folioPrograma: PROGRAMA.folioPrograma ?? '',
                modalidad: PROGRAMA.modalidad ?? '',
                tipoPrograma: PROGRAMA.tipoPrograma ?? '',
                estatus: PROGRAMA.estatus ?? '',
                idProgramaCompuesto: PROGRAMA.idProgramaCompuesto ?? 0,
              };
            });
            this.solicitudDatos = PROGRAMAS;
            this.solicitud150101Store.setSolicitusDatos(this.solicitudDatos);
          } else {
            this.solicitudDatos = [];
          }
        },
        error: () => {
        this.solicitudDatos = [];
      },
      });
  }

  private formatDateToMonthYear(dateString: string): string {
    if(getValidDatos(dateString)) {
      const DATE = new Date(dateString);
      const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
      const YEAR = DATE.getFullYear();
      return `${MONTH}-${YEAR}`;
    }
    return '';
  }

  /**
   * Actualiza los datos del programa de reporte anual en el estado de la solicitud
   * y emite un evento si la fila de informe ha sido seleccionada.
   *
   * @param evento - Objeto de tipo `ProgramasReporte` que contiene la información
   * del programa a actualizar, incluyendo el folio, modalidad, tipo de programa y estatus.
   *
   * @remarks
   * Este método actualiza múltiples propiedades en el estado de la solicitud
   * utilizando los métodos del store `solicitud150101Store`. Además, verifica si
   * el evento es una instancia de un objeto y, en ese caso, emite un evento para
   * indicar que una fila de informe ha sido seleccionada.
   */
  actualizarProgramasReporte(evento: ProgramasReporte): void {
    this.solicitud150101Store.actualizarFolioPrograma(evento.folioPrograma);
    this.solicitud150101Store.actualizarModalidad(evento.modalidad);  
    this.solicitud150101Store.actualizarTipoPrograma(evento.tipoPrograma);  
    this.solicitud150101Store.actualizarEstatus(evento.estatus);
    this.solicitud150101Store.setIdProgramaCompuesto(evento.idProgramaCompuesto?.toString() ?? '');
    if (evento instanceof Object) {
      this.filaDeInformeSeleccionada.emit(true);
    }
    this.periodoReporteAnual.patchValue({
      folioPrograma: evento.folioPrograma,
      modalidad: evento.modalidad,
      tipoPrograma: evento.tipoPrograma,
      estatus: evento.estatus,
    });
  }

  /**
   * Este método se utiliza para validar la forma del transporte. - 220401
   * @param form: Forma del transporte
   * @param field: campo del formulario
   * @returns Validaciones del formulario
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud150101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud150101Store[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método que se ejecuta cuando el componente se destruye.
   * Se utiliza para completar el observable `destroyed$` y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
