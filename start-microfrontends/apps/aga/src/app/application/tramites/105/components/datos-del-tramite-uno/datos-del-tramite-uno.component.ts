import { Catalogo, ConsultaioQuery, REGEX_LLAVE_DE_PAGO_DE_DERECHO, TablaDinamicaComponent, TablaSeleccion, TableComponent, TituloComponent,  Notificacion, TipoNotificacionEnum, CategoriaMensaje } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ACUSE_DATOS, AgentestableDatos, FRACCIONES_TABLEDOS_TABLE_BODY_DATA, OPCIONES_DE_BOTON_DE_RADIO, tableDatos } from '../../constantes/datos-del-tramite.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud105State, Tramite105Store, } from '../../estados/tramite105.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { InputCheckComponent } from '@libs/shared/data-access-user/src/tramites/components/input-check/input-check.component';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { InvoCarService } from '../../services/invocar.service';
import { Tramite105Query } from '../../estados/tramite105.query';
import mercanciaTable from '@libs/shared/theme/assets/json/105/mercancia-table.json';
interface TableBodyData {
  tbodyData: string[];
}
@Component({
  selector: 'app-datos-del-tramite-uno',
  standalone: true,
  imports: [
    CommonModule,
    InputRadioComponent,
    TableComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputCheckComponent,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
  templateUrl: './datos-del-tramite-uno.component.html',
  styleUrl: './datos-del-tramite-uno.component.scss',
})


export class DatosDelTramiteUnoComponent implements OnInit, OnDestroy {
  /**
   * Valida el formulario principal `datosDelTramite` y actualiza el estado de validez en el store.
   *
   * - Marca todos los campos del formulario como tocados para mostrar los errores de validación.
   * - Si el formulario es inválido, establece el estado de validez en `false` en el store.
   * - Si el formulario es válido, establece el estado de validez en `true` en el store.
   *
   * @returns {any} No retorna ningún valor específico, solo actualiza el estado de validez.
   */
validarFormularios(): any {
    this.datosDelTramite.markAllAsTouched(); 
    this.store.setValidFormularioUno(this.datosDelTramite.invalid ? false : true);
}
  /**
   * Limita el campo codigoPostal a 12 dígitos y actualiza el valor en el formulario.
   */
  onCodigoPostalInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value.length > 12) {
      input.value = input.value.slice(0, 12);
    }
    this.datosDelTramite.get('codigoPostal')?.setValue(input.value);
    this.setValoresStore(this.datosDelTramite, 'false', 'setValidFormularioUno');
  }

  /**
   * Constructor de la clase DatosDelTramiteUnoComponent.
   * 
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param invoCarService - Servicio para gestionar datos relacionados con el trámite.
   * @param store - Almacén para gestionar el estado de la solicitud.
   * @param query - Consulta para obtener datos del estado de la solicitud.
   */

  /**
    * Indica si el formulario está en modo solo lectura.
    * Cuando es `true`, los campos del formulario no se pueden editar.
    */
  esFormularioSoloLectura: boolean = false;
  /**
    * Indica si el formulario está en modo solo lectura.
    * Cuando es `true`, los campos del formulario no se pueden editar.
    */
  esFormularioSoloLecturaActualizar: boolean = false;
  constructor(private fb: FormBuilder, private invoCarService: InvoCarService, private store: Tramite105Store,
    private query: Tramite105Query, private consultaioQuery: ConsultaioQuery) {
    /**
      * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
      *
      * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
      * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
      * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
      */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.esFormularioSoloLecturaActualizar = seccionState.update;
          if (seccionState.update) {
            this.fetchTableDummyJson();
          }
        })
      )
      .subscribe();
  }

  /**
   * Formulario reactivo para agregar mercancías.
   */
  public agregarForm!: FormGroup;

  /**
   * Estado del modal (abierto o cerrado).
   */
  public modal: string = 'modal';

  /**
   * Formulario reactivo para los datos del trámite.
   */
  public datosDelTramite!: FormGroup;

  /**
   * Formulario reactivo para la fracción arancelaria.
   */
  fraccionForm!: FormGroup;
  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud105State;

  /**
   * Catálogo de países.
   */
  pais: Catalogo[] = [];

  /**
   * Catálogo de entidades federativas.
   */
  entidadFederativa: Catalogo[] = [];


  /**
   * Catálogo de municipios o delegaciones.
   */
  municipioDelegacion: Catalogo[] = [];

  /**
   * Catálogo de colonias.
   */
  colonia: Catalogo[] = [];

  /**
   * Valor seleccionado del radio.
   */
  valorSeleccionado!: string;
  valorSeleccionado1!: string;
  valorSeleccionado2!: string;

  /**
   * Catálogo de aduanas.
   */
  aduana: Catalogo[] = [];

  /**
   * Catálogo de fracciones arancelarias.
   */
  fraccionArancelaria: Catalogo[] = [];

  /**
   * Notificador para destruir observables al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos de la tabla de mercancías.
   */
  public getMercanciaTableData = mercanciaTable;

  /**
   * Encabezado de la tabla de mercancías.
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de mercancías.
   */
  public mercanciaBodyData: TableBodyData[] = [];

  /**
   * Indica si la selección está deshabilitarSeleccion.
   */
  deshabilitarSeleccion: boolean = true;

  /**
   * Referencia al elemento del modal en la plantilla.
   */
  @ViewChild('modal') modalElement!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal') closeModal1!: ElementRef;

  /**
     * Opciones de botón de radio.
     */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
     * Configuración de la tabla utilizada en el componente para mostrar los datos del acuse.
     * 
     * @remarks
     * Esta propiedad almacena la configuración de columnas, formato y otros parámetros
     * necesarios para renderizar la tabla de datos del acuse en la interfaz de usuario.
     * 
     * @see ACUSE_DATOS para la definición de la configuración.
     */
  public configuracionTabla = ACUSE_DATOS;

  /**
   * Un arreglo de objetos `tableDatos` que contiene los datos para la tabla.
   * Estos datos se inicializan como un arreglo vacío.
   */
  public mercanciTablaDatos: tableDatos[] = [];


  /**
   * Representa el tipo de selección de checkbox utilizado en el componente.
   * Esto se establece al valor de `TablaSeleccion.CHECKBOX`.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Suscripción activa.
   */
  subscription!: Subscription;


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a varios observables para obtener datos relacionados con la solicitud, 
   *   como país, entidad federativa, municipio o delegación, colonia, aduana y fracción arancelaria.
   * - Configura los datos obtenidos en propiedades del componente para su uso en la interfaz de usuario.
   * - Inicializa el formulario reactivo `agregarForm` con validaciones requeridas para ciertos campos.
   * - Administra las suscripciones a los observables para evitar fugas de memoria al destruir el componente.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.obtenerMercancia();
    this.crearDatosDelTramiteForm();
    this.getPais();
    this.getAduana();
    this.getEntidadFederativa();
    this.getMunicipioDelegacion();
    this.getColonia();
    this.getFraccionArancelariae();
    this.crearFormularioAgregar();
    if (this.esFormularioSoloLecturaActualizar) {
      this.crearDatosDelTramiteForm()
      this.alternarControles(true);
      this.esFormularioSoloLectura = false;
      this.deshabilitarSeleccion = false;
    }
  }
  /**
     * Evalúa si se debe inicializar o cargar datos en el formulario.  
     * Además, obtiene la información del catálogo de mercancía.
     */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearDatosDelTramiteForm();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosDelTramite.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosDelTramite.enable();
    }
  }

  /**
   * Crea e inicializa el formulario reactivo `agregarForm` con los campos necesarios
   * para agregar un nuevo trámite. Los campos incluyen:
   * - `fraccionArancelaria`: Campo requerido para la fracción arancelaria.
   * - `descripcion`: Campo requerido para la descripción.
   * - `descripcionAdicional`: Campo opcional para información adicional.
   *
   * Utiliza el FormBuilder (`fb`) para construir el formulario y asigna las validaciones correspondientes.
   */
  crearFormularioAgregar(): void {
    this.agregarForm = this.fb.group({
      fraccionArancelaria: [''],
      descripcion: [{ value: '', disabled: true }],
      descripcionAdicional: ['']
    });
  }

  /**
   * @method crearDatosDelTramiteForm
   * @description Crea y configura el formulario reactivo `datosDelTramite` con los controles necesarios
   *              para capturar y gestionar los datos relacionados con el trámite. Los valores iniciales
   *              de los controles se establecen a partir del estado actual de `solicitudState`.
   * 
   * @remarks
   * Este método utiliza `FormBuilder` para construir un formulario reactivo con validaciones y valores
   * iniciales. Algunos campos están deshabilitados y otros tienen validaciones requeridas.
   * 
   * @example
   * // Ejemplo de uso:
   * this.crearDatosDelTramiteForm();
   * 
   * @property {FormGroup} datosDelTramite - El formulario reactivo creado por este método.
   * 
   * @fields
   * - **Regímenes**: Controles para los diferentes regímenes como importación, exportación, etc.
   * - **Servicios a terceros**: Control único para capturar si aplica o no.
   * - **Distribución de gas**: Control único para capturar si aplica o no.
   * - **Industria automotriz**: Control único para capturar si aplica o no.
   * - **Ubicación**: Controles relacionados con la dirección y ubicación del trámite.
   * - **Aduanas**: Control requerido para capturar la aduana asociada.
   * 
   * @throws No aplica.
   */
  crearDatosDelTramiteForm(): void {
    this.datosDelTramite = this.fb.group({
      // Regímenes
      importacion: [this.solicitudState?.importacion],
      exportacion: [this.solicitudState?.exportacion],
      depositoFiscalGas: [this.solicitudState?.depositoFiscalGas],
      depositoFiscalVehiculos: [this.solicitudState?.depositoFiscalVehiculos],
      distribucionGasSi: [this.solicitudState?.distribucionGas],
      distribucionGasNo: [this.solicitudState?.distribucionGas],
      serviciosTercerosSi: [this.solicitudState?.serviciosTerceros],
      serviciosTercerosNo: [this.solicitudState?.serviciosTerceros],
      industriaAutomotrizSi: [this.solicitudState?.industriaAutomotriz],
      industriaAutomotrizNo: [this.solicitudState?.industriaAutomotriz],
      // Servicios a terceros (single value, use one control)
      serviciosTerceros: [this.solicitudState?.serviciosTerceros],

      // Distribución de gas (single value)
      distribucionGas: [this.solicitudState?.distribucionGas],

      // Industria automotriz (single value)
      industriaAutomotriz: [this.solicitudState?.industriaAutomotriz],

      // Ubicación
      domicilio: [this.solicitudState?.domicilio],
      ubicacion: [this.solicitudState?.ubicacion],

      // Inputsimportacion
      pais: [{ value: this.solicitudState?.pais, disabled: true }, Validators.required],
      codigoPostal: [{ value: this.solicitudState?.codigoPostal, disabled: true }, Validators.required],
      entidadFederativa: [{ value: this.solicitudState?.entidadFederativa, disabled: true }],
      municipioDelegacion: [{ value: this.solicitudState?.municipioDelegacion, disabled: true }],
      localidad: [{ value: this.solicitudState?.localidad, disabled: true }, Validators.required],
      colonia: [{ value: this.solicitudState?.colonia, disabled: true }],
      entidadFederativaDos: [{ value: this.solicitudState?.entidadFederativaDos, disabled: true }],
      calle: [{ value: this.solicitudState?.calle, disabled: true }, [Validators.required,Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO)]],
      numeroExterior: [{ value: this.solicitudState?.numeroExterior, disabled: true }, Validators.required],
      numeroInterior: [{ value: this.solicitudState?.numeroInterior, disabled: true }],
      ubicacionDescripcion: [{ value: this.solicitudState?.ubicacionDescripcion, disabled: true }],
      // Aduanas
      aduana: [this.solicitudState?.aduana, Validators.required],
    });

  }

  /**
   * @method cerrarModal
   * @description Cierra el modal utilizando la referencia al botón de cierre.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

      /**
       * Notificación que se muestra al usuario.
       */
    public nuevaNotificacion: Notificacion | undefined;
  

  /**
   * @property opcionSeleccionada
   * @description Almacena la opción seleccionada en los checkboxes.
   */
  opcionSeleccionada: string = '';

  /**
   * Lista de nombres de controles que se deben alternar (toggle) en el formulario.
   * 
   * Estos controles representan campos relacionados con la dirección, como país, 
   * código postal, entidad federativa, localidad, municipio o delegación, colonia, 
   * calle, y números de exterior e interior. 
   * 
   * @constant
   * @readonly
   */
  private readonly CONTROLES_A_TOGGLE: string[] = [
    'pais', 'codigoPostal', 'entidadFederativa', 'localidad', 'municipioDelegacion',
    'colonia', 'entidadFederativaDos', 'calle', 'numeroExterior', 'numeroInterior'
  ];

  /**
   * Maneja el evento de cambio en un checkbox y asegura la exclusividad entre las opciones
   * 'domicilio' y 'ubicacion'.
   *
   * @param evento - El evento de cambio del checkbox.
   * @param opcion - La opción seleccionada, puede ser 'domicilio' o 'ubicacion'.
   *
   * Realiza las siguientes acciones:
   * - Determina si el checkbox está seleccionado o no.
   * - Alterna los controles relacionados según el estado del checkbox.
   * - Deshabilita o habilita la selección de otras opciones.
   * - Asegura que solo una de las opciones ('domicilio' o 'ubicacion') esté seleccionada
   *   al mismo tiempo, desmarcando la otra.
   */
  onCambioCheckbox(evento: Event, opcion: 'domicilio' | 'ubicacion'): void {
    const ELEMENTO_INPUT = evento.target as HTMLInputElement;
    const ESTA_SELECCIONADO = ELEMENTO_INPUT?.checked ?? false;
    // Asegurar exclusividad entre las opciones
    if (opcion === 'domicilio') {
      this.datosDelTramite.get("ubicacionDescripcion")?.disable();
      this.datosDelTramite.get("pais")?.setValue("ALB");
      this.deshabilitarSeleccion = !ESTA_SELECCIONADO;
      this.alternarControles(ESTA_SELECCIONADO);
      this.datosDelTramite.get('ubicacion')?.setValue(false);
    } else if (opcion === 'ubicacion') {
      if (ESTA_SELECCIONADO) {
        this.datosDelTramite.get("ubicacionDescripcion")?.enable();
      } else {
        this.datosDelTramite.get("ubicacionDescripcion")?.disable();
      }
      this.datosDelTramite.get('domicilio')?.setValue(false);
    }
  }

   /**
     * @method aceptarConfirmationPopup
     * Abre un popup de confirmación para eliminar los registros seleccionados.
     * Si no hay registros seleccionados, no realiza ninguna acción.
     */
    aceptarConfirmationPopup(): void {
    this.agregarForm.get('descripcion')?.enable();
    const formValue = this.agregarForm.value;
    const fraccionObj = this.fraccionArancelaria.find(f => f.id == formValue.fraccionArancelaria);
    const displayValue = fraccionObj ? fraccionObj.descripcion : formValue.fraccionArancelaria;
    const MERCANCIA = {
      ...formValue,
      fraccionArancelaria: displayValue
    };
    this.mercanciTablaDatos.push(MERCANCIA);
    this.mercanciTablaDatos = [...this.mercanciTablaDatos];
    this.store.setValidFormularioMercinia(this.mercanciTablaDatos);
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'La fraccion arancelaria fue agregada correctamente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  aceptarConfirmacion(confirmado: boolean) {
    this.agregarForm.reset();
    this.cerrarModal();
  }
  /**
   * Alterna el estado de habilitación de un conjunto de controles en un formulario.
   *
   * @param habilitar - Indica si los controles deben ser habilitados (`true`) o deshabilitados (`false`).
   * 
   * Este método recorre los nombres de los controles definidos en `CONTROLES_A_TOGGLE`
   * y cambia su estado de habilitación en función del valor del parámetro `habilitar`.
   * Si `habilitar` es `true`, los controles serán habilitados; de lo contrario, serán deshabilitados.
   */
  private alternarControles(habilitar: boolean): void {
    this.CONTROLES_A_TOGGLE.forEach(NOMBRE_CONTROL => {
      const CONTROL = this.datosDelTramite.get(NOMBRE_CONTROL);
      if (habilitar) {
        CONTROL?.enable();
      } else {
        CONTROL?.disable();
      }
    });
  }
  /**
   * @method obtenerMercancia
   * @description Obtiene los datos de la tabla de mercancías y los asigna a las propiedades correspondientes.
   */
  public obtenerMercancia(): void {
    this.mercanciaHeaderData = this.getMercanciaTableData.mercanciaTable.tableHeader;
  }

  /**
   * Método para obtener datos de ejemplo para la tabla.
   * Retorna un arreglo vacío de tipo TablaDatos.
   *
   * @returns Un arreglo vacío de TablaDatos.
   */
  fetchTableDummyJson(): void {
    this.mercanciaBodyData.push(FRACCIONES_TABLEDOS_TABLE_BODY_DATA);
  }


  /**
   * @method setValoresStore
   * @description Establece valores en el store a partir de un formulario y un campo específico.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   * @param metodoNombre - El método del store que se debe invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite105Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.store.setValidFormularioUno(this.datosDelTramite.invalid ? false : true);
  }

  /**
   * @method abrirModal
   * @description Abre el modal y configura el formulario de agregar mercancías.
   */
  public abrirModal(): void {
    this.modal = 'show';
    this.getAgregarForm();
  }

  /**
   * @method getAgregarForm
   * @description Configura el formulario reactivo para agregar mercancías.
   */
  public getAgregarForm(): void {
    this.agregarForm = this.fb.group({
      fraccionArancelaria: [''],
      descripcion: [{ value: '', disabled: true }],
      descripcionAdicional: ['']
    });
  }

  /**
   * @method getPais
   * @description Obtiene el catálogo de países desde el servicio y lo almacena en el store.
   */
  getPais(): void {
    this.invoCarService
      .getPais()
      .pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.datos) {
          const RESPONSE = resp.datos;
          this.pais = RESPONSE;
        }
      });
  }

  /**
   * @method getEntidadFederativa
   * @description Obtiene el catálogo de entidades federativas desde el servicio y lo almacena en el store.
   */
  getEntidadFederativa(): void {
    this.invoCarService.getEntidadFederativa().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.datos) {
          const RESPONSE = resp.datos;
          this.entidadFederativa = RESPONSE;
        }
      });
  }

  /**
   * @method getMunicipioDelegacion
   * @description Obtiene el catálogo de municipios o delegaciones desde el servicio y lo almacena en el store.
   */
  getMunicipioDelegacion(): void {
    this.invoCarService.getMunicipioDelegacion().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
         if (resp.datos) {
          const RESPONSE = resp.datos;
          this.municipioDelegacion = RESPONSE;
        }
      });
  }

  /**
   * @method getColonia
   * @description Obtiene el catálogo de colonias desde el servicio y lo almacena en el store.
   */
  getColonia(): void {
    this.invoCarService.getColonia().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.datos) {
          const RESPONSE = resp.datos;
          this.colonia = RESPONSE;
        }
      });
  }

  /**
   * @method getAduana
   * @description Obtiene el catálogo de aduanas desde el servicio y lo almacena en el store.
   */
  getAduana(): void {
    this.invoCarService.getAduana().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp.datos) {
          const RESPONSE = resp.datos;
          this.aduana = RESPONSE
        }
      });
  }

  /**
   * @method getFraccionArancelariae
   * @description Obtiene el catálogo de fracciones arancelarias desde el servicio y lo almacena en el store.
   */
  getFraccionArancelariae(): void {
    this.invoCarService.getFraccionArancelariaOptions().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
         if (resp.datos) {
          const RESPONSE = resp.datos;
          this.fraccionArancelaria = RESPONSE;

        }
      });
  }



  /**
   * @method agregarMercancias
   * @description Agrega una mercancía a la tabla de mercancías y reinicia el formulario.
   */
  agregarMercancias(): void {
    if (!this.agregarForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.values(this.agregarForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    else{
      this.cerrarModal();
     this.aceptarConfirmationPopup();
    }

  }

  /**
   * Establece el valor del campo 'descripcion' en el formulario 'agregarForm' 
   * utilizando el valor proporcionado por el evento.
   * 
   * @param event - Evento que contiene el nuevo valor para el campo 'descripcion'.
   */
  setDiscription(event: Event): void {
    const selectedId = this.agregarForm.get('fraccionArancelaria')?.value;
    const fraccionObj = this.fraccionArancelaria.find(f => f.clave == selectedId);
     this.agregarForm.get('descripcion')?.setValue(fraccionObj?.descripcion);
   }

    /**
   * Maneja el evento de cambio en el campo de RFC del representante.
   * Llama a la función para buscar el representante por RFC.
   */
  hasError(controlName: string, errorName: string): boolean {
    return Boolean(
      this.datosDelTramite.get(controlName)?.touched &&
        this.datosDelTramite.get(controlName)?.hasError(errorName)
    );
  }

  /**
   * @method ngOnDestroy
   * @description Limpia las suscripciones activas y restablece el estado del modal al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.modal = 'modal';
  }
}
