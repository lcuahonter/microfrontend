import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo, Catalogos } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { ComplementarPlantaState, ComplementoDePlanta } from '../../shared/constantes/complementar-planta.enum';
import { Directos } from '../../shared/constantes/empleados.enum';
import { CapacidadInstalada } from '../../shared/constantes/capacidad-instalada.enum';

/**
 * Interface que representa el estado de la solicitud para el trámite 90201.
 * Este estado contiene la información relacionada con los datos de la solicitud.
 * @interface ComplementarState complementar.store.ts
 */
export interface ComplementarState {
  descripcionOtro?: string;
  fechaDeFinDeVigenciaDocumento?: string;
  fechaDeFirmaDocumento?: string;
  descripcionOtroComodato?: string;
  documentoRespaldo?: Catalogo[];
  permanecera: string;
  tipo: string;
  fechaDeFirma: string;
  fetchaDeFinDeVigencia: string;
   tipos: string;
  cantidad: string;
  descripsion: string;
  mnx: string;
   totalDeEmpleados: string;
  directos: string;
  indirectos: string;
  directo: string;
  cedula: string;
  fechaCedula: string;
  indirectosDatos: string;
  contrato: string;
  objeto: string;
  fechaFirma: string;
  fechaFinVigencia: string;
  rfcEmpresa: string;
  razonSocial: string;
   fraccionArancelariaProductoTerminado: string;
  umt: string;
  descripcionComercialProductoTerminado: string;
  turnos: string;
  horasPorTurno: string;
  cantidadEmpleados: string;
  cantidadMaquinaria: string;
  descripcionMaquinaria: string;
  capacidadInstaladaMensual: string;
  capacidadInstaladaAnual: string;
  calculoCapacidadInstalada: string;
  capacidadUtilizadaPct: string;
  tipoDocumentoOptions: Catalogo[];
  tipoInversionOptions: Catalogo[];
  tipoCategoriaOptions: Catalogo[];
  paisOptions: Catalogo[];
  rfcFirmante: string;
  tipoFirmante: string;
  catagoria:string;
  descripcion:string;
  monedaNacionalMensual:string,
  monedaNacionalDeDosPeriodos:string,
  volumenMensual:string,
  twoPeriodVolume:string,
  decripcionComercial:string,
  paisDestino:string,
  rfc:string,
  razonSocialCliente:string,
  tipoDeDocumente:string,
  fechaDeVigencia:string,
  rfcTaxId:string
  complementoDePlantaDatos: ComplementoDePlanta[];
  complementoPlantaDatos: ComplementarPlantaState[];
  directosDatos: Directos[];
  capacidadInstaladaDatos: CapacidadInstalada[];
  permaneceMercancia: string;
  tipoContribuyente: string;
  formDisabled: boolean;
  descripcionOtroImmex: string;
}

/**
 * Función para crear el estado inicial de la solicitud.
 * @returns {ComplementarState} El estado inicial con valores vacíos para cada propiedad.
 */
