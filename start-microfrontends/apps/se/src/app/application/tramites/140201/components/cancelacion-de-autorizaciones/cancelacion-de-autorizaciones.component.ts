
import {CategoriaMensaje, NotificacionesComponent, TipoNotificacionEnum } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { map, takeUntil } from 'rxjs/operators';
import { CANCELACION_DE_AUTORIZACIONES } from '../../constantes/cancelacion-table.enum'
import { CancelacionDeAutorizaciones } from '../../models/cancelacions.model'
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { CancelacionesService } from '../../services/cancelaciones.service'
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * @description
 * Componente para la cancelación de autorizaciones 140201.
 * Este componente maneja el formulario y la lógica para la cancelación de autorizaciones.
 * 
 * @example
 * <app-cancelacion-de-autorizaciones></app-cancelacion-de-autorizaciones>
 */
@Component({
  selector: 'app-cancelacion-de-autorizaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './cancelacion-de-autorizaciones.component.html',
  styleUrl: './cancelacion-de-autorizaciones.component.scss',
})
export class CancelacionDeAutorizacionesComponent implements OnInit, OnDestroy {

  /**
   * Sujeto para manejar la destrucción de suscripciones y evitar fugas de memoria
  */
  private destroy$ = new Subject<void>();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Formulario reactivo para la cancelación de autorizaciones.
   */
  public cancelacionForm!: FormGroup;

  /**
   * Variable para alternar la visibilidad del contenido.
   */
  public mostrarContenido = false;

  /**
   * Observable para el RFC ingresado.
   */
  public rfcIngresado$ = this.cancelacionesQuery.rfcIngresado$;

  /**
   * Observable para el motivo de cancelación.
   */
  public motivoCancelacion$ = this.cancelacionesQuery.motivoCancelacion$;

  /**
   * Configuración de las columnas de la tabla.
   */
  public configuracionTabla: ConfiguracionColumna<CancelacionDeAutorizaciones>[] = CANCELACION_DE_AUTORIZACIONES;

  /**
   * Referencia al componente de selección de tabla.
   */
  public TablaSeleccion = TablaSeleccion;

  /**
   * Datos de cancelación de autorizaciones.
   */
  public cancelacionData: CancelacionDeAutorizaciones[] = [];

  /**
  * @ignore
  */
  constructor(private fb: FormBuilder,
    private cancelacionesService: CancelacionesService,
    private cancelacionesStore: CancelacionesStore,
    private cancelacionesQuery: CancelacionesQuery,
    private consultaioQuery: ConsultaioQuery
  ) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()

  }

  /**
   * Inicializa el componente.
   * Configura el formulario y obtiene los datos necesarios.
   */
  ngOnInit(): void {
    this.cancelacionForm = this.fb.group({
      rfcIngresado: ['', [Validators.required, Validators.maxLength(13)]],
      motivoCancelacion: ['', [Validators.required, Validators.maxLength(255)]],
    });

    this.getCancelacioneServiceData();
    this.inicializarEstadoFormulario();
  }

  /**
  * Evalúa si se debe inicializar o cargar datos en el formulario.  
  * Además, obtiene la información del catálogo de mercancía.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.actualizarEstado();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.actualizarEstado();
    if (this.cancelacionForm && this.esFormularioSoloLectura) {
      this.cancelacionForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.cancelacionForm.enable();
    }
  }

  /**
   * Actualiza el estado del formulario con los datos observables.
   */
  actualizarEstado(): void {
    this.rfcIngresado$.pipe(takeUntil(this.destroy$)).subscribe((rfcIngresado) => {
      if (rfcIngresado) {
        this.cancelacionForm?.get('rfcIngresado')?.setValue(rfcIngresado);
      }
    });

    this.motivoCancelacion$.pipe(takeUntil(this.destroy$)).subscribe((motivoCancelacion) => {
      if (motivoCancelacion) {
        this.cancelacionForm?.get('motivoCancelacion')?.setValue(motivoCancelacion);
      }
    });
  }

  /**
   * Actualiza el RFC ingresado en el almacén.
   */
  updateRfcIngresado(): void {
    const RFCINGRESADO = this.cancelacionForm?.get('rfcIngresado')?.value;
    this.cancelacionesStore.setRfcIngresado(RFCINGRESADO);
  }

  /**
   * Actualiza el motivo de cancelación en el almacén.
   */
  updateMotivoCancelacion(): void {
    const MOTIVOCANCELACION = this.cancelacionForm?.get('motivoCancelacion')?.value;
    this.cancelacionesStore.setMotivoCancelacion(MOTIVOCANCELACION);
  }

  /**
   * Alterna la visibilidad del contenido.
   */
  alternarContenido(): void {
    this.mostrarContenido = !this.mostrarContenido;
  }

  /**
   * Obtiene los datos de cancelación de autorizaciones del servicio.
   */
  getCancelacioneServiceData(): void {
    this.cancelacionesService
      .getCancelacionDeAutorizaciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: CancelacionDeAutorizaciones[]) => {
        this.cancelacionData = resp;
      });
  }

  /**
   * Destruye las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Estado de carga para la búsqueda de programas
   */
  public isLoadingBusquedaProgramas: boolean = false;

  /**
   * Notificación para mostrar mensajes en el modal
   */
  public nuevaNotificacion: null | {
    tipoNotificacion: TipoNotificacionEnum;
    categoria: CategoriaMensaje;
    modo: string;
    titulo: string;
    mensaje: string;
    cerrar: boolean;
    tiempoDeEspera: number;
    txtBtnAceptar: string;
    txtBtnCancelar: string;
  } = null;

  /**
   * Lógica para buscar programas, solo muestra popup si RFC es muy corto
   */
  buscarProgramas(): void {
    this.nuevaNotificacion = null;
    const RFC_VALUE = this.cancelacionForm.get('rfcIngresado')?.value;
    if (!RFC_VALUE || RFC_VALUE.length < 12) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'La empresa no cuenta con un programa en situacien Activo o Suspendido por Reporte Anual.',
        cerrar: true,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
}