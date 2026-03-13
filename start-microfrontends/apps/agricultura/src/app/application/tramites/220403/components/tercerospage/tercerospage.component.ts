import {
  AlertComponent,
  Catalogo,
  ConsultaioQuery,
  InputRadioComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  CatalogoSelectComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EMPRESA_PRODUCTORA_CONFIGURACION_TABLA,
  IMPORTADOR_CONFIGURACION_TABLA,
  OPCIONES_DE_BOTON_DE_RADIO,
  TEXTOS,
} from '../../constants/acuicola.module';
import {
  EmpresaProductora,
  FormularioGrupo,
  Importador,
} from '../../models/acuicola.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExportaccionAcuicolaService } from '../../services/exportaccion-acuicola.service';
import { Modal } from 'bootstrap';
import { Tramite220403Query } from '../../estados/tramite220403.query';
import { Tramite220403Store } from '../../estados/tramite220403.store';

@Component({
  selector: 'app-tercerospage',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    InputRadioComponent,
  ],
  templateUrl: './tercerospage.component.html',
  styleUrl: './tercerospage.component.scss',
})
export class TercerospageComponent implements OnInit, OnDestroy {
  /**
   * Formulario para agregar un importador.
   * @type {FormGroup}
   */
  agregarImportadorForm!: FormGroup;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Lista de países para el selector de país.
   * @type {Catalogo[]}
   */
  pais!: Catalogo[];

  /**
   * Alerta para el usuario en caso de que no existan personas terceros.
   */
  TEXTO_DE_ALERTA = TEXTOS.TERCEROS_ALERTA;

  /**
   * Tabla de selección para la visualización de datos.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de la tabla para mostrar los datos de la empresa productora.
   */
  empresaProductoraConfiguracionTabla = EMPRESA_PRODUCTORA_CONFIGURACION_TABLA;

  /**
   * Configuración de la tabla para mostrar los datos del importador.
   */
  importadorConfiguracionTabla = IMPORTADOR_CONFIGURACION_TABLA;

  /**
   * Datos de la empresa productora que se mostrarán en la tabla.
   */
  empresaProductoraDatos: EmpresaProductora[] = [];

  /**
   * Datos del importador que se mostrarán en la tabla.
   */
  importadorDatos: Importador[] = [];

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarImportador') modalElement!: ElementRef;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   *
   * @remarks
   * Este Subject se emite cuando el componente se destruye, permitiendo que las suscripciones
   * a observables se cancelen correctamente usando el operador `takeUntil`.
   *
   * @copodoc
   * Notificador para la destrucción de suscripciones en el ciclo de vida del componente.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   *
   * @desc [es] Determina si el formulario debe mostrarse únicamente para lectura, sin permitir modificaciones.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado del formulario del trámite.
   */
  seccionState!: FormularioGrupo;

