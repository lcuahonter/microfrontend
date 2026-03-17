import {
  Solicitud220503State,
  Solicitud220503Store,
} from '../estados/tramites220503.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoDeDerechos } from '../models/pago-de-derechos.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TercerosrelacionadosdestinoTable } from '../../../shared/models/tercerosrelacionados.model';

@Injectable({
  providedIn: 'root',
})
export class Solocitud220503Service {
    /**
   * URL base para los archivos JSON de catálogos.
   * @property {string}
   */
  url: string = 'assets/json/220503/';

  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor de la clase.
   *
   * Inyecta los servicios necesarios para realizar peticiones HTTP y
   * para gestionar el estado de la solicitud mediante el store.
   *
   * @param http Cliente HTTP de Angular para realizar solicitudes al backend.
   * @param solicitud220503Store Store encargado de manejar el estado de la solicitud 220503.
   */
  constructor(
    private http: HttpClient,
    private solicitud220503Store: Solicitud220503Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store `solicitud220503Store`
   * utilizando los datos proporcionados en el objeto `DATOS`.
   *
   * Este método asigna cada propiedad del estado recibido a su correspondiente
   * método setter en el store, asegurando que el estado de la solicitud esté sincronizado.
   *
   * @param DATOS Objeto de tipo `Solicitud220503State` que contiene toda la información del formulario.
   */
  actualizarEstadoFormulario(DATOS: Solicitud220503State): void {
    this.solicitud220503Store.setCertificadosAutorizados(
      DATOS.certificadosAutorizados
    );
    this.solicitud220503Store.setMercancia(DATOS.mercancia);
    this.solicitud220503Store.setHoraDeInspeccion(DATOS.horaDeInspeccion);
    this.solicitud220503Store.setAduanaDeIngreso(DATOS.aduanaDeIngreso);
    this.solicitud220503Store.setSanidadAgropecuaria(DATOS.sanidadAgropecuaria);
    this.solicitud220503Store.setPuntoDeInspeccion(DATOS.puntoInspeccion);
    this.solicitud220503Store.setFechaDeInspeccion(DATOS.fechaDeInspeccion);
    this.solicitud220503Store.setNombre(DATOS.nombre);
    this.solicitud220503Store.setPrimerapellido(DATOS.primerapellido);
    this.solicitud220503Store.setSegundoapellido(DATOS.segundoapellido);
    this.solicitud220503Store.setTipocontenedor(DATOS.tipocontenedor);
    this.solicitud220503Store.setTransporteIdMedio(DATOS.transporteIdMedio);
    this.solicitud220503Store.setIdentificacionTransporte(
      DATOS.identificacionTransporte
    );
    this.solicitud220503Store.setEsSolicitudFerros(DATOS.esSolicitudFerros);
    this.solicitud220503Store.setTotalDeGuiasAmparadas(
      DATOS.totalDeGuiasAmparadas
    );
    this.solicitud220503Store.setFoliodel(DATOS.foliodel);
    this.solicitud220503Store.setAduanaIngreso(DATOS.aduanaIngreso);
    this.solicitud220503Store.setOficinaInspeccion(DATOS.oficinaInspeccion);
    this.solicitud220503Store.setPuntoInspeccion(DATOS.puntoInspeccion);
    this.solicitud220503Store.setClaveUCON(DATOS.claveUCON);
    this.solicitud220503Store.setEstablecimientoTIF(DATOS.establecimientoTIF);
    this.solicitud220503Store.setNumeroguia(DATOS.numeroguia);
    this.solicitud220503Store.setRegimen(DATOS.regimen);
    this.solicitud220503Store.setMovilizacion(DATOS.movilizacion);
    this.solicitud220503Store.setTransporte(DATOS.transporte);
    this.solicitud220503Store.setNombreEmpresa(DATOS.nombreEmpresa);
    this.solicitud220503Store.setPunto(DATOS.punto);
    this.solicitud220503Store.setExentoPagoNo(DATOS.exentoPagoNo);
    this.solicitud220503Store.setJustificacion(DATOS.justificacion);
    this.solicitud220503Store.setClaveReferencia(DATOS.claveReferencia);
    this.solicitud220503Store.setCadenaDependencia(DATOS.cadenaDependencia);
    this.solicitud220503Store.setBanco(DATOS.banco);
    this.solicitud220503Store.setIlavePago(DATOS.llavePago);
    this.solicitud220503Store.setImportePago(DATOS.importePago);
    this.solicitud220503Store.updateTercerosRelacionados(DATOS.tercerosRelacionados);
    this.solicitud220503Store.updatedatosForma(DATOS.datosForma); 
    this.solicitud220503Store.actualizarSelectedTerceros(
      DATOS.selectedTerceros
    );
    this.solicitud220503Store.actualizarSelectedExdora(
      DATOS.seletedExdora
    );
    this.solicitud220503Store.actualizarPagoDeDerechos(DATOS.pagoDeDerechos);
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   *
   * Realiza una solicitud HTTP GET para recuperar un archivo JSON local
   * que contiene la estructura del estado `Solicitud220503State`.
   *
   * @returns Un observable que emite los datos del tipo `Solicitud220503State`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud220503State> {
    return this.http.get<Solicitud220503State>(
      'assets/json/220503/registro_toma_muestras_mercancias.json'
    );
  }

     /**
     * Actualiza la lista de terceros relacionados con la solicitud.
     * @method updateTercerosRelacionados
     * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de terceros.
     * @memberof CertificadoZoosanitarioServiceService
     */
      updateTercerosRelacionado(tercerosRelacionados: TercerosrelacionadosdestinoTable[]): void {
        this.solicitud220503Store.updateTercerosRelacionados(tercerosRelacionados);
      }
           /**
            * @description Obtiene todos los datos del formulario como observable.
            * @returns {Observable<ListaDeDatosFinal>} Observable con todos los datos del formulario.
            */
            getAllDatosForma(): Observable<Solicitud220503State> {
              return this.solicitud220503Store._select(state => state); 
            }
              /**
               * Actualizar el formulario de pago en el store.
               * @method actualizarFormularioPago
               * @param formularioPago Datos del formulario de pago.
               * @returns {void}
               */
              public actualizarPagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
                this.solicitud220503Store.actualizarPagoDeDerechos(pagoDeDerechos);
              }
              /**
               * Obtiene los detalles de un catálogo desde un archivo JSON.
               * @method obtenerDetallesDelCatalogo
               * @param nombreDelArchivo Nombre del archivo JSON del catálogo.
               * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
               */
              obtenerDetallesDelCatalogo(nombreDelArchivo: string): Observable<RespuestaCatalogos> {
                const BASEURL: string = this.url + nombreDelArchivo;
                return this.http.get<RespuestaCatalogos>(BASEURL);
              }
}
