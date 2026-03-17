
import { Catalogo } from './certificado-origen.model';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

/**
 * Representa la configuración para Federatarios y Plantas.
 * 
 * @template T - El tipo genérico que se utilizará para las columnas de la tabla.
 * 
 * @property {TablaSeleccion} TablaSeleccion - Configuración de la tabla de selección.
 * @property {ConfiguracionColumna<T>[]} TablaEncabezado - Configuración de las columnas del encabezado de la tabla.
 */
export interface FederatariosYPlantasConfiguration<T> {
  TablaSeleccion: TablaSeleccion;
  TablaEncabezado: ConfiguracionColumna<T>[];
}

/**
 * Representa la configuración para un componente de tipo "Expresas".
 * 
 * @template T - El tipo genérico que se utilizará para las columnas de la tabla.
 * 
 * @property {TablaSeleccion} TablaSeleccion - Configuración de la tabla de selección.
 * @property {ConfiguracionColumna<T>[]} TablaEncabezado - Configuración de las columnas del encabezado de la tabla.
 */
export interface ExpresasConfiguration<T> {
  TablaSeleccion: TablaSeleccion;
  TablaEncabezado: ConfiguracionColumna<T>[];
}
/**
 * Representa el encabezado de un federatario, incluyendo información personal y de su acta notarial.
 *
 * @interface FederatariosEncabezado
 * 
 * @property {string} nombre - Nombre del federatario.
 * @property {string} primerApellido - Primer apellido del federatario.
 * @property {string} segundoApellido - Segundo apellido del federatario.
 * @property {string} numeroDeActa - Número del acta asociada al federatario.
 * @property {string} fechaDelActa - Fecha en que se emitió el acta.
 * @property {string} numeroDeNotaria - Número de la notaría a la que pertenece el federatario.
 * @property {string} entidadFederativa - Entidad federativa donde se encuentra la notaría.
 * @property {string} municipioODelegacion - Municipio o delegación donde se encuentra la notaría.
 */
export interface FederatariosEncabezado {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDeActa: string;
  fechaDelActa: string;
  numeroDeNotaria: string;
  entidadFederativa: string;
  municipioODelegacion: string;
  estado: string;
  estadoOptions: string;
  estadoUno: string;
  estadoDos: string;
  estadoTres: string;
}

/**
 * Representa un catálogo de estados con tres propiedades distintas.
 *
 * @property estadoUno - El primer estado del catálogo.
 * @property estadoDos - El segundo estado del catálogo.
 * @property estadoTres - El tercer estado del catálogo.
 */
export interface EstadoCatalogo {
estadoUno: string;
estadoDos: string;
estadoTres: string;
}

/**
 * Representa un catálogo de estados con tres propiedades que contienen listas de objetos `Catalogo`.
 *
 * @property estadoUno - Lista de objetos `Catalogo` para el primer estado.
 * @property estadoDos - Lista de objetos `Catalogo` para el segundo estado.
 * @property estadoTres - Lista de objetos `Catalogo` para el tercer estado.
 */
export interface EstadoOptionCatalogo {
estadoUnoOption: Catalogo[];
estadoDosOption: Catalogo[];
estadoTresOption: Catalogo[];
}

/**
 * Constante que define una lista de encabezados y claves asociadas para los datos de federatarios.
 * 
 * Cada objeto en la lista representa un encabezado de columna y su clave asociada, que se utiliza
 * para acceder a los valores correspondientes en un objeto de tipo `FederatariosEncabezado`.
 * 
 * Propiedades de cada objeto:
 * - `encabezado`: Nombre del encabezado que se mostrará en la interfaz de usuario.
 * - `clave`: Función que toma un objeto de tipo `FederatariosEncabezado` y devuelve el valor correspondiente
 *   para esa columna.
 * - `orden`: Número que indica el orden en el que se deben mostrar los encabezados.
 * 
 * Uso:
 * Esta constante puede ser utilizada para generar dinámicamente tablas o listas basadas en los datos
 * de federatarios, asegurando un mapeo consistente entre los encabezados y los valores de los datos.
 */
