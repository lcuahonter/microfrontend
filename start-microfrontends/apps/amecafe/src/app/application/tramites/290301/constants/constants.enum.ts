import { BeneficiosData, BodegasData, CafeExportadoresData, RegionesData } from "../models/filadata.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/** Opciones para el radio button */
export const RADIO_OPCION = [
    /** Opción para "Sí" */
    { label: 'Sí', value: 'Si' },
    /** Opción para "No" */
    { label: 'No', value: 'No' }
];

/** Configuración de columnas para la tabla de regiones */
export const REGIONES_TABLA: ConfiguracionColumna<RegionesData>[] = [
  {
    /** Encabezado para la columna "Estado" */
    encabezado: 'Estado',
    clave: (fila) => fila.estado,
    orden: 1
  },
  {
    /** Encabezado para la columna "Café Compra" */
    encabezado: 'Café Compra',
    clave: (fila) => fila.cafeCompra,
    orden: 2
  },
  {
    /** Encabezado para la columna "Región" */
    encabezado: 'Región',
    clave: (fila) => fila.region,
    orden: 3
  },
  {
    /** Encabezado para la columna "Tipo de Café" */
    encabezado: 'Tipo de Café',
    clave: (fila) => fila.tipoDeCafe,
    orden: 4
  },
  {
    /** Encabezado para la columna "Volúmen" */
    encabezado: 'Volúmen',
    clave: (fila) => fila.volumen,
    orden: 5
  }
];

/** Configuración de columnas para la tabla de beneficios */
export const BENEFICIOS_TABLA: ConfiguracionColumna<BeneficiosData>[] = [
  {
    /** Encabezado para la columna "Nombre" */
    encabezado: 'Nombre',
    clave: (fila) => fila.nombre,
    orden: 1
  },
  {
    /** Encabezado para la columna "Calle" */
    encabezado: 'Calle',
    clave: (fila) => fila.calle,
    orden: 2
  },
  {
    /** Encabezado para la columna "Número Exterior" */
    encabezado: 'Número Exterior',
    clave: (fila) => fila.numeroExterior,
    orden: 3
  },
  {
    /** Encabezado para la columna "Número Interior" */
    encabezado: 'Número Interior',
    clave: (fila) => fila.numeroInterior,
    orden: 4
  },
  {
    /** Encabezado para la columna "Colonia" */
    encabezado: 'Colonia',
    clave: (fila) => fila.colonia,
    orden: 5
  },
  {
    /** Encabezado para la columna "Estado" */
    encabezado: 'Estado',
    clave: (fila) => fila.estado,
    orden: 6
  },
  {
    /** Encabezado para la columna "Código Postal" */
    encabezado: 'Código Postal',
    clave: (fila) => fila.codigoPostal,
    orden: 7
  },
  {
    /** Encabezado para la columna "Propia o Aliquilada" */
    encabezado: 'Propia o Aliquilada',
    clave: (fila) => fila.propiaoAliquilada,
    orden: 8
  },
  {
    /** Encabezado para la columna "Capacidad (Kg)" */
    encabezado: 'Capacidad (Kg)',
    clave: (fila) => fila.capacidad,
    orden: 9
  },
  {
    /** Encabezado para la columna "Volúmen (Kg)" */
    encabezado: 'Volúmen (Kg)',
    clave: (fila) => fila.volumen,
    orden: 10
  }
];

/** Configuración de columnas para la tabla de bodegas */
export const BODEGAS_TABLA: ConfiguracionColumna<BodegasData>[] = [
  {
    /** Encabezado para la columna "Nombre" */
    encabezado: 'Nombre',
    clave: (fila) => fila.nombre,
    orden: 1
  },
  {
    /** Encabezado para la columna "Calle" */
    encabezado: 'Calle',
    clave: (fila) => fila.calle,
    orden: 2
  },
  {
    /** Encabezado para la columna "Número Exterior" */
    encabezado: 'Número Exterior',
    clave: (fila) => fila.numeroExterior,
    orden: 3
  },
  {
    /** Encabezado para la columna "Número Interior" */
    encabezado: 'Número Interior',
    clave: (fila) => fila.numeroInterior,
    orden: 4
  },
  {
    /** Encabezado para la columna "Colonia" */
    encabezado: 'Colonia',
    clave: (fila) => fila.colonia,
    orden: 5
  },
  {
    /** Encabezado para la columna "Estado" */
    encabezado: 'Estado',
    clave: (fila) => fila.estado,
    orden: 6
  },
  {
    /** Encabezado para la columna "Código Postal" */
    encabezado: 'Código Postal',
    clave: (fila) => fila.codigoPostal,
    orden: 7
  },
  {
    /** Encabezado para la columna "Propia o Aliquilada" */
    encabezado: 'Propia o Aliquilada',
    clave: (fila) => fila.propiaoAliquilada,
    orden: 8
  },
  {
    /** Encabezado para la columna "Capacidad (Kg)" */
    encabezado: 'Capacidad (Kg)',
    clave: (fila) => fila.capacidad,
    orden: 9
  }
];

/** Configuración de columnas para la tabla de café exportadores */
export const CAFE_EXPORTADORES_TABLA: ConfiguracionColumna<CafeExportadoresData>[] = [
  {
    /** Encabezado para la columna "Marca Comercial" */
    encabezado: 'Marca Comercial',
    clave: (fila) => fila.marcaComercial,
    orden: 1
  },
  {
    /** Encabezado para la columna "Clasificación" */
    encabezado: 'Clasificación',
    clave: (fila) => fila.clasificacion,
    orden: 2
  },
  {
    /** Encabezado para la columna "Volúmen (Kg)" */
    encabezado: 'Volúmen (Kg)',
    clave: (fila) => fila.volumen,
    orden: 3
  }
];