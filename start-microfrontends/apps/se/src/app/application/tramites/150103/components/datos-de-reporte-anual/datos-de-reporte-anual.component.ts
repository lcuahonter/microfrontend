import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, NotificacionesComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { Notificacion } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';
import { Solicitud150103State } from '../../estados/solicitud150103.store';
import { Solicitud150103Store } from '../../estados/solicitud150103.store';

/**
 * Componente para gestionar los datos del reporte anual.
 */
@Component({
  selector: 'app-datos-de-reporte-anual',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './datos-de-reporte-anual.component.html',
  styleUrl: './datos-de-reporte-anual.component.scss',
})
export class DatosDeReporteAnualComponent implements OnInit, OnDestroy {
  /**
   * Estado de la solicitud 150103.
   */
  solicitud150103State: Solicitud150103State = {} as Solicitud150103State;

  /**
   * Formulario reactivo para el reporte anual.
   */
  formReporteAnnual!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
  
/**
 * @property {ConsultaioState} consultaDatos
 * @description Estado que contiene información de consulta, utilizado para determinar si el formulario debe estar en modo de solo lectura.
 */
consultaDatos!: ConsultaioState;

  /**
   * @descripcion
   * Mensaje de alerta que se muestra al usuario.
   */
  public mensajeDeAlerta: string = 'Las Ventas Totales deben ser mayores o iguales al Total de Exportaciones.';

  /**
   * Objeto que representa una nueva notificación a mostrar al usuario.
   * Puede incluir información como el tipo, mensaje, duración, etc.
   */
  public nuevaNotificacion: Notificacion | null = null;
  
  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param solicitud150103Store - Store para gestionar el estado de la solicitud.
   * @param solicitud150103Query - Query para obtener datos de la solicitud.
   */
  constructor(
    public fb: FormBuilder,
    private solicitud150103Store: Solicitud150103Store,
    private solicitud150103Query: Solicitud150103Query,
     private consultaioQuery: ConsultaioQuery,
    public informaAnualPrograma: InformeAnualProgramaService,
     
  ) {}

