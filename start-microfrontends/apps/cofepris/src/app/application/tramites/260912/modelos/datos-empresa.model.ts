/**
 * Interfaz que define la estructura de datos para la tabla de socios
 * Contiene información fiscal y personal de los socios de la empresa
 */
export interface DatosSociosTable {
    /** 
     * Registro Federal de Contribuyentes del socio
     * Formato: 12-13 caracteres alfanuméricos según el SAT
     */
    rfc: string;
    
    /** 
     * Razón social o denominación oficial del socio
     * Nombre comercial registrado ante las autoridades fiscales
     */
    razonsocial: string;
    
    /** 
     * Nombre(s) de pila del socio
     * Primer nombre o nombres completos de la persona física
     */
    nombre: string;
    
    /** 
     * Apellido paterno del socio
     * Primer apellido según documentos oficiales de identificación
     */
    apellidoPaterno: string;
    
    /** 
     * Apellido materno del socio
     * Segundo apellido según documentos oficiales de identificación
     */
    apellidoM: string;
}

/**
 * Interfaz que representa un estado o entidad federativa
 * Utilizada para catálogos de ubicaciones geográficas
 */
export interface Estado {
    /** 
     * Identificador único numérico del estado
     * Clave primaria para la entidad federativa
     */
    id: number;
    
    /** 
     * Nombre completo del estado o entidad federativa
     * Descripción textual oficial del estado (ej: "Jalisco", "Ciudad de México")
     */
    descripcion: string;
}

/**
 * Interfaz que define la estructura de una dirección de representación federal
 * Contiene todos los elementos necesarios para conformar una dirección postal completa
 */
export interface RepresentacionFederal {
    /** 
     * Nombre de la calle o vialidad principal
     * Incluye el tipo de vialidad (Calle, Avenida, Boulevard, etc.)
     */
    calle: string;
    
    /** 
     * Número exterior del domicilio
     * Numeración oficial asignada por el municipio para identificar el inmueble
     */
    numeroExterior: string;
    
    /** 
     * Número interior del domicilio (opcional)
     * Identificador interno como departamento, oficina, local, etc.
     */
    numeroInterior: string;
    
    /** 
     * Código postal de la ubicación
     * Código numérico de 5 dígitos asignado por SEPOMEX
     */
    codigoPostal: string;
    
    /** 
     * Nombre de la colonia o asentamiento
     * Denominación oficial del fraccionamiento, colonia o barrio
     */
    colonia: string;
    
    /** 
     * Nombre del municipio o delegación
     * División político-administrativa donde se ubica el domicilio
     */
    municipio: string;
    
    /** 
     * Nombre del estado o entidad federativa
     * Estado donde se encuentra ubicado el domicilio
     */
    estado: string;
}