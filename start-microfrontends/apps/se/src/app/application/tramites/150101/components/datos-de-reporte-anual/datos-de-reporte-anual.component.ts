import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, NotificacionesComponent, Pedimento, TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Notificacion } from '@ng-mf/data-access-user';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { Solicitud150101State } from '../../estados/solicitud150101.store';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { VENTAS_TOTALES_MENSAJES } from '../../enums/registro-solicitud-anual.enum';

/**
 * @component
 * @description Este componente es responsable de manejar los datos y el formulario del reporte anual.
 */
@Component({
  selector: 'app-datos-de-reporte-anual',
  templateUrl: './datos-de-reporte-anual.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NotificacionesComponent,
    ReactiveFormsModule,
    TituloComponent,
    NotificacionesComponent
  ],
  styleUrl: './datos-de-reporte-anual.component.scss',
})

/**
 * @class DatosDeReporteAnnualComponent
 * @implements {OnInit, OnDestroy}
 * @description Este componente maneja la lógica del formulario para capturar los datos del reporte anual.
 */
export class DatosDeReporteAnnualComponent implements OnInit, OnDestroy {
  /**
   * @description Formulario reactivo para capturar los datos del reporte anual.
   */
  formReporteAnnual!: FormGroup;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @description Estado actual de la solicitud, obtenido desde el store.
   */
  solicitud150101State: Solicitud150101State = {} as Solicitud150101State;

  /**
   * @description Subject para la gestión de las suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * @descripcion
   * Mensaje de alerta que se muestra al usuario.
   */
  mensajeDeAlerta: string = 'Las Ventas Totales deben ser mayores o iguales al Total de Exportaciones.';

  /**
 * @public
 * @property {Notificacion} nuevaNotificacion
 * @description Representa una nueva notificación que se utilizará en el componente.
 */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   *  Índice del pedimento marcado para eliminación.
   * */
  public elementoParaEliminar!: number;

  /**
   *  Arreglo que contiene los pedimentos registrados.
   */
  public pedimentos: Array<Pedimento> = [];

  /** 
   * @property {boolean} mostrarAlerta
   * @description Indica si se debe mostrar una alerta al cargar el componente.
   */
  public mostrarAlerta: boolean = false;

  /** 
   * @property {boolean} mostraTab
   * @description Indica si se debe mostrar la pestaña de datos de reporte anual.
   */
  public mostraTab: boolean = true;

