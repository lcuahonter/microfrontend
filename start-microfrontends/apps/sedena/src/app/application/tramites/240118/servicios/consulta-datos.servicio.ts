/**
 * @fileoverview Servicio de consulta y gestión de datos para el trámite 240118.
 * @description Proporciona métodos para actualizar el estado del store y consultar datos
 * externos relacionados con la solicitud de permiso extraordinario para exportación de sustancias químicas.
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite240118State } from '../estados/tramite240118Store.store';
import { Tramite240118Store } from '../estados/tramite240118Store.store';

/**
 * @class ConsultaDatosService
 * @description Servicio especializado en la gestión y consulta de datos para el trámite 240118.
 * Actúa como intermediario entre los componentes y el store, proporcionando métodos
 * simplificados para actualizar diferentes secciones del formulario y realizar
 * consultas de datos externos.
 * 
 * Este servicio centraliza las operaciones de datos y proporciona una capa de abstracción
 * sobre las operaciones del store, facilitando el mantenimiento y la reutilización.
 * 
 * @example
 * ```typescript
 * // Inyectar en un componente
 * constructor(private consultaDatosService: ConsultaDatosService) {}
 * 
 * // Actualizar datos del trámite
 * this.consultaDatosService.updateDatosDel(datosFormulario);
 * 
 * // Consultar datos externos
 * this.consultaDatosService.getDatosDeLaSolicitudData().subscribe(datos => {
 *   console.log('Datos cargados:', datos);
 * });
 * ```
 * 
 * @injectable
 * @providedIn 'root'
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class ConsultaDatosService {
  /**
   * @constructor
   * @description Inicializa el servicio con las dependencias necesarias.
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones a APIs externas.
   * @param {Tramite240118Store} tramiteStore - Store principal del trámite para gestión de estado.
   * @param {SeccionLibStore} seccionStore - Store de sección para datos de usuario.
   */
  constructor(
    private http: HttpClient,
    private readonly tramiteStore: Tramite240118Store,
    private readonly seccionStore: SeccionLibStore
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @method updateDatosDel
   * @description Actualiza los datos principales del trámite en el store.
   * Este método es un wrapper que facilita la actualización del estado
   * del formulario de datos del trámite desde cualquier componente.
   * 
   * @param {Tramite240118State['datosDelTramite']} datosDel - Datos del formulario principal del trámite.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const datosFormulario = {
   *   permisoGeneral: 'PG001',
   *   usoFinal: 'Exportación comercial',
   *   paisDestino: 'Estados Unidos'
   * };
   * this.consultaDatosService.updateDatosDel(datosFormulario);
   * ```
   * 
   * @since 1.0.0
   */
  updateDatosDel(datosDel: Tramite240118State['datosDelTramite']): void {
    this.tramiteStore.updateDatosDelTramiteFormState(datosDel);
  }

  /**
   * @method updatePagoDerechos
   * @description Actualiza los datos del formulario de pago de derechos en el store.
   * Permite persistir la información de pago ingresada por el usuario.
   * 
   * @param {Tramite240118State['pagoDerechos']} pagoDerchos - Datos del formulario de pago de derechos.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const datosPago = {
   *   claveReferencia: 'REF123456',
   *   banco: 'BBVA Bancomer',
   *   importePago: '1500.00',
   *   fechaPago: '2024-01-15'
   * };
   * this.consultaDatosService.updatePagoDerechos(datosPago);
   * ```
   * 
   * @since 1.0.0
   */
  updatePagoDerechos(pagoDerchos: Tramite240118State['pagoDerechos']): void {
    this.tramiteStore.updatePagoDerechosFormState(pagoDerchos);
  }
  /**
   * @method updateDestinatario
   * @description Actualiza la lista de destinatarios finales en el store.
   * Agrega nuevos destinatarios a la lista existente sin reemplazar los anteriores.
   * 
   * @param {Tramite240118State['destinatarioFinalTablaDatos']} destinatario - Lista de destinatarios finales a agregar.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const nuevosDestinatarios = [{
   *   nombre: 'Empresa Destino Internacional',
   *   rfc: 'EDI123456789',
   *   pais: 'Estados Unidos'
   * }];
   * this.consultaDatosService.updateDestinatario(nuevosDestinatarios);
   * ```
   * 
   * @since 1.0.0
   */
  updateDestinatario(
    destinatario: Tramite240118State['destinatarioFinalTablaDatos']
  ): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatario);
  }
  /**
   * @method updateProveedor
   * @description Actualiza la lista de proveedores en el store.
   * Agrega nuevos proveedores a la lista existente manteniendo los anteriores.
   * 
   * @param {Tramite240118State['proveedorTablaDatos']} proveedor - Lista de proveedores a agregar.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const nuevosProveedores = [{
   *   nombre: 'Químicos Industriales S.A.',
   *   rfc: 'QUI987654321',
   *   direccion: 'Zona Industrial Norte 456'
   * }];
   * this.consultaDatosService.updateProveedor(nuevosProveedores);
   * ```
   * 
   * @since 1.0.0
   */
  updateProveedor(proveedor: Tramite240118State['proveedorTablaDatos']): void {
    this.tramiteStore.updateProveedorTablaDatos(proveedor);
  }
  /**
   * @method updateMercancia
   * @description Actualiza la lista de mercancías en el store.
   * Agrega nuevos detalles de mercancía a la lista existente para exportación.
   * 
   * @param {Tramite240118State['merccancialTablaDatos']} mercancia - Lista de detalles de mercancía a agregar.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const nuevasMercancias = [{
   *   nombre: 'Sustancia Química X',
   *   cantidad: 1000,
   *   unidadMedida: 'KG',
   *   valor: 25000.00,
   *   codigoArancelario: '2901.10.01'
   * }];
   * this.consultaDatosService.updateMercancia(nuevasMercancias);
   * ```
   * 
   * @since 1.0.0
   */
  updateMercancia(
    mercancia: Tramite240118State['merccancialTablaDatos']
  ): void {
    this.tramiteStore.updateMercanciaTablaDatos(mercancia);
  }

  /**
   * @method actualizarEstadoFormulario
   * @description Actualiza el estado completo del formulario en el store de una sola vez.
   * Este método es útil para cargar datos completos desde una fuente externa
   * o restaurar un estado previamente guardado.
   * 
   * @param {Tramite240118State} DATOS - Objeto completo con todos los datos del formulario.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const estadoCompleto: Tramite240118State = {
   *   tabSeleccionado: 2,
   *   datosDelTramite: { ... },
   *   pagoDerechos: { ... },
   *   destinatarioFinalTablaDatos: [...],
   *   proveedorTablaDatos: [...],
   *   merccancialTablaDatos: [...]
   * };
   * this.consultaDatosService.actualizarEstadoFormulario(estadoCompleto);
   * ```
   * 
   * @since 1.0.0
   */
  actualizarEstadoFormulario(DATOS: Tramite240118State): void {
    this.tramiteStore.updateDatosDelTramiteFormState(DATOS.datosDelTramite);
    this.tramiteStore.updatePagoDerechosFormState(DATOS.pagoDerechos);
    this.tramiteStore.updateDestinatarioFinalTablaDatos(DATOS.destinatarioFinalTablaDatos);
    this.tramiteStore.updateProveedorTablaDatos(DATOS.proveedorTablaDatos);
    this.tramiteStore.updateMercanciaTablaDatos(DATOS.merccancialTablaDatos);
  }

  /**
   * @method getDatosDeLaSolicitudData
   * @description Obtiene los datos de la solicitud desde un archivo JSON estático.
   * Este método se utiliza para cargar datos de prueba o configuración
   * inicial del trámite desde los assets de la aplicación.
   * 
   * @returns {Observable<Tramite240118State>} Observable que emite el estado completo del trámite.
   * 
   * @example
   * ```typescript
   * this.consultaDatosService.getDatosDeLaSolicitudData().subscribe({
   *   next: (datos) => {
   *     console.log('Datos cargados exitosamente:', datos);
   *     this.actualizarEstadoFormulario(datos);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar datos:', error);
   *   }
   * });
   * ```
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede cargar el archivo JSON.
   * @since 1.0.0
   */
  getDatosDeLaSolicitudData(): Observable<Tramite240118State> {
    return this.http.get<Tramite240118State>(
      'assets/json/240118/consulta-datos.json'
    );
  }
}