export function createInitialState(): ComplementarState {
  return {
    permanecera: '',
    tipo: '',
    fechaDeFirma: '',
    fetchaDeFinDeVigencia: '',
    tipos: '',
    cantidad: '',
    descripsion: '',
    mnx: '',
    totalDeEmpleados: '',
    directos: '',
    indirectos: '',
    directo: '',
    cedula: '',
    fechaCedula: '',
    indirectosDatos: '',
    contrato: '',
    objeto: '',
    fechaFirma: '',
    fechaFinVigencia: '',
    rfcEmpresa: '',
    razonSocial: '',
    fraccionArancelariaProductoTerminado: '',
  umt: '',
  descripcionComercialProductoTerminado: '',
  turnos: '',
  horasPorTurno: '',
  cantidadEmpleados: '',
  cantidadMaquinaria: '',
  descripcionMaquinaria: '',
  capacidadInstaladaMensual: '',
  capacidadInstaladaAnual: '',
  calculoCapacidadInstalada: '',
  capacidadUtilizadaPct: '',
  tipoDocumentoOptions: [],
  tipoInversionOptions: [],
  tipoCategoriaOptions: [],
  paisOptions: [],
  rfcFirmante: '',
  tipoFirmante: '',
  catagoria:'',
  descripcion:'',
  monedaNacionalMensual:'',
  monedaNacionalDeDosPeriodos:'',
  volumenMensual:'',
  twoPeriodVolume:'',
  decripcionComercial:'',
  paisDestino:'',
  rfc:'',
  razonSocialCliente:'',
  tipoDeDocumente:'',
  fechaDeVigencia:'',
  rfcTaxId:'',
  complementoDePlantaDatos: [],
  complementoPlantaDatos: [],
  directosDatos: [],
  capacidadInstaladaDatos: [],
  permaneceMercancia: '',
  tipoContribuyente: '',
  formDisabled: false,
  descripcionOtroImmex: '',
  };
}
/**
 * Store para la gestión del estado de la solicitud del trámite 221602.
 * Utiliza Akita para la gestión de estado y permite actualizar los valores relacionados con el trámite.
 * @class Tramite221602Store
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Complementar', resettable: true })
export class ComplementarStore extends Store<ComplementarState> {
  /**
   * Constructor del store que inicializa el estado con el estado inicial creado.
   */
  constructor() {
    super(createInitialState());
  }
/**
 * @param catagoria
 * Establece la categoría seleccionada en el estado del store.
 */
  public setCatagoria(catagoria:string):void
  {
     this.update((state) => ({
    ...state,
    catagoria,
  }));
  }

  /**
   *  @param descripcion 
   * Establece la descripción proporcionada en el estado del store.
   */
   public setDescripcion(descripcion:string):void
  {
     this.update((state) => ({
    ...state,
    descripcion,
  }));
  }

  /**
   * 
   * @param monedaNacionalMensual 
   * Establece el valor de moneda nacional mensual en el estado del store.
   */
   public setMonedaNacionalMensual(monedaNacionalMensual:string):void
  {
     this.update((state) => ({
    ...state,
    monedaNacionalMensual,
  }));
  } 
/**
 * @param monedaNacionalDeDosPeriodos 
 */
  setMonedaNacionalDeDosPeriodos(monedaNacionalDeDosPeriodos:string):void
  {
     this.update((state) => ({
    ...state,
    monedaNacionalDeDosPeriodos,
  }));
  }
  
  /**
   * @param volumenMensual 
   * Establece el valor de volumen mensual en el estado del store.
   */
  setVolumenMensual(volumenMensual:string):void
  {
     this.update((state) => ({
    ...state,
    volumenMensual,
  }));
  }

  /**
   * Establece el valor de volumen en dos periodos en el estado del store.
   * @param twoPeriodVolume 
   */
  setTwoPeriodVolume(twoPeriodVolume:string):void
  {
     this.update((state) => ({
    ...state,
    twoPeriodVolume,
  }));
  }
  /**
   * Establece la descripción comercial en el estado del store.
   * @param descripcionComercial 
   */
  setDescripcionComercial(descripcionComercial:string):void
  {
     this.update((state) => ({
    ...state,
    descripcionComercial,
  }));
  }
/**   * Establece el país de destino en el estado del store.
   * @param paisDestino 
   */
  setPaisDestino(paisDestino:string):void
  {
     this.update((state) => ({
    ...state,
    paisDestino,
  }));
  }
  /**   * Establece el RFC en el estado del store.
   * @param rfc 
   */
  setRfc(rfc:string):void
  {
     this.update((state) => ({
    ...state,
    rfc,
  }));
  }

  /**
   * Establece la descripción comercial en el estado del store.
   * @param decripcionComercial 
   */
  setDecripcionComercial(decripcionComercial:string):void
  {
     this.update((state) => ({
    ...state,
    decripcionComercial,
  }));
  }
/**
 * Establece el tipo de documento en el estado del store.
 * @param tipoDeDocumente
 */
  setTipoDeDocumente(tipoDeDocumente:string):void
  {
     this.update((state) => ({
    ...state,
    tipoDeDocumente,
  }));
  }