  /**
   * @constructor
   * @param fb - Servicio para la construcción de formularios reactivos.
   * @param solicitud150101Store - Store que gestiona el estado del reporte.
   * @param solicitud150101Query - Query para seleccionar datos del estado del reporte.
   * @param solicitudService - Servicio para obtener y enviar datos relacionados con el reporte.
   * @param consultaioQuery - Query para gestionar el estado de la consulta.
   */
  constructor(
    public fb: FormBuilder,
    public solicitud150101Store: Solicitud150101Store,
    public solicitud150101Query: Solicitud150101Query,
    public solicitudService: SolicitudService,
    public consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.mostrarAlerta = seccionState.update;
          this.mostraTab = !seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.solicitud150101Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150101State) => {
          this.solicitud150101State = respuesta;
        })
      )
      .subscribe();

    this.inicializarFormulario();
  }

  /**
   * @lifecycle
   * @description Método del ciclo de vida de Angular llamado al inicializar el componente.
   * Si se debe mostrar una alerta, calcula el reporte anual.
   */
  ngOnInit(): void {
    if (this.mostrarAlerta) {
      this.calcularReporteAnnual();
    }
  }

  /**
   * @method inicializarFormulario
   * @description Inicializa el formulario reactivo con los valores actuales del estado de la solicitud.
   * Define los controles y sus validaciones para ventas totales, exportaciones, importaciones, saldo y porcentaje de exportación.
   * Algunos campos están deshabilitados según su naturaleza de solo lectura.
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.formReporteAnnual = this.fb.group({
      ventasTotales: [
        { value: this.solicitud150101State.ventasTotales, disabled: !this.mostraTab },
        [Validators.required, Validators.maxLength(16)],
      ],
      totalExportaciones: [
        {
          value: this.solicitud150101State.totalExportaciones,
          disabled: !this.mostraTab,
        },
        [Validators.required, Validators.maxLength(16)],
      ],
      totalImportaciones: [
        {
          value: this.solicitud150101State.totalImportaciones || 0,
          disabled: true,
        },
        [Validators.required, Validators.maxLength(16)],
      ],
      saldo: [
        { value: this.solicitud150101State.saldo, disabled: true },
        [Validators.maxLength(16)],
      ],
      porcentajeExportacion: [
        {
          value: this.solicitud150101State.porcentajeExportacion,
          disabled: true,
        },
        [Validators.maxLength(16)],
      ],
    });

this.solicitud150101Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150101State) => {
          this.solicitud150101State = respuesta;
          this.formReporteAnnual.patchValue({
            saldo: this.solicitud150101State.saldo,
            porcentajeExportacion: this.solicitud150101State.porcentajeExportacion,
            ventasTotales: this.solicitud150101State.ventasTotales,
            totalExportaciones: this.solicitud150101State.totalExportaciones,
            totalImportaciones: this.solicitud150101State.totalImportaciones,
          })
        })
      )
      .subscribe();
  }


  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según si está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilitan todos los campos.
   * Si no, se habilitan todos los campos.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    this.inicializarFormulario();
    if (this.formularioDeshabilitado) {
      this.formReporteAnnual.disable();
    } else {
      this.formReporteAnnual.enable();
      this.formReporteAnnual.get('totalImportaciones')?.disable();
      this.formReporteAnnual.get('saldo')?.disable();
      this.formReporteAnnual.get('porcentajeExportacion')?.disable();
    }
  }

  /**
   * @description Actualiza las ventas totales en el store y recalcula el reporte.
   * @param evento - Evento del input para capturar el valor introducido.
   */
  obtenerVentasTotales(evento: Event): void {
    const VENTAS_TOTALES_CONTROL = this.formReporteAnnual?.get('ventasTotales');
    if (VENTAS_TOTALES_CONTROL) {
      if (VENTAS_TOTALES_CONTROL?.invalid && VENTAS_TOTALES_CONTROL?.touched) {
        this.abrirModal(VENTAS_TOTALES_MENSAJES);
      }
    }
    const VALUE = (evento.target as HTMLInputElement).value;

    // Validar que sea un entero antes de procesar
    if (!this.validarEntero(evento, 'Ventas totales')) {
      return;
    }

    this.solicitud150101Store.actualizarVentasTotales(VALUE);
    this.calcularReporteAnnual();
    
    // Show notification that stays until user clicks accept
    this.mostrarNotificacion({
      tipoNotificacion: 'info',
      categoria: 'info',
      modo: 'action',
      titulo: 'Información',
      mensaje: 'Su mensaje de notificación aquí',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });

  this.verificarDiferenciaTotal();
  }

  /**
   * @description Verifica si el total de exportaciones es mayor que las ventas totales.
   * Si es así, muestra una notificación de alerta.
   * @returns {void}
   */
  diferenciaTotal(): void {
    const VENTAS_TOTALES = parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_EXPORTACIONES = parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;

    if (VENTAS_TOTALES < TOTAL_EXPORTACIONES) {
      this.mostrarNotificacion({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: this.mensajeDeAlerta,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    } else {
      this.nuevaNotificacion = null;
    }
  }

  /**
   * @description Nueva función que verifica la diferencia total sin sobrescribir notificaciones existentes
   * @returns {void}
   */
  private verificarDiferenciaTotal(): void {
    const VENTAS_TOTALES = parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_EXPORTACIONES = parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;

if (VENTAS_TOTALES < TOTAL_EXPORTACIONES && !this.nuevaNotificacion) {
      this.mostrarNotificacion({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: this.mensajeDeAlerta,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    }
   
  }

  /**
   * Abre el modal de confirmación para eliminar un pedimento.
   *
   * @param i Índice del elemento a eliminar. Valor predeterminado: 0.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.elementoParaEliminar = i;
  }

  /**
   * @description Actualiza el total de exportaciones en el store, calcula el saldo, y recalcula el reporte.
   * @param evento - Evento del input para capturar el valor introducido.
   */
  obtenerTotalExportaciones(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    this.solicitud150101Store.actualizarTotalExportaciones(VALUE);

    const VENTAS_TOTALES =
      parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_EXPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;
    const TOTAL: number = VENTAS_TOTALES - TOTAL_EXPORTACIONES;

    const TOTAL_VALUE = Number.isFinite(TOTAL) ? TOTAL : 0;
    this.solicitud150101Store.actualizarSaldo(TOTAL_VALUE);
    this.calcularReporteAnnual();
  }

  /**
   * @description Limita la longitud del valor del input a un máximo especificado.
   * @param event - Evento del input para capturar el valor introducido.
   * @param maxLength - Longitud máxima permitida para el valor del input.
   * @return {void}
   */
  limitarLongitud(event: Event, maxLength: number): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.value.length > maxLength) {
      INPUT.value = INPUT.value.slice(0, maxLength);
    }

    // Validar que sea un entero
    if (!this.validarEntero(event, 'Total exportaciones')) {
      return;
    }

    this.obtenerTotalExportaciones(event);
    this.diferenciaTotal();
  }

  /**
   * @description Actualiza el total de importaciones en el store y recalcula el reporte.
   * @param evento - Evento del input para capturar el valor introducido.
   */
  obtenerTotalImportaciones(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    this.solicitud150101Store.actualizarTotalImportaciones(parseFloat(VALUE));
    this.calcularReporteAnnual();
  }

  /**
   * @description Calcula y actualiza el saldo y porcentaje de exportación en el reporte anual.
   */
  calcularReporteAnnual(): void {
    const TOTAL_EXPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;
    const VENTAS_TOTALES =
      parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_IMPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalImportaciones')?.value) || 0;
    const TOTAL_PORCENTAJE: number =
      (TOTAL_EXPORTACIONES / VENTAS_TOTALES) * 100;
    const TOTAL_PORCENTAJE_VALUE = Number.isFinite(TOTAL_PORCENTAJE)
      ? TOTAL_PORCENTAJE
      : 0;

    this.solicitud150101Store.actualizarPorcentajeExportacion(
      TOTAL_PORCENTAJE_VALUE
    );
    const TOTAL_SALDO: number = TOTAL_EXPORTACIONES - TOTAL_IMPORTACIONES;
    this.solicitud150101Store.actualizarSaldo(TOTAL_SALDO);

    this.solicitud150101Store.actualizarSaldo(TOTAL_SALDO);
    this.solicitud150101Store.actualizarPorcentajeExportacion(TOTAL_PORCENTAJE_VALUE);
    this.formReporteAnnual.patchValue({
      saldo: TOTAL_SALDO,
      porcentajeExportacion: TOTAL_PORCENTAJE_VALUE
    }, { emitEvent: false });
  }

  /**
   * @method validarEntero
   * @description Valida que el valor ingresado sea un número entero
   * @param event - Evento del input para capturar el valor introducido
   * @param fieldName - Nombre del campo que se está validando
   * @returns {boolean} True si es válido, false si no
   */
  validarEntero(event: Event, fieldName: string): boolean {
    const INPUT = event.target as HTMLInputElement;
    const VALUE = INPUT.value.trim();

    // Si está vacío, permitir (será validado por required)
    if (!VALUE) {
      return true;
    }

    // Verificar si el valor es un número entero válido
    if (isNaN(Number(VALUE)) || !Number.isInteger(Number(VALUE)) || Number(VALUE) < 0) {
      // Mostrar notificación de error
      this.mostrarNotificacion({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: `${fieldName} deben ser mayores o iguales a cero`,
        cerrar: false,
        tiempoDeEspera: 7000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });

      // Establecer el valor a 0
      INPUT.value = '0';
      const CONTROL_NAME = this.getFormControlName(fieldName);
      if (CONTROL_NAME) {
        this.formReporteAnnual.get(CONTROL_NAME)?.setValue('0');
        this.formReporteAnnual.get(CONTROL_NAME)?.markAsTouched();
      }

      // Recalcular el reporte
      setTimeout(() => {
        this.calcularReporteAnnual();
      }, 100);

      return false;
    }

    return true;
  }

  /**
   * @method mostrarNotificacion
   * @description Muestra una notificación y la limpia después del tiempo especificado
   * @param notificacion - Objeto de notificación a mostrar
   */
  private mostrarNotificacion(notificacion: Notificacion): void {
    this.nuevaNotificacion = notificacion;

 if (notificacion.tiempoDeEspera) {
      setTimeout(() => {
        this.nuevaNotificacion = null;
      }, notificacion.tiempoDeEspera);
    }
  }

  /**
   * @method getFormControlName
   * @description Obtiene el nombre del control del formulario basado en el nombre del campo
   * @param fieldName - Nombre del campo
   * @returns {string} Nombre del control del formulario
   */
  private getFormControlName(fieldName: string): string {
    switch (fieldName) {
      case 'Ventas totales':
        return 'ventasTotales';
      case 'Total exportaciones':
        return 'totalExportaciones';
      default:
        return '';
    }
  }

  /**
   * @method cerrarNotificacion
   * @description Cierra la notificación actual
   * @returns {void}
   */
  cerrarNotificacion(): void {
    this.nuevaNotificacion = null;
  }

  /**
   * @lifecycle
   * @description Método del ciclo de vida de Angular llamado al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}