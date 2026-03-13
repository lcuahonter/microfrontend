import { API_GET_DATOS_FABRICANTE, API_GET_DATOS_IMPORTADOR_DESTINO, API_GET_DETALLES_CUPO, API_GET_FACTURAS_ASOCIADAS_POR_FOLIO } from '../server/api-router';
import { Observable, map } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FabricanteResponse } from '../models/response/fabricantes-response.model';
import { FacturasTplAsociadaResponse } from '../models/response/datos-factura-response.model';
import { HttpClient } from "@angular/common/http";
import { ImportadorDestinoResponse } from '../models/response/importador-destino-response.model';
import { Injectable } from "@angular/core";
import { TplDetalleResponse } from '../models/response/tpl-detalle-response.model';

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
* Obtiene los detalles del cupo para un folio de trámite específico.
* @param numFolioTramite Número de folio del trámite.
* @returns Observable con la respuesta del servidor que incluye los detalles del cupo.
*/
    getDetallesCupo(numFolioTramite: string): Observable<BaseResponse<TplDetalleResponse>> {
        const ENDPOINT = `${this.host}${API_GET_DETALLES_CUPO(numFolioTramite)}`;
        return this.http.get<BaseResponse<TplDetalleResponse>>(ENDPOINT).pipe(
            map((resp: BaseResponse<TplDetalleResponse>) => {
                const RAW_DATA = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;

                const DETALLES: TplDetalleResponse = {
                    id_mecanismo_asignacion: 0, // no viene en JSON → default
                    id_cupo: 0, // no viene en JSON → default
                    fraccion_arancelaria: RAW_DATA?.fraccion_arancelaria ?? '',
                    descripcion_producto: RAW_DATA?.descripcion_producto ?? '',
                    tratado_bloque: RAW_DATA?.tratado_bloque ?? '',
                    clasificacion_subproducto: RAW_DATA?.clasificacion_subproducto ?? '',
                    mecanismo_asignacion: RAW_DATA?.mecanismo_asignacion ?? '',
                    categoria_textil: RAW_DATA?.categoria_textil ?? '',
                    regimen: RAW_DATA?.regimen ?? '',
                    descripcion_categoria_textil: RAW_DATA?.descripcion_categoria_textil ?? '',
                    unidad_medida: RAW_DATA?.unidad_medida ?? '',
                    fecha_inicio_vigencia: RAW_DATA?.fecha_inicio_vigencia ?? '',
                    fecha_fin_vigencia: RAW_DATA?.fecha_fin_vigencia ?? '',
                    factor_conversion: RAW_DATA?.factor_conversion ?? 0,
                    id_categoria_textil: 0, // no viene en JSON → default
                    identificador_regimen: '', // no viene en JSON → default
                    pais_origen_destino: RAW_DATA?.pais_origen_destino ?? '',
                    codigo_pais: '', // no viene en JSON → default (ej. "USA")
                    descripcion_mercancia: false, // no viene en JSON → default
                    id_fraccion_hts_usa: 0, // no viene en JSON → default
                    unidad_medida_oficial: RAW_DATA?.unidad_medida ?? '',
                    monto_disponible: 0, // no viene en JSON → default
                    solicitar_mercancia: null, // no viene en JSON → default
                    fraccion_hts_usa: null // no viene en JSON → default
                };
                return {
                    ...resp,
                    datos: DETALLES
                };
            })
        );
    }

    /**
     * Obtiene las facturas asociadas por folio de trámite.
     * @param numFolioTramite Número de folio del trámite.
     * @returns Observable con la respuesta del servidor que incluye las facturas asociadas.
     */
    getFacturasAsociadasPorFolio(numFolioTramite: string): Observable<BaseResponse<FacturasTplAsociadaResponse>> {
        const ENDPOINT = `${this.host}${API_GET_FACTURAS_ASOCIADAS_POR_FOLIO(numFolioTramite)}`;
        return this.http.get<BaseResponse<FacturasTplAsociadaResponse>>(ENDPOINT).pipe(
            map((resp: BaseResponse<FacturasTplAsociadaResponse>) => {
                const RAW_DATA = Array.isArray(resp.datos) ? resp.datos : resp.datos;
                const FACTURAS: FacturasTplAsociadaResponse = {
                    facturas_asociadas: {
                        id_expedicion: RAW_DATA?.facturas_asociadas?.id_expedicion ?? 0,
                        id_factura_expedicion: Number(RAW_DATA?.facturas_asociadas?.id_factura_expedicion ?? 0),
                        cantidad_asociada: RAW_DATA?.facturas_asociadas?.cantidad_asociada ?? 0,
                        factura_expedicion: {
                            cantidad: RAW_DATA?.facturas_asociadas?.factura_expedicion?.cantidad ?? 0,
                            num_factura: RAW_DATA?.facturas_asociadas?.factura_expedicion?.num_factura ?? '',
                            fecha_expedicion: RAW_DATA?.facturas_asociadas?.factura_expedicion?.fecha_expedicion ?? '',
                            id_documento: RAW_DATA?.facturas_asociadas?.factura_expedicion?.id_documento ?? 0,
                            razon_social: RAW_DATA?.facturas_asociadas?.factura_expedicion?.razon_social ?? '',
                            domicilio: RAW_DATA?.facturas_asociadas?.factura_expedicion?.domicilio ?? '',
                            unidad_medida: {
                                clave: RAW_DATA?.facturas_asociadas?.factura_expedicion?.unidad_medida?.clave ?? '',
                                descripcion: RAW_DATA?.facturas_asociadas?.factura_expedicion?.unidad_medida?.descripcion ?? ''
                            },
                            importe_dolares: RAW_DATA?.facturas_asociadas?.factura_expedicion?.importe_dolares ?? 0,
                            cantidad_disponible: RAW_DATA?.facturas_asociadas?.factura_expedicion?.cantidad_disponible ?? 0
                        }
                    },
                    resultado_equivalencia: {
                        cantidad_factura: RAW_DATA?.resultado_equivalencia?.cantidad_factura ?? 0,
                        total_equivalente: RAW_DATA?.resultado_equivalencia?.total_equivalente ?? 0,
                        unidad_label: RAW_DATA?.resultado_equivalencia?.unidad_label ?? ''
                    }
                };
                return {
                    ...resp,
                    datos: FACTURAS
                };
            })
        );
    }

    /**
     * Obtiene los datos del fabricante para un folio de trámite específico.
     * @param numFolioTramite Número de folio del trámite.
     * @returns Observable con la respuesta del servidor que incluye los datos del fabricante.
     */
    getDatosFabricante(numFolioTramite: string): Observable<BaseResponse<FabricanteResponse>> {
        const ENDPOINT = `${this.host}${API_GET_DATOS_FABRICANTE(numFolioTramite)}`;
        return this.http.get<BaseResponse<FabricanteResponse>>(ENDPOINT).pipe(
            map((resp: BaseResponse<FabricanteResponse>) => {
                const RAW_DATA = Array.isArray(resp.datos) ? resp.datos : resp.datos;
                const FABRICANTES: FabricanteResponse = {
                    numero_registro_fiscal: RAW_DATA?.numero_registro_fiscal ?? '',
                    nombre_fabricante: RAW_DATA?.nombre_fabricante ?? '',
                    correo_electronico: RAW_DATA?.correo_electronico ?? '',
                    telefono: RAW_DATA?.telefono ?? '',
                    direccion: RAW_DATA?.direccion ?? ''
                };
                return {
                    ...resp,
                    datos: FABRICANTES
                };
            })
        );
    }

    /**
     * Obtiene los datos del importador en destino para un folio de trámite específico.
     * @param numFolioTramite Número de folio del trámite.
     * @returns Observable con la respuesta del servidor que incluye los datos del importador en destino.
     */
    getDatosImportadorDestino(numFolioTramite: string): Observable<BaseResponse<ImportadorDestinoResponse>> {
        const ENDPOINT = `${this.host}${API_GET_DATOS_IMPORTADOR_DESTINO(numFolioTramite)}`;
        return this.http.get<BaseResponse<ImportadorDestinoResponse>>(ENDPOINT).pipe(
            map((resp: BaseResponse<ImportadorDestinoResponse>) => {
                const RAW_DATA = Array.isArray(resp.datos) ? resp.datos : resp.datos;
                const IMPORTADOR_DESTINO: ImportadorDestinoResponse = {
                    tipo_ior: RAW_DATA?.tipo_ior ?? '',
                    valor: RAW_DATA?.valor ?? '',
                    razon_social: RAW_DATA?.razon_social ?? '',
                    domicilio: RAW_DATA?.domicilio ?? '',
                    ciudad: RAW_DATA?.ciudad ?? '',
                    cp: RAW_DATA?.cp ?? '',
                    pais: RAW_DATA?.pais ?? ''
                };
                return {
                    ...resp,
                    datos: IMPORTADOR_DESTINO
                };
            })
        );
    }
}