/**
 * Establece la fecha de vigencia en el estado del store.
 * @param fechaDeVigencia 
 * 
 */
  setFechaDeVigencia(fechaDeVigencia:string):void
  {
     this.update((state) => ({
    ...state,
    fechaDeVigencia,
  }));
  }

  /**
   * Establece el RFC del cliente en el estado del store.
   * @param rfcTaxId 
   */
  setRfcTaxId(rfcTaxId:string):void
  {
     this.update((state) => ({
    ...state,
    rfcTaxId,
  }));
  }

/**
 * Establece la razón social del cliente en el estado del store.
 * @param razonSocialCliente
 */
  setRazonSocialCliente(razonSocialCliente:string):void
  {
     this.update((state) => ({
    ...state,
    razonSocialCliente,
  }));
  }
/**
 * Establece si el contrato permanecerá vigente.
 * Este valor se guarda en el estado para su uso posterior en validaciones o envíos.
 */
public setPermanecera(permanecera: string): void {
  this.update((state) => ({
    ...state,
    permanecera,
  }));
}

/**
 * Establece el tipo de registro o contrato según lo definido por el usuario.
 * Este campo puede ser utilizado para distinguir entre diferentes modalidades.
 */
public setTipo(tipo: string): void {
  this.update((state) => ({
    ...state,
    tipo,
  }));
}

/**
 * Establece la fecha en la que se firmó el documento.
 * Este dato es importante para validar la vigencia del contrato.
 */
public setFechaDeFirma(fechaDeFirma: string): void {
  this.update((state) => ({
    ...state,
    fechaDeFirma,
  }));
}

/**
 * Establece la fecha en la que finaliza la vigencia del contrato.
 * Este valor se usa para calcular si el contrato sigue activo.
 */
public setFetchaDeFinDeVigencia(fetchaDeFinDeVigencia: string): void {
  this.update((state) => ({
    ...state,
    fetchaDeFinDeVigencia,
  }));
}

/**
 * Establece los tipos disponibles o seleccionados en el formulario.
 * Puede representar una lista de categorías aplicables a la empresa o servicio.
 */
public setTipos(tipos: string): void {
  this.update((state) => ({ ...state, tipos }));
}

/**
 * Establece la cantidad numérica relacionada con el registro.
 * Este valor puede hacer referencia a volúmenes, unidades o montos específicos.
 */
public setCantidad(cantidad: string): void {
  this.update((state) => ({ ...state, cantidad }));
}

/**
 * Establece la descripción del objeto o actividad relacionada.
 * Esta información se utiliza para detallar el propósito del trámite.
 */
public setDescripsion(descripsion: string): void {
  this.update((state) => ({ ...state, descripsion }));
}

/**
 * Establece el valor monetario en pesos mexicanos (MNX).
 * Se puede usar para registrar montos económicos relacionados con la operación.
 */
public setMnx(mnx: string): void {
  this.update((state) => ({ ...state, mnx }));
}

/**
 * Establece el total de empleados registrados en la empresa.
 * Este dato es útil para análisis de capacidad o cumplimiento legal.
 */
public setTotalDeEmpleados(totalDeEmpleados: string): void {
  this.update((state) => ({ ...state, totalDeEmpleados }));
}

/**
 * Establece la cantidad de empleados directos contratados.
 * Es útil para diferenciar entre personal directo e indirecto en reportes.
 */
public setDirectos(directos: string): void {
  this.update((state) => ({ ...state, directos }));
}

/**
 * Establece la cantidad de empleados indirectos asociados.
 * Se considera importante para determinar el total de fuerza laboral.
 */
public setIndirectos(indirectos: string): void {
  this.update((state) => ({ ...state, indirectos }));
}

/**
 * Establece el número total de empleados directos (valor alternativo).
 * Puede ser usado en otras secciones del formulario que requieren ese dato específico.
 */
public setDirecto(directo: string): void {
  this.update((state) => ({ ...state, directo }));
}

