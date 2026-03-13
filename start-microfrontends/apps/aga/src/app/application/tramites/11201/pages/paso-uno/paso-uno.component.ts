import { AfterViewInit, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Notificacion, NotificacionesComponent, SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContenedorComponent } from '../../components/contenedor/contenedor.component';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite11201Store } from '../../../../core/estados/tramites/tramite11201.store';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    SolicitanteComponent,
    CommonModule,
    ContenedorComponent,
    NotificacionesComponent
  ]
})
export class PasoUnoComponent implements AfterViewInit, OnDestroy, OnInit {
  /**
    * Referencia al componente `SolicitanteComponent`.
    * 
    * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente `SolicitanteComponent`.
    */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * 
   * @type {Notificacion}
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Tipo de persona.
   * 
   * Esta propiedad almacena el tipo de persona como un número.
   */
  tipoPersona!: number;

  /**
   * Índice del paso actual en el wizard.
   * 
   * Esta propiedad indica el índice del paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Evento de continuar.
   * 
   * Esta propiedad utiliza `@Output` para emitir un evento `continuarEvento` con una cadena como valor.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Evento de continuar.
   * 
   * Esta propiedad utiliza `@Output` para emitir un evento `cancelarEvento` con una cadena como valor.
   */
  @Output() cancelarEvento = new EventEmitter<string>();

  /**
   * Indicador de validación.
   * 
   * Esta propiedad indica si la validación es verdadera o falsa.
   */
  validacion: boolean = false;

