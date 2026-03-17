import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AfterViewInit } from '@angular/core';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PagoDerechosComponent } from '../../components/pago-derechos/pago-derechos.component';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { TercerosRelacionadosFabricanteComponent } from '../../components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { Tramite260511Query } from '../../../../shared/estados/queries/260511/tramite260511.query';
import { Tramite260511Store } from '../../../../shared/estados/stores/260511/tramite260511.store';
/**
 * Componente que representa el primer paso del proceso de solicitud.
 * Contiene un componente de solicitante y permite la navegación entre tabs.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  
  /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosSolicitudComponent', { static: false }) datosSolicitudComponent!: DatosSolicitudComponent;

  /** Referencia al componente 'TercerosRelacionadosFabricanteComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosFabricanteComponent', { static: false }) tercerosRelacionadosFabricanteComponent!: TercerosRelacionadosFabricanteComponent;

  /** Referencia al componente 'PagoDerechosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('PagoDerechosComponent', { static: false }) PagoDerechosComponent!: PagoDerechosComponent;
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
  
/**
 * Indica si el componente de "Datos de la Solicitud" ha sido validado correctamente.
 * Se utiliza para verificar que toda la información general de la solicitud
 * esté completa antes de avanzar al siguiente paso del trámite.
 */
private isDatosDeLaSolicitudComponentValid: boolean = false;

/**
 * Indica si el componente de "Terceros" es válido.
 * Permite confirmar que los datos correspondientes a terceros 
 * (personas físicas, morales o representantes) estén correctos y completos.
 */
private isTercerosComponentValid: boolean = false;

/**
 * Indica si el componente de "Pago de Derechos" ha pasado su validación.
 * Se utiliza para asegurar que la información relacionada con los pagos
 * y comprobantes de derechos se haya capturado y validado correctamente.
 */
private isPagoDeDerechosComponentValid: boolean = false;
/** 
 * Identificador del procedimiento actual.
 */
public idProcedimiento: string = '260511';
  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Índice del tab seleccionado.
   */
  indice: number = 1;

  /**
   * Método para seleccionar un tab.
   * @param i Índice del tab.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de consulta que contiene la información del formulario y su estado.
   * Se obtiene a través de la consulta ConsultaioQuery.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente Datos260502Component.
   *
   * @param solicitud260502Service - Servicio para manejar la lógica de negocio relacionada con el trámite 260502.
   * @param consultaQuery - Consulta para obtener el estado actual del formulario y su configuración.
   */
  constructor(
    private datosDomicilioLegalService: DatosDomicilioLegalService,
    private pagoBancoService: PagoBancoService,
    private consultaQuery: ConsultaioQuery,
     private store: Tramite260511Store,
    private query: Tramite260511Query,
    private sharedSvc: Shared2605Service,
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta para obtener la información del formulario.
   * Si el estado indica que se está actualizando, se llama a `guardarDatosFormulario`.
   * De lo contrario, se establece `esDatosRespuesta` como verdadero.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState?.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio `getRegistroTomaMuestrasMercanciasData` para obtener los datos del formulario.
   * Si la respuesta es válida, se actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud || '';
    this.sharedSvc
      .getMostrarDatos(ID_SOLICITUDE,this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
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
    this.getAllState();
    this.isDatosDeLaSolicitudComponentValid = (
      this.query.getValue().formValidity?.datosEstablecimiento && 
      this.query.getValue().formValidity?.domicilioEstablecimiento &&
      this.query.getValue().formValidity?.manifiestos &&
      this.query.getValue().formValidity?.representanteLegal ) ?? false;
    this.isTercerosComponentValid = (this.query.getValue().formValidity?.fabricanteTablaValid &&
      this.query.getValue().formValidity?.formuladorTablaValid &&
      this.query.getValue().formValidity?.proveedorTablaValid) ?? false;

    return this.isDatosDeLaSolicitudComponentValid 
          && this.isTercerosComponentValid 

  }

  /**
   * Obtiene el estado global desde el servicio Shared2605Service y lo asigna a la propiedad local 'state'.
   * Este método se utiliza para recuperar información relevante para la validación de los formularios del paso uno.
   */
  getAllState(): void {
    this.sharedSvc.getAllState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.state = resp;
      });
  }
  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
