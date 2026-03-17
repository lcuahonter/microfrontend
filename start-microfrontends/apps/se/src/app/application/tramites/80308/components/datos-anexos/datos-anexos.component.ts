import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Anexo } from '../../../../shared/models/anexos.model';
import { AnexosComponent } from '../../../../shared/components/anexos/anexos.component';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Store } from '../../estados/tramite80308.store';

/**
 * @component
 * @name DatosAnexosComponent
 * @description Componente para la gestión de datos de anexos
 */
@Component({
  selector: 'app-datos-anexos',
  templateUrl: './datos-anexos.component.html',
  styleUrl: './datos-anexos.component.scss',
  standalone: true,
  imports: [
    AnexosComponent
  ],
  providers: [ModificacionSolicitudeService, ToastrService],
})
/**
 * @class DatosAnexosComponent
 * @implements OnDestroy
 */
export class DatosAnexosComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  /**
   * @property {Subject<void>} destroyNotifier$
   */
  destroyNotifier$: Subject<void> = new Subject();
   
  /**
   * Datos de los anexos obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  /**
   * @property {Anexo[]} datosAnexo
   */
  datosAnexo: Anexo[] = [];

  /**
   * Datos de los anexos de importación obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  /**
   * @property {Anexo[]} datosImportacion
   */
  datosImportacion: Anexo[] = [];

  /**
   * Datos de los anexos de fracción arancelaria obtenidos desde el servicio.
   * @type {Anexo[]}
   */
  /**
   * @property {Anexo[]} datosFraccion
   */
  datosFraccion: Anexo[] = [];
 
  /**
   * Identificador de la solicitud en formato cadena.
   * Se utiliza para almacenar el ID de solicitud como cadena.
   * @type {string}
   * @memberof DatosAnexosComponent
   */
  /**
   * @property {string} buscarIdSolicitudString
   */
  buscarIdSolicitudString!: string;

  /**
   * Constructor del componente DatosAnexosComponent.
   * @param modificionService Servicio para manejar las solicitudes de modificación.
   * @param toastr Servicio para mostrar notificaciones.
   */
  /**
   * @constructor
   */
  constructor(
    public modificionService: ModificacionSolicitudeService,
    private toastr: ToastrService,
    private tramiteStore: Tramite80308Store
  ) {
    this.obtenerBuscaIdSolicitud()
  }

  /**
     * Obtiene el ID de la solicitud desde el servicio.
     * Este método realiza una llamada al servicio `modificionService` para obtener
     * el ID de la solicitud utilizando parámetros predefinidos.
     * Los IDs obtenidos se procesan y almacenan en las propiedades `buscarIdSolicitud` y `buscarIdSolicitudString`.  
     * En caso de error durante la obtención de los datos, se muestra un mensaje de error al usuario utilizando el servicio `toastr`.
     *
     * @returns {void} Este método no devuelve ningún valor.
     */
  /**
   * @method obtenerBuscaIdSolicitud
   */
  obtenerBuscaIdSolicitud(): void {
      const PAYLOAD = {
        "idPrograma": "121880",
        "tipoPrograma": "TICPSE.IMMEX"
      };
      this.modificionService
        .obtenerBuscaSolicitudId(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
        .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
        .subscribe(
          (data) => {
            if(esValidObject(data)) {
              const RESPONSE = doDeepCopy(data);
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
    this.modificionService
      .obtenerProductosExportacion(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosAnexo = RESPONSE.datos;
              this.tramiteStore.setDatosExportacion(this.datosAnexo);
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
    this.modificionService
      .obtenerProductosImportacion(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosImportacion = RESPONSE.datos;
              this.tramiteStore.setDatosImportacion(this.datosImportacion);
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
    this.modificionService
      .obtenerFraccionesSensibles(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosFraccion = RESPONSE.datos;
              this.tramiteStore.setDatosFraccion(this.datosFraccion);
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
  /**
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }
}
