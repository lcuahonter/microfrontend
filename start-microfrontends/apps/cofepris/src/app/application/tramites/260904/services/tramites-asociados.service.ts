 
import { Asociados } from '../modelos/tramites-asociados.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class TramitesAsociadosService {
 
  constructor(private http:HttpClient) {
     // No se necesita lógica de inicialización adicional.
  }
  /**
 * Recupera la lista de asociados desde un archivo JSON almacenado.
 * El método devuelve un observable que contiene un arreglo de objetos Asociados.
 */
  enListaDeAsociados(): Observable<Asociados[]> {
        return this.http.get<Asociados[]>('assets/json/260904/asociadosList.json');
      }
}