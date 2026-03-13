import { CatalogosResponse } from '@libs/shared/data-access-user/src';

export type SimpleCatalogoResponse<T> = Pick<
    CatalogosResponse,
    'codigo' | 'mensaje'
> & { datos: T };

export const DUMMY_SOLICITUD = {
    "id_solcitud": null,
    "regimen": [{
        "id": 0,
        "descripcion": "Definitivos",
        "clave": "02"
    }],
    "clasificacion_regimen": [{
        "id": 0,
        "descripcion": "Importacion",
        "clave": "01"
    }],
    "cve_clasificacion_regimen": "01",
    "cve_regimen": "02",
    "movimientos_seleccionados": [
        "Movimiento 1", "Movimiento 2"
    ],
    "aduanas_seleccionadas": [
        "Movimiento 1", "Movimiento 2"
    ],
    "pago": {
        "cve_referencia_bancaria": "084000966",
        "cadena_pago_dependencia": "00130090940161",
        "llave_pago": "SFDDDFSDFD",
        "fec_pago": "08/01/2026",//08/01/2026 2026-01-13
        "cve_banco": "12",
        "imp_pago": 672,
        "banco": [{
            "id": 0,
            "descripcion": "Banco XYZ",
            "clave": "12"
        }],
    },
    "destinatario": [{
        "codigo_postal": "ddd",
        "cve_pais": "MEX",
        "cve_entidad_federativa": "BCN",
        "domicilio": "12",
        "ciudad": "",
        "es_nuevo": true,
        "pais": "MEXICO (ESTADOS UNIDOS MEXICANOS)",
        "id_direccion": ""
    }],
    "mercancias": [
        {
            "id_mercancia": 1,
            "cve_fraccion_arancelaria": "01012999",
            "descripcion_mercancia": "dd",
            "rendimiento_producto": "",
            "cve_nombre_cientifico": "Acanthosaura armata",
            "cve_nombre_comun": "21095",
            "marca_marcaje": "marca",
            "cantidad": "112",
            "cve_unidad_medida_comercial": "1",
            "cve_pais_origen": "AFG",
            "cve_pais_procedencia": "AFG",
            "nombre_cientifico": "Acanthosaura armata",
            "nombre_comun": "LAGARTIJA DE MONTAÑA",
            "id_fraccion_gubernamental": 260577,
            "clave_fraccion_arancelaria": "",
            "cve_clasificacion_taxonomica": "CLSTX.ANI",
            "nombre_comun_especifique": "",
            "unidad_medida_comercial": "Kilogramo",
            "pais_origen": "AFGANISTAN (EMIRATO ISLAMICO DE)",
            "pais_procedencia": "AFGANISTAN (EMIRATO ISLAMICO DE)"
        }
    ],
}


export const DefaultValidacionFormularios =
{
    isFormValid: false,
    isGuardForm: false,
    tabRequired: 0
}

