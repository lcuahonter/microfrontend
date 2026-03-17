import { DatosDelMercancia, RespuestaMercancia } from '../models/modificacion-donaciones-immex.model';
import { ENVIRONMENT, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Solicitud11102StaObjResp, Solicitud11102State, Tramite11102Store } from '../estados/tramite11102.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
/**
 * Servicio para gestionar las operaciones relacionadas con la retirada de la autorización de donaciones.
 */
@Injectable({
  providedIn: 'root'
})
export class ModificacionDonacionesImmexService {
  /**
    * Constructor que se utiliza para la inyección de dependencias.
    * @param http Servicio HTTP para realizar solicitudes a recursos externos.
    * @param store Store de Akita para gestionar el estado del trámite.
    */
  constructor(private http: HttpClient, private tramite11102Store: Tramite11102Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }
 
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  /**
   * Obtiene el catálogo de aduanas por las que ingresará la mercancía.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/aduanaIngresara.json');
  }
 
  /**
   * Obtiene el catálogo de tipos de mercancía.
   * @returns Observable con la respuesta del catálogo de tipos de mercancía.
   */
  getTipoDeMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/tipo-de-mercancia.json');
  }
 
  /**
   * Obtiene el catálogo de condiciones de la mercancía.
   * @returns Observable con la respuesta del catálogo de condiciones de la mercancía.
   */
  getCondicionMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/condicion-mercancia.json');
  }
 
  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/unidad-medida.json');
  }
 
  /**
   * Obtiene el catálogo de años disponibles.
   * @returns Observable con la respuesta del catálogo de años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/ano.json');
  }
 
  /**
   * Obtiene el catálogo de países disponibles.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/11102/pais.json');
  }
 
  /**
   * Obtiene los datos relacionados con las mercancías.
   * @returns Observable con la respuesta de los datos de mercancías.
   */
  agregarMercancias(): Observable<RespuestaMercancia> {
    return this.http.get<RespuestaMercancia>('assets/json/11102/mercanciaDatos.json');
  }

  /**
   * Obtiene los datos relacionados con las mercancías para la tabla.
   * @returns Observable con la respuesta de los datos de mercancías.
   */
  obtenerMercanciaDatos(): Observable<DatosDelMercancia[]> {
    return this.http.get<DatosDelMercancia[]>('assets/json/11102/mercancia-table.json');
  }
 
  /**
* Actualiza el estado del formulario en el store con los datos proporcionados.
* @param DATOS Objeto con los datos del formulario de tipo Solicitud10301State.
*/
 
  public actualizarEstadoFormulario(DATOS: Solicitud11102State): void {
    this.tramite11102Store.setAduana(DATOS.aduana);
    this.tramite11102Store.setOrganismoPublico(DATOS.organismoPublico);
    this.tramite11102Store.setTipoDeMercancia(DATOS.tipoDeMercancia);
    this.tramite11102Store.setUnidadMedida(DATOS.unidadMedida);
    this.tramite11102Store.setCondicionMercancia(DATOS.condicionMercancia);
    this.tramite11102Store.setAno(DATOS.ano ?? '');
    this.tramite11102Store.setCantidad(DATOS.cantidad);
    this.tramite11102Store.setMarca(DATOS.marca);
    this.tramite11102Store.setModelo(DATOS.modelo);
    this.tramite11102Store.setPais(DATOS.pais ?? '');
    this.tramite11102Store.setUsoEspecifico(DATOS.usoEspecifico);
    this.tramite11102Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite11102Store.setRfc(DATOS.rfc);
    this.tramite11102Store.setNumeroProgramaImmex(DATOS.numeroProgramaImmex);
    this.tramite11102Store.setCorreoElectronicoOpcional(DATOS.correoElectronicoOpcional);
    this.tramite11102Store.setTelefonoOpcional(DATOS.telefonoOpcional);
    this.tramite11102Store.setDelMercancia(DATOS.datosDelMercancia ?? []);
  }
 
  /**
 * Obtiene los datos del aviso de renovación desde un archivo JSON local.
 * @returns Un observable con los datos del estado de la solicitud (Solicitud11102StaObjResp).
 */
 
  public getDatosDeTrtamitelDoc(): Observable<Solicitud11102StaObjResp> {
    return this.http.get<Solicitud11102StaObjResp>('assets/json/11102/datos-del-tramite.json');
  }
}