import { MetaInfo, Respuesta, RespuestaDetalle, RespuestaSolicitud } from '../models/datos-tramite.model';
import { Solicitud230202State, Tramite230202Store } from '../estados/tramite230202.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class PhytosanitaryReexportacionService {

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param http Servicio HTTP para realizar solicitudes a recursos externos.
   * @param store Store de Akita para gestionar el estado del trámite.
   */
  constructor(private http: HttpClient, private store: Tramite230202Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  
  getNumeroDeCertificado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/numeroDeCertificado.json');
  }

  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/aduanaIngresara.json');
  }

  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/pais.json');
  }

  getMetaInfo(): Observable<Respuesta<MetaInfo>> {
    return this.http.get<Respuesta<MetaInfo>>('assets/json/230202/solicitudDatosInfo.json');
  }

  getEntidades(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/entidades.json');
  }

  getDescripcionProducto(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/descripcionProducto.json');
  }

  agregarSolicitud(): Observable<RespuestaSolicitud> {
    return this.http.get<RespuestaSolicitud>(`assets/json/230202/solicitudDatos.json`);
  }

  agregarDetalle(): Observable<RespuestaDetalle> {
    return this.http.get<RespuestaDetalle>(`assets/json/230202/detalleDatos.json`);
  }

  getFraccionArancelaria(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/fraccionArancelaria.json');
  }

  getGenero(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/genero.json');
  }

  getEspecie(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/especie.json');
  }

  getNombreComun(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/nombreComun.json');
  }

  getUnidadDeMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/unidadDeMedida.json');
  }

  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/medioDeTransporte.json');
  }

  getEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230202/estado.json');
  }

  
  /**
   * Obtiene el catálogo de destinatarios.
   * @returns Un observable con la respuesta del catálogo de destinatarios.
   */
  getSavedData(): Observable<Solicitud230202State> {
    return this.http.get<Solicitud230202State>('assets/json/230202/savedData.json');
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param data Datos de tipo Solicitud230202State que se utilizarán para actualizar el estado del formulario.
   */
  actualizarEstadoFormulario(data: Solicitud230202State): void {
    this.store.update((state) => {
      return {
        ...state,
        aduana: data.aduana,
        numeroDeCertificado: data.numeroDeCertificado,
        pais: data.pais,
        entidades: data.entidades,
        descripcionProducto: data.descripcionProducto,
        datosSolicitud: data.datosSolicitud,
        datosDetalle: data.datosDetalle,
        fraccionArancelaria: data.fraccionArancelaria,
        descripcionFraccionArancelaria: data.descripcionFraccionArancelaria,
        cantidad: data.cantidad,
        cantidadLetra: data.cantidadLetra,
        genero: data.genero,
        especie: data.especie,
        nombreComun: data.nombreComun,
        unidadDeMedida: data.unidadDeMedida,
        lungarDeEntrada: data.lungarDeEntrada,
        medioDeTransporte: data.medioDeTransporte,
        numeroYDescripcion: data.numeroYDescripcion,
        codigoPostal: data.codigoPostal,
        estado: data.estado,
        calle: data.calle,
        numeroExterior: data.numeroExterior,
        numeroInterior: data.numeroInterior,
        colonia: data.colonia,
        destinatarios: data.destinatarios,
        claveDeReferencia: data.claveDeReferencia,
        cadenaPagoDependencia: data.cadenaPagoDependencia,
        banco: data.banco,
        llaveDePago: data.llaveDePago,
        fecPago: data.fecPago,
        impPago: data.impPago,
        update: true
      };
    });
  }
}
