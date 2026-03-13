import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { DatosGrupos } from '../models/permiso-importacion-modification.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PermisoImportacionStore } from '../estados/permiso-importacion.store';

/**
 * Servicio para gestionar las operaciones relacionadas con el permiso de importación.
 * Permite actualizar el estado del formulario y obtener datos de registro de toma de muestras.
 *
 * @export
 * @class PermisoImportacionService
 */
@Injectable({
  providedIn: 'root'
})
export class PermisoImportacionService {

  url = '../../../../../assets/json/130120/';

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param store Store de Akita para manejar el estado del permiso de importación.
   */
  constructor(
    private readonly http: HttpClient,
    private store: PermisoImportacionStore
  ) {
      // Código del constructor
    }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: DatosGrupos): void {
    this.store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<DatosGrupos> {
    return this.http.get<DatosGrupos>('assets/json/130120/respuestaDeActualizacionDe.json');
  }

  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
      const BASEURL = this.url + fileName;
      return this.http
        .get<RespuestaCatalogos>(BASEURL)
        .pipe(map((response) => response.data));
        
    }
}
