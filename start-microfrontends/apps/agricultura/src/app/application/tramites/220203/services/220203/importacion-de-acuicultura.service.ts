import {
  Acuicultura,
  DestinatarioForm,
  FilaSolicitud,
  FormularioMovilizacion,
  MercanciaGroup,
  PagoDeDerechos,
  RealizarGroup,
} from '../../models/220203/importacion-de-acuicultura.module';
import { RespuestaCatalogos, SeccionLibStore } from '@ng-mf/data-access-user';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';

/**
 * @fileoverview
 * Servicio para la importación de acuicultura, encargado de obtener datos de catálogos,
 * actualizar el estado del store Akita y gestionar la lógica de negocio relacionada con el trámite.
 * Cobertura compodoc 100%: cada propiedad, método y constructor está documentado.
 * @module ImportacionDeAcuiculturaService
 */

/**
 * Servicio para la importación de acuicultura.
 * Permite obtener catálogos, actualizar el estado del store, validar formularios y gestionar terceros relacionados.
 * @class ImportacionDeAcuiculturaService
 * @providedIn root
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionDeAcuiculturaService {
  /**
   * URL base para los archivos JSON de catálogos.
   * @property {string}
   */
  url: string = 'assets/json/220203/';

  /**
   * Constructor del servicio.
   * Inyecta los servicios necesarios para la gestión de datos y el manejo del store.
   * @param http Cliente HTTP para realizar las peticiones.
   * @param acuiculturaStore Store Akita para el manejo del estado de acuicultura.
   * @param seccionStore Store para el manejo del estado de las secciones.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly acuiculturaStore: AcuiculturaStore,
    private readonly seccionStore: SeccionLibStore
  ) {
    // Constructor logic can be added here if needed
  }

  /**
   * Obtiene los detalles de un catálogo desde un archivo JSON.
   * @method obtenerDetallesDelCatalogo
   * @param nombreDelArchivo Nombre del archivo JSON del catálogo.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  obtenerDetallesDelCatalogo(
    nombreDelArchivo: string
  ): Observable<RespuestaCatalogos> {
    const BASEURL: string = this.url + nombreDelArchivo;
    return this.http.get<RespuestaCatalogos>(BASEURL);
  }

  /**
   * Obtener todos los datos del estado de Acuicultura.
   * @method obtenerDatos
   * @returns {Observable<Acuicultura>} Observable con el estado completo.
   */
  public obtenerDatos(): Observable<Acuicultura> {
    return this.acuiculturaStore._select((state) => state);
  }

  /**
   * Actualizar el formulario de pago en el store.
   * @method actualizarFormularioPago
   * @param formularioPago Datos del formulario de pago.
   * @returns {void}
   */
  public actualizarPagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
    this.acuiculturaStore.actualizarPagoDeDerechos(pagoDeDerechos);
  }

  /**
   * Actualizar el formulario de movilización en el store.
   * @method actualizarFormularioMovilizacion
   * @param formularioMovilizacion Datos del formulario de movilización.
   * @returns {void}
   */
  public actualizarFormularioMovilizacion(
    formularioMovilizacion: FormularioMovilizacion
  ): void {
    this.acuiculturaStore.actualizarFormularioMovilizacion(
      formularioMovilizacion
    );
  }

  /**
   * Actualizar los datos de mercancía en el store.
   * @method actualizarDatosMercancia
   * @param datosMercancia Datos de mercancía.
   * @returns {void}
   */
  public actualizarDatosMercancia(realizarGroup: RealizarGroup): void {
    this.acuiculturaStore.actualizarDatosMercancia(realizarGroup);
  }

  /**
   * Restablecer el formulario a su estado inicial.
   * @method limpiarFormulario
   * @returns {void}
   */
  public limpiarFormulario(): void {
    this.acuiculturaStore.limpiarFormulario();
  }

  /**
   * Obtiene los datos de acuicultura desde un archivo JSON local.
   * @method getAcuiculturaData
   * @returns {Observable<Acuicultura>} Observable con los datos de acuicultura.
   */
  public getAcuiculturaData(): Observable<Acuicultura> {
    return this.http.get<Acuicultura>(
      'assets/json/220203/acuicultura_forma.json'
    );
  }

  /**
   * Actualiza el estado completo del formulario en el store de acuicultura.
   * @method actualizarEstadoFormulario
   * @param DATOS Objeto de tipo Acuicultura con los datos a actualizar.
   * @returns {void}
   */
  public async actualizarEstadoFormulario(DATOS: Acuicultura): Promise<void> {
    await this.acuiculturaStore.actualizarTodoElEstado(DATOS);
  }

  /**
   * Actualiza la lista de terceros relacionados en el store de acuicultura.
   * @method updateTercerosRelacionados
   * @param tercerosRelacionados Arreglo de objetos PersonaTerceros que representan los terceros relacionados.
   * @returns {void}
   */
  public actualizarSoloRealizarGroup(realizarGroup: RealizarGroup): void {
    this.acuiculturaStore.actualizarSoloRealizarGroup(realizarGroup);
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
    this.acuiculturaStore.updateTercerosRelacionados(tercerosRelacionados);
  }
  /**
   * @description Obtiene todos los datos del formulario como observable.
   * @returns {Observable<ListaDeDatosFinal>} Observable con todos los datos del formulario.
   */
  getAllDatosForma(): Observable<Acuicultura> {
    return this.acuiculturaStore._select((state) => state); // Select the entire state
  }

  /**
   * Actualiza la lista de terceros relacionados exportador con la solicitud.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de terceros.
   * @memberof CertificadoZoosanitarioServiceService
   */
  updateDatosForma(tercerosRelacionadosExdora: DestinatarioForm[]): void {
    this.acuiculturaStore.updatedatosForma(tercerosRelacionadosExdora);
  }
}
