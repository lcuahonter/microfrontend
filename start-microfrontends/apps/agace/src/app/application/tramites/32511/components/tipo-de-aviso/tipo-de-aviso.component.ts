import { AlertComponent, Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Avisos32511State, Tramite32511Store } from '../../../../estados/tramites/tramite32511.store';
import { Component, OnDestroy } from '@angular/core';
import { FECHA_CONCLUSION_EVENTO, FECHA_DESTRUCION, FECHA_INICIO_EVENTO, OPCIONES_DE_BOTON_DE_RADIO, TEXTOS } from '../../constantes/avisos.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite32511Query } from '../../../../estados/queries/tramite32511.query';


/**
 * Componente para manejar el tipo de aviso de destrucción de mercancías importadas temporalmente para competencias y eventos deportivos.
 */
@Component({
  selector: 'app-tipo-de-aviso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    AlertComponent
  ],
  templateUrl: './tipo-de-aviso.component.html',
  styleUrl: './tipo-de-aviso.component.scss',
})
export class TipoDeAvisoComponent implements OnDestroy {
  /**
   * Formulario reactivo para manejar el tipo de aviso.
   */
  avisoForm!: FormGroup;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Archivo de incorporar seleccionado.
   */
  archivoIncorporar: File | null = null;

  /**
   * Elemento de entrada de archivo HTML.
   * 
   * @type {HTMLInputElement}
   */
  entradaIncorporarArchivo!: HTMLInputElement;

  /**
   * Elemento de entrada de archivo HTML.
   * 
   * @type {HTMLInputElement}
   */
  entradaArchivo!: HTMLInputElement;

  /**
   * Etiqueta del archivo seleccionado.
   */
  etiquetaDeArchivo: string = TEXTOS.ETIQUETA_DE_ARCHIVO;

  /**
   * Etiqueta del archivo seleccionado.
   * 
   * @type {string}
   */
  archivoSeleccionado: string = TEXTOS.ETIQUETA_DE_ARCHIVO;

  /**
   * Lista de catálogos de entidades federativas.
   */
  entidadFederativa!: Catalogo[];

  /**
   * Lista de catálogos de alcaldías o municipios.
   */
  alcaldiaMunicipio!: Catalogo[];

  /**
   * Lista de catálogos de colonias.
   */
  colonia!: Catalogo[];

  /**
   * Lista de catálogos de entidades federativas de destrucción de mercancías.
   */
  dmEntidadFederativa!: Catalogo[];

  /**
   * Lista de catálogos de alcaldías o municipios de destrucción de mercancías.
   */
  dmAlcaldiaMunicipio!: Catalogo[];

  /**
   * Lista de catálogos de colonias de destrucción de mercancías.
   */
  dmColonia!: Catalogo[];

  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Fecha inicio del evento.
   */
  fechaInicioEventoInput: InputFecha = FECHA_INICIO_EVENTO;

  /**
   * Fecha de conclusión del evento.
   */
  fechaConclusionEventoInput: InputFecha = FECHA_CONCLUSION_EVENTO;

  /**
   * Fecha de destrucción del aviso.
   */
  fechaDestruccionInput: InputFecha = FECHA_DESTRUCION;

  /**
   * Estado del aviso 32511.
   */
  public avisoState!: Avisos32511State;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente TipoDeAvisoComponent.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite32511Store Tienda para manejar el estado del trámite 32511.
   * @param tramite32511Query Consulta para obtener datos del trámite 31801.
   * @param avisoService Servicio para manejar la obtención de datos relacionados con el aviso.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32511Store: Tramite32511Store,
    private tramite32511Query: Tramite32511Query,
    private avisoService: AvisoService,
    private consultaioQuery: ConsultaioQuery
  ) { 
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.inicializaCatalogos();

    this.tramite32511Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.avisoState = seccionState;
        })
      )
      .subscribe();

    this.crearFormulario();

    this.entidadFederativaSeleccion();
    this.alcaldiaMunicipioSeleccion();
    this.coloniaSeleccion();
  }

  /**
   * Obtiene el grupo de formulario 'datosEvento' del formulario principal 'avisoForm'.
   */
  get datosEvento(): FormGroup {
    return this.avisoForm.get('datosEvento') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'destruccionMercancia' del formulario principal 'avisoForm'.
   */
  get destruccionMercancia(): FormGroup {
    return this.avisoForm.get('destruccionMercancia') as FormGroup;
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario `avisoForm` basado en si el formulario está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilita el campo `avisoForm`.
   * Si no está deshabilitado, se habilita el campo `avisoForm`.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.avisoForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.avisoForm.enable();
    }
  }

  /**
   * Crea el formulario reactivo para manejar el tipo de aviso.
   */
  crearFormulario(): void {
    this.avisoForm = this.fb.group({
      rgceOpcion: [
        this.avisoState?.rgceOpcion || '',
        Validators.required
      ],
      datosEvento: this.fb.group({
        fechaInicioEvento: [
          this.avisoState?.fechaInicioEvento,
          Validators.required
        ],
        calle: [
          this.avisoState?.calle,
          Validators.required
        ],
        numeroExterior: [
          this.avisoState?.numeroExterior,
          Validators.required
        ],
        numeroInterior: [
          this.avisoState?.numeroInterior
        ],
        codigoPostal: [
          this.avisoState?.codigoPostal,
          Validators.required
        ],
        entidadFederativa: [
          this.avisoState?.entidadFederativa,
          Validators.required
        ],
        alcaldiaMunicipio: [
          this.avisoState?.alcaldiaMunicipio,
          Validators.required
        ],
        colonia: [
          this.avisoState?.colonia,
          Validators.required
        ],
        fechaConclusionEvento: [
          this.avisoState?.fechaConclusionEvento,
          Validators.required
        ]
      }),
      destruccionMercancia: this.fb.group({
        dmCalle: [
          this.avisoState?.dmCalle,
          Validators.required
        ],
        dmNumeroExterior: [
          this.avisoState?.dmNumeroExterior,
          Validators.required
        ],
        dmNumeroInterior: [
          this.avisoState?.dmNumeroInterior
        ],
        dmCodigoPostal: [
          this.avisoState?.dmCodigoPostal,
          Validators.required
        ],
        dmEntidadFederativa: [
          this.avisoState?.dmEntidadFederativa,
          Validators.required
        ],
        dmAlcaldiaMunicipio: [
          this.avisoState?.dmAlcaldiaMunicipio,
          Validators.required
        ],
        dmColonia: [
          this.avisoState?.dmColonia,
          Validators.required
        ]
      }),
      fechaDestruccion: [
        this.avisoState?.fechaDestruccion,
        Validators.required
      ],
      destruccionHora: [
        this.avisoState?.destruccionHora,
        Validators.required
      ]
    });

    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    const ENTIDAD_FEDERATIVA$ = this.avisoService
      .getEntidadFederativaCatalogo()
      .pipe(
        map((resp) => {
          this.entidadFederativa = resp.data;
        })
      );

    const ALCALDIA_MUNICIPIO$ = this.avisoService
      .getAlcaldiaMunicipioCatalogo()
      .pipe(
        map((resp) => {
          this.alcaldiaMunicipio = resp.data;
        })
      );

    const COLONIA$ = this.avisoService
      .getColoniaCatalogo()
      .pipe(
        map((resp) => {
          this.colonia = resp.data;
        })
      );

    const DM_ENTIDAD_FEDERATIVA$ = this.avisoService
      .getEntidadFederativaCatalogo()
      .pipe(
        map((resp) => {
          this.dmEntidadFederativa = resp.data;
        })
      );

    const DM_ALCALDIA_MUNICIPIO$ = this.avisoService
      .getAlcaldiaMunicipioCatalogo()
      .pipe(
        map((resp) => {
          this.dmAlcaldiaMunicipio = resp.data;
        })
      );

    const DM_COLONIA$ = this.avisoService
      .getColoniaCatalogo()
      .pipe(
        map((resp) => {
          this.dmColonia = resp.data;
        })
      );

    merge(
      ENTIDAD_FEDERATIVA$,
      ALCALDIA_MUNICIPIO$,
      COLONIA$,
      DM_ENTIDAD_FEDERATIVA$,
      DM_ALCALDIA_MUNICIPIO$,
      DM_COLONIA$
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Selecciona el entidad federativa y actualiza el store.
   */
  entidadFederativaSeleccion(): void {
    const ENTIDAD_FEDERATIVA = this.avisoForm.get('datosEvento.entidadFederativa')?.value;
    this.tramite32511Store.setEntidadFederativa(ENTIDAD_FEDERATIVA);
  }

  /**
   * Selecciona la alcaldía o municipio y actualiza el store.
   */
  alcaldiaMunicipioSeleccion(): void {
    const ALCALDIA_MUNICIPIO = this.avisoForm.get('datosEvento.alcaldiaMunicipio')?.value;
    this.tramite32511Store.setAlcaldiaMunicipio(ALCALDIA_MUNICIPIO);
  }

  /**
   * Selecciona la colonia y actualiza el store.
   */
  coloniaSeleccion(): void {
    const COLONIA = this.avisoForm.get('datosEvento.colonia')?.value;
    this.tramite32511Store.setColonia(COLONIA);
  }

  /**
   * Selecciona el entidad federativa de destrucción de mercancías y actualiza el store.
   */
  dmEntidadFederativaSeleccion(): void {
    const ENTIDAD_FEDERATIVA = this.avisoForm.get('destruccionMercancia.dmEntidadFederativa')?.value;
    this.tramite32511Store.setDmEntidadFederativa(ENTIDAD_FEDERATIVA);
  }

  /**
   * Selecciona la alcaldía o municipio de destrucción de mercancías y actualiza el store.
   */
  dmAlcaldiaMunicipioSeleccion(): void {
    const ALCALDIA_MUNICIPIO = this.avisoForm.get('destruccionMercancia.dmAlcaldiaMunicipio')?.value;
    this.tramite32511Store.setDmAlcaldiaMunicipio(ALCALDIA_MUNICIPIO);
  }

  /**
   * Selecciona la colonia de destrucción de mercancías y actualiza el store.
   */
  dmColoniaSeleccion(): void {
    const COLONIA = this.avisoForm.get('destruccionMercancia.dmColonia')?.value;
    this.tramite32511Store.setDmColonia(COLONIA);
  }

  /**
   * Método para cambiar la fecha de inicio del evento.
   * @param nuevo_valor Nuevo valor de la fecha de inicio del evento.
   */
  cambioFechaInicioEvento(nuevo_valor: string): void {
    this.datosEvento.patchValue({
      fechaInicioEvento: nuevo_valor,
    });
    this.tramite32511Store.setFechaInicioEvento(nuevo_valor);
  }

  /**
   * Método para cambiar la fecha de conclusión del evento.
   * @param nuevo_valor Nuevo valor de la fecha de conclusión del evento.
   */
  cambioFechaConclusionEvento(nuevo_valor: string): void {
    this.datosEvento.patchValue({
      fechaConclusionEvento: nuevo_valor,
    });
    this.tramite32511Store.setFechaConclusionEvento(nuevo_valor);
  }

  /**
   * Método para cambiar la fecha de destrucción del aviso.
   * @param nuevo_valor Nuevo valor de la fecha de destrucción del aviso.
   */
  cambioFechaDestruccion(nuevo_valor: string): void {
    this.avisoForm.patchValue({
      fechaDestruccion: nuevo_valor,
    });
    this.tramite32511Store.setFechaDestruccion(nuevo_valor);
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   * 
   * @param event Evento de cambio de archivo.
   * 
   * @returns {void}
   */
  onCambioDeIncorporarArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoIncorporar = TARGET.files[0];
      this.archivoSeleccionado = this.archivoIncorporar.name;
    } else {
      this.archivoSeleccionado = TEXTOS.ETIQUETA_DE_ARCHIVO;
    }
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   * 
   * @param event Evento de cambio de archivo.
   * 
   * @returns {void}
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoIncorporar = TARGET.files[0];
      this.etiquetaDeArchivo = this.archivoIncorporar.name;
    } else {
      this.etiquetaDeArchivo = TEXTOS.ETIQUETA_DE_ARCHIVO;
    }
  }

  /**
   * Activa la selección del archivo de medicamentos.
   * @returns {void}
   */
  activarArchivoSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById('archivoExcelIncorporar') as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }
  }

   /**
   * Activa la selección del archivo de medicamentos.
   * @returns {void}
   */
  activarSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById('archivoIncorporar') as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }
  }

  /**
   * Método para validar el formulario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (this.avisoForm.invalid) {
      this.avisoForm.markAllAsTouched();
    }
    return this.avisoForm.valid;
  }

  /**
   * Establece los valores en el store de tramite32511.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32511Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32511Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}
