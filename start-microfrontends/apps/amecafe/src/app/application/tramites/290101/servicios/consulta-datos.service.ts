import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TramiteState } from '../estados/tramite290101.store';
import { TramiteStore } from '../estados/tramite290101.store'; 

/**
 * Servicio para la consulta y gestión de datos del trámite 290101.
 *
 * Este servicio proporciona métodos para actualizar diferentes secciones del formulario del trámite,
 * gestionar el estado completo del trámite y obtener datos desde archivos JSON externos.
 * Utiliza stores para mantener el estado de la aplicación de forma reactiva.
 *
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class ConsultaDatosService {
  /**
   * Constructor del servicio ConsultaDatosService.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del servicio,
   * incluyendo el cliente HTTP para realizar peticiones, el store del trámite
   * para gestionar el estado y el store de sección para datos del usuario.
   *
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones REST.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite 290101.
   * @param {SeccionLibStore} seccionStore - Store para gestionar datos de sección del usuario.
   */
  constructor(private http: HttpClient, private readonly tramiteStore: TramiteStore, private readonly seccionStore: SeccionLibStore ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
   }

     /**
   * Actualiza los datos de la solicitud en el store del trámite.
   *
   * Este método permite actualizar la información relacionada con la solicitud
   * del trámite 290101 en el store global de la aplicación.
   *
   * @description Actualiza los datos de la solicitud en el store.
   * @param {TramiteState['SolicitudState']} solicitud - Datos de la solicitud del trámite.
   * @returns {void}
   */
  updateSolicitud(solicitud: TramiteState['SolicitudState']): void {
    this.tramiteStore.setSolicitudTramite(solicitud);
  }

  /**
   * Actualiza los datos generales de región en el store del trámite.
   *
   * Este método permite actualizar la información relacionada con los datos
   * generales internos de región del trámite 290101.
   *
   * @description Actualiza los datos generales internos en el store.
   * @param {TramiteState['RegionFormatState']} regionForma - Datos generales de región del trámite.
   * @returns {void}
   */
  updateRegion(regionForma: TramiteState['RegionFormatState']): void {
    this.tramiteStore.setRegionTramite(regionForma);
  }

  /**
   * Actualiza los datos de beneficios en el store del trámite.
   *
   * Este método permite actualizar la información relacionada con los datos
   * internos de pago de derechos y beneficios del trámite 290101.
   *
   * @description Actualiza los datos internos de pago de derechos en el store.
   * @param {TramiteState['BeneficiosFormaState']} beneficiosForma - Datos de beneficios y pago de derechos.
   * @returns {void}
   */
  updateBeneficios(beneficiosForma: TramiteState['BeneficiosFormaState']): void {
    this.tramiteStore.setBeneficiosTramite(beneficiosForma);
  }

  /**
   * Actualiza los datos de bodegas en el store del trámite.
   *
   * Este método permite actualizar la información relacionada con los datos
   * de bodegas y almacenes del trámite 290101.
   *
   * @description Actualiza los datos de pago de derechos en el store.
   * @param {TramiteState['BodegasFormaState']} bodegasForma - Datos de bodegas y almacenes.
   * @returns {void}
   */
  updateBodegas(bodegasForma: TramiteState['BodegasFormaState']): void {
    this.tramiteStore.setBodegasTramite(bodegasForma);
  }

  /**
   * Actualiza los datos de exportación de café en el store del trámite.
   *
   * Este método permite actualizar la información relacionada con los datos
   * específicos de exportación de café del trámite 290101.
   *
   * @description Actualiza los datos de pago de derechos en el store.
   * @param {TramiteState['CafeExportFormState']} cafeExport - Datos de exportación de café.
   * @returns {void}
   */
  updateCafeExport(cafeExport: TramiteState['CafeExportFormState']): void {
    this.tramiteStore.setCafExportTramite(cafeExport);
  }

    /**
   * Actualiza el estado completo del formulario del trámite 290101.
   *
   * Este método permite actualizar todos los componentes del estado del trámite
   * de forma integral, incluyendo solicitud, región, beneficios, bodegas,
   * exportación de café y las tablas relacionadas.
   *
   * @description Actualiza el estado completo del formulario en el store.
   * @param {TramiteState} DATOS - Objeto con todos los datos del formulario del trámite.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.tramiteStore.setSolicitudTramite(DATOS.SolicitudState);
    this.tramiteStore.setRegionTramite(DATOS.RegionFormatState);
    this.tramiteStore.setBeneficiosTramite(DATOS.BeneficiosFormaState);
    this.tramiteStore.setBodegasTramite(DATOS.BodegasFormaState);
    this.tramiteStore.setCafExportTramite(DATOS.CafeExportFormState);
    this.tramiteStore.setRegionesTabla(DATOS.regionesTabla);
    this.tramiteStore.setBeneficiosTabla(DATOS.beneficiosTabla);
    this.tramiteStore.setBodegasTabla(DATOS.bodegasTabla);
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON externo.
   *
   * Este método realiza una petición HTTP GET para obtener los datos precargados
   * del trámite 290101 desde un archivo JSON ubicado en la carpeta de assets.
   * Los datos obtenidos incluyen toda la información necesaria para inicializar
   * el estado del formulario del trámite.
   *
   * @description Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns {Observable<TramiteState>} Observable que emite los datos completos del trámite.
   */
  getDatosDeLaSolicitudData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/290101/consulta-datos.json');
  }
}
