import { Component,Input,OnChanges, OnInit,SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';

import { Subject, forkJoin, map, takeUntil } from 'rxjs';
import {DatosDelSolicitudModificacionComponent} from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { GuardarAdapter_260917 } from '../../adapters/guardar-payload.adapter';
import {ManifiestosComponent} from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component'; 
import {PagoDeDerechosContenedoraComponent} from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import {RepresentanteLegalComponent} from '../../../../shared/components/representante-legal/representante-legal.component';
import { Solocitud260917Service } from '../../services/service260917.service';
import {TercerosRelacionadosVistaComponent} from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260917Store } from '../../estados/tramites/tramite260917.store';
/**
 * Componente que representa el paso uno del formulario o flujo de trabajo.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit,OnChanges {

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
     * @property {number} confirmarSinPagoDeDerechos
     * @description
     * Indica si se ha confirmado la continuación sin pago de derechos.
     */
  @Input() confirmarSinPagoDeDerechos: number = 0;
   /**
   * El índice de la pestaña actualmente seleccionada.
   */
   indice: number = 1;

    /**
     * Holds the current radio value for tipoTramite, used for child component binding.
     */
    public tipoTramite: string = '';
   /**
     * Identificador único del procedimiento.
     * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
     */
    public readonly idProcedimiento = 260917;

   @ViewChild('DatosDelSolicitudModificacion') datosSolicitudComponent!: DatosDelSolicitudModificacionComponent;

   DatosDelSolicitudDatos: any;

   @ViewChild(ManifiestosComponent) manifiestosComponent!: ManifiestosComponent;

   @ViewChild(RepresentanteLegalComponent) representanteLegalComponent!: RepresentanteLegalComponent;

   /**
     * @ViewChild(TercerosRelacionadosVistaComponent)
     * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
     * mediante el decorador `@ViewChild`.
     */
   @ViewChild(TercerosRelacionadosVistaComponent)
   tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

   /**
     * @ViewChild(PagoDeDerechosContenedoraComponent)
     * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
     * mediante el decorador `@ViewChild`.
     */
   @ViewChild(PagoDeDerechosContenedoraComponent)
   pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

     /**
   * Constructor del componente DatosComponent.
   * Inyecta los servicios necesarios para la gestión de pantallas, obtención y actualización de datos,
   * así como la consulta del estado desde el store.
   *
   * @param {Pantallas301Service} pantallasSvc - Servicio para controlar la visibilidad y datos de las pantallas del trámite 301.
   * @param {Solocitud301Service} solocitud301Service - Servicio para obtener y actualizar los datos del formulario del trámite 301.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado actual desde el store.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud260917Service:Solocitud260917Service,
    private tramiteStore:Tramite260917Store,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioStore: DomicilioStore,
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

    /**
   * Método del ciclo de vida `ngOnInit`.
   * Inicializa el componente y sus dependencias.
   * Suscribe al observable del estado de consulta para obtener el estado actual desde el store.
   * Si el estado indica que hay una actualización pendiente (`update`), llama al método para guardar los datos del formulario.
   * En caso contrario, activa la bandera para mostrar los datos de respuesta.
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
          this.guardarDatosFormulario('203055665', '260217');
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
    * Selecciona una pestaña estableciendo su índice.
    * @param i El índice de la pestaña a seleccionar.
    */
   seleccionaTab(i: number): void {
     this.indice = i;
   }

      /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */

  guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
    this.registroSolicitudService.parcheOpcionesPrellenadas(
          Number(PROCEDURE_ID),
          Number(ID_SOLICITUD)
        ).subscribe((res: any) => {
          if (res && res.datos) {
            GuardarAdapter_260917.patchToStore(res.datos, this.tramiteStore);
            GuardarAdapter_260917.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
            GuardarAdapter_260917.patchToStoreManifestos(res.datos, this.manifestoStore);
            GuardarAdapter_260917.patchToStoreDomicilio(res.datos, this.domicilioStore);
          }
        });
  }

  validarPasoUno():boolean{
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO &&REPRESENTANTE_LEGAL_VALIDO ) ? true : false;
  }

  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO
    ) ? true : false;
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
      const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
      const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
      const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
      const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
      const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
      return (ESTERCEROSVALIDO && PAGOVALIDO && DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO )? true : false;
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
