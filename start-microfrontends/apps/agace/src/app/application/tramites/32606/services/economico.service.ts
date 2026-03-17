import { Domicillio, EntidadFederativa, Querella, RecibirNotificaciones } from '../models/adace.model';
import { Observable, catchError, throwError } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../state/tramite32606.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/** Servicio para operaciones económicas y gestión de datos del trámite 32606. */
@Injectable({
  providedIn: 'root'
})
export class EconomicoService {
  /** Constructor que inyecta HttpClient y el store del trámite. */
  constructor(private http: HttpClient, private tramite32606Store: Tramite32606Store) { }

  /** Actualiza el estado del formulario en el store con los datos proporcionados. */
  actualizarEstadoFormulario(DATOS: Solicitud32606State): void {
    this.tramite32606Store.setTipoRadio01(DATOS.tipoRadio01);
    this.tramite32606Store.setTipoRadio02(DATOS.tipoRadio02);
    this.tramite32606Store.setTipoRadio03(DATOS.tipoRadio03);
    this.tramite32606Store.setTipoRadio04(DATOS.tipoRadio04);
    this.tramite32606Store.setTipoRadio05(DATOS.tipoRadio05);
    this.tramite32606Store.setTipoRadio06(DATOS.tipoRadio06);
    this.tramite32606Store.setTipoRadio07(DATOS.tipoRadio07);
    this.tramite32606Store.setTipoRadio08(DATOS.tipoRadio08);
    this.tramite32606Store.setTipoRadio09(DATOS.tipoRadio09);
    this.tramite32606Store.setTipoRadio10(DATOS.tipoRadio10);
    this.tramite32606Store.setTipoRadio11(DATOS.tipoRadio11);
    this.tramite32606Store.setTipoRadio12(DATOS.tipoRadio12);
    this.tramite32606Store.setTipoRadio13(DATOS.tipoRadio13);
    this.tramite32606Store.setTipoRadio14(DATOS.tipoRadio14);
    this.tramite32606Store.setTipoRadio15(DATOS.tipoRadio15);
    this.tramite32606Store.setTipoRadio16(DATOS.tipoRadio16);
    this.tramite32606Store.setTipoRadio17(DATOS.tipoRadio17);
    this.tramite32606Store.setTipoRadio18(DATOS.tipoRadio18);
    this.tramite32606Store.setTipoRadio19(DATOS.tipoRadio19);
    this.tramite32606Store.setTipoRadio20(DATOS.tipoRadio20);
    this.tramite32606Store.setTipoRadio21(DATOS.tipoRadio21);
    this.tramite32606Store.setTipoRadio22(DATOS.tipoRadio22);
    this.tramite32606Store.setTipoRadio23(DATOS.tipoRadio23);
    this.tramite32606Store.setTipoRadio24(DATOS.tipoRadio24);
    this.tramite32606Store.setTipoRadio25(DATOS.tipoRadio25);
    this.tramite32606Store.setTipoRadio26(DATOS.tipoRadio26);
    this.tramite32606Store.setTipoRadio27(DATOS.tipoRadio27);
    this.tramite32606Store.setTipoRadio28(DATOS.tipoRadio28);
    this.tramite32606Store.setTipoRadio29(DATOS.tipoRadio29);
    this.tramite32606Store.setTipoRadio30(DATOS.tipoRadio30);
    this.tramite32606Store.setTipoRadio31(DATOS.tipoRadio31);
    this.tramite32606Store.setTipoRadio32(DATOS.tipoRadio32);
    this.tramite32606Store.setTipoRadio33(DATOS.tipoRadio33);
    this.tramite32606Store.setTipoRadio34(DATOS.tipoRadio34);
    this.tramite32606Store.setSectorProductivo(DATOS.sectorProductivo);
    this.tramite32606Store.setServicio(DATOS.servicio);
    this.tramite32606Store.setSectorProductivo(DATOS.sectorProductivo);
    this.tramite32606Store.setServicio(DATOS.servicio);
    this.tramite32606Store.setDomicilio(DATOS.domicilio);
    this.tramite32606Store.setBiomestre(DATOS.biomestre);
    this.tramite32606Store.setNumeroEmpleados(DATOS.numeroEmpleados);
    this.tramite32606Store.setDomicillio(DATOS.domicillio);
    this.tramite32606Store.setFile1(DATOS.file1);
    this.tramite32606Store.setFile2(DATOS.file2);
    this.tramite32606Store.setActualmente(DATOS.actualmente);
    this.tramite32606Store.setActualmente2(DATOS.actualmente2);
    this.tramite32606Store.setSistemaIdentificacion(DATOS.sistemaIdentificacion);
    this.tramite32606Store.setLugarRadicacion(DATOS.lugarRadicacion);
    this.tramite32606Store.setSistemaControlInventarios(DATOS.sistemaControlInventarios);
    this.tramite32606Store.setRfcTercero(DATOS.rfcTercero);
    this.tramite32606Store.setRfc(DATOS.rfc);
    this.tramite32606Store.setNombre(DATOS.nombre);
    this.tramite32606Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite32606Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite32606Store.setTelefono(DATOS.telefono);
    this.tramite32606Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite32606Store.setMonto(DATOS.monto);
    this.tramite32606Store.setOperacionesBancarias(DATOS.operacionesBancarias);
    this.tramite32606Store.setLlavePago(DATOS.llavePago);
    this.tramite32606Store.setModalidad(DATOS.modalidad);
    this.tramite32606Store.setFechaRegistro(DATOS.fechaRegistro);
    this.tramite32606Store.setNumeroAutorizacion(DATOS.numeroAutorizacion);
    this.tramite32606Store.setRadioAutorizo(DATOS.radioAutorizo);
    this.tramite32606Store.setRadioClasificacion(DATOS.radioClasificacion);
    this.tramite32606Store.setCaracter(DATOS.caracter);
    this.tramite32606Store.setNacionalidad(DATOS.nacionalidad);
    this.tramite32606Store.setFechaInicio(DATOS.fechaInicio);
    this.tramite32606Store.setFechaPago(DATOS.fechaPago);
    this.tramite32606Store.setEntidadFederativa(DATOS.entidadFederativa);
    this.tramite32606Store.setMunicipio(DATOS.municipio);
    this.tramite32606Store.setTipoDeInstalacion(DATOS.tipoDeInstalacion);
    this.tramite32606Store.setRegistroSESAT(DATOS.registroSESAT);
    this.tramite32606Store.setDescripcion(DATOS.descripcion);
    this.tramite32606Store.setCodigoPostal(DATOS.codigoPostal);
  }

