import { UnidadTabla, VehiculoTabla, VehiculoTablaConfig } from "../models/registro-muestras-mercancias.model";
import { UnidadTablaConfig } from "../models/registro-muestras-mercancias.model";

export const CHOFERES_PAGE = {
  MODAL: 'modal',
  ACTIVETAB: 'nacional',
  CHOFERES_EXTRANJEROS: 'Datos del chofer extranjero',
  CHOFERES_NACIONALES: 'Datos del chofer nacional',
  SOLICITUD_TITULO_CHOFER_EXTRANJERO: 'Datos del chofer extranjero',
  LABEL_SOLICITUD_PERSONA_NOMBRE: 'Nombre',
  LABEL_SOLICITUD_PERSONA_PRIMER_APELLIDO: 'Primer Apellido ',
  LABEL_SOLICITUD_PERSONA_SEGUNDO_APELLIDO: 'Segundo Apellido',
  LABEL_NACIONALIDAD: 'Nacionalidad',
  LABEL_SOLICITUD_CHOFER_EXT_GAFETE: 'Numero de gafete del chofer',
  LABEL_SOLICITUD_CHOFER_EXT_VIGENCIA_GAFETE: 'Vigencia del Gafete',
  LABEL_SOLICITUD_CHOFER_EXT_NSS: 'Número de Seguro Social (NSS)',
  LABEL_SOLICITUD_CHOFER_EXT_IDE_FISCAL: 'Número de Identificación Fiscal',
  TOOL_TIP_IDENTIFICACION_FISCAL: 'Número de identificación fiscal en el país de residencia',
  SOLICITUD_TITULO_DOMICILIO_FISCAL: 'Domicilio Fiscal',
  LABEL_PAIS: 'País',
  LABEL_SOLICITUD_DOMICILIO_CODIGO_POSTAL: 'Código Postal',
  LABEL_ENTIDAD_FEDERATIVA: 'Estado',
  LABEL_SOLICITUD_DOMICILIO_CALLE: 'Calle',
  LABEL_SOLICITUD_DOMICILIO_NUMERO_EXTERIOR: 'Número exterior',
  LABEL_SOLICITUD_DOMICILIO_NUMERO_INTERIOR: 'Número interior',
  LABEL_PAIS_ORIGEN: 'País de residencia',
  LABEL_SOLICITUD_DOMICILIO_CIUDAD: 'Ciudad',
  LABEL_SOLICITUD_CORREO: 'Correo electrónico',
  LABEL_SOLICITUD_TELEFONO: 'Teléfono',
  CAMPOS_OBLIGATORIOS: '* Campos obligatorios',
  BOTON_BUSCAR: 'Buscar',
  BOTON_LIMPIAR: 'Limpiar',
  BOTON_CANCELAR: 'Cancelar',
  BOTON_GUARDAR: 'Guardar',
  SELECCIONA_UNVALOR: 'Selecciona un valor'
};

