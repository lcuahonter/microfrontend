import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Solicitud31803State, Tramite31803Store } from '../state/Tramite31803.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Representa la respuesta de datos de una solicitud relacionada con un pago realizado.
 *
 * Esta interfaz es comúnmente utilizada para mostrar o validar la información de pagos en el sistema.
 */
export interface SolicitudDatosResponse {
  /**
   * Número único que identifica la operación del pago.
   * Puede ser proporcionado por el banco o el sistema de pago.
   */
  numeroOperacion: string;

  /**
   * Nombre del banco en el que se realizó el pago.
   * Ejemplo: "BBVA", "Santander", "Banorte".
   */
  banco: string;

  /**
   * Llave única o folio de la transacción bancaria.
   * Usada como referencia para el cruce con plataformas como VUCEM.
   */
  llave: string;

  /**
   * Primer manifiesto o folio que respalda la operación de pago.
   * Puede estar vinculado a un documento de aduana o trámite de exportación.
   */
  manifiesto1: string;

  /**
   * Segundo manifiesto adicional relacionado con la operación de pago.
   * Puede ser utilizado para complementar la trazabilidad.
   */
  manifiesto2: string;

  /**
   * Fecha en la que se realizó el pago, usualmente en formato ISO (ej. '2025-07-03').
   */
  fechaPago: string;
}

/**
 * Servicio para gestionar las operaciones relacionadas con la solicitud del trámite 31803.
 * Proporciona métodos para obtener datos necesarios desde fuentes externas.
 */
@Injectable({
  providedIn: 'root',
})
export class RegistroSolicitudService {

  /**
    * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
    */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * Se utiliza para la inyección de dependencias.
   *
   * @param http Cliente HTTP para realizar solicitudes a servicios externos.
   */
  constructor(
    private http: HttpClient,
    private tramite31803Store: Tramite31803Store, // Asumiendo que este es un servicio relacionado con el trámite 31803
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

/**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param DATOS Objeto con los datos del formulario de tipo Solicitud10301State.
   */

  public actualizarEstadoFormulario(DATOS: Solicitud31803State): void {
    this.tramite31803Store.setNumeroOficio(DATOS.numeroOficio);
    this.tramite31803Store.setCadenaDependencia(DATOS.cadenaDependencia);
    this.tramite31803Store.setImportePago(DATOS.importePago);
    this.tramite31803Store.setFechaInicial(DATOS.fechaInicial);
    this.tramite31803Store.setFechaFinal(DATOS.fechaFinal);
    this.tramite31803Store.setClaveReferencia(DATOS.claveReferencia);
    this.tramite31803Store.setBanco(DATOS.banco);
    this.tramite31803Store.setNumeroOperacion(DATOS.numeroOperacion);
    this.tramite31803Store.setLlave(DATOS.llave);
    this.tramite31803Store.setManifiesto1(DATOS.manifiesto1);
    this.tramite31803Store.setManifiesto2(DATOS.manifiesto2);
    this.tramite31803Store.setFechaPago(DATOS.fechaPago);
  }

  /**
   * Obtiene los datos del catálogo de bancos.
   * Realiza una solicitud HTTP para obtener la lista de bancos desde un archivo JSON.
   *
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo`.
   */
  obtenerDatosBanco(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/31803/banco.json');
  }

/**
 * Obtiene los datos de la solicitud desde un archivo JSON.
 * Realiza una solicitud HTTP para obtener un arreglo de objetos de tipo `Catalogo`
 * desde el archivo 'solicitud-banco.json'.
 *
 * @returns Un observable que emite una lista de objetos de tipo `Catalogo`.
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud31803State> {
    return this.http.get<Solicitud31803State>('assets/json/31803/solicitud-banco.json');
  }
}
