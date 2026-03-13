import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
  REGEX_NUMEROS,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  COLONIA,
  ENTIDAD_FEDERATIVA,
  FECHA_DESTRUCCION_MERCANCIA,
  MUNICIPIO_ALCALDIA,
} from '../../constantes/solicitud.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32512State,
  Solicitud32512Store,
} from '../../estados/solicitud32512.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud32512Query } from '../../estados/solicitud32512.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * @component AvisoComponent
 * @description
 * Componente encargado de mostrar el aviso y gestionar el formulario relacionado.
 * Este componente es autónomo (standalone) y utiliza múltiples componentes y módulos
 * compartidos para la construcción de su interfaz y funcionalidad.
 *
 */
@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    InputFechaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
})
// Aquí puedes incluir las propiedades y métodos del componente con sus respectivas anotaciones si lo deseas
export class AvisoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo utilizado para capturar los datos del aviso.
   * Se inicializa en el método ngOnInit.
   */
  aviosForm!: FormGroup;

  /**
   * Subject utilizado para destruir los observables al destruir el componente.
   * Evita fugas de memoria al usar operadores como takeUntil.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Catálogo de entidades federativas que se muestra en un select.
   */
  entidadFederativa: CatalogosSelect = ENTIDAD_FEDERATIVA;

  /**
   * Catálogo de municipios o alcaldías que se muestra en un select.
   */
  municipioAlcaldia: CatalogosSelect = MUNICIPIO_ALCALDIA;

  /**
   * Catálogo de colonias disponibles según el municipio/alcaldía seleccionado.
   */
  colonia: CatalogosSelect = COLONIA;

  /**
   * Catálogo de municipios/alcaldías del lugar de destrucción de mercancía.
   */
  lugarMunicipioAlcaldia: CatalogosSelect = MUNICIPIO_ALCALDIA;

  /**
   * Catálogo de colonias del lugar de destrucción de mercancía.
   */
  lugarColonia: CatalogosSelect = COLONIA;

  /**
   * Configuración para el componente de fecha de destrucción de mercancía.
   */
  fechaDestruccionMercancia: InputFecha = FECHA_DESTRUCCION_MERCANCIA;

  /**
   * Estado actual de la solicitud 32512, que contiene los datos compartidos entre componentes o servicios.
   */
  solicitud32512State: Solicitud32512State = {} as Solicitud32512State;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente `AvisoComponent`.
   *
   * Se encarga de inyectar los servicios y stores necesarios para la gestión del formulario
   * y los datos asociados a la solicitud 32512.
   *
   * @param fb - Servicio `FormBuilder` para la creación y manejo de formularios reactivos.
   * @param solicitudService - Servicio encargado de obtener y guardar datos de la solicitud.
   * @param solicitud32512Store - Store centralizado que administra el estado de la solicitud 32512.
   * @param solicitud32512Query - Query que permite observar el estado actual del store de la solicitud 32512.
   * @param consultaioQuery - Query que proporciona el estado de la sección de consulta relacionada con la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32512Store: Solicitud32512Store,
    public solicitud32512Query: Solicitud32512Query,
    public consultaioQuery: ConsultaioQuery
  ) {
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
          if (this.esFormularioSoloLectura === true) {
            this.conseguirMunicipioAlcaldia();
            this.conseguirColonia();
            this.conseguirLugarMunicipioAlcaldia();
            this.conseguirLugarColonia();
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    // Llamada para inicializar datos de catálogo al cargar el componente
    this.conseguirEntidadFederativa();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * - Inicializa el formulario reactivo `aviosForm` con valores del estado actual (`solicitud32512State`)
   * - Define validaciones como requeridos, longitud máxima y expresiones regulares
   * - Se suscribe al observable `selectSolicitud$` para mantener sincronizado el formulario con el estado compartido
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.aviosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.aviosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo `aviosForm` con los valores del estado actual (`solicitud32512State`)
   * y establece sus validaciones correspondientes.
   *
   * Además, se suscribe a los cambios en el estado de la solicitud mediante `solicitud32512Query.selectSolicitud$`
   * para mantener actualizado el formulario si el estado cambia.
   *
   * Validaciones aplicadas:
   * - Campos obligatorios (Validators.required)
   * - Longitud máxima (Validators.maxLength)
   * - Validaciones por patrón (Validators.pattern)
   */
  inicializarFormulario(): void {
    this.aviosForm = this.fb.group({
      nombreComercial: [
        { value: this.solicitud32512State.nombreComercial, disbled: false },
        [Validators.required, Validators.maxLength(250)],
      ],
      entidadFederativa: [
        { value: this.solicitud32512State.entidadFederativa, disbled: false },
        [Validators.required],
      ],
      municipio: [
        { value: this.solicitud32512State.municipio, disbled: false },
        [Validators.required],
      ],
      colonia: [
        { value: this.solicitud32512State.colonia, disbled: false },
        [Validators.required],
      ],
      calle: [
        { value: this.solicitud32512State.calle, disbled: false },
        [Validators.required, Validators.maxLength(250)],
      ],
      numeroExterior: [
        { value: this.solicitud32512State.numeroExterior, disbled: false },
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR),
        ],
      ],
      numeroInterior: [
        { value: this.solicitud32512State.numeroInterior, disbled: false },
        [
          Validators.maxLength(15),
          Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR),
        ],
      ],
      codigoPostal: [
        { value: this.solicitud32512State.codigoPostal, disbled: false },
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(REGEX_NUMEROS),
        ],
      ],
      lugarEntidadFederativa: [
        {
          value: this.solicitud32512State.lugarEntidadFederativa,
          disbled: false,
        },
        [Validators.required],
      ],
      lugarMunicipioAlcaldia: [
        {
          value: this.solicitud32512State.lugarMunicipioAlcaldia,
          disbled: false,
        },
        [Validators.required],
      ],
      lugarColonia: [
        { value: this.solicitud32512State.lugarColonia, disbled: false },
        [Validators.required],
      ],
      lugarCalle: [
        { value: this.solicitud32512State.lugarCalle, disbled: false },
        [Validators.required, Validators.maxLength(250)],
      ],
      lugarNumeroExterior: [
        { value: this.solicitud32512State.lugarNumeroExterior, disbled: false },
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR),
        ],
      ],
      lugarNumeroInterior: [
        { value: this.solicitud32512State.lugarNumeroInterior, disbled: false },
        [
          Validators.maxLength(15),
          Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR),
        ],
      ],
      lugarCodigoPostal: [
        { value: this.solicitud32512State.lugarCodigoPostal, disbled: false },
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(REGEX_NUMEROS),
        ],
      ],
      generico1: [
        { value: this.solicitud32512State.generico1, disbled: false },
        [Validators.required],
      ],
      generico2: [
        { value: this.solicitud32512State.generico2, disbled: false },
        [Validators.required],
      ],
      archivoDestruccion: [
        { value: this.solicitud32512State.archivoDestruccion, disbled: false },
        [Validators.required],
      ],
    });

    this.solicitud32512Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((respuesta: Solicitud32512State) => {
          this.solicitud32512State = respuesta;
          this.aviosForm.patchValue({
            nombreComercial: this.solicitud32512State.nombreComercial,
            entidadFederativa: this.solicitud32512State.entidadFederativa,
            municipio: this.solicitud32512State.municipio,
            colonia: this.solicitud32512State.colonia,
            calle: this.solicitud32512State.calle,
            numeroExterior: this.solicitud32512State.numeroExterior,
            numeroInterior: this.solicitud32512State.numeroInterior,
            codigoPostal: this.solicitud32512State.codigoPostal,
            lugarEntidadFederativa:
              this.solicitud32512State.lugarEntidadFederativa,
            lugarMunicipioAlcaldia:
              this.solicitud32512State.lugarMunicipioAlcaldia,
            lugarColonia: this.solicitud32512State.lugarColonia,
            lugarCalle: this.solicitud32512State.lugarCalle,
            lugarNumeroExterior: this.solicitud32512State.lugarNumeroExterior,
            lugarNumeroInterior: this.solicitud32512State.lugarNumeroInterior,
            lugarCodigoPostal: this.solicitud32512State.lugarCodigoPostal,
            generico1: this.solicitud32512State.generico1,
            generico2: this.solicitud32512State.generico2,
            archivoDestruccion: this.solicitud32512State.archivoDestruccion,
          });
        })
      )
      .subscribe();
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio `SolicitudService`
   * y lo asigna al objeto `entidadFederativa.catalogos`.
   *
   * Esta información se utiliza en un campo select del formulario.
   */
  conseguirEntidadFederativa(): void {
    this.solicitudService
      .conseguirEntidadFederativa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.entidadFederativa.catalogos = respuesta;
        },
      });
  }

  /**
   * Obtiene el catálogo de municipios o alcaldías desde el servicio `SolicitudService`
   * y lo asigna a `municipioAlcaldia.catalogos`.
   *
   * Relacionado con la entidad federativa seleccionada.
   */
  conseguirMunicipioAlcaldia(): void {
    this.solicitudService
      .conseguirMunicipioAlcaldia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.municipioAlcaldia.catalogos = respuesta;
        },
      });
  }

  /**
   * Obtiene el catálogo de colonias desde el servicio `SolicitudService`
   * y lo asigna a `colonia.catalogos`.
   *
   * Las colonias dependen del municipio o alcaldía seleccionada.
   */
  conseguirColonia(): void {
    this.solicitudService
      .conseguirColonia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.colonia.catalogos = respuesta;
        },
      });
  }

  /**
   * Obtiene el catálogo de municipios o alcaldías para el lugar de destrucción de mercancía
   * desde el servicio `SolicitudService` y lo asigna a `lugarMunicipioAlcaldia.catalogos`.
   */
  conseguirLugarMunicipioAlcaldia(): void {
    this.solicitudService
      .conseguirMunicipioAlcaldia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.lugarMunicipioAlcaldia.catalogos = respuesta;
        },
      });
  }

  /**
   * Obtiene el catálogo de colonias para el lugar de destrucción de mercancía
   * desde el servicio `SolicitudService` y lo asigna a `lugarColonia.catalogos`.
   */
  conseguirLugarColonia(): void {
    this.solicitudService
      .conseguirColonia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.lugarColonia.catalogos = respuesta;
        },
      });
  }

  /**
   * Actualiza la entidad federativa seleccionada.
   * Si el ID del catálogo es válido, obtiene el catálogo de municipios y actualiza el estado.
   */
  actualizarEntidadFederativa(evento: Catalogo): void {
    if (evento.id > 0) {
      this.conseguirMunicipioAlcaldia();
      this.solicitud32512Store.actualizarEntidadFederativa(evento.id);
    }
  }

  /**
   * Actualiza el municipio o alcaldía seleccionada.
   * Si el ID del catálogo es válido, obtiene el catálogo de colonias y actualiza el estado.
   */
  actualizarMunicipioAlcaldia(evento: Catalogo): void {
    if (evento.id > 0) {
      this.conseguirColonia();
      this.solicitud32512Store.actualizarMunicipio(evento.id);
    }
  }

  /**
   * Actualiza la colonia seleccionada en el estado de la solicitud.
   */
  actualizarColonia(evento: Catalogo): void {
    this.solicitud32512Store.actualizarColonia(evento.id);
  }

  /**
   * Actualiza la entidad federativa del lugar de destrucción.
   * Si el ID es válido, obtiene el catálogo de municipios correspondientes.
   */
  actualizarLugarEntidadFederativa(evento: Catalogo): void {
    if (evento.id > 0) {
      this.conseguirLugarMunicipioAlcaldia();
      this.solicitud32512Store.actualizarLugarEntidadFederativa(evento.id);
    }
  }

  /**
   * Actualiza el municipio o alcaldía del lugar de destrucción.
   * Si el ID es válido, obtiene el catálogo de colonias correspondientes.
   */
  actualizarLugarMunicipioAlcaldia(evento: Catalogo): void {
    if (evento.id > 0) {
      this.conseguirLugarColonia();
      this.solicitud32512Store.actualizarLugarMunicipioAlcaldia(evento.id);
    }
  }

  /**
   * Actualiza la colonia del lugar de destrucción en el estado de la solicitud.
   */
  actualizarLugarColonia(evento: Catalogo): void {
    this.solicitud32512Store.actualizarLugarColonia(evento.id);
  }

  /**
   * Actualiza el valor del campo "nombre comercial" en el estado de la solicitud.
   */
  actualizarNombreComercial(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarNombreComercial(VALOR);
  }

  /**
   * Actualiza el valor del campo "calle" en el estado de la solicitud.
   */
  actualizarCalle(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarCalle(VALOR);
  }

  /**
   * Actualiza el valor del campo "número exterior" en el estado de la solicitud.
   */
  actualizarNumeroExterior(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarNumeroExterior(VALOR);
  }

  /**
   * Limpia el valor del número exterior aplicando una expresión regular y lo actualiza en el formulario.
   */
  selectNumeroExterior(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(
      REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
      ''
    );

    this.aviosForm.patchValue({
      numeroExterior: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el valor del campo "número interior" en el estado de la solicitud.
   */
  actualizarNumeroInterior(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarNumeroInterior(VALOR);
  }

  /**
   * Limpia el valor del número interior aplicando una expresión regular y lo actualiza en el formulario.
   */
  selectNumeroInterior(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(
      REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
      ''
    );

    this.aviosForm.patchValue({
      numeroInterior: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el valor del campo "código postal" en el estado de la solicitud.
   */
  actualizarCodigoPostal(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarCodigoPostal(VALOR);
  }

  /**
   * Limpia el valor del campo "código postal" aplicando una expresión regular
   * y lo actualiza en el formulario reactivo.
   */
  selectCodigoPostal(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(REGEX_NUMEROS, '');

    this.aviosForm.patchValue({
      codigoPostal: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el valor del campo "calle del lugar" en el estado de la solicitud.
   */
  actualizarLugarCalle(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarLugarCalle(VALOR);
  }

  /**
   * Actualiza el número exterior del lugar en el estado de la solicitud.
   */
  actualizarLugarNumeroExterior(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarLugarNumeroExterior(VALOR);
  }

  /**
   * Limpia el número exterior del lugar aplicando una expresión regular
   * y lo actualiza en el formulario reactivo.
   */
  selectLugarNumeroExterior(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(
      REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
      ''
    );

    this.aviosForm.patchValue({
      lugarNumeroExterior: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el número interior del lugar en el estado de la solicitud.
   */
  actualizarLugarNumeroInterior(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarLugarNumeroInterior(VALOR);
  }

  /**
   * Limpia el número interior del lugar aplicando una expresión regular
   * y lo actualiza en el formulario.
   */
  selectLugarNumeroInterior(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(
      REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
      ''
    );

    this.aviosForm.patchValue({
      lugarNumeroInterior: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el código postal del lugar de destrucción en el estado de la solicitud.
   */
  actualizarLugarCodigoPostal(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarLugarCodigoPostal(VALOR);
  }

  /**
   * Limpia el código postal del lugar aplicando una expresión regular
   * y lo actualiza en el formulario.
   */
  selectLugarCodigoPostal(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(REGEX_NUMEROS, '');

    this.aviosForm.patchValue({
      lugarCodigoPostal: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el valor del campo genérico 1 en el estado de la solicitud.
   */
  actualizarGenerico1(evento: string): void {
    this.solicitud32512Store.actualizarGenerico1(evento);
  }

  /**
   * Actualiza el campo genérico 2 en el estado de la solicitud.
   */
  actualizarGenerico2(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32512Store.actualizarGenerico2(VALOR);
  }

  /**
   * Limpia el valor del campo genérico 2 aplicando una expresión regular
   * y lo actualiza en el formulario reactivo.
   */
  selectGenerico2(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    const CLEANED_VALUE = INPUT.value.replace(REGEX_NUMEROS, '');

    this.aviosForm.patchValue({
      generico2: CLEANED_VALUE,
    });
  }

  /**
   * Actualiza el archivo de destrucción en el estado de la solicitud.
   * Este archivo es seleccionado desde un input tipo file.
   */
  actualizarArchivoDestruccion(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      const FILE = INPUT.files[0];
      this.solicitud32512Store.actualizarArchivoDestruccion(FILE);
    }
  }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Simula la carga de un archivo relacionado con procesos o pedimentos.
   *
   * - Crea un objeto `PEDIMENTO` con valores por defecto.
   * - Muestra un modal con el mensaje de confirmación de carga exitosa.
   * - Agrega el pedimento al arreglo `pedimentos`.
   *
   * Este método puede usarse como parte de una simulación previa al envío
   * o validación real de pedimentos.
   */
  cargaArchivoProcesos(): void {
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal('Se realizó la carga correctamente.');
    this.pedimentos.push(PEDIMENTO);
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (this.aviosForm.invalid) {
      this.aviosForm.markAllAsTouched();
    }
    return this.aviosForm.valid;
  }

  /**
   * Método del ciclo de vida `OnDestroy`.
   *
   * Se ejecuta automáticamente cuando el componente se destruye.
   *
   * - Emite un valor al `destroyNotifier$` para cancelar todas las suscripciones activas.
   * - Libera recursos y evita fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
