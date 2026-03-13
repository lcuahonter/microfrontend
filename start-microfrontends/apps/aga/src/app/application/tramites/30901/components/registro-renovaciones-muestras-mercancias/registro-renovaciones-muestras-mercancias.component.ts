import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioState,
  MERCHANDISE_IMPORTANTE,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud30901State,
  Solicitud30901Store,
} from '../../estados/tramites30901.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportanteCatalogoSeleccion } from '../../models/registro-muestras-mercancias.model';
import { RenovacionesMuestrasMercanciasService } from '../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import { Solicitud30901Query } from '../../estados/tramites30901.query';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente para el registro de renovaciones de muestras de mercancías.
 *
 * Este componente permite gestionar el formulario reactivo para el registro de muestras de mercancías,
 * incluyendo la obtención de opciones desplegables y la manipulación de varios controles de formulario.
 *
 * @class
 * @implements {OnInit}
 */
@Component({
  selector: 'app-registro-renovaciones-muestras-mercancias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    AlertComponent,
  ],
  providers: [
    RenovacionesMuestrasMercanciasService,
    ToastrService,
    BsModalService,
  ],
  templateUrl: './registro-renovaciones-muestras-mercancias.component.html',
  styleUrl: './registro-renovaciones-muestras-mercancias.component.scss',
})
export class RegistroRenovacionesMuestrasMercanciasComponent
  implements OnInit, OnDestroy
{
  /**
   * Formulario reactivo para el registro de muestras de mercancías.
   */
  formRegistroMuestras!: FormGroup;
  /**
   * Constante que contiene los textos importantes.
   */
  TEXTOS = MERCHANDISE_IMPORTANTE;
  /**
   * Variable que contiene las opciones del importador.
   */
  opcionDeImportador: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Variable que contiene las opciones de fracción arancelaria AGA.
   */
  fraccionArancelariaAga: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Propiedad que representa un catálogo de selección.
   *
   * @type {CatalogosSelect}
   */
  nico: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Propiedad que representa un catálogo de selección genérico.
   *
   * @type {CatalogosSelect}
   */
  ideGenerica: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Representa la selección de catálogo para la toma de muestra de despacho.
   *
   * @type {CatalogosSelect}
   */
  tomaMuestraDespacho: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Indica si el panel de despacho o mercancía está activo.
   *
   * @type {boolean}
   */
  panelDespachoOrMercancia: boolean = false;

  /**
   * Administra el ciclo de vida de la suscripción `darseDeBaja`.
   *
   * - La variable `darseDeBaja` almacena la suscripción activa,
   *   la cual puede ser `null` si no hay suscripción.
   * - El método `ngOnDestroy` se asegura de que la suscripción
   *   se cancele correctamente cuando el componente se destruya,
   *   evitando fugas de memoria.
   */
  darseDeBaja: Subscription | null = null;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado actual de la solicitud 30901.
   * Se inicializa como un objeto vacío con la estructura de `Solicitud30901State`.
   */
  solicitud30901State: Solicitud30901State = {} as Solicitud30901State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la sección del formulario.
   * Se utiliza para manejar y consultar datos relacionados con la sección.
   */
  seccionState!: ConsultaioState;

  /**
   * Indica si el campo del combo de fracción arancelaria es inválido.
   * Se establece en `true` cuando el campo no pasa la validación.
   */
  isInvalidComboFraccionField: boolean = false;

  /**
   * Indica si el campo del combo de NICOs es inválido.
   * Se establece en `true` cuando el campo no pasa la validación.
   */
  isInvalidComboNicosField: boolean = false;

  /**
   * Constructor del componente `RegistroRenovacionesMuestrasMercanciasComponent`.
   *
   * Este constructor inyecta los servicios y stores necesarios para gestionar el formulario de registro,
   * el estado del trámite 30901, y la configuración de solo lectura determinada por el estado de consulta.
   *
   * @param {FormBuilder} fb - Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param {RenovacionesMuestrasMercanciasService} renovacionesService - Servicio encargado de las operaciones relacionadas con renovaciones de muestras de mercancías.
   * @param {Solicitud30901Store} solicitud30901Store - Store para el manejo del estado centralizado de la solicitud 30901.
   * @param {Solicitud30901Query} solicitud30901Query - Query que permite observar los cambios en el estado de la solicitud 30901.
   * @param {ConsultaioQuery} consultaioQuery - Query que expone el estado de consulta, incluyendo si el formulario debe estar en modo de solo lectura.
   */
  constructor(
    public fb: FormBuilder,
    public renovacionesService: RenovacionesMuestrasMercanciasService,
    public solicitud30901Store: Solicitud30901Store,
    public solicitud30901Query: Solicitud30901Query,
    private consultaioQuery: ConsultaioQuery
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
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.seccionState = seccionState;
          this.inicializarEstadoFormulario();
          if (this.seccionState.create) {
            this.getImportadorDatos();
          }
        })
      )
      .subscribe();
    this.getOpcionImportador();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   *
   * En este método se inicializa el formulario `formRegistroMuestras` con varios controles de formulario,
   * algunos de los cuales están deshabilitados y tienen valores predeterminados.
   *
   * También se llama al método `getOpcionImportador` para obtener las opciones del importador.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene las opciones desplegables del importador y las asigna a las propiedades correspondientes.
   *
   * Este método realiza una solicitud al servicio `renovacionesService` para obtener las opciones
   * desplegables relacionadas con el importador y las asigna a las propiedades de la clase.
   *
   * @returns {void} No retorna ningún valor.
   */
  getOpcionImportador(): void {
    this.darseDeBaja = this.renovacionesService
      .obtenerOpcionesDesplegables()
      .subscribe({
        next: (res: ImportanteCatalogoSeleccion) => {
          this.opcionDeImportador = res.importadorExportadorPrevio;
          this.tomaMuestraDespacho = res.tomaMuestraDespacho;
          this.fraccionArancelariaAga = res.fraccionArancelariaAga;
          this.nico = res.nico;
          this.ideGenerica = res.ideGenerica;
        },
      });
  }

  /**
   * Obtiene las opciones desplegables del importador y las asigna a las propiedades correspondientes.
   *
   * Este método realiza una solicitud al servicio `renovacionesService` para obtener las opciones
   * desplegables relacionadas con el importador y las asigna a las propiedades de la clase.
   *
   * @returns {void} No retorna ningún valor.
   */
  getImportadorDatos(): void {
    this.darseDeBaja = this.renovacionesService
      .obtenerOpcionesDesplegables()
      .subscribe({
        next: (res: ImportanteCatalogoSeleccion) => {
          this.solicitud30901Store.setFraccionDescripcion(
            res.registroMuestrasDatos.fracciondescripcion
          );
          this.solicitud30901Store.setNicoDescripcion(
            res.registroMuestrasDatos.nicoDescripcion
          );
          this.solicitud30901Store.setNombreQuimico(
            res.registroMuestrasDatos.nombreQuimico
          );
          this.solicitud30901Store.setNombreComercial(
            res.registroMuestrasDatos.nombreComercial
          );
          this.solicitud30901Store.setNumeroCAS(
            res.registroMuestrasDatos.numeroCAS
          );
          this.solicitud30901Store.setIdeGenerica(
            res.registroMuestrasDatos.ideGenerica
          );
          this.solicitud30901Store.setDescClobGenerica(
            res.registroMuestrasDatos.descClobGenerica
          );
          this.solicitud30901Store.setComboFraccionConcatenada(
            res.registroMuestrasDatos.comboFraccionConcatenada
          );
          this.solicitud30901Store.setComboNicos(
            res.registroMuestrasDatos.comboNicos
          );
        },
      });
  }

  /**
   * Muestra la descripción de la fracción arancelaria.
   *
   * @param {Catalogo} valor - El objeto de catálogo que contiene la descripción de la fracción arancelaria.
   *
   * Actualiza el campo oculto y el control de descripción en el formulario con la descripción de la fracción arancelaria.
   * Si la descripción contiene un guion (' - '), se toma la parte después del guion como la descripción.
   */
  mostrarDescFraccArancelaria(valor: Catalogo): void {
    let descripcion = '';
    if (valor?.id === 1) {
      const PARTS = valor.descripcion.split(' - ');
      if (PARTS.length >= 2) {
        descripcion = PARTS[1];
      }
      descripcion = 'Vacas lecheras.';
    } else {
      descripcion = 'Federal';
    }
    this.isInvalidComboFraccionField = false;
    this.formRegistroMuestras.patchValue({
      fraccionConcatenada: valor.descripcion,
      fracciondescripcion: descripcion,
    });

    this.solicitud30901Store.setComboFraccionConcatenada(valor.id);
    this.solicitud30901Store.setFraccionConcatenada(valor.descripcion);
    this.solicitud30901Store.setFraccionDescripcion(descripcion);
  }

  /**
   * Muestra u oculta el panel de trámite basado en el evento recibido.
   *
   * @param {Catalogo} event - El evento que contiene el id para determinar la acción.
   * @returns {void}
   */
  mostrarOcultarPanelTramite(event: Catalogo): void {
    const VALOR = event.id;
    if (VALOR === 2) {
      this.panelDespachoOrMercancia = true;
    } else {
      this.panelDespachoOrMercancia = false;
    }
    this.solicitud30901Store.setOpcionDeImportador(event.id);
  }

  /**
   * Cambia el estado del campo 'descMotivoFaltaMuestra' en el formulario 'formRegistroMuestras'
   * basado en el valor del evento recibido.
   *
   * @param {Catalogo} event - El evento que contiene el id para determinar el estado del campo.
   *
   * - Si el id del evento es 1, habilita el campo 'descMotivoFaltaMuestra'.
   * - Si el id del evento es 0, deshabilita el campo 'descMotivoFaltaMuestra' y limpia su valor.
   * - Para cualquier otro valor del id, deshabilita el campo 'descMotivoFaltaMuestra'.
   */
  cambiaEstadoMotivo(event: Catalogo): void {
    const VALOR = event.id;
    if (VALOR === 1) {
      this.formRegistroMuestras.get('descMotivoFaltaMuestra')?.enable();
    } else if (VALOR === 0) {
      this.formRegistroMuestras.patchValue({ descMotivoFaltaMuestra: '' });
      this.formRegistroMuestras.get('descMotivoFaltaMuestra')?.disable();
    } else {
      this.formRegistroMuestras.get('descMotivoFaltaMuestra')?.disable();
    }
    this.solicitud30901Store.setTomaMuestraDespacho(event.descripcion);
  }
  /**
   * Actualiza la descripción del motivo de falta de muestra en el estado.
   */
  setDescMotivoFaltaMuestra(): void {
    const VALUE = this.formRegistroMuestras.get(
      'descMotivoFaltaMuestra'
    )?.value;
    this.solicitud30901Store.setDescMotivoFaltaMuestra(VALUE);
  }

  /**
   * Actualiza la descripción de la fracción en el estado.
   */
  setFracciondescripcion(): void {
    const VALUE = this.formRegistroMuestras.get('fracciondescripcion')?.value;
    this.solicitud30901Store.setFraccionDescripcion(VALUE);
  }

  /**
   * Actualiza el valor del combo de Nicos en el estado.
   * @param event - Evento que contiene el ID del Nico seleccionado.
   */
  setNino(valor: Catalogo): void {
    let descripcion = '';
    if (valor?.id === 1) {
      const PARTS = valor.descripcion.split(' - ');
      if (PARTS.length >= 2) {
        descripcion = PARTS[1];
      }
      descripcion = 'Vacas lecheras.';
    } else {
      descripcion =
        '2 - Para abasto, cuando la importación la realicen empacadoras Tipo Inspección Federal.';
    }
    this.isInvalidComboNicosField = false;
    this.solicitud30901Store.setNicoDescripcion(descripcion);
    this.solicitud30901Store.setComboNicos(valor.id);
  }

  /**
   * Actualiza la descripción del Nico en el estado.
   */
  setNicoDescripcion(): void {
    const VALUE = this.formRegistroMuestras.get('nicoDescripcion')?.value;
    this.solicitud30901Store.setNicoDescripcion(VALUE);
  }

  /**
   * Actualiza el nombre químico en el estado.
   */
  setNombreQuimico(): void {
    const VALUE = this.formRegistroMuestras.get('nombreQuimico')?.value;
    this.solicitud30901Store.setNombreQuimico(VALUE);
  }

  /**
   * Actualiza el nombre comercial en el estado.
   */
  setNombreComercial(): void {
    const VALUE = this.formRegistroMuestras.get('nombreComercial')?.value;
    this.solicitud30901Store.setNombreComercial(VALUE); // Corregido aquí
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    this.isInvalidComboFraccionField = false; // Reinicia el estado de campos inválidos
    this.isInvalidComboNicosField = false; // Reinicia el estado de campos inválidos
    // Verifica si el formulario es válido
    if (this.formRegistroMuestras.invalid) {
      this.formRegistroMuestras.markAllAsTouched();
      if (this.formRegistroMuestras.get('fraccionConcatenada')?.value === '') {
        this.isInvalidComboFraccionField = true;
      }
      if (this.formRegistroMuestras.get('comboNicos')?.value === '') {
        this.isInvalidComboNicosField = true;
      }
    }
    return this.formRegistroMuestras.valid;
  }
  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
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
      this.formRegistroMuestras.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formRegistroMuestras.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `solicitud32605State`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    this.formRegistroMuestras = this.fb.group({
      opcionDeImportador: [this.solicitud30901State.opcionDeImportador],
      tomaMuestraDespacho: [this.solicitud30901State.tomaMuestraDespacho],
      descMotivoFaltaMuestra: [
        {
          value: this.solicitud30901State.descMotivoFaltaMuestra,
          disabled: false,
        },
      ],
      comboFraccionConcatenada: [
        this.solicitud30901State.comboFraccionConcatenada,
      ],
      fraccionConcatenada: [
        this.solicitud30901State.fraccionConcatenada,
        [Validators.required],
      ],
      fracciondescripcion: [
        {
          value: this.solicitud30901State.fracciondescripcion,
          disabled: true,
        },
      ],
      comboNicos: [this.solicitud30901State.comboNicos, [Validators.required]],
      nicoDescripcion: [
        { value: this.solicitud30901State.nicoDescripcion, disabled: true },
      ],
      nombreQuimico: [
        { value: this.solicitud30901State.nombreQuimico, disabled: true },
        [Validators.maxLength(256)],
      ],
      nombreComercial: [
        { value: this.solicitud30901State.nombreComercial, disabled: true },
        [Validators.maxLength(256)],
      ],
      numeroCAS: [
        { value: this.solicitud30901State.numeroCAS, disabled: true },
        [Validators.maxLength(120)],
      ],
      ideGenerica: [
        { value: this.solicitud30901State.ideGenerica, disabled: true },
      ],
      descClobGenerica: [
        { value: this.solicitud30901State.descClobGenerica, disabled: true },
      ],
    });

    // Se suscribe al observable para obtener el registro de muestras de la tienda.Add commentMore actions
    this.solicitud30901Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((response: Solicitud30901State) => {
          this.solicitud30901State = response;
          this.formRegistroMuestras.patchValue({
            opcionDeImportador: this.solicitud30901State.opcionDeImportador,
            tomaMuestraDespacho: this.solicitud30901State.tomaMuestraDespacho,
            descMotivoFaltaMuestra:
              this.solicitud30901State.descMotivoFaltaMuestra,
            comboFraccionConcatenada:
              this.solicitud30901State.comboFraccionConcatenada,
            fraccionConcatenada: this.solicitud30901State.fraccionConcatenada,
            fracciondescripcion: this.solicitud30901State.fracciondescripcion,
            comboNicos: this.solicitud30901State.comboNicos,
            nicoDescripcion: this.solicitud30901State.nicoDescripcion,
            nombreQuimico: this.solicitud30901State.nombreQuimico,
            nombreComercial: this.solicitud30901State.nombreComercial,
            numeroCAS: this.solicitud30901State.numeroCAS,
            ideGenerica: this.solicitud30901State.ideGenerica,
            descClobGenerica: this.solicitud30901State.descClobGenerica,
          });
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se invoca cuando se destruye el componente.
   * - Verifica si la suscripción `darseDeBaja` está activa.
   * - Si existe, se da de baja (unsubscribe) del observable para liberar recursos.
   * - Establece `darseDeBaja` a `null` como parte del proceso de limpieza.
   */
  ngOnDestroy(): void {
    if (this.darseDeBaja) {
      this.darseDeBaja.unsubscribe();
      this.darseDeBaja = null;
    }
  }
}
