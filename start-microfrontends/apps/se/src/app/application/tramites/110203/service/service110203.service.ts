import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Solicitud110203State, Tramite110203Store } from '../../../estados/tramites/tramite110203.store';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { PROC_110203 } from '../servers/api.route';
import { Tramite110203Query } from '../../../estados/queries/tramite110203.query';

@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 110203.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud110203Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
// URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

/** Constructor que inyecta servicios HTTP y el store del trámite 110203.  
 *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, 
    private tramite110203Store: Tramite110203Store,
    private tramite110203Query: Tramite110203Query,
    public httpService: HttpCoreService,
  ) {
    // Lógica de inicialización si es necesario
  }
/** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
actualizarEstadoFormulario(DATOS: Solicitud110203State): void {
this.tramite110203Store.setTratado(DATOS.tratado);
this.tramite110203Store.setBloque(DATOS.bloque);
this.tramite110203Store.setOrigen(DATOS.origen);
this.tramite110203Store.setDestino(DATOS.destino);
this.tramite110203Store.setExpedicion(DATOS.expedicion);
this.tramite110203Store.setVencimiento(DATOS.vencimiento);
this.tramite110203Store.setNombre(DATOS.nombre);
this.tramite110203Store.setPrimer(DATOS.primer);
this.tramite110203Store.setSegundo(DATOS.segundo);
this.tramite110203Store.setFiscal(DATOS.fiscal);
this.tramite110203Store.setRazon(DATOS.razon);
this.tramite110203Store.setCalle(DATOS.calle);
this.tramite110203Store.setLetra(DATOS.letra);
this.tramite110203Store.setCiudad(DATOS.ciudad);
this.tramite110203Store.setCorreo(DATOS.correo);
this.tramite110203Store.setFax(DATOS.fax);
this.tramite110203Store.setTelefono(DATOS.telefono);
this.tramite110203Store.setMedio(DATOS.medio);
this.tramite110203Store.setPrecisa(DATOS.precisa);
this.tramite110203Store.setPresenta(DATOS.presenta);
this.tramite110203Store.setValorSeleccionado(DATOS.valorSeleccionado);
this.tramite110203Store.setNumeroDeCertificado(DATOS.numeroDeCertificado);
this.tramite110203Store.setTratadoAcuerdo(DATOS.tratadoAcuerdo);
this.tramite110203Store.setPaisBloque(DATOS.paisBloque);
this.tramite110203Store.setObservaciones(DATOS.observaciones);
this.tramite110203Store.setComercializacion(DATOS.comercializacion);
this.tramite110203Store.setTipo(DATOS.tipo);
this.tramite110203Store.setMedida(DATOS.medida);


  }
/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud110203State> {
    return this.http.get<Solicitud110203State>('assets/json/110203/serviciosExtraordinarios.json');
  }

  /**
 * Envía una petición HTTP POST al endpoint definido para guardar los datos del trámite 110203.
 * Recibe un objeto genérico como cuerpo de la solicitud.
 * Devuelve un observable con la respuesta del servidor en formato de objeto.
 */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110203.GUARDAR, { body: body });
  }

  /**
 * Realiza una petición HTTP POST al endpoint correspondiente para buscar un certificado.
 * Recibe un objeto genérico con los parámetros de búsqueda como cuerpo de la solicitud.
 * Devuelve un observable con la respuesta del servidor en formato de objeto.
 */
  buscarCertificado(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110203.BUSCAR_CERTIFICADO, { body: body });
  }

  /**
 * Obtiene el estado completo de la solicitud 110203 desde el store.
 * Retorna un observable que emite los cambios en el estado de la solicitud.
 * Permite suscribirse para reaccionar ante actualizaciones del estado.
 */
  getAllState(): Observable<Solicitud110203State> {
    return this.tramite110203Query.selectSolicitud$;
  }

  /**
 * Construye el objeto de información correspondiente a los tratados o acuerdos comerciales.
 * Toma los datos del estado de la solicitud y asigna los campos necesarios.
 * Devuelve un objeto con los valores de tratado, país, bloque, origen, destino y fechas relevantes.
 */
  buildTratados(data:Solicitud110203State): unknown {
  return {
    "tratadoAcuerdo":data.tratado,
    "paisBloque": data.bloque,
    "pais": data.origen,
    "paisDestino": data.bloque,
    "fechaExpedicion": data.expedicion,
    "fechaVencimiento": data.vencimiento
  };
}

