import { ENVIRONMENT } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { PROC_110209 } from '../../servers/api.route';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';

@Injectable({
  providedIn: 'root'
})
export class Solicitud110209Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
// URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  constructor(
    private http: HttpClient,
    private tramite110209Store: Tramite110209Store,
    private tramite110209Query: Tramite110209Query,
    public httpService: HttpCoreService,
  ) {
    //
   }

/** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
 actualizarEstadoFormulario(DATOS: Tramite110209State): void {
   this.tramite110209Store.update(DATOS);
 }

/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
 getRegistroTomaMuestrasMercanciasData(): Observable<Tramite110209State> {
   return this.http.get<Tramite110209State>('assets/json/110203/serviciosExtraordinarios.json');
 }
   
  /**
 * Realiza una petición HTTP POST al endpoint correspondiente para buscar un certificado.
 * Recibe un objeto genérico con los parámetros de búsqueda como cuerpo de la solicitud.
 * Devuelve un observable con la respuesta del servidor en formato de objeto.
 */
  buscarCertificado(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110209.BUSCAR_CERTIFICADO, { body: body });
  }

  
  /**
 * Obtiene el estado completo de la solicitud 110209 desde el store.
 * Retorna un observable que emite los cambios en el estado de la solicitud.
 * Permite suscribirse para reaccionar ante actualizaciones del estado.
 */
  getAllState(): Observable<Tramite110209State> {
    return this.tramite110209Query.selectTramite110209$;
  }

  /**
   * Envía una petición HTTP POST al endpoint definido para guardar los datos del trámite 110203.
   * Recibe un objeto genérico como cuerpo de la solicitud.
   * Devuelve un observable con la respuesta del servidor en formato de objeto.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110209.GUARDAR, { body: body });
  }

  /**
   * Construye el objeto de información correspondiente a los tratados o acuerdos comerciales.
   * Toma los datos del estado de la solicitud y asigna los campos necesarios.
   * Devuelve un objeto con los valores de tratado, país, bloque, origen, destino y fechas relevantes.
   */
  buildTratados(data:Tramite110209State): unknown {
  return {
    "tratadoAcuerdo":data.tratadoAcuerdo,
    "paisBloque": data.paisBloque,
    "pais": data.paisOrigen,
    "paisDestino": data.paisDestino,
    "fechaExpedicion": data.fechaExpedicion,
    "fechaVencimiento": data.fechaVencimiento
  };
}

/**
 * Construye el objeto con la información del destinatario a partir del estado de la solicitud.
 * Incluye datos personales, razón social y domicilio completo del destinatario.
 * Devuelve un objeto estructurado con los campos requeridos para el envío del trámite.
 */
buildDestinatario(data:Tramite110209State):unknown {
  return {
    "nombre": data.nombre,
    "primer_apellido": data.primerApellido,
    "segundo_apellido": data.segundoApellido,
    "numero_registro_fiscal": data.numeroDeRegistroFiscal,
    "razon_social": data.razonSocial,
    "domicilio": {
      "ciudad_poblacion_estado_provincia": data.ciudad,
      "calle": data.calle,
      "numero_letra": data.numeroLetra,
      "telefono": data.telefono,
      "fax": data.fax,
      "correo_electronico": data.correoElectronico,
  },
    "medio_transporte": ''
}
}

/**
 * Construye el objeto con la información relacionada al medio de transporte.
 * Toma el valor del campo 'medio' desde el estado de la solicitud.
 * Devuelve un objeto con la clave 'medio_de_transporte' para incluir en el trámite.
 */
buildTransporte(data:Tramite110209State): unknown {
  return {
    "medido_de_transporte": data.medioDeTransporte
  };
}

/**
 * Construye el objeto con la información del certificado de origen asociado a la solicitud.
 * Incluye datos como el ID, folio, fecha de emisión, país destino y país asociado.
 * Utiliza los valores del estado de la solicitud para completar los campos correspondientes.
 */
  buildCertificado(data: Tramite110209State): unknown {
    return {
      certificado: {
        solicitud: {
          certificadoOrigen: {
            idCertificado: 1001,
            folio: 'CO-2025-001',
            fechaEmision: '2025-10-13',
            paisDestino: 'MX',
            precisa: 'Test',
          },
        },
        paisAsociado: {
          cvePais: '63737',
        }
      },
    };
  }

  /**
  * Construye el objeto con los datos detallados del certificado para la solicitud.
  * Incluye observaciones, precisiones, presentación y la información de las mercancías seleccionadas.
  * Devuelve un objeto estructurado con los campos necesarios para completar el certificado.
  */
    buildDatosCertificado(data: Tramite110209State): unknown {
      return {
        "observaciones": data.observaciones,
        "mercanciasSeleccionadas": {
          "numero_de_orden":data.mercanciasSeleccionadas.numeroDeOrden,
          "fraccion_arancelaria":data.mercanciasSeleccionadas.fraccionArancelaria,
          "nombre_tecnico":data.mercanciasSeleccionadas.nombreTecnico,
          "nombre_comercial":data.mercanciasSeleccionadas.nombreComercial,
          "nombre_ingles":data.mercanciasSeleccionadas.nombreIngles,
          "numero_de_registro":data.mercanciasSeleccionadas.numeroDeRegistro,
        }
      }
    }

/** Construye la estructura del certificado de origen a partir del estado dado.  
 * Devuelve un objeto con los datos procesados según la solicitud. */
      buildCertificadoOrigen(data: Tramite110209State): unknown {
        return {
            "fechaExpedicionStr": data.fechaExpedicion,
            "fechaVencimientoStr": data.fechaVencimiento,
            "medioTransporte": data.medioDeTransporte,
            "observaciones": data.observaciones,
            "precisa": '',
            "presenta": '',
            "paisAsociado": {
                "cvePais": data.cvePais,
                "nombre": data.nombre,
            },
            "tratadoAsociado": {
              "nombre": ""
            },
            "mercanciasAsociadas": [{
                    "cantidad": data.cantidad,
                    "complementoDescripcion": data.descripcion,
                    "descripcion": data.descripcion,
                    "fechaFactura": data.fechaFactura,
                    "fraccionArancelaria": data.mercanciasSeleccionadas.fraccionArancelaria,
                    "idMercanciaCertificado": data.numeroDeCertificado,
                    "marca": data.marca,
                    "masaBruta": '',
                    "nombreComercial": data.nombre,
                    "nombreIngles": data.mercanciasSeleccionadas.nombreIngles,
                    "nombreTecnico": data.mercanciasSeleccionadas.nombreTecnico,
                    "numeroFactura": data.numeroFactura,
                    "numeroOrden": data.mercanciasSeleccionadas.numeroDeOrden,
                    "numeroRegistro": data.numeroDeRegistroFiscal,
                    "tipoFactura": data.tipoFactura,
                    "unidadMedidaComercial": data.unidadMedida,
                    "unidadMedidaDescripcion": data.descripcion,
                    "unidadMedidaMasaBruta": '',
                    "valorMercancia": data.valorMercancia
            }
          ],
        }
      }

}
