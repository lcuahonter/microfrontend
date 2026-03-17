import {
  CONFIGURACION_ANEXOS_IMMEX,
  CONFIGURACION_FEDERETARIOS,
  CONFIGURACION_MANUFACTURERA,
  CONFIGURACION_OPERACIONES
} from '../../constantes/modificacion.enum';
import {
  Complimentaria,
  DatosDelModificacion,
  DatosImmex,
  Federetarios,
  Notario,
  Operacions,
} from '../../models/plantas-consulta.model';
import { Component, OnDestroy } from '@angular/core';
import { SolicitanteQuery, SolicitanteState, doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementariaComponent } from '../../../../shared/components/complementaria/complementaria.component';
import { ConfiguracionColumna } from '../../models/configuracio-columna.model';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { Plantas } from '../../../../shared/models/complementaria.model';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Store } from '../../estados/tramite80308.store';

/**
 * @component
 * @name DatosComplimentariaComponent
 * @description Componente para la gestión de datos complementarios
 */
@Component({
  selector: 'app-datos-complimentaria',
  templateUrl: './datos-complimentaria.component.html',
  styleUrl: './datos-complimentaria.component.scss',
  standalone: true,
  imports: [CommonModule, ComplementariaComponent],
  providers: [ModificacionSolicitudeService, ToastrService],
})
/**
 * @class DatosComplimentariaComponent
 * @implements OnDestroy
 */
