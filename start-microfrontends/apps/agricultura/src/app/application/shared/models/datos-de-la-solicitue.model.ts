import { Catalogo } from "@libs/shared/data-access-user/src";
import { FilaSolicitud } from "../../tramites/220201/models/220201/capturar-solicitud.model";

/**
 * Representa los datos de la solicitud con listas de catálogos relacionadas.
 */
export interface DatosDeLaSolicitud {
  /**
   * Lista de tipos de requisitos asociados a la solicitud.
   */
  tipoRequisitoList: Catalogo[];

  /**
   * Lista de requisitos específicos relacionados con la solicitud.
   */
  requisitoList: Catalogo[];

  /**
   * Lista de fracciones arancelarias aplicables.
   */
  fraccionArancelariaList: Catalogo[];

  /**
   * Lista de NICO (Números de Identificación Comercial) relacionados.
   */
  nicoList: Catalogo[];

  /**
   * Lista de unidades de medida de transporte (UMT).
   */
  umtList: Catalogo[];

  /**
   * Lista de unidades de medida comercial (UMC).
   */
  umcList: Catalogo[];

  /**
   * Lista de especies relacionadas con la solicitud.
   */
  especieList: Catalogo[];

  /**
   * Lista de usos específicos asociados a la solicitud.
   */
  usoList: Catalogo[];

  /**
   * Lista de países de origen de los productos o bienes.
   */
  paisOrigenList: Catalogo[];

  /**
   * Lista de países de procedencia de los productos o bienes.
   */
  paisDeProcedenciaList: Catalogo[];

  /**
   * Lista de sexos aplicables en el contexto de la solicitud.
   */
  sexoList: Catalogo[];
}
/**
 * Representa una interfaz para los datos sensibles relacionados con un animal.
 */
export interface Sensible {
  noPartida: string;
  /**
   * Número de lote al que pertenece el animal.
   */
  NumeroLote: string;

  /**
   * Color del pelaje del animal.
   */
  ColorPelaje: string;

  /**
   * Edad del animal expresada en un formato específico.
   */
  EdadAnimal: string;

  /**
   * Fase de desarrollo en la que se encuentra el animal.
   */
  FaseDesarrollo: string;

  /**
   * Función zootécnica que desempeña el animal.
   */
  FuncionZootecnica: string;

  /**
   * Nombre comercial de la mercancía relacionada con el animal.
   */
  NombreMercancia: string;

  /**
   * Número de identificación único del animal.
   */
  NumeroIdentificacion: string;

  /**
   * Raza a la que pertenece el animal.
   */
  Raza: string;

  /**
   * Nombre científico del animal.
   */
  NombreCientifico: string;

  /**
   * Sexo del animal (macho o hembra).
   */
  Sexo: string;
}

/**
 * Representa el formulario de solicitud para animales.
 */
export interface AnimalesFormularioSolicitud {
  /**
   * Tipo de requisito asociado al formulario.
   */
  tipoRequisito: string;

  /**
   * Requisito específico que se debe cumplir.
   */
  requisito: string;

  /**
   * Número del certificado, si aplica.
   */
  numeroCertificado?: string;

  /**
   * Fracción arancelaria correspondiente.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria, si aplica.
   */
  descripcionFraccion?: string;

  /**
   * Número de Identificación Comercial (NICO).
   */
  nico: string;

  /**
   * Descripción del NICO, si aplica.
   */
  descripcionNico?: string;

  /**
   * Descripción adicional, si aplica.
   */
  descripcion?: string;

  /**
   * Cantidad en la Unidad de Medida de Transporte (UMT), si aplica.
   */
  cantidadUMT?: string;

  /**
   * Unidad de Medida de Transporte (UMT).
   */
  umt: string;

  /**
   * Cantidad en la Unidad de Medida Comercial (UMC), si aplica.
   */
  cantidadUMC?: string;

  /**
   * Unidad de Medida Comercial (UMC).
   */
  umc: string;

