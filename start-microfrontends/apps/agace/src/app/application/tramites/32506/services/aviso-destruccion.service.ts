import {
  AvisoTablaDatos,
  CatalogoLista,
  DatosSolicitante,
  DesperdicioTablaDatos,
  PedimentoTablaDatos,
  ProcesoTablaDatos,
  RespuestaConsulta,
} from '../models/aviso-destruccion.model';
import { Tramite32506State, Tramite32506Store } from '../estados/tramite32506.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado.
 *
 * Este servicio proporciona métodos para obtener datos como catálogos, tablas de aviso,
 * tablas de mercancías, y otros datos necesarios para el trámite 32506.
 */
@Injectable({
  providedIn: 'root',
})
export class AvisoDestruccionService {
  /**
   * Constructor del servicio.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(
    private http: HttpClient,
    public tramite32506Store: Tramite32506Store
  ) {
    // Constructor
  }

  /**
   * Actualiza el estado del formulario en el store con los datos recibidos.
   *
   * @param {Tramite32506Aviso} respuesta - Objeto que contiene toda la información del aviso, desperdicio, pedimento, proceso y domicilio.
   */
  actualizarEstadoFormulario(respuesta: Tramite32506State): void {

    if (!respuesta?.avisoFormulario || !respuesta?.desperdicioFormulario || !respuesta?.pedimentoFormulario || !respuesta?.procesoFormulario || !respuesta?.domicilioFormulario) {
      return;
    }
    this.tramite32506Store.setAvisoFormularioAdace(respuesta.avisoFormulario.adace);
    this.tramite32506Store.setAvisoFormularioCalle(respuesta.avisoFormulario.calle);
    this.tramite32506Store.setAvisoFormularioCodigoPostal(respuesta.avisoFormulario.codigoPostal);
    this.tramite32506Store.setAvisoFormularioColonia(respuesta.avisoFormulario.claveColonia);
    this.tramite32506Store.setAvisoFormularioDelegacionMunicipio(respuesta.avisoFormulario.claveDelegacionMunicipio);
    this.tramite32506Store.setAvisoFormularioEntidadFederativa(respuesta.avisoFormulario.claveEntidadFederativa);
    this.tramite32506Store.setAvisoFormularioFechaTranslado(respuesta.avisoFormulario.fechaTranslado);
    this.tramite32506Store.setAvisoFormularioJustificacion(respuesta.avisoFormulario.justificacion);
    this.tramite32506Store.setAvisoFormularioNombreComercial(respuesta.avisoFormulario.nombreComercial);
    this.tramite32506Store.setAvisoFormularioNumeroExterior(respuesta.avisoFormulario.numeroExterior);
    this.tramite32506Store.setAvisoFormularioNumeroInterior(respuesta.avisoFormulario.numeroInterior);
    this.tramite32506Store.setAvisoFormularioTipoAviso(respuesta.avisoFormulario.tipoAviso);
    this.tramite32506Store.setAvisoFormularioTipoCarga(respuesta.avisoFormulario.tipoCarga);
    this.tramite32506Store.setAvisoFormularioValorAnioProgramaImmex(respuesta.avisoFormulario.valorAnioProgramaImmex);
    this.tramite32506Store.setAvisoFormularioValorProgramaImmex(respuesta.avisoFormulario.valorProgramaImmex);

    this.tramite32506Store.setCantidadDesp(respuesta.desperdicioFormulario.cantidadDesp);
    this.tramite32506Store.setCircunstanciaHechos(respuesta.desperdicioFormulario.circunstanciaHechos);
    this.tramite32506Store.setClaveUnidadMedidaDesp(respuesta.desperdicioFormulario.claveUnidadMedidaDesp);
    this.tramite32506Store.setDescripcionDesperdicio(respuesta.desperdicioFormulario.descripcionDesperdicio);
    this.tramite32506Store.setDescripcionMercancia(respuesta.desperdicioFormulario.descripcionMercancia);

    this.tramite32506Store.setCantidadPedimento(respuesta.pedimentoFormulario.cantidadPedimento);
    this.tramite32506Store.setClaveAduanaPedimento(respuesta.pedimentoFormulario.claveAduanaPedimento);
    this.tramite32506Store.setClaveFraccionArancelariaPedimento(respuesta.pedimentoFormulario.claveFraccionArancelariaPedimento);
    this.tramite32506Store.setClaveUnidadMedidaPedimento(respuesta.pedimentoFormulario.claveUnidadMedidaPedimento);

    this.tramite32506Store.setDescripcionProcesoDestruccion(respuesta.procesoFormulario.descripcionProcesoDestruccion);

    this.tramite32506Store.setDomicilioFormularioCalle(respuesta.domicilioFormulario.calle);
    this.tramite32506Store.setDomicilioFormularioCodigoPostal(respuesta.domicilioFormulario.codigoPostal);
    this.tramite32506Store.setDomicilioFormularioColonia(respuesta.domicilioFormulario.claveColonia);
    this.tramite32506Store.setDomicilioFormularioDelegacionMunicipio(respuesta.domicilioFormulario.claveDelegacionMunicipio);
    this.tramite32506Store.setDomicilioFormularioEntidadFederativa(respuesta.domicilioFormulario.claveEntidadFederativa);
    this.tramite32506Store.setDomicilioFormularioNombreComercial(respuesta.domicilioFormulario.nombreComercial);
    this.tramite32506Store.setDomicilioFormularioNumeroExterior(respuesta.domicilioFormulario.numeroExterior);
    this.tramite32506Store.setDomicilioFormularioNumeroInterior(respuesta.domicilioFormulario.numeroInterior);
    this.tramite32506Store.setDomicilioFormularioRfc(respuesta.domicilioFormulario.rfc);

    this.tramite32506Store.setDatosSolicitante(respuesta.datosSolicitante);
  }

