import {
  API_POST_SOLICITUD_GUARDAR,
  COMUN_URL,
} from '@libs/shared/data-access-user/src/core/servers/api-router';
import { Observable, Subject } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Injectable } from '@angular/core';

import {
  Cancelacion,
  PermisosDatos,
} from '../models/cancelacion-de-solicitus.model';
import { DesistimientoStore } from '../estados/desistimiento-de-permiso.store';
import { HttpClient } from '@angular/common/http';
import { Solicitud140104State } from '../estados/desistimiento-de-permiso.store';

@Injectable({
  providedIn: 'root',
})
export class ServicioDeMensajesService {
  host: string;
  /**
   * @description Subject that acts as the source of boolean messages.
   * It is used to communicate state changes or signals across the application.
   * @type {Subject<boolean>}
   */
  private fuenteDelMensaje = new Subject<boolean>();
  /**
   * @description Observable that emits messages to subscribers.
   * Components can subscribe to this observable to react to state changes.
   * @type {Observable<boolean>}
   */
  mensaje$ = this.fuenteDelMensaje.asObservable();
  /**
   * @description Subject that manages permission data updates.
   * Used to notify subscribers about changes in permission data state.
   * @type {Subject<boolean>}
   */
  private datosDePermiso = new Subject<boolean>();

  /**
   * @description Observable that emits permission data status to subscribers.
   * @type {Observable<boolean>}
   */
  datos$ = this.datosDePermiso.asObservable();
  /**
   * @description Service constructor.
   * Initializes the service and provides access to the DesistimientoStore.
   *
   * @param {DesistimientoStore} desistimientoStore - Store responsible for managing form data.
   */
  constructor(
    private readonly desistimientoStore: DesistimientoStore,
    private http: HttpClient
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Método para enviar un mensaje de tipo booleano a los suscriptores.
   * Este mensaje puede ser utilizado para comunicar estados o señales dentro de la aplicación.
   *
   * @param mensaje El valor booleano que se enviará a los suscriptores.
   */
  enviarMensaje(mensaje: boolean): void {
    // Emite el mensaje a todos los suscriptores del observable
    this.fuenteDelMensaje.next(mensaje);
  }

  /**
   * Método para establecer el estado de los datos de permiso.
   * Envía un valor booleano a los suscriptores indicando si los datos de permiso
   * están disponibles o no.
   *
   * @param valor El valor booleano que se enviará para indicar el estado de los datos de permiso.
   */
  establecerDatosDePermiso(valor: boolean): void {
    this.datosDePermiso.next(valor);
  }

  /**
   * Método para actualizar los datos del formulario de desistimiento en el store.
   * Envía un array de objetos de tipo Cancelacion al store para actualizar el estado
   * de los datos relacionados.
   *
   * @param valor Array de objetos de tipo Cancelacion con los nuevos datos del formulario.
   */
  actualizarDatosForma(valor: Cancelacion[]): void {
    this.desistimientoStore.actualizarDatosForma(valor as Cancelacion[]);
  }

  /**
   * Método para obtener los datos del store.
   * Devuelve el estado completo de los permisos de desistimiento desde el store.
   *
   * @returns Un observable que emite el estado completo de los permisos de desistimiento.
   */
  public obtenerDatos(): Observable<Cancelacion[]> {
    return this.desistimientoStore._select(
      (state) => state.cuerpoTablaCancelacion
    ); // Devuelve solo la propiedad 'cuerpoTablaCancelacion'
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Partial<Solicitud140104State>): void {
    this.desistimientoStore.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
Obtiene los datos simulados para el registro de toma de muestras de mercancías.
Realiza una solicitud HTTP al archivo 'requestCancallar.json' ubicado en la carpeta de assets.
Devuelve un observable que emite el estado de la solicitud de cancelación.
@returns {Observable<CancelarSolicitudState>} Observable que emite los datos del estado de la solicitud de cancelación. */
  getRegistroTomaMuestrasMercanciasData(): Observable<PermisosDatos> {
    return this.http.get<PermisosDatos>(
      'assets/json/140104/permisosCancelar.json'
    );
  }

  /**
   * Obtiene los datos simulados para los servicios del formulario.
   * Realiza una solicitud HTTP al archivo 'datos-del-formulario.json' ubicado en la carpeta de assets.
   * Devuelve un observable que emite el estado de la solicitud del formulario.
   * @returns {Observable<Solicitud140104State>} Observable que emite los datos del estado del formulario.
   */
  getServiciosData(): Observable<Solicitud140104State> {
    return this.http.get<Solicitud140104State>(
      'assets/json/140105/datos-del-formulario.json'
    );
  }

  /**
   * Carga los datos simulados desde un archivo JSON
   * y los actualiza en el store.
   */
  cargarDatosSimulados(): void {
    this.getRegistroTomaMuestrasMercanciasData().subscribe((respuesta) => {
      this.desistimientoStore.update((state) => ({
        ...state,
        ...respuesta,
      }));
    });
  }

  /*
   * Guarda los datos de la solicitud.
   * @param {number} tramite - El ID del trámite.
   * @param {any} payload - Los datos a guardar.
   * @returns {Observable<BaseResponse<any>>} - Observable con la respuesta del servidor.
   */

  postGuardarDatos<T>(
    tramite: string,
    payload: T
  ): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_POST_SOLICITUD_GUARDAR(tramite)}`;
    return this.http.post<BaseResponse<T>>(ENDPOINT, payload);
  }
}
