import {
  Catalogo,
  RespuestaCatalogos,
  SeccionLibStore,
} from '@ng-mf/data-access-user';

import {
  DatosForma,
  DatosMercancia,
  FinalEnviar,
  ListaDeDatosFinal,
  Movilizacion,
  PagoDeDerechos,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosTable,
} from '../../models/220202/fitosanitario.model';
import { Observable, map } from 'rxjs';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductosCatalogosDatos } from '../../../../shared/models/datos-de-la-solicitue.model';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { URL } from '../../constantes/220202/fitosanitario.enums';

@Injectable({
  providedIn: 'root',
})
export class AgriculturaApiService {
  /** @description URL base para las peticiones a los catálogos y datos. */
  url: string = URL;

  /**
   * @constructor
   * @param {HttpClient} http - Servicio para realizar peticiones HTTP.
   * @param {SeccionLibStore} seccionStore - Store para el manejo del estado de las secciones.
   * @param {FitosanitarioStore} fitosanitarioStore - Store para el manejo del estado de los formularios fitosanitarios.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly seccionStore: SeccionLibStore,
    private readonly fitosanitarioStore: FitosanitarioStore
  ) {
    // Constructor logic can be added here if needed
  }

  /**
   * Actualiza los datos relacionados con el pago de derechos.
   * @method updatePagoDeDerechos
   * @param {PagoDeDerechos} pagoDeDerechos Datos del pago.
   * @memberof CertificadoZoosanitarioServiceService
   */
  updatePagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
    this.fitosanitarioStore.actualizarPagoDeDerechos(pagoDeDerechos);
  }

  /**
   * Actualiza la lista de terceros relacionados con la solicitud.
   * @method updateTercerosExportador
   * @param {TercerosrelacionadosTable[]} datosForma Lista de terceros.
   * @memberof AgriculturaApiService
   */
  updateTercerosExportador(
    datosForma: TercerosrelacionadosExportadorTable[]
  ): void {
    this.fitosanitarioStore.updateTercerosExportador(datosForma);
  }

  /**
   * Actualiza la lista de terceros relacionados con la solicitud.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de terceros.
   * @memberof CertificadoZoosanitarioServiceService
   */
  updateTercerosRelacionado(
    tercerosRelacionados: TercerosrelacionadosdestinoTable[]
  ): void {
    this.fitosanitarioStore.updateTercerosRelacionados(tercerosRelacionados);
  }

  /**
   * @description Obtiene la lista de catálogos a partir de un archivo.
   * @param {string} fileName - Nombre del archivo de catálogo.
   * @returns {Observable<Catalogo[]>} Observable con la lista de catálogos.
   */
  obtenerSelectorList(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http
      .get<RespuestaCatalogos>(BASEURL)
      .pipe(map((response) => response.data));
  }

  /**
   * @description Actualiza los datos del formulario principal en el store.
   * @param {DatosForma} datosForma - Datos del formulario principal.
   */
  updateDatosForma(datosForma: DatosForma): void {
    this.fitosanitarioStore.actualizarDatosForma(datosForma);
  }

  /**
   * @description Actualiza los datos de movilización en el store.
   * @param {Movilizacion} movilizacion - Datos de movilización.
   */
  updateMovilizacion(movilizacion: Movilizacion): void {
    this.fitosanitarioStore.actualizarMovilizacion(movilizacion);
  }

  /**
   * @description Actualiza los datos de pago en el store.
   * @param {PagoDeDerechos} pagoDatos - Datos del formulario de pago.
   */
  updatePago(pagoDatos: PagoDeDerechos): void {
    this.fitosanitarioStore.actualizarPago(pagoDatos);
  }

  /**
   * @description Limpia todos los datos del formulario en el store.
   */
  limpiarFormulario(): void {
    this.fitosanitarioStore.limpiarFormulario();
  }

  /**
   * @description Obtiene los datos del formulario principal como observable.
   * @returns {Observable<DatosForma>} Observable con los datos del formulario principal.
   */
  getDatosForma(): Observable<DatosForma> {
    return this.fitosanitarioStore._select((state) => state.datos); // Use _select for observable
  }

  /**
   * @description Obtiene los datos del formulario de pago como observable.
   * @returns {Observable<PagoDeDerechos>} Observable con los datos del formulario de pago.
   */
  getPagoDeDerechosa(): Observable<PagoDeDerechos> {
    return this.fitosanitarioStore._select((state) => state.pago); // Use _select for observable
  }

  /**
   * @description Obtiene los datos de movilización como observable.
   * @returns {Observable<Movilizacion>} Observable con los datos de movilización.
   */
  getMovilizacion(): Observable<Movilizacion> {
    return this.fitosanitarioStore._select((state) => state.movilizacion); // Use _select for observable
  }

  /**
   * @description Obtiene todos los datos del formulario como observable.
   * @returns {Observable<ListaDeDatosFinal>} Observable con todos los datos del formulario.
   */
  getAllDatosForma(): Observable<ListaDeDatosFinal> {
    return this.fitosanitarioStore._select((state) => state); // Select the entire state
  }

  /**
   * @description Actualiza el estado de validez de las secciones del formulario.
   * También actualiza el estado global de la sección y su validez.
   * @param {{ [key: string]: boolean }} updatedFormaValida - Objeto con el estado de validez de cada sección.
   */
  actualizarFormaValida(updatedFormaValida: { [key: string]: boolean }): void {
    this.fitosanitarioStore.actualizarformaValida(updatedFormaValida);
    this.obtenerTodosLosStatus().subscribe((result: boolean) => {
      if (result) {
        this.seccionStore.establecerSeccion([true]);
        this.seccionStore.establecerFormaValida([true]);
      } else {
        this.seccionStore.establecerSeccion([true]);
        this.seccionStore.establecerFormaValida([false]);
      }
    });
  }

  /**
   * @description Verifica si todas las secciones del formulario son válidas.
   * @returns {Observable<boolean>} Observable que emite true si todas las secciones son válidas, false en caso contrario.
   */
  obtenerTodosLosStatus(): Observable<boolean> {
    return this.fitosanitarioStore
      ._select((state) => state.finalEnviar)
      .pipe(
        map((formaValida: FinalEnviar) => {
          return Object.values(formaValida).every((value) => value === true);
        })
      );
  }

  /**
   * @description Actualiza el estado completo del formulario en el store.
   * @param {ListaDeDatosFinal} DATOS - Objeto con todos los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: ListaDeDatosFinal): void {
    this.fitosanitarioStore.actualizarDatosForma(DATOS.datos);
    this.fitosanitarioStore.actualizarMovilizacion(DATOS.movilizacion);
    this.fitosanitarioStore.actualizarPago(DATOS.pago);
    this.fitosanitarioStore.tablaDatosFinal(DATOS.tablaDatos);
    this.updateTercerosRelacionado(DATOS.tercerosRelacionados);
    this.fitosanitarioStore.updateTercerosExportador(
      DATOS?.datosForma || ([] as TercerosrelacionadosTable[])
    );
  }

  /**
   * @description Obtiene los datos de la solicitud desde un archivo JSON local.
   * @returns {Observable<ListaDeDatosFinal>} Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitudData(): Observable<ListaDeDatosFinal> {
    return this.http.get<ListaDeDatosFinal>(
      'assets/json/220202/datos-de-la-solicitud.json'
    );
  }

  /**
   * @description Obtiene los datos de la solicitud a partir de una URL específica.
   * @param {string} url - URL del archivo JSON que contiene los datos de la solicitud.
   * @returns {Observable<DatosDeLaSolicitud>} Observable con los datos de la solicitud.
   */
  obtenerRespuestaPorUrl(url: string): Observable<DatosMercancia> {
    return this.http.get<DatosMercancia>(
      `../../../../../assets/json/220202/${url}`
    );
  }

  /**
   * @description Obtiene los datos de la solicitud a partir de una URL específica.
   * @param {string} url - URL del archivo JSON que contiene los datos de la solicitud.
   * @returns {Observable<ProductosCatalogosDatos>} Observable con los datos de la solicitud.
   */
  obtenerProductoRespuestaPorUrl(
    url: string
  ): Observable<ProductosCatalogosDatos> {
    return this.http.get<ProductosCatalogosDatos>(
      `../../../../../assets/json/220202/${url}`
    );
  }
}
