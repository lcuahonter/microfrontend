import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ConfiguracionVisibilidad, DEFAULT_CONFIGURACION_VISIBILIDAD} from '../../constantes/datos.enum';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';

import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { Shared260514Service } from '../../services/260514-payload.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { SolicitudService } from '../../../../shared/services/solicitud.service';

import { AvisocalidadStore, SolicitudState } from '../../../../shared/estados/stores/aviso-calidad.store';
import { Tramite260514Store } from '../../../../estados/tramites/260514/tramite260514.store';
import { ViewChild } from '@angular/core';

import { TramitePagoBancoStore } from '../../../../shared/estados/stores/pago-banco.store';


/**
 * @component DatosComponent
 * @description
 * Componente principal para gestionar la selección de subtítulos en la página de datos del trámite 260514.
 * Permite cambiar entre diferentes secciones o pestañas utilizando un índice que representa el subtítulo seleccionado.
 * Además, maneja la obtención y actualización de datos del formulario y la limpieza de recursos al destruirse.
 * 
 * @selector app-datos
 * @templateUrl ./datos.component.html
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy, OnChanges {

    @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
     * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
     * @type {SolicitanteComponent}
     */
    @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  
  /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosDeLaComponent', { static: false }) datosDeLaComponent!: DatosDeLaComponent;
  

  /** Referencia al componente 'PagoDeDerechosBancoComponent' en la plantilla.
     * Proporciona acceso a sus métodos y propiedades.
     */
    @ViewChild('PagoDerechosComponent', { static: false }) pagoDerechosComponent!: PagoDeDerechosContenedoraComponent;
    
  /**
   * @property indice
   * @description
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
  public indice: number = 1;

  /**
   * @property destroyNotifier$
   * @description
   * Subject utilizado para notificar la destrucción del componente y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * @property esDatosRespuesta
   * @description
   * Indica si se han recibido datos de respuesta del servidor para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property solicitudState
   * @description
   * Estado de la solicitud, utilizado para manejar información relacionada con la solicitud actual.
   */
  public solicitudState!: SolicitudState;

  /**
   * @property DatosDomicilioLegalState
   * @description
   * Estado de los datos del domicilio legal, utilizado para manejar información relacionada con el domicilio legal.
   */
  public DatosDomicilioLegalState!: DatosDomicilioLegalState;

  idProcedimiento:number = 260514;

  // @ViewChild(DatosDeLaComponent)
  //   datosDeLaComponent!: DatosDeLaComponent;

   /**
     * Indica si se debe mostrar la sección de Aviso de Licencia
     */
    isAvisoLicenciaVisible: boolean = false;
  
    /**
     * Indica si se debe mostrar la sección de Aduanas de Entrada
     */
    isAduanasEntradaVisible: boolean = true;

    /**
   * Indica si el campo de domicilio debe estar habilitado en el formulario.
   * Cuando se establece en `true`, el campo de domicilio está activo y puede ser interactuado.
   */
   tieneDomicilioHabilitar: boolean = true;


  
    /**
     * Configuración de visibilidad utilizada para determinar qué elementos
     * deben ser visibles en el componente. Se inicializa con la configuración
     * predeterminada definida en `DEFAULT_CONFIGURACION_VISIBILIDAD`.
     */
    configuracionVisibilidad: ConfiguracionVisibilidad = DEFAULT_CONFIGURACION_VISIBILIDAD

 /**
   * Objeto que almacena el estado global recuperado del servicio Shared2605Service.
   * Contiene información relevante para la validación y manejo de los formularios del paso uno.
   */
  private state: Record<string, unknown> = {};

  /**
   * Indicador booleano que valida el estado del componente PagoDeDerechosBancoComponent.
   * Se utiliza para determinar si la sección de pago de derechos del banco es válida.
   */
  private isPagoDeDerechosBancoComponentValid: boolean = false;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;


  /**
   * @constructor
   * @description
   * Constructor del componente. Inyecta los servicios necesarios para la gestión de la solicitud y la consulta.
   * @param solicitudService Servicio para operaciones relacionadas con la solicitud.
   * @param consultaQuery Query para acceder al estado de la consulta.
   */
  constructor(
    private solicitudService: SolicitudService,
    private consultaQuery: ConsultaioQuery,
    private sharedSvc: Shared260514Service,
    public store: Tramite260514Store,
    private registroSolicitudService: RegistroSolicitudService,
    private avisocalidadStore: AvisocalidadStore,
    private pagoDerechosStore: TramitePagoBancoStore,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore,
    
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
        const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
        if (CONFIRMAR_VALOR) {
          this.seleccionaTab(CONFIRMAR_VALOR);
        }
      }
    }
    
    /** Actualiza la validez del formulario de datos del establecimiento en el store. */
  datosEstabelicimientoFormValidityChange(event: boolean): void {
    this.store.setFormValidity('datosEstablecimiento', event);
  }

   /** Actualiza la validez del formulario de domicilio del establecimiento en el store. */
  domicilioFormValidityChange(event: boolean): void {
    this.store.setFormValidity('domicilioEstablecimiento', event);
  }

  /** Actualiza la validez del formulario de manifiestos en el store. */
  manifiestosFormValidityChange(event: boolean): void {
    this.store.setFormValidity('manifiestos', event);
  }

  /** Actualiza la validez del formulario de representante legal en el store. */
  representanteLegalFormValidityChange(event: boolean): void {
    this.store.setFormValidity('representanteLegal', event);
  }

  /** Ejecuta la validación del formulario desde el componente de datos. */
  validarFormulario(): void {
    this.datosDeLaComponent?.validarClickDeBoton();
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y decide si se deben guardar los datos del formulario o mostrar los datos de respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      })
    ).subscribe();

  }

  /**
   * @method guardarDatosFormulario
   * @description
   * Método encargado de obtener los datos del formulario desde el servicio y actualizar el estado correspondiente.
   * Si se reciben datos, se actualiza el estado del formulario y se marca que hay datos de respuesta.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
        this.registroSolicitudService.parcheOpcionesPrellenadas(260514,SOLICITUDE_ID).subscribe((res:any) => {
          if(res && res.datos){
            Shared260514Service.patchresponseToStore(res.datos,this.avisocalidadStore,this.datosDomicilioLegalStore,this.pagoDerechosStore,);
          }
        });
        this.esDatosRespuesta=true;
      }
  /**
   * @method seleccionaTab
   * @description
   * Método para cambiar el índice del subtítulo seleccionado.
   * @param i - Índice del nuevo subtítulo seleccionado.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.updateTabSeleccionado(i);
    }

  validarClickDeBoton(): boolean {
    return this.datosDeLaComponent.validarClickDeBoton();
  }

  validOnButtonClick():boolean{
    let isValid = false;
    if(this.validarClickDeBoton()){
          isValid = true;
        }
        else{
          isValid = false;
        }
        return isValid;
      }

   /**
   * Obtiene el estado global desde el servicio Shared2605Service y lo asigna a la propiedad local 'state'.
   * Este método se utiliza para recuperar información relevante para la validación de los formularios del paso uno.
   */
  private getAllState(): void {
    this.sharedSvc.getAllState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.state = resp;
      });
  }   

      /**
   * Valida que todos los campos requeridos en la sección de pago de derechos estén completos y correctos.
   *
   * Este método obtiene el estado global del formulario y verifica que los campos clave de referencia,
   * cadena de dependencia, banco, llave de pago, fecha de pago e importe de pago no estén vacíos.
   * Si alguno de estos campos está vacío, marca el formulario como 'tocado' para mostrar los errores
   * de validación y retorna false. Si todos los campos son válidos, retorna true.
   *
   * @returns {boolean} true si todos los campos requeridos están completos y válidos, false en caso contrario.
   */
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
      this.pagoDerechosComponent.markTouched();
      return false;
    }
    return this.isPagoDeDerechosBancoComponentValid;
  }

  validarFormulariosBanco(): boolean {
    return this.pagoDerechosComponent?.validarFormulariosBanco() ?? false;
  }
  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el subject para cancelar todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
