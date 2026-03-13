import { Solicitud130118State, Tramite130118Store } from '../estados/tramites/tramite130118.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

/**
 * Servicio para gestionar operaciones relacionadas con el trámite 130118.
 * Proporciona métodos para obtener catálogos y actualizar el estado del formulario.
 */
@Injectable({
  providedIn: 'root'
})
export class PeximService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a recursos externos.
   * @param tramite130118Store Store para actualizar el estado global del trámite 130118.
   */
  constructor(
    private http: HttpClient,
    private tramite130118Store: Tramite130118Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado global del formulario con los datos proporcionados.
   * @param DATOS Objeto con los datos del formulario de tipo Solicitud130118State.
   */
  actualizarEstadoFormulario(DATOS: Solicitud130118State): void {
    this.tramite130118Store.setRegimenMercancia(DATOS.regimenMercancia);
    this.tramite130118Store.setClasifiRegimen(DATOS.clasifiRegimen);
    this.tramite130118Store.setValueTA(DATOS.valueTA);
    this.tramite130118Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite130118Store.setNico(DATOS.nico);
    this.tramite130118Store.setUnidadMedidaTarifaria(DATOS.unidadMedidaTarifaria);
    this.tramite130118Store.setCantidadTarifaria(DATOS.cantidadTarifaria);
    this.tramite130118Store.setValorFacturaUSD(DATOS.valorFacturaUSD);
    this.tramite130118Store.setPrecioUnitarioUSD(DATOS.precioUnitarioUSD);
    this.tramite130118Store.setPaisOrigen(DATOS.paisOrigen);
    this.tramite130118Store.setPaisDestino(DATOS.paisDestino);
    this.tramite130118Store.setLote(DATOS.lote);
    this.tramite130118Store.setFechaSalida(DATOS.fechaSalida);
    this.tramite130118Store.setObservaciones(DATOS.observaciones);
    this.tramite130118Store.setObservacionMerc(DATOS.observacionMerc);
    this.tramite130118Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite130118Store.setNombre(DATOS.nombre);
    this.tramite130118Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite130118Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite130118Store.setRazonSocial(DATOS.razonSocial);
    this.tramite130118Store.setDomicilio(DATOS.domicilio);
    this.tramite130118Store.setEstado(DATOS.estado);
    this.tramite130118Store.setRepresentacionFederal(DATOS.representacionFederal);
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * @returns Observable con los datos del formulario.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud130118State> {
    return this.http.get<Solicitud130118State>('assets/json/130118/registro_toma_muestras_mercancias.json');
  }

  /**
   * Obtiene el catálogo de régimen de mercancía.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getRegimenMercancia(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/regimen-mercancia.json');
  }

  /**
   * Obtiene el catálogo de clasificación de régimen.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getClasifiRegimen(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/clasifi-regimen.json');
  }

  /**
   * Obtiene el catálogo de fracción arancelaria.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getFraccionArancelariaCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/fraccion-arancelaria-catalogo.json');
  }

  /**
   * Obtiene el catálogo de NICO.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getNicoCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/nico-catalogo.json');
  }

  /**
   * Obtiene el catálogo de país de origen.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getPaisOrigenCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/pais-origen-catalogo.json');
  }

  /**
   * Obtiene el catálogo de país de destino.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getPaisDestinoCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/pais-destino-catalogo.json');
  }

  /**
   * Obtiene el catálogo de estados.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getEstadoCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/estado.json');
  }

  /**
   * Obtiene el catálogo de molinos.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getMolinoCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/molino.json');
  }

  /**
   * Obtiene el catálogo de unidad de medida tarifaria.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getUnidadMedidaTarifariaCatalogo(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/unidad-medida-tarifaria.json');
  }

  /**
   * Obtiene el catálogo de representación federal.
   * @param _catalogo Identificador del catálogo (no utilizado en la consulta local).
   * @returns Observable con la respuesta del catálogo.
   */
  getRepresentacionFederal(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/representacion-federal.json');
  }

  /**
   * Obtiene los documentos seleccionados.
   * @returns Observable con la respuesta de los documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/130118/documentos-seleccionados.json');
  }

}