/**
 * Establece el número de cédula fiscal u oficial.
 * Este dato se requiere para validaciones de identidad o cumplimiento normativo.
 */
public setCedula(cedula: string): void {
  this.update((state) => ({ ...state, cedula }));
}

/**
 * Establece la fecha de emisión de la cédula.
 * Ayuda a validar la vigencia del documento presentado.
 */
public setFechaCedula(fechaCedula: string): void {
  this.update((state) => ({ ...state, fechaCedula }));
}

/**
 * Establece información adicional sobre empleados indirectos.
 * Se puede usar para detallar funciones o ubicaciones asignadas.
 */
public setIndirectosDatos(indirectosDatos: string): void {
  this.update((state) => ({ ...state, indirectosDatos }));
}

/**
 * Establece el número o código del contrato.
 * Es necesario para la identificación y seguimiento del acuerdo.
 */
public setContrato(contrato: string): void {
  this.update((state) => ({ ...state, contrato }));
}

/**
 * Establece el objeto del contrato, es decir, el propósito o alcance.
 * Es crucial para especificar qué cubre el acuerdo firmado.
 */
public setObjeto(objeto: string): void {
  this.update((state) => ({ ...state, objeto }));
}

/**
 * Establece la fecha en que se firmó el contrato.
 * Este campo se usa para calcular la duración del acuerdo.
 */
public setFechaFirma(fechaFirma: string): void {
  this.update((state) => ({ ...state, fechaFirma }));
}

/**
 * Establece la fecha en que termina la vigencia del contrato.
 * Permite controlar el vencimiento y renovación de compromisos legales.
 */
public setFechaFinVigencia(fechaFinVigencia: string): void {
  this.update((state) => ({ ...state, fechaFinVigencia }));
}

/**
 * Establece el RFC de la empresa participante.
 * Este identificador fiscal es obligatorio para trámites legales y fiscales.
 */
public setRfcEmpresa(rfcEmpresa: string): void {
  this.update((state) => ({ ...state, rfcEmpresa }));
}

/**
 * Establece la razón social de la empresa registrada.
 * Es el nombre legal bajo el cual opera la empresa.
 */
public setRazonSocial(razonSocial: string): void {
  this.update((state) => ({ ...state, razonSocial }));
}

/**
 * Establece la fracción arancelaria del producto terminado.
 * Es importante para clasificaciones aduaneras y permisos de exportación/importación.
 */
public setFraccionArancelariaProductoTerminado(fraccionArancelariaProductoTerminado: string): void {
  this.update((state) => ({
    ...state,
    fraccionArancelariaProductoTerminado,
  }));
}

/**
 * Establece la unidad de medida de trabajo (UMT) para el producto.
 * Este valor es utilizado para calcular volúmenes de producción o exportación.
 */
public setUmt(umt: string): void {
  this.update((state) => ({
    ...state,
    umt,
  }));
}

/**
 * Establece la descripción comercial del producto terminado.
 * Esta descripción se muestra en reportes, facturas o trámites oficiales.
 */
public setDescripcionComercialProductoTerminado(descripcionComercialProductoTerminado: string): void {
  this.update((state) => ({
    ...state,
    descripcionComercialProductoTerminado,
  }));
}

/**
 * Establece el número de turnos de producción que maneja la planta.
 * Se utiliza para calcular la capacidad operativa de la empresa.
 */
public setTurnos(turnos: string): void {
  this.update((state) => ({
    ...state,
    turnos,
  }));
}

/**
 * Establece las horas que conforman cada turno de trabajo.
 * Este dato es esencial para determinar tiempos productivos diarios.
 */
public setHorasPorTurno(horasPorTurno: string): void {
  this.update((state) => ({
    ...state,
    horasPorTurno,
  }));
}

/**
 * Establece la cantidad total de empleados en la operación.
 * Se usa para informes de recursos humanos o productividad.
 */
public setCantidadEmpleados(cantidadEmpleados: string): void {
  this.update((state) => ({
    ...state,
    cantidadEmpleados,
  }));
}

