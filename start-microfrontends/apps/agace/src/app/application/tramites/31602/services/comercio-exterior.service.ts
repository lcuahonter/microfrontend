import { Observable,catchError, throwError } from 'rxjs';
import { Solicitud31602IvaeiepsState, Tramite31602IvaeiepsStore } from '../estados/stores/tramite31602ivaeieps.store';
import { Solicitud31602State, Tramite31602Store } from '../estados/stores/tramite31602.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { JSONResponse } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class ComercioExteriorService {

    /**
   * La URL del servidor utilizada para operaciones auxiliares con JSON.
   * Este valor se obtiene de la configuración del entorno.
   */
    urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(
    private http: HttpClient,
    private tramaite31602Store: Tramite31602Store,
    private tramaite31602IvaeiepsStore: Tramite31602IvaeiepsStore
  ) {
    //
   }

    /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
    obtenerTramite(id: number): Observable<JSONResponse> {
      return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Obtiene los datos para la tabla "Empresas del Grupo" desde un archivo JSON local.
     *
     * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON con los datos de la tabla.
     * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
     */
    getEmpresasTablaDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('./assets/json/31602/empresas-del-grupo-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

      /**
     * Obtiene los datos para la tabla "Inversion Grupo" desde un archivo JSON local.
     *
     * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON con los datos de la tabla.
     * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
     */
    getInversionTablaDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('./assets/json/31602/inversion-grupo-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

/**
 * Obtiene los datos del catálogo de tipos de inversión desde un archivo JSON local.
 *
 * Realiza una solicitud HTTP GET a la ruta 'assets/json/31602/tipo-inversion-datos.json' para recuperar
 * el catálogo de tipos de inversión. Si ocurre un error durante la solicitud, este es capturado y propagado.
 *
 * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON con los datos del catálogo.
 * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
 */
    getTipoInversionDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/31602/tipo-inversion-datos.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }


    /**
     * Obtiene los datos del JSON "banco-catalog" desde la ruta especificada en assets.
     *
     * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON.
     * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
     */
    getBancoDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/31602/banco-catalog.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Obtiene los datos anteriores desde un archivo JSON ubicado en 'assets/json/31602/anteriores-tabla.json'.
     *
     * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON con los datos anteriores.
     * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
     */ 
    getAnterioresDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/31602/anteriores-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos de consulta para el trámite 31602.
     * Envía una solicitud HTTP GET para obtener los datos de `Solicitud31602State` desde un archivo JSON local.
     * Maneja cualquier error propagándolos como errores observables.
     * @returns Un `Observable` que emite los datos de `Solicitud31602State`.
     */
    getConsultaDatos(): Observable<Solicitud31602State | Solicitud31602IvaeiepsState> {
      return this.http.get<Solicitud31602State | Solicitud31602IvaeiepsState>('assets/json/31602/consulta-datos.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el estado de un campo del formulario estableciendo su valor dinámicamente en el store.
     *
     * @param campo - El nombre del campo del formulario a actualizar.
     * @param valor - El nuevo valor que se asignará al campo del formulario. Puede ser un string, número o booleano.
     */
    actualizarEstadoFormulario(campo: string, valor: string | number | boolean): void {
      this.tramaite31602Store.setDynamicFieldValue(campo, valor);
    }

    /**
     * Recupera los datos para "consulta datos por régimen" desde un archivo JSON local.
     *
     * @returns Un Observable que emite el objeto `Solicitud31602IvaeiepsState` con los datos solicitados.
     * @throws Propaga un error si la solicitud HTTP falla.
     */
    getConsultaDatosDos(): Observable<Solicitud31602IvaeiepsState> {
      return this.http.get<Solicitud31602IvaeiepsState>('assets/json/31602/consulta-datos-por-regimen.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el estado del formulario en el `tramaite31602IvaeiepsStore` utilizando los datos proporcionados en `Solicitud31602IvaeiepsState`.
     *
     * Itera a través de cada propiedad del objeto `DATOS` y establece el valor correspondiente en el store
     * llamando al método setter adecuado. Esto asegura que todos los campos del formulario estén sincronizados con el
     * estado actual.
     *
     * @param DATOS - Un objeto de tipo `Solicitud31602IvaeiepsState` que contiene los valores actuales de todos los campos del formulario.
     */
    estadoFormulario(DATOS: Solicitud31602IvaeiepsState): void {
      this.tramaite31602IvaeiepsStore.setIndiqueCheck(DATOS.indiqueCheck);
      this.tramaite31602IvaeiepsStore.setResigtro(DATOS.resigtro);
      this.tramaite31602IvaeiepsStore.setTelefono(DATOS.telefono);
      this.tramaite31602IvaeiepsStore.setCorreo(DATOS.correo);
      this.tramaite31602IvaeiepsStore.setManifieste(DATOS.manifieste);
      this.tramaite31602IvaeiepsStore.setIndiqueIva(DATOS.indiqueIva);
      this.tramaite31602IvaeiepsStore.setEmpleados(DATOS.empleados);
      this.tramaite31602IvaeiepsStore.setInfraestructura(DATOS.infraestructura);
      this.tramaite31602IvaeiepsStore.setMonto(DATOS.monto);
      this.tramaite31602IvaeiepsStore.setAntiguedad(DATOS.antiguedad);
      this.tramaite31602IvaeiepsStore.setTipoDe(DATOS.tipoDe);
      this.tramaite31602IvaeiepsStore.setValorPesos(DATOS.valorPesos);
      this.tramaite31602IvaeiepsStore.setDescripcion(DATOS.descripcion);
      this.tramaite31602IvaeiepsStore.setHaContado(DATOS.haContado);
      this.tramaite31602IvaeiepsStore.setEnCasoIva(DATOS.enCasoIva);
      this.tramaite31602IvaeiepsStore.setNumeroOperacion(DATOS.numeroOperacion);
      this.tramaite31602IvaeiepsStore.setBanco(DATOS.banco);
      this.tramaite31602IvaeiepsStore.setLlavePago(DATOS.llavePago);
      this.tramaite31602IvaeiepsStore.setImportaciones(DATOS.importaciones);
      this.tramaite31602IvaeiepsStore.setInfraestructuraIndique(DATOS.infraestructuraIndique);
      this.tramaite31602IvaeiepsStore.setUltimosMeses(DATOS.ultimosMeses);
      this.tramaite31602IvaeiepsStore.setOperacionesmeses(DATOS.operacionesmeses);
      this.tramaite31602IvaeiepsStore.setValor(DATOS.valor);
      this.tramaite31602IvaeiepsStore.setTransferencias(DATOS.transferencias);
      this.tramaite31602IvaeiepsStore.setTransferenciasVir(DATOS.transferenciasVir);
      this.tramaite31602IvaeiepsStore.setRetornos(DATOS.retornos);
      this.tramaite31602IvaeiepsStore.setRetornosSe(DATOS.retornosSe);
      this.tramaite31602IvaeiepsStore.setConstancias(DATOS.constancias);
      this.tramaite31602IvaeiepsStore.setConstanciasDe(DATOS.constanciasDe);
      this.tramaite31602IvaeiepsStore.setEmpleadosPropios(DATOS.empleadosPropios);
      this.tramaite31602IvaeiepsStore.setNumeroEmpleados(DATOS.numeroEmpleados);
      this.tramaite31602IvaeiepsStore.setNumeroEmpleadosDos(DATOS.numeroEmpleadosDos);
      this.tramaite31602IvaeiepsStore.setNumeroEmpleadosTres(DATOS.numeroEmpleadosTres);
      this.tramaite31602IvaeiepsStore.setComboBimestresUno(DATOS.comboBimestresUno);
      this.tramaite31602IvaeiepsStore.setComboBimestresDos(DATOS.comboBimestresDos);
      this.tramaite31602IvaeiepsStore.setComboBimestresTres(DATOS.comboBimestresTres);
      this.tramaite31602IvaeiepsStore.setProveedorCumplimiento(DATOS.proveedorCumplimiento);
      this.tramaite31602IvaeiepsStore.setDeclaracionISR(DATOS.declaracionISR);
      this.tramaite31602IvaeiepsStore.setCancelacion(DATOS.cancelacion);
      this.tramaite31602IvaeiepsStore.setCumplimientoReglas(DATOS.cumplimientoReglas);
      this.tramaite31602IvaeiepsStore.setRecintoFiscalizado(DATOS.recintoFiscalizado);
      this.tramaite31602IvaeiepsStore.setRecintoEstrategico(DATOS.recintoEstrategico);
      this.tramaite31602IvaeiepsStore.setCumplimientoLineamientos(DATOS.cumplimientoLineamientos);
      this.tramaite31602IvaeiepsStore.setTotal(DATOS.total);
      this.tramaite31602IvaeiepsStore.setTotalDos(DATOS.totalDos);
      this.tramaite31602IvaeiepsStore.setConEmpleados(DATOS.conEmpleados);
      this.tramaite31602IvaeiepsStore.setIndiqueSiLosSocios(DATOS.indiqueSiLosSocios);
    }
}
