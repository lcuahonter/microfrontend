/**
 * Constantes utilizadas en la aplicación para definir opciones de botones de radio y textos de la interfaz de usuario.
 * Estas constantes son utilizadas en el componente de aviso de destrucción de mercancías importadas temporal
 * para competencias y eventos deportivos.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Aviso para la destrucción de mercancías importadas temporalmente para competencias y eventos deportivos',
        value: '1',
    },
    {
        label: 'Aviso de la destrucción de mercancías importadas temporalmente para competencias y eventos de automovilismo deportivo',
        value: '0',
    }
];

/**
 * Textos utilizados en la interfaz de usuario para diferentes mensajes y etiquetas.
 */
export const TEXTOS = {
    ETIQUETA_DE_ARCHIVO: 'Sin archivo seleccionados',
    ALERTA: `<p class="text-center">En caso de que el interesado cambie la fecha de destrucción, deberá presentar un nuevo aviso.</p>`
}

/**
 * Constante que define la estructura de un campo de fecha de inicio del evento.
 */
export const FECHA_INICIO_EVENTO = {
    labelNombre: 'Fecha de inicio del evento',
    required: true,
    habilitado: true,
};

/**
 * Constante que define la estructura de un campo de fecha de conclusión del evento.
 */
export const FECHA_CONCLUSION_EVENTO = {
    labelNombre: 'Fecha conclusión del evento',
    required: true,
    habilitado: true
};

/**
 * Constante que define la estructura de un campo de fecha de destrucción del aviso.
 */
export const FECHA_DESTRUCION = {
    labelNombre: 'Fecha en la que se llevará a cabo la destrucción de la mercancía *:',
    required: true,
    habilitado: true
}