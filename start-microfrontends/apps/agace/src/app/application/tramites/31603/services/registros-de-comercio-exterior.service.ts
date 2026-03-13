import { Observable,catchError, throwError } from 'rxjs';
import { Solicitud31603IvaeiepsState, Tramite31603IvaeiepsStore } from '../estados/stores/tramite31603ivaeieps.store';
import { Solicitud31603State, Tramite31603Store } from '../estados/stores/tramite31603.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
/**
 * Servicio para manejar operaciones relacionadas con registros de comercio exterior.
 * Proporciona métodos para obtener datos desde el servidor y archivos JSON locales.
 */
@Injectable({
  providedIn: 'root'
})
export class RegistrosDeComercioExteriorService {

/**
 * La URL del servidor utilizada para operaciones auxiliares con JSON.
 * Este valor se obtiene de la configuración del entorno.
 */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Inicializa una nueva instancia del servicio.
   * 
   * @param http - La instancia de HttpClient utilizada para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramaite31603Store: Tramite31603Store,
    private tramaite31603IvaeiepsStore: Tramite31603IvaeiepsStore
  ) { 
    
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
 * Obtiene los datos del JSON "banco-catalog" desde la ruta especificada en assets.
 *
 * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON.
 * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
 */
   getBancoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/31603/banco-catalog.json').pipe(
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
      return this.http.get<JSONResponse>('assets/json/31603/anteriores-tabla.json').pipe(
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
      return this.http.get<JSONResponse>('./assets/json/31603/empresas-del-grupo-tabla.json').pipe(
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
    getConsultaDatos(): Observable<Solicitud31603State | Solicitud31603IvaeiepsState> {
      return this.http.get<Solicitud31603State | Solicitud31603IvaeiepsState>('assets/json/31603/consulta-datos.json').pipe(
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
      this.tramaite31603Store.setDynamicFieldValue(campo, valor);
    }

    /**
     * Recupera los datos para "consulta datos por régimen" desde un archivo JSON local.
     *
     * @returns Un Observable que emite el objeto `Solicitud31602IvaeiepsState` con los datos solicitados.
     * @throws Propaga un error si la solicitud HTTP falla.
     */
    getConsultaDatosDos(): Observable<Solicitud31603IvaeiepsState> {
      return this.http.get<Solicitud31603IvaeiepsState>('assets/json/31603/consulta-datos-por-regimen.json').pipe(
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
      return this.http.get<JSONResponse>('./assets/json/31603/inversion-grupo-tabla.json').pipe(
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
      return this.http.get<JSONResponse>('assets/json/31603/tipo-inversion-datos.json').pipe(
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
  estadoFormulario(DATOS: Solicitud31603IvaeiepsState): void {
    this.tramaite31603IvaeiepsStore.setIndiqueCheck(DATOS.indiqueCheck);
    this.tramaite31603IvaeiepsStore.setResigtro(DATOS.resigtro);
    this.tramaite31603IvaeiepsStore.setTelefono(DATOS.telefono);
    this.tramaite31603IvaeiepsStore.setCorreo(DATOS.correo);
    this.tramaite31603IvaeiepsStore.setManifieste(DATOS.manifieste);
    this.tramaite31603IvaeiepsStore.setIndiqueIva(DATOS.indiqueIva);
    this.tramaite31603IvaeiepsStore.setEmpleados(DATOS.empleados);
    this.tramaite31603IvaeiepsStore.setInfraestructura(DATOS.infraestructura);
    this.tramaite31603IvaeiepsStore.setMonto(DATOS.monto);
    this.tramaite31603IvaeiepsStore.setAntiguedad(DATOS.antiguedad);
    this.tramaite31603IvaeiepsStore.setTipoDe(DATOS.tipoDe);
    this.tramaite31603IvaeiepsStore.setValorPesos(DATOS.valorPesos);
    this.tramaite31603IvaeiepsStore.setDescripcion(DATOS.descripcion);
    this.tramaite31603IvaeiepsStore.setHaContado(DATOS.haContado);
    this.tramaite31603IvaeiepsStore.setEnCasoIva(DATOS.enCasoIva);
    this.tramaite31603IvaeiepsStore.setNumeroOperacion(DATOS.numeroOperacion);
    this.tramaite31603IvaeiepsStore.setBanco(DATOS.banco);
    this.tramaite31603IvaeiepsStore.setLlavePago(DATOS.llavePago);
    this.tramaite31603IvaeiepsStore.setImportaciones(DATOS.importaciones);
    this.tramaite31603IvaeiepsStore.setInfraestructuraIndique(DATOS.infraestructuraIndique);
    this.tramaite31603IvaeiepsStore.setUltimosMeses(DATOS.ultimosMeses);
    this.tramaite31603IvaeiepsStore.setOperacionesmeses(DATOS.operacionesmeses);
    this.tramaite31603IvaeiepsStore.setValor(DATOS.valor);
    this.tramaite31603IvaeiepsStore.setTransferencias(DATOS.transferencias);
    this.tramaite31603IvaeiepsStore.setTransferenciasVir(DATOS.transferenciasVir);
    this.tramaite31603IvaeiepsStore.setRetornos(DATOS.retornos);
    this.tramaite31603IvaeiepsStore.setRetornosSe(DATOS.retornosSe);
    this.tramaite31603IvaeiepsStore.setConstancias(DATOS.constancias);
    this.tramaite31603IvaeiepsStore.setConstanciasDe(DATOS.constanciasDe);
    this.tramaite31603IvaeiepsStore.setEmpleadosPropios(DATOS.empleadosPropios);
    this.tramaite31603IvaeiepsStore.setNumeroEmpleados(DATOS.numeroEmpleados);
    this.tramaite31603IvaeiepsStore.setNumeroEmpleadosDos(DATOS.numeroEmpleadosDos);
    this.tramaite31603IvaeiepsStore.setNumeroEmpleadosTres(DATOS.numeroEmpleadosTres);
    this.tramaite31603IvaeiepsStore.setComboBimestresUno(DATOS.comboBimestresUno);
    this.tramaite31603IvaeiepsStore.setComboBimestresDos(DATOS.comboBimestresDos);
    this.tramaite31603IvaeiepsStore.setComboBimestresTres(DATOS.comboBimestresTres);
    this.tramaite31603IvaeiepsStore.setProveedorCumplimiento(DATOS.proveedorCumplimiento);
    this.tramaite31603IvaeiepsStore.setDeclaracionISR(DATOS.declaracionISR);
    this.tramaite31603IvaeiepsStore.setCancelacion(DATOS.cancelacion);
    this.tramaite31603IvaeiepsStore.setCumplimientoReglas(DATOS.cumplimientoReglas);
    this.tramaite31603IvaeiepsStore.setRecintoFiscalizado(DATOS.recintoFiscalizado);
    this.tramaite31603IvaeiepsStore.setRecintoEstrategico(DATOS.recintoEstrategico);
    this.tramaite31603IvaeiepsStore.setCumplimientoLineamientos(DATOS.cumplimientoLineamientos);
    this.tramaite31603IvaeiepsStore.setTotal(DATOS.total);
    this.tramaite31603IvaeiepsStore.setTotalDos(DATOS.totalDos);
    this.tramaite31603IvaeiepsStore.setConEmpleados(DATOS.conEmpleados);
    this.tramaite31603IvaeiepsStore.setIndiqueSiLosSocios(DATOS.indiqueSiLosSocios);

  }

}
