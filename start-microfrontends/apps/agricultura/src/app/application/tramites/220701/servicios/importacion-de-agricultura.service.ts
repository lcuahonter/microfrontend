import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';

import { Agricultura } from '../modelos/importacion-de-acuicultura.module';
import { DatosMercancia220701 } from '../modelos/importacion-de-acuicultura.module';
import { EnviarDatos } from '../modelos/importacion-de-acuicultura.module';
import { FormularioMovilizacion } from '../modelos/importacion-de-acuicultura.module';
import { FormularioPago } from '../modelos/importacion-de-acuicultura.module';

import { AgriculturaStore } from '../estados/sanidad-certificado.store';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TramiteState } from '../estados/tramite220701.store';
import { TramiteStore } from '../estados/tramite220701.store';    

/**
 * @description Servicio para la importación de Agricultura, encargado de obtener datos de catálogos.
 */
@Injectable({
  providedIn: 'root'
})
export class ImportacionDeAcuiculturaService {
  /**
   * @description URL base para los archivos JSON de catálogos.
   */
  url: string = 'assets/json/220701/';

  /**
   * @description Constructor del servicio.
   * @param http Cliente HTTP para realizar las peticiones.
   */
  constructor(private readonly http: HttpClient, private readonly agriculturaStore: AgriculturaStore, private readonly seccionStore: SeccionLibStore, private readonly tramiteStore: TramiteStore) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @description Obtiene los detalles de un catálogo desde un archivo JSON.
   * @param nombreDelArchivo Nombre del archivo JSON del catálogo.
   * @returns Observable con la respuesta del catálogo.
   */
  obtenerDetallesDelCatalogo(nombreDelArchivo: string): Observable<RespuestaCatalogos> {
    const BASEURL: string = this.url + nombreDelArchivo; 
    return this.http.get<RespuestaCatalogos>(BASEURL);
  }
  /**
   * Obtener todos los datos del estado de Agricultura.
   * @returns Observable con el estado completo.
   * 
   */
  public obtenerDatos(): Observable<Agricultura> {
    return this.agriculturaStore._select((state: Agricultura) => state); // Devuelve el estado completo
  }
  /**
  * Actualizar el formulario de pago en el store.
  * @param formularioPago Datos del formulario de pago.
  */
  public actualizarFormularioPago(formularioPago: FormularioPago): void {
    this.agriculturaStore.actualizarFormularioPago(formularioPago); // Actualiza solo el formularioPago
  }

  /**
   * Actualizar el formulario de movilización en el store.
   * @param formularioMovilizacion Datos del formulario de movilización.
   */
  public actualizarFormularioMovilizacion(formularioMovilizacion: FormularioMovilizacion): void {
    this.agriculturaStore.actualizarFormularioMovilizacion(formularioMovilizacion); // Actualiza solo el formularioMovilizacion
  }

