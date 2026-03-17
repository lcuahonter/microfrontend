import { Asociados } from '../../models/tramites-asociados.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de operaciones relacionadas con los trámites asociados.
 * Proporciona métodos para recuperar la lista de asociados necesaria para el trámite.
 */
@Injectable({
  providedIn: 'root'
})
export class TramitesAsociadosService {

  /**
   * Inicializa una nueva instancia del servicio TramitesAsociadosService.
   * @param http Cliente HTTP de Angular para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Recupera la lista de asociados desde un archivo JSON almacenado localmente.
   * @returns Observable que emite un arreglo de objetos Asociados representando los asociados disponibles.
   */
  enListaDeAsociados(): Observable<Asociados[]> {
    return this.http.get<Asociados[]>('assets/json/260911/asociadosList.json');
  }
}