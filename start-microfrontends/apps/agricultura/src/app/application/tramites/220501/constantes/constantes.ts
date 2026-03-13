import { Row, Rows, Tabla } from "../models/pago-de-derechos.model";

/**
 * Constantes para el catálogo de tipos de solicitud
 */
export const CATALOGOS_ID = {
  CAT_TIPO_SOL: 'tipos-solicitud',
  CAT_PAISES: 'paises',
  CAT_ADUANAS: 'aduanas',
  CAT_SECCION_ADUANAS: 25,
  DATOS_GNRLS_SOL: 5,
  CAT_TIPO_DOCUMENTO: 'tipos-documento',
  CAT_TIPO_OPERACION: 26,
  CAT_MEDIO_DE_TRANSPORTE: 'medio-de-transporte',
  CAT_REGIMEN_MERCANCIA: 'regimen-mercancia',
  CAT_CLASIFI_REGIMEN: 'clasifi-regimen',
  CAT_FRACCION_ARANCELARIA: 'fraccion-arancelaria',
  CAT_NICO: 'nico',
  CAT_UNIDAD_MEDIDA_TARIFARIA: 'unidad-medida-tarifaria',
  CAT_PAIS_ORIGEN: 'pais-origen',
  CAT_PAIS_DESTINO: 'pais-destino',
  CAT_MOLINO: 'molino',
  CAT_ESTADO: 'estado',
  CAT_REPRESENTACION_FEDERAL: 'representacion-federal',
  DATOS_PERSONA_FISICA: 21,
}

/**
 * Lista de elementos de tipo Row.
 */
export const ITEMS: Row[] = [
  {
    nombre: 'Miriam Lopez Solis',
    telefono: '52-2298456543',
    correo: 'miriam@gmail.com',
    domicilio: 'este es un domicilio address',
    pais: 'ANGOLA(REPUBLIC DE)',
  },
];

/**
 * Lista de elementos de tipo Rows.
 */
export const PERSONA: Rows[] = [
  {
    nombre: 'Miriam Lopez Solis',
    telefono: '52-2298456543',
    correo: 'miriam@gmail.com',
    calle: '#10',
    exterior: 856,
    interior: 1,
    pais: 'MEXICO(ESTAD UNIDOS MEXICANOS',
  },
];

/**
 * Texto de alerta utilizado en el componente de terceros relacionados.
 * @constant {string}
 */
export const TERCEROS_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
/**
 * Filas de datos predefinidas.
 */
export const ROWS: Tabla[] = [
  {
    Partida: '1',
    Tiporequisito: 'Inspección ocular',
    Requisito: 'Requisito',
    Certificado: 123456,
    Fraccion: '01039201',
    FraccionDescripcion: 'Con pedigree o certificado de alto registro.',
    Nico: '00',
    NicoDescripcion: 'Descripción del NICO',
    Descripcion: 'Descripción de la mercancía',
    Umt: 'Kilogramo',
    CantidadUMT: 100,
    Umc: 'Unidad de medida comercialización',
    CantidadUMC: 50,
    Especie: 'Especie de la mercancía',
    Uso: 'Uso de la mercancía',
    PaisOrigen: 'País de origen',
    PaisProcedencia: 'País de procedencia',
    Presentacion: 'Presentación',
    CantidadPresentacion: 10,
    TipoPresentacion: 'Tipo de presentación',
    TipoPlanta: 'Tipo planta',
    PlantaAutorizadaOrigen: 'Planta autorizada de origen',
    CertificadoInternacionalElectronico: 'Certificado Internacional Electrónico'
  },
  {
    Partida: '2',
    Tiporequisito: 'inspección de oído',
    Requisito: 'Requisito',
    Certificado: 123456,
    Fraccion: '01039201',
    FraccionDescripcion: 'Con pedigree o certificado de alto registro.',
    Nico: '00',
    NicoDescripcion: 'Descripción del NICO',
    Descripcion: 'Descripción de la mercancía',
    Umt: 'Kilogramo',
    CantidadUMT: 100,
    Umc: 'Unidad de medida comercialización',
    CantidadUMC: 50,
    Especie: 'Especie de la mercancía',
    Uso: 'Uso de la mercancía',
    PaisOrigen: 'País de origen',
    PaisProcedencia: 'País de procedencia',
    Presentacion: 'Presentación',
    CantidadPresentacion: 10,
    TipoPresentacion: 'Tipo de presentación',
    TipoPlanta: 'Tipo planta',
    PlantaAutorizadaOrigen: 'Planta autorizada de origen',
    CertificadoInternacionalElectronico: 'Certificado Internacional Electrónico'
  },
  {
    Partida: '3',
    Tiporequisito: 'inspección de nariz',
    Requisito: 'Requisito',
    Certificado: 123456,
    Fraccion: '01039201',
    FraccionDescripcion: 'Con pedigree o certificado de alto registro.',
    Nico: '00',
    NicoDescripcion: 'Descripción del NICO',
    Descripcion: 'Descripción de la mercancía',
    Umt: 'Kilogramo',
    CantidadUMT: 100,
    Umc: 'Unidad de medida comercialización',
    CantidadUMC: 50,
    Especie: 'Especie de la mercancía',
    Uso: 'Uso de la mercancía',
    PaisOrigen: 'País de origen',
    PaisProcedencia: 'País de procedencia',
    Presentacion: 'Presentación',
    CantidadPresentacion: 10,
    TipoPresentacion: 'Tipo de presentación',
    TipoPlanta: 'Tipo planta',
    PlantaAutorizadaOrigen: 'Planta autorizada de origen',
    CertificadoInternacionalElectronico: 'Certificado Internacional Electrónico'
  },
];

/**
 * Constante que define el parámetro utilizado para determinar el tipo de datos a mostrar.
 */
export const PARAMETERO = {
 EVALUAR: 'FLUJO_FUNCIONARIO_EVALUAR',
 READ_PROCEDEMENTO: 'READ_PROCEDURE',
 SUBSECUENTES: 'SUBSECUENTES'
}