  /**
   * Especie del animal.
   */
  especie: string;

  /**
   * Uso previsto del animal.
   */
  uso: string;

  /**
   * País de origen del animal.
   */
  paisOrigen: string;

  /**
   * País de procedencia del animal.
   */
  paisDeProcedencia: string;
}

/**
 * Representa los datos de los catálogos de productos utilizados en la solicitud.
 */
export interface ProductosCatalogosDatos {
  /**
   * Lista de tipos de requisitos disponibles en el catálogo.
   */
  tipoRequisitoList: Catalogo[];

  /**
   * Lista de requisitos específicos disponibles en el catálogo.
   */
  requisitoList: Catalogo[];

  /**
   * Lista de fracciones arancelarias disponibles en el catálogo.
   */
  fraccionArancelariaList: Catalogo[];

  /**
   * Lista de códigos NICO disponibles en el catálogo.
   */
  nicoList: Catalogo[];

  /**
   * Lista de unidades de medida de transporte (UMT) disponibles en el catálogo.
   */
  umtList: Catalogo[];

  /**
   * Lista de unidades de medida comercial (UMC) disponibles en el catálogo.
   */
  umcList: Catalogo[];

  /**
   * Lista de especies disponibles en el catálogo.
   */
  especieList: Catalogo[];

  /**
   * Lista de usos disponibles en el catálogo.
   */
  usoList: Catalogo[];

  /**
   * Lista de países de origen disponibles en el catálogo.
   */
  paisOrigenList: Catalogo[];

  /**
   * Lista de países de procedencia disponibles en el catálogo.
   */
  paisDeProcedenciaList: Catalogo[];

  /**
   * Lista de sexos disponibles en el catálogo.
   */
  sexoList: Catalogo[];

  /**
   * Lista de presentaciones disponibles en el catálogo.
   */
  presentacionList: Catalogo[];

  /**
   * Lista de cantidades de presentación disponibles en el catálogo.
   */
  cantidadPresentacionList: Catalogo[];

  /**
   * Lista de tipos de presentación disponibles en el catálogo.
   */
  tipoPresentacionList: Catalogo[];

  /**
   * Lista de tipos de plantas disponibles en el catálogo.
   */
  tipoPlantaList: Catalogo[];

  /**
   * Lista de plantas autorizadas de origen disponibles en el catálogo.
   */
  plantaAutorizadaOrigenList: Catalogo[];
}

/**
 * Interfaz que representa el formulario de solicitud para animales.
 */
export interface AnimalesFormularioSolicitudForm {
  /**
   * Tipo de requisito necesario para la solicitud.
   */
  tipoRequisito: string;

  /**
   * Requisito específico que se debe cumplir.
   */
  requisito: string;

  /**
   * Número del certificado asociado a la solicitud.
   */
  numeroCertificado: string;

  /**
   * Fracción arancelaria correspondiente al producto.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  descripcionFraccion: string;

  /**
   * Número de Identificación Comercial (NICO) del producto.
   */
  nico: string;

  /**
   * Descripción del Número de Identificación Comercial (NICO).
   */
  descripcionNico: string;

  /**
   * Descripción general del producto o solicitud.
   */
  descripcion: string;

  /**
   * Cantidad en la Unidad de Medida de Transporte (UMT).
   */
  cantidadUMT: string;

  /**
   * Unidad de Medida de Transporte (UMT) con su estado habilitado o deshabilitado.
   */
  umt: { value: string; disabled: boolean };

  /**
   * Cantidad en la Unidad de Medida Comercial (UMC).
   */
  cantidadUMC: string;

  /**
   * Unidad de Medida Comercial (UMC) utilizada.
   */
  umc: string;

  /**
   * Especie del animal o producto relacionado.
   */
  especie: string;

  /**
   * Uso previsto del animal o producto.
   */
  uso: string;

  /**
   * País de origen del animal o producto.
   */
  paisOrigen: string;

