/**
 * @file
 * Componente que maneja la lógica de la página de datos para el trámite 260903.
 */
import { Component,Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject,forkJoin,takeUntil } from 'rxjs';
import { ActualizacionImportacionService } from '../../services/actualizacion-importacion.service';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';

import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260903Store } from '../../estados/tramite260903.store';
import { GuardarAdapter_260903 } from '../../adapters/guardar-payload.adapter';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';


/**
 * @descripción
 * Componente `Datos260903Component` encargado de manejar las pestañas (tabs) 
 * en la interfaz de usuario. Proporciona la funcionalidad de selección de pestañas.
 */
@Component({
  selector: 'app-datos-260903',
  templateUrl: './datos-260903.component.html',
})
export class Datos260903Component implements OnInit, OnDestroy, OnChanges {
  /**
     * Holds the current radio value for tipoTramite, used for child component binding.
     */
    public tipoTramite: string = '';

    @Input() confirmarSinPagoDeDerechos: number = 0;  
   /**
     * Identificador único del procedimiento.
     * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
     */
    public readonly idProcedimiento = 260903;
  /**
     * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
     * @description
     * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
     * mediante el decorador `@ViewChild`.
     *
     * Esta propiedad permite invocar métodos públicos del contenedor y acceder
     * a sus propiedades, por ejemplo para delegar la validación del formulario
     * interno (`validarContenedor()`).
     *
     * > Nota: Angular inicializa esta referencia después de que la vista
     * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
     */
   /**
      * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
      */
      @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

    @ViewChild(PagoDeDerechosContenedoraComponent)
    pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

    @ViewChild(TercerosRelacionadosVistaComponent)
    tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

    
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
 * Índice de la pestaña actualmente seleccionada.
 * Inicializado a 1 por defecto.
 */
 public indice = 1;
/**
 * Constructor del componente Datos260903Component.
 * @param consultaQuery - Servicio para consultar el estado de la información.
 * @param solocitudService - Servicio para manejar la solicitud de actualización de importación.
 */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitudService: ActualizacionImportacionService,
     private tramiteStore: Tramite260903Store,
     public registroSolicitudService: RegistroSolicitudService,
     private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
     private manifestoStore: DatosDomicilioLegalStore,
     private domicilioStore: DomicilioStore,
  ) {}
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
          this.guardarDatosFormulario("203062846", "260203");
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
          GuardarAdapter_260903.patchToStore(res.datos, this.tramiteStore);
          GuardarAdapter_260903.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
          GuardarAdapter_260903.patchToStoreManifestos(res.datos, this.manifestoStore);
          GuardarAdapter_260903.patchToStoreDomicilio(res.datos, this.domicilioStore);
        }
      });

    }
  /**
   * Método para seleccionar una pestaña específica.
   *
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
    const ES_TERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (
      (ES_TERCEROS_VALIDO) ? true : false

    );
  }
    /**
 * Método del ciclo de vida que se ejecuta al destruir el componente.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
   public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    // if (this.datosSolicitud) {
    //   if (!this.datosSolicitud.validarFormularioDatos()) {
    //     isValid = false;
    //   }
    // } else {
    //   isValid = false;
    // }

    if (this.tercerosRelacionadosVistaComponent) {
      if (!this.tercerosRelacionadosVistaComponent.validarContenedor()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.pagoDeDerechosContenedoraComponent) {
      if (!this.pagoDeDerechosContenedoraComponent.validarContenedor()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
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
