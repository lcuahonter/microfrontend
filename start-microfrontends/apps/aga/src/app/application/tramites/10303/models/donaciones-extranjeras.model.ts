/**
 * Interfaz que representa una declaración de manifiesto.
 */
export interface Manifiestos {
    /**
     * Los detalles de la declaración.
     * 
     * @property {string} clave - El identificador único de la declaración.
     * @property {string} descripcion - La descripción de la declaración.
     */
    declaracion: {
        clave: string;
        descripcion: string;
    }
    /**
     * Indicador de si la declaración forma parte del manifiesto.
     * 
     * @type {boolean}
     */
    manifiestoDeclaracion: boolean;
}

/**
 * Respuesta de la API al obtener múltiples manifiestos.
 */
export interface ManifiestosRespuesta {
    /**
     * Lista de manifiestos.
     * 
     * @type {Manifiestos[]}
     */
    data: Manifiestos[];
}

/**
 * Interfaz que representa un requisito básico.
 */
export interface BasicRequerimientos {
    /**
     * Identificador único del requisito básico.
     * 
     * @type {string}
     */
    clave: string;

    /**
     * Descripción del requisito básico.
     * 
     * @type {string}
     */
    descripcion: string;
}

/**
 * Respuesta de la API al obtener múltiples requisitos básicos.
 */
export interface BasicRequerimientosRespuesta {
    /**
     * Lista de requisitos básicos.
     * 
     * @type {BasicRequerimientos[]}
     */
    data: BasicRequerimientos[];
}

/**
 * Interfaz que representa a un contribuyente.
 */
export interface Contribuyente {
    /**
     * El RFC (Registro Federal de Contribuyentes) único del contribuyente.
     * 
     * @type {string}
     */
    rfc: string;

    /**
     * La razón social del contribuyente (opcional).
     * 
     * @type {string}
     */
    razonSocial?: string;

    /**
     * El nombre del contribuyente (opcional).
     * 
     * @type {string}
     */
    nombre?: string;

    /**
     * El apellido paterno del contribuyente (opcional).
     * 
     * @type {string}
     */
    apellidoPaterno?: string;

    /**
     * El apellido materno del contribuyente (opcional).
     * 
     * @type {string}
     */
    apellidoMaterno?: string;

    /**
     * La calle de la dirección del contribuyente.
     * 
     * @type {string}
     */
    calle: string;

    /**
     * El número exterior de la dirección del contribuyente.
     * 
     * @type {string}
     */
    numeroExterior: string;

    /**
     * El número interior de la dirección del contribuyente (opcional).
     * 
     * @type {string}
     */
    numeroInterior?: string;

    /**
     * El estado o región en donde se encuentra el contribuyente.
     * 
     * @type {string}
     */
    estado: string;

    /**
     * La colonia o barrio donde se encuentra el contribuyente.
     * 
     * @type {string}
     */
    colonia: string;

    /**
     * El código postal de la dirección del contribuyente.
     * 
     * @type {string}
     */
    codigoPostal: string;

    /**
     * El país donde se encuentra el contribuyente.
     * 
     * @type {string}
     */
    pais: string;

    /**
     * El correo electrónico del contribuyente.
     * 
     * @type {string}
     */
    correoElectronico: string;

    /**
     * El número de teléfono del contribuyente.
     * 
     * @type {string}
     */
    telefono: string;
}

/**
 * Respuesta de la API al obtener los datos de un contribuyente.
 */
export interface ContribuyenteRespuesta {
    /**
     * Lista de contribuyentes.
     * 
     * @type {Contribuyente[]}
     */
    data: Contribuyente[];
}