/**
 * Establece el número total de máquinas en operación.
 * Es útil para evaluaciones de capacidad técnica o mantenimiento.
 */
public setCantidadMaquinaria(cantidadMaquinaria: string): void {
  this.update((state) => ({
    ...state,
    cantidadMaquinaria,
  }));
}

/**
 * Establece la descripción general de la maquinaria utilizada.
 * Este dato ayuda a detallar el equipamiento disponible en planta.
 */
public setDescripcionMaquinaria(descripcionMaquinaria: string): void {
  this.update((state) => ({
    ...state,
    descripcionMaquinaria,
  }));
}

/**
 * Establece la capacidad instalada mensual de producción.
 * Se calcula con base en turnos, horas, maquinaria y otros recursos.
 */
public setCapacidadInstaladaMensual(capacidadInstaladaMensual: string): void {
  this.update((state) => ({
    ...state,
    capacidadInstaladaMensual,
  }));
}

/**
 * Establece la capacidad instalada anual de producción.
 * Se usa para proyecciones de producción a largo plazo.
 */
public setCapacidadInstaladaAnual(capacidadInstaladaAnual: string): void {
  this.update((state) => ({
    ...state,
    capacidadInstaladaAnual,
  }));
}

/**
 * Establece el método o fórmula para calcular la capacidad instalada.
 * Este valor puede variar según el tipo de industria o producción.
 */
public setCalculoCapacidadInstalada(calculoCapacidadInstalada: string): void {
  this.update((state) => ({
    ...state,
    calculoCapacidadInstalada,
  }));
}

/**
 * Establece el porcentaje de capacidad utilizada.
 * Se compara con la capacidad total para evaluar eficiencia operativa.
 */
public setCapacidadUtilizadaPct(capacidadUtilizadaPct: string): void {
  this.update((state) => ({
    ...state,
    capacidadUtilizadaPct,
  }));
}

/**
 * Establece el porcentaje de capacidad utilizada.
 * Se compara con la capacidad total para evaluar eficiencia operativa.
 */
public setTipoDocumentoOptions(tipoDocumentoOptions: Catalogo[]): void {
  this.update((state) => ({
    ...state,
    tipoDocumentoOptions,
  }));
}

/**
 * Establece el porcentaje de capacidad utilizada.
 * Se compara con la capacidad total para evaluar eficiencia operativa.
 */
public setTipoInversionOptions(tipoInversionOptions: Catalogo[]): void {
  this.update((state) => ({
    ...state,
    tipoInversionOptions,
  }));
}

/**
 * Establece el porcentaje de capacidad utilizada.
 * Se compara con la capacidad total para evaluar eficiencia operativa.
 */
public setTipoCategoriaOptions(tipoCategoriaOptions: Catalogo[]): void {
  this.update((state) => ({
    ...state,
    tipoCategoriaOptions,
  }));
}

/**
 * Establece el porcentaje de capacidad utilizada.
 * Se compara con la capacidad total para evaluar eficiencia operativa.
 */
public setPaisOptions(paisOptions: Catalogo[]): void {
  this.update((state) => ({
    ...state,
    paisOptions,
  }));
}

/**
 * Establece el RFC de la parte firmante del documento.
 * @param rfcFirmante 
 * Establece el RFC de la parte firmante del documento.
 * Este valor es crucial para identificar legalmente a la entidad que suscribe el contrato.
 */
public setRfcFirmante(rfcFirmante: string): void {
  this.update((state) => ({
    ...state,
    rfcFirmante,
  }));
}

/**
 * Establece el tipo de firmante del documento.
 * @param tipoFirmante 
 */
public setTipoFirmante(tipoFirmante: string): void {
  this.update((state) => ({
    ...state,
    tipoFirmante,
  }));
}

/**
 * Establece los datos de complemento de planta en el estado.
 * @param complementoDePlantaDatos Arreglo de objetos ComplementoDePlanta que contiene la información detallada.
 */
