/**
 * Componente que representa el primer paso del proceso de modificación de permiso de salida del territorio.
 * Este componente gestiona la configuración de trámites asociados, el formulario de pago de derechos y la navegación entre pestañas.
 */
import { Catalogo, ConfiguracionColumna } from '@libs/shared/data-access-user/src'; 
import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Solicitud2614State, Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CONFIGURACIONCOLUMNA } from '../../../../shared/constantes/shared2614/tramite-asociados.enum';
import { SolicitudModificacionPermisoInternacionService } from '../../../../shared/services/shared2614/solicitud-modificacion-permiso-internacion.service';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query'; 
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model'; 
/**
 * Decorador que define el componente Angular para el primer paso del proceso.
 * Incluye el selector del componente y la ruta de su plantilla HTML.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
/**
 * Clase que representa el componente Angular para el primer paso del proceso.
 * Implementa las interfaces OnInit y OnDestroy para gestionar el ciclo de vida del componente.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Formulario reactivo para el pago de derechos.
   */
  formularioPagoDerechos!: FormGroup;

  /**
   * Estado actual de la solicitud de permiso.
   */
  estadoSolicitudPermiso!: Solicitud2614State;

  /**
   * Lista de trámites asociados.
   */
  tramiteAsociados!: TramiteAsociados[];

  /**
   * Lista de bancos disponibles.
   */
  banco!: Catalogo[];

  /**
   * Configuración de la tabla para mostrar trámites asociados.
   */
  configuracionTabla: ConfiguracionColumna<TramiteAsociados>[] = CONFIGURACIONCOLUMNA;
    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;
       /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
      esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * formBuilder Constructor para formularios reactivos.
   * solicitudPermisoService Servicio para manejar datos relacionados con la solicitud de permiso.
   * tramite261402Store Store para gestionar el estado del trámite.
   * tramite261402Query Query para obtener datos del estado del trámite.
   */
  constructor(
    private formBuilder: FormBuilder,
    private solicitudPermisoService: SolicitudModificacionPermisoInternacionService,
    private tramite2614Store: Tramite2614Store,
    private tramite2614Query: Tramite2614Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.inicializarDatosSolicitud();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa los datos necesarios para el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    
  }

     /**
  * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
  * Si la respuesta es válida, activa el indicador de datos cargados.
  */
  guardarDatosFormulario(): void {
       this.solicitudPermisoService
      .getDatosDeLaSolicitud().pipe(
        takeUntil(this.notificadorDestruccion$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solicitudPermisoService.actualizarEstadoFormulario(resp);
        }else {
          this.esDatosRespuesta = false;
        }
      });
  }
  /**
   * Inicializa los datos de la solicitud, incluyendo el estado actual y los trámites asociados.
   */
  inicializarDatosSolicitud(): void {
    this.tramite2614Query.selectSolicitud$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSolicitudPermiso: Solicitud2614State) => {
        this.estadoSolicitudPermiso = estadoSolicitudPermiso;
      });

    this.solicitudPermisoService
      .obtenerTramitesAsociados()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((tramiteAsociados) => {
        this.tramiteAsociados = tramiteAsociados;
      });

    this.solicitudPermisoService.inicializaPagoDeDerechosDatosCatalogos();
  }

  /**
   * Cambia la pestaña seleccionada y, si es la pestaña de pago, inicializa el formulario de pago.
   * i Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    if (i === 4) {
      this.banco = this.solicitudPermisoService.banco;
      this.crearformularioPagoDerechos();
    }
    this.indice = i;
  }

  /**
   * Crea el formulario reactivo para el pago de derechos, inicializando sus valores y validaciones.
   */
  crearformularioPagoDerechos(): void {
    this.formularioPagoDerechos = this.formBuilder.group({
      claveDeReferencia: new FormControl(
        this.estadoSolicitudPermiso.claveDeReferencia,
        Validators.required
      ),
      cadenaPagoDependencia: new FormControl(
        this.estadoSolicitudPermiso.cadenaPagoDependencia,
        Validators.required
      ),
      bancoClave: new FormControl(
        this.estadoSolicitudPermiso.bancoClave,
        Validators.required
      ),
      llaveDePago: new FormControl(
        this.estadoSolicitudPermiso.llaveDePago,
        Validators.required
      ),
      fecPago: new FormControl(
        this.estadoSolicitudPermiso.fecPago,
        Validators.required
      ),
      impPago: new FormControl(
        this.estadoSolicitudPermiso.impPago,
        [Validators.required, Validators.min(0)]
      ),
    });
  }

  /**
   * Actualiza el estado del store con los valores del formulario de pago.
   * $event Evento que contiene el formulario y el campo a actualizar.
   */
  setValoresStore($event: { formularioPagoDerechos: FormGroup; campo: string }): void {
    const VALOR = $event.formularioPagoDerechos.get($event.campo)?.value;
    this.tramite2614Store.actualizarEstado({ [$event.campo]: VALOR });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el Subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}