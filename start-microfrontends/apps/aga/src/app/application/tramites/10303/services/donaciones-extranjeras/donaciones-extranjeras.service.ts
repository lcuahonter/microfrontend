import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BasicRequerimientosRespuesta, ContribuyenteRespuesta, ManifiestosRespuesta } from '../../models/donaciones-extranjeras.model';
import { Observable } from 'rxjs';
import { RegistroDeDonacion10303State } from '../../estados/tramites/tramite10303.store';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

/**
 * Servicio para gestionar las donaciones extranjeras y acceder a diversos recursos como manifiestos, requerimientos,
 * catálogos y datos del contribuyente.
 */
@Injectable({
  providedIn: 'root'
})
export class DonacionesExtranjerasService {

  /**
   * Constructor del servicio.
   * 
   * @param http - Inyección del servicio HttpClient para realizar peticiones HTTP.
   */
  constructor(private http: HttpClient) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene la lista de manifiestos desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los manifiestos.
   */
  getManifiestos(): Observable<ManifiestosRespuesta> {
    return this.http.get<ManifiestosRespuesta>('assets/json/10303/manifiestos.json');
  }

  /**
   * Obtiene los requerimientos básicos desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los requerimientos básicos.
   */
  getBasicoRequerimientos(): Observable<BasicRequerimientosRespuesta> {
    return this.http.get<BasicRequerimientosRespuesta>('assets/json/10303/basic-requerimientos.json');
  }

  /**
   * Obtiene la lista de aduanas desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de las aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/aduana.json');
  }

  /**
   * Obtiene el destino de donación desde un archivo JSON.
   * 
   * @returns Observable con la respuesta del destino de donación.
   */
  getDestinoDonacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/destino-donacion.json');
  }

  /**
   * Obtiene el tipo de mercancía desde un archivo JSON.
   * 
   * @returns Observable con la respuesta del tipo de mercancía.
   */
  getTipoDeMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/tipo-de-mercancia.json');
  }

  /**
   * Obtiene la unidad de medida desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de la unidad de medida.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/umc.json');
  }

  /**
   * Obtiene la unidad de medida de tráfico desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de la unidad de medida de tráfico.
   */
  getUmt(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/umt.json');
  }

  /**
   * Obtiene la procedencia de otro tipo de mercancía desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de la procedencia de otro tipo de mercancía.
   */
  getProcedenciaOtro(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/procedencia-otro.json');
  }

  /**
   * Obtiene la condición de la mercancía desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de la condición de la mercancía.
   */
  getCondicionMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/condicion-mercancia.json');
  }

  /**
   * Obtiene el país de origen del medicamento desde un archivo JSON.
   * 
   * @returns Observable con la respuesta del país de origen del medicamento.
   */
  getPaisOrigenMedicamento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/pais-origen-medicamento.json');
  }

  /**
   * Obtiene el país de procedencia del medicamento desde un archivo JSON.
   * 
   * @returns Observable con la respuesta del país de procedencia del medicamento.
   */
  getPaisProcedenciaMedicamento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/pais-procedencia-medicamento.json');
  }
  
  /**
   * Obtiene la lista de países desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los países.
   */
  getPaises(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/paises.json');
  }

  /**
   * Obtiene la lista de documentos de residencia desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los documentos de residencia.
   */
  getDocumentoResidencia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/documento-residencia.json');
  }

  /**
   * Busca el contribuyente a partir de su RFC.
   * 
   * @returns Observable con la respuesta del contribuyente.
   */
  buscarContribuyente(id: string): Observable<ContribuyenteRespuesta> {
    return this.http.get<ContribuyenteRespuesta>('assets/json/10303/donatario-datos.json');
  }

  /**
   * Obtiene los datos del registro de donación desde un archivo JSON.
   * 
   * @returns Observable con los datos del registro de donación.
   */
  getRegistroDeDonacionDatos(): Observable<RegistroDeDonacion10303State> {
    return this.http.get<RegistroDeDonacion10303State>('assets/json/10303/registro-de-donacion-datos.json');
  }

  /**
   * Obtiene la lista de países de procedencia desde un archivo JSON.
   * @returns Observable con la respuesta de los países de procedencia.
   */
  getPaisProcedencia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/pais-procedencia-medicamento.json');
  }

  /**
   * Obtiene la lista de países de origen del medicamento desde un archivo JSON.
   * @returns Observable con la respuesta de los países de origen del medicamento.
   */
  getPaisMedicoOrigen(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/pais-origen-medicamento.json');
  }

  /**
   * Obtiene la lista de años desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/ano.json');
  }

  /**
   * Obtiene la lista de tipos de vehículo desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los tipos de vehículo.
   */
  getVehiculoTipo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10303/vehiculo-tipo.json');
  }
}