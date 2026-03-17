

export interface CrossListLable {
    /** Texto que aparece en la parte izquierda de la etiqueta. */
    tituluDeLaIzquierda: string;
  
    /** Texto que aparece en la parte derecha de la etiqueta. */
    derecha: string;
  }
  
  export interface CrossList {
    /** Etiquetas asociadas a la lista cruzada. */
    label: CrossListLable;
  
    /** Fechas asociadas con los datos de la lista cruzada. */
    fechas: string[];
  }

export interface MercanciaCrossList {
    /** Lista cruzada para los países de origen de la mercancía. */
    paisOrigenCrossList: CrossList;
  
    /** Lista cruzada para los países de procedencia de la mercancía. */
    paisProcedencisCrossList: CrossList;
  
    /** Lista cruzada para los usos específicos de la mercancía. */
    usoEspecificoCrossList: CrossList;
  }