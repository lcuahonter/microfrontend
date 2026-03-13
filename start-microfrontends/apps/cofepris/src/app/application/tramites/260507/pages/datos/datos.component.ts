import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { TercerosRelacionados260507Component } from '../../components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260507Query } from '../../../../estados/queries/260507/tramite260507.query';
import { Tramite260507Store } from '../../../../estados/tramites/260507/tramite260507.store';
/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styles: ``
})
export class DatosComponent implements OnInit, OnDestroy {
/**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosSolicitudComponent', { static: false }) datosSolicitudComponent!: DatosDeLaSolicitudComponent;

  /** Referencia al componente 'TercerosRelacionadosFabricanteComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosFabricanteComponent', { static: false }) tercerosRelacionadosFabricanteComponent!: TercerosRelacionados260507Component;

  /** Referencia al componente 'PagoDerechosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('PagoDerechosComponent', { static: false }) PagoDerechosComponent!: PagoDeDerechosComponent;
  
   /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;
  /** 
   * Configuración del formulario para la persona moral 
   */
  persona: FormularioDinamico[] = [];

  /** 
   * Configuración del formulario para el domicilio fiscal 
   */
  domicilioFiscal: FormularioDinamico[] = [];

 /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Estado actual de la consulta obtenido desde el store.
 *
 * Esta propiedad almacena el estado completo de la consulta (`ConsultaioState`), 
 * el cual es actualizado mediante la suscripción al observable `selectConsultaioState$`
 * del servicio `ConsultaioQuery`. Se utiliza para determinar si se deben cargar datos
 * adicionales o mostrar información de respuesta en el formulario.
 *
 * @type {ConsultaioState}
 * @memberof PasoUnoComponent
 */
  public consultaState!: ConsultaioState;

  /**
   * Actualiza el índice de la pestaña seleccionada.
   *
   * Este método recibe un número que representa el índice de la pestaña a activar
   * y actualiza la propiedad "indice" con dicho valor.
   *
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   * @memberof PasoUnoComponent
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
/**
 * Indica si el componente de "Datos de la Solicitud" ha pasado su validación.
 * Se utiliza para controlar el flujo del formulario o asistente (wizard) 
 * antes de permitir avanzar al siguiente paso.
 */
 private isDatosDeLaSolicitudComponentValid: boolean = false;
 /**
 * Indica si el componente de "Terceros" es válido.
 * Permite verificar que la información de terceros (personas, empresas, etc.)
 * haya sido completada correctamente antes de continuar.
 */
  private isTercerosComponentValid: boolean = false;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false; 
      /**
       * Emite el estado de validez del formulario.
       * Se envía un valor booleano cada vez que cambia la validez del formulario.
       * Permite comunicar al componente padre si el formulario es válido o no.
       */
      @Output() formValidityChange = new EventEmitter<boolean>();
     /**
       * Actualiza el estado local de validez del formulario.
       * Este método recibe el valor emitido por el componente hijo.
       * Se utiliza para saber si el formulario es válido o no desde el componente principal.
       */
      onFormValidityChange(isValid: boolean):void {
        this.formValidityChange.emit(isValid);
      }
  
    /**
     * Indicador booleano que valida el estado del componente PagoDeDerechosBancoComponent.
     * Se utiliza para determinar si la sección de pago de derechos del banco es válida.
     */
    private isPagoDeDerechosBancoComponentValid: boolean = false;
    /**
     * Objeto que almacena el estado global recuperado del servicio Shared2605Service.
     * Contiene información relevante para la validación y manejo de los formularios del paso uno.
     */
    private state: Record<string, unknown> = {};
      /** Referencia al componente 'PagoDeDerechosBancoComponent' en la plantilla.
       * Proporciona acceso a sus métodos y propiedades.
       */
      @ViewChild('PagoDerechosComponent', { static: false }) pagoDerechosComponent!: PagoDeDerechosComponent;
    
