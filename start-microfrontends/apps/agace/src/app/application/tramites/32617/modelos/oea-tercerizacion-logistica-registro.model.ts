/**
 * @interfaz
 * @nombre VehiculosTabla
 * @descripción
 * Define la estructura de los datos de la tabla de vehículos.
 * Contiene información básica sobre los vehículos, como marca, modelo y VIN.
 */
export interface NumeroEmpleadosTabla {
  id: number; // Identificador único del vehículo.
  denominacionSocial: string; // Denominación social del vehículo.
  rfc: string; // Modelo del vehículo.
  numeroDeEmpleados: number; // Número de empleados del vehículo.
  bimestre:string; // Bimestre al que corresponde el registro.
}

/**
 * Represents a response structure for searching RFCs.
 *
 * @property {number} code - The status code of the response.
 * @property {Partial<NumeroEmpleadosTabla>} data - Partial data of the RFC search result.
 * @property {string} message - A message describing the response.
 */
export interface BuscarRfcResponse {
  code: number;
  data: Partial<NumeroEmpleadosTabla>; // Datos de RFC obtenidos.
  message: string;
}


/**
 * Represents a generic API response structure.
 *
 * @template T - The type of data contained in the response.
 * @property {number} code - The status code of the response.
 * @property {T[]} data - The array of data items returned by the API.
 * @property {string} message - A message describing the response.
 */
export interface ApiResponse<T> {
  code: number;
  data: T[];
  message: string;
}


/**
 * Represents a federal entity with a unique identifier and description.
 *
 * @property id - The unique identifier of the federal entity.
 * @property descripcion - The description or name of the federal entity.
 */
export interface EntidadFederativa {
  id: number;
  descripcion: string;
}


/**
 * Represents the details of an installation, including its location and registration information.
 *
 * @property entidadFederativa - The federal entity (state) where the installation is located.
 * @property municipio - The municipality of the installation.
 * @property direccion - The address of the installation.
 * @property codigoPostal - The postal code of the installation.
 * @property registro - The registration identifier for the installation.
 */
export interface InstalacionesInterface {
    entidadFederativa: string;
    municipio: string;
    direccion: string;
    codigoPostal: string;
    registro: string
}


/**
 * Represents the table structure for the RFC applicant's addresses.
 *
 * @property id - (Optional) Unique identifier for the address record.
 * @property InstalacionesPrincipales - Main facilities associated with the applicant.
 * @property tipoInstalacion - Type of installation (e.g., warehouse, office).
 * @property entidadFederativa - Federal entity (state) where the address is located.
 * @property municipioAlcaldia - Municipality or borough of the address.
 * @property coloniaCalleNumero - Neighborhood, street, and number of the address.
 * @property codigoPostal - Postal code of the address.
 * @property registroSESAT - SESAT registration information.
 * @property procesoProductivo - Description of the productive process at the location.
 * @property acreditaUsoGoceInmueble - Indicates if the use/enjoyment of the property is accredited.
 * @property realizaActividadComercioExterior - Indicates if foreign trade activities are performed at the location.
 * @property reconocimientoMutuoCTPAT - Indicates mutual recognition with CTPAT.
 * @property perfilEmpresa - Profile of the company at this address.
 */
export interface DomiciliosRfcSolicitanteTabla {
  id?:number;
  InstalacionesPrincipales: string;
  tipoInstalacion: string;
  entidadFederativa: string;
  municipioAlcaldia: string;
  coloniaCalleNumero: string; // This was mislabeled as codigoPostal in the table config
  codigoPostal: string;
  registroSESAT: string;
  procesoProductivo: string;
  acreditaUsoGoceInmueble: string;
  realizaActividadComercioExterior: string;
  reconocimientoMutuoCTPAT: string;
  perfilEmpresa: string;
}


/**
 * Represents an inventory control record for the OEA textile registration process.
 *
 * @property id - Unique identifier for the inventory control entry.
 * @property nombreSistema - Name of the system used for inventory control.
 * @property lugarRadicacion - Location where the inventory is registered.
 * @property cumpleAnexo24 - Indicates whether the system complies with Annex 24 requirements.
 */
export interface ControlInventariosTabla {
  id:number;
  nombreSistema:string;
  lugarRadicacion:string;
  cumpleAnexo24: boolean;
}


/**
 * Represents a member of a company for the OEA textile registration process.
 *
 * @property id - Unique identifier for the member.
 * @property tipoPersona - Type of person (e.g., individual, legal entity).
 * @property nombre - First name of the member.
 * @property apellidoPaterno - Paternal surname of the member.
 * @property apellidoMaterno - Maternal surname of the member.
 * @property nombreCompleto - Full name of the member.
 * @property rfc - Federal Taxpayer Registry (RFC) code.
 * @property caracter - Character or role of the member within the company.
 * @property nacionalidad - Nationality of the member.
 * @property obligadoTributarMexico - Indicates if the member is required to pay taxes in Mexico.
 * @property nombreEmpresa - Name of the associated company.
 */
export interface AgregarMiembroEmpresaTabla {
  id:number;
  tipoPersona: string;
  nombre: string;
  nombreColleccion?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  rfc: string;
  caracter: string;
  nacionalidad: string;
  obligadoTributarMexico: string;
  nombreEmpresa: string;
}


