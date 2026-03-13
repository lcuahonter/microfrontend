import { CONFIGURACION_ACCIONISTAS, CONFIGURACION_EMPRESAS, CONFIGURACION_FEDERETARIOS, CONFIGURACION_OPERACIONES, CONFIGURACION_PLANTA, CONFIGURACION_SERVICIOS } from '../../constantes/modificacion.enum';
import { Complimentaria, DatosSocioAccionista, Notario, Operacions, OperacionsImmex } from '../../estados/models/plantas-consulta.model';
import { Component, OnDestroy } from '@angular/core';
import { DatosDelModificacion, DatosDelModificaciondos } from '../../estados/models/datos-tramite.model';
import { Solicitud80302State, Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';
import { Subject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TituloComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '../../estados/models/cambio-de-modalidad.model';
import { DatosCertificacionComponent } from '../datos-certificacion/datos-certificacion.component';
import { SolicitudService } from '../../service/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80302Query } from '../../../../estados/queries/tramite80302.query';

/**
 * Componente para gestionar los datos de información complementaria del trámite 80302.
 * 
 * @export
 * @class DatosComplimentariaComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-datos-complimentaria',
  templateUrl: './datos-complimentaria.component.html',
  styleUrl: './datos-complimentaria.component.scss',
  standalone: true,
  imports: [
    TituloComponent,DatosCertificacionComponent,TablaDinamicaComponent
  ],
  providers: [SolicitudService, ToastrService],
})
export class DatosComplimentariaComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof DatosComplimentariaComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla para los accionistas (Complimentaria).
   * 
   * @type {ConfiguracionColumna<Complimentaria>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionTabla: ConfiguracionColumna<Complimentaria>[] =
    CONFIGURACION_ACCIONISTAS;

  /**
   * Configuración de las columnas de la tabla para los federetarios.
   * 
   * @type {ConfiguracionColumna<Notario>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionFederetios: ConfiguracionColumna<Notario>[] =
    CONFIGURACION_FEDERETARIOS as ConfiguracionColumna<Notario>[];

  /**
   * Configuración de las columnas de la tabla para las operaciones.
   * 
   * @type {ConfiguracionColumna<OperacionsImmex>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionOperacion: ConfiguracionColumna<OperacionsImmex>[] =
    CONFIGURACION_OPERACIONES as ConfiguracionColumna<OperacionsImmex>[];

  /**
   * Configuración de la planta que define las columnas para las operaciones.
   * Contiene la configuración de las columnas basada en la constante `CONFIGURACION_PLANTA`.
   * 
   * @type {ConfiguracionColumna<Operacions>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionPlanta: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_PLANTA;

  /**
   * Configuración de las columnas para las operaciones relacionadas con empresas.
   * Esta propiedad almacena la configuración de las columnas que se utilizarán
   * para mostrar y gestionar las operaciones de empresas. La configuración se define
   * en la constante `CONFIGURACION_EMPRESAS`.
   * 
   * @type {ConfiguracionColumna<Operacions>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionEmpresas: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_EMPRESAS;

  /**
   * Configuración de las columnas para los datos de modificación.
   * Esta propiedad utiliza una configuración predefinida (`CONFIGURACION_SERVICIOS`)
   * para definir las columnas que se mostrarán en el componente. 
   * Cada columna está configurada utilizando el tipo `ConfiguracionColumna<DatosDelModificacion>`.
   * 
   * @type {ConfiguracionColumna<DatosDelModificacion>[]}
   * @memberof DatosComplimentariaComponent
   */
  configuracionServicios: ConfiguracionColumna<DatosDelModificacion>[] =
    CONFIGURACION_SERVICIOS;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * 
   * @type {Notario[]}
   * @memberof DatosComplimentariaComponent
   */
  datosFederetarios: Notario[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * 
   * @type {OperacionsImmex[]}
   * @memberof DatosComplimentariaComponent
   */
  datosOperacions: OperacionsImmex[] = [];

  /**
   * Datos de las operaciones de planta obtenidos desde el servicio.
   * 
   * @type {Operacions[]}
   * @memberof DatosComplimentariaComponent
   */
  datosPlanta: Operacions[] = [];

  /**
   * Identificador de la solicitud en formato arreglo de números.
   * Se utiliza para almacenar los ID de solicitud como arreglo de números.
   * 
   * @type {number[]}
   * @memberof DatosComplimentariaComponent
   */
  buscarIdSolicitud!: number[];

  /**
   * Arreglo que contiene los datos de modificación relacionados con los servicios.
   * 
   * @type {DatosDelModificacion[]}
   * @memberof DatosComplimentariaComponent
   */
  datosServicios: DatosDelModificacion[] = [];

  /**
   * Datos de la complimentaria obtenidos desde el servicio.
   * 
   * @type {DatosSocioAccionista[]}
   * @memberof DatosComplimentariaComponent
   */
  datosComplimentaria: DatosSocioAccionista[] = [];

  /**
   * Estado actual de la solicitud del trámite 80302
   * @type {Solicitud80302State}
   * @description Almacena el estado completo de la solicitud, incluyendo información
   * relevante para el proceso de firma electrónica y validaciones
   */
  public solicitudState!: Solicitud80302State;

  /**
   * Constructor de la clase DatosComplimentariaComponent.
   * Este constructor inicializa el componente cargando los datos necesarios:
   * - `obtenerSolicitudId`: Obtiene el ID de la solicitud
   * - `obtenerPlanta`: Carga las plantas
   * - `obtenerServicios`: Carga los servicios
   * 
   * @param {SolicitudService} solicitudService - Servicio utilizado para manejar las solicitudes de modificación
   * @param {ToastrService} toastr - Servicio utilizado para mostrar notificaciones al usuario
   * @param {Tramite80302Store} tramite80302Store - Store para gestionar el estado del trámite 80302
   * @memberof DatosComplimentariaComponent
   */
  constructor(
    public solicitudService: SolicitudService,
    private toastr: ToastrService,
    private tramite80302Store: Tramite80302Store,
    private tramite80302Query: Tramite80302Query
  ) { 
    this.tramite80302Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
    this.obtenerSolicitudId()
    this.obtenerPlanta(); // Carga las plata.
    this.obtenerServicios(); // Carga los servicios.
  }


  /**
   * Método que obtiene los datos de complimentaria desde el servicio.
   * Asigna los datos obtenidos a la variable `datosComplimentaria`.
   * 
   * @returns {void}
   * @memberof DatosComplimentariaComponent
   */
  obtenerComplimentaria(): void {
    const PAYLOAD ={
      idSolicitud: this.buscarIdSolicitud
    }
    this.solicitudService
      .obtenerBuscarSocioAccionista(PAYLOAD) // Llama al servicio para obtener los datos de complimentaria.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (response) => {
          if(esValidObject(response)) {
            const RESPONSE = doDeepCopy(response);
            if(esValidArray(RESPONSE.datos)) {
              this.datosComplimentaria = RESPONSE.datos.filter(
                (obj: DatosSocioAccionista) => Object.values(obj).some(value => value !== null)
              );
              this.tramite80302Store.setDatosComplimentaria(this.datosComplimentaria);
            }
          }
          
        },
        () => {
          this.toastr.error('Error al cargar los datos de complimentaria'); // Manejo de errores.
        }
      );
  }

  /**
   * Método que obtiene los datos de federetarios desde el servicio.
   * Asigna los datos obtenidos a la variable `datosFederetarios`.
   * 
   * @returns {void}
   * @memberof DatosComplimentariaComponent
   */
  obtenerFederetarios(): void {
    const PAYLOAD ={
      idSolicitud: this.buscarIdSolicitud
    }
    this.solicitudService
      .obtenerBuscarNotarios(PAYLOAD) // Llama al servicio para obtener los datos de federetarios.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosFederetarios = RESPONSE.datos.filter(
                (obj: Notario) => Object.values(obj).some(value => value !== null)
              ); // Almacena los datos de federetarios.
              this.tramite80302Store.setDatosFederatarios(this.datosFederetarios);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los federetarios'); // Manejo de errores.
        }
      );
  }

  /**
   * Método que obtiene los datos de operaciones desde el servicio.
   * Asigna los datos obtenidos a la variable `datosOperacions`.
   * 
   * @returns {void}
   * @memberof DatosComplimentariaComponent
   */
  obtenerOperacions(): void {
    const PAYLOAD ={
      idSolicitud: this.buscarIdSolicitud
    }
    this.solicitudService
      .obtenerOperacionImmex(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosOperacions = RESPONSE.datos.filter(
                (obj: OperacionsImmex) => Object.values(obj).some(value => value !== null)
              ); // Almacena los datos de operaciones.
              this.tramite80302Store.setDatosOperacions(this.datosOperacions);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
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
            this.obtenerComplimentaria();
            this.obtenerFederetarios();
            this.obtenerOperacions();
          }
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
  }

  /**
   * Obtiene los datos de las operaciones de la planta desde el servicio correspondiente.
   * Este método realiza una llamada al servicio `solicitudService` para obtener los datos
   * de las operaciones de la planta. Los datos obtenidos se almacenan en la propiedad
   * `datosPlanta`. En caso de error, se muestra un mensaje de error utilizando `toastr`.
   * La suscripción al observable se gestiona utilizando el operador `takeUntil` para
   * asegurarse de que se cancele automáticamente cuando el componente se destruya.
   * 
   * @returns {void} Este método no retorna ningún valor
   * @memberof DatosComplimentariaComponent
   */
  obtenerPlanta(): void {
    this.solicitudService
      .obtenerPlanta() // Llama al servicio para obtener los datos de operaciones.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data: Operacions[]) => {
          this.datosPlanta = [...data]; // Almacena los datos de operaciones.
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
  }

  /**
   * Obtiene los servicios relacionados con la solicitud actual.
   * Este método realiza una llamada al servicio `solicitudService` para obtener
   * los datos de las operaciones y los almacena en la propiedad `datosServicios`.
   * Además, gestiona la suscripción para que se cancele automáticamente cuando
   * el componente se destruya, evitando posibles fugas de memoria.
   * En caso de error durante la obtención de los datos, se muestra un mensaje
   * de error al usuario utilizando el servicio `toastr`.
   * 
   * @returns {void} Este método no devuelve ningún valor
   * @memberof DatosComplimentariaComponent
   */
  obtenerServicios(): void {
    this.solicitudService.obtenerServicios().pipe(takeUntil(this.destroyNotifier$)).subscribe((data: DatosDelModificaciondos[]) => {
          this.datosServicios = [...data]; // Almacena los datos de operaciones.
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
  }


  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   * 
   * @returns {void}
   * @memberof DatosComplimentariaComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