    /** 
     * Identificador del procedimiento actual.
     */
    public idProcedimiento: string = '260507';
  /**
 * Constructor del componente PasoUnoComponent.
 *
 * Inyecta los servicios necesarios para la gestión de permisos de hidrocarburos, 
 * la manipulación de datos del trámite y la consulta del estado desde el store.
 * La inicialización específica se realiza en los métodos del ciclo de vida del componente.
 *
 * @param {ImportacionPlafestService} importacionPlafestSvc Servicio para operaciones de permisos de hidrocarburos.
 * @param {Solocitud260507Service} solocitud260507Service Servicio para manipulación de datos del trámite 260507.
 * @param {ConsultaioQuery} consultaQuery Servicio para consultar el estado de la solicitud desde el store.
 * @memberof PasoUnoComponent
 */
  constructor(
    private consultaQuery: ConsultaioQuery,
     private datosDomicilioLegalService: DatosDomicilioLegalService,
         private pagoBancoService: PagoBancoService,
       public store: Tramite260507Store,
    public query: Tramite260507Query,
    private sharedSvc: Shared2605Service,
  ) { }

  /**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 *
 * Se suscribe al observable `selectConsultaioState$` del servicio `ConsultaioQuery` para obtener el estado actual de la consulta
 * y actualizar la propiedad `consultaState`. Dependiendo del valor de `update` en el estado, decide si cargar los datos del formulario
 * o mostrar la información de respuesta.
 *
 * @memberof PasoUnoComponent
 */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud || '';
    this.sharedSvc
      .getMostrarDatos(ID_SOLICITUDE,this.idProcedimiento).pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          const API_RESPONSE = doDeepCopy(resp);
          if(esValidObject(API_RESPONSE.datos)) {
            this.sharedSvc.buildMostrarMaping(API_RESPONSE.datos);
          }
        }
      });
  }
/**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean {
    if (this.consultaState.update) {
    this.isDatosDeLaSolicitudComponentValid = (
      (this.query.getValue().formValidity?.datosEstablecimiento === undefined
        ? this.sharedSvc.datosDelFormValidity
        : this.query.getValue().formValidity?.datosEstablecimiento)
      && (this.query.getValue().formValidity?.domicilioEstablecimiento === undefined
        ? this.sharedSvc.domicilioValidity
        : this.query.getValue().formValidity?.domicilioEstablecimiento)
      && (this.query.getValue().formValidity?.manifiestos === undefined
        ? this.sharedSvc.manifiestosValidity
        : this.query.getValue().formValidity?.manifiestos)
      && (this.query.getValue().formValidity?.representanteLegal === undefined
        ? this.sharedSvc.representanteValidity
        : this.query.getValue().formValidity?.representanteLegal)
    ) ?? false;
    this.isTercerosComponentValid = (
      (this.query.getValue().formValidity?.fabricanteTablaValid === undefined
        ? this.sharedSvc.fabricanteValidity
        : this.query.getValue().formValidity?.fabricanteTablaValid)
      && (this.query.getValue().formValidity?.formuladorTablaValid === undefined
        ? this.sharedSvc.formuladorValidity
        : this.query.getValue().formValidity?.formuladorTablaValid)
      && (this.query.getValue().formValidity?.proveedorTablaValid === undefined
        ? this.sharedSvc.proveedorValidity
        : this.query.getValue().formValidity?.proveedorTablaValid)
    ) ?? false;
  }
  else{
     this.isDatosDeLaSolicitudComponentValid = (
      this.query.getValue().formValidity?.datosEstablecimiento && 
      this.query.getValue().formValidity?.domicilioEstablecimiento &&
      this.query.getValue().formValidity?.manifiestos &&
      this.query.getValue().formValidity?.representanteLegal ) ?? false;
    this.isTercerosComponentValid = (this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.formuladorTablaValid &&
      this.query.getValue().formValidity?.proveedorTablaValid) ?? false;
  }

    return this.isDatosDeLaSolicitudComponentValid && this.isTercerosComponentValid

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
  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para liberar recursos y evitar fugas de memoria, completando el Subject destroyNotifier$.
   * Esto asegura que todas las suscripciones que dependen de este Subject se cancelen correctamente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}