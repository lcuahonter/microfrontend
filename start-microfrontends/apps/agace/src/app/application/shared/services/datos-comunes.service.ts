import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';
import { DatosComunesState, DatosComunesStore } from '../estados/stores/datos-comunes.store';
import { Observable,catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrincipalesInstalaciones } from '../models/datos-comunes-tres.model';

@Injectable({
  providedIn: 'root'
})
export class DatosComunesService {

  /**
   * Inicializa una nueva instancia de la clase `DatosComunesService`.
   * 
   * @param http - La instancia de `HttpClient` utilizada para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private datosComunes: DatosComunesStore
  ) {
    // Constructor de la clase DatosComunesService
   }

  /**
   * Obtiene los datos productivos desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos productivos.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
   getProductivoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/31602/productivo.json').pipe(
        catchError((error) => {
        return throwError(() => error);
      })
    );
   }

  /**
   * Obtiene los datos de servicios AGACE desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos de servicios AGACE.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
  getServiciosAgaceDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/31602/serviciosAgace.json').pipe(
        catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene datos desde un archivo JSON ubicado en la ruta especificada y los devuelve como un observable.
   *
   * @returns {Observable<JSONResponse>} Un observable que contiene la respuesta JSON.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
  getTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/31602/mencione-el-nombre.json').pipe(
        catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo getEntidadDatos.
   */
  getEntidadDatos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32613/entidad-federativa.json');
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo getInstalacionesTablaDatos.
   */
  getInstalacionesTablaDatos(): Observable<PrincipalesInstalaciones[]> {
    return this.http.get<PrincipalesInstalaciones[]>('assets/json/32613/instalaciones-tabla.json');
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo getEnSuCaracterDeDatos.
   */
  getEnSuCaracterDeDatos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32613/en-su-caracter-de.json');
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo getTipoDePersonaDatos.
   */
  getTipoDePersonaDatos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/31603/tipo-de-persona.json');
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo getNacionalidadDatos.
   */
  getNacionalidadDatos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32613/nacionalidad.json');
  }

  /**
   * Obtiene los datos del banco desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del banco.
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
   * Recupera los datos del combo de bimestres desde un archivo JSON.
   *
   * @returns Un `Observable` de tipo `JSONResponse` que contiene los datos.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
  getComboBimestres(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/31602/combo-bimestres.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos principales de instalaciones desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
  getInstalacionesPrincipalesDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/31602/instalacionesPrincipales-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos de la tabla de control de inventarios desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos de la tabla de control de inventarios.
   * @throws Propagará cualquier error HTTP encontrado durante la solicitud.
   */
  getControlInventariosTabla(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/31602/control-inventarios-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera datos desde un archivo JSON ubicado en 'assets/json/31602/agregar.json'.
   * Este método realiza una solicitud HTTP GET y devuelve la respuesta como un observable.
   * 
   * @returns {Observable<JSONResponse>} Un observable que contiene la respuesta JSON.
   * @throws Propagará cualquier error encontrado durante la solicitud HTTP.
   */
  getAgregarMiembroTabla(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/31602/agregar.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    /**
     * Recupera los datos comunes para consulta desde un archivo JSON local.
     *
     * @returns Un `Observable` que emite el `DatosComunesState` cargado desde el archivo JSON.
     * @throws Emite un observable de error si la solicitud HTTP falla.
     */
    getConsultaDatosComunes(): Observable<DatosComunesState> {
    return this.http.get<DatosComunesState>('./assets/json/31602/datos-commune-consulta.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza el estado del formulario estableciendo varias propiedades en el servicio `datosComunes`
   * basándose en el objeto proporcionado `DatosComunesState`.
   *
   * @param DATOS - Un objeto que contiene los nuevos valores de estado para los campos del formulario.
   */
   actualizarEstadoFormulario(DATOS: DatosComunesState): void {
      this.datosComunes.setAutorizacionIVAIEPS(DATOS.autorizacionIVAIEPS);
      this.datosComunes.setRegimenUno(DATOS.regimenUno);
      this.datosComunes.setRegimenDos(DATOS.regimenDos);
      this.datosComunes.setRegimenTres(DATOS.regimenTres);
      this.datosComunes.setRegimenCuatro(DATOS.regimenCuatro);
      this.datosComunes.setSectorProductivo(DATOS.sectorProductivo);
      this.datosComunes.setServicio(DATOS.servicio);
      this.datosComunes.setPreOperativo(DATOS.preOperativo);
      this.datosComunes.setIndiqueSi(DATOS.indiqueSi);
      this.datosComunes.setSenale(DATOS.senale);
      this.datosComunes.setEmpPropios(DATOS.empPropios);
      this.datosComunes.setBimestre(DATOS.bimestre);
      this.datosComunes.setSenaleSi(DATOS.senaleSi);
      this.datosComunes.setSeMomento(DATOS.seMomento);
      this.datosComunes.setEncuentra(DATOS.encuentra);
      this.datosComunes.setDelMismo(DATOS.delMismo);
      this.datosComunes.setSenaleMomento(DATOS.senaleMomento);
      this.datosComunes.setEnCaso(DATOS.enCaso);
      this.datosComunes.setComboBimestresIDCSeleccione(DATOS.comboBimestresIDCSeleccione);
      this.datosComunes.setIngresar(DATOS.ingresar);
      this.datosComunes.setEncuentraSus(DATOS.encuentraSus);
      this.datosComunes.setRegistrosQue(DATOS.registrosQue);
      this.datosComunes.setRegistrosQue2(DATOS.registrosQue2);
      this.datosComunes.setMomentoIngresar(DATOS.momentoIngresar);
      this.datosComunes.setIndiqueCuenta(DATOS.indiqueCuenta);
      this.datosComunes.setIndiqueCheck(DATOS.indiqueCheck);
      this.datosComunes.setNombreDel(DATOS.nombreDel);
      this.datosComunes.setLugarDeRadicacion(DATOS.lugarDeRadicacion);
      this.datosComunes.setContabilidad(DATOS.contabilidad);
      this.datosComunes.setRmfRadio(DATOS.rmfRadio);
      this.datosComunes.setVinculacionRegistroCancelado(DATOS.vinculacionRegistroCancelado);
      this.datosComunes.setProveedoresListadoSAT(DATOS.proveedoresListadoSAT);
      this.datosComunes.setCumpleCon(DATOS.cumpleCon);
      this.datosComunes.setAcreditaRealizar(DATOS.acreditaRealizar);
      this.datosComunes.setCumpleConDos(DATOS.cumpleConDos);
      this.datosComunes.setEnsucaso(DATOS.ensucaso);
      this.datosComunes.setAlMomento(DATOS.alMomento);
      this.datosComunes.setDelMismomodo(DATOS.delMismomodo);
      this.datosComunes.setSusCertificados(DATOS.susCertificados);
      this.datosComunes.setAfirmativo(DATOS.afirmativo);
      this.datosComunes.setActualizado(DATOS.actualizado);
   }

}