export const FEDERATARIOS = [
  {
    encabezado: 'Nombre(s)',
    clave: (ele: FederatariosEncabezado): string => ele.nombre,
    orden: 1,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: FederatariosEncabezado): string => ele.primerApellido,
    orden: 2,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: FederatariosEncabezado): string => ele.segundoApellido,
    orden: 3,
  },
  {
    encabezado: 'Número de acta',
    clave: (ele: FederatariosEncabezado): string => ele.numeroDeActa,
    orden: 4,
  },
  {
    encabezado: 'Fecha del acta',
    clave: (ele: FederatariosEncabezado): string => ele.fechaDelActa,
    orden: 5,
  },
  {
    encabezado: 'Número de notaría',
    clave: (ele: FederatariosEncabezado): string => ele.numeroDeNotaria,
    orden: 6,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: FederatariosEncabezado): string => ele.entidadFederativa,
    orden: 7,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: FederatariosEncabezado): string => ele.municipioODelegacion,
    orden: 8,
  },
];

/**
 * Representa la información de las plantas disponibles.
 * 
 * @property calle - Nombre de la calle donde se encuentra la planta.
 * @property numeroExterior - Número exterior del domicilio de la planta.
 * @property numeroInterior - Número interior del domicilio de la planta.
 * @property codigoPostal - Código postal del domicilio de la planta.
 * @property localidad - Localidad donde se encuentra la planta.
 * @property colonia - Colonia donde se encuentra la planta.
 * @property municipioODelegacion - Municipio o delegación donde se encuentra la planta.
 * @property entidadFederativa - Entidad federativa donde se encuentra la planta.
 * @property pais - País donde se encuentra la planta.
 * @property registroFederalDeContribuyentes - RFC de la planta.
 * @property domicilioFiscalDelSolicitante - Domicilio fiscal del solicitante asociado a la planta.
 * @property razonSocial - Razón social de la planta.
 */
export interface PlantasDisponibles {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  localidad: string;
  colonia: string;
  municipioODelegacion: string;
  entidadFederativa: string;
  pais: string;
  registroFederalDeContribuyentes: string;
  domicilioFiscalDelSolicitante: string;
  razonSocial: string;
}

/**
 * Constante que define una lista de objetos que representan las columnas disponibles
 * para la visualización de información de plantas disponibles. Cada objeto contiene:
 * 
 * - `encabezado`: El nombre de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `PlantasDisponibles` y devuelve
 *   el valor correspondiente a la columna.
 * - `orden`: Un número que indica el orden en el que se deben mostrar las columnas.
 * 
 * Esta estructura es utilizada para mapear los datos de las plantas disponibles
 * a una representación tabular en la interfaz de usuario.
 */
export const PLANTAS_DIPONIBLES = [
  {
    encabezado: 'Calle',
    clave: (ele: PlantasDisponibles): string => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: PlantasDisponibles): string => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: PlantasDisponibles): string => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: PlantasDisponibles): string => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: PlantasDisponibles): string => ele.localidad,
    orden: 5,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: PlantasDisponibles): string => ele.colonia,
    orden: 6,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: PlantasDisponibles): string => ele.municipioODelegacion,
    orden: 7,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: PlantasDisponibles): string => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: PlantasDisponibles): string => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: PlantasDisponibles): string =>
      ele.registroFederalDeContribuyentes,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: PlantasDisponibles): string =>
      ele.domicilioFiscalDelSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: PlantasDisponibles): string => ele.razonSocial,
    orden: 12,
  },
];