/**
 * Represents the operational link's RFC information.
 *
 * @property enlaceOperativorfc - The RFC (Registro Federal de Contribuyentes) of the operational link.
 * @property denominacionRazonsocial - The business name or legal denomination of the operational link.
 * @property domicilio - The address of the operational link.
 */
export interface RFCEnlaceOperativo {
  enlaceOperativorfc: string;
  denominacionRazonsocial: string;
  domicilio: string;
  
}
/**
 * Representa los detalles de un transportista en la lista.
 *
 * @property enlaceOperativorfc - RFC (Registro Federal de Contribuyentes) del enlace operativo.
 * @property denominacionRazonsocial - Denominación o razón social del transportista.
 * @property domicilio - Domicilio del transportista.
 * @property ccat - Identificador único o código del transportista.
 */
export interface TransportistasListaInterface {
  enlaceOperativorfc: string;
  denominacionRazonsocial: string;
  domicilio: string;
  ccat: string;
}

/**
 * Representa los detalles de una empresa del grupo.
 *
 * @property rfcEnclaveOperativo - RFC del enclave operativo.
 * @property denominacionRazonsocial - Denominación o razón social de la empresa.
 * @property domicilio - Domicilio de la empresa.
 * @property inputfechaDeLaUltimaOperacion - Fecha de la última operación de la empresa.
 */
export interface EmpresaDelGrupo{
  rfcEnclaveOperativo: string;
  denominacionRazonsocial: string;
  domicilio: string;
  inputfechaDeLaUltimaOperacion: string;
}

export interface TercerosContratados {
  rfcTerceroContratado: string;
  denominacionRazonsocial: string;
  tipoRegistro: string;
  ctpatCertificadoTC: string;
  registroEsquemaCertificacionTC: string;
  registroSocioComercialCertificadoTC: string;
}

/**
 * Representa los detalles de un transportista en la tabla.
 *
 * @property rfcEnclaveOperativo - RFC del enlace operativo del transportista.
 * @property denominacionRazonsocial - Denominación o razón social del transportista.
 * @property domicilio - Domicilio del transportista.
 * @property ccat - Código o identificador único del transportista.
 */
export interface TransportistasTable {
  rfcEnclaveOperativo: string;
  denominacionRazonsocial: string;
  domicilio: string;
  ccat: string;
}



/**
 * Representa los detalles de un enlace operativo en la tabla.
 *
 * @property registro - Registro único del enlace operativo.
 * @property id - Identificador único del enlace.
 * @property rfc - Registro Federal de Contribuyentes.
 * @property nombre - Nombre del enlace operativo.
 * @property apellidoPaterno - Apellido paterno del enlace.
 * @property apellidoMaterno - Apellido materno del enlace.
 * @property cuidad - Ciudad en la que reside el enlace.
 * @property cargo - Cargo que desempeña el enlace operativo.
 * @property telefono - Número de teléfono de contacto.
 * @property correoElectronico - Correo electrónico del enlace operativo.
 * @property suplente - Indica si el enlace operativo es suplente.
 * @property seleccionado - Indica si el enlace ha sido seleccionado (opcional).
 */
export interface TablaEnlaceOperativo {
    registro: string;
    id: number;
    rfc: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    cuidad: string;
    cargo: string;
    telefono: string;
    correoElectronico: string;
    suplente: boolean;
    seleccionado?: boolean;
}


/**
 * Represents the response structure for an operational link table.
 *
 * @property code - The status code of the response.
 * @property data - An array of `TablaEnlaceOperativo` items containing the table data.
 * @property message - A descriptive message about the response.
 */
export interface EnlaceOperativoRespuestaTabla {
    code: number;
    data: TablaEnlaceOperativo[];
    message: string;
}



/**
 * Represents a person to be notified, including their identification and personal details.
 *
 * @property rfc - The RFC (Registro Federal de Contribuyentes) identifier of the person.
 * @property curp - The CURP (Clave Única de Registro de Población) identifier of the person.
 * @property nombre - The first name of the person.
 * @property apellidoPaterno - The paternal surname of the person.
 * @property apellidoMaterno - The maternal surname of the person.
 */
export interface TablaPersonasNotificaciones {
    rfc: string;
    curp: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
}


/**
 * Interfaz que define la estructura de respuesta del servidor para la tabla de personas.
 * 
 * Encapsula la respuesta estándar del API que contiene información sobre personas
 * notificaciones, incluyendo código de estado, datos y mensaje descriptivo.
 * 
 * @description Esta interfaz estandariza las respuestas del servidor para:
 * - Manejo consistente de respuestas HTTP
 * - Validación de datos recibidos
 * - Control de errores y estados de la aplicación
 * 
 * @interface PersonaRespuestaTabla
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export interface PersonaRespuestaTabla {
    code: number;
    data: TablaPersonasNotificaciones[];
    message: string;
}


/**
 * Represents the response structure for the OEA textile registration process.
 *
 * @property rubroCertificacion - Certification code for the textile sector.
 * @property fechaFinVigenciaRubro - End date of the certification validity.
 * @property numeroOficio - Official document number associated with the certification.
 */export interface RubroTextil {
  rubroCertificacion: string;
  fechaFinVigenciaRubro: string;
  numeroOficio: string;
}