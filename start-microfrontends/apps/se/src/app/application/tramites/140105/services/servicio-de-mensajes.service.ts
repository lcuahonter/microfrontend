import { Cancelacion, PermisosDatos } from '../models/cancelacion-de-solicitus.model';
import { DesistimientoDePermisoState, DesistimientoStore } from '../estados/desistimiento-de-permiso.store';
import { Observable, Subject } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



/**
 * Interface para el payload de búsqueda de permisos de cancelación
 */
export interface BuscarPermisoCancelacionPayload {
  id_solicitud: number;
  rfc_solicitante: string;
  clave_entidad_federativa: string;
  id_tipo_tramite: number;
  folio_cancelar: string;
}

/**
 * Interface para la respuesta de búsqueda de permisos
 */
export interface BuscarPermisoResponse {
  datos: Cancelacion[];
  codigo: string;
  mensaje: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ServicioDeMensajesService {
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
   * URL del servidor donde se encuentra la API.
   */
  private readonly host: string;

/**
   * @description Service constructor.
   * Initializes the service and provides access to the DesistimientoStore.
   * 
   * @param {DesistimientoStore} desistimientoStore - Store responsible for managing form data.
   * @param {HttpClient} http - HTTP client for making API requests.
   */
  constructor(
    private readonly desistimientoStore: DesistimientoStore,
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
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
  establecerDatosDePermiso(valor: boolean): void{
    this.datosDePermiso.next(valor);
  }

   /**
   * Método para actualizar los datos del formulario de desistimiento en el store.
   * Envía un array de objetos de tipo Cancelacion al store para actualizar el estado 
   * de los datos relacionados.
   * 
   * @param valor Array de objetos de tipo Cancelacion con los nuevos datos del formulario.
   */
  actualizarDatosForma(valor: Cancelacion[]):void{
    this.desistimientoStore.actualizarDatosForma(valor as Cancelacion[]);
  }

   /**
   * Método para obtener los datos del store.
   * Devuelve el estado completo de los permisos de desistimiento desde el store.
   * 
   * @returns Un observable que emite el estado completo de los permisos de desistimiento.
   */
  public obtenerDatos(): Observable<PermisosDatos> {
    return this.desistimientoStore._select(state => state); // Devuelve el estado completo
  }

   /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado parcial del desistimiento con la información a actualizar en el store.
 */
actualizarEstadoFormulario(DATOS: Partial<DesistimientoDePermisoState>): void {
  this.desistimientoStore.update((state) => ({
    ...state,
    ...DATOS
  }));
}

/**
Obtiene los datos simulados para el registro de toma de muestras de mercancías.
Realiza una solicitud HTTP al archivo 'requestCancallar.json' ubicado en la carpeta de assets.
Devuelve un observable que emite el estado de la solicitud de cancelación.
@returns {Observable<CancelarSolicitudState>} Observable que emite los datos del estado de la solicitud de cancelación. */
getRegistroTomaMuestrasMercanciasData(): Observable<PermisosDatos> {
  return this.http.get<PermisosDatos>('assets/json/140105/permisosCancelar.json');
}

/**
 * Carga los datos simulados desde un archivo JSON
 * y los actualiza en el store.
 */
cargarDatosSimulados(): void {
  this.getRegistroTomaMuestrasMercanciasData().subscribe((respuesta) => {
    this.desistimientoStore.update((state) => ({
      ...state,
      ...respuesta
    }));
  });
}

/**
 * Busca permisos para cancelación basado en el payload proporcionado.
 * Envía una solicitud POST al endpoint de búsqueda de permisos.
 * 
 * @param {BuscarPermisoCancelacionPayload} payload - Datos necesarios para buscar el permiso
 * @returns {Observable<BaseResponse<BuscarPermisoResponse>>} Observable con la respuesta del servidor
 */
buscarPermisoCancelacion(payload: BuscarPermisoCancelacionPayload): Observable<BaseResponse<BuscarPermisoResponse>> {
  const ENDPOINT = `${this.host}sat-t140105/solicitud/buscar`;
  
  return this.http.post<BaseResponse<BuscarPermisoResponse>>(ENDPOINT, payload);
}

/**
 * Obtiene los datos de permisos disponibles para cancelación.
 * Similar al método postServiciosAutorizadosTabla del ServiciosService.
 * 
 * @param {string} tramite - ID del trámite (140105)
 * @param {BuscarPermisoCancelacionPayload} payload - Payload con los datos de búsqueda
 * @returns {Observable<BaseResponse<Cancelacion[]>>} Observable con los datos de permisos
 */
obtenerPermisosParaCancelacion(tramite: string, payload: BuscarPermisoCancelacionPayload): Observable<BaseResponse<Cancelacion[]>> {
  const ENDPOINT = `${this.host}tramites/${tramite}/permisos-disponibles`;
  
  return this.http.post<BaseResponse<Cancelacion[]>>(ENDPOINT, payload);
}

/**
 * Valida si un folio de trámite existe y está disponible para cancelación.
 * 
 * @param {string} folioTramite - El folio del trámite a validar
 * @returns {Observable<BaseResponse<{ valido: boolean; datos?: Cancelacion }>>} Observable con el resultado de la validación
 */
validarFolioTramite(folioTramite: string): Observable<BaseResponse<{ valido: boolean; datos?: Cancelacion }>> {
  const ENDPOINT = `${this.host}tramites/140105/validar-folio`;
  
  return this.http.post<BaseResponse<{ valido: boolean; datos?: Cancelacion }>>(ENDPOINT, { 
    folioTramite 
  });
}

/**
 * Guarda los datos de la solicitud.
 * @param {string} tramite - El ID del trámite.
 * @param {any} payload - Los datos a guardar.
 * @returns {Observable<BaseResponse<any>>} - Observable con la respuesta del servidor.
 */
postGuardarDatos<T>(
  tramite: string,
  payload: T
): Observable<BaseResponse<T>> {
  const ENDPOINT = `${this.host}sat-t${tramite}/solicitud/guardar`;
  return this.http.post<BaseResponse<T>>(ENDPOINT, payload);
}

/**
 * Genera un mensaje de error formateado similar al del ServiciosService.
 * 
 * @param {string} mensaje - El mensaje de error a mostrar
 * @returns {string} HTML formateado con el mensaje de error
 */
static generarAlertaDeError(mensaje: string): string {
  const ALERTA = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3 border-danger text-danger rounded">
    <div class="mb-2 text-secondary">Corrija los siguientes errores:</div>
    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">${mensaje}</span>
    </div>  
  </div>
</div>
`;
  return ALERTA;
}

}