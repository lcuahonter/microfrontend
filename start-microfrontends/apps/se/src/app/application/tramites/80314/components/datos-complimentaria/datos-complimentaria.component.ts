import {
  CONFIGURACION_ACCIONISTAS,
  CONFIGURACION_EMPRESAS,
  CONFIGURACION_FEDERETARIOS,
  CONFIGURACION_OPERACIONES,
  CONFIGURACION_PLANTA,
  CONFIGURACION_SERVICIOS,
} from '../../constantes/modificacion.enum';
import {
  Complimentaria,
  Federetarios,
  Operacions,
} from '../../estados/models/plantas-consulta.model';
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  TablaDinamicaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '../../estados/models/cambio-de-modalidad.model';
import { DatosCertificacionComponent } from '../datos-certificacion/datos-certificacion.component';
import { DatosDelModificacion } from '../../estados/models/datos-tramite.model';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datos-complimentaria',
  templateUrl: './datos-complimentaria.component.html',
  styleUrl: './datos-complimentaria.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    DatosCertificacionComponent,
    TablaDinamicaComponent,
  ],
  providers: [ImmerModificacionService, ToastrService],
})
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
   * @type {ConfiguracionColumna<Federetarios>[]}
   */
  configuracionFederetios: ConfiguracionColumna<Federetarios>[] =
    CONFIGURACION_FEDERETARIOS;

  /**
   * Configuración de las columnas de la tabla para las operaciones.
   * @type {ConfiguracionColumna<Operacions>[]}
   */
  configuracionOperacion: ConfiguracionColumna<Operacions>[] =
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
  configuracionEmpresas: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_EMPRESAS;

  /**
   * Configuración de las columnas para los datos de modificación.
   *
   * Esta propiedad utiliza una configuración predefinida (`CONFIGURACION_SERVICIOS`)
   * para definir las columnas que se mostrarán en el componente.
   * Cada columna está configurada utilizando el tipo `ConfiguracionColumna<DatosDelModificacion>`.
   */
  configuracionServicios: ConfiguracionColumna<DatosDelModificacion>[] =
    CONFIGURACION_SERVICIOS;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * @type {Federetarios[]}
   */
  datosFederetarios: Federetarios[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  datosOperacions: Operacions[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  datosPlanta: Operacions[] = [];

  /**
   * Arreglo que contiene los datos de modificación relacionados con los servicios.
   *
   * @type {DatosDelModificacion[]}
   */
  datosServicios: DatosDelModificacion[] = [];

  /**
   * Datos de la complimentaria obtenidos desde el servicio.
   * @type {Complimentaria[]}
   */
  datosComplimentaria: Complimentaria[] = [];

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
    private toastr: ToastrService
  ) {
    this.obtenerFederetarios(); // Carga los federetarios.
    this.obtenerOperacions(); // Carga las operaciones.
    this.obtenerPlanta(); // Carga las plata.
    this.obtenerComplimentaria(); // Carga los datos de complimentaria.
    this.obtenerServicios(); // Carga los servicios.
  }

  /**
   * Método que obtiene los datos de complimentaria desde el servicio.
   * Asigna los datos obtenidos a la variable `datosComplimentaria`.
   */
  obtenerComplimentaria(): void {
    this.solicitudService
      .obtenerComplimentaria() // Llama al servicio para obtener los datos de complimentaria.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data: Complimentaria[]) => {
          this.datosComplimentaria = [...data]; // Almacena los datos de complimentaria.
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
  obtenerFederetarios(): void {
    this.solicitudService
      .obtenerFederetarios() // Llama al servicio para obtener los datos de federetarios.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data: Federetarios[]) => {
          this.datosFederetarios = [...data]; // Almacena los datos de federetarios.
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
  obtenerOperacions(): void {
    this.solicitudService
      .obtenerOperacion() // Llama al servicio para obtener los datos de operaciones.
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
      .subscribe(
        (data: Operacions[]) => {
          this.datosOperacions = [...data]; // Almacena los datos de operaciones.
        },
        () => {
          this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
        }
      );
  }

  /**
   * Obtiene los datos de las operaciones de la planta desde el servicio correspondiente.
   *
   * Este método realiza una llamada al servicio `solicitudService` para obtener los datos
   * de las operaciones de la planta. Los datos obtenidos se almacenan en la propiedad
   * `datosPlanta`. En caso de error, se muestra un mensaje de error utilizando `toastr`.
   *
   * La suscripción al observable se gestiona utilizando el operador `takeUntil` para
   * asegurarse de que se cancele automáticamente cuando el componente se destruya.
   *
   * @returns {void} Este método no retorna ningún valor.
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
  obtenerServicios(): void {
    this.solicitudService
      .obtenerServicios()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data: DatosDelModificacion[]) => {
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
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
