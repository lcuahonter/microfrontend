import { Observable, map } from 'rxjs';

import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComplimentosService {
  constructor(private readonly http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
  obtenerListaEstado(): Observable<Catalogo[]> {
    return (
      this.http
        .get<Catalogo[]>('assets/json/funcionario/estado.json')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res.data))
    );
  }
}