export const VEHICULO_PAGE= {
  SELECTED_TAB: 'Parque vehicular',
  ACTIVE_TAB: 'parquevehicular',
  LABEL_SOLICITUD_VEHICULO_TIPO_VEHICULO: 'Tipo de Vehículo',
  SOLICITUD_TITULO_DATOS_VEHICULO: 'Datos del Vehículo',
  LABEL_SOLICITUD_VEHICULO_VIN: 'Número de identificación vehicular',
  LABEL_PUNTOS: 'Puntos',
  NON_SELECTION_TEXT_TIPO_VEHICULO: 'Selecciona un valor',
  NON_SELECTION_TEXT_PAIS_EMISOR: 'Selecciona un valor',
  NON_SELECTION_TEXT_COLOR_AGA: 'Selecciona un valor',
  NON_SELECTION_TEXT_ANIOS: 'Selecciona un valor',
  LABEL_SOLICITUD_VEHICULO_ID_DEVEHICULO: 'ID de Vehículo',
  LABEL_SOLICITUD_VEHICULO_NUMEROPLACAS: 'Número de Placas',
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR: 'País Emisor',
  LABEL_SOLICITUD_DOMICILIO_ESTADO: 'Estado o provincia',
  LABEL_SOLICITUD_VEHICULO_MARCA: 'Marca',
  LABEL_SOLICITUD_VEHICULO_MODELO: 'Modelo',
  LABEL_ANIO_VEH: 'Año',
  LABEL_SOLICITUD_VEHICULO_TRANSPONDER: 'Transponder',
  LABEL_SOLICITUD_VEHICULO_COLOR: 'Color de Vehículo',
  LABEL_SOLICITUD_VEHICULO_NUMERO_ECONOMICO: 'Número económico',
  LABEL_SOLICITUD_VEHICULO_NUMERO_2DAPLACA: 'Número 2da Placa',
  LABEL_SOLICITUD_VEHICULO_EMISOR_2DAPLACA: 'Estado emisor de 2da Placa',
  LABEL_SOLICITUD_VEHICULO_PAIS_EMISOR_2DAPLACA: 'País Emisor 2da Placa',
  LABEL_DESCRIPCION_VEHICULO: 'Descripción del vehículo',
  BOTON_LIMPIAR: 'Limpiar',
  BOTON_CANCELAR: 'Cancelar',
  BOTON_GUARDAR: 'Guardar'
};


export const VEHICULOS_TABLA_CONFIG: VehiculoTablaConfig = {
  encabezadas: [
    {
      encabezado: 'ID',
      clave: (item: VehiculoTabla) => item.idDeVehiculo,
      orden: 0,
    },
    {
      encabezado: 'Número de identificación vehicular',
      clave: (item: VehiculoTabla) => item.numero,
      orden: 1,
    },
    {
      encabezado: 'Tipo de vehículo',
      clave: (item: VehiculoTabla) => item.tipoDeVehiculo,
      orden: 2,
    },
    {
      encabezado: 'Número económico',
      clave: (item: VehiculoTabla) => item.numuroEconomico,
      orden: 3,
    },
    {
      encabezado: 'Transponder',
      clave: (item: VehiculoTabla) => item.transponder,
      orden: 4,
    },
    {
      encabezado: 'Número de placas',
      clave: (item: VehiculoTabla) => item.numeroPlaca,
      orden: 5,
    },
    {
      encabezado: 'País emisor',
      clave: (item: VehiculoTabla) => item.paisEmisor,
      orden: 6,
    },
    {
      encabezado: 'Estado o provincia',
      clave: (item: VehiculoTabla) => item.estado,
      orden: 7,
    },
    {
      encabezado: 'Marca',
      clave: (item: VehiculoTabla) => item.marca,
      orden: 8,
    },
    {
      encabezado: 'Modelo',
      clave: (item: VehiculoTabla) => item.modelo,
      orden: 9,
    },
    {
      encabezado: 'Año',
      clave: (item: VehiculoTabla) => item.ano,
      orden: 10,
    }
  ],
   datos: [],
};

export const UNIDAD_TABLA_CONFIG: UnidadTablaConfig = {
  encabezadas: [
    {
      encabezado: 'ID',
      clave: (item: UnidadTabla) => String(item.idDeVehiculoUnidad), 
      orden: 0,
    },  
    {
      encabezado: 'VIN del vehículo',
      clave: (item: UnidadTabla) => item.vinVehiculo,
      orden: 1,
    },
    {
      encabezado: 'Tipo de unidad de arrastre',
      clave: (item: UnidadTabla) => item.tipoDeUnidadArrastre,
      orden: 2,
    },
    {
      encabezado: 'Número económico',
      clave: (item: UnidadTabla) => item.numeroEconomico,
      orden: 3,
    },
    {
      encabezado: 'Número de Placas',
      clave: (item: UnidadTabla) => item.numeroPlaca,
      orden: 4,
    },
    {
      encabezado: 'País Emisor',
      clave: (item: UnidadTabla) => item.paisEmisor,
      orden: 5,
    },
    {
      encabezado: 'Estado o provincia',
      clave: (item: UnidadTabla) => item.estado,
      orden: 6,
    },
  ],
  datos: [],
};