import { Catalogo, ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { Observable, map } from "rxjs";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


import { 
    API_GET_CATALOGO_ADUANAS,
    API_GET_CATALOGO_BANCOS,
    API_GET_CATALOGO_COLONIAS,
    API_GET_CATALOGO_CONSULTA_PAISES,
    API_GET_CATALOGO_ENTIDADES_FEDERATIVAS,
    API_GET_CATALOGO_ENTIDADES_FEDERATIVAS_GENERAL,
    API_GET_CATALOGO_ENTIDAD_FEDERATIVA_MUNICIPIOS,
    API_GET_CATALOGO_ESPECIES,
    API_GET_CATALOGO_ESTABLECIMIENTO_TIF,
    API_GET_CATALOGO_FRACCIONES_ARANCELARIAS,
    API_GET_CATALOGO_FRACCION_ARANCELARIA,
    API_GET_CATALOGO_JUSTIFICACIONES_PAGO,
    API_GET_CATALOGO_MEDICOS_VETERINARIOS,
    API_GET_CATALOGO_MEDIO_TRANSPORTE,
    API_GET_CATALOGO_OFICINAS_INSPECCION,
    API_GET_CATALOGO_PAISES_SIN_MEXICO,
    API_GET_CATALOGO_PAIS_DESTINO, 
    API_GET_CATALOGO_PLANTAS_AUTORIZADAS,
    API_GET_CATALOGO_PUNTOS_VERIFICACION,
    API_GET_CATALOGO_PUNTO_INSPECCION,
    API_GET_CATALOGO_REGIMENES,
    API_GET_CATALOGO_REGIMENES_VIGENTES,
    API_GET_CATALOGO_RESTRICCIONES,
    API_GET_CATALOGO_SEXOS_ACTIVOS,
    API_GET_CATALOGO_SUBTIPO_PRESENTACION,
    API_GET_CATALOGO_TIPO_PLANTA,
    API_GET_CATALOGO_TIPO_PRESENTACION,
    API_GET_CATALOGO_UNIDADES_MEDIDA_COMERCIALES,
    API_GET_CATALOGO_USOS_MERCANCIA,    
    API_GET_DATOS_SOLICITUD,
    API_GET_SOLICITUDES_MOVILIZACION_NACIONAL,
    API_GET_SOLICITUDES_PAGO_DERECHOS,
    API_GET_SOLICITUDES_TERCEROS_RELACIONADOS,
} from '../../../../../core/server/api-router';
import { PrellenadoMovilizacion, PrellenadoPagoDerechos, PrellenadoSolicitud } from "../../../models/220201/prellenado-solicitud.model";

@Injectable({
    providedIn: 'root'
})
export class CatalogosService {
    /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
     * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
     * Es de solo lectura y se inicializa en el constructor del servicio.
     */
    host: string;

    /**
     * Constructor del servicio que inicializa la URL base del host.
     * @param http Instancia de HttpClient para realizar solicitudes HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Obtiene el catálogo de establecimientos TIF para un trámite específico.
     *
     * @param tramite - Identificador numérico del trámite.
     * @param rfc - Segundo parámetro requerido para la consulta del catálogo.
     * @param arg3 - Tercer parámetro requerido para la consulta del catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de elementos del catálogo.
     */
    obtieneCatalogoEstablecimientoTif(tramite: number, rfc: string, cveUcon: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ESTABLECIMIENTO_TIF(tramite.toString(), rfc, cveUcon)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de plantas autorizadas para un trámite específico.
     *
     * @param tramite - El identificador del trámite para el cual se solicita el catálogo.
     * @param cvePais - La clave del país asociada a la consulta.
     * @param cvePlanta - La clave de la planta a consultar.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de plantas autorizadas.
     */
    obtieneCatalogoPlantasAutorizadas(tramite: number, cvePais: string, cvePlanta: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_PLANTAS_AUTORIZADAS(tramite.toString(), cvePais, cvePlanta)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de unidades de medida comerciales para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoUnidadesMedidaComerciales(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_UNIDADES_MEDIDA_COMERCIALES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de usos de mercancía para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de usos de mercancía.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoUsosMercancia(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_USOS_MERCANCIA(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de restricciones asociado a un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se desea obtener el catálogo de restricciones.
     * @returns Un observable que emite la respuesta base conteniendo un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoRestricciones(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_RESTRICCIONES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    // eslint-disable-next-line class-methods-use-this
    obtieneCatalogoNico(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        // Servicio mock: regresa un dato fijo "00"
        return new Observable<BaseResponse<Catalogo[]>>(observer => {
            observer.next({
            datos: [{
                id: 0, clave: '00', descripcion: '00',
            },
            {
                id: 1, clave: '01', descripcion: '01'
            }],
            mensaje: tramite.toString(),
            codigo: '00',
            path: '',
            timestamp: new Date().toISOString()
            });
            observer.complete();
        });
    }

    /**
     * Obtiene el catálogo de fracciones correspondiente a un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo de fracciones.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoFraccionesArancelarias(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_FRACCIONES_ARANCELARIAS(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT).pipe(
            // Veo que al tener una descripcion muy larga, en la UI se ve mal, por eso ponen  la clave en UAT.
            map((response: BaseResponse<Catalogo[]>) => ({
                ...response,
                datos: response.datos?.map(item => ({
                    ...item,
                    descripcion: `${item.clave}`
                })) ?? []
            }))
        );
    }

    /**
     * Obtiene el catálogo de tipos de presentación para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoTipoPresentacion(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_TIPO_PRESENTACION(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de tipos de planta para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de tipos de planta.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoTipoPlanta(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_TIPO_PLANTA(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de subtipos de presentación para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo de subtipos de presentación.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoSubtipoPresentacion(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_SUBTIPO_PRESENTACION(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de sexos activos para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de sexos activos.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de sexos activos.
     */
    obtieneCatalogoSexosActivos(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_SEXOS_ACTIVOS(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de regímenes para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoRegimenes(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_REGIMENES_VIGENTES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de regímenes vigentes para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes vigentes.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoRegimenesVigentes(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_REGIMENES_VIGENTES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de puntos de verificación para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoPuntosVerificacion(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_PUNTOS_VERIFICACION(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de puntos de inspección para un trámite y OISA específicos.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param oisa - El identificador de la OISA (Oficina de Inspección de Sanidad Agropecuaria).
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de puntos de inspección.
     */
    obtieneCatalogoPuntoInspeccion(tramite: number, oisa: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_PUNTO_INSPECCION(tramite.toString(), oisa)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de países para consulta, según el trámite especificado.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de países.
     * @returns Un observable que emite la respuesta base con el arreglo de países del catálogo.
     */
    obtieneCatalogoConsultaPaises(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_CONSULTA_PAISES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de países excluyendo a México para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo de países.
     * @returns Un observable que emite la respuesta base con el arreglo de países disponibles (excluyendo México).
     */
    obtieneCatalogoPaisesSinMexico(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_PAISES_SIN_MEXICO(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de entidades federativas para un trámite y país específicos.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo.
     * @param cvePais - La clave del país para filtrar las entidades federativas.
     * @returns Un observable que emite la respuesta base con el arreglo de entidades federativas del catálogo.
     */
    obtieneCatalogoEntidadesFederativas(tramite: number, cvePais: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ENTIDADES_FEDERATIVAS(tramite.toString(), cvePais)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de países de destino para un trámite y tipo de producto específico.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param cveTipoProducto - La clave del tipo de producto.
     * @returns Un observable que emite la respuesta base con el catálogo de países.
     */
    obtieneCatalogoPaisDestino(tramite: number, cveTipoProducto: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_PAIS_DESTINO(tramite.toString(), cveTipoProducto)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de colonias correspondiente a un trámite y clave de delegación específicos.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo de colonias.
     * @param cveDelegNum - La clave de la delegación en formato de cadena.
     * @returns Un observable que emite la respuesta base con el arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoColonias(tramite: number, cveDelegNum: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_COLONIAS(tramite.toString(), cveDelegNum)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de medios de transporte para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoMedioTransporte(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_MEDIO_TRANSPORTE(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de justificaciones de pago para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo de justificaciones de pago.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
     */
    obtieneCatalogoJustificacionesPago(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_JUSTIFICACIONES_PAGO(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de fracciones arancelarias para un trámite y clave de fracción específicos.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo.
     * @param cveFraccion - La clave de la fracción arancelaria a consultar.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos correspondientes.
     */
    obtieneCatalogoFraccionArancelaria(tramite: number, cveFraccion: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_FRACCION_ARANCELARIA(tramite.toString(), cveFraccion)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de médicos veterinarios asociados a un trámite y establecimiento TIF específico.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param cveEstablecimientoTif - La clave del establecimiento TIF.
     * @returns Un observable que emite la respuesta base con el arreglo de elementos del catálogo de médicos veterinarios.
     */
    obtieneCatalogoMedicosVeterinarios(tramite: number, cveEstablecimientoTif: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_MEDICOS_VETERINARIOS(tramite.toString(), cveEstablecimientoTif)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    obtieneCatalogoEspecies(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ESPECIES(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo general de entidades federativas para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de entidades federativas.
     * @returns Un observable que emite la respuesta base con el arreglo de entidades federativas (`Catalogo[]`).
     */
    obtieneCatalogoEntidadesFederativasGeneral(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ENTIDADES_FEDERATIVAS_GENERAL(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de entidades federativas para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo.
     * @param cveEntidad - La clave de la entidad federativa a consultar.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos correspondientes.
     */
    obtieneCatalogoEntidadFederativaMunicipios(tramite: number, cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ENTIDAD_FEDERATIVA_MUNICIPIOS(tramite.toString(), cveEntidad)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de bancos asociado a un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de bancos.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
    obtieneCatalogoBancos(tramite: number): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_BANCOS(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de oficinas de inspección para un trámite y aduana específicos.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo.
     * @param cveAduana - La clave de la aduana asociada al trámite.
     * @returns Un observable que emite la respuesta base con el arreglo de objetos de catálogo de oficinas de inspección.
     */
    obtieneCatalogoOficinasInspeccion(tramite: number, cveAduana: string): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_OFICINAS_INSPECCION(tramite.toString(), cveAduana)}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene el catálogo de aduanas correspondiente a un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de aduanas.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
     */
    obtieneCatalogoAduana(tramite: number):Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_CATALOGO_ADUANAS(tramite.toString())}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

    /**
     * Obtiene una solicitud prellenada basada en los parámetros proporcionados.
     *
     * @param tramite - El identificador del trámite para el cual se obtiene la solicitud prellenada.
     * @param esPrellenado - Un booleano que indica si la solicitud debe estar prellenada.
     * @param cveUcon - La clave única asociada al usuario o contexto.
     * @returns Un observable que emite un `BaseResponse` que contiene la solicitud prellenada (`PrellenadoSolicitud`).
     */
    obtenSolicitudPrellenado(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoSolicitud>> {
        const ENDPOINT = `${this.host}${API_GET_DATOS_SOLICITUD(tramite.toString(), esPrellenado, idsolicitud)}`;
        return this.http.get<BaseResponse<PrellenadoSolicitud>>(ENDPOINT);
    }

    /**
     * Obtiene los datos prellenados para la movilización nacional de una solicitud específica.
     * 
     * @param tramite - Identificador numérico del trámite.
     * @param idsolicitud - Identificador único de la solicitud.
     * @returns Un observable que emite la respuesta base con los datos prellenados de la movilización.
     */
    obtenerMovilizacionPrellenado(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoMovilizacion>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_MOVILIZACION_NACIONAL(tramite.toString(), esPrellenado, idsolicitud)}`;
        return this.http.get<BaseResponse<PrellenadoMovilizacion>>(ENDPOINT);
    }

    /**
     * Obtiene los terceros relacionados para el prellenado de una solicitud específica.
     *
     * @param tramite - Identificador numérico del trámite.
     * @param esPrellenado - Indica si se trata de un prellenado (true) o no (false).
     * @param idsolicitud - Identificador único de la solicitud.
     * @returns Un observable que emite la respuesta base con los datos de prellenado de movilización.
     */
    obtenerTerceroRelacionadosPrellenado(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoMovilizacion>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_TERCEROS_RELACIONADOS(tramite.toString(), esPrellenado, idsolicitud)}`;
        return this.http.get<BaseResponse<PrellenadoMovilizacion>>(ENDPOINT);
    }

    /**
     * Obtiene los datos prellenados para el pago de derechos de movilización.
     *
     * @param tramite - Identificador del trámite.
     * @param esPrellenado - Indica si se trata de un prellenado.
     * @param idsolicitud - Identificador de la solicitud.
     * @returns Un observable que emite la respuesta base con los datos prellenados de movilización.
     */
    obtenerPagoDerechosPrellenado(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoPagoDerechos>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_PAGO_DERECHOS(tramite.toString(), esPrellenado, idsolicitud)}`;
        return this.http.get<BaseResponse<PrellenadoPagoDerechos>>(ENDPOINT);
    }
}