  /**
   * País de procedencia del animal o producto.
   */
  paisDeProcedencia: string;
}


/**
 * Representa los eventos relacionados con los animales en una solicitud.
 */
export interface AnimalesEventos {
  /**
   * El formulario asociado a la solicitud de animales.
   */
  formulario: FilaSolicitud;

  /**
   * Una lista de datos sensibles relacionados con los animales.
   */
  tablaDatos: Sensible[];
}

/**
 * Interfaz que representa los detalles del formulario de un producto.
 */
export interface ProductoDetallasForm {
  /**
   * Tipo de requisito asociado al producto.
   */
  tipoRequisito: string;

  /**
   * Requisito específico que debe cumplir el producto.
   */
  requisito: string;

  /**
   * Número del certificado relacionado con el producto.
   */
  numeroCertificado: string;

  /**
   * Fracción arancelaria correspondiente al producto.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  descripcionFraccion: string;

  /**
   * Número de Identificación Comercial (NICO) del producto.
   */
  nico: string;

  /**
   * Descripción del Número de Identificación Comercial (NICO).
   */
  descripcionNico: string;

  /**
   * Descripción general del producto.
   */
  descripcion: string;

  /**
   * Cantidad en la Unidad de Medida de Transporte (UMT).
   */
  cantidadUMT: string;

  /**
   * Unidad de Medida de Transporte (UMT) con su estado habilitado o deshabilitado.
   */
  umt: { value: string; disabled: boolean };

  /**
   * Cantidad en la Unidad de Medida Comercial (UMC).
   */
  cantidadUMC: string;

  /**
   * Unidad de Medida Comercial (UMC) del producto.
   */
  umc: string;

  /**
   * Especie a la que pertenece el producto.
   */
  especie: string;

  /**
   * Uso previsto del producto.
   */
  uso: string;

  /**
   * País de origen del producto.
   */
  paisOrigen: string;

  /**
   * País de procedencia del producto.
   */
  paisDeProcedencia: string;

  /**
   * Presentación del producto.
   */
  presentacion: string;

  /**
   * Cantidad de la presentación del producto.
   */
  cantidadPresentacion: string;

  /**
   * Tipo de presentación del producto.
   */
  tipoPresentacion: string;

  /**
   * Tipo de planta asociada al producto.
   */
  tipoPlanta: string;

  /**
   * Planta autorizada de origen del producto.
   */
  plantaAutorizadaOrigen: string;
}

/**
 * Representa los eventos detallados de un producto en la aplicación.
 */
export interface ProductoDetallaEventos {
  /**
   * El formulario asociado con los detalles del producto.
   */
  formulario: FilaSolicitud;

  /**
   * Los datos detallados que se mostrarán en la tabla.
   */
  detallasDatosTablaDatos: DetallasDatos[];
}


/**
 * Representa los detalles de los datos relacionados con un producto o lote.
 */
export interface DetallasDatos {
  /**
   * El número de lote asociado al producto.
   * Este campo es opcional.
   */
  numeroDeLote?: string;

  /**
   * La fecha de elaboración, empaque o proceso del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaElaboracionEmpaqueProceso?: string;

  /**
   * La fecha de producción o sacrificio del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaProduccionSacrificio?: string;

  /**
   * La fecha de caducidad del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaCaducidadProducto?: string;

  /**
   * La fecha de finalización de la elaboración, empaque o proceso del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaFinElaboracionEmpaqueProceso?: string;

  /**
   * La fecha de finalización de la producción o sacrificio del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaFinProduccionSacrificio?: string;

  /**
   * La fecha de finalización de la caducidad del producto.
   * Este campo es opcional y debe estar en formato de cadena.
   */
  fechaFinCaducidadProducto?: string;

}

export interface DetalleVidaSilvestre {
  idDetalleMercancia: number;
  idMercanciaGob: number;
  idVidaSilvestre: number;
  nombreCientifico: string;
}