/**
 * Construye el objeto con la información del destinatario a partir del estado de la solicitud.
 * Incluye datos personales, razón social y domicilio completo del destinatario.
 * Devuelve un objeto estructurado con los campos requeridos para el envío del trámite.
 */
buildDestinatario(data:Solicitud110203State):unknown {
  return {
    "nombre": data.nombre,
    "primer_apellido": data.primer,
    "segundo_apellido": data.segundo,
    "numero_registro_fiscal": data.fiscal,
    "razon_social": data.razon,
    "domicilio": {
      "ciudad_poblacion_estado_provincia": data.ciudad,
      "calle": data.calle,
      "numero_letra": data.letra,
      "telefono": data.telefono,
      "fax": data.fax,
      "correo_electronico": data.correo,
  },
    "medio_transporte": data.medio ?? ''
}
}

/**
 * Construye el objeto con la información relacionada al medio de transporte.
 * Toma el valor del campo 'medio' desde el estado de la solicitud.
 * Devuelve un objeto con la clave 'medio_de_transporte' para incluir en el trámite.
 */
buildTransporte(data:Solicitud110203State): unknown {
  return {
    "medido_de_transporte": data.medio
  };
}

/**
 * Construye el objeto con la información del certificado de origen asociado a la solicitud.
 * Incluye datos como el ID, folio, fecha de emisión, país destino y país asociado.
 * Utiliza los valores del estado de la solicitud para completar los campos correspondientes.
 */
  buildCertificado(data: Solicitud110203State): unknown {
    return {
      certificado: {
        solicitud: {
          certificadoOrigen: {
            idCertificado: 1001,
            folio: 'CO-2025-001',
            fechaEmision: '2025-10-13',
            paisDestino: 'MX',
            precisa: data.precisa ?? '',
          },
        },
        paisAsociado: {
          cvePais: data.cvePais ?? '',
        }
      },
    };
  }

/**
 * Construye el objeto con los datos detallados del certificado para la solicitud.
 * Incluye observaciones, precisiones, presentación y la información de las mercancías seleccionadas.
 * Devuelve un objeto estructurado con los campos necesarios para completar el certificado.
 */
  buildDatosCertificado(data: Solicitud110203State): unknown {
    return {
      "observaciones": data.observaciones,
      "precisa": data.precisa,
      "presenta": data.presenta,
      "mercanciasSeleccionadas": {
        "numero_de_orden":data.orden,
        "fraccion_arancelaria":data.arancelaria,
        "nombre_tecnico":data.tecnico,
        "nombre_comercial":data.comercial,
        "nombre_ingles":data.ingles,
        "numero_de_registro":data.registro,
      }
    }
  }

/** Construye la estructura del certificado de origen a partir del estado dado.  
 * Devuelve un objeto con los datos procesados según la solicitud. */
  buildCertificadoOrigen(data: Solicitud110203State): unknown {
    return {
        "fechaExpedicionStr": data.expedicion,
        "fechaVencimientoStr": data.vencimiento,
        "medioTransporte": data.medio,
        "mercanciasAsociadas": [{
                "cantidad": data.cantidad,
                "complementoDescripcion": data.complemento,
                "descripcion": data.complemento,
                "fechaFactura": data.factura,
                "fraccionArancelaria": data.arancelaria,
                "idMercanciaCertificado": data.numeroDeCertificado,
                "marca": data.marca,
                "masaBruta": data.bruta,
                "nombreComercial": data.nombre,
                "nombreIngles": data.ingles,
                "nombreTecnico": data.tecnico,
                "numeroFactura": data.factura,
                "numeroOrden": data.orden,
                "numeroRegistro": data.registro,
                "tipoFactura": data.tipo,
                "unidadMedidaComercial": data.comercial,
                "unidadMedidaDescripcion": data.medida,
                "unidadMedidaMasaBruta": data.medida,
                "valorMercancia": data.valor
        }
      ],
      "observaciones": data.observaciones,
      "paisAsociado": {
            "cvePais": data.cvePais,
            "nombre": data.nombre,
        },
        "precisa": data.precisa ?? '',
        "presenta": data.presenta ?? '',
        "tratadoAsociado": {
          "nombre": ""
        }
    }
  }

}