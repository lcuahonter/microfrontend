import { CONFIGURACION_ACCIONISTAS, CONFIGURACION_EMPRESAS, CONFIGURACION_FEDERETARIOS, CONFIGURACION_MANUFACTURERA, CONFIGURACION_OPERACIONES, CONFIGURACION_PLANTA, CONFIGURACION_SERVICIOS } from '../../constantes/modificacion.enum';
import { Complimentaria, FederetariosDatos, Operacions } from '../../estados/models/plantas-consulta.model';
import { Component, Input, OnDestroy } from '@angular/core';
import { DatosEmpresa, DatosServicios, OperacionsImmex, Plantas } from '../../models/datos-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TituloComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { Tramite80306Store, TramiteState } from '../../estados/tramite80306.store';
import { ConfiguracionColumna } from '../../estados/models/cambio-de-modalidad.model';
import { DatosCertificacionComponent } from '../datos-certificacion/datos-certificacion.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80306Query } from '../../estados/tramite80306.query';

/**
 * Componente para gestionar los datos complementarios de la solicitud.
 */
@Component({
  selector: 'app-datos-complimentaria',
  templateUrl: './datos-complimentaria.component.html',
  styleUrl: './datos-complimentaria.component.scss',
  standalone: true,
  imports: [
    TituloComponent,DatosCertificacionComponent,TablaDinamicaComponent
  ],
  providers: [ImmerModificacionService, ToastrService],
})
/**   * Componente DatosComplimentariaComponent.
 * Proporciona la funcionalidad para gestionar los datos complementarios de la solicitud.
 */
