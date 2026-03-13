/**
 * Enumeración que contiene los textos utilizados en el trámite 30506.
 * Estos textos se utilizan como etiquetas, mensajes o descripciones en el formulario.
 */
export enum Solicitud30506Enum {
  
  /**
   * Texto para los datos del registro.
   * Describe los datos en los que se otorgó el registro en el esquema de certificación
   * o, en su caso, de la última renovación.
   */
  DATOS_REGISTRO = `Datos en que se otorgó su Registro en el Despacho de Mercancías de las Empresas, ó en su caso, de la última 
  Renovación`,
  
  /**
   * Texto para la modalidad de socio comercial.
   * Indica que se debe seleccionar la modalidad de socio comercial.
   */
  CORRESPONDIENTE = 'Indique los datos del pago del derecho correspondiente a la fecha de presentación de la solicitud, a que se refiere el artículo 40, inciso m) de la LFD',

  /**
   * Texto para el primer manifiesto.
   * Declara que las circunstancias por las que se otorgó el registro no han cambiado
   * y que se continúa cumpliendo con los requisitos inherentes.
   */
  MANIFIESTO_1 = 'Manifiesto bajo protesta de decir verdad, que las circunstancias por las que se otorgó la autorización, no han variado y continuo cumpliendo con los requisitos inherentes a la misma.*',

  /**
   * Texto para el segundo manifiesto.
   * Declara que los datos proporcionados son ciertos y que las facultades otorgadas
   * para representar a la solicitante no han sido modificadas ni revocadas.
   */
  MANIFIESTO_2 = 'Bajo protesta de decir verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgadas para representar a la solicitante no me han sido modificadas y/o revocadas.*',
}
