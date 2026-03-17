/**
 * @description
 * Configuración del entorno de desarrollo de la aplicación.
 * Esta configuración se utiliza para establecer las URL del servidor y otras configuraciones necesarias para la aplicación en desarrollo.
 * Se utiliza para la comunicación con el servidor y la carga de archivos.
 */
export const ENVIRONMENT = {
  URL_SERVER: 'https://dev.v30.ultrasist.net/api',
  URL_SERVER_UPLOAD: 'https://upload.v30.ultrasist.net/api/upload',
  URL_SERVER_JSON_AUXILIAR: 'https://dev.v30.ultrasist.net/api/json-auxiliar',
  MOCK: true,
  REMOTE_APPS: {
    "login": "http://localhost:4201",
    "agace": "http://localhost:4209",
    "aga": "http://localhost:4202",
    "agricultura": "http://localhost:4204",
    "se": "http://localhost:4205",
    "semarnat": "http://localhost:4206",
    "funcionario": "http://localhost:4210",
    "cofepris": "http://localhost:4211",
    "sener": "http://localhost:4217",
    "amecafe":"http://localhost:4212",
    "inbal": "http://localhost:4218",
    "sedena": "http://localhost:4219",
    "profepa": "http://localhost:4220",
    "inah":"http://localhost:4221",
    "crt":"http://localhost:4222",
    "stps":"http://localhost:4223",
    "bandejas":"http://localhost:4224",
    "privados":"http://localhost:4225",
    "consultas":"http://localhost:4226",
    "catalogos":"http://localhost:4227",
    "configuracion":"http://localhost:4228",
    "tareas":"http://localhost:4229",
    "usuarios":"http://localhost:4230",
    "maritimos":"http://localhost:4231",
    "ferroviarios":"http://localhost:4232"
  }
};