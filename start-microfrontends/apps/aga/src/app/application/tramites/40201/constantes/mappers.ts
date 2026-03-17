import {
  PersonaFisicaExtranjeraForm,
  PersonaFisicaNacionalForm,
  PersonaMoralExtranjeraForm,
  PersonaMoralNacionalForm,
} from '../models/transportacion-maritima.model';
import { EmpresasCaat } from '../models/contributente.model';
import { PersonaSolicitud } from './../models/guardar-solicitud.model';

/**
 * Representa los tipos de transportista soportados para mapeo.
 */
type TipoTransportista =
  | 'FISICA_NACIONAL'
  | 'MORAL_NACIONAL'
  | 'FISICA_EXTRANJERA'
  | 'MORAL_EXTRANJERA';

/**
 * Mapeo estático que asocia cada tipo de transportista con su estructura de datos correspondiente.
 */
interface TransportistaDataMap {
  FISICA_NACIONAL: PersonaFisicaNacionalForm;
  MORAL_NACIONAL: PersonaMoralNacionalForm;
  FISICA_EXTRANJERA: PersonaFisicaExtranjeraForm;
  MORAL_EXTRANJERA: PersonaMoralExtranjeraForm;
}

/**
 * Convierte una Persona Física Nacional al parcial de PersonaSolicitud esperado por el backend.
 * @param data Datos de persona física nacional.
 * @returns Partial<PersonaSolicitud> con los campos mapeados.
 */
export const MAPPER_FN = (
  data: PersonaFisicaNacionalForm
): Partial<PersonaSolicitud> => {
  return {
    persona_moral: false,
    boolean_extranjero: false,
    nombre: data.nombrePFN,
    apellido_paterno: data.apellidoPaternoPFN,
    apellido_materno: data.apellidoMaternoPFN,
    rfc: data.rfcPFN,
    curp: data.curp,
    nss: '',
    correo_electronico: '',
    curp_nss: '',
    director_general: null,
    domicilio: {
      informacion_extra:'',
      calle: data.callePFN,
      ciudad: data.municipioPFN,
      codigo_postal: data.codigoPostalPFN,
      delegacion_municipio: data.municipioPFN,
      colonia: data.coloniaPFN,
      entidad_federativa: data.estadoPFN,
      numero_exterior: data.numeroExteriorPFN || '',
      pais: data.paisPFN,
      numero_interior: data.numeroInteriorPFN,
    },
    domicilio_calle: data.callePFN,
    razon_social: '',
  };
};

/**
 * Convierte una Persona Moral Nacional al parcial de PersonaSolicitud esperado por el backend.
 * @param data Datos de persona moral nacional.
 * @returns Partial<PersonaSolicitud> con los campos mapeados.
 */
export const MAPPER_MN = (
  data: PersonaMoralNacionalForm
): Partial<PersonaSolicitud> => {
  return {
    persona_moral: true,
    boolean_extranjero: false,
    razon_social: data.denominacionPMN,
    rfc: data.rfcPMN || '',
    correo_electronico: data.correoPMN || '',
    domicilio: {
      informacion_extra:'',
      calle: data.callePMN,
      ciudad: data.municipioPMN,
      codigo_postal: data.codigoPostalPMN || '',
      delegacion_municipio: data.municipioPMN,
      colonia: data.coloniaPMN,
      entidad_federativa: data.estadoPMN,
      numero_exterior: data.numeroExteriorPMN || '',
      pais: data.paisPMN,
      numero_interior: data.numeroInteriorPMN,
    },
    domicilio_calle: data.callePMN,
    director_general: {
      nombre: data.nombreDirectorGeneral || '',
      apellido_paterno: data.apellidoPaternoDirectorGeneral || '',
      apellido_materno: data.apellidoMaternoDirectorGeneral || '',
    },
  };
};

/**
 * Convierte una Persona Moral Extranjera al parcial de PersonaSolicitud esperado por el backend.
 * @param data Datos de persona moral extranjera.
 * @returns Partial<PersonaSolicitud> con los campos mapeados.
 */
export const MAPPER_ME = (
  data: PersonaMoralExtranjeraForm
): Partial<PersonaSolicitud> => {
  return {
    boolean_extranjero: true,
    persona_moral: true,
    razon_social: data.denominacionPME,
    correo_electronico: data.correoPME,
    domicilio: {
      entidad_federativa:'',
      pais: data.paisPME,
      ciudad: data.ciudadPME,
      calle: data.callePME,
      codigo_postal: data.codigoPostalPME,
      informacion_extra: data.estadoPME,
      delegacion_municipio: data.ciudadPME,
      numero_exterior: data.numeroExteriorPME,
      numero_interior: data.numeroInteriorPME,
      colonia: '',
    },
    director_general: {
      nombre: data.nombreDG,
      apellido_paterno: data.apellidoPaternoDG,
      apellido_materno: data.apellidoMaternoDG,
    },
    domicilio_calle: data.callePME,
  };
};

