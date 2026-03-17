import { CONFIGURACION_ANEXOS_IMPORTACION, CONFIGURACION_ANEXOS_SENSIBLES, CONFIGURACION_ANEXOS_TABLA } from '../../constantes/modificacion.enum';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite80306Store, TramiteState } from '../../estados/tramite80306.store';
import { Anexo } from '../../estados/models/plantas-consulta.model';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ProductoExportacion } from '../../models/datos-tramite.model';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { Tramite80306Query } from '../../estados/tramite80306.query';

/**
 * Componente para mostrar y gestionar los datos de anexos en el trámite 80306.
 * importación y datos sensibles, así como para interactuar con el estado del trámite.
 */
@Component({
  selector: 'app-datos-anexos',
  templateUrl: './datos-anexos.component.html',
  styleUrl: './datos-anexos.component.scss',
  standalone: true,
  imports: [TablaDinamicaComponent, TituloComponent],
})
/** * Clase que implementa el componente DatosAnexosComponent.
 * Proporciona funcionalidades para gestionar y mostrar los datos de anexos
 * relacionados con el trámite 80306, incluyendo productos de exportación,
 * productos de importación y datos sensibles.
 */
export class DatosAnexosComponent implements OnDestroy, OnInit {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**   * Indica si se deben ocultar las pestañas en la interfaz.
     * @type {boolean}
     */
    @Input() showTabs: boolean = true;

  /**
   * Configuración de las columnas de la tabla para los anexos.
   * @type {ConfiguracionColumna<Anexo>[]}
   */
  configuracionTablaAnexo: ConfiguracionColumna<ProductoExportacion>[] =
    CONFIGURACION_ANEXOS_TABLA;

  /**
   * Configuración de las columnas de la tabla para los anexos de importación.
   * @type {ConfiguracionColumna<Anexo>[]}
   */
  configuracionTablaImportacion: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_IMPORTACION;

    /**
   * Configuración de las columnas de la tabla para los anexos de importación.
   * @type {ConfiguracionColumna<Anexo>[]}
   */
  configuracionTablaSensibles: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_SENSIBLES;

  /**
   * Datos de los anexos obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  datosExportacion: ProductoExportacion[] = [];

  /**
   * Datos de los anexos de importación obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  datosImportacion: Anexo[] = [];

  /**
   * Lista de anexos que contienen datos sensibles.
   * 
   * @remarks
   * Esta propiedad almacena los objetos de tipo `Anexo` que han sido identificados como sensibles.
   * Se utiliza para gestionar y mostrar información que requiere un tratamiento especial debido a su naturaleza confidencial.
   */
  datosFraccion: Anexo[] = []; 

   /**
     * Estado actual de la solicitud del trámite 80302
     * @type {TramiteState}
     * @description Almacena el estado completo de la solicitud, incluyendo información
     * relevante para el proceso de firma electrónica y validaciones
     */
    public solicitudState!: TramiteState;

    
    /**
   * Identificador de la solicitud en formato arreglo de números.
   * Se utiliza para almacenar los ID de solicitud como arreglo de números.
   * 
   * @type {number[]}
   * @memberof DatosComplimentariaComponent
   */
  buscarIdSolicitud!: number[];

        /**
   * Identificador de la solicitud en formato cadena.
   * Se utiliza para almacenar el ID de solicitud como cadena.
   * @type {string}
   * @memberof DatosComplimentariaComponent
   */
  /**
   * @property {string} buscarIdSolicitudString
   */
  buscarIdSolicitudString!: string;

  /**
   * Constructor del componente DatosAnexosComponent.
   * @param solicitudService Servicio para manejar las solicitudes relacionadas con modificaciones.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   * @param tramite80306Query Consulta para el estado del trámite 80306.
   * @param tramite80306Store Almacenamiento para el estado del trámite 80306.
   */
  constructor(
    public solicitudService: ImmerModificacionService,
    private toastr: ToastrService,
    private tramite80306Query: Tramite80306Query,
    private tramite80306Store: Tramite80306Store,
  ) {
    this.tramite80306Query.selectSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    ).subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama a la función para obtener el ID de la solicitud y cargar los datos relacionados.
   */
  ngOnInit(): void {
    this.obtenerSolicitudId(); // Carga los anexos complementarios.
  }

     /**
       * Obtiene el ID de la solicitud desde el servicio.
       * Almacena el ID en la propiedad `buscarIdSolicitud` y llama a los métodos
       * para obtener los datos relacionados.
       * 
       * @returns {void}
       * @memberof DatosComplimentariaComponent
       */
      obtenerSolicitudId(): void {
        const PAYLOAD = {
          "idPrograma": this.solicitudState.selectedIdPrograma,
          "tipoPrograma": this.solicitudState.selectedTipoPrograma
        };
        this.solicitudService
          .obtenerSolicitudId(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
          .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
          .subscribe(
            (data) => {
              if(esValidObject(data)) {
                const RESPONSE = doDeepCopy(data);
                this.buscarIdSolicitud = RESPONSE.datos.buscaIdSolicitud ? RESPONSE.datos.buscaIdSolicitud.split(',').map((id: string) => Number(id.trim())).filter((id:number) => id !== 0) : [];
                this.buscarIdSolicitudString = RESPONSE.datos?.buscaIdSolicitud.split(',')
                .map((id:string) => id.trim())
                .filter((id:string) => id !== '' && id !== '0') // remove empty and zero
                .join(',');
                this.obteneProductosExportacion();
                this.obteneProductosImportacion();
                this.obteneComplementaria();
              }
            },
            () => {
              this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
            }
          );
      }
  

/**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   */
  /**
   * @method obteneProductosExportacion
   */
  obteneProductosExportacion(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.solicitudService
      .obtenerProductosExportacion(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosExportacion = RESPONSE.datos;
              this.tramite80306Store.setDatosExportacion(this.datosExportacion);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los anexos'); // Manejo de errores.
        }
      );
  }

    /**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   */
  /**
   * @method obteneProductosImportacion
   */
  obteneProductosImportacion(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.solicitudService
      .obtenerProductosImportacion(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosImportacion = RESPONSE.datos;
              this.tramite80306Store.setDatosImportacion(this.datosImportacion);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los anexos'); // Manejo de errores.
        }
      );
  }

   /**
   * Método que obtiene los anexos complementarios desde el servicio.
   * Asigna los datos a las variables `datosAnexo` y `datosImportacion`.
   */
  /**
   * @method obteneComplementaria
   */
  obteneComplementaria(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.solicitudService
      .obtenerFraccionesSensibles(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosFraccion = RESPONSE.datos;
              this.tramite80306Store.setDatosFraccion(this.datosFraccion);
            }
          }
          
        },
        () => {
          this.toastr.error('Error al cargar los anexos'); // Manejo de errores.
        }
      );
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }
}
