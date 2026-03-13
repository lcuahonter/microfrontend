import { MateriaResiduo } from '../../231002/models/materia-residuo.model';
import { Solicitante } from './cadena-original-request';

/**
 * Request para guardar una solicitud del trámite 231002.
 *
 * Contiene información del solicitante, empresa de reciclaje, destinatario,
 * transporte, aduana de salida y la lista de residuos asociados.
 */
export interface GuardarSolicitud231003Request {
  /** Identificador único de la solicitud. */
  id_solicitud: number | null;
  /** Número del programa IMMEX asociado a la solicitud. */
  numero_programa_immex: number;
  /** Valor discriminador para identificar el tipo de solicitud. */
  discriminator_value: number;
  /** Clave del rol del usuario que captura la solicitud. */
  cve_rol_capturista: string;
  /** Clave del usuario capturista. */
  cve_usuario_capturista: string;
  /** Descripción genérica 1. (Giro del importador) */
  descripcion_generica1: string;
  /** Número de registro ambiental asociado. */
  numero_registro_ambiental: string;
  /** Descripción genérica en formato CLOB 1. */
  descripcion_clob_generica1: string;
  /** Nombre o razón social de la empresa controladora. */
  empresa_controladora: boolean;
  /** Datos del solicitante que realiza la solicitud. */
  solicitante: Solicitante;
  /** Información de la empresa que realizará el reciclaje. */
  empresa_reciclaje: EmpresaReciclaje;
  /** Información del transporte autorizado. */
  transporte: Transporte;
  /** Lista de residuos peligrosos a exportar. */
  residuos: Residuos[];
  /** indica si el reciclaje se hará en las instalaciones de la empresa */
  empresa_mismo_grupo: boolean;
  /** Indica el lugar de reciclaje */
  descripcion_generica2: string;
  /** Indica el número de autorización de la empresa de reciclaje */
  descripcion_generica3: string;
}

/**
 * Información de la empresa de reciclaje.
 */
interface EmpresaReciclaje {
  /** Identificador único de la empresa. */
  id_empresa: number | null;
  /** Razón social de la empresa de reciclaje. */
  razon_social: string;
  /** Nombre comercial de la empresa. */
  nombre: string;
  /** Número telefónico de contacto. */
  telefono: string;
  /** Dirección de correo electrónico de contacto. */
  correo_electronico: string;
}

/**
 * Información del transporte autorizado para los residuos.
 */
interface Transporte {
  /** Razón social de la empresa de transporte. */
  razon_social: string;
  /** Número de autorización SEMARNAT para el transporte de residuos peligrosos. */
  autorizacion_semarnat_transporte: string;
}

/**
 * Representa un residuo peligroso dentro de la solicitud de exportación.
 */
interface Residuos {
  /** Valor booleano genérico 1. */
  boolean_generico_1: boolean;
  /** Descripción del valor booleano genérico 1. */
  desc_boolean_generico_1: string;
  /** Fracción arancelaria del residuo. */
  fraccion_arancelaria: string;
  /** Clave NICO (Nomenclatura de Identificación de Compuestos Orgánicos). */
  cve_nico: string;
  /** Descripción de la clave NICO. */
  desc_nico: string;
  /** Unidad de medida del residuo. */
  unidad_medida: string;
  /** Nombre de la unidad de medida. */
  desc_unidad_medida: string;
  /** Capacidad del contenedor o envase. */
  capacidad: string;
  /** Nombre químico del residuo. */
  nombre_quimico: string;
  /** Nombre común del residuo. */
  nombre_residuo: string;
  /** Acotación o nota adicional sobre el residuo. */
  acotacion: string;
  /** Nombre específico del residuo peligroso según la normativa. */
  nombre_residuo_peligroso: string;
  /** Cantidad numérica del residuo. */
  cantidad: string;
  /** Cantidad expresada en letra. */
  cantidad_letra: string;
  /** Clave de clasificación del residuo peligroso. */
  cve_clasificacion: string;
  /** Nombre de la clasificación. */
  nombre_clasificacion: string;
  /** Descripción de la clasificación. */
  desc_clasificacion: string;
  /** Descripción de otra clasificación si aplica. */
  desc_otra_clasificacion: string;
  /** Código CRETI (Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable). */
  creti: string;
  /** Estado físico del residuo (sólido, líquido, gaseoso). */
  estado_fisico: string;
  /** Descripción de otro estado físico si aplica. */
  desc_otro_estado_fisico: string;
  /** Número de manifiesto de entrega, transporte y recepción. */
  numero_manifiesto: string;
  /** Tipo de contenedor utilizado para el residuo. */
  tipo_contenedor: string;
  /** Descripción de otro tipo de contenedor si aplica. */
  desc_otro_contenedor: string;
  /** Nombre descriptivo de la fracción arancelaria. */
  fraccion_name: string;
  /** Nombre descriptivo de NICO. */
  nico_name: string;
  /** Descripción de la clave de clasificación. */
  cve_clasificacion_desc: string;
  /** Nombre alternativo de la clasificación. */
  name_clasificacion: string;
  /** Descripción del código CRETI. */
  desc_creti: string;
  /** Descripción del estado físico. */
  desc_estado_fisico: string;
  /** Descripción del tipo de contenedor. */
  desc_tipo_contenedor: string;
  /** Descripción de otros aspectos del residuo. */
  desc_otro: string;
  /** Lista de materias primas relacionadas con el residuo. */
  materias_primas_relacionadas: MateriaResiduo[];
}
