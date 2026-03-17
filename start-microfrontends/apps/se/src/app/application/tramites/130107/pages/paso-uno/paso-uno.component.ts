import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, JSONResponse } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite130107Query } from '../../../../estados/queries/tramite130107.query';
import { Tramite130107Store } from '../../../../estados/tramites/tramite130107.store';

/**
 * @component PasoUnoComponent
 * @description
 * Componente encargado de gestionar el primer paso del trámite 130107.
 * Este paso incluye la lógica para manejar la navegación entre subtítulos o secciones
 * dentro del primer paso del trámite.
 *
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
/**
 * @class PasoUnoComponent
 * @implements OnInit, OnDestroy
 * @description
 * Componente que gestiona el primer paso del trámite 130107.
 * Incluye la lógica para manejar la navegación entre subtítulos o secciones
 * dentro del primer paso del trámite.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() consultaState!: ConsultaioState;

  /**
   * @property indice
   * @description
   * Variable utilizada para almacenar el índice del subtítulo o sección activa.
   *
   * @type {number}
   */
  public indice: number = 1;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   * @property esDatosRespuesta
   * @type {boolean} 
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente SolicitudComponent.
   * Se utiliza para acceder a las funcionalidades del componente de solicitud.
   * @type {SolicitudComponent}
   */
  @ViewChild(SolicitudComponent, { static: false })
  solicitudComponent!: SolicitudComponent;

  /** 
   * Subject para notificar la destrucción del componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor del componente `PasoUnoComponent`.
   * @param datosDeLaSolicitudService Servicio para gestionar los datos de la solicitud.
   * @param consultaQuery Servicio para gestionar el estado de la consulta.
   */
  constructor(
    private datosDeLaSolicitudService: DatosDeLaSolicitudService,
    private consultaQuery: ConsultaioQuery,
    private tramite130107Store: Tramite130107Store,
    private tramite130107Query: Tramite130107Query,
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   *
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se deben mostrar los datos de respuesta.
   *
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState?.update) {
            // this.guardarDatosFormulario();
            this.tramite130107Store.actualizarEstado({ idSolicitud: Number(this.consultaState.id_solicitud) });
            this.getMostrarDatos(Number(this.consultaState.id_solicitud));
            // this.tramite130107Store.actualizarEstado({ idSolicitud: Number(203053665) });
            // this.getMostrarDatos(Number(203053665));
            
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
* Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
* Si la respuesta es válida, activa el indicador de datos cargados.
*/
  getMostrarDatos(idSolicitud: number): void {
    this.datosDeLaSolicitudService.getMostrarPartidasService(idSolicitud).pipe(takeUntil(this.destroyNotifier$)).subscribe((resp: JSONResponse) => {
      if (resp && resp.codigo === '00' && resp.datos) {
        const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
        this.esDatosRespuesta = true;
        if (DATOS) {
          const MAPPED_DATA = this.datosDeLaSolicitudService.reverseBuildSolicitud130113(DATOS as Record<string, unknown[]>);
          this.datosDeLaSolicitudService.actualizarEstadoFormulario(resp.datos as unknown as Record<string, unknown[]>);
          this.solicitudComponent.loadCatalogos(MAPPED_DATA);
        } else {
          this.esDatosRespuesta = false;
        }
      }

    });
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  // guardarDatosFormulario(): void {
  //   this.datosDeLaSolicitudService
  //     .getImportacionDefinitivaData()
  //     .pipe(takeUntil(this.destroyNotifier$))
  //     .subscribe((resp) => {
  //       if (resp) {
  //         this.esDatosRespuesta = true;
  //         // Object.entries(resp).forEach(([key, value]) => {
  //         //   this.datosDeLaSolicitudService.actualizarEstadoFormulario(
  //         //     key,
  //         //     value
  //         //   );
  //         // });
  //       }
  //     });
  // }

  /**
   * @method seleccionaTab
   * @description
   * Método utilizado para establecer el índice del subtítulo o sección activa.
   * Cambia el valor de la propiedad `indice` según el número proporcionado.
   *
   * @param i Índice del subtítulo o sección a activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Detalles:
   * - Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores que el componente está siendo destruido.
   * - Completa el observable para liberar recursos y evitar fugas de memoria.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
