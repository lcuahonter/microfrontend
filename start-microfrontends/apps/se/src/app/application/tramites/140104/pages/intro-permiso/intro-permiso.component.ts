import { Component, EventEmitter } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  map,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { DetalleDelAdapter } from '../../adapters/detalle-del-permiso.adapter';
import { ERROR_FORMA_ALERT } from '../../constants/intropermiso.enum';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PASOS } from '../../constants/intropermiso.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Solicitud140104State } from '../../estados/desistimiento-de-permiso.store';
import { TODOS_PASOS } from '../../constants/intropermiso.enum';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { throwError } from 'rxjs';

interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
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
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;
  /**
   * @description Array de objetos que definen los pasos del formulario.
   * Cada objeto contiene información sobre un paso específico,
   * incluyendo su número, título y si está completado.
   * Este array permite la gestión de las secciones o pasos dentro del formulario.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * @description Indicates whether the search section should be displayed.
   * Controlled based on service messages.
   * @type {boolean}
   */
  mostrarBusqueda: boolean = false;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = true;

  /**
   * Clase CSS utilizada para mostrar mensajes de alerta informativos en la interfaz.
   */
  infoAlert: string = 'info-alert';
  /**
   * @description Referencia al componente Wizard.
   * Esta referencia permite acceder a los métodos y propiedades del componente Wizard,
   * como `siguiente()` y `atras()`, para controlar la navegación entre los pasos.
   *
   * @type {WizardComponent}
   * @viewChild WizardComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @description Índice actual del paso en el que se encuentra el usuario.
   * Este índice se utiliza para determinar qué paso se muestra en cada momento.
   * Los valores posibles de `indice` corresponden a los pasos definidos en el arreglo `pasos`.
   *
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /**
   * @description Objeto que contiene los datos de los pasos del formulario.
   * Este objeto se utiliza para comunicar información entre el componente Agricultura
   * y el componente Wizard, como el número total de pasos, el índice del paso actual
   * y los textos de los botones de navegación (anterior y siguiente).
   *
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * @property {TODOS_PASOS} alerta
   * @description
   * Variable utilizada para almacenar el tipo de alerta.
   */
  alerta = TODOS_PASOS.Importante;

  /**
   * @property {string} tituloMensaje
   * @description
   * Título del mensaje mostrado en la interfaz para la cancelación por permisos previamente autorizados.
   */
  tituloMensaje: string = 'Cancelación por Permisos Previamente Autorizados';

  /**
   * URL de la página actual.
   */
  public solicitudState!: Solicitud140104State;

  /**
   * Identificador del trámite actual.
   */
  idTipoTramite: string = '140104';

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Notificador para gestionar la destrucción de observables.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Clase CSS para mostrar una alerta de error.
   * @type {string}
   */
  infoError = 'alert-danger';

  /**
   * @constructor
   * @param {ServicioDeMensajesService} servicioDeMensajesService
   * Servicio utilizado para la comunicación de mensajes entre componentes.
   */
  constructor(
    private servicioDeMensajesService: ServicioDeMensajesService,
    private query: DesistimientoQuery,
    private store: DesistimientoStore,
    private toastrService: ToastrService
  ) {}

  /**
   * @description Lifecycle method executed when the component initializes.
   * Subscribes to the message service to update the search display state.
   */
  ngOnInit(): void {
    this.servicioDeMensajesService.mensaje$.subscribe((mensaje) => {
      this.mostrarBusqueda = mensaje;
    });
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Guarda la solicitud de ampliación de servicios utilizando el adaptador para convertir el estado
   * y enviar los datos al servidor.
   * @returns {Observable<{ exito: boolean; [key: string]: any }>}
   */
  onGuardar(): Observable<any> {
    return this.query.selectSolicitud$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map((ESTADO_ACTUAL) => DetalleDelAdapter.toFormPayload(ESTADO_ACTUAL)),
      switchMap((FORM_PAYLOAD) => {
        return this.servicioDeMensajesService.postGuardarDatos(
          this.idTipoTramite,
          FORM_PAYLOAD
        );
      }),
      catchError((error) => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Maneja el cambio de paso en el wizard según la acción del botón.
   * Valida el formulario en el primer paso y guarda la solicitud si es válido.
   * Actualiza el índice y muestra mensajes de error o éxito según corresponda.
   * 
   * @param {AccionBoton} e - Objeto que indica la acción ('cont' para continuar, 'ant' para anterior) y el valor del índice de paso.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO =
        this.pasoUnoComponent?.validarTodosLosFormularios() ?? false;
      this.esFormaValido = FORM_VALIDO;

      if (!this.esFormaValido) {
        this.datosPasos.indice = 1;
        this.formErrorAlert =
          ServiciosService.generarAlertaDeError(ERROR_FORMA_ALERT);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.onGuardar()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (respuesta: BaseResponse<{ id_solicitud: number }>) => {
            if (respuesta.codigo !== '00') {
              this.formErrorAlert =
                ServiciosService.generarAlertaDeError(ERROR_FORMA_ALERT);
              this.esFormaValido = false;
              this.indice = 1;
              this.datosPasos.indice = 1;
              if (this.wizardComponent) {
                this.wizardComponent.indiceActual = 0;
              }
              setTimeout(
                () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                0
              );
              return;
            }

            if (respuesta.datos?.id_solicitud) {
              this.idSolicitudState = respuesta.datos.id_solicitud;
              this.store.setIdSolicitud(respuesta.datos.id_solicitud);
            }

            this.esFormaValido = true;

            this.indice = e.valor;
            this.datosPasos.indice = this.indice;

            if (e.accion === 'cont') {
              this.wizardComponent.siguiente();
            } else if (e.accion === 'ant') {
              this.wizardComponent.atras();
            }

            this.toastrService.success(respuesta.mensaje);
          },
          error: (error) => {
            this.formErrorAlert = ServiciosService.generarAlertaDeError(
              error.error || 'Error al procesar la solicitud'
            );
            this.esFormaValido = false;
            this.indice = 1;
            if (this.wizardComponent) {
              this.wizardComponent.indiceActual = 0;
            }
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
          },
        });
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;

        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * @description Lifecycle method executed when the component is destroyed.
   * Resets the search display state to false.
   */
  ngOnDestroy(): void {
    this.mostrarBusqueda = false;
  }
}
