/**
 * Interfaz para los datos del Sistema de Clasificación Industrial de América del Norte (SCIAN).
 * Utilizada para representar códigos y descripciones de actividades económicas.
 */
export interface ScianDatos {
    /** Clave única del código SCIAN */
    clave: string,
    /** Descripción detallada de la actividad económica */
    descripcion: string,
}


/**
 * Interfaz para los datos de mercancías en el trámite de certificados, licencias y permisos.
 * Contiene información detallada sobre productos, medicamentos y sustancias controladas.
 */
export interface MercanciasDatos {
  /** Clasificación del producto según normativas sanitarias */
  clasificacion?: string,
  /** Especificación detallada de la clasificación del producto */
  especificar?: string,
  /** Denominación Común Internacional (DCI) o nombre genérico */
  dci?: string,
  /** Denominación distintiva o comercial del producto */
  denominacion?: string,
  /** Número identificador del producto */
  numero?: string,
  /** Fracción arancelaria correspondiente */
  fraccion?: string,
  /** Descripción detallada de la fracción arancelaria */
  descripcionDeLa?: string,
  /** Tipo de producto (medicamento, dispositivo, etc.) */
  tipoDeProducto?: string,
  /** Forma farmacéutica del producto */
  formaFarmaceutica?: string,
  /** Unidad de Medida de Tarifa */
  umt?: string,
  /** Unidad de Medida Comercial */
  umc?: string,
  /** Número de registro CAS (Chemical Abstracts Service) */
  numeroCas?: string,
  /** Cantidad de lotes o unidades */
  cantidad?: string,
  /** Peso en kilogramos o gramos por lote */
  kg?: string,
  /** Número de piezas a fabricar */
  numeroFabricar?: string,
  /** Descripción del número de piezas a fabricar */
  descripcionFabricar?: string;
  /** Número de registro sanitario */
  registroSanitario?: string;
  /** Uso específico del producto */
  uso?: string,
  /** Detalle adicional del uso específico */
  detalle?: string,
  /** Cantidad en Unidad de Medida Comercial */
  cantidadUmc?: string,
  /** Cantidad en Unidad de Medida de Tarifa */
  cantidadUmt?: string
  /** Número de piezas */
  dePiezas?: string,
  /** Descripción de las piezas */
  descripcionDePiezas?: string,
  /** Número de registro alternativo */
  numeroDeReg?: string,
  /** Presentación comercial del producto */
  presentacion?: string,
  /** País de destino final */
  paisDeDestino?: string;
  /** País de origen del producto */
  paisDeOrigen?: string;
  /** País de procedencia inmediata */
  paisDeProcedencia?: string;
}

/**
 * Interfaz para los datos del fabricante o empresa manufacturera.
 * Contiene información completa de identificación y ubicación del fabricante.
 */
export interface Fabricante {
  /** Nombre completo o denominación social del fabricante */
  nombre: string,
  /** Registro Federal de Contribuyentes */
  rfc: string,
  /** Clave Única de Registro de Población (para personas físicas) */
  curp: string,
  /** Número telefónico de contacto */
  telefono: string,
  /** Dirección de correo electrónico */
  correoElectronico: string,
  /** Nombre de la calle del domicilio */
  calle: string,
  /** Número exterior del domicilio */
  numeroExterior: string,
  /** Número interior del domicilio (opcional) */
  numeroInterior: string,
  /** País donde se ubica el fabricante */
  pais: string,
  /** Colonia o barrio */
  colonia: string,
  /** Municipio o alcaldía */
  municipio: string,
  /** Localidad específica */
  localidad: string,
  /** Entidad federativa (estado) */
  entidadFederativa: string,
  /** Estado o región */
  estado: string,
  /** Código postal */
  cp: string,
}

/**
 * Interfaz para otros terceros relacionados en el trámite.
 * Permite registrar información de personas o entidades adicionales involucradas en el proceso.
 */
export interface Otros {
  /** Descripción del tipo de tercero relacionado */
  tercero: string,
  /** Nombre completo o denominación social */
  nombre: string,
  /** Registro Federal de Contribuyentes */
  rfc: string,
  /** Clave Única de Registro de Población */
  curp: string,
  /** Número telefónico de contacto */
  telefono: string,
  /** Dirección de correo electrónico */
  correoElectronico: string,
  /** Nombre de la calle del domicilio */
  calle: string,
  /** Número exterior del domicilio */
  numeroExterior: string,
  /** Número interior del domicilio */
  numeroInterior: string,
  /** País de ubicación */
  pais: string,
  /** Colonia o barrio */
  colonia: string,
  /** Municipio o alcaldía */
  municipio: string,
  /** Localidad específica */
  localidad: string,
  /** Entidad federativa (estado) */
  entidadFederativa: string,
  /** Estado o región */
  estado: string,
  /** Código postal */
  cp: string,
}

/**
 * Modelo para representar los datos de terceros en el trámite 260302.
 * Incluye información personal, dirección, nacionalidad, tipo de persona y otros campos relacionados.
 * Extiende la funcionalidad básica con campos específicos para el trámite 260302.
 */
export interface Otros260302 {
  /** Descripción del tipo de tercero relacionado */
  tercero?: string,
  /** Nombre completo o denominación social */
  nombre?: string,
  /** Registro Federal de Contribuyentes */
  rfc?: string,
  /** Clave Única de Registro de Población */
  curp?: string,
  /** Número telefónico de contacto */
  telefono?: string,
  /** Dirección de correo electrónico */
  correoElectronico?: string,
  /** Nombre de la calle del domicilio */
  calle?: string,
  /** Número exterior del domicilio */
  numeroExterior?: string,
  /** Número interior del domicilio */
  numeroInterior?: string,
  /** País de ubicación */
  pais?: string,
  /** Colonia o barrio */
  colonia?: string,
  /** Municipio o alcaldía */
  municipio?: string,
  /** Localidad específica */
  localidad?: string,
  /** Entidad federativa (estado) */
  entidadFederativa?: string,
  /** Estado o región */
  estado?: string,
  /** Código postal */
  cp?: string,
  /** Denominación social de la empresa */
  denominacionSocial?: string,
  /** Nombre específico del tercero */
  terceroNombre?: string,
  /** Nacionalidad del tercero relacionado */
  tercerosNacionalidad?: string,
  /** Tipo de persona (física o moral) */
  tipoPersona?: string,
  /** Nombre en datos personales */
  datosPersonalesNombre?: string,
  /** Primer apellido en datos personales */
  datosPersonalesPrimerApellido?: string,
  /** Segundo apellido en datos personales */
  datosPersonalesSegundoApellido?: string,
  /** Código postal alternativo */
  codigoPostal?: string,
  /** Clave LADA telefónica */
  lada?: string
}