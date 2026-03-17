import { Observable, combineLatest, map } from 'rxjs';
import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore } from '../../../shared/estados/permiso-importacion-biologica.store';
import { DatosDelSolicituteSeccionQuery } from '../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionState } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { PROC_260401 } from '../servers/api.route';
import { PermisoImportacionBiologicaQuery } from '../../../shared/estados/permiso-importacion-biologica.query';
import { TercerosRelacionadasState } from '../../../shared/estados/stores/terceros-relacionados.stores';
import { TercerosRelacionadosQuery } from '../../../shared/estados/queries/terceros-relacionados.query';
/**
 * Servicio para manejar la lógica relacionada con Solicitud260401.
 * 
 * @export
 * @class Solicitud260401Service
 */
@Injectable({
  providedIn: 'root',
})
export class Solicitud260401Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
    /**
     * urlServerCatalogos es una inyección de dependencias que proporciona la URL del servidor para los catálogos.
     */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
 * Constructor del servicio o componente.
 *
 * Inyecta los siguientes servicios y stores:
 * 
 * - `HttpClient`: Servicio para realizar peticiones HTTP.
 * - `DatosDelSolicituteSeccionStateStore`: Store que maneja el estado de la sección de datos del solicitante.
 * - `PermisoImportacionBiologicaStore`: Store que administra el estado relacionado con permisos de importación biológica.
 *
 * El constructor puede incluir lógica de inicialización si es necesario, aunque actualmente está vacío.
 *
 * @param http Servicio Angular para solicitudes HTTP.
 * @param tramite260401Store Store para gestionar estado de datos de solicitante.
 * @param tramite260401 Store para gestionar estado del permiso de importación biológica.
 */
  constructor(
    private http: HttpClient, 
    private tramite260401Store: DatosDelSolicituteSeccionStateStore,
    private tramite260401:PermisoImportacionBiologicaStore,
    private tramite260401Query: DatosDelSolicituteSeccionQuery,
    private tramite260401RelacionadosQuery : TercerosRelacionadosQuery,
    private tramite260401PagoDerechosQuery: PermisoImportacionBiologicaQuery,
    public httpService: HttpCoreService,
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Estado con la información del solicitante y establecimiento.
   */
  actualizarEstadoFormulario(DATOS: DatosDelSolicituteSeccionState): void {
    this.tramite260401Store.setEstablecimientoDenominacionRazonSocial(DATOS.establecimientoDenominacionRazonSocial);
    this.tramite260401Store.setEstablecimientoCorreoElectronico(DATOS.establecimientoCorreoElectronico);
    this.tramite260401Store.setEstablecimientoDomicilioCodigoPostal(DATOS.establecimientoDomicilioCodigoPostal);
    this.tramite260401Store.setEstablecimientoDomicilioEstado(DATOS.establecimientoDomicilioEstado);
    this.tramite260401Store.setEstablecimientoMunicipioYAlcaldia(DATOS.establecimientoMunicipioYAlcaldia);
    this.tramite260401Store.setEstablecimientoDomicilioLocalidad(DATOS.establecimientoDomicilioLocalidad);
    this.tramite260401Store.setEstablecimientoDomicilioColonia(DATOS.establecimientoDomicilioColonia);
    this.tramite260401Store.setEstablecimientoDomicilioCalle(DATOS.establecimientoDomicilioCalle);
    this.tramite260401Store.setEstablecimientoDomicilioLada(DATOS.establecimientoDomicilioLada);
    this.tramite260401Store.setEstablecimientoDomicilioTelefono(DATOS.establecimientoDomicilioTelefono);
    this.tramite260401Store.setRfcDelProfesionalResponsable(DATOS.rfcDelProfesionalResponsable);
    this.tramite260401Store.setNombreDelProfesionalResponsable(DATOS.nombreDelProfesionalResponsable);
    this.tramite260401Store.setRepresentanteRfc(DATOS.representanteRfc);
    this.tramite260401Store.setRepresentanteNombre(DATOS.representanteNombre); 
    this.tramite260401Store.setRepresentanteApellidos(DATOS.apellidoMaterno,DATOS.apellidoPaterno);
    this.tramite260401Store.setInformacionConfidencial(DATOS.informacionConfidencialRadio)
    this.tramite260401Store.setAduanaDeSalida(DATOS.aduanaDeSalida);
    this.tramite260401Store.setRegimenAlQueSeDestinaraLaMercancía(DATOS.regimenAlQueSeDestinaraLaMercancía);
    this.tramite260401Store.setNoDeLicenciaSanitariaObservaciones(DATOS.noDeLicenciaSanitariaObservaciones);
    this.tramite260401Store.setNoDeLicenciaSanitaria(DATOS.noDeLicenciaSanitaria);
  }

  /**
 * Actualiza los datos relacionados con el pago de derechos en el formulario,
 * utilizando la información proporcionada en el estado de PermisoImportacionBiologica.
 *
 * @param DATOS - Objeto que contiene los datos necesarios para actualizar el pago de derechos,
 * incluyendo clave de referencia, cadena de la dependencia, llave de pago, fecha e importe.
 */
actualizarPagoDerechosFormulario(DATOS: PermisoImportacionBiologicaState): void {
    this.tramite260401.setClaveDeReferncia(DATOS.setClaveDeReferncia);
    this.tramite260401.setCadenaDeLaDependencia(DATOS.setCadenaDeLaDependencia);
    this.tramite260401.setLlaveDePago(DATOS.setLlaveDePago);
    this.tramite260401.setFechaDePago(DATOS.setFechaDePago);
    this.tramite260401.setImporteDePago(DATOS.setImporteDePago);
    if (DATOS.setBanco) {
      this.tramite260401.setBanco(DATOS.setBanco);
    }
}

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   * @returns Observable con el estado de los datos del solicitante.
   */
  getRegistroTomaMuestrasMercanciasData(id: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(PROC_260401.MOSTRA(id));
  }

    /**
   * Obtiene los datos del pago de derechos.
   * @returns Observable con el estado del permiso de importación biológica.
   */
  getPagoDerechos(): Observable<PermisoImportacionBiologicaState> {
    return this.http.get<PermisoImportacionBiologicaState>('assets/json/260401/pagoDerechos.json');
  }

  /** Devuelve un observable con el estado combinado de datos, terceros y pago de derechos.
 *  Agrupa los tres estados usando combineLatest y los mapea en un solo objeto. */
  getAllState(): Observable<{ datos: DatosDelSolicituteSeccionState; terceros: TercerosRelacionadasState; pagoDerechos: PermisoImportacionBiologicaState }> {
  return combineLatest([
    this.tramite260401Query.selectSolicitud$,
    this.tramite260401RelacionadosQuery.selectSolicitud$,
    this.tramite260401PagoDerechosQuery.selectSolicitud$
  ]).pipe(
    map(([datos, terceros, pagoDerechos]) => ({ datos, terceros, pagoDerechos }))
  );
}

/** Envía al backend los datos del trámite para guardarlos.
 *  Realiza una petición POST y devuelve la respuesta como objeto genérico. */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_260401.GUARDAR, { body: body });
  }