  /**
   * Método de inicialización del componente.
   * Configura el formulario y suscribe a los cambios en el estado de la solicitud.
   */
  ngOnInit(): void {
    this.formReporteAnnual = this.fb.group({
      ventasTotales: [
        { value: this.solicitud150103State.ventasTotales, disabled: false },
        this.esFormularioSoloLectura ? [] : [Validators.required, Validators.maxLength(16)],
      ],
      totalExportaciones: [
        {
          value: this.solicitud150103State.totalExportaciones,
          disabled: false,
        },
        this.esFormularioSoloLectura ? [] : [Validators.required, Validators.maxLength(16)],
      ],
      totalImportaciones: [
        {
          value: this.solicitud150103State.totalImportaciones,
          disabled: true,
        },
        this.esFormularioSoloLectura ? [] : [Validators.maxLength(16)],
      ],
      saldo: [{ value: this.solicitud150103State.saldo, disabled: true }],
      porcentajeExportacion: [
        {
          value: this.solicitud150103State.porcentajeExportacion,
          disabled: true,
        },
      ],
    });
    this.solicitud150103Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150103State) => {
          this.solicitud150103State = respuesta;
          this.formReporteAnnual.patchValue({
            ventasTotales: this.solicitud150103State.ventasTotales,
            totalExportaciones: this.solicitud150103State.totalExportaciones,
            totalImportaciones: this.solicitud150103State.totalImportaciones,
            saldo: this.solicitud150103State.saldo,
            porcentajeExportacion:
              this.solicitud150103State.porcentajeExportacion,
          });
          
          // Habilitar campos específicos cuando se selecciona un programa
          if (this.solicitud150103State.folioPrograma) {
            this.habilitarCamposEspecificos();
          }
        })
      )
      .subscribe();
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      this.inicializarEstadoFormulario();
  }

  /**
   * Calcula los valores del reporte anual, incluyendo porcentaje de exportación y saldo.
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
      ? TOTAL_PORCENTAJE.toString()
      : '0';
    
    this.solicitud150103Store.actualizarPorcentajeExportacion(TOTAL_PORCENTAJE_VALUE);
    
    const TOTAL_SALDO: number = TOTAL_EXPORTACIONES - TOTAL_IMPORTACIONES;
    this.solicitud150103Store.actualizarSaldo(TOTAL_SALDO.toString());

    this.formReporteAnnual.patchValue({
      saldo: TOTAL_SALDO.toString(),
      porcentajeExportacion: TOTAL_PORCENTAJE_VALUE
    }, { emitEvent: false });
  }

  /**
   * Actualiza el valor de las exportaciones totales y recalcula el reporte anual.
   * @param evento - Evento del input que contiene el valor de exportaciones.
   */
  obtenerTotalExportaciones(evento: Event): void {
    // Validar que sea un entero antes de procesar
    if (!this.validarEntero(evento, 'Total exportaciones')) {
      return;
    }

    const VALUE = (evento.target as HTMLInputElement).value;
    this.solicitud150103Store.actualizarTotalExportaciones(VALUE);

    const VENTAS_TOTALES =
      parseFloat(this.formReporteAnnual.get('ventasTotales')?.value) || 0;
    const TOTAL_EXPORTACIONES =
      parseFloat(this.formReporteAnnual.get('totalExportaciones')?.value) || 0;
    const TOTAL: number = VENTAS_TOTALES - TOTAL_EXPORTACIONES;

    const TOTAL_VALUE = Number.isFinite(TOTAL) ? TOTAL : 0;
    this.solicitud150103Store.actualizarSaldo(TOTAL_VALUE.toString());
    this.calcularReporteAnnual();
    this.diferenciaTotal();
  }

  /**
   * Actualiza el valor de las ventas totales y recalcula el reporte anual.
   * @param evento - Evento del input que contiene el valor de ventas.
   */
  obtenerVentasTotales(evento: Event): void {
    // Validar que sea un entero antes de procesar
    if (!this.validarEntero(evento, 'Ventas totales')) {
      return;
    }

    const VALUE = (evento.target as HTMLInputElement).value;
    this.solicitud150103Store.actualizarVentasTotales(VALUE);
    this.calcularReporteAnnual();
    this.verificarDiferenciaTotal();
  }

  /**
   * Actualiza el valor de las importaciones totales y recalcula el reporte anual.
   * @param evento - Evento del input que contiene el valor de importaciones.
   */
  obtenerTotalImportaciones(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud150103Store.actualizarTotalImportaciones(VALOR);
    this.calcularReporteAnnual();
  }

  /**
   * Habilita los campos específicos de ventas totales y total exportaciones.
   * Este método se llama cuando se selecciona un programa de la tabla.
   */
  habilitarCamposEspecificos(): void {
    this.formReporteAnnual.get('ventasTotales')?.enable();
    this.formReporteAnnual.get('totalExportaciones')?.enable();
  }


  /**
 * @method inicializarEstadoFormulario
 * @description Método que verifica si el formulario debe estar en modo de solo lectura y, en caso afirmativo, desactiva todos los campos del formulario.
 */
inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formReporteAnnual?.disable();
    } else {
      this.formReporteAnnual.get('totalImportaciones')?.disable();
      this.formReporteAnnual.get('saldo')?.disable();
      this.formReporteAnnual.get('porcentajeExportacion')?.disable();
      
      if (this.solicitud150103State.folioPrograma) {
        this.habilitarCamposEspecificos();
      } else {
        this.formReporteAnnual.get('ventasTotales')?.disable();
        this.formReporteAnnual.get('totalExportaciones')?.disable();
      }
    }
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
   * Método que se ejecuta al destruir el componente.
   * Notifica a las suscripciones que deben finalizar y completa el Subject.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