export class DatosComplimentariaComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla para los accionistas (Complimentaria).
   * @type {ConfiguracionColumna<Complimentaria>[]}
   */
  configuracionTabla: ConfiguracionColumna<Complimentaria>[] =
    CONFIGURACION_ACCIONISTAS;

  /**
   * Configuración de las columnas de la tabla para los federetarios.
   * @type {ConfiguracionColumna<FederetariosDatos>[]}
   */
  configuracionFederetios: ConfiguracionColumna<FederetariosDatos>[] =
    CONFIGURACION_FEDERETARIOS;

  /**
   * Configuración de las columnas de la tabla para las operaciones.
   * @type {ConfiguracionColumna<Operacions>[]}
   */
  configuracionOperacion: ConfiguracionColumna<OperacionsImmex>[] =
    CONFIGURACION_OPERACIONES;

  /**
   * Configuración de la planta que define las columnas para las operaciones.
   * 
   * @type {ConfiguracionColumna<Operacions>[]} 
   * Contiene la configuración de las columnas basada en la constante `CONFIGURACION_PLANTA`.
   */
  configuracionPlanta: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_PLANTA;

  /**
   * Configuración de las columnas para las operaciones relacionadas con empresas.
   * 
   * @type {ConfiguracionColumna<Operacions>[]} 
   * @description Esta propiedad almacena la configuración de las columnas que se utilizarán
   * para mostrar y gestionar las operaciones de empresas. La configuración se define
   * en la constante `CONFIGURACION_EMPRESAS`.
   */
  configuracionEmpresas: ConfiguracionColumna<DatosEmpresa>[] =
    CONFIGURACION_EMPRESAS;

    
  /**
   * Configuración de las columnas de la tabla para las plantas manufacturera.
   * @type {ConfiguracionColumna<Plantas>[]}
   */
  configuracionManufacturera: ConfiguracionColumna<Plantas>[] = CONFIGURACION_MANUFACTURERA

  /**   * Indica si se deben ocultar las pestañas en la interfaz.
   * @type {boolean}
   */
  @Input() showTabs: boolean = true;

  /**
   * Configuración de las columnas para los datos de modificación.
   * 
   * Esta propiedad utiliza una configuración predefinida (`CONFIGURACION_SERVICIOS`)
   * para definir las columnas que se mostrarán en el componente. 
   * Cada columna está configurada utilizando el tipo `ConfiguracionColumna<DatosServicios>`.
   */
  configuracionServicios: ConfiguracionColumna<DatosServicios>[] =
    CONFIGURACION_SERVICIOS;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * @type {Federetarios[]}
   */
  datosFederetarios: FederetariosDatos[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  datosOperacions: OperacionsImmex[] = [];

  /**
   * Datos de las empresas obtenidos desde el servicio.
   * @type {DatosEmpresa[]}
   */
  datosEmpresas: DatosEmpresa[] = [];

    /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  datosManufacturera: Plantas[] = [];

  /**
   * Arreglo que contiene los datos de modificación relacionados con los servicios.
   * 
   * @type {DatosServicios[]}
   */
  datosServicios: DatosServicios[] = [];

  
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
   * Datos de la complimentaria obtenidos desde el servicio.
   * @type {Complimentaria[]}
   */
  datosComplimentaria: Complimentaria[] = [];

  /**   * Datos de certificación SAT.
   * @type {string | null}
   */
  certificacionSAT: string | null = '';

  /**
   * Constructor de la clase DatosComplimentariaComponent.
   * 
   * @param solicitudService - Servicio utilizado para manejar las solicitudes de modificación.
   * @param toastr - Servicio utilizado para mostrar notificaciones al usuario.
   * 
   * Este constructor inicializa el componente cargando los datos necesarios:
   * - `obtenerFederetarios`: Carga los federatarios.
   * - `obtenerOperacions`: Carga las operaciones.
   * - `obtenerPlanta`: Carga las plantas.
   * - `obtenerComplimentaria`: Carga los datos de complimentaria.
   * - `obtenerServicios`: Carga los servicios.
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
      
    this.obtenerSolicitudId(); // Carga el ID de la solicitud.
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
              this.obtenerComplimentaria();
              this.obtenerFederetarios();
              this.obtenerOperacions();
              this.obtenerEmpresas();
              this.obtenerManufacturera();
              this.obtenerServicios();
              this.obtenerCertificacionSAT();
            }
          },
          () => {
            this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
          }
        );
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
                (obj: Complimentaria) => Object.values(obj).some(value => value !== null)
              );
              this.tramite80306Store.setDatosComplimentaria(this.datosComplimentaria);
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
                (obj: FederetariosDatos) => Object.values(obj).some(value => value !== null)
              ); // Almacena los datos de federetarios.
              this.tramite80306Store.setDatosFederatarios(this.datosFederetarios);
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
              this.tramite80306Store.setDatosOperacions(this.datosOperacions);
            }
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
   * @method obtenerImmexdata
   */
  obtenerEmpresas(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.solicitudService
      .obtenerSubmanufacturera(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosEmpresas = RESPONSE.datos.filter(
                (item: DatosEmpresa) => Object.values(item).some(value => value !== null)
              );
              this.tramite80306Store.setDatosEmpresas(this.datosEmpresas);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los anexos'); // Manejo de errores.
        }
      );
  }

  /**
   * Obtiene los datos de manufacturera desde el servicio.
   * Este método realiza una llamada al servicio `modificionService` para obtener los datos de manufacturera
   * utilizando el ID de solicitud almacenado en `buscarIdSolicitudString`.
   * Los datos obtenidos se filtran para eliminar aquellos con valores nulos y se asignan a la propiedad `datosManufacturera`.
   * En caso de error durante la obtención de los datos, se muestra un mensaje de error al usuario utilizando el servicio `toastr`.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  /**
   * @method obtenerManufacturera
   */
  obtenerManufacturera(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.solicitudService
      .obtenerManufacturera(PARAMS) // Llama al servicio para obtener los datos de manufacturera.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosManufacturera = RESPONSE.datos.filter(
                (item: Plantas) => Object.values(item).some(value => value !== null)
              );
              this.tramite80306Store.setDatosManufacturera(this.datosManufacturera);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los datos de manufacturera'); // Manejo de errores.
        }
      );
  }

  /**
   * Obtiene los servicios relacionados con la solicitud actual.
   *
   * Este método realiza una llamada al servicio `solicitudService` para obtener
   * los datos de las operaciones y los almacena en la propiedad `datosServicios`.
   * Además, gestiona la suscripción para que se cancele automáticamente cuando
   * el componente se destruya, evitando posibles fugas de memoria.
   *
   * En caso de error durante la obtención de los datos, se muestra un mensaje
   * de error al usuario utilizando el servicio `toastr`.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  /**
   * @method obtenerServicios
   */
  obtenerServicios(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud
    };
    this.solicitudService
      .obtenerServiciosImmex(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosServicios = RESPONSE.datos.filter(
                (item: DatosServicios) => Object.values(item).some(value => value !== null)
              );
              this.tramite80306Store.setDatosServicios(this.datosServicios);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
  }

    /**   * Obtiene los datos de certificación SAT desde el servicio.
   *
   * Este método realiza una llamada al servicio `modificionService` para obtener
   * los datos de certificación SAT utilizando el RFC proporcionado.
   * Los datos obtenidos se asignan a la propiedad `formValue`.
   * En caso de error durante la obtención de los datos, se muestra un mensaje de error al usuario utilizando el servicio `toastr`.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  /**
   * @method obtenerCertificacionSAT
   */
  obtenerCertificacionSAT(): void {
    const PARAMS = { rfc: 'AAL0409235E6' };
    this.solicitudService.obtenerDatosCertificacionSat(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if (esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            this.certificacionSAT = RESPONSE.datos.certificacionSAT;
            this.tramite80306Store.setCertificacionSAT(this.certificacionSAT);
          }
        },
        () => {
          this.toastr.error('Error al obtener los datos de certificación SAT.');
        }
      );
  }


  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
