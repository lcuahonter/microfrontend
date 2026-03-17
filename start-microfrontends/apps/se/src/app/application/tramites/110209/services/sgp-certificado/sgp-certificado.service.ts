import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SgpCertificadoService {
/**
   * Constructor del servicio.
   * @param {HttpCoreService} http - Servicio HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpCoreService,
    private tramite110209Store: Tramite110209Store,
  ) {
    // Lógica del constructor puede ser añadida aquí si es necesario
  }


   /**
     * Obtiene los datos de toma de muestras de mercancías desde un archivo JSON local.
     *
     * @returns {Observable<Tramite110209State>} Un observable que emite los datos del trámite 110209.
     */
    getCertificadoDatos(): Observable<Tramite110209State> {
      return this.http.get<Tramite110209State>('assets/json/110209/sgp-certificado-datos.json');
    }

    /**
       * Actualiza el estado del formulario en el store global.
       *
       * @param datos - Objeto de tipo Tramite110209State con los datos a establecer en el store.
       * @returns {void}
       */
      actualizarEstadoFormulario(datos: Tramite110209State): void {
          this.tramite110209Store.setTramite110209(datos);
      }
    
}