  /**
   * Actualizar los datos de mercancía en el store.
   * @param datosMercancia Datos de mercancía.
   */
  public actualizarDatosMercancia(datosMercancia: DatosMercancia220701): void {
    this.agriculturaStore.actualizarDatosMercancia(datosMercancia); // Actualiza solo los datosMercancia
  }
  /**
   * Actualizar los datos de mercancía en el store.
   * @param datosMercancia Datos de mercancía.
   */
  /**
   * Actualiza el campo 'formaValida' en el store de Agricultura.
   * @param updatedFormaValida Los valores booleanos actualizados para 'formaValida'.
   * @description Esta función actualiza el estado de 'formaValida' en el store de Agricultura y, 
   * dependiendo del valor de todos los estados, actualiza las secciones y forma válida en el store.
   */
  public actualizarFormaValida(updatedFormaValida: { [key: string]: boolean }): void {
    this.agriculturaStore.actualizarformaValida(updatedFormaValida);
    this.obtenerTodosLosStatus().subscribe((result: boolean) => {
      // Get current validation state to build proper section arrays
      this.agriculturaStore._select((state: { formaValida: EnviarDatos }) => state.formaValida)
        .pipe(take(1))
        .subscribe((formaValida: EnviarDatos) => {
          // For tramite 220701, we need to maintain a 3-step section array structure
          // Each position represents a step in the wizard
          const SECCION_ARRAY = [
            formaValida.pagoDeformaValida || formaValida.dataDeLaSolicitud, // paso-uno (either payment or data form valid)
            formaValida.dataParaMovilizacion, // paso-dos (mobilization data)
            result // paso-tres (overall result)
          ];
          
          this.seccionStore.establecerSeccion(SECCION_ARRAY);
          this.seccionStore.establecerFormaValida(SECCION_ARRAY);
        });
    });
  }
  /**
   * Obtiene el estado actualizado de la forma válida.
   * @returns Observable<boolean> Devuelve un observable con el valor booleano que indica si todos los valores de 'formaValida' son verdaderos.
   * @description Esta función obtiene los valores actuales de 'formaValida' del store de Agricultura 
   * y verifica si todos los valores son verdaderos.
   */
  public obtenerTodosLosStatus(): Observable<boolean> {
    return this.agriculturaStore._select((state: { formaValida: EnviarDatos }) => state.formaValida).pipe(
      map((formaValida: EnviarDatos) => {
        return Object.values(formaValida).every(value => value === true);
      })
    );
  }
  /**
   * @description Actualiza los datos de la solicitud en el store.
   * @param solicitud Datos de la solicitud.
   */
  updateSolicitud(solicitud: TramiteState['SolicitudState']): void {
    this.tramiteStore.setSolicitudTramite(solicitud);
  }

  /**
   * @description Actualiza los datos generales internos en el store.
   * @param datosGenerales Datos generales internos.
   */
  updateInternaDatosGenerales(datosGenerales: TramiteState['InternaDatosGeneralesState']): void {
    this.tramiteStore.setInternaDatosGeneralesTramite(datosGenerales);
  }

  /**
   * @description Actualiza los datos internos de pago de derechos en el store.
   * @param internaPagoDeDerechos Datos internos de pago de derechos.
   */
  updateInternaPagoDeDerechos(internaPagoDeDerechos: TramiteState['FormularioPagoState']): void {
    this.tramiteStore.setInternaPagoDeDerechosTramite(internaPagoDeDerechos);
  }

  /**
   * @description Actualiza los datos de pago de derechos en el store.
   * @param pagoDeDerechos Datos de pago de derechos.
   */
  updatePagoDeDerechos(pagoDeDerechos: TramiteState['PagosDeDerechosState']): void {
    this.tramiteStore.setPagoDeDerechosTramite(pagoDeDerechos);
  }
  /**
   * Restablecer el formulario a su estado inicial.
   */
  public limpiarFormulario(): void {
    this.agriculturaStore.limpiarFormulario(); // Restablece todo el estado
  }
    /**
   * @description Actualiza el estado completo del formulario en el store.
   * @param {TramiteState} DATOS - Objeto con todos los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.tramiteStore.setSolicitudTramite(DATOS.SolicitudState);
    this.tramiteStore.setInternaDatosGeneralesTramite(DATOS.InternaDatosGeneralesState);
    this.tramiteStore.setInternaPagoDeDerechosTramite(DATOS.FormularioPagoState);
    this.tramiteStore.setPagoDeDerechosTramite(DATOS.PagosDeDerechosState);
  }

  /**
   * Initializes the section state with proper structure for 220701 tramite
   * @description Sets up the initial section arrays for the 3-step wizard
   */
  public inicializarEstadoSeccion(): void {
    // Initialize with 3-step structure: [paso-uno, paso-dos, paso-tres]
    const SECCION_INICIAL = [false, false, false];
    this.seccionStore.establecerSeccion(SECCION_INICIAL);
    this.seccionStore.establecerFormaValida(SECCION_INICIAL);
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitudData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/220701/datos-de-la-solicitud.json');
  }
}