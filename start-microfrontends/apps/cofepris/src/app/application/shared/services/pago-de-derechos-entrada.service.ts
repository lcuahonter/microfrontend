
/**
 * Servicio para la gestión del pago de derechos.
 * Proporciona métodos para obtener datos relacionados con el pago de derechos.
 */
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Catalogo, CatalogoServices } from '@libs/shared/data-access-user/src';

/**
 * Servicio que se provee en el ámbito de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class PagoDeDerechosEntradaService {

  /**
   * Constructor del servicio.
   * Inyecta el cliente HTTP para realizar peticiones.
   * 
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient, private catalogoService: CatalogoServices) { }

  /**
   * Obtiene los datos relacionados con el pago de derechos desde un archivo JSON local.
   * 
   * @returns Observable que emite un arreglo de objetos Catalogo.
   */
  getData(tramiteID: string): Observable<Catalogo[]> {
    return this.catalogoService.bancosCatalogo(tramiteID).pipe(
          map(res => res?.datos ?? [])
    );
  }
}