  /**
   * Datos del número de pedimento.
   * 
   * Esta propiedad utiliza `@Input` para recibir datos del número de pedimento de tipo desconocido.
   */
  @Input() datosNroPedimento!: unknown;
  /**
   * Mensaje de campos obligatorios.
   */
  mensajeCamposObligatorios: string = '* Campos obligatorios';
  /**
   * @property {ContenedorComponent} contenedorComponent
   * @description Referencia al componente `ContenedorComponent`.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente `ContenedorComponent`.
   * Permite acceder a los métodos y propiedades del componente hijo desde el componente padre.
   */
  @ViewChild(ContenedorComponent) contenedorComponent!: ContenedorComponent;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  /**
   * Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Constructor del componente PasoUnoComponent.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del componente:
   * - DatosTramiteService para obtener datos del trámite
   * - ConsultaioQuery para consultar el estado de la consulta
   * - Tramite11201Store para gestionar el estado del trámite
   * 
   * @param {DatosTramiteService} datosTramiteService - Servicio para obtener datos del trámite
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de consulta
   * @param {Tramite11201Store} tramite11201Store - Store para gestionar el estado del trámite
   */
  constructor(private datosTramiteService: DatosTramiteService,
    private consultaioQuery: ConsultaioQuery,
    public tramite11201Store: Tramite11201Store,
  ) {

  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Suscribe a los cambios del estado de consulta y, si hay una actualización pendiente,
   * obtiene los datos de consulta del servicio para actualizar el estado del componente.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    }
  }
  /**
  * Gancho de ciclo de vida angular que se llama después de que la vista del componente se haya inicializado por completo.
  */
  ngAfterViewInit(): void {
    this.obtenerTipoPersona();
  }
  /**
   * Selecciona una pestaña.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.obtenerTipoPersona();
  }

  /**
 * Método para emitir un evento de continuar.
 * 
 * Este método emite un evento `continuarEvento` con una cadena vacía como valor.
 * Se utiliza para indicar que se debe continuar al siguiente paso en el proceso.
 * 
 * @example
 * // Llamar al método para emitir el evento de continuar
 * this.continuar();
 */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Cancela el proceso actual y notifica a la página principal.
   * 
   * Este método muestra un popup de confirmación antes de cancelar.
   * Si el usuario confirma, restablece el índice a la primera pestaña
   * y emite el evento `cancelarEvento` para informar al componente padre
   * que el usuario ha decidido cancelar la operación.
   */
  cancelar(): void {
    this.abrirModal();
  }

  /**
   * Abre el modal de confirmación para cancelar la operación.
   * 
   * Este método configura una notificación de tipo alerta que pregunta al usuario
   * si está seguro de cancelar la operación, advirtiendo que se borrarán los datos capturados.
   * 
   * @returns {void}
   */
  abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: 'Cancelar',
      mensaje: '¿Está seguro que desea cancelar?. Se borrarán los datos capturados.',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Cancelar',
      txtBtnCancelar: 'Cerrar',
    };
  }

  /**
   * Maneja la confirmación del modal de cancelación.
   * 
   * Si el usuario confirma la cancelación:
   * - Restablece los formularios del solicitante
   * - Limpia el store del trámite
   * - Reinicia el formulario del contenedor
   * - Navega al paso 2
   * - Emite el evento de cancelación
   * 
   * @param {boolean} confirmar - Indica si el usuario confirmó la cancelación.
   * @returns {void}
   */
  confirmarCancelacion(confirmar: boolean): void {
    if (confirmar) {
      if (this.solicitante) {
        try {
          const SOLICITANTE_WITH_FORM = this.solicitante as unknown as { form?: { reset: () => void } };
          if (SOLICITANTE_WITH_FORM.form) {
            SOLICITANTE_WITH_FORM.form.reset();
          }
          const SOLICITANTE_WITH_SOLICITUD_FORM = this.solicitante as unknown as { solicitudForm?: { reset: () => void } };
          if (SOLICITANTE_WITH_SOLICITUD_FORM.solicitudForm) {
            SOLICITANTE_WITH_SOLICITUD_FORM.solicitudForm.reset();
          }
        } catch (error) {
            // Manejar el error de forma silenciosa en producción
        }
      }

      // Limpiar el store del trámite primero
      this.tramite11201Store.limpiarSolicitud();

      // Reiniciar el formulario de ContenedorComponent y limpiar sus campos
      if (this.contenedorComponent) {
        this.contenedorComponent.solicitudForm.reset();
        this.contenedorComponent.limpiarCampos();
        // Limpiar los datos de la tabla y del contenedor
        this.contenedorComponent.datosTabla = [];
        this.contenedorComponent.datosDelContenedor = [];
      }

      this.indice = 2;
      this.cancelarEvento.emit();
      this.obtenerTipoPersona();
    }
    // Si no confirma (cerrar), simplemente se cierra el modal y permanece en la misma página
    this.nuevaNotificacion = null;
  }
  /**
   * @method fetchGetDatosConsulta
   * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `Tramite11201Store`.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * 
   * @returns {void}
   */
  public fetchGetDatosConsulta(): void {
    this.datosTramiteService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite11201Store.setTipoBusqueda(respuesta.datos.tipoBusqueda);
          this.tramite11201Store.setAduana(respuesta.datos.aduana);
          this.tramite11201Store.setFechaIngreso(respuesta.datos.fechaIngreso);
          this.tramite11201Store.setInicialesContenedor(respuesta.datos.inicialesContenedor);
          this.tramite11201Store.setNumeroContenedor(respuesta.datos.numeroContenedor);
          this.tramite11201Store.setDigitoDeControl(respuesta.datos.digitoDeControl);
          this.tramite11201Store.setContenedores(respuesta.datos.contenedores);
          this.tramite11201Store.setFechaDeIngreso(respuesta.datos.fechaDeIngreso);
          this.tramite11201Store.setAduanaMenuDesplegable(respuesta.datos.aduanaMenuDesplegable);
          this.tramite11201Store.setMenuDesplegable(respuesta.datos.menuDesplegable);
          this.tramite11201Store.setNumeroManifiesta(respuesta.datos.numeroManifiesta);
          this.tramite11201Store.setDelContenedor(respuesta.datos.datosDelContenedor);
        }
      });
  }
  /**
  * @method ngOnDestroy
  * @description Método del ciclo de vida que se ejecuta al destruir el componente.
  * 
  * Este método emite un valor en el `destroyNotifier$` para notificar la destrucción del componente y completa el `Subject` para liberar recursos y evitar fugas de memoria.
  * 
  * @returns {void}
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * @method obtenerTipoPersona
   * @description Obtiene el tipo de persona y lo establece en el componente `SolicitanteComponent`.
   * 
   * Este método utiliza un `setTimeout` para ejecutar la función `obtenerTipoPersona` del componente `SolicitanteComponent` con el valor `TIPO_PERSONA.MORAL_NACIONAL`.
   * 
   * @returns {void}
   */
  obtenerTipoPersona(): void {
    setTimeout(() => {
      if (this.solicitante) {
        this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
      }
    }, 50);
  }
}
