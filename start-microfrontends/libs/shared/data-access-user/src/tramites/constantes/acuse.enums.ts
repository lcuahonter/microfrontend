/**
 * Lista de procedimientos para los que se genera un Acuse de Recibo.
 * Cada objeto contiene el identificador del procedimiento y el título mostrado.
 * @type {{ procedure: number, titulo: string }[]}
 */
export const ACUSE_PROCEDURE = [
    {
        procedure: 120301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130118,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 220201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 220202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 220203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260507,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 5701,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 32507,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 32508,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 319,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31910,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31907,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31908,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130120,
        titulo: "Acuse de Recibo"
    }, {
        procedure: 32504,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 40301,
        titulo: "Acuse de Recibo"
    },
     {
        procedure: 40401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 40201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 230901,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 40202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11204,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 701,
        titulo: "Acuse de Recibo"
    }
];

/**
 * Lista de procedimientos de resoluciones para los que se genera un Acuse de Recibo.
 * Cada objeto contiene el identificador del procedimiento, el título mostrado y, opcionalmente, información de un botón inferior.
 * @type {{ procedure: number, titulo: string, botonInferior?: { titulo: string, url?: string } }[]}
 */
export const ACUSE_RESOLUCIONES_PROCEDURE = [
    {
        procedure: 80101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80105,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80205,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80206,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80207,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80208,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80210,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80211,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110201,
        titulo: "Acuse de Recibo",
        botonInferior: {
            titulo: "Nueva Captura",
            url: "registro/solicitud"
        }
    },
    {
        procedure: 110202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110204,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110205,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110207,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110208,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110209,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110210,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110211,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110212,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110214,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110216,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110217,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110218,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110219,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110221,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110222,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 110223,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 140101,
        titulo: "Acuses y resoluciones",
        documento: [1, 11]

    },
    {
        procedure: 140102,
        titulo: "Acuses y resoluciones",
        documento: [1, 11]
    },
    {
        procedure: 140103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 140104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 140105,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 140205,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 140201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120204,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120402,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120403,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120404,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120501,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120601,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120602,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120603,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 120702,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130105,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130106,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130107,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130109,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130110,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130111,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130112,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130113,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130114,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130115,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130116,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130119,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130217,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 130401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80302,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80303,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80305,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80306,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80308,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80314,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 80316,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 150101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 150102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 150103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90302,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90303,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90304,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 90305,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 190401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260204,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260205,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260206,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260207,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260208,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260209,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260210,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260212,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260213,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260214,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260215,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260216,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260217,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260218,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260302,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260303,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260304,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260402,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260501,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260502,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260503,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260504,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260505,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260508,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260509,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260510,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260511,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260512,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260513,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260514,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260515,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260516,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260601,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260603,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260604,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260605,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260701,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260702,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260703,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260704,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260902,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260903,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260904,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260905,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260906,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260910,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260911,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260912,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260914,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260915,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260917,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 260918,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261402,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261601,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261701,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 261702,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 270507,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 105,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 302,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 324,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 5601,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 6101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 6102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 6402,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 6403,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 6502,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 9999,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 10301,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 10302,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 10303,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 10703,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11102,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11105,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11106,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 30401,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 30503,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 30901,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31201,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31202,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31203,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31601,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31602,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31603,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31611,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 31612,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 420101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 420103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 630103,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 630104,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 630303,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 630307,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 680101,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 32501,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 32502,
        titulo: "Acuse de Recibo"
    },
    {
        procedure: 11202,
        titulo: "Acuse de Recibo"
    }
]

/**
 * Lista de tipos de documentos disponibles para acuses.
 * Cada objeto contiene el nombre del documento y su identificador único.
 * @type {{ nombre_documento: string, identificador_documento: number }[]}
 */
export const DOCUMENTO_LISTA = [
    {
        nombre_documento: "Acuse de recepción de trámite",
        identificador_documento: 1
    },
    {
        nombre_documento: "Oficio de resolución",
        identificador_documento: 11
    }
];