import { ComposicionMaterial, DatosSolicitudFormType, PagoDerechosState, TablaNumeroCasType } from '../../models/materiales-peligrosos.model';
import { Destinatario, Representante, Uso, UsoFinal } from '../../models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


/**
 * Representa el estado del trámite 230501, incluyendo información sobre el pago de derechos,
 * datos de solicitud, opciones colapsables, y diversas tablas relacionadas con el material peligroso.
 * También incluye indicadores de modo edición y validaciones de formulario.
 *
 * @interface Tramite230501State
 *
 * @property {PagoDerechosState} pagoDerechosState - Estado que contiene los datos relacionados con el pago de derechos del trámite.
 * @property {DatosSolicitudFormType} datosSolicitudFormType - Contiene los datos capturados en el formulario principal de solicitud.
 * @property {boolean} opcionesColapsableState - Determina si el panel de opciones colapsables se encuentra abierto o cerrado.
 * @property {TablaNumeroCasType[]} numeroCasTablaDatos - Lista de datos relacionados con los números CAS (Chemical Abstracts Service).
 * @property {ComposicionMaterial[]} composicionTablaDatos - Lista que representa la composición química del material peligroso.
 * @property {Destinatario[]} destinatarioFinalTablaDatos - Lista de destinatarios finales del material peligroso.
 * @property {boolean} esDestinatarioFinalElModoDeEdicion - Indica si el formulario de destinatario final está en modo edición.
 * @property {UsoFinal[]} usuarioTablaDatos - Lista de usuarios finales del material peligroso.
 * @property {boolean} esUsuarioElModoDeEdicion - Indica si el formulario de usuario final está en modo edición.
 * @property {Uso[]} usoTablaDatos - Lista de usos específicos asignados al material peligroso.
 * @property {Representante[]} representanteLegalTablaDatos - Lista de representantes legales involucrados en el trámite.
 * @property {boolean} esRepresentanteLegalElModoDeEdicion - Indica si el formulario de representante legal está en modo edición.
 * @property {{ [key: string]: boolean }} formaValida - Mapa de validaciones que indica el estado de validez de diferentes secciones del formulario.
 *   Las claves representan las secciones y los valores son booleanos que indican si esa sección es válida.
 *   Ejemplos de claves: `destinatarioFinal`, `representanteLegal`, `UsuarioFinal`, `composicionForm`, `datosSolicitudForm`, `pagoDeDerechos`, `formularioTotal`.
 */
export interface Tramite230501State {
  /**
   * @property pagoDerechosState
   * @description Estado que contiene los datos relacionados con el pago de derechos del trámite.
   * @example
   * ```typescript
   * const pagoDerechosState = {
   *   clave: '123',
   *   dependencia: 'Secretaría de Hacienda',
   *   banco: 'Banco Nacional',
   *   llavePago: 'ABC123',
   *   fecha: '2023-01-01',
   *   importePago: '1000'
   * };
   * ```
   */
  pagoDerechosState: PagoDerechosState;

  /**
   * @property datosSolicitudFormType
   * @description Contiene los datos capturados en el formulario principal de solicitud.
   * @example
   * ```typescript
   * const datosSolicitudFormType = {
   *   tratadoRotterdam: true,
   *   listadoNacional: false,
   *   fraccionArancelaria: '1234.56.78',
   *   descripcionFraccion: 'Descripción de la fracción',
   *   convenioMinamata: true,
   *   numeroCas: '123-45-6',
   *   descripcionNoArancelaria: 'Descripción no arancelaria',
   *   nombreQuimico: 'Cloruro de sodio',
   *   nombreComun: 'Sal',
   *   nombreComercial: 'Sal refinada',
   *   estadoFisico: 'Sólido',
   *   cantidad: 100,
   *   cantidadLetra: 'Cien',
   *   unidadMedida: 'kg',
   *   licenciaSanitaria: 'Licencia123',
   *   usoEspecifico: 'Uso industrial',
   *   fechaExportacion: '2023-01-01',
   *   modoCantidad: true
   * };
   * ```
   */
  datosSolicitudFormType: DatosSolicitudFormType;

