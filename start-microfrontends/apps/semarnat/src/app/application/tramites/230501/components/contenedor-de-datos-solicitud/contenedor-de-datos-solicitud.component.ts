import { ActivatedRoute, Router } from '@angular/router';
import { COMPOSICION_TABLA, DATOS_ESPECIFICOS_VALIDO_CONTROL, FECHA_FACTURA, INFO_GENERAL_VALIDO_CONTROL, NUMERO_CAS_TABLA, OPCIONES_DE_BOTON_DE_RADIO_CONTENEDOR } from '../../constantes/materiales-peligrosos.enum';
import { Catalogo, ConsultaioQuery, InputFechaComponent, SeccionLibQuery, SeccionLibState, SeccionLibStore, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent,InputCheckComponent,InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComposicionMaterial, InputFecha, TablaNumeroCasType } from '../../models/materiales-peligrosos.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs'
import { Tramite230501State, Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
import { CommonModule } from '@angular/common';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';

/**
 * Importa los módulos necesarios para el componente, incluyendo Angular Core, Reactive Forms,
 * y componentes personalizados como CatalogoSelectComponent, TablaDinamicaComponent, InputFechaComponent,
 * InputCheckComponent e InputRadioComponent.
 */
@Component({
  selector: 'app-contenedor-de-datos-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, InputFechaComponent, InputCheckComponent, InputRadioComponent, TooltipModule],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
  providers: [MaterialesPeligrososService],

})
/**
 * Componente Angular que gestiona la lógica y el estado relacionado con los datos de la solicitud
 * en el trámite 230501. Este componente interactúa con el estado global de la aplicación a través
 * de `Tramite230501Store` y `SeccionLibStore`, y maneja eventos relacionados con la selección de datos
 * en tablas y la validación de formularios.
 * 
 * @implements {OnInit} - Implementa el ciclo de vida `OnInit` para inicializar el estado del componente.
 * @implements {OnDestroy} - Implementa el ciclo de vida `OnDestroy` para limpiar recursos al destruir el componente.
 * 
 * @class
 */
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * @private
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo la limpieza de suscripciones
   * y otros recursos para evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @public
   * @type {Tramite230501State}
   * @description Representa el estado actual del trámite 230501.
   */
  public tramiteState!: Tramite230501State;
  /* @property {SeccionLibState} seccion
 * @description Representa el estado de la sección en el componente. 
 * Se utiliza para manejar y almacenar datos relacionados con la sección específica.
 */
  private seccion!: SeccionLibState;
  /**
   * Formulario reactivo que contiene los datos de la solicitud.
   * Este formulario se utiliza para gestionar y validar la información
   * ingresada por el usuario en el componente.
   */
  public datosSolicitudForm!: FormGroup;
  /**
   * Representa la fecha de la factura como una entrada de tipo `InputFecha`.
   * Este valor se inicializa con la constante `FECHA_FACTURA`.
   * 
   * @type {InputFecha}
   */
  public fechaDeLaFacturaInput: InputFecha = FECHA_FACTURA;

  /**
   * Lista que contiene las fracciones arancelarias disponibles.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Este arreglo almacena objetos del tipo `Catalogo` que representan
   * las fracciones arancelarias asociadas a un trámite específico.
   * Puede ser utilizado para mostrar opciones en un componente o para
   * realizar validaciones relacionadas con las fracciones arancelarias.
   */
  public listaDeFraccionesArancelarias: Catalogo[] = [];
  /**
   * Lista que contiene los números de catálogo (CAS) asociados.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Esta lista se utiliza para almacenar y gestionar los números de catálogo
   * relacionados con la solicitud. Cada elemento de la lista es de tipo `Catalogo`.
   */
  public listaDeNumeroCas: Catalogo[] = [];
  /**
   * Lista que contiene los estados físicos disponibles.
   * 
   * Esta lista se utiliza para almacenar los elementos del catálogo
   * relacionados con los estados físicos, los cuales pueden ser utilizados
   * en la aplicación para mostrar opciones o realizar validaciones.
   */
  public listaDeEstadoFisico: Catalogo[] = [];
  /**
   * Lista que contiene las unidades de medida disponibles.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Este arreglo almacena objetos del tipo `Catalogo` que representan
   * las diferentes unidades de medida que pueden ser utilizadas en el sistema.
   */
  public listaDeUnidadMedida: Catalogo[] = [];

  /**
   * Define el tipo de selección que se utilizará en la tabla.
   * En este caso, se utiliza un tipo de selección basado en casillas de verificación (CHECKBOX).
   */
  public tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración para el número de casos en la tabla.
   * Esta propiedad utiliza la constante `NUMERO_CAS_TABLA` para definir
   * el número de casos que se mostrarán en la tabla.
   */
  public numeroCasTablaConfiguracion = NUMERO_CAS_TABLA;
  /**
   * Lista que almacena los números de CAS seleccionados.
   * 
   * @type {TablaNumeroCasType[]}
   * @remarks
   * Este arreglo se utiliza para gestionar los números de CAS seleccionados
   * dentro del componente. Cada elemento de la lista corresponde a un objeto
   * del tipo `TablaNumeroCasType`.
   */
  public numeroCasSellecionLista: TablaNumeroCasType[] = [];

  /**
   * Configuración de la tabla utilizada en el componente.
   * 
   * Esta propiedad define la composición y configuración de la tabla
   * que se utiliza para mostrar los datos en el componente. 
   * Se basa en la constante `COMPOSICION_TABLA`.
   */
  public composicionTablaConfiguracion = COMPOSICION_TABLA;
  /**
   * Lista que almacena la composición de materiales seleccionados.
   * 
   * Esta propiedad se utiliza para gestionar y almacenar los elementos 
   * seleccionados relacionados con la composición de materiales en el 
   * contexto de la aplicación.
   */
  public composicionSeleccionLista: ComposicionMaterial[] = [];

  /**
   * @method radioOpcions
   * @description Contiene las opciones para el botón de radio en el contenedor de datos de la solicitud.
   * Estas opciones son definidas por la constante `OPCIONES_DE_BOTON_DE_RADIO_CONTENEDOR`.
   */
  radioOpcions = OPCIONES_DE_BOTON_DE_RADIO_CONTENEDOR;
  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente `ContenedorDeDatosSolicitudComponent`.
   * 
   * @param tramite230501Query Consulta de estado para el trámite 230501.
   * @param tramite230501Store Almacén de estado para el trámite 230501.
   * @param materialesPeligrososService Servicio para la gestión de materiales peligrosos.
   * @param seccionStore Almacén de estado para las secciones.
   * @param seccionQuery Consulta de estado para las secciones.
   * @param fb Constructor de formularios reactivos.
   * @param router Servicio de enrutamiento de Angular.
   * @param activatedRoute Información sobre la ruta activa.
   * @param consultaQuery Consulta de estado para la consulta de información.
   * 
   * Inicializa el componente y realiza la carga de catálogos necesarios para el formulario,
   * utilizando el servicio de materiales peligrosos para obtener listas de fracciones arancelarias,
   * números CAS, estados físicos y unidades de medida.
   */
  constructor(private tramite230501Query: Tramite230501Query,
    private tramite230501Store: Tramite230501Store, public materialesPeligrososService: MaterialesPeligrososService,
    private seccionStore: SeccionLibStore, private seccionQuery: SeccionLibQuery,
    public fb: FormBuilder, public router: Router, public activatedRoute: ActivatedRoute, private consultaQuery: ConsultaioQuery
  ) {
    this.materialesPeligrososService.obtenerRespuestaPorUrl(this, 'listaDeFraccionesArancelarias', '/230501/fraccionArancelaria.json');
    this.materialesPeligrososService.obtenerRespuestaPorUrl(this, 'listaDeNumeroCas', '/230501/numeroCas.json');
    this.materialesPeligrososService.obtenerRespuestaPorUrl(this, 'listaDeEstadoFisico', '/230501/estadoFisico.json');
    this.materialesPeligrososService.obtenerRespuestaPorUrl(this, 'listaDeUnidadMedida', '/230501/unidadDeMedida.json'); 
  }


  /**
   * @method
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los estados de los queries para actualizar el estado del trámite y del formulario,
   * inicializa el estado del formulario y valida la pestaña actual.
   * 
   * @remarks
   * - Suscribe a `tramite230501Query.selectTramiteState$` para mantener actualizado el estado del trámite.
   * - Suscribe a `consultaQuery.selectConsultaioState$` para inicializar el formulario y establecer si es solo lectura.
   * - Llama a `pestanaValidar()` para validar la pestaña activa.
   * 
   * @see https://angular.io/guide/lifecycle-hooks
   */
  ngOnInit(): void {
    this.tramite230501Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      ).subscribe();
         this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.inicializarEstadoFormulario();
          this.esFormularioSoloLectura = seccionState.readonly;
       
        })
      )
      .subscribe();
    this.pestanaValidar();

  }


  /**
   * Inicializa el estado del formulario de datos de solicitud.
   * 
   * Este método verifica si el formulario `datosSolicitudForm` ha sido creado. 
   * Si no existe, se llama al método `crearDatosSolicitudForm` para inicializarlo.
   * Además, si el formulario está configurado como de solo lectura (`esFormularioSoloLectura`),
   * se deshabilita para evitar modificaciones.
   * 
   * Uso:
   * - Este método debe ser llamado para garantizar que el formulario esté correctamente
   *   inicializado antes de interactuar con él.
   * 
   * Condiciones:
   * - Si `datosSolicitudForm` no está definido, se crea un nuevo formulario.
   * - Si `esFormularioSoloLectura` es verdadero, el formulario se deshabilita.
   */
  inicializarEstadoFormulario(): void {
    if (!this.datosSolicitudForm) {
      this.crearDatosSolicitudForm();
    }
    if (this.esFormularioSoloLectura) {
      this.datosSolicitudForm.disable();
    }
  }
  
  /**
* Establece el estado de validación del formulario de destinatario.
* 
* @param valida - Un valor booleano que indica si el formulario de datos del destinatario es válido.
*/
  setFormValida(valida: boolean): void {
    this.tramite230501Store.setFormValida({ datosSolicitudForm: valida });
  }

  /**
 * Crea y configura el formulario `datosSolicitudForm` con los campos necesarios
 * para capturar los datos de la solicitud. Inicializa los valores de los campos
 * utilizando el estado actual de `tramiteState` y configura las suscripciones
 * para manejar los cambios en los valores del formulario.
 *
 * - Configura un observable para detectar cambios en los valores del formulario
 *   y actualiza el estado en el store `tramite230501Store`.
 * - Configura una suscripción específica para el campo `cantidad` que convierte
 *   su valor numérico a letras y actualiza el campo `cantidadLetra`.
 *
 * @remarks
 * Este método utiliza `FormBuilder` para crear el formulario reactivo y
 * `RxJS` para manejar los cambios en los valores del formulario.
 */
  crearDatosSolicitudForm(): void {
 this.datosSolicitudForm = this.fb.group({
  tratadoRotterdam: [{ value: this.tramiteState?.datosSolicitudFormType?.tratadoRotterdam || false, disabled: false }],
  listadoNacional: [{ value: this.tramiteState?.datosSolicitudFormType?.listadoNacional || false, disabled: false }],
  fraccionArancelaria: [{ value: this.tramiteState?.datosSolicitudFormType?.fraccionArancelaria || '', disabled: false }, [Validators.required]],
  descripcionFraccion: [{ value: this.tramiteState?.datosSolicitudFormType?.descripcionFraccion || '', disabled: true }],
  convenioMinamata: [{ value: this.tramiteState?.datosSolicitudFormType?.convenioMinamata || false, disabled: false }],
  numeroCas: [{ value: this.tramiteState?.datosSolicitudFormType?.numeroCas || '', disabled: false }, [Validators.required]],
  descripcionNoArancelaria: [{ value: this.tramiteState?.datosSolicitudFormType?.descripcionNoArancelaria || '', disabled: true }],
  nombreQuimico: [{ value: this.tramiteState?.datosSolicitudFormType?.nombreQuimico || '', disabled: true }],
  nombreComun: [{ value: this.tramiteState?.datosSolicitudFormType?.nombreComun || '', disabled: false }, [Validators.required]],
  nombreComercial: [{ value: this.tramiteState?.datosSolicitudFormType?.nombreComercial || '', disabled: false }, [Validators.required]],
  estadoFisico: [{ value: this.tramiteState?.datosSolicitudFormType?.estadoFisico || '', disabled: false }, [Validators.required]],
  cantidad: [{ value: this.tramiteState?.datosSolicitudFormType?.cantidad || null, disabled: false }, [Validators.required]],
  cantidadLetra: [{ value: this.tramiteState?.datosSolicitudFormType?.cantidadLetra || '', disabled: true }],
  unidadMedida: [{ value: this.tramiteState?.datosSolicitudFormType?.unidadMedida || '', disabled: false }, [Validators.required]],
  licenciaSanitaria: [{ value: this.tramiteState?.datosSolicitudFormType?.licenciaSanitaria || '', disabled: false }],
  usoEspecifico: [{ value: this.tramiteState?.datosSolicitudFormType?.usoEspecifico || '', disabled: false }, [Validators.required]],
  fechaExportacion: [{ value: this.tramiteState?.datosSolicitudFormType?.fechaExportacion || '', disabled: false }],
  modoCantidad: [{ value: this.tramiteState?.datosSolicitudFormType?.modoCantidad || false, disabled: false }]
});

  }

  /**
   * Maneja el cambio de tiempo y actualiza los valores relacionados en el formulario y la tienda.
   * 
   * @param value - El valor seleccionado, que puede ser un string o un número.
   * 
   * @remarks
   * Convierte el valor numérico a su representación en letras utilizando el servicio `materialesPeligrososService`.
   * Luego, actualiza el campo `cantidadLetra` en el formulario y sincroniza el valor en la tienda.
   * 
   * @comando
   * - Convierte el número a letras si el valor es válido.
   * - Actualiza el formulario y la tienda con el valor convertido.
   */
  onCambioDeTiempo(value: string | number): void {
    const VALOR_SELECCIONADO = value as string;
    if (VALOR_SELECCIONADO) {
      const CANTIDAD_LETRA = this.materialesPeligrososService.convertirNumeroALetras(typeof VALOR_SELECCIONADO === 'number' ? VALOR_SELECCIONADO : parseFloat(VALOR_SELECCIONADO));
      this.datosSolicitudForm.get('cantidadLetra')?.setValue(CANTIDAD_LETRA);
      this.actualizarElValorDeLaTienda('cantidadLetra', 'text');
    }
  }

  /**
   * Método que valida si la pestaña actual del formulario es válida.
   * 
   * Se considera válida si:
   * - Los campos específicos del formulario pasan la validación (`isDatosEspecificosValid()`).
   * - Existen elementos en la tabla de números CAS.
   * - Existen elementos en la tabla de composición.
   * 
   * En base a esa validación, se actualiza el estado del formulario mediante `setFormValida`.
   */
  pestanaValidar(): void {
    const IS_VALIDA = this.isDatosEspecificosValid() &&
      this.tramiteState.numeroCasTablaDatos.length &&
      this.tramiteState.composicionTablaDatos.length;
    this.setFormValida(IS_VALIDA ? true : false);
  }

  /**
 * Checks if the specified CONTROLS in the form are valid.
 * 
 * @returns {boolean} True if all specified CONTROLS are valid, otherwise false.
 */
  areSpecificControlsValid(): boolean {
    const CONTROLS_TO_CHECK = INFO_GENERAL_VALIDO_CONTROL;
    return CONTROLS_TO_CHECK.every(controlName => {
      const CONTROLS = this.datosSolicitudForm.get(controlName);
      return CONTROLS && CONTROLS.valid;
    });
  }

  /**
   * Verifica si todos los controles específicos de datos en el formulario son válidos.
   *
   * @returns {boolean} - Devuelve `true` si todos los controles especificados en `DATOS_ESPECIFICOS_VALIDO_CONTROL` 
   * son válidos, de lo contrario devuelve `false`.
   */
  isDatosEspecificosValid(): boolean {
    const CONTROLS_TO_CHECK = DATOS_ESPECIFICOS_VALIDO_CONTROL;
    return CONTROLS_TO_CHECK.every(controlName => {
      const CONTROLS = this.datosSolicitudForm?.get(controlName);
      return CONTROLS && CONTROLS.valid;
    });
  }

  /**
   * Actualiza el valor de una propiedad en la tienda según el tipo de dato especificado.
   *
   * @param property - El nombre de la propiedad que se desea actualizar en el formulario.
   * @param valorCode - El tipo de dato de la propiedad. Puede ser 'text', 'boolean' o 'number'.
   *
   * - Si `valorCode` es 'text', se actualiza el valor como texto.
   * - Si `valorCode` es 'boolean', se actualiza el valor como booleano.
   * - Si `valorCode` es 'number', se actualiza el valor como número.
   *
   * Utiliza el valor actual del formulario para establecer el nuevo valor en la tienda.
   */
  actualizarElValorDeLaTienda(property: string, valorCode: string): void {
    const ACTIVA_VALOR = this.datosSolicitudForm.get(property)?.value;
    if (valorCode === 'text') {
      this.tramite230501Store.setDatosSolicitudFormTypeProperty(property, ACTIVA_VALOR, undefined, undefined);
    } else if (valorCode === 'boolean') {
      this.tramite230501Store.setDatosSolicitudFormTypeProperty(property, '', ACTIVA_VALOR, undefined);
    } else if (valorCode === 'number') {
      this.tramite230501Store.setDatosSolicitudFormTypeProperty(property, '', undefined, ACTIVA_VALOR);
    }
    this.pestanaValidar()
  }


  /**
   * Maneja el evento cuando la fecha es cambiada.
   * 
   * @param fecha - La nueva fecha seleccionada en formato de cadena.
   * Si se proporciona una fecha válida, actualiza el formulario `datosSolicitudForm`
   * con el valor de la fecha de exportación.
   */
  onFechaCambiada(fecha: string): void {
    if (fecha) {
      this.datosSolicitudForm.patchValue({ fechaExportacion: fecha });
      this.actualizarElValorDeLaTienda('fechaExportacion', 'text');
    }
  }

  /**
   * Método que actualiza el valor del estado físico en la tienda.
   * Este método establece un valor específico para la clave 'estadoFisico' 
   * en la tienda utilizando el tipo de dato 'text'.
   */
  estadoFisicoSeleccione(): void {
    this.actualizarElValorDeLaTienda('estadoFisico', 'text');
  }

  /**
   * Método que actualiza el valor de la tienda para la unidad de medida.
   * Este método establece un nuevo valor para la clave 'unidadMedida' en la tienda,
   * utilizando el valor proporcionado como 'text'.
   */
  unidadMedidaSeleccione(): void {
    this.actualizarElValorDeLaTienda('unidadMedida', 'text');
  }

  /**
   * Agrega un nuevo número CAS a la tabla de datos.
   * 
   * Este método obtiene los valores del formulario `datosSolicitudForm` 
   * para los campos `numeroCas`, `descripcionNoArancelaria` y `nombreQuimico`, 
   * y los utiliza para crear un nuevo objeto de tipo `TablaNumeroCasType`. 
   * Luego, este objeto se agrega al arreglo `numeroCasTablaDatos`.
   * 
   * @remarks
   * - El campo `constanciaCisen` se inicializa como una cadena vacía.
   * - Asegúrese de que los valores del formulario sean válidos antes de llamar a este método.
   */
  agregarNumero(): void {
    const NUMERO_CAS = this.datosSolicitudForm.get('numeroCas')?.value;
    const DESCRIPCION_NO_ARANCELARIA = this.datosSolicitudForm.get('descripcionNoArancelaria')?.value;
    const NOMBRE_QUMICO = this.datosSolicitudForm.get('nombreQuimico')?.value;
    if (!NUMERO_CAS || !DESCRIPCION_NO_ARANCELARIA || !NOMBRE_QUMICO) {
      return;
    }
    const NUMERO_CAS_TABLA: TablaNumeroCasType = {
      numeroCas: NUMERO_CAS,
      descripcionNoArancelaria: DESCRIPCION_NO_ARANCELARIA,
      nombreQuimico: NOMBRE_QUMICO,
      constanciaCisen: ''
    };
    this.tramite230501Store.update((state) => ({
      ...state,
      numeroCasTablaDatos: [...state.numeroCasTablaDatos, NUMERO_CAS_TABLA],
    }));
    this.datosSolicitudForm.reset();
    this.actualizarElValorDeLaTienda('fraccionArancelaria', 'text');
    this.actualizarElValorDeLaTienda('descripcionNoArancelaria', 'text');
    this.actualizarElValorDeLaTienda('numeroCas', 'text');
    this.actualizarElValorDeLaTienda('descripcionFraccion', 'text');
    this.actualizarElValorDeLaTienda('nombreQuimico', 'text');
    this.pestanaValidar();
  }

  /**
   * Elimina los elementos seleccionados de la lista `numeroCasSellecionLista` 
   * de la tabla de datos `numeroCasTablaDatos` en el estado del store.
   * 
   * Si no hay elementos seleccionados en `numeroCasSellecionLista`, 
   * la función termina sin realizar ninguna acción.
   * 
   * Filtra los elementos de `numeroCasTablaDatos` que no coincidan con 
   * los elementos seleccionados en `numeroCasSellecionLista` y actualiza 
   * el estado del store con la lista filtrada.
   */
  eliminarNumeroCas(): void {
    if (this.numeroCasSellecionLista.length === 0) {
      return;
    }
    const LISTA_FILTRADA = this.tramiteState.numeroCasTablaDatos.filter((elemento) => {
      return !this.numeroCasSellecionLista.some((elementoSeleccionado) => elementoSeleccionado.numeroCas === elemento.numeroCas);
    });
    if (LISTA_FILTRADA) {
      this.tramite230501Store.update((state) => ({
        ...state,
        numeroCasTablaDatos: LISTA_FILTRADA,
      }));
      this.numeroCasSellecionLista = [];
      this.pestanaValidar();
    }
  }

  /**
   * Método que actualiza el campo 'descripcionFraccion' en el formulario 'datosSolicitudForm'
   * basado en el valor del campo 'fraccionArancelaria'.
   * 
   * Este método toma el valor actual del campo 'fraccionArancelaria', lo concatena con 
   * un texto adicional ("Test de fraccion") y establece el resultado en el campo 
   * 'descripcionFraccion' del formulario.
   * 
   * @returns {void} No retorna ningún valor.
   */
  fraccionArancelariaSeleccione(): void {
    const DESCRIPCION_FRACCION = `${this.datosSolicitudForm.get('fraccionArancelaria')?.value} Test de fraccion`;
    this.datosSolicitudForm.get('descripcionFraccion')?.setValue(DESCRIPCION_FRACCION);
    this.actualizarElValorDeLaTienda('fraccionArancelaria', 'text');
    this.actualizarElValorDeLaTienda('descripcionFraccion', 'text');
  }

  /**
   * Método que actualiza los campos del formulario relacionados con el número CAS.
   * 
   * Obtiene el valor del campo 'numeroCas' del formulario y lo utiliza para establecer
   * los valores de los campos 'descripcionNoArancelaria' y 'nombreQuimico' con un formato
   * que incluye el número CAS seguido de un texto descriptivo.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  numeroCasSeleccione(): void {
    const NUMERO_CAS = this.datosSolicitudForm.get('numeroCas')?.value;
    this.datosSolicitudForm.get('descripcionNoArancelaria')?.setValue(`${NUMERO_CAS} Descripcion No Arancelaria`);
    this.datosSolicitudForm.get('nombreQuimico')?.setValue(`${NUMERO_CAS} Nombre Quimico`);
    this.actualizarElValorDeLaTienda('numeroCas', 'text');
    this.actualizarElValorDeLaTienda('descripcionNoArancelaria', 'text');
    this.actualizarElValorDeLaTienda('nombreQuimico', 'text');
  }

  /**
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   */
  datasolicituActualizar(): void {
    const SECCION: number = 1;
    const FORMAS_VALIDADAS = this.seccion.formaValida ? this.seccion.formaValida : [];
    const ES_VALIDO_EL_FORM = this.esFormValido();
    if (ES_VALIDO_EL_FORM) {
      FORMAS_VALIDADAS[SECCION] = true;
      this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
    } else {
      FORMAS_VALIDADAS[SECCION] = false;
      this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
    }
  }

  /**
 * Verifica si el formulario es válido.
 * 
 * Recorre todos los controles del formulario y verifica si alguno de ellos
 * está habilitado e inválido. Si encuentra un control que cumple con estas
 * condiciones, retorna `false`. Si todos los controles habilitados son válidos,
 * retorna `true`.
 * 
 * @returns {boolean} `true` si todos los controles habilitados son válidos, 
 *                    `false` si al menos uno de los controles habilitados es inválido.
 */
  esFormValido(): boolean {
    if (this.tramiteState && (this.tramiteState.numeroCasTablaDatos?.length
      && this.tramiteState.composicionTablaDatos?.length)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Navega a la ruta relativa '../composicion' desde la ruta actual.
   * 
   * Este método utiliza el enrutador Angular para cambiar a la vista de composición
   * manteniendo el contexto de la ruta activa actual.
   */
  agregarcomposicion(): void {
    this.router.navigate(['../composicion'], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Elimina elementos seleccionados de la lista de composición.
   * 
   * Este método verifica si hay elementos seleccionados en la lista `composicionSeleccionLista`.
   * Si no hay elementos seleccionados, simplemente retorna sin realizar ninguna acción.
   * 
   * Luego, filtra los elementos de `composicionTablaDatos` para excluir aquellos que coincidan
   * con los elementos seleccionados en `composicionSeleccionLista`. Si la lista filtrada no está vacía,
   * actualiza el estado de la tienda `tramite230501Store` con la nueva lista filtrada.
   * 
   * @returns {void} No devuelve ningún valor.
   */
  eliminarComposicion(): void {
    if (this.composicionSeleccionLista.length === 0) {
      return;
    }
    const LISTA_FILTRADA = this.tramiteState.composicionTablaDatos.filter((elemento) => {
      return !this.composicionSeleccionLista.some((elementoSeleccionado) => elementoSeleccionado.componente === elemento.componente);
    });
    if (LISTA_FILTRADA) {
      this.tramite230501Store.update((state) => ({
        ...state,
        composicionTablaDatos: LISTA_FILTRADA,
      }));
      this.composicionSeleccionLista = [];
      this.pestanaValidar();
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