public setComplementoDePlantaDatos(complementoDePlantaDatos: ComplementoDePlanta): void {
  this.update((state) => ({
    ...state,
    complementoDePlantaDatos: [...state.complementoDePlantaDatos, complementoDePlantaDatos ],
  }));
}

removeComplementoDePlantaDatos(complementoDePlanta: ComplementoDePlanta[]): void {
  this.update(state => ({
    ...state,
    complementoDePlantaDatos: state.complementoDePlantaDatos.filter(data =>
      !complementoDePlanta.some(sel =>
          sel.PLANTA === data.PLANTA &&
          sel.PERMANECERA_MERCANCIA_PROGRAMA === data.PERMANECERA_MERCANCIA_PROGRAMA &&
          sel.TIPO_DOCUMENTO === data.TIPO_DOCUMENTO &&
          sel.DESCRIPCION_TIPO_DOCUMENTO === data.DESCRIPCION_TIPO_DOCUMENTO &&
          sel.FECHA_DE_FIRMA === data.FECHA_DE_FIRMA &&
          sel.FECHA_DE_FIN_DE_VIGENCIA === data.FECHA_DE_FIN_DE_VIGENCIA &&
          sel.DOCUMENTO_RESPALDO === data.DOCUMENTO_RESPALDO &&
          sel.DESCRIPCION_DOCUMENTO_RESPALDO === data.DESCRIPCION_DOCUMENTO_RESPALDO &&
          sel.FECHA_DE_FIRMA_DOCUMENTO === data.FECHA_DE_FIRMA_DOCUMENTO &&
          sel.FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO === data.FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO
      )
    )
  }));
}
/**
 * Establece los datos de complemento de planta en el estado.
 * @param complementoPlantaDatos Arreglo de objetos ComplementarPlantaState que contiene la información detallada.
 */
public setComplementoPlantaDatos(complementoPlantaDatos: ComplementarPlantaState[]): void {
  this.update((state) => ({
    ...state,
    complementoPlantaDatos,
  }));
}
/**
 * Establece los datos de empleados directos en el estado.
 * @param directosDatos Arreglo de objetos Directos que contiene la información detallada.
 */
public setDirectosDatos(directosDatos: Directos[]): void {
  this.update((state) => ({
    ...state,
    directosDatos,
  }));
}

/**
 * Establece los datos de capacidad instalada en el estado.
 * @param capacidadInstaladaDatos Arreglo de objetos CapacidadInstalada que contiene la información detallada.
 */
public setCapacidadInstaladaDatos(capacidadInstaladaDatos: CapacidadInstalada[]): void {
  this.update((state) => ({
    ...state,
    capacidadInstaladaDatos,
  }));
}

/**
 * Establece si la mercancía permanece en la planta.
 * Este valor se utiliza para determinar el destino de la mercancía.
 */
public setPermaneceMercancia(permaneceMercancia: string): void {
  this.update((state) => ({
    ...state,
    permaneceMercancia,
  }));
}

/**
 * Establece el tipo de contribuyente.
 * Este valor es relevante para clasificaciones fiscales y legales.
 */
public setTipoContribuyente(tipoContribuyente: string): void {
  this.update((state) => ({
    ...state,
    tipoContribuyente,
  }));
}

setEliminarMontosDeInversionPlanta(plantaIds: string[]): void {
  this.update((state) => ({
    ...state,
    complementoDePlantaDatos: state.complementoDePlantaDatos.filter(
      (planta) => !plantaIds.includes(planta.PLANTA)
    ),
  }));
}
cleanComplementoPlantaDatos(): void {
  this.update((state) => ({
    ...state,
    complementoPlantaDatos: [],
  }));
}

/**
 * Establece el estado de deshabilitación del formulario
 * @param formDisabled - Booleano que indica si el formulario debe estar deshabilitado
 */
public setFormDisabled(formDisabled: boolean): void {
  this.update((state) => ({
    ...state,
    formDisabled,
  }));
}

public setDescripcionOtroImmex(descripcionOtroImmex: string):void
  {
     this.update((state) => ({
    ...state,
    descripcionOtroImmex,
  }));
  }
}