/**
 * Representa la información de una planta IMMEX.
 *
 * @interface PlantasImmex
 * 
 * @property {string} planta - Nombre de la planta.
 * @property {string} calle - Calle donde se encuentra la planta.
 * @property {string} numeroExterior - Número exterior del domicilio de la planta.
 * @property {string} numeroInterior - Número interior del domicilio de la planta.
 * @property {string} codigoPostal - Código postal del domicilio de la planta.
 * @property {string} localidad - Localidad donde se encuentra la planta.
 * @property {string} colonia - Colonia donde se encuentra la planta.
 * @property {string} delegacionMunicipio - Delegación o municipio donde se encuentra la planta.
 * @property {string} entidadFederativa - Entidad federativa (estado) donde se encuentra la planta.
 * @property {string} pais - País donde se encuentra la planta.
 * @property {string} registroFederalDeContribuyentes - Registro Federal de Contribuyentes (RFC) asociado a la planta.
 * @property {string} domicilioDelSolicitante - Domicilio del solicitante relacionado con la planta.
 * @property {string} razonSocial - Razón social de la planta o del solicitante.
 */
export interface PlantasImmex {
  planta: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  localidad: string;
  colonia: string;
  delegacionMunicipio: string;
  entidadFederativa: string;
  pais: string;
  registroFederalDeContribuyentes: string;
  domicilioDelSolicitante: string;
  razonSocial: string;
}

/**
 * Representa la información de una empresa extranjera.
 *
 * @property {string} taxId - Identificador fiscal de la empresa.
 * @property {string} nombreDelEmpresa - Nombre de la empresa.
 * @property {string} pais - País donde se encuentra la empresa.
 * @property {string} direccion - Dirección física de la empresa.
 */
export interface EmpresasEXtranjeras {
  taxId: string;
  nombreDelEmpresa: string;
  pais: string;
  direccion: string;
}


/**
 * Representa un índice de catálogos de datos utilizados en la aplicación.
 * 
 * Esta interfaz define las propiedades necesarias para almacenar diferentes
 * tipos de catálogos relacionados con estados federativos, municipios, 
 * estados IMMEX, representaciones federales y actividades productivas.
 */
export interface CatalogoDatosIdx {
  /**
   * Lista de catálogos que representan los estados federativos.
   * 
   * Cada elemento de esta lista contiene información sobre un estado federativo.
   */
  estadosFederatarios: Catalogo[];

  /**
   * Lista de catálogos que representan los municipios.
   * 
   * Cada elemento de esta lista contiene información sobre un municipio.
   */
  municipio: Catalogo[];

  /**
   * Lista de catálogos que representan los estados IMMEX.
   * 
   * Cada elemento de esta lista contiene información sobre un estado IMMEX.
   */
  estadoImmex: Catalogo[];

  /**
   * Lista de catálogos que representan las representaciones federales.
   * 
   * Cada elemento de esta lista contiene información sobre una representación federal.
   */
  representacionFederal: Catalogo[];

  /**
   * Lista de catálogos que representan las actividades productivas.
   * 
   * Cada elemento de esta lista contiene información sobre una actividad productiva.
   */
  actividadProductiva: Catalogo[];
}

/**
 * Constante que define una lista de configuraciones para las propiedades de las plantas IMMEX.
 * Cada elemento de la lista contiene información sobre el encabezado, la clave para acceder
 * a la propiedad correspondiente de un objeto `PlantasImmex` y el orden en el que debe aparecer.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: PlantasImmex) => string; orden: number }>}
 *
 * @property {string} encabezado - El título o nombre que se mostrará como encabezado en la representación de la propiedad.
 * @property {(ele: PlantasImmex) => string} clave - Una función que toma un objeto `PlantasImmex` y devuelve el valor de la propiedad correspondiente.
 * @property {number} orden - El orden en el que esta propiedad debe aparecer en la lista.
 *
 * @example
 * // Ejemplo de uso:
 * const encabezados = PLANTAS_IMMEX.map(item => item.encabezado);
 * const valores = PLANTAS_IMMEX.map(item => item.clave(miObjetoPlantasImmex));
 */
