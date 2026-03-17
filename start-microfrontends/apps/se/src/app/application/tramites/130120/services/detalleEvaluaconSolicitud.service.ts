import { Observable, catchError, map } from "rxjs";
import { API_GET_SOLICITUD_DETALLE } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { DatosGrupos } from "../models/permiso-importacion-modification.model";
import { DetalleResponse } from "../models/detalle-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DetalleEvaluaconSolicitudService {

    /**
        * URL del servidor donde se encuentra la API.
        */
    private readonly host: string;

    /**
     * Constructor del servicio que inicializa la URL base del host.
     * @param http Instancia de HttpClient para realizar solicitudes HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Obtiene el detalle de la evaluación de una solicitud específica.
     * @param numeroFolioTramite Número de folio del trámite.
     * @returns Observable con la respuesta del servidor que incluye el detalle de la evaluación de la solicitud.
     */
    getDetalleEvaluacionSolicitud(numeroFolioTramite: string): Observable<BaseResponse<DatosGrupos>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUD_DETALLE(numeroFolioTramite)}`;
        return this.http.get<BaseResponse<DetalleResponse>>(ENDPOINT).pipe(
            map((response) => {
                const FORMATDATE = (dateString: string | null | undefined): string => {
                    if (!dateString) {
                        return '';
                    }
                    const [YEAR, MONTH, DAY] = dateString.split('-');
                    return `${DAY}/${MONTH}/${YEAR}`;
                };

                if (!response?.datos) {
                    throw new Error('El campo "datos" no está presente en la respuesta del servidor.');
                }
                const DETALLE = response.datos;
                const DATOSGRUPOS: DatosGrupos = {
                    datosRealizer: {
                        regimen: DETALLE.cve_regimen,
                        classificion_regimen: DETALLE.cve_clasificacion_regimen,
                    },
                    datosMercanica: {
                        descripcion: DETALLE.mercancia.descripcion,
                        marca: DETALLE.mercancia.marcas,
                        tipo_entrada: DETALLE.mercancia.cve_tipo_aduana,
                        fraccion: DETALLE.mercancia.cve_fraccion_arancelaria,
                        nico: DETALLE.mercancia.cve_subdivision,
                        umt: DETALLE.mercancia.cve_unidad_medida_tarifaria,
                        factura_numero: DETALLE.mercancia.numero_factura,
                        factura_fecha: FORMATDATE(DETALLE.mercancia.fecha_factura),
                        umc: DETALLE.mercancia.cve_unidad_medida_comercial,
                        otro_umc: DETALLE.mercancia.otro_umc,
                        cantidad_umc: String(DETALLE.mercancia.cantidad_comercial ?? ''),
                        factor_conversion: String(DETALLE.mercancia.factor_conversion ?? ''),
                        cantidad_umt: String(DETALLE.mercancia.cantidad_tarifaria ?? ''),
                        valor_factura: String(DETALLE.mercancia.valor_factura_moneda_comercial ?? ''),
                        moneda_comercializacion: DETALLE.mercancia.cve_moneda_comercial,
                        valor_factura_usd: String(DETALLE.mercancia.valor_factura_usd ?? ''),
                        precio_unitario_usd: String(DETALLE.mercancia.precio_unitario ?? ''),
                        pais_exportador: DETALLE.mercancia.cve_pais_destino,
                        pais_origen: DETALLE.mercancia.cve_pais_origen,
                        valor_total_factura: String(DETALLE.mercancia.valor_total_moneda_comercial ?? ''),
                        valor_total_factura_usd: String(DETALLE.mercancia.valor_total_usd ?? '')
                    },
                    datosExporta: {
                        numero_documento: DETALLE.documento_salida_exportacion.numero_documento,
                        fecha_documento: FORMATDATE(DETALLE.documento_salida_exportacion.fecha_documento),
                        descripcionExportacion: DETALLE.documento_salida_exportacion.descripcion_mercancia,
                        codigo_arancelario: DETALLE.documento_salida_exportacion.codigo_arancelario,
                        cantidad_umt: DETALLE.documento_salida_exportacion.cantidad_unidad,
                        valor_usd: DETALLE.documento_salida_exportacion.valor_usd,
                        precio_unitario_usd: DETALLE.documento_salida_exportacion.precio_unitario,
                    },
                    datosProductor: {
                        persona_tipo: DETALLE.productor.tipo_persona,
                        personales_nombre: DETALLE.productor.nombre,
                        primer_apellido: DETALLE.productor.apellido_paterno,
                        segundo_apellido: DETALLE.productor.apellido_materno,
                        denominacion_razon_social: DETALLE.productor.razon_social,
                        domicilio: DETALLE.productor.descripcion_ubicacion,
                    },
                    datosExportador: {
                        persona_tipo: DETALLE.exportador.tipo_persona,
                        personales_nombre: DETALLE.exportador.nombre,
                        primer_apellido: DETALLE.exportador.apellido_paterno,
                        segundo_apellido: DETALLE.exportador.apellido_materno,
                        razon_social: DETALLE.exportador.razon_social,
                        domicilio: DETALLE.exportador.descripcion_ubicacion,
                        observaciones: DETALLE.mercancia.observaciones,
                        denominacion_razon_social_exportador: DETALLE.exportador.razon_social,
                    },
                    datosFederal: {
                        entidad_federativa: DETALLE.representacion_federal.cve_entidad_federativa,
                        representacion_federal: DETALLE.representacion_federal.cve_unidad_administrativa,
                        descripcion_representacion_federal: DETALLE.representacion_federal.cve_entidad_federativa,
                    },
                };

                // Retorna el BaseResponse pero con los datos ya mapeados
                return {
                    ...response,
                    datos: DATOSGRUPOS
                } as BaseResponse<DatosGrupos>;
            }),
            catchError((error) => {
                console.error('Error al obtener el detalle de la evaluación de la solicitud:', error);
                throw error;
            })
        );
    }

}
