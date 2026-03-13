/**
 * El `IntroPermisoComponent` es el componente principal para gestionar el formulario de desistimiento de permiso.
 * Este componente utiliza un asistente (wizard) para controlar la navegación entre los pasos del formulario y gestionar la información mostrada.
 * Este componente permite la navegación entre los pasos del formulario, muestra alertas según el estado del servicio y gestiona los datos
 * relacionados con el desistimiento de permiso.
 */

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';
import { DesistimientoDePermisoState, DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { ERROR_FORMA_ALERT, PASOS, TODOS_PASOS } from '../../constants/intropermiso.enum';
import { Observable, Subject, catchError, map, switchMap, take, takeUntil, throwError } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { ToastrService } from 'ngx-toastr';



/**
 * Interfaz para manejar las acciones de los botones del asistente.
 */
interface AccionBoton {
  /**
   * Acción del botón (e.g., "cont" para continuar, "atras" para retroceder).
   */
  accion: string;

  /**
   * Valor asociado a la acción (índice del paso).
   */
  valor: number;
}

@Component({
  selector: 'app-intro-permiso',
  templateUrl: './intro-permiso.component.html',
  styleUrl: './intro-permiso.component.scss',
})
export class IntroPermisoComponent implements OnInit, OnDestroy {
  /**
   * Array de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Notificador para gestionar la destrucción de observables.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Título del mensaje principal.
   */
  tituloMensaje: string | null = "Cancelación por solicitud de permisos";

  /**
   * Clase CSS para mensajes de alerta.
   */
  dangerClass = 'alert-danger';

  /**
   * Referencia al componente Wizard para controlar la navegación.
   */
  @ViewChild('wizardRef') wizardComponent!: WizardComponent;

  /**
   * Índice actual del paso.
   */
  indice: number = 1;

  /**
   * Configuración para los botones del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Mensaje de éxito para el primer paso.
   */
  mensajeDeTextoDeExito: string = "MENSAJE_DE_ÉXITO_ETAPA_UNO";

  /**
   * Controla la visibilidad de las alertas.
   */
  esFormaValido: boolean = false;

  /**
   * Indica si se ha intentado validar el formulario al menos una vez.
   */
  formularioIntentado: boolean = false;

  /**
   * Estado de la solicitud.
   */
  solicitudState!: DesistimientoDePermisoState;

  /**
   * ID de la solicitud.
   */
  idSolicitudState: number | null = null;

  /**
   * ID del tipo de trámite.
   */
  idTipoTramite: string = '140105';

  /**
   * Evento para cargar archivos.
   */
  cargarArchivosEvento: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Control de sección de carga de documentos.
   */
  seccionCargarDocumentos: boolean = false;

  /**
       * Indica si la carga de documentos está en progreso.
       * @type {boolean}
       */
      cargaEnProgreso: boolean = true;

  /**
   * Control para activar botón de carga de archivos.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Mensaje de alerta del formulario.
   */
  formErrorAlert: string = ERROR_FORMA_ALERT;

  /**
   * Mensaje de alerta.
   */
  alerta: string = TODOS_PASOS.Importante;

  /**
   * Clase CSS para alertas informativas.
   */
  infoAlert: string = 'info-alert';

  /**
   * Flag indicating whether the search section should be displayed.
   */
  public mostrarBusqueda: boolean = false;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;


  /**
   * Referencia al componente hijo paso uno
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  constructor(
    private store: DesistimientoStore,
    private query: DesistimientoQuery,
    private servicioDeMensajesService: ServicioDeMensajesService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.inicializarDatos();
    this.suscribirAEstados();
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa los datos del componente
   */
  private inicializarDatos(): void {
    this.solicitudState = this.query.getValue();
    this.idSolicitudState = this.solicitudState.idSolicitud;
  }

  /**
   * Se suscribe a los estados de la aplicación
   */
  private suscribirAEstados(): void {
    this.query.select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(state => {
        this.solicitudState = state;
        this.idSolicitudState = state.idSolicitud;
      });
  }

  /**
   * Maneja el evento de navegación del asistente
   */
  // getValorIndice(valor: AccionBoton): void {
  //   if (valor.accion === 'cont') {
  //     this.indice = valor.valor + 1;
  //     this.datosPasos.indice = this.indice;
  //     if (this.wizardComponent) {
  //       this.wizardComponent.siguiente();
  //     }
  //   } else {
  //     this.indice = valor.valor - 1;
  //     this.datosPasos.indice = this.indice;
  //     if (this.wizardComponent) {
  //       this.wizardComponent.atras();
  //     }
  //   }

  //   this.actualizarSeccionCargarDocumentos();
  // }

   getValorIndice(e: AccionBoton): void {
  
    
    if (this.indice === 1) {
      const FORM_VALIDO = this.pasoUnoComponent?.validarFormularios() ?? false;
      this.esFormaValido = FORM_VALIDO;
      this.formularioIntentado = true;

      if (!this.esFormaValido) {
        this.datosPasos.indice = 1;
        this.formErrorAlert = 'Favor de verificar los campos que marcan error.';
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.onGuardar().pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (respuesta: BaseResponse<unknown>) => {
        
          
          if (respuesta.codigo !== '00') {
            const ERROR_MESSAGE = respuesta.error || 'Error desconocido en la solicitud';
            this.formErrorAlert = ServiciosService.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = false;
            this.formularioIntentado = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          }
            this.esFormaValido = true;
            const DATOS = respuesta.datos as { id_solicitud?: number } | undefined;
            if (DATOS?.id_solicitud) {
              this.idSolicitudState = DATOS.id_solicitud;
              this.store.setIdSolicitud(DATOS.id_solicitud);

            }
            if (e.accion === 'cont') {
              this.indice = this.indice + 1;
              this.datosPasos.indice = this.indice;
              this.wizardComponent.siguiente();
              this.actualizarSeccionCargarDocumentos();
            } else if (e.accion === 'ant') {
              this.indice = e.valor;
              this.datosPasos.indice = this.indice;
              this.wizardComponent.atras();
              this.actualizarSeccionCargarDocumentos();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = this.indice;
              this.actualizarSeccionCargarDocumentos();
            }

            this.toastrService.success(respuesta.mensaje);
        },
        error: (error) => {
          this.formErrorAlert = ServiciosService.generarAlertaDeError(error.error || 'Error al procesar la solicitud');
          this.esFormaValido = false;
          this.formularioIntentado = true;
          this.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        }
      });
      
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

   /**
   * Guarda la solicitud de ampliación de servicios utilizando el adaptador para convertir el estado
   * y enviar los datos al servidor.
   * @returns {Observable<BaseResponse<unknown>>}
   */
  onGuardar(): Observable<BaseResponse<unknown>> {
    return this.query.selectTramite140105$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map(ESTADO_ACTUAL => AmpliacionServiciosAdapter.toFormPayload(ESTADO_ACTUAL)),
      switchMap(FORM_PAYLOAD => {
        return this.servicioDeMensajesService.postGuardarDatos(this.idTipoTramite, FORM_PAYLOAD);
      }),
      catchError(error => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza la sección de cargar documentos basado en el índice actual.
   */
  private actualizarSeccionCargarDocumentos(): void {
    this.seccionCargarDocumentos = this.indice === 2;
  }

  /**
   * Maneja el evento de carga de documentos
   */
  manejaEventoCargaDocumentos(event: boolean): void {

    this.activarBotonCargaArchivos = event;
  }

  /**
   * Maneja cuando la carga se ha realizado
   */
  cargaRealizada(realizada: boolean): void {
    this.seccionCargarDocumentos = realizada ? false : true;
  }

  /**
   * Maneja el progreso de carga
   */
  onCargaEnProgreso(carga: boolean): void {
    // Implementar lógica de progreso si es necesario
     this.cargaEnProgreso = carga;
  }

  /**
   * Botón anterior para paso 2
   */
  anterior(): void {
    this.indice = 1;
    this.datosPasos.indice = this.indice;
    this.actualizarSeccionCargarDocumentos();
    if (this.wizardComponent) {
      this.wizardComponent.atras();
    }
  }

  /**
   * Botón siguiente para paso 2
   */
  siguiente(): void {
    this.indice = 3;
    this.datosPasos.indice = this.indice;
    this.actualizarSeccionCargarDocumentos();
    if (this.wizardComponent) {
      this.wizardComponent.siguiente();
    }
  }

  /**
   * Maneja el clic en cargar archivos
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * @method saltar
   * @description
   * Método para saltar directamente al paso de firma en el wizard.
   * Actualiza los índices correspondientes y ejecuta la transición
   * forward en el componente wizard.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }
}