  /**
   * @property opcionesColapsableState
   * @description Determina si el panel de opciones colapsables se encuentra abierto o cerrado.
   * @example
   * ```typescript
   * const opcionesColapsableState = true;
   * ```
   */
  opcionesColapsableState: boolean;

  /**
   * @property numeroCasTablaDatos
   * @description Lista de datos relacionados con los números CAS (Chemical Abstracts Service).
   * @example
   * ```typescript
   * const numeroCasTablaDatos = [
   *   { numeroCas: '123-45-6', descripcion: 'Sustancia química A' },
   *   { numeroCas: '789-01-2', descripcion: 'Sustancia química B' }
   * ];
   * ```
   */
  numeroCasTablaDatos: TablaNumeroCasType[];

  /**
   * @property composicionTablaDatos
   * @description Lista que representa la composición química del material peligroso.
   * @example
   * ```typescript
   * const composicionTablaDatos = [
   *   { componente: 'Cloruro de sodio', porcentaje: 50 },
   *   { componente: 'Agua', porcentaje: 50 }
   * ];
   * ```
   */
  composicionTablaDatos: ComposicionMaterial[];

  /**
   * @property destinatarioFinalTablaDatos
   * @description Lista de destinatarios finales del material peligroso.
   * @example
   * ```typescript
   * const destinatarioFinalTablaDatos = [
   *   { nombre: 'Juan Pérez', telefono: '1234567890' },
   *   { nombre: 'María López', telefono: '0987654321' }
   * ];
   * ```
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * @property esDestinatarioFinalElModoDeEdicion
   * @description Indica si el formulario de destinatario final está en modo edición.
   * @example
   * ```typescript
   * const esDestinatarioFinalElModoDeEdicion = true;
   * ```
   */
  esDestinatarioFinalElModoDeEdicion: boolean;

  /**
   * @property usuarioTablaDatos
   * @description Lista de usuarios finales del material peligroso.
   * @example
   * ```typescript
   * const usuarioTablaDatos = [
   *   { nombre: 'Empresa A', telefono: '1234567890' },
   *   { nombre: 'Empresa B', telefono: '0987654321' }
   * ];
   * ```
   */
  usuarioTablaDatos: UsoFinal[];

  /**
   * @property esUsuarioElModoDeEdicion
   * @description Indica si el formulario de usuario final está en modo edición.
   * @example
   * ```typescript
   * const esUsuarioElModoDeEdicion = false;
   * ```
   */
  esUsuarioElModoDeEdicion: boolean;

  /**
   * @property usoTablaDatos
   * @description Lista de usos específicos asignados al material peligroso.
   * @example
   * ```typescript
   * const usoTablaDatos = [
   *   { uso: 'Industrial' },
   *   { uso: 'Agrícola' }
   * ];
   * ```
   */
  usoTablaDatos: Uso[];

  /**
   * @property representanteLegalTablaDatos
   * @description Lista de representantes legales involucrados en el trámite.
   * @example
   * ```typescript
   * const representanteLegalTablaDatos = [
   *   { nombre: 'Abogado A', telefono: '1234567890' },
   *   { nombre: 'Abogado B', telefono: '0987654321' }
   * ];
   * ```
   */
  representanteLegalTablaDatos: Representante[];

  /**
   * @property esRepresentanteLegalElModoDeEdicion
   * @description Indica si el formulario de representante legal está en modo edición.
   * @example
   * ```typescript
   * const esRepresentanteLegalElModoDeEdicion = true;
   * ```
   */
  esRepresentanteLegalElModoDeEdicion: boolean;

  /**
   * @property formaValida
   * @description Mapa de validaciones que indica el estado de validez de diferentes secciones del formulario.
   * Las claves representan las secciones y los valores son booleanos que indican si esa sección es válida.
   * Ejemplos de claves: `destinatarioFinal`, `representanteLegal`, `UsuarioFinal`, `composicionForm`, `datosSolicitudForm`, `pagoDeDerechos`, `formularioTotal`.
   * @example
   * ```typescript
   * const formaValida = {
   *   destinatarioFinal: true,
   *   representanteLegal: false,
   *   UsuarioFinal: true,
   *   composicionForm: false,
   *   datosSolicitudForm: true,
   *   pagoDeDerechos: true,
   *   formularioTotal: false
   * };
   * ```
   */
  formaValida: { [key: string]: boolean };
}


/**
 * Crea el estado inicial para el trámite 230501.
 * 
 * Este método devuelve un objeto que representa el estado inicial de la aplicación 
 * para el trámite específico. Incluye propiedades relacionadas con el estado de 
 * colapsabilidad, datos de tablas, modos de edición, formularios y validaciones.
 * 
 * @returns {Tramite230501State} El estado inicial del trámite 230501.
 * 
 * Propiedades del estado inicial:
 * - `opcionesColapsableState`: Indica si las opciones colapsables están activadas o desactivadas.
 * - `destinatarioFinalTablaDatos`: Lista de datos del destinatario final.
 * - `esDestinatarioFinalElModoDeEdicion`: Indica si el destinatario final está en modo de edición.
 * - `usuarioTablaDatos`: Lista de datos del usuario.
 * - `esUsuarioElModoDeEdicion`: Indica si el usuario está en modo de edición.
 * - `usoTablaDatos`: Lista de datos relacionados con el uso.
 * - `representanteLegalTablaDatos`: Lista de datos del representante legal.
 * - `esRepresentanteLegalElModoDeEdicion`: Indica si el representante legal está en modo de edición.
 * - `datosSolicitudFormType`: Objeto que contiene los datos del formulario de solicitud, como:
 *   - `tratadoRotterdam`: Indica si el tratado de Rotterdam aplica.
 *   - `listadoNacional`: Indica si está en el listado nacional.
 *   - `fraccionArancelaria`: Fracción arancelaria del producto.
 *   - `descripcionFraccion`: Descripción de la fracción arancelaria.
 *   - `convenioMinamata`: Indica si aplica el convenio de Minamata.
 *   - `numeroCas`: Número CAS del producto químico.
 *   - `descripcionNoArancelaria`: Descripción no arancelaria del producto.
 *   - `nombreQuimico`: Nombre químico del producto.
 *   - `nombreComun`: Nombre común del producto.
 *   - `nombreComercial`: Nombre comercial del producto.
 *   - `estadoFisico`: Estado físico del producto.
 *   - `cantidad`: Cantidad del producto.
 *   - `cantidadLetra`: Cantidad en formato de texto.
 *   - `unidadMedida`: Unidad de medida del producto.
 *   - `licenciaSanitaria`: Licencia sanitaria asociada.
 *   - `usoEspecifico`: Uso específico del producto.
 *   - `fechaExportacion`: Fecha de exportación del producto.
 *   - `modoCantidad`: Indica si el modo cantidad está activado.
 * - `numeroCasTablaDatos`: Lista de datos relacionados con el número CAS.
 * - `composicionTablaDatos`: Lista de datos relacionados con la composición.
 * - `pagoDerechosState`: Objeto que contiene los datos del pago de derechos, como:
 *   - `clave`: Clave del pago.
 *   - `dependencia`: Dependencia asociada al pago.
 *   - `banco`: Banco donde se realizó el pago.
 *   - `llavePago`: Llave única del pago.
 *   - `fecha`: Fecha del pago.
 *   - `importePago`: Importe del pago realizado.
 * - `formaValida`: Objeto que indica la validez de diferentes secciones del formulario, como:
 *   - `destinatarioFinal`: Validez del destinatario final.
 *   - `representanteLegal`: Validez del representante legal.
 *   - `UsuarioFinal`: Validez del usuario final.
 *   - `composicionForm`: Validez del formulario de composición.
 *   - `datosSolicitudForm`: Validez del formulario de datos de solicitud.
 *   - `pagoDeDerechos`: Validez del pago de derechos.
 *   - `formularioTotal`: Validez total del formulario.
 */
export function createInitialState(): Tramite230501State {
  return {
    opcionesColapsableState: false,
    destinatarioFinalTablaDatos: [],
    esDestinatarioFinalElModoDeEdicion: false,
    usuarioTablaDatos: [],
    esUsuarioElModoDeEdicion: false,
    usoTablaDatos: [],
    representanteLegalTablaDatos: [],
    esRepresentanteLegalElModoDeEdicion: false,
    datosSolicitudFormType: {
      tratadoRotterdam: false,
      listadoNacional: false,
      fraccionArancelaria: '',
      descripcionFraccion: '',
      convenioMinamata: false,
      numeroCas: '',
      descripcionNoArancelaria: '',
      nombreQuimico: '',
      nombreComun: '',
      nombreComercial: '',
      estadoFisico: '',
      cantidad: null,
      cantidadLetra: '',
      unidadMedida: '',
      licenciaSanitaria: '',
      usoEspecifico: '',
      fechaExportacion: '',
      modoCantidad: false
    },
    numeroCasTablaDatos: [],
    composicionTablaDatos: [],
    pagoDerechosState: {
      clave: '',
      dependencia: '',
      banco: '',
      llavePago: '',
      fecha: '',
      importePago: ''
    },
    formaValida:{
      destinatarioFinal: false,
      representanteLegal: false,
      UsuarioFinal: false,
      composicionForm: false,
      datosSolicitudForm: false,
      pagoDeDerechos: false,
      formularioTotal : false,
    }
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 230501.
 * 
 * Esta clase utiliza Akita para gestionar el estado de la aplicación relacionado con el trámite 230501.
 * Proporciona métodos para actualizar y manipular el estado, así como para emitir valores reactivos
 * mediante `BehaviorSubject`.
 * 
 * @remarks
 * Los métodos de esta clase permiten realizar operaciones como agregar, actualizar y eliminar datos
 * relacionados con destinatarios, representantes legales, usuarios finales y usos finales.
 * También incluye métodos para gestionar el estado de validación de formularios y actualizar
 * propiedades específicas del estado.
 * 
 * @example
 * ```typescript
 * const store = new Tramite230501Store();
 * store.setPagoDerechosStateProperty('monto', '1000');
 * store.addDestinatarioFinalTablaDatos([{ nombre: 'Juan', telefono: '1234567890' }]);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Tramite230501', resettable: true })
export class Tramite230501Store extends Store<Tramite230501State> {

  /**
   * Sujeto destinatario representado como un BehaviorSubject.
   * Este objeto permite manejar el estado reactivo del destinatario en el flujo de trabajo.
   * 
   * @type {BehaviorSubject<Destinatario>}
   */
  public destinatarioSujeto = new BehaviorSubject<Destinatario>({} as Destinatario);
  
  /**
   * Sujeto de comportamiento que mantiene el estado del representante.
   * 
   * @type {BehaviorSubject<Representante | null>}
   * Inicialmente se establece en `null` y puede ser actualizado con un objeto de tipo `Representante`.
   * Este observable permite suscribirse para recibir actualizaciones sobre el representante actual.
   */
  public representanteSujeto = new BehaviorSubject<Representante | null>(null);
  
  /**
   * Sujeto observable que almacena información del usuario relacionada con el uso final.
   * Este BehaviorSubject se inicializa con un objeto vacío del tipo `UsoFinal`.
   * 
   * @type {BehaviorSubject<UsoFinal>}
   */
  public usuarioSujeto = new BehaviorSubject<UsoFinal>({} as UsoFinal);

  /**
   * Constructor de la clase `Tramite230501Store`.
   * 
   * Este constructor inicializa el store utilizando el estado inicial
   * proporcionado por la función `createInitialState`. La función `super`
   * llama al constructor de la clase base para establecer el estado inicial
   * del store.
   * 
   * @remarks
   * Este método es esencial para configurar el estado inicial del store
   * y garantizar que la aplicación comience con los valores predeterminados
   * necesarios para su funcionamiento.
   */
  constructor() {
    super(createInitialState()); // Inicializa el store con el estado inicial
  }

  /**
   * Establece una propiedad del estado de pago de derechos.
   *
   * @param property - El nombre de la propiedad del estado de pago de derechos que se va a actualizar.
   * @param value - El nuevo valor para la propiedad especificada.
   * @returns void
   */
  public setPagoDerechosStateProperty(property: string, value: string): void {
    this.update((state) => ({
      ...state,
      pagoDerechosState: {
        ...state.pagoDerechosState,
        [property]: value,
      },
    }));
  }

  /**
   * Actualiza las propiedades del formulario de datos de solicitud.
   *
   * @param value - Un objeto parcial que contiene las propiedades a actualizar en datosSolicitudFormType.
   * @returns void
   */
  public setDatosSolicitudFormType(value: DatosSolicitudFormType): void {
    this.update((state) => ({
      ...state,
      datosSolicitudFormType: {
        ...state.datosSolicitudFormType,
        ...value,
      },
    }));
  }

  /**
   * Establece un valor para una propiedad específica del formulario de datos de solicitud.
   *
   * @param property - El nombre de la propiedad que se actualizará en el formulario de datos de solicitud.
   * @param valueStr - El valor en formato de cadena que se asignará a la propiedad.
   * @param valorBooleano - (Opcional) Un valor booleano que se puede asignar a la propiedad si no se proporciona `valueStr`.
   * @param valorNombre - (Opcional) Un valor numérico que se puede asignar a la propiedad si no se proporciona `valueStr` ni `valorBooleano`.
   *
   * @remarks
   * La prioridad para asignar el valor a la propiedad es la siguiente:
   * 1. `valueStr` si está definido.
   * 2. `valorNombre` si `valueStr` no está definido.
   * 3. `valorBooleano` si ninguno de los anteriores está definido.
   *
   * Actualiza el estado del formulario de datos de solicitud con el nuevo valor para la propiedad especificada.
   */
  public setDatosSolicitudFormTypeProperty(property: string, valueStr: string, valorBooleano?: boolean, valorNombre?: number): void {
    const ACTIVA_VALOR = (valueStr) ? valueStr : (valorNombre) ? valorNombre : valorBooleano;
    this.update((state) => ({
      ...state,
      datosSolicitudFormType: {
        ...state.datosSolicitudFormType,
        [property]: ACTIVA_VALOR,
      },
    }));
  }

  /**
   * Actualiza la tabla de destinatarios con nuevos destinatarios.
   *
   * @param newDestinatarios - Lista de nuevos destinatarios que se añadirán a la tabla de destinatarios.
   * @returns void
   */
  public addDestinatarioFinalTablaDatos(newDestinatarios: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...state.destinatarioFinalTablaDatos,
        ...newDestinatarios,
      ],
    }));
  }

  
  
  /**
   * Actualiza la lista de destinatarios finales en la tabla de datos.
   * 
   * Este método reemplaza cualquier destinatario existente con el mismo número 
   * de teléfono que el nuevo destinatario proporcionado. Si no existe un destinatario 
   * con el mismo número de teléfono, el nuevo destinatario se agrega a la lista.
   * 
   * @param newDestinatarios - El nuevo destinatario que se agregará o reemplazará 
   * en la lista de destinatarios finales.
   */
  public updateDestinatarioFinalTablaDatos(newDestinatarios: Destinatario): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...state.destinatarioFinalTablaDatos.filter(ele => ele.telefono !== newDestinatarios.telefono),
        newDestinatarios,
      ],
    }));
  }

  /**
   * Elimina un destinatario de la tabla de destinatarios.
   *
   * @param destinatarioFinal - El destinatario que se eliminará de la tabla de destinatarios.
   * @returns void
   */
  eliminarDestinatarioFinal(destinatarioFinal: Destinatario): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.destinatarioFinalTablaDatos.findIndex(ele => 
        Object.keys(destinatarioFinal).some(key => destinatarioFinal[key as keyof Destinatario] === ele[key as keyof Destinatario])
      );
  
      if (INDICE_A_ELIMINAR !== -1) {
        state.destinatarioFinalTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }
  
      return {
        ...state,
        destinatarioFinalTablaDatos: [...state.destinatarioFinalTablaDatos],
      };
    });
  }

  /**
   * Elimina un representante legal de la tabla de representantes.
   *
   * @param representante - El representante legal que se eliminará de la tabla de representantes.
   * @returns void
   */
  eliminarRepresentanteLegal(representante: Representante): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.representanteLegalTablaDatos.findIndex(ele => 
        Object.keys(representante).some(key => representante[key as keyof Representante] === ele[key as keyof Representante])
      );
  
      if (INDICE_A_ELIMINAR !== -1) {
        state.representanteLegalTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }
  
      return {
        ...state,
        representanteLegalTablaDatos: [...state.representanteLegalTablaDatos],
      };
    });
  }

  /**
   * Elimina un usuario final de la tabla de usuarios.
   *
   * @param usuarioFinals - El usuario final que se eliminará de la tabla de usuarios.
   * @returns void
   */
  eliminarUsuarioFinal(usuarioFinals: UsoFinal): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.usuarioTablaDatos.findIndex(ele => 
        Object.keys(usuarioFinals).some(key => usuarioFinals[key as keyof UsoFinal] === ele[key as keyof UsoFinal])
      );
  
      if (INDICE_A_ELIMINAR !== -1) {
        state.usuarioTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }
  
      return {
        ...state,
        usuarioTablaDatos: [...state.usuarioTablaDatos],
      };
    });
  }

  /**
   * Elimina un uso final de la tabla de usos finales.
   *
   * @param usoFinal - El uso final que se eliminará de la tabla de usos finales.
   * @returns void
   */
  eliminarUsoFinal(usoFinal: Uso): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.usoTablaDatos.findIndex(ele => 
        Object.keys(usoFinal).some(key => usoFinal[key as keyof Uso] === ele[key as keyof Uso])
      );
  
      if (INDICE_A_ELIMINAR !== -1) {
        state.usoTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }
  
      return {
        ...state,
        usoTablaDatos: [...state.usoTablaDatos],
      };
    });
  }

  /**
   * Actualiza la tabla de representantes legales con nuevos representantes.
   *
   * @param newRepresentante - Lista de nuevos representantes legales que se añadirán a la tabla.
   * @returns void
   */
  public updateRepresentanteLegalTablaDatos(newRepresentante: Representante): void {
    this.update((state) => ({
      ...state,
      representanteLegalTablaDatos: [
        ...state.representanteLegalTablaDatos.filter(ele => ele.telefono !== newRepresentante.telefono),
         newRepresentante],
    }));
  }

  /**
   * Agrega nuevos representantes legales a la tabla de datos existente.
   *
   * @param newRepresentante - Una lista de objetos de tipo `Representante` que se agregarán
   * a la propiedad `representanteLegalTablaDatos` del estado actual.
   *
   * Este método actualiza el estado añadiendo los nuevos representantes legales
   * a la lista existente en `representanteLegalTablaDatos`.
   */
  public addRepresentanteLegalTablaDatos(newRepresentante: Representante[]): void {
    this.update((state) => ({
      ...state,
      representanteLegalTablaDatos: [...state.representanteLegalTablaDatos, ...newRepresentante],
    }));
  }

  /**
   * Actualiza la tabla de usuarios con nuevos usuarios.
   *
   * @param newUsuario - Lista de nuevos usuarios que se añadirán a la tabla de usuarios.
   * @returns void
   */
  public updateUsuarioTablaDatos(newUsuario: UsoFinal): void {
    this.update((state) => ({
      ...state,
      usuarioTablaDatos: [
        ...state.usuarioTablaDatos.filter(ele => ele.telefono !== newUsuario.telefono),
         newUsuario
      ],
    }));
  }

    /**
   * Actualiza la tabla de usuarios con nuevos usuarios.
   *
   * @param newUsuario - Lista de nuevos usuarios que se añadirán a la tabla de usuarios.
   * @returns void
   */
    public addUsuarioTablaDatos(newUsuario: UsoFinal[]): void {
      this.update((state) => ({
        ...state,
        usuarioTablaDatos: [...state.usuarioTablaDatos, ...newUsuario],
      }));
    }

  /**
   * Actualiza la tabla de usos finales con nuevos usos finales.
   *
   * @param newUsoFinal - Lista de nuevos usos finales que se añadirán a la tabla de usos finales.
   * @returns void
   */
  public updateUsoFinalTabla(newUsoFinal: Uso[]): void {
    this.update((state) => ({
      ...state,
      usoTablaDatos: newUsoFinal,
    }));
  }
  
  /**
   * Actualiza los datos del destinatario en el estado del store.
   * 
   * @template T - Tipo genérico que puede ser un objeto o un arreglo de objetos.
   * @param data - Los datos que se utilizarán para actualizar el destinatario.
   *               Si es un arreglo, se inicializará un objeto vacío como destinatario.
   * 
   * @remarks
   * Este método utiliza un Subject (`destinatarioSujeto`) para emitir los datos actualizados
   * del destinatario. Si el parámetro `data` es un arreglo, se inicializa un objeto vacío
   * como destinatario; de lo contrario, se utiliza el objeto proporcionado como destinatario.
   */
  actualizarDatosDestinatario<T extends object | object[]>(data: T): void {
    const DATOS_ACTUALIZADOS: Destinatario = Array.isArray(data) ? {} as Destinatario : (data as Destinatario);
    this.destinatarioSujeto.next(DATOS_ACTUALIZADOS);
  }

  /**
   * Actualiza los datos del representante y emite el valor actualizado al observable `usuarioSujeto`.
   *
   * @template T - El tipo de los datos que se están actualizando, que puede ser un objeto o un arreglo de objetos.
   * @param {Object} param - El objeto de parámetros.
   * @param {T} param.data - Los datos a actualizar. Si es un arreglo, se utiliza un objeto vacío de tipo `Representante`.
   *                          De lo contrario, los datos se convierten al tipo `Representante`.
   * @returns {void} Este método no devuelve un valor.
   */
  actualizarDatoRepresentante<T extends object | object[]>({ data }: { data: T; }): void {
    const DATOS_ACTUALIZADOS: Representante = Array.isArray(data) ? {} as Representante : (data as Representante);
    this.usuarioSujeto.next(DATOS_ACTUALIZADOS);
  }

  /**
   * Actualiza los datos del usuario y emite el valor actualizado al observable `representanteSujeto`.
   *
   * @template T - El tipo de los datos que se están actualizando, que puede ser un objeto o un arreglo de objetos.
   * @param {Object} params - Los parámetros para la operación de actualización.
   * @param {T} params.data - Los datos a actualizar. Si es un arreglo, se utiliza un objeto vacío de tipo `UsoFinal`.
   * 
   * @remarks
   * Este método determina si los datos proporcionados son un arreglo. Si lo son, se crea un objeto vacío de tipo `UsoFinal`.
   * De lo contrario, los datos proporcionados se convierten al tipo `UsoFinal`. El valor resultante se emite
   * al observable `representanteSujeto`.
   */
  actualizarDatoUsuario<T extends object | object[]>({ data }: { data: T; }): void {
    const DATOS_ACTUALIZADOS: UsoFinal = Array.isArray(data) ? {} as UsoFinal : (data as UsoFinal);
    this.representanteSujeto.next(DATOS_ACTUALIZADOS);
  }

   /**
   * Establece el estado de validación del formulario en el almacén.
   * 
   * @param {Object} formaValida - Un objeto donde las claves son los nombres de los campos del formulario y los valores son booleanos que indican si el campo es válido o no.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
   setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }
}
