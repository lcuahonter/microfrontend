
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Tramite240311Store } from '../estados/tramite240311Store.store';

/**
 * Servicio que gestiona las operaciones relacionadas con la solicitud de permiso.
 * Proporciona métodos para obtener datos de destinatarios, fabricantes, manifiestos, SCIAN y otros catálogos necesarios para el trámite.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudPermisoService {

    /**
   * Constructor del servicio.
   * Inicializa el cliente HTTP para realizar solicitudes.
   * http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, private tramite240311Store: Tramite240311Store) {}

 /**
   * Actualiza el estado del store con todos los datos de la empresa.
   * @param datos Objeto de tipo SolicitudPermisoState con los datos a almacenar.
   */
  actualizarEstadoFormulario(datos: PagoDerechosFormState): void {
    this.tramite240311Store.updatePagoDerechosFormState(datos);
  }
  /**
   * Obtiene los datos de la empresa desde un archivo JSON.
   * 
   * @returns {Observable<PagoDerechosFormState>} Observable que emite los datos de la empresa.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<PagoDerechosFormState> {
    return this.http.get<PagoDerechosFormState>('assets/json/240311/registro-toma-muestras-mercancias.json');
  }
}


