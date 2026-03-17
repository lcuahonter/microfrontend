/**
 * PasoUnoComponent
 * Componente que representa el primer paso del proceso de modificación de permiso sanitario.
 */
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { ModificacionPermisoSanitarioService } from '../../services/modificacion-permosi-sanitario.service';

import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { GuardarAdapter_260902 } from '../../adapters/guardar-payload.adapter';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260902Query } from '../../estados/tramite260902Query.query';
import { Tramite260902Store } from '../../estados/tramite260902Store.store';
/**
 * PasoUnoComponent
 * Componente que representa el primer paso del proceso de modificación de permiso sanitario.
 * Este componente se encarga de mostrar la información del solicitante y del establecimiento,
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
/**
 * * PasoUnoComponent
 * Componente que representa el primer paso del proceso de modificación de permiso sanitario.
 * Este componente se encarga de mostrar la información del solicitante y del establecimiento,
 */
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /**
 * Holds the current radio value for tipoTramite, used for child component binding.
 */
  public tipoTramite: string = '';

  @ViewChild('tercerosRelacionados') tercerosRelacionados!: TercerosRelacionadosVistaComponent;

  @ViewChild('pagoDeDerechos') pagoDeDerechos!: PagoDeDerechosContenedoraComponent;

  @ViewChild('datosdelmodification') datosdelmodificacion!: DatosDelSolicitudModificacionComponent;

  @ViewChild('manifestosDeclaraciones') manifiestosDeclaraciones!: ManifiestosComponent;

  @ViewChild('representeLegal') representeLegal!: RepresentanteLegalComponent;
  /**
    * showPreFillingOptions
    * Indica si se deben mostrar las opciones de prellenado.
    */
  showPreFillingOptions: boolean = false;

  /**
  * Indica si se están mostrando los datos de respuesta.
  */
  public esDatosRespuesta: boolean = false;
  /**
   * Estado actual de la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
  * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
  */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitudService: ModificacionPermisoSanitarioService,
    private tramiteStore: Tramite260902Store,
    public registroSolicitudService: RegistroSolicitudService,
    private tramiteQuery: Tramite260902Query,
    private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
    private manifestoStore: DatosDomicilioLegalStore,
     private domicilioStore: DomicilioStore,
  ) { }
  /**
   * ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.update) {
          this.guardarDatosFormulario(this.consultaState.id_solicitud,this.consultaState.procedureId);
        } else {
          this.esDatosRespuesta = true;
          this.guardarDatosFormulario('203037746', '260202');
        }
      })
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
   * ngAfterViewInit
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  /**
 * Método para guardar los datos del formulario.
 * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
 * y actualiza el estado del formulario según la respuesta.
 */
  guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
    this.registroSolicitudService.parcheOpcionesPrellenadas(
      Number(PROCEDURE_ID),
      Number(ID_SOLICITUD)
    ).subscribe((res: any) => {
      if (res && res.datos) {
        GuardarAdapter_260902.patchToStore(res.datos, this.tramiteStore);
        GuardarAdapter_260902.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
        GuardarAdapter_260902.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260902.patchToStoreDomicilio(res.datos, this.domicilioStore);
      }
    });

  }

  /**
   * Índice actual del subtítulo seleccionado en la interfaz.
   */
  public indice: number = 1;

  /**
   * Método para actualizar el índice del subtítulo seleccionado.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  validarPasoUno(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosdelmodificacion?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosDeclaraciones?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representeLegal?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionados.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO && REPRESENTANTE_LEGAL_VALIDO) ? true : false;
  }

  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosdelmodificacion?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosDeclaraciones?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representeLegal?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO &&
      REPRESENTANTE_LEGAL_VALIDO
    ) ? true : false;
  }

  validarTodosLosPasos(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosdelmodificacion?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosDeclaraciones?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representeLegal?.validarClickDeBoton() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionados?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechos?.validarContenedor() ?? false;
    return DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }

  /**
* Método del ciclo de vida que se ejecuta al destruir el componente.
*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
     * @method datasolicituActualizar
     * Actualiza el estado del formulario de datos de la solicitud en el store.
     *
     * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
     */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }
}
