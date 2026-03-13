import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

import { EmpresasLista } from "../models/prosec.model";

/**
 * Configuración de la tabla de empresas
 * @type {ConfiguracionColumna<EmpresasLista>[]}
 */
export const TABLA_EMPRESAS_LISTA: ConfiguracionColumna<EmpresasLista>[] = [
    {
        encabezado: 'Estatus',
        clave: (item: EmpresasLista) => item.estatus,
        orden: 1
    },
    {
        encabezado: 'RFC',
        clave: (item: EmpresasLista) => item.rfc,
        orden: 2
    },
    {
        encabezado: 'Razón social',
        clave: (item: EmpresasLista) => item.razonSocial,
        orden: 3
    },
    {
        encabezado: 'Calle',
        clave: (item: EmpresasLista) => item.calle,
        orden: 4
    },
    {
        encabezado: 'Número interior',
        clave: (item: EmpresasLista) => item.numeroInterior,
        orden: 5
    },
    {
        encabezado: 'Número exterior',
        clave: (item: EmpresasLista) => item.numeroExterior,
        orden: 6
    },
    {
        encabezado: 'Código postal',
        clave: (item: EmpresasLista) => item.codigoPostal,
        orden: 7
    },
    {
        encabezado: 'Localidad',
        clave: (item: EmpresasLista) => item.localidad,
        orden: 8
    },
    {
        encabezado: 'Municipio o alcadía',
        clave: (item: EmpresasLista) => item.municipioAlcadia,
        orden: 9
    },
    {
        encabezado: 'Entidad federativa',
        clave: (item: EmpresasLista) => item.entidadFederativa,
        orden: 10
    },
    {
        encabezado: 'pais',
        clave: (item: EmpresasLista) => item.pais,
        orden: 11
    },
    {
        encabezado: 'Teléfono',
        clave: (item: EmpresasLista) => item.telefono,
        orden: 12
    },
    {
        encabezado: 'Fax',
        clave: (item: EmpresasLista) => item.fax,
        orden: 13
    },
    {
        encabezado: 'Correo electrónico',
        clave: (item: EmpresasLista) => item.correoElectronico,
        orden: 14
    }
];

/**
 * Mensaje de error para productores indirectos no válidos.
 * @type {string}
 */
export const ALERTA_ERROR = `<p style='text-align: center;'>Corrija los siguientes errores:</p>
<div style="display: grid; grid-template-columns: auto 1fr; align-items: center; width: 100%; color: #d0021b;">
  <span>1.</span>
  <span style="text-align: center;">(La solicitud no cuenta con productores indirectos validos para realizar la baja)es un campo requerido</span>
</div>`;