export class DatosComplimentariaComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * @public
   * @type {Subject<void>}
   */
  /**
   * @property {Subject<void>} destroyNotifier$
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla para los federetarios.
   * @type {ConfiguracionColumna<Federetarios>[]}
   */
  /**
   * @property {ConfiguracionColumna<Federetarios>[]} configuracionFederetios
   */
  configuracionFederetios: ConfiguracionColumna<Federetarios>[] =
    CONFIGURACION_FEDERETARIOS;

  /**
   * Configuración de las columnas de la tabla para los anexos de importación.
   * @type {ConfiguracionColumna<DatosImmex>[]}
   */
  /**
   * @property {ConfiguracionColumna<DatosImmex>[]} configuracionTablaImmex
   */
  configuracionTablaImmex: ConfiguracionColumna<DatosImmex>[] =
    CONFIGURACION_ANEXOS_IMMEX;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * @type {Federetarios[]}
   */
  /**
   * @property {Federetarios[]} datosFederetarios
   */
  datosFederetarios: Federetarios[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  /**
   * @property {Operacions[]} datosOperacions
   */
  datosOperacions: Operacions[] = [];

  /**
   * Datos de la complimentaria obtenidos desde el servicio.
   * @type {Complimentaria[]}
   */
  /**
   * @property {Complimentaria[]} datosComplimentaria
   */
  datosComplimentaria: Complimentaria[] = [];

  /**
   * Datos de los anexos de fracción obtenidos desde el servicio.
   * @type {FracciónArancelaria[]}
   */
  /**
   * @property {DatosImmex[]} datosImmex
   */
  datosImmex: DatosImmex[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  /**
   * @property {Plantas[]} datosManufacturera
   */
  datosManufacturera: Plantas[] = [];

  /**
   * Arreglo que contiene los datos de modificación relacionados con los servicios.
   *
   * @type {DatosDelModificacion[]}
   */
  /**
   * @property {DatosDelModificacion[]} datosServicios
   */
  datosServicios: DatosDelModificacion[] = [];

  /**
   * Configuración de las columnas de la tabla para las operaciones.
   * @type {ConfiguracionColumna<Operacions>[]}
   */
  /**
   * @property {ConfiguracionColumna<Operacions>[]} configuracionOperacion
   */
  configuracionOperacion: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_OPERACIONES;

  /**
   * Configuración de las columnas de la tabla para las plantas manufacturera.
   * @type {ConfiguracionColumna<Plantas>[]}
   */
  configuracionManufacturera: ConfiguracionColumna<Plantas>[] = CONFIGURACION_MANUFACTURERA

      /**
   * Identificador de la solicitud en formato arreglo de números.
   * Se utiliza para almacenar los ID de solicitud como arreglo de números.
   * 
   * @type {number[]}
   * @memberof DatosComplimentariaComponent
   */
  /**
   * @property {number[]} buscarIdSolicitud
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

  /**   * Valor del formulario de certificación SAT.
   * @type {string}
   */
  /**
   * @property {string} formValue
   */
  formValue:string = '';

    /**
   * Estado de datos del solicitante
   * 
   * @type {SolicitanteState}
   * @memberof ModificacionComponent
   */
  /**
   * @property {SolicitanteState} solicitanteState
   */
  solicitanteState!: SolicitanteState;

  /**
   * Constructor de la clase DatosComplimentariaComponent.
   * @param modificionService Servicio para manejar las solicitudes de modificación.
   * @param toastr Servicio para mostrar notificaciones.
   */
  /**
   * @constructor
   */
  constructor(
    public modificionService: ModificacionSolicitudeService,
    public toastr: ToastrService,
    public solicitanteQuery: SolicitanteQuery,
    public tramiteStore: Tramite80308Store
  ) {
    this.solicitanteQuery.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitanteState = seccionState;
      })
    )
    .subscribe();
    this.obtenerBuscaIdSolicitud();
    this.obtenerCertificacionSAT();
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
            this.buscarIdSolicitud = RESPONSE.datos.buscaIdSolicitud ? RESPONSE.datos.buscaIdSolicitud.split(',').map((id: string) => Number(id.trim())).filter((id:number) => id !== 0) : [];
            this.buscarIdSolicitudString = RESPONSE.datos?.buscaIdSolicitud.split(',')
              .map((id:string) => id.trim())
              .filter((id:string) => id !== '' && id !== '0') // remove empty and zero
              .join(',');
            this.obtenerComplimentaria()
            this.obtenerFederetarios()
            this.obtenerOperacions()
            this.obtenerImmexdata()
            this.obtenerManufacturera()
            this.obtenerServicios()
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
   */
  /**
   * @method obtenerComplimentaria
   */
  obtenerComplimentaria(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud
    };
    this.modificionService
      .obtenerSocioAccionista80308(PAYLOAD) // Llama al servicio para obtener los datos de complimentaria.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosComplimentaria = RESPONSE.datos.filter(
                (item: Complimentaria) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosSocios(this.datosComplimentaria);
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
   */
  /**
   * @method obtenerFederetarios
   */
  obtenerFederetarios(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud
    };
    this.modificionService
      .obtenerBuscarNotarios(PAYLOAD) // Llama al servicio para obtener los datos de federetarios.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              const DATOS: Federetarios[] = [];
              RESPONSE.datos.forEach((item: Notario) => {
                const DATA = {
                  nombre: item?.nombreNotario ?? '',
                  apellidoPrimer: item?.apellidoMaterno ?? '',
                  apellidoSegundo: item?.apellidoPaterno ?? '',
                  numeroActa: item?.numeroActa ?? '',
                  fetchActa: item?.fechaActa ?? '',
                  numeroNotaria: item?.numeroNotaria ?? '',
                  municipioDelegacion: item?.delegacionMunicipio ?? '',
                  estado: item?.entidadFederativa ?? '',
                };
                DATOS.push(DATA);
              });
              this.datosFederetarios = DATOS.filter(
                (item: Federetarios) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosFederetarios(this.datosFederetarios);
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
   */
  /**
   * @method obtenerOperacions
   */
  obtenerOperacions(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud
    };
    this.modificionService
      .obtenerOperacions(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosOperacions = RESPONSE.datos.filter(
                (item: Operacions) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosOperaciones(this.datosOperacions);
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
  obtenerImmexdata(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitudString };
    this.modificionService
      .obtenerSubmanufacturera(PARAMS) // Llama al servicio para obtener los anexos.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosImmex = RESPONSE.datos.filter(
                (item: DatosImmex) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosEmpresas(this.datosImmex);
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
    this.modificionService
      .obtenerManufacturera(PARAMS) // Llama al servicio para obtener los datos de manufacturera.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosManufacturera = RESPONSE.datos.filter(
                (item: Operacions) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosPlantas(this.datosManufacturera);
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
    this.modificionService
      .obtenerServiciosImmex(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosServicios = RESPONSE.datos.filter(
                (item: DatosDelModificacion) => Object.values(item).some(value => value !== null)
              );
              this.tramiteStore.setDatosServiciosImmex(this.datosServicios);
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
    this.modificionService.obtenerDatosCertificacionSat(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if (esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            this.formValue = RESPONSE.datos.certificacionSAT;
            this.tramiteStore.setCertificacionSAT(this.formValue);
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
  /**
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