  /** Obtiene los datos del registro de toma de muestras de mercancías. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32606State> {
    return this.http.get<Solicitud32606State>('assets/json/32606/registro_toma_muestras_mercancias.json');
  }

  /** Obtiene el catálogo de sector productivo. */
  obtenerSectorProductivo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/sector-productivo.json');
  }

  /** Obtiene el catálogo de servicio. */
  obtenerServicio(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/servicio.json');
  }

  /** Obtiene el catálogo de bimestre. */
  obtenerBimestre(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/bimestre.json');
  }

  /** Obtiene el catálogo de domicilio. */
  obtenerDomicillio(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/domicillio.json');
  }

  /** Obtiene la lista de personas para notificaciones. */
  personasNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>('assets/json/32606/personas.json');
  }

  /** Obtiene el catálogo de entidad federativa. */
  obtenerEntidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/entidad.json');
  }

  /** Obtiene el catálogo de carácter. */
  obtenerCaracter(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/caracter.json');
  }

  /** Obtiene el catálogo de nacionalidad. */
  obtenerNacionalidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32606/nacionalidad.json');
  }

  /** Obtiene los datos de la tabla de entidad federativa. */
  obtenerTablaEntidad(): Observable<EntidadFederativa[]> {
    return this.http.get<EntidadFederativa[]>('assets/json/32606/entidad-tabla.json')
      .pipe(catchError((error) => {
        return throwError(() => error);
      })
      );
  }

  /** Obtiene los datos de la tabla de domicilio. */
  obtenerTablaDomicillio(): Observable<Domicillio[]> {
    return this.http.get<Domicillio[]>('assets/json/32606/domicillio-tabla.json')
      .pipe(catchError((error) => {
        return throwError(() => error);
      })
      );
  }

  /** Obtiene los datos de la tabla de querella. */
  obtenerTablaQuerella(): Observable<Querella[]> {
    return this.http.get<Querella[]>('assets/json/32606/querella-tabla.json')
      .pipe(catchError((error) => {
        return throwError(() => error);
      })
      );
  }
}