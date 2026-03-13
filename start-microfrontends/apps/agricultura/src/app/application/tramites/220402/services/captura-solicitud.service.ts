import { DestinatarioRespuesta } from '../models/pantallas-captura.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Solicitud220402State } from '../estados/tramites/tramites220402.store';
import { Solicitud220402Store } from '../estados/tramites/tramites220402.store';
/**
 * @class CapturaSolicitudeService
 * @description Servicio encargado de gestionar la captura de datos relacionados con el trámite 220402.
 * 
 * Este servicio proporciona métodos para actualizar el estado del formulario en el store y obtener datos desde archivos JSON locales, como el catálogo de bancos y el registro de toma de muestras de mercancías.
 */
@Injectable({
  providedIn: 'root',
})
export class CapturaSolicitudeService {
  constructor(private http: HttpClient, private tramite220402Store: Solicitud220402Store) { }
  /**
   * @method actualizarEstadoFormulario
   * @description Actualiza el estado del formulario en el store con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: Solicitud220402State): void {
    this.tramite220402Store.setTipoDeCertificado(DATOS.tipoDeCertificado);
    this.tramite220402Store.setPuntoDestino(DATOS.puntoDestino);
    this.tramite220402Store.setSeccionAduanera(DATOS.seccionAduanera);
    this.tramite220402Store.setPaisDeDestino(DATOS.paisDeDestino);
    this.tramite220402Store.setPaisDeProcedencia(DATOS.paisDeProcedencia);
    this.tramite220402Store.setRangoDeFechas(DATOS.rangoDeFechas);
    this.tramite220402Store.setFechaInicio(DATOS.fechaInicio);
    this.tramite220402Store.setFechaFinal(DATOS.fechaFinal);
    this.tramite220402Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite220402Store.setDescdelaFraccion(DATOS.descdelaFraccion);
    this.tramite220402Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite220402Store.setUMT(DATOS.UMT);
    this.tramite220402Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite220402Store.setUMC(DATOS.UMC);
    this.tramite220402Store.setPaisdeOrigen(DATOS.paisdeOrigen);
    this.tramite220402Store.setEntidadFederativadeOrigen(DATOS.entidadFederativadeOrigen);
    this.tramite220402Store.setMunicipiodeOrigen(DATOS.municipiodeOrigen);
    this.tramite220402Store.setMarcasDistintivas(DATOS.marcasDistintivas);
    this.tramite220402Store.setUSO(DATOS.USO);
    this.tramite220402Store.setNumero(DATOS.numero);
    this.tramite220402Store.setEmpaques(DATOS.empaques);
    this.tramite220402Store.setUnidadDeVerificar(DATOS.unidadDeVerificar);
    this.tramite220402Store.setTerceroEspecialista(DATOS.terceroEspecialista);
    this.tramite220402Store.setEntidadFederative(DATOS.entidadFederative);
    this.tramite220402Store.setFitosanitario(DATOS.fitosanitario);
    this.tramite220402Store.setDatosGeneralesArr(DATOS.datosGeneralesArr);
    this.tramite220402Store.setMediodeTransporte(DATOS.mediodeTransporte);
    this.tramite220402Store.setIdentificacionDelTransporte(DATOS.identificacionDelTransporte);
    this.tramite220402Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite220402Store.setNombre(DATOS.nombre);
    this.tramite220402Store.setPrimerApellido(DATOS.primerApellido);
    this.tramite220402Store.setSegundoApellido(DATOS.segundoApellido);
    this.tramite220402Store.setDenominacion(DATOS.denominacion);
    this.tramite220402Store.setPais(DATOS.pais);
    this.tramite220402Store.setDomicilio(DATOS.domicilio);
    this.tramite220402Store.setLada(DATOS.lada);
    this.tramite220402Store.setTelefono(DATOS.telefono);
    this.tramite220402Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite220402Store.setExentoDePago(DATOS.exentoDePago);
    this.tramite220402Store.setCadenaDependencia(DATOS.cadenaDependencia);
    this.tramite220402Store.setBanco(DATOS.banco);
    this.tramite220402Store.setllaveDePago(DATOS.llaveDePago);
    this.tramite220402Store.setFechaPago(DATOS.fechaPago);
    this.tramite220402Store.setJustificacion(DATOS.justificacion);
    this.tramite220402Store.setClaveDeReferencia(DATOS.claveDeReferencia);
    this.tramite220402Store.setImportePago(DATOS.importePago);
    this.tramite220402Store.setDestinatario(DATOS.destinatario);
    this.tramite220402Store.setNombreComun(DATOS.nombreComun);
    this.tramite220402Store.setNombreCientifico(DATOS.nombreCientifico);
    this.tramite220402Store.setDescripcionProducto(DATOS.descripcionProducto);
  }

  /**
   * @method getBanco
   * @description Obtiene los datos del catálogo de bancos desde un archivo JSON local.
   */
  getBanco(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220402/banco.json');
  }
  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud220402State> {
    return this.http.get<Solicitud220402State>('assets/json/220402/registro_220402.json');
  }
  /**
   * Obtiene la lista de destinatarios desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de destinatarios almacenados
   * en un archivo JSON local y los devuelve como un observable.
   * 
   * @returns {Observable<DestinatarioRespuesta>} Observable que emite la respuesta con la lista de destinatarios.
   */
  obtenerDestinatario(): Observable<DestinatarioRespuesta> {
    return this.http.get<DestinatarioRespuesta>('assets/json/220402/destinatario.json');
  }
}
