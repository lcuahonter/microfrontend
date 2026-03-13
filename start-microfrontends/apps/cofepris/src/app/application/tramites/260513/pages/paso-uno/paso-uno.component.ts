import { AfterViewInit, OnChanges } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260513State, Tramite260513Store } from '../../estado/tramite260513Store.store';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';

import { PagoDerechosStore } from '../../../../shared/estados/stores/pago-de-derechos.store';

import { AvisocalidadStore } from '../../../../shared/estados/stores/aviso-calidad.store';

import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PagoDerechosComponent } from '../../components/pago-derechos/pago-derechos.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { TercerosRelacionadosFabricanteComponent } from '../../components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';

import { GuardarAdapter_260513 } from '../../adapters/guardar-mapping.adapter';
import { ID_PROCEDIMIENTO } from '../../constantes/datos-solicitud.enum';
import { Tramite260513Query } from '../../estado/tramite260513Query.query';

/**
 * Componente que representa el primer paso del proceso de solicitud.
 * Contiene un componente de solicitante y permite la navegación entre tabs.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
   @ViewChild(DatosSolicitudComponent) datosSolicitudRef!: DatosSolicitudComponent;
    @ViewChild(TercerosRelacionadosFabricanteComponent) tercerosRelacionadosFabricanteRef!: TercerosRelacionadosFabricanteComponent;
     @ViewChild(PagoDerechosComponent) pagoDerechosRef!: PagoDerechosComponent;

   /**
   * Indica si el formulario está deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

    /**
       * Identificador del procedimiento actual.
       *
       * Se inicializa con la constante global `ID_PROCEDIMIENTO`.
       * Esta propiedad se utiliza para determinar el flujo o tipo de trámite
       * que se debe ejecutar en el sistema.
       */
      idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

 /**
     * The index of the currently selected tab.
     * 
     * @type {number | undefined}
     * @default 1
     */
  indice: number | undefined = 1;


   /**
   * Actualiza la pestaña seleccionada en el store del trámite.
   * @method seleccionaTab
   * @param {number} i - Índice de la nueva pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.tramite260513Store.updateTabSeleccionado(i);
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
    public registroSolicitudService: RegistroSolicitudService,
    public avisocalidadStore: AvisocalidadStore,
    public pagoDerechosStore: PagoDerechosStore,
    public datosDomicilioLegalStore: DatosDomicilioLegalStore,
    private tramite260513Query: Tramite260513Query,
    private tramite260513Store: Tramite260513Store,

  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.formularioDeshabilitado = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta para obtener la información del formulario.
   * Si el estado indica que se está actualizando, se llama a `guardarDatosFormulario`.
   * De lo contrario, se establece `esDatosRespuesta` como verdadero.
   */
  ngOnInit(): void {
     if (
      this.consultaState &&
      this.consultaState.procedureId === this.idProcedimiento.toString() &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite260513Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
  }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio `getRegistroTomaMuestrasMercanciasData` para obtener los datos del formulario.
   * Si la respuesta es válida, se actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260513,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260513.patchresponseToStore(res.datos,this.avisocalidadStore,this.datosDomicilioLegalStore,this.pagoDerechosStore,);
      }
    });
    this.esDatosRespuesta=true;
  }

  
     /**
       * Actualiza el estado del formulario con los datos proporcionados.
       *
       * @param DATOS - Estado de la solicitud `Tramite260216State` con la información
       *                del tipo de solicitud a actualizar en el store.
       */
      actualizarEstadoFormulario(DATOS: Tramite260513State): void {
        this.tramite260513Store.update((state) => ({
          ...state,
          ...DATOS,
        }));
      }
  /**
   * @description
   * Valida si el botón puede ser activado según la lógica definida en el método `validarClickDeBoton` 
   * del objeto `datosSolicitudRef`. Retorna `true` si la validación es exitosa, de lo contrario retorna `false`.
   *
   * @returns {boolean} `true` si el tab actual es válido para continuar, `false` en caso contrario.
   */
  validOnButtonClick():boolean{

      const ES_TAB_VALIDO = this.datosSolicitudRef?.validarClickDeBoton() ?? false;
      return (
        (ES_TAB_VALIDO )? true : false
  
      );
    // let isValid = false;
    // if(this.datosSolicitudRef?.validarClickDeBoton()){
    //       isValid = true;
    //     }
    //     else{
    //       isValid = false;
    //     }
    //     return isValid;
      }

        /**
* Valida todos los pasos del formulario.
*
* Invoca los métodos de validación de los componentes hijos:
* - ContenedorDeDatosSolicitudComponent
* - TercerosRelacionadosVistaComponent
* - PagoDeDerechosContenedoraComponent
*
* @returns {boolean}
* - `true` si todos los componentes son válidos.
* - `false` si alguno no es válido o no está disponible.
*/
  validarTodosLosPasos(): boolean {
    const ESTABVALIDO = this.datosSolicitudRef?.validarClickDeBoton() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosFabricanteRef?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDerechosRef?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }
  

    //     ValidarPagoDerechos(): boolean {
    //   return (
    //     this.pagoDerechosRef.validarContenedor() ?? false 
    // );
    // }
  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