/** Construye el objeto de solicitud a partir del estado del solicitante.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildSolicitud(data:DatosDelSolicituteSeccionState): unknown {
  return {
    "discriminatorValue": 260401,
    "declaracionesSeleccionadas": data.manifests,
    "regimen": data.regimenAlQueSeDestinaraLaMercancía,
    "aduanaAIFA": data.aduanaDeSalida,
    "informacionConfidencial": data.informacionConfidencialRadio
  };
}

/** Construye el objeto de establecimiento a partir del estado del solicitante.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildEstablecimiento(data:DatosDelSolicituteSeccionState): unknown {
  return {
    "rfcResponsableSanitario": data.rfcDelProfesionalResponsable,
    "razonSocial": data.establecimientoDenominacionRazonSocial,
    "correoElectronico": data.establecimientoCorreoElectronico,
    "domicilio": {
        "codigoPostal": data.establecimientoDomicilioCodigoPostal,
        "entidadFederativa": {
            "clave": data.establecimientoDomicilioEstado
        },
        "descripcionMunicipio": data.establecimientoMunicipioYAlcaldia,
        "descripcionColonia": data.establecimientoDomicilioColonia,
        "calle": data.establecimientoDomicilioCalle,
        "lada": data.establecimientoDomicilioLada,
        "telefono": data.establecimientoDomicilioTelefono
    },
    "avisoFuncionamiento": data.avisoDeFuncionamiento, 
    "numeroLicencia": data.noDeLicenciaSanitaria,
    "aduanas": data.aduanaDeSalida
  }
}

/** Construye el objeto de datos SCIAN a partir del estado del solicitante.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildDatosScian(data:DatosDelSolicituteSeccionState): unknown {
  return {
        "cveScian": data.scian,
        "descripcion": data.descripcionScian,
        "selected": true
  };
}

/** Construye el objeto de mercancías a partir del estado del solicitante.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildMercancias(data:DatosDelSolicituteSeccionState): unknown {
  const PAIS_ORIGEN = data.establecimientoData[0]?.paisDeOrigen ?? '';
  return [
    {
        "idMercancia": "1",
        "idClasificacionProducto": data.establecimientoData[0]?.tipoDeProductoId ?? "",
        "descDenominacionEspecifica": data.establecimientoData[0]?.nombreEspecifico ?? "",
        "fraccionArancelaria": {
            "clave": data.establecimientoData[0]?.fraccionArancelaria ?? "",
            "descripcion": data.establecimientoData[0]?.descripcionDeLaFraccion ?? ""
        },
        "unidadMedidaComercial": {
            "descripcion": data.establecimientoData[0]?.unidadDeMedida ?? ""
        },
        "cantidadUMCConComas": data.establecimientoData[0]?.cantidadUMT ?? "",
        "unidadMedidaTarifa": {
            "descripcion": data.establecimientoData[0]?.unidadDeMedidaDeTarifa ?? ""
        },
        "cantidadUMTConComas": data.establecimientoData[0]?.cantidadOVolumen ?? "",
        "presentacion": data.establecimientoData[0]?.Presentacion ?? "",
        "nombreCortoPaisOrigen": this.splitToArray(PAIS_ORIGEN),
        "nombreCortoPaisProcedencia": [data.establecimientoData[0]?.paisDeProcedencia ?? ""],
        "nombreCortoUsoEspecifico": [data.establecimientoData[0]?.usoEpecifico ?? ""],
    }
];
}

/** Convierte una cadena separada por comas en un arreglo de cadenas limpio */
private static splitToArray(value: string): string[] {
  return value
    ? value.split(',').map(v => v.trim()).filter(Boolean)
    : [];
}

