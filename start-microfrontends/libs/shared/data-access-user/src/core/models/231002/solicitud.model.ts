export interface RadioOpcion {
    /**
     * Etiqueta o texto descriptivo que se muestra al usuario para esta opción.
     * Este texto es lo que el usuario verá junto al botón de opción (radio button).
     * Por ejemplo, "Hombre" o "Mujer" en un formulario de selección de género.
     */
    label: string;

    /**
     * Valor interno asociado a esta opción, que generalmente se utiliza para identificarla
     * de manera única en el sistema. Este valor es enviado al backend cuando el formulario
     * es enviado. Por ejemplo, "M" para "Masculino" o "F" para "Femenino".
     */
    value: string;
}

interface ImmexItem {
    id: number;
    descripcion: string;
}

interface Nombre{
    id: number;
    descripcion: string;
}

interface Tabla {
    encabezadoDeTabla: string[];
    cuerpoTabla: { tbodyData: string[] }[];
}

export interface SolicitudJson {
    Immex: ImmexItem[];
    Domicilio: ImmexItem[];
    Aduana : ImmexItem[];
    Pais : ImmexItem[];
    table: Tabla[];
    radioOptions: RadioOpcion[];
    nombre: Nombre[];
    PrimasRelacionadas: Tabla[];
    arancelaria: ImmexItem[];
    nico: ImmexItem[];
    unidad: ImmexItem[];
    residuo: ImmexItem[];
    tipoNombre: ImmexItem[];
    descripcion: ImmexItem[];
    creti: ImmexItem[];
    estadoFisico: ImmexItem[];
    tipoContenedor: ImmexItem[];
    clasificacionRadioOptions: RadioOpcion[];
    requiereEmpresaServicioReciclaje: RadioOpcion[];
    reciclajeEnInstalaciones: RadioOpcion[];
}


