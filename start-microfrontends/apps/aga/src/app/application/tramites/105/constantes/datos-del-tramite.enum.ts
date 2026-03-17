import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  }
];
export const MERCANCIA_TABLEDOS_TABLE_BODY_DATA = {
  tbodyData: [
    "Representante Legal",
    "Carlos Alberto",
    "Gómez",
    "Ramírez",
    "PA12345678"
  ]
};
export const FRACCIONES_TABLEDOS_TABLE_BODY_DATA = {
  tbodyData: [
    "0101.21.01",
    "Carlos Alberto",
    "CABALLOS DESTINADOS PARA REPRODUCCIÓN CON PEDIGRÍ CERTIFICADO",
  ]
};
/**
 * Representa la estructura de los datos de una tabla relacionada con el trámite.
 *
 * @property fraccionArancelaria - La fracción arancelaria correspondiente.
 * @property descripcion - Descripción principal del elemento.
 * @property descripcionAdicional - Información adicional o complementaria de la descripción.
 */
export interface tableDatos {
  fraccionArancelaria: string;
  descripcion: string;
  descripcionAdicional: string;
}
  /**
   * Configuración de las columnas para la tabla de datos del trámite.
   * 
   * Cada objeto en el arreglo representa una columna de la tabla, especificando:
   * - `encabezado`: El nombre que se mostrará como encabezado de la columna.
   * - `clave`: Una función que recibe un elemento de tipo `tableDatos` y retorna el valor a mostrar en la columna.
   * - `orden`: El orden en el que se mostrará la columna en la tabla.
   * 
   * Las columnas configuradas son:
   * 1. Fracción arancelaria
   * 2. Descripción
   * 3. Descripción adicional de la mercancía
   */
  export const ACUSE_DATOS: ConfiguracionColumna<tableDatos>[] = [
    { encabezado: 'Fracción arancelaria', clave: (item: tableDatos) => item.fraccionArancelaria, orden: 1 },
    { encabezado: 'Descripción', clave: (item: tableDatos) => item.descripcion, orden: 2 },
    { encabezado: 'Descripción adicional de la mercancía', clave: (item: tableDatos) => item.descripcionAdicional, orden: 3 },
  ];
  /**
   * Representa los datos principales de un agente.
   *
   * @property {string} nombres - Nombres del agente.
   * @property {string} primerApellido - Primer apellido del agente.
   * @property {string} segundoApellido - Segundo apellido del agente.
   * @property {string} numeroPatente - Número de patente asociado al agente.
   */
  export interface AgentestableDatos {
    nombres: string;
    primerApellido: string;
    segundoApellido: string;
    numeroPatente: string;
    operaciones: string;
}

  /**
   * Arreglo de configuraciones de columnas para mostrar los datos de agentes en una tabla.
   * Cada objeto define el encabezado de la columna, la clave para extraer el dato del objeto `AgentestableDatos`
   * y el orden en el que debe aparecer la columna.
   *
   * @remarks
   * - "Tipo de Figura" utiliza el campo `segundoApellido` de `AgentestableDatos`.
   * - "Nombre(s)" utiliza el campo `nombres`.
   * - "Apellido materno" aparece dos veces, usando `primerApellido` y `segundoApellido` respectivamente.
   * - "Patente/Autorización" utiliza el campo `numeroPatente`.
   *
   * @typeParam AgentestableDatos - Tipo de los datos de agente.
   */
  export const Agentes_DATOS: ConfiguracionColumna<AgentestableDatos>[] = [
    { encabezado: "Tipo de Figura", clave: (item: AgentestableDatos) => item.operaciones, orden: 1 },
    { encabezado: "Nombre(s)", clave: (item: AgentestableDatos) => item.nombres, orden: 2 },
    { encabezado: "Apellido paterno", clave: (item: AgentestableDatos) => item.primerApellido, orden: 3 },
    { encabezado: "Apellido materno", clave: (item: AgentestableDatos) => item.segundoApellido, orden: 4 },
    { encabezado: "Patente/Autorización", clave: (item: AgentestableDatos) => item.numeroPatente, orden: 5 },
  ];
