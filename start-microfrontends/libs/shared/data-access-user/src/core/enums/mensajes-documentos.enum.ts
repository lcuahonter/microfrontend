/**
 * Enum `MENSAJES_DOCUMENTOS` que define los mensajes relacionados con la gestión de documentos.
 */
export enum MENSAJES_DOCUMENTOS {
  /**
   * Mensaje que indica que solo se aceptan archivos en formato PDF.
   */
  ONL_YPDF = 'El tipo de documento que trata de anexar no cumple con los requisitos. No está en un formato válido de PDF.',

  /**
   * Mensaje que indica que el tamaño del documento excede el límite permitido.
   */
  MAX_SIZE = 'El tamaño del documento que intenta cargar excede el tamaño permitido',

  /**
   * Mensaje que indica que ocurrió un error al intentar subir el documento.
   */
  ERROR_UPLOAD = 'Error al subir el documento',

  /**
   * Mensaje que indica que el documento se ha subido exitosamente.
   */
  UPLOAD = 'Documento subido',
}

export enum ESTATUS_CARGA_DOCUMENTO {
  /**
   * Estado que indica que el documento ha sido cargado exitosamente.
   */
  CARGADO = 'Cargado',

  /**
   * Estado que indica que el documento esta pendiente de carga.

   */
  PENDIENTE = 'Pendiente',
}

/**
 * Enumera las unidades utilizadas para los documentos en el sistema.
 * Este enum define los tipos de unidades que pueden ser asociadas con los documentos.
 */
export enum UNIDADES_DOCUMENTOS {
  /**
   * Representa un documento en formato PDF.
   */
  PDF = 'PDF',

  /**
   * Representa la unidad de resolución en puntos por pulgada (DPI).
   */
  DPI = 'DPIs',

  /**
   * Representa el tamaño de un documento en megabytes (MB).
   */
  MB = 'MB',

  /**
   * Representa el tamaño de un documento en kilobytes (KB).
   */
  KB = 'KB',
}

/**
 * @description Enum `MENSAJES_MODAL` que define los mensajes para mostrar en modales relacionados con la carga de documentos.
 */
export enum MENSAJES_MODAL {
  INFORMACION_SUBIR_DOCUMENTOS = `
          <div class="d-flex flex-column">
             <div class="mb-3">
               <span>Para poder adjuntar sus documentos, deberá cumplir con las siguientes caracteristicas:</span>
             </div>
            <div class="px-3">
               <ul>
                 <li>Formato PDF, que no contenga formulario, objetos OLE incrustados, codigo javascript, etc.</li>
               <li>No debe contener páginas en blanco</li>
               </ul>
             </div>
           </div>`,
}


/**
 * @descrption Almacena la palabra 'opcinal', usada para identificar si un documento es opcional o no.
 */
export const OPCIONAL = 'opcional';