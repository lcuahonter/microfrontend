

import { REGEX_RFC } from "@libs/shared/data-access-user/src/tramites/constantes/regex.constants";

/**
 * Representa un arreglo constante de objetos que define la configuración para un formulario de "Representante Legal".
 * Cada objeto en el arreglo especifica las propiedades y reglas de validación para un campo del formulario.
 *
 * @constant
 * @type {Array<Object>}
 *
 * @property {string} id - El identificador único para el campo del formulario.
 * @property {string} labelNombre - La etiqueta mostrada para el campo del formulario.
 * @property {string} campo - El nombre del campo en el formulario.
 * @property {string} clase - La clase CSS aplicada al campo del formulario para el estilo.
 * @property {string} tipoInput - El tipo de elemento de entrada (por ejemplo, 'text', 'button', 'number').
 * @property {boolean} desactivado - Indica si el campo está deshabilitado.
 * @property {boolean} soloLectura - Indica si el campo es de solo lectura.
 * @property {Array<Object>} validadores - Un arreglo de reglas de validación para el campo.
 * @property {string} validadores.tipo - El tipo de validación (por ejemplo, 'required').
 * @property {string} marcadorDePosicion - Texto de marcador de posición para el campo de entrada.
 * @property {string} valorPredeterminado - Valor predeterminado para el campo de entrada.
 * @property {number} marginTop - El margen superior aplicado al campo.
 */
export const REPRESENTANTE_LEGAL = [
    {
      id: 'resigtro',
      labelNombre: 'Registro Federal de Contribuyentes',
      campo: 'resigtro',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required'
        },
        {
          tipo: 'pattern',
          valor: REGEX_RFC,
          mensaje: 'El RFC debe tener un formato válido.'
        }
      ],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
      row: 1
    },
    {
      id: 'consultarIDC',
      labelNombre: 'Buscar',
      campo: 'buscar',
      clase: 'col-md-8',
      tipoInput: 'button',
      desactivado: false,
      marginTop: 5,
      row: 1
    },
    {
      id: 'rfc',
      labelNombre: 'RFC',
      campo: 'rfc',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores:[],
      marcadorDePosicion: '',
      marginTop: 3,
      row: 2
    },
    {
      id: 'nombre',
      labelNombre: 'Nombre',
      campo: 'nombre',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      marginTop: 3,
      row: 3
    },
    {
      id: 'apellidoPaterno',
      labelNombre: 'Apellido Paterno',
      campo: 'apellidoPaterno',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      marginTop: 3,
      row: 3
    },
    {
        id: 'apellidoMaterno',
        labelNombre: 'Apellido Materno',
        campo: 'apellidoMaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 3,
        row: 3
    },
    {
        id: 'telefono',
        labelNombre: 'Teléfono',
        campo: 'telefono',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 3,
        row: 4
    },
    {
        id: 'correoElectronico',
        labelNombre: 'Correo Electrónico',
        campo: 'correoElectronico',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 3,
        row: 4
    }
  ];