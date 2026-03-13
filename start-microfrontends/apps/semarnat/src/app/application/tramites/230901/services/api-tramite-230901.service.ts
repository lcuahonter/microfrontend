import { Injectable, inject } from '@angular/core';

import { Catalogo, ENVIRONMENT, HttpCoreService } from '@libs/shared/data-access-user/src';

import { Observable } from 'rxjs';
import {
    API_GET_ADUANAS, API_GET_BANCOS, API_GET_CLASIFICACION_TAXONOMICA, API_GET_DATOS_PAGOS, API_GET_DESCRIPCION_FRACCION_ARANCELARIA,
    API_GET_DESTINATARIO_RECINTOS, API_GET_DESTINATARIO_RECINTOS_CLAVE, API_GET_ENTIDADES_FEDERATIVAS, API_GET_FRACCIONES_ARANCELARIAS,
    API_GET_MOVIMIENTOS, API_GET_NOMBRE_CIENTIFICO, API_GET_NOMBRE_COMUN, API_GET_PAISES, API_GET_PAISES_SIN_MEXICO, API_GET_REGIMENES,
    API_GET_UNIDAD_MEDIDA, API_GET_USOS_MERCANCIA, API_POST_GUARDA_SOLICITUD, CLAVE_CLASIFICACION_TAXONOMICA, CLAVE_FRACCION_ARANCELARIA,
    CLAVE_NOMBRE_CIENTIFICO, CLAVE_RECINTO, RFC, TIPO_MOVIMIENTO
} from '../constantes/api-constants';

import { SimpleCatalogoResponse } from '../interfaces/catalogos.interface';
import { DestinatarioConfiguracionItem } from '../enum/destinatario-tabla.enum';
import { SolicitudPayload } from '../estados/store/tramite230901.store';
import { GuardaSolicitudResponse } from './T230902.service';

/** Host base de la API (se obtiene de la configuración de entorno) */
const urlServer = `${ENVIRONMENT.API_HOST}/api/`;


@Injectable({
    providedIn: 'root'
})
export class ApiTramite230902Service {
    /** http inicializa el httpService para realizar solicitudes HTTP */
    private httpService = inject(HttpCoreService)


    /**
    * Obtiene la lista de los tipos de movimientos.
    * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
    */
    getMovimientos(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_MOVIMIENTOS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de los tipos de régimen.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getRegimenes(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_REGIMENES}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }


    /**
     * Obtiene la lista de Aduanas.
     * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
     */
    getListaAduanas(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_ADUANAS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Movimientos.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaMovimientos(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_USOS_MERCANCIA}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Fracciones Arancelarias.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaFraccionesArancelarias(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_FRACCIONES_ARANCELARIAS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }


    /**
     * Obtiene la descripcion de clave Fracción arancelaria
     * @param claveFraccionArancelaria  del catalogo clasificaciónn taxonomica.
     * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
     */
    getDecripcionFraccionArancelaria(
        claveFraccionArancelaria: string
    ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_DESCRIPCION_FRACCION_ARANCELARIA.replace(
            CLAVE_FRACCION_ARANCELARIA,
            claveFraccionArancelaria
        )}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Fracciones Arancelarias.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaClasificacionTaxonomica(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_CLASIFICACION_TAXONOMICA}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
      * Obtiene el nombre cientifico.
      * @param claveClasificacionTaxonomica  del catalogo clasificaciónn taxonomica.
      * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
      */
    getNombreCientifico(
        claveClasificacionTaxonomica: string
    ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_NOMBRE_CIENTIFICO.replace(
            CLAVE_CLASIFICACION_TAXONOMICA,
            claveClasificacionTaxonomica
        )}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
    }


    /**
      * Obtiene el nombre comun.
      * @param claveClasificacionTaxonomica  del catalogo clasificaciónn taxonomica.
      * @param nombreCientifico del catalogo nombre cientifico.
      * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
      */
    getNombreComun(
        claveClasificacionTaxonomica: string,
        claveNombreCientifico: string
    ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_NOMBRE_COMUN.replace(
            CLAVE_CLASIFICACION_TAXONOMICA,
            claveClasificacionTaxonomica
        ).replace(CLAVE_NOMBRE_CIENTIFICO, claveNombreCientifico)}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
    }

    /**
       * Obtiene la lista de unidades de medida
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaUnidadMedida(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_UNIDAD_MEDIDA}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Paises.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaPaises(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_PAISES}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Paises sin Mexico.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaPaisesSinMexico(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_PAISES_SIN_MEXICO}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene la lista de Destinatarios Recintos.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getDestinatarioRecinto(
        tipo_movimiento: string,
        rfc: string
    ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_DESTINATARIO_RECINTOS.replace(
            TIPO_MOVIMIENTO,
            tipo_movimiento
        ).replace(RFC, rfc)}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
    }

    /**
      * Servicio que permite consultar el domicilio del recinto del destinatario con Clave Recinto.
      * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
      */
    getDestinatarioRecintoClave(
        tipo_movimiento: string,
        rfc: string,
        clave_recinto: string
    ): Observable<SimpleCatalogoResponse<DestinatarioConfiguracionItem[]>> {
        const URL = `${urlServer}${API_GET_DESTINATARIO_RECINTOS_CLAVE.replace(TIPO_MOVIMIENTO, tipo_movimiento)
            .replace(RFC, rfc)
            .replace(CLAVE_RECINTO, clave_recinto)}`;
        return this.httpService.get<SimpleCatalogoResponse<DestinatarioConfiguracionItem[]>>(URL)
    }

    /**
       * Obtiene las Entidades Federativas.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaEntidadesFederativas(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_ENTIDADES_FEDERATIVAS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene los Datos de Pago.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getDatosPago(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_DATOS_PAGOS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }

    /**
       * Obtiene los Bancos.
       * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
       */
    getListaBancos(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
        const URL = `${urlServer}${API_GET_BANCOS}`;
        return this.httpService.get<SimpleCatalogoResponse<Catalogo[]>>(URL)
    }


    /**
  * Metodo para guardar la  Solicitud.
  * @solicitudPayload dtos requeridos para el guardado
  * @returns Observable<GuardaSolicitudResponse> Respuesta del guardado de la solicitud
  */
    crearSolicitud(
        SOLICITUD_PAYLOAD: SolicitudPayload
    ): Observable<SimpleCatalogoResponse<GuardaSolicitudResponse>> {
        const URL = `${urlServer}${API_POST_GUARDA_SOLICITUD}`;
        return this.httpService.post<SimpleCatalogoResponse<GuardaSolicitudResponse>>(URL, { body: SOLICITUD_PAYLOAD })
    }



}
