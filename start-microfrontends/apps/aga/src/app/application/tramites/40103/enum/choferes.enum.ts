import { ChoferesExtranjeros, DatosDelChoferNacional } from "../models/registro-muestras-mercancias.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

export const CHOFERES_NACIONALES_ALTA: ConfiguracionColumna<DatosDelChoferNacional>[] = [
    {
        encabezado: 'CURP',
        clave: (item: DatosDelChoferNacional) => item.curp,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (item: DatosDelChoferNacional) => item.nombre,
        orden: 2,
    },
    {
        encabezado: 'Calle',
        clave: (item: DatosDelChoferNacional) => item.calle,
        orden: 3,
    },
    {
        encabezado: 'Número exterior',
        clave: (item: DatosDelChoferNacional) => item.numeroExterior,
        orden: 4,
    },
    {
        encabezado: 'Número interior',
        clave: (item: DatosDelChoferNacional) => item.numeroInterior,
        orden: 5,
    },
    {
        encabezado: 'País',
        clave: (item: DatosDelChoferNacional) => item.pais,
        orden: 6,
    },
    {
        encabezado: 'Estado',
        clave: (item: DatosDelChoferNacional) => item.estado,
        orden: 7,
    },
    {
        encabezado: 'Municipio o Alcaldía',
        clave: (item: DatosDelChoferNacional) => item.municipioAlcaldia,
        orden: 8,
    },
    {
        encabezado: 'Colonia',
        clave: (item: DatosDelChoferNacional) => item.colonia,
        orden: 9,
    },
    {
        encabezado: 'Localidad',
        clave: (item: DatosDelChoferNacional) => item.localidad,
        orden: 10,
    },
    {
        encabezado: 'Código Postal',
        clave: (item: DatosDelChoferNacional) => item.codigoPostal,
        orden: 11,
    },
    {
        encabezado: 'País de residencia',
        clave: (item: DatosDelChoferNacional) => item.paisDeResidencia,
        orden: 12,
    }
];

export const CHOFERES_EXTRANJEROS_TABLA: ConfiguracionColumna<ChoferesExtranjeros>[] = [
    {
        encabezado: 'Número del seguro social',
        clave: (item: ChoferesExtranjeros) => item.numeroDelSeguroSocial,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (item: ChoferesExtranjeros) => item.numero,
        orden: 2,
    },
    {
        encabezado: 'Calle',
        clave: (item: ChoferesExtranjeros) => item.calle,
        orden: 3,
    },
    {
        encabezado: 'Número exterior',
        clave: (item: ChoferesExtranjeros) => item.numeroExterior,
        orden: 4,
    },
    {
        encabezado: 'Número interior',
        clave: (item: ChoferesExtranjeros) => item.numeroInterior,
        orden: 5,
    },
    {
        encabezado: 'Estado',
        clave: (item: ChoferesExtranjeros) => item.estado,
        orden: 6,
    },
    {
        encabezado: 'País',
        clave: (item: ChoferesExtranjeros) => item.pais,
        orden: 7,
    },
    {
        encabezado: 'Ciudad',
        clave: (item: ChoferesExtranjeros) => item.ciudad,
        orden: 8,
    },
    {
        encabezado: 'Código Postal',
        clave: (item: ChoferesExtranjeros) => item.codigoPostal,
        orden: 9,
    },
    {
        encabezado: 'País de residencia',
        clave: (item: ChoferesExtranjeros) => item.paisDeResidencia,
        orden: 10,
    },
];

export const TEXTOS = {
    MENSAJE_NACIONAL: `<p>Para modificar o dar de baja un chófer nacional existente en su CAAT, primero debe realizar su búsqueda.</p>`,
    MENSAJE_EXTRANJERO: `<p>Para modificar o dar de baja un chófer extranjero existente en su CAAT, primero debe realizar su búsqueda.</p>`,
};