/**
 * Convierte una Persona Física Extranjera al parcial de PersonaSolicitud esperado por el backend.
 * @param data Datos de persona física extranjera.
 * @returns Partial<PersonaSolicitud> con los campos mapeados.
 */
export const MAPPER_FE = (
  data: PersonaFisicaExtranjeraForm
): Partial<PersonaSolicitud> => {
  return {
    boolean_extranjero: true,
    apellido_materno: data.apellidoMaternoPFE,
    persona_moral: false,
    nss: data.seguroNumero,
    nombre: data.nombrePFE,
    apellido_paterno: data.apellidoPaternoPFE,
    correo_electronico: data.correoPFE,
    domicilio: {
      entidad_federativa:'',
      pais: data.paisPFE,
      ciudad: data.ciudadPFE,
      calle: data.callePFE,
      codigo_postal: data.codigoPostalPFE,
      informacion_extra: data.estadoPFE,
      delegacion_municipio: data.ciudadPFE,
      colonia: data.callePFE,
      numero_exterior: data.numeroExteriorPFE,
      numero_interior: data.numeroInteriorPFE,
    },
  };
};

/**
 * Crea una estructura base (vacía) de PersonaSolicitud usada como punto de partida para los mappers.
 * @returns Objeto PersonaSolicitud con valores por defecto.
 */
const CREAR_BASE = (): PersonaSolicitud => {
  return {
    apellido_materno: '',
    apellido_paterno: '',
    boolean_extranjero: false,
    correo_electronico: '',
    curp: '',
    curp_nss: '',
    domicilio: {
      informacion_extra:'',
      numero_interior:'',
      calle: '',
      ciudad: '',
      codigo_postal: '',
      delegacion_municipio: '',
      entidad_federativa: '',
      colonia: '',
      numero_exterior: '',
      pais: '',
    },
    domicilio_calle: '',
    director_general: null,
    nombre: '',
    nss: '',
    persona_moral: false,
    rfc: '',
    razon_social: '',
  };
};

/**
 * Mapea según el tipo de transportista y retorna la PersonaSolicitud final combinando la base y el mapeo específico.
 * @param tipo Tipo de transportista.
 * @param data Datos específicos del transportista.
 * @returns PersonaSolicitud completa lista para envío.
 */
export const MAPPER_TRANSPORTISA = <T extends TipoTransportista>(
  tipo: T,
  data: TransportistaDataMap[T]
): PersonaSolicitud => {
  const BASE = CREAR_BASE();

  const MAPPER: Record<TipoTransportista, Partial<PersonaSolicitud>> = {
    FISICA_NACIONAL: MAPPER_FN(data as PersonaFisicaNacionalForm),
    MORAL_NACIONAL: MAPPER_MN(data as PersonaMoralNacionalForm),
    FISICA_EXTRANJERA: MAPPER_FE(data as PersonaFisicaExtranjeraForm),
    MORAL_EXTRANJERA: MAPPER_ME(data as PersonaMoralExtranjeraForm),
  };

  return {
    ...BASE,
    ...MAPPER[tipo],
    director_general: MAPPER[tipo]?.director_general ?? null,
    domicilio: {
      ...BASE.domicilio,
      ...MAPPER[tipo]?.domicilio,
    },
  };
};

/**
 * Interfaz base para las empresas marítimas.
 */
export interface EmpresaMaritimaBase {
  tipo: 'PFN' | 'PFE' | 'PMN' | 'PME';
}

/**
 * Interfaz para Persona Física Nacional.
 */
export type EmpresaMaritima =
  | PersonaFisicaNacionalForm
  | PersonaFisicaExtranjeraForm
  | PersonaMoralNacionalForm
  | PersonaMoralExtranjeraForm;

/**
 * Mapea un objeto EmpresasCaat a una estructura de EmpresaMaritima correspondiente.
 * @param dto Objeto de tipo EmpresasCaat a mapear.
 * @returns Objeto de tipo EmpresaMaritima mapeado.
 */
