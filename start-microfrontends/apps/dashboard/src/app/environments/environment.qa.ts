/**
 * @description
 * Configuración del entorno de QA de la aplicación.
 * Esta configuración se utiliza para establecer las URL del servidor y otras configuraciones necesarias para la aplicación en QA.
 * Se utiliza para la comunicación con el servidor y la carga de archivos.
 */
export const ENVIRONMENT = {
    URL_SERVER: 'https://qa.v30.ultrasist.net/api',
    URL_SERVER_UPLOAD: 'https://qa.v30.ultrasist.net/api/upload',
    URL_SERVER_JSON_AUXILIAR: 'https://qa.v30.ultrasist.net/api/json-auxiliar',
    MOCK: false,
    REMOTE_APPS: {
      "login": "https://qa.front.v30.ultrasist.net/login",
      "agace": "https://qa.front.v30.ultrasist.net/agace",
      "aga": "https://qa.front.v30.ultrasist.net/aga",
      "agricultura": "https://qa.front.v30.ultrasist.net/agricultura",
      "se": "https://qa.front.v30.ultrasist.net/se",
      "semarnat": "https://qa.front.v30.ultrasist.net/semarnat",
      "funcionario": "https://qa.front.v30.ultrasist.net/funcionario",
      "cofepris": "https://qa.front.v30.ultrasist.net/cofepris",
      "sener": "https://qa.front.v30.ultrasist.net/sener",
      "amecafe": "https://qa.front.v30.ultrasist.net/amecafe",
      "inbal": "https://qa.front.v30.ultrasist.net/inbal",
      "sedena": "https://qa.front.v30.ultrasist.net/sedena",
      "profepa": "https://qa.front.v30.ultrasist.net/profepa",
      "inah": "https://qa.front.v30.ultrasist.net/inah",
      "crt": "https://qa.front.v30.ultrasist.net/crt",
      "stps": "https://qa.front.v30.ultrasist.net/stps",
      "bandejas": "https://qa.front.v30.ultrasist.net/bandejas",
      "privados": "https://qa.front.v30.ultrasist.net/privados",
      "consultas":"https://qa.front.v30.ultrasist.net/consultas",
      "catalogos":"https://qa.front.v30.ultrasist.net/catalogos",
      "configuracion":"https://qa.front.v30.ultrasist.net/configuracion",
      "tareas":"https://qa.front.v30.ultrasist.net/tareas",
      "usuarios":"https://qa.front.v30.ultrasist.net/usuarios",
      "maritimos":"https://qa.front.v30.ultrasist.net/maritimos",
      "ferroviarios":"https://qa.front.v30.ultrasist.net/ferroviarios"
    }
  };