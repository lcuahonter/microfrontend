/**
 * @description
 * Configuración del entorno de producción de la aplicación.
 * Esta configuración se utiliza para establecer las URL del servidor y otras configuraciones necesarias para la aplicación en producción.
 * Se utiliza para la comunicación con el servidor y la carga de archivos.
 */
export const ENVIRONMENT = {
    URL_SERVER: 'https://prod.v30.ultrasist.net/api',
    URL_SERVER_UPLOAD: 'https://prod.v30.ultrasist.net/api/upload',
    URL_SERVER_JSON_AUXILIAR: 'https://prod.v30.ultrasist.net/api/json-auxiliar',
    MOCK: false,
    REMOTE_APPS: {
      "login": "https://front.v30.ultrasist.net/login",
      "agace": "https://front.v30.ultrasist.net/agace",
      "aga": "https://front.v30.ultrasist.net/aga",
      "agricultura": "https://front.v30.ultrasist.net/agricultura",
      "se": "https://front.v30.ultrasist.net/se",
      "semarnat": "https://front.v30.ultrasist.net/semarnat",
      "funcionario": "https://front.v30.ultrasist.net/funcionario",
      "cofepris": "https://front.v30.ultrasist.net/cofepris", 
      "sener": "https://front.v30.ultrasist.net/sener",
      "amecafe": "https://front.v30.ultrasist.net/amecafe",
      "inbal": "https://front.v30.ultrasist.net/inbal",
      "sedena": "https://front.v30.ultrasist.net/sedena",
      "profepa": "https://front.v30.ultrasist.net/profepa",
      "inah": "https://front.v30.ultrasist.net/inah",
      "crt": "https://front.v30.ultrasist.net/crt",
      "stps": "https://front.v30.ultrasist.net/stps",
      "bandejas": "https://front.v30.ultrasist.net/bandejas",
      "privados": "https://front.v30.ultrasist.net/privados",
      "consultas":"https://front.v30.ultrasist.net/consultas",
      "catalogos":"https://front.v30.ultrasist.net/catalogos",
      "configuracion":"https://front.v30.ultrasist.net/configuracion",
      "tareas":"https://front.v30.ultrasist.net/tareas",
      "usuarios":"https://front.v30.ultrasist.net/usuarios",
      "maritimos":"https://front.v30.ultrasist.net/maritimos",
      "ferroviarios":"https://front.v30.ultrasist.net/ferroviarios"
    }
  };