/** Construye el objeto del representante legal a partir del estado del solicitante.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildRepresentanteLegal(data:DatosDelSolicituteSeccionState): unknown {
  return {
    "rfc": data.representanteRfc ?? "",
    "nombre": data.representanteNombre ?? "",
    "apellidoPaterno": data.apellidoPaterno ?? "",
    "apellidoMaterno": data.apellidoMaterno ?? ""
  };
}

/** Construye el objeto destinatario a partir del estado de terceros relacionados.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildDestinatario(data:TercerosRelacionadasState): unknown {
  return {
        "idPersonaSolicitud": "1",
        "ideTipoTercero": "TIPERS.FAB",
        "personaMoral": "1",
        "booleanExtranjero": "0",
        "booleanFisicaNoContribuyente": "0",
        "denominacion": data.Destinatario[0]?.tbodyData[0] ?? "",
        "razonSocial": data.Destinatario[0]?.tbodyData[0] ?? "",
        "rfc": data.Destinatario[0]?.tbodyData[1] ?? "",
        "curp": data.Destinatario[0]?.tbodyData[2] ?? "",
        "nombre": data.Destinatario[0]?.tbodyData[0] ?? "",
        "telefono": data.Destinatario[0]?.tbodyData[3] ?? "",
        "correoElectronico": data.Destinatario[0]?.tbodyData[4] ?? "",
        "domicilio": {
            "calle": data.Destinatario[0]?.tbodyData[5] ?? "",
            "numeroExterior": data.Destinatario[0]?.tbodyData[6] ?? "",
            "numeroInterior": data.Destinatario[0]?.tbodyData[7] ?? "",
            "pais": {
                "clave": data.Destinatario[0]?.tbodyData[8] ?? "",
                "nombre": data.Destinatario[0]?.tbodyData[8],
            },
            "colonia": {
                "clave": data.Destinatario[0]?.tbodyData[9] ?? "",
                "nombre": data.Destinatario[0]?.tbodyData[9]
            },
            "delegacionMunicipio": {
                "clave": data.Destinatario[0]?.tbodyData[10] ?? "",
                "nombre": data.Destinatario[0]?.tbodyData[10]
            },
            "localidad": {
                "clave": data.Destinatario[0]?.tbodyData[13] ?? "",
                "nombre": data.Destinatario[0]?.tbodyData[13]
            },
            "entidadFederativa": {
                "clave": data.Destinatario[0]?.tbodyData[12] ?? "",
                "nombre": data.Destinatario[0]?.tbodyData[12]
            },
            "codigoPostal": data.Destinatario[0]?.tbodyData[14],
            "descripcionColonia": data.Destinatario[0]?.tbodyData[14]
        },
    }
}

/** Construye el objeto de pago de derechos a partir del estado proporcionado.
 *  Mapea los valores del state a la estructura requerida por el backend. */
static buildPagoDerechos(data:PermisoImportacionBiologicaState): unknown {
  return {
    "claveDeReferncia": data.setClaveDeReferncia,
    "cadenaPagoDependencia": data.setCadenaDeLaDependencia, 
    "banco": {
      "clave": data.setBanco,
      "descripcion": data.setBanco
    },
    "llaveDePago": data.setLlaveDePago,
    "fecPago": data.setFechaDePago,
    "impPago": data.setImporteDePago
}
}
}