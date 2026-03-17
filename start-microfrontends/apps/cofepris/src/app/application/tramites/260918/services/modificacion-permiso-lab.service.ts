import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore } from '../../../shared/estados/permiso-importacion-biologica.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para la modificación del permiso de laboratorio.
 * Proporciona métodos para actualizar y obtener el estado de los formularios
 * relacionados con la solicitud y el pago de derechos.
 */
@Injectable({
  providedIn: 'root'
})
export class ModificacionPermisoLabService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones a archivos JSON.
   * @param datosDelSolicituteSeccionStateStore Store para el estado de los datos del solicitante.
   * @param permisoImportacionBiologicaStore Store para el estado del permiso de importación biológica.
   */
  constructor(
    private http: HttpClient,
    private datosDelSolicituteSeccionStateStore: DatosDelSolicituteSeccionStateStore,
    private permisoImportacionBiologicaStore: PermisoImportacionBiologicaStore
  ) {
    // Inicialización del servicio.
  }

  /**
   * Actualiza el estado del formulario de datos del solicitante.
   * @param DATOS Estado actualizado del formulario.
   */
  actualizarEstadoFormulario(DATOS: DatosDelSolicituteSeccionState): void {
    this.datosDelSolicituteSeccionStateStore.update(DATOS);
  }

  /**
   * Actualiza los valores del formulario de pago de derechos.
   * @param DATOS Estado actualizado del permiso de importación biológica.
   */
  actualizarValoresFormularioPagoDerechos(DATOS: PermisoImportacionBiologicaState): void {
    this.permisoImportacionBiologicaStore.setClaveDeReferncia(DATOS.setClaveDeReferncia);
    this.permisoImportacionBiologicaStore.setCadenaDeLaDependencia(DATOS.setCadenaDeLaDependencia);
    this.permisoImportacionBiologicaStore.setBanco(DATOS.setBanco);
    this.permisoImportacionBiologicaStore.setLlaveDePago(DATOS.setLlaveDePago);
    this.permisoImportacionBiologicaStore.setFechaDePago(DATOS.setFechaDePago);
    this.permisoImportacionBiologicaStore.setImporteDePago(DATOS.setImporteDePago);
  }

  /**
   * Obtiene los datos iniciales para el formulario de datos del solicitante.
   * @returns Observable con el estado inicial del formulario.
   */
  obtenerDatosInicialesFormulario(): Observable<DatosDelSolicituteSeccionState> {
    return this.http.get<DatosDelSolicituteSeccionState>('assets/json/260918/inicializar_formulario.json');
  }

  /**
   * Obtiene los valores iniciales para el formulario de pago de derechos.
   * @returns Observable con el estado inicial del formulario de pago de derechos.
   */
  obtenerValoresFormularioPagoDerechos(): Observable<PermisoImportacionBiologicaState> {
    return this.http.get<PermisoImportacionBiologicaState>('assets/json/260918/inicializar-formulario-pago-derechos.json');
  }
}
