import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

export interface FederatariosYPlantasConfiguration<T> {
  TablaSeleccion: TablaSeleccion;
  TablaEncabezado: ConfiguracionColumna<T>[];
}

export interface FederatariosEncabezado {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDeActa: string;
  fechaDelActa: string;
  numeroDeNotaria: string;
  entidadFederativa: string;
  municipioODelegacion: string;
}

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
    encabezado: 'Delegación o municipio',
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

export const TEXTO_DE_ALERTA = `Si no se encuentran plantas con los criterios de búsqueda, el domicilio marcado como fiscal, será tomado para tal efecto, lo cual estará sujeto a aprobación al momento de la visita domiciliaria`;
