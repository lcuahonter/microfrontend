import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BeneficiosData, BodegasData, CafeExportadoresData, RegionesData } from '../models/filadata.model';
import { Solicitud290301State, Solicitud290301Store } from '../estados/tramite290301.store';
import { Catalogo } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class NacionalRegistroDelCafeExportadoresService {

  /** Constructor del servicio NacionalRegistroDelCafeExportadoresService */
  constructor(private http: HttpClient, private solicitud290301Store: Solicitud290301Store) {}
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Datos de la solicitud que se van a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Solicitud290301State): void {
     this.solicitud290301Store.setJustificacion(DATOS.justificacion);
     this.solicitud290301Store.setProductorDeCafe(DATOS.productorDeCafe);
     this.solicitud290301Store.setClaveDelPadron(DATOS.claveDelPadron);
     this.solicitud290301Store.setObservaciones(DATOS.observaciones);
     this.solicitud290301Store.setRequiereInspeccionInmediata(DATOS.requiereInspeccionInmediata);   
     this.solicitud290301Store.setInformacionConfidencial(DATOS.informacionConfidencial);   
  }
  /**
   * Obtiene los datos de las regiones desde un archivo JSON
   * @returns Observable con la lista de datos de las regiones
   */
  getRegionsData(): Observable<RegionesData[]> {
      return this.http.get<RegionesData[]>('./assets/json/290301/regionesdecompraData.json');
    }

  /**
   * Obtiene los datos de los beneficios desde un archivo JSON
   * @returns Observable con la lista de datos de los beneficios
   */
  getBeneficiosData(): Observable<BeneficiosData[]> {
      return this.http.get<BeneficiosData[]>('./assets/json/290301/beneficiosData.json');
    }

  /**
   * Obtiene los datos de las bodegas desde un archivo JSON
   * @returns Observable con la lista de datos de las bodegas
   */
  getBodegasData(): Observable<BodegasData[]> {
      return this.http.get<BodegasData[]>('./assets/json/290301/bodegasData.json');
    }
   
  /**
   * Obtiene los datos de los exportadores de café desde un archivo JSON
   * @returns Observable con la lista de datos de los exportadores de café
   */
  getCafeExportadoresData(): Observable<CafeExportadoresData[]> {
      return this.http.get<CafeExportadoresData[]>('./assets/json/290301/cafedeexportacionData.json');
    }
    /**
 * Obtiene los datos de consulta desde un archivo JSON.
 * @returns Observable con los datos de la consulta en el estado de la solicitud.
 */
getConsultaData(): Observable<Solicitud290301State> {
  return this.http.get<Solicitud290301State>('assets/json/290301/consulta.json');
}
/**
 * Método para cargar el catálogo de estados desde un archivo JSON.
 * 
 * @returns Observable con la lista de estados disponibles en el catálogo.
 */
cargarEstadoCatalog() : Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290301/estado.json');
}

/**
 * Método para cargar el catálogo de clasificaciones (propia o alquilada) desde un archivo JSON.
 * 
 * @returns Observable con la lista de clasificaciones disponibles en el catálogo.
 */
cargarClasificacion() : Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290301/propia-alquilada.json');
}

/**
 * Método para cargar el catálogo de tipos de café desde un archivo JSON.
 * 
 * @returns Observable con la lista de tipos de café disponibles en el catálogo.
 */
cargarTipoDeCafe() : Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290301/tipo-de-cafe.json');
}
}