  /**
   * Constructor for TercerosPageComponent.
   *
   * @param consultaQuery - Service for querying Consultaio data.
   * @param certificadoZoosanitarioServices - Service for managing Certificado Zoosanitario operations.
   * @param certificadoZoosanitarioQuery - Query service for Certificado Zoosanitario state management.
   *
   * @author
   * @see ConsultaioQuery
   * @see CertificadoZoosanitarioServiceService
   * @see ZoosanitarioQuery
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite220403Query: Tramite220403Query,
    private tramite220403Store: Tramite220403Store,
    private exportaccionAcuicolaService: ExportaccionAcuicolaService
  ) {}

  /**
   * @inheritdoc
   *
   * @description
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * Subscribes to the `selectConsultaioState$` observable from `consultaQuery` and updates the `esFormularioSoloLectura`
   * property based on the `readonly` value from the emitted `seccionState`. The subscription is automatically
   * unsubscribed when the `destroyNotifier$` emits, preventing memory leaks.
   *
   * @see https://angular.io/api/core/OnInit
   */
  ngOnInit(): void {
    this.obtenerEmpresaProductoraDatos();
    this.obtenerImportadorDatos();
    this.obtenerPaises();
    
    this.crearFormularioAgregarImportador();

    this.tramite220403Query.selectTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
          this.empresaProductoraDatos =
            seccionState?.empresaProductoraDatos || [];
          this.importadorDatos = seccionState?.importadorDatos || [];
        })
      )
      .subscribe();

    this.tramite220403Query.setTercerosRelacionados$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((tercerosRelacionados) => {
          this.tramite220403Store.setTercerosRelacionados(tercerosRelacionados);
        })
      )
      .subscribe();

    this.agregarImportadorForm.statusChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(() => {
        this.tramite220403Store.setTercerosRelacionados(
          this.agregarImportadorForm.get('tercerosRelacionados')?.value
        );
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState?.readonly;
      });
  }

  /**
   * Crea el formulario para agregar un importador.
   * @returns { void }
   */
  crearFormularioAgregarImportador(): void {
    this.agregarImportadorForm = new FormGroup({
      tercerosRelacionados: new FormGroup({
        tipoPersona: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required),
        apellidoPaterno: new FormControl('', Validators.required),
        apellidoMaterno: new FormControl(''),
        razonSocial: new FormControl('', Validators.required),
        pais: new FormControl('', Validators.required),
        domicilio: new FormControl('', Validators.required),
        lada: new FormControl(''),
        telefono: new FormControl(''),
        correoElectronico: new FormControl(''),
      }),
    });
  }

  /**
   * Obtiene los datos de la empresa productora desde el servicio y los asigna a la propiedad correspondiente.
   * @returns { void }
   */
  obtenerEmpresaProductoraDatos(): void {
    this.exportaccionAcuicolaService
      .obtenerEmpresaProductora()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.empresaProductoraDatos = datos || [];
      });
  }

  /**
   * Obtiene los datos del importador desde el servicio y los asigna a la propiedad correspondiente.
   * @returns { void }
   */
  obtenerImportadorDatos(): void {
    this.exportaccionAcuicolaService
      .obtenerImportador()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.importadorDatos = datos || [];
      });
  }

  /**
   * Obtiene la lista de países desde el servicio y los asigna a la propiedad correspondiente.
   * @returns { void }
   */
  obtenerPaises(): void {
    this.exportaccionAcuicolaService
      .obtenerPaises()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.pais = response;
      });
  }

  /**
   * Abre el modal para agregar un importador.
   * @returns { void }
   */
  abrirDialogoImportador(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   *
   * @param evento Evento que contiene el país seleccionado.
   * @description
   * Actualiza el campo 'pais' del formulario de agregar importador con el valor seleccionado.
   * @returns { void }
   */
  paisSeleccion(): void {
    const PAIS_SELECCIONADO = this.agregarImportadorForm.get('pais')?.value;
    this.agregarImportadorForm.get('pais')?.setValue(PAIS_SELECCIONADO);
  }

  /**
   * Guarda los datos del importador.
   * @returns { void }
   */
  guardarImportador(): void {
    let currentState =
      this.agregarImportadorForm.getRawValue().tercerosRelacionados;
    const PAIS_OBJ = this.pais.find((x) => (x.id).toString() === currentState.pais);
    currentState = [
      {
        nombre: currentState.nombre || '---',
        telefono: currentState.telefono || '---',
        correoElectronico: currentState.correoElectronico || '---',
        domicilio: currentState.domicilio || '---',
        pais: PAIS_OBJ?.descripcion || '---',
      },
    ];

    this.importadorDatos = [...this.importadorDatos, ...currentState];
    this.tramite220403Store.setImportadorDatos(this.importadorDatos);
    this.agregarImportadorForm.reset();
    this.cerrarModal();
  }

  /**
   * Limpia el formulario de agregar importador y actualiza el estado del store.
   * @returns { void }
   */
  limpiarImportador(): void {
    this.agregarImportadorForm.reset();
    this.tramite220403Store.limpiarFormulario();
  }

  /**
   * Cierra el modal.
   *
   * @returns {void}
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Configuración para el selector de identificación del transporte.
   * @property {ngOnDestroy} ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}