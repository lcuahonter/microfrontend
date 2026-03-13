/**
 * Interfaz que define la estructura de datos para la tabla de socios
 * Contiene toda la información necesaria para identificar a una persona física o moral
 */
export interface DatosSociosTable {
    /**
     * Registro Federal de Contribuyentes
     * Identificador único fiscal asignado por el SAT
     * @example "XAXX010101000" para persona moral o "CURP123456HDFRRL09" para persona física
     */
    rfc: string;
    
    /**
     * Razón social de la empresa o denominación comercial
     * Nombre oficial registrado ante las autoridades fiscales
     * Solo aplica para personas morales
     * @example "Tecnología Avanzada S.A. de C.V."
     */
    razonsocial: string;
    
    /**
     * Nombre(s) de la persona física
     * Primer nombre o nombres de pila del socio
     * @example "Juan Carlos"
     */
    nombre: string;
    
    /**
     * Apellido paterno de la persona física
     * Primer apellido según el registro civil
     * @example "García"
     */
    apellidoPaterno: string;
    
    /**
     * Apellido materno de la persona física
     * Segundo apellido según el registro civil
     * Puede ser opcional en algunos casos
     * @example "López"
     */
    apellidoM: string;
}

/**
 * Interfaz que representa un estado de la República Mexicana
 * Utilizada para catálogos de ubicación geográfica
 */
export interface Estado {
    /**
     * Identificador único numérico del estado
     * Clave primaria para la tabla de estados
     * @example 1 para Aguascalientes, 9 para Ciudad de México
     */
    id: number;
    
    /**
     * Nombre completo del estado
     * Denominación oficial del estado mexicano
     * @example "Aguascalientes", "Ciudad de México", "Jalisco"
     */
    descripcion: string;
}

/**
 * Interfaz que define la estructura de una dirección de representación federal
 * Contiene todos los componentes necesarios para ubicar geográficamente una oficina federal
 */
export interface RepresentacionFederal {
    /**
     * Nombre de la calle o avenida
     * Vía principal donde se ubica la representación
     * @example "Avenida Insurgentes Sur", "Calle Madero"
     */
    calle: string;
    
    /**
     * Número exterior del inmueble
     * Numeración oficial asignada por el municipio para identificar el predio
     * @example "1234", "456-A"
     */
    numeroExterior: string;
    
    /**
     * Número interior del inmueble
     * Identificación específica dentro del edificio (opcional)
     * @example "Piso 5", "Despacho 301", "Local B"
     */
    numeroInterior: string;
    
    /**
     * Código postal de cinco dígitos
     * Código numérico asignado por Correos de México para la zona
     * @example "01000" para Centro Histórico CDMX, "44100" para Centro de Guadalajara
     */
    codigoPostal: string;
    
    /**
     * Nombre de la colonia o fraccionamiento
     * Subdivisión territorial dentro del municipio
     * @example "Centro", "Roma Norte", "Polanco"
     */
    colonia: string;
    
    /**
     * Nombre del municipio o alcaldía
     * División política administrativa donde se encuentra ubicada la representación
     * @example "Benito Juárez", "Miguel Hidalgo", "Guadalajara"
     */
    municipio: string;
    
    /**
     * Nombre del estado de la república
     * Entidad federativa donde se localiza la representación federal
     * @example "Ciudad de México", "Jalisco", "Nuevo León"
     */
    estado: string;
}