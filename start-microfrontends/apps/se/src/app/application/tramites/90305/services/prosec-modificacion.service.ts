import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CatalogoResponse } from '@ng-mf/data-access-user';

import { Observable } from 'rxjs';

import { BitacoraModel , MercanciasModel , ModificacionInfo , PLANTAS, ProductorIndirecto , ProsecModificacionModel , SectorModel } from '../models/prosec-modificacion.model';
import { Tramite90305State, Tramite90305Store } from '../estados/tramite90305.store';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ProsecModificacionServiceTsService {
/**
   * Mapa que almacena los formularios registrados.
   */
  private formularios = new Map<string, FormGroup>();
  /**
   * Servicio para manejar la lógica de negocio relacionada con el trámite 90305.
   * Proporciona métodos para obtener datos desde archivos JSON y actualizar el estado del formulario.
   * @param http - Servicio HttpClient para realizar solicitudes HTTP.
   * @param tramite90305Store - Store para manejar el estado del trámite 90305.
   */
  constructor(private http: HttpClient, private tramite90305Store: Tramite90305Store,) {
    // Inicialización del servicio, si es necesario
   }
  
  /**
   * Método para obtener la lista de domicilios desde un archivo JSON.
   * Utiliza el servicio HttpClient para realizar una solicitud GET al archivo JSON.
   */
  getListaDomicilios() : Observable<ProsecModificacionModel[]> {
    return this.http.get<ProsecModificacionModel[]>('assets/json/90305/lista-de-domicilios.json');
  }

  /**
   * Método para obtener las plantas complementarias desde un archivo JSON.
   * @returns Observable que emite un array de PLANTAS.
   */
  getPlantaComplementaria() : Observable<PLANTAS[]> {
    return this.http.get<PLANTAS[]>('assets/json/90305/plantas.json');
  }

  /**
   * Método para obtener las mercancías desde un archivo JSON.
   * @returns Observable que emite un array de MercanciasModel.
   */
  getMercancias(): Observable<MercanciasModel []> {
    return this.http.get<MercanciasModel []>('assets/json/90305/mercancias.json');
  } 

  /**
   * Método para obtener los sectores desde un archivo JSON.
   * @returns Observable que emite un array de SectorModel.
   */
  getSector(): Observable<SectorModel []> {
    return this.http.get<SectorModel []>('assets/json/90305/sector.json')
  }

  /**
   * Método para obtener los productores indirectos desde un archivo JSON.
   * @returns Observable que emite un array de ProductorIndirecto.
   */
  getProductoIndirecto(): Observable<ProductorIndirecto []> {
    return this.http.get<ProductorIndirecto []>('assets/json/90305/prodIndirecto.json')
  }

  /**
   * Método para obtener la bitácora desde un archivo JSON.
   * @returns Observable que emite un array de BitacoraModel.
   */
  getBitacora(): Observable<BitacoraModel []> {
    return this.http.get<BitacoraModel []>('assets/json/90305/bitacora.json')
  }

  /**
   * Método para obtener la información de modificación desde un archivo JSON.
   * @returns Observable que emite un objeto ModificacionInfo.
   */
  getModoficacionInfo(): Observable<ModificacionInfo > {
    return this.http.get<ModificacionInfo >('assets/json/90305/modificacionInfo.json')
  }

  /**
   * Método para obtener los datos del catálogo de estados desde un archivo JSON.
   * @returns Observable que emite un array de CatalogoResponse.
   */
  getEstadoData(): Observable<CatalogoResponse[]> {
    return this.http.get<CatalogoResponse[]>('assets/json/90305/estado.json');
  }

  /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene el estado del trámite 90305.
   */
  actualizarEstadoFormulario(DATOS: Tramite90305State): void {
 
    this.tramite90305Store.setSelectedEstado(DATOS.selectedEstado);
    this.tramite90305Store.setRegistroFederalContribuyentes(DATOS.registroFederalContribuyentes);
    this.tramite90305Store.setRepresentacionFederal(DATOS.representacionFederal);
    this.tramite90305Store.setTipoModificacion(DATOS.tipoModificacion);
    this.tramite90305Store.setModificacionPrograma(DATOS.modificacionPrograma);
  }
  registrarFormulario(key: string, formulario: FormGroup): void {
    this.formularios.set(key, formulario);
  }


  /**
   * Método para obtener los datos del registro de toma de muestras de mercancías.
   * @returns Observable que emite el estado del trámite 90305.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite90305State> {
    return this.http.get<Tramite90305State>('assets/json/90305/registro_toma_muestras_mercancias.json');
  }
    validarTodosFormularios(): boolean {
    let todosValidos = true;

    this.formularios.forEach(formulario => {
      formulario.markAllAsTouched();
      formulario.updateValueAndValidity();

      if (formulario.invalid) {
        todosValidos = false;
      }
    });

    return todosValidos;
  }
}

