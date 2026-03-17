/**
 * Declaración oficial relacionada con la importación de mercancías.
 * Se establece que el aviso debe presentarse al menos 30 días antes de realizar la primera importación.
 */
export const MESSAGE_NAC: string =

`<p style="font-size:16px">-Tratándose de socios o accionistas, deberá presentar el documento denominado <strong>"Relación de los socios, accionistas o asociados, residentes en el extranjero"</strong>, conforme la norma oficial aprobada número 96, 
del Apartado A del Anexo 1 de la RMF para 2017.</p>
 <p style="font-size:16px" class="mt-4">-Tratándose de representante legal, administrador único y/o miembros del consejo de administración,  de forma enunciativa, más no limitativa, podrá presentar documentos que acrediten que dichas personas no se encuentran obligadas a tributar en México, tales como,
Opinión del cumplimiento de obligaciones fiscales con la leyenda "Sin obligaciones fiscales, "constancia de residencia para efectos fiscales del país donde tributa
declaraciones fiscales del país donde se encuentren obligados a tributar,
pasaporte expedido por su país de origen, etc. Deberá presentar el documento denominado <strong>"documento que acredite no tributar en México"</strong>.
`;
/**
 * Mensaje que indica que se debe incluir un escrito libre en el apartado correspondiente si se modific
 * las partes contratantes en la documentación con la que se acreditó el legal uso y goce del domicilio.
 * Este mensaje se utiliza para informar al usuario sobre la necesidad de adjuntar un documento adicional.
 *  * @type {string}
 */
export interface ModificacionSociosItem {
    id?: number;
    tipo_persona: string;
    nombre: string;
    rfc: string;
    tipo_caracter: string;
    nacionalidad: string;
    obligado_tributar: boolean;
    nombre_empresa: string;
    tipo_movimiento: string;
}

 export const MODIFICACION_SOCIOS_HEADERS = [
        "Tipo de Persona", 
        "Nombre",
        "RFC",
        "En su carácter de",
        "Nacionalidad",
        "Obligado a tributar en  México", 
          "Nombre de la empresa",
        "Tipo de movimiento"
        ]
/**
 * Configuración de las columnas para la tabla de modificación de socios.
 * Cada objeto en el array representa una columna con su encabezado, clave para acceder a los datos y orden de visualización.
 * @type {ConfiguracionColumna<ModificacionSociosItem>[]}
 */
export const CONFIGURATION_TABLA_MODIFICACION_SOCIOS = [
    {
        encabezado: 'Tipo de Persona',
        clave: (item: ModificacionSociosItem): string => item.tipo_persona,
        orden: 1
    },
    {
        encabezado: 'Nombre',
        clave: (item: ModificacionSociosItem): string => item.nombre,
        orden: 2
    },
    {
        encabezado: 'RFC',
        clave: (item: ModificacionSociosItem): string => item.rfc,
        orden: 3
    },
    {
        encabezado: 'En su carácter de',
        clave: (item: ModificacionSociosItem): string => item.tipo_caracter,
        orden: 4
    },
    {
        encabezado: 'Nacionalidad',
        clave: (item: ModificacionSociosItem): string => item.nacionalidad,
        orden: 5
    },
    {
        encabezado: 'Obligado a tributar en  México',
        clave: (item: ModificacionSociosItem): boolean => item.obligado_tributar,
        orden: 6
    },
    {
        encabezado: 'Nombre de la empresa',
        clave: (item: ModificacionSociosItem): string => item.nombre_empresa,
        orden: 7
    },
    {
        encabezado: 'Tipo de movimiento',
        clave: (item: ModificacionSociosItem): string => item.tipo_movimiento,
        orden: 8
    }
];