  /**
    * Recupera los datos del formulario desde un archivo JSON local.
    *
    * @returns {Observable<RespuestaConsulta>} Un observable con los datos del trámite 32506 para el aviso.
    */
  guardarDatosFormulario(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(
      `assets/json/32506/tramite-32506-aviso.json`
    );
  }

  /**
 * Obtiene los datos del solicitante.
 *
 * @returns {Observable<DatosSolicitante>} Un observable con los datos del solicitante.
 */
  obtenerDatosSolicitante(): Observable<DatosSolicitante> {
    return this.http.get<DatosSolicitante>(
      `assets/json/32506/datosSolicitante.json`
    );
  }
  /**
   * Obtiene los datos de la tabla de Pedimento.
   *
   * @returns {Observable<PedimentoTablaDatos>} Un observable con los datos de la tabla de Pedimento.
   */
  obtenerPedimentoTabla(): Observable<PedimentoTablaDatos> {
    return this.http.get<PedimentoTablaDatos>(
      `assets/json/32506/pedimento-tabla.json`
    );
  }

  /**
   * Obtiene los datos de la tabla de procesos.
   *
   * @returns {Observable<ProcesoTablaDatos>} Un observable con los datos de la tabla de procesos.
   */
  obtenerProcesoTabla(): Observable<ProcesoTablaDatos> {
    return this.http.get<ProcesoTablaDatos>(
      `assets/json/32506/proceso-tabla.json`
    );
  }

  /**
   * @descripcion Obtiene los datos de la tabla de desperdicio desde un archivo JSON local.
   * @retorno Un observable que emite los datos de la tabla de desperdicio (`DesperdicioTablaDatos`).
   */
  obtenerDesperdicioTabla(): Observable<DesperdicioTablaDatos> {
    return this.http.get<DesperdicioTablaDatos>(
      `assets/json/32506/desperdicio-tabla.json`
    );
  }

  /**
   * Obtiene los datos de la tabla de aviso.
   *
   * @returns {Observable<AvisoTablaDatos>} Un observable con los datos de la tabla de aviso.
   */
  obtenerAvisoTabla(): Observable<AvisoTablaDatos> {
    return this.http.get<AvisoTablaDatos>(`assets/json/32506/aviso-tabla.json`);
  }
  /**
   * Obtiene la lista de colonias.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de colonias.
   */
  obtenerColonias(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(
      `assets/json/32506/entidad-federativa.json`
    );
  }
  /**
   * Obtiene la lista de municipios.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de municipios.
   */
  obtenerMunicipio(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(
      `assets/json/32506/entidad-federativa.json`
    );
  }
  /**
   * Obtiene la lista de entidades federativas.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de entidades federativas.
   */
  obtenerFederativa(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(
      `assets/json/32506/entidad-federativa.json`
    );
  }
  /**
   * Obtiene la lista de unidades de medida.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de unidades de medida.
   */
  obtenerUnidadMedida(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(
      `assets/json/32506/entidad-federativa.json`
    );
  }
  /**
   * Obtiene la lista de fracciones arancelarias.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de fracciones arancelarias.
   */
  obtenerFraccionArancelaria(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(
      `assets/json/32506/entidad-federativa.json`
    );
  }

}