export const PLANTAS_IMMEX: {
  encabezado: string;
  clave: (ele: PlantasImmex) => string;
  orden: number;
}[] = [
  {
    encabezado: '#Planta',
    clave: (ele: PlantasImmex): string => ele.planta,
    orden: 1,
  },
  {
    encabezado: 'Calle',
    clave: (ele: PlantasImmex): string => ele.calle,
    orden: 2,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: PlantasImmex): string => ele.numeroExterior,
    orden: 3,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: PlantasImmex): string => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: PlantasImmex): string => ele.codigoPostal,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: PlantasImmex): string => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: PlantasImmex): string => ele.colonia,
    orden: 7,
  },
  {
    encabezado: 'Delegación / Municipio',
    clave: (ele: PlantasImmex): string => ele.delegacionMunicipio,
    orden: 8,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: PlantasImmex): string => ele.entidadFederativa,
    orden: 9,
  },
  {
    encabezado: 'País',
    clave: (ele: PlantasImmex): string => ele.pais,
    orden: 10,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: PlantasImmex): string => ele.registroFederalDeContribuyentes,
    orden: 11,
  },
  {
    encabezado: 'Domicilio del solicitante',
    clave: (ele: PlantasImmex): string => ele.domicilioDelSolicitante,
    orden: 12,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: PlantasImmex): string => ele.razonSocial,
    orden: 13,
  },
];

/**
 * Constante que define una lista de configuraciones para representar información
 * de empresas extranjeras en una tabla o estructura similar.
 * 
 * Cada objeto en la lista contiene:
 * - `encabezado`: El título de la columna que se mostrará.
 * - `clave`: Una función que toma un objeto de tipo `EmpresasEXtranjeras` y devuelve
 *   el valor correspondiente para esa columna.
 * - `orden`: El orden en el que se debe mostrar la columna.
 * 
 * Propiedades:
 * - `encabezado`: Cadena que representa el nombre de la columna.
 * - `clave`: Función que define cómo obtener el valor de la columna desde un objeto
 *   de tipo `EmpresasEXtranjeras`.
 * - `orden`: Número que indica la posición de la columna en la tabla.
 */
export const EXPRESAS_EXTRANJERAS= [
  {
    encabezado: 'Tax ID',
    clave: (ele: EmpresasEXtranjeras): string => ele.taxId,
    orden: 1,
  },
  {
    encabezado: 'Nombre del empresa',
    clave: (ele: EmpresasEXtranjeras): string => ele.nombreDelEmpresa,
    orden: 2,
  },
  {
    encabezado: 'País',
    clave: (ele: EmpresasEXtranjeras): string => ele.pais,
    orden: 3,
  },
  {
    encabezado: 'Dirección',
    clave: (ele: EmpresasEXtranjeras): string => ele.direccion,
    orden: 3,
  }
];

/**
 * Texto de alerta utilizado para informar al usuario sobre el procedimiento
 * en caso de no encontrar plantas que cumplan con los criterios de búsqueda.
 * 
 * Si no se encuentran plantas, se tomará el domicilio fiscal como referencia,
 * sujeto a aprobación durante la visita domiciliaria.
 */
export const TEXTO_DE_ALERTA = `Si no se encuentran plantas con los criterios de búsqueda, el domicilio marcado como fiscal, será tomado para tal efecto, lo cual estará sujeto a aprobación al momento de la visita domiciliaria`;

/**
 * Texto de alerta utilizado para informar al usuario sobre el procedimiento
 * en caso de no encontrar plantas que cumplan con los criterios de búsqueda.
 */
export const TEXTO_ALERTA = `Si no se encuentran plantas con los criterios de búsqueda, el domicilio marcado como fiscal, será tomado para tal efecto, lo cual<br><div class="text-center">estará sujeto a aprobación al momento de la visita domiciliaria</div>`;
