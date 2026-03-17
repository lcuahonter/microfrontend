import { Tramite250101State,Tramite250101Store } from '../estados/tramite250101.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @class FloraFaunaService
 * @description
 * Servicio encargado de realizar solicitudes HTTP para obtener datos relacionados 
 * con el trámite 250101. Proporciona métodos para recuperar información de diferentes 
 */
@Injectable({
  providedIn: 'root'
})
export class FloraFaunaService {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /** URL base para obtener catálogos JSON auxiliares */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

    /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(private http: HttpClient, private tramite250101Store: Tramite250101Store) { 
    // Lógica de inicialización si es necesario
  }

/**
 * Actualiza el estado del formulario con los datos proporcionados.
 *
 * @param DATOS - Objeto que contiene el nuevo estado del trámite (Tramite270201State).
 */
  actualizarEstadoFormulario(DATOS: Tramite250101State): void {
    if(DATOS.tipoAduana){
      this.tramite250101Store.establecerTipoAduana(DATOS.tipoAduana);
    }
     if(DATOS.tipoInspectoria){
      this.tramite250101Store.establecerTipoInspectoria(DATOS.tipoInspectoria);
    }
    if(DATOS.tipoMunicipio){
      this.tramite250101Store.establecerTipoMunicipio(DATOS.tipoMunicipio);
    }
    this.tramite250101Store.establecerDestinatarioDenominacion(DATOS.destinatarioDenominacion);
    if(DATOS.destinatarioPais){
      this.tramite250101Store.establecerDestinatarioPais(DATOS.destinatarioPais);
    }
    if(DATOS.destinatarioEstado){
      this.tramite250101Store.establecerDestinatarioEstado(DATOS.destinatarioEstado);
    }
    this.tramite250101Store.establecerDestinatarioCodigoPostal(DATOS.destinatarioCodigoPostal);
    this.tramite250101Store.establecerDestinatarioDomicilio(DATOS.destinatarioDomicilio);
    this.tramite250101Store.establecerAgenteAduanalNombre(DATOS.agenteAduanalNombre);
    this.tramite250101Store.establecerAgenteAduanalPrimerApellido(DATOS.agenteAduanalPrimerApellido);
    this.tramite250101Store.establecerAgenteAduanalSegundoApellido(DATOS.agenteAduanalSegundoApellido);
    this.tramite250101Store.establecerAgenteAduanalPatente(DATOS.agenteAduanalPatente);
    this.tramite250101Store.establecerDestinatario(DATOS.destinatarioRowData);
    this.tramite250101Store.establecerAgenteAduanal(DATOS.agenteAduanalRowData);
    this.tramite250101Store.setClave(DATOS.clave);
    this.tramite250101Store.setBanco(DATOS.banco);
    this.tramite250101Store.setLlave(DATOS.llave);
    this.tramite250101Store.setFecha(DATOS.fecha);
    this.tramite250101Store.setImporte(DATOS.importe);
    this.tramite250101Store.setRevisados(DATOS.revisados);
    this.tramite250101Store.setMedio(DATOS.medio);
    this.tramite250101Store.setIdentificacion(DATOS.identificacion);
    this.tramite250101Store.setEconomico(DATOS.economico);
    this.tramite250101Store.setPlaca(DATOS.placa);
    this.tramite250101Store.setNumero(DATOS.numero);
    this.tramite250101Store.setFechas(DATOS.fechas);
    this.tramite250101Store.setRequisito(DATOS.requisito);
    this.tramite250101Store.setArancelaria(DATOS.arancelaria);
    this.tramite250101Store.setCantidad(DATOS.cantidad);
    this.tramite250101Store.setMedida(DATOS.medida);
    this.tramite250101Store.setGenero(DATOS.genero);
    this.tramite250101Store.setEspecie(DATOS.especie);
    this.tramite250101Store.setComun(DATOS.comun);
    this.tramite250101Store.setOrigen(DATOS.origen);
    this.tramite250101Store.setProcedencia(DATOS.procedencia);
    this.tramite250101Store.setDescripcion(DATOS.descripcion);
    this.tramite250101Store.setFraccion(DATOS.fraccion);
  }

/**
 * Obtiene los datos simulados del trámite 250101 desde un archivo JSON local.
 * Devuelve un observable con el estado inicial del trámite.
 */
    getRegistroTomaMuestrasMercanciasData(): Observable<Tramite250101State> {
    return this.http.get<Tramite250101State>('assets/json/250101/flora-fauna-consulta.json');
  }
}