export const MAP_EMPRESA = (dto: EmpresasCaat): EmpresaMaritima => {

  //MORAL NACIONAL
  if (dto.persona_moral && !dto.extranjero) {
    return {
      estadoDesc: dto.nombre_entidad,
      municipioDesc: dto.nombre_delegacion,
      coloniaDesc: dto.nombre_colonia,
      rfcPMN: dto.rfc,
      denominacionPMN: dto.razon_social,
      correoPMN: dto.correo_electronico,
      paisPMN: dto.clave_pais,
      paisDesc: dto.nombre_pais,
      codigoPostalPMN: dto.codigo_postal,
      estadoPMN: dto.clave_entidad,
      municipioPMN: dto.clave_delegacion_municipio,
      localidadPMN: dto.nombre_localidad || '',
      coloniaPMN: dto.clave_colonia,
      callePMN: dto.calle,
      numeroExteriorPMN: dto.numero_exterior,
      numeroInteriorPMN: dto.numero_interior,
      nombreDirectorGeneral: dto.nombre_direc,
      apellidoPaternoDirectorGeneral: dto.direc_ap_pa,
      apellidoMaternoDirectorGeneral: dto.direc_ap_ma,
      domicilioPMN: dto.calle + ' ' + dto.numero_exterior,
      esMoral: true,
      esExtranjero: false,
      directorNombreCompleto: dto.nombre_direc + ' ' + dto.direc_ap_pa + ' ' + dto.direc_ap_ma,
      tipo: 'PMN',
    };
  }

  //FISICO NACIONAL
  if (!dto.persona_moral && !dto.extranjero) {
    return {
      curp: dto.curp,
      nombrePFN: dto.nombre,
      apellidoPaternoPFN: dto.apellido_paterno,
      apellidoMaternoPFN: dto.apellido_materno,
      rfcPFN: dto.rfc,
      paisPFN: dto.clave_pais,
      codigoPostalPFN: dto.codigo_postal,
      estadoDesc: dto.nombre_entidad,
      municipioDesc: dto.nombre_delegacion,
      coloniaDesc: dto.nombre_colonia,
      localidadDesc: dto.nombre_localidad || '',
      nombreCompleto: dto.nombre + ' ' + dto.apellido_paterno + ' ' + dto.apellido_materno,
      paisDesc: dto.nombre_pais,
      estadoPFN: dto.clave_entidad,
      municipioPFN: dto.clave_delegacion_municipio,
      localidadPFN: '',
      coloniaPFN: dto.clave_colonia,
      callePFN: dto.calle,
      numeroExteriorPFN: dto.numero_exterior,
      numeroInteriorPFN: dto.numero_interior,
      domicilioPFN: dto.calle + ' ' + dto.numero_exterior,
      esMoral: false,
      esExtranjero: false,
      tipo: 'PFN',
    }
  }

  //fisica EXTRANJERA
  if (!dto.persona_moral && dto.extranjero) {
    return {
      nombreCompleto: String(dto.nombre) + dto.apellido_paterno + ' ' + (dto.apellido_materno ?? ''),
      nombrePFE: dto.nombre,
      apellidoPaternoPFE: dto.apellido_paterno,
      apellidoMaternoPFE: dto.apellido_materno ?? '',
      seguroNumero: dto.nss,
      domicilioPFE: dto.calle + ' ' + dto.numero_exterior,
      paisPFE: dto.clave_pais,
      paisDesc: dto.nombre_pais,
      estadoPFE: dto.clave_entidad,
      correoPFE: dto.correo_electronico,
      codigoPostalPFE: dto.codigo_postal,
      callePFE: dto.calle,
      numeroExteriorPFE: dto.numero_exterior,
      numeroInteriorPFE: dto.numero_interior,
      ciudadPFE: dto.ciudad,
      tipo: 'PFE',
    }

  }

  if (dto.persona_moral && dto.extranjero) {
    return {
      denominacionPME: dto.razon_social,
      domicilioPME: dto.calle + ' ' + dto.numero_exterior,
      paisPME: dto.clave_pais,
      paisDesc: dto.nombre_pais,
      ciudadPME: dto.ciudad,
      estadoPME: dto.clave_entidad,
      codigoPostalPME: dto.codigo_postal,
      nombreDG: dto.nombre_direc,
      correoPME: dto.correo_electronico,
      apellidoPaternoDG: dto.direc_ap_pa,
      apellidoMaternoDG: dto.direc_ap_ma,
      callePME: dto.calle,
      numeroExteriorPME: dto.numero_exterior,
      numeroInteriorPME: dto.numero_interior,
      tipo: 'PME',
    }
  }
  throw new Error('Tipo de persona no reconocido en el mapeo.');
}


/**
 * Mapea un arreglo de objetos EmpresasCaat a un arreglo de objetos EmpresaMaritima.
 * @param dto Arreglo de objetos EmpresasCaat a mapear.
 * @returns Arreglo de objetos EmpresaMaritima mapeados.
 */
export const MAP_EMPRESAS = (dto: EmpresasCaat[]): EmpresaMaritima[] => {
  return dto.map(MAP_EMPRESA);
}



