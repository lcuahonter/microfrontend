import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent, RegistroSolicitudService, SolicitanteStore } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudContenedoraComponent } from '../../components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud.contenedora';

import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados.contenedora';

import { CertificadosLicenciasPermisosService } from '../../services/certificados-licencias-permisos.service';

import { Subject, map, takeUntil } from 'rxjs';
import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import { Tramites260301Query } from '../../estados/queries/tramites260301.query';

import {GuardarAdapter_260301, mapBackendToSolicitud2603,mapPago} from '../../adapters/guardar-payload.adapter'
import { Shared2603MostrarService } from '../../../../shared/services/shared2603/shared2603-mostrar.service';
import { Solicitud260301State, Tramite260301Store } from '../../estados/stores/tramites260301.store';
import { Solicitud260301State as TramiteSolicitud260301State } from '../../estados/stores/tramite260301.store';
import {Tramite2603Store } from '../../../../shared/estados/stores/2603/tramite2603.store';
import {TramiteProc260301Store } from '../../estados/stores/tramite260301.store';
import { Tramite260301Query } from '../../estados/queries/tramite260301.query';


/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDeLaSolicitudContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit {
      /**
     * Almacena todos los valores del solicitanteStore al cargar el componente.
     */
    public solicitanteStoreValues: any;
    /**
     * Estado de la solicitud.
     */
    public solicitudState!: TramiteSolicitud260301State;
       /**
   * Estado de la solicitud.
   */
  public tableStore: any;

  
  public nuevaNotificacion!: Notificacion;
   /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    @Input() isContinuarTriggered: boolean = false;
      /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
     * Proporciona acceso a sus métodos y propiedades.
     */
    @ViewChild(DatosDeLaSolicitudContenedoraComponent) datosSolicitudComponent!: DatosDeLaSolicitudContenedoraComponent;
  
    /** Referencia al componente 'TercerosRelacionadosFabricanteComponent' en la plantilla.
     * Proporciona acceso a sus métodos y propiedades.
     */
    @ViewChild('TercerosRelacionadosContenedoraComponent', { static: false }) tercerosRelacionadosFabricanteComponent!: TercerosRelacionadosContenedoraComponent;
  
    /** Referencia al componente 'PagoDerechosComponent' en la plantilla.
     * Proporciona acceso a sus métodos y propiedades.
     */
    @ViewChild('PagoDerechosComponent', { static: false }) PagoDerechosComponent!: PagoDeDerechosContenedoraComponent;
     
  /**
   * Objeto que almacena el estado global recuperado del servicio Shared2605Service.
   * Contiene información relevante para la validación y manejo de los formularios del paso uno.
   */
  private state: Record<string, unknown> = {};
/**
 * Indica si el componente de "Datos de la Solicitud" ha sido validado correctamente.
 * Se utiliza para verificar que toda la información general de la solicitud
 * esté completa antes de avanzar al siguiente paso del trámite.
 */
private isDatosDeLaSolicitudComponentValid: boolean = false;
  /**
   * Indicador booleano que valida el estado del componente PagoDeDerechosBancoComponent.
   * Se utiliza para determinar si la sección de pago de derechos del banco es válida.
   */
  private isPagoDeDerechosBancoComponentValid: boolean = false;
  /**
 * Indica si el componente de "Terceros" es válido.
 * Permite confirmar que los datos correspondientes a terceros 
 * (personas físicas, morales o representantes) estén correctos y completos.
 */
private isTercerosComponentValid: boolean = false;
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta obtenido del store. */
  public consultaState!: ConsultaioState;

  private idProcediemento: number = 260301;

  private idSolicitud: number = 202915785;

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param certificadosLicenciasPermisosService Servicio para manejar los datos del formulario de certificados, licencias y permisos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,private _sharedSvc: DatosSolicitudService,
    private certificadosLicenciasPermisosService: CertificadosLicenciasPermisosService, private query: Tramites260301Query,
    private shared2603MostrarService: Shared2603MostrarService, private store: Tramite260301Store,
    private tramitePro260301Store:TramiteProc260301Store,
    private tramite2603Store: Tramite2603Store,
    public registroSolicitudService: RegistroSolicitudService,
    private solicitanteStore: SolicitanteStore,
    private _query: Tramite260301Query
  ) {
        this.solicitanteStoreValues = this.solicitanteStore.getValue ? this.solicitanteStore.getValue() : undefined;
  }

    /**
     * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Se suscribe al estado de consulta y actualiza la variable local.
     * Si el estado indica que hay una actualización, guarda los datos del formulario.
     * De lo contrario, marca que ya existen datos de respuesta.
     */
    ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
        // Actualiza el estado local con el valor obtenido del store
        this.consultaState = seccionState;
        
        // Verifica si se debe actualizar el formulario o solo mostrar los datos existentes
        if (this.consultaState && this.consultaState.update) {
         // this.guardarDatosFormulario();
          this.fetchGetDatosConsulta();
        } else {
          this.esDatosRespuesta = true;
         //this.guardarDatosFormulario();
        }
        })
      )
      .subscribe();

    //  this.fetchGetDatosConsulta();
   
    }


     /**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean {
    this.getAllState();
    this.isDatosDeLaSolicitudComponentValid = 
      this.query.getValue().formValidity?.formSectionValid ?? false;
    this.isTercerosComponentValid = (this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.isotrosvalid) ?? false;

    this.isPagoDeDerechosBancoComponentValid = (
      this.state['claveDeReferencia'] !== '' && 
      this.state['cadenaDependencia'] !== '' && 
      this.state['banco'] !== '' && 
      this.state['llaveDePago'] !== '' && 
      this.state['fechaPago'] !== '' && 
      this.state['importePago'] !== ''
    );

    if (!this.isPagoDeDerechosBancoComponentValid) {
      this.PagoDerechosComponent.markTouched();
    }

    return this.isDatosDeLaSolicitudComponentValid 
          && this.isTercerosComponentValid 
          && this.isPagoDeDerechosBancoComponentValid

  }

    

  //   ngOnInit(): void {
  //   this.consultaQuery.selectConsultaioState$
  //     .pipe(
  //       takeUntil(this.destroyNotifier$),
  //       map((seccionState) => {
  //         this.consultaState = seccionState;
  //         if (this.consultaState.update) {
  //           this.guardarDatosFormulario(this.consultaState?.id_solicitud);
  //           this.tramite110201Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
  //         } else {
  //           this.esDatosRespuesta = true;
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

 
   /**
   * Obtiene el estado global desde el servicio Shared2605Service y lo asigna a la propiedad local 'state'.
   * Este método se utiliza para recuperar información relevante para la validación de los formularios del paso uno.
   */
  getAllState(): void {
    this._sharedSvc.getAllState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.state = resp;
      });
  }




  
   /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
   validarPasoUno(): boolean {
    const ESTABVALIDO = this.datosSolicitudComponent?.validarContenedor() ?? false;
   
    const ESTERCEROSVALIDO =this.tercerosRelacionadosFabricanteComponent.validarContenedor() ?? false;
     
      return (
        (ESTABVALIDO && ESTERCEROSVALIDO) ? true : false
  
      );
  }

  public validarPagoDerechos(): boolean {
    this.getAllState();
    this.isPagoDeDerechosBancoComponentValid = (
      this.state['claveDeReferencia'] !== '' && 
      this.state['cadenaDependencia'] !== '' && 
      this.state['banco'] !== '' && 
      this.state['llaveDePago'] !== '' && 
      this.state['fechaPago'] !== '' &&  
      this.state['importePago'] !== ''
    );

    if (!this.isPagoDeDerechosBancoComponentValid) {
      this.PagoDerechosComponent.markTouched();
      return false;
    }
    return this.isPagoDeDerechosBancoComponentValid;
  }

  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos del formulario desde el servicio y actualiza el estado si la respuesta es válida.
   */
  guardarDatosFormulario(): void {
    this.certificadosLicenciasPermisosService
      .getFormularioData().pipe(
        takeUntil(this.destroyNotifier$) // Cancela la suscripción al destruir el componente
      )
      .subscribe((resp) => {
        if (resp) {
          // Si la respuesta existe, marca que hay datos de respuesta y actualiza el estado del formulario
          this.esDatosRespuesta = true;
          this.certificadosLicenciasPermisosService.actualizarEstadoFormulario(resp);
        }
      });
  }

  @Output() formValidityChange = new EventEmitter<boolean>();
  

  onFormValidityChange(isValid: boolean):void {
    this.formValidityChange.emit(isValid);
  }
  setFromBackend(response: any): void {
    const mappedState = mapBackendToSolicitud2603(response);
    this.tramite2603Store.update(mappedState);
    this.store.update(mappedState);
    const pagoDerechos = mapPago(response);
    this.tramitePro260301Store.updatePagoDerechos(pagoDerechos)
  }

  public fetchGetDatosConsulta(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    this._sharedSvc
      .fetchMostrarApi260301(this.idProcediemento,SOLICITUDE_ID) 
      .pipe(takeUntil(this.destroyNotifier$)).subscribe({
        next: (respuesta) => {
        if (respuesta['codigo'] === "00") {
          this.esDatosRespuesta = true;
          this.setFromBackend(respuesta);
        }
      }, error: () => {
          // En caso de error, se intenta obtener los datos de consulta nuevamente
        }
      });
  }
  public formValid(): boolean {
  return this.validarPasoUno();
}
 guardarDatosApi(): void {
      this.getStoreData();
     this.getAllTramite2603StoreValues();
        const PAYLOAD = GuardarAdapter_260301.toFormPayload(this.solicitudState, this.tableStore,this.solicitanteStoreValues);
        this.registroSolicitudService.postGuardarDatos('260301', PAYLOAD).pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe({
          next: (response) => {
            if (response.codigo === '00') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.EXITO,
                modo: 'action',
                titulo: 'Actualización de solicitud.',      
                mensaje:
                response.mensaje,
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error al actualizar la solicitud.',
                mensaje:
                response.mensaje,
                cerrar: false,  
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },  
          error: () => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr', 
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al actualizar la solicitud.',
              mensaje:
              'Ocurrió un error al actualizar la solicitud. Por favor, inténtelo de nuevo más tarde.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          },
        });
    }
       public getStoreData(): void {
    this._query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      if (data.idSolicitud !== null) {
        this.solicitudState = data;
      }
    });
  }
    public getAllTramite2603StoreValues(): void {
   this.tableStore = this.tramite2603Store.getStoreTableData();
  }
}
