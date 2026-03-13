import { AvisoTabla,AvisoTablaDatos,Catalogo,CatalogoLista } from '../../models/aviso-traslado.model';
import { AlertComponent, CatalogoSelectComponent, InputRadioComponent, REGEX_IMPORTE_PAGO, REGEX_NUMEROS_USD, REGEX_REEMPLAZAR, SoloNumerosDirective, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Catalogo as CatalogoShared } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { RADIO_OPCIONS, TABLA_DE_DATOS_AVISO, TEXTO_MODAL_MERCANCIAS } from '../../constants/avios-procesos.enum';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import { Tramite32507State } from '../../../../estados/tramites/tramite32507.store';
import { Tramite32507Store } from '../../../../estados/tramites/tramite32507.store';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name AvisoComponent
 * @description Componente encargado de gestionar la lógica y la interacción del usuario para el manejo de avisos en el trámite 32507.
 * Este componente utiliza formularios reactivos para capturar y validar datos, y se comunica con servicios y estados para manejar la información.
 */
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    AlertComponent,
    SoloNumerosDirective,
  ],
  standalone: true,
})
export class AvisoComponent implements OnInit, OnDestroy {
  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * @property {ReplaySubject<boolean>} destroyed$
   *  @description Sujeto que emite un valor cuando el componente se destruye.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   *  @type {ReplaySubject<boolean>}
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property {Array} radioOpcions
   * @description Opciones de radio para seleccionar "Sí" o "No".
   */
  radioOpcions = RADIO_OPCIONS;

  /**
   * @property {boolean} esPopupAbierto
   * Indica si el popup está abierto.
   */
  esPopupAbierto: boolean = false;

  /**
   * @property {boolean} abrirPopup
   * Indica si el popup está abierto.
   * */
  abrirPopup(): void {
    this.esPopupAbierto = true;
  }

  /**
   * Referencia al elemento del modal para buscar mercancías.
   *
   * Se utiliza para abrir o cerrar el modal de búsqueda.
   */
  @ViewChild('datosAviso') datosAviso!: ElementRef;

  /**
   * Muestra el modal para cargar un archivo.
   *
   * Este método utiliza el modal de Bootstrap para mostrar el modal de carga de archivos.
   */
  datosDelAviso(): void {
    this.esPopupAbierto = true;
    if (this.datosAviso) {
      const MODAL_INSTANCE = new Modal(this.datosAviso.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * @property {FormGroup} avisoFormulario
   * @description Formulario reactivo que contiene los datos del aviso en el trámite.
   */
  avisoFormulario!: FormGroup;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {Tramite32503State} tramiteState
   * @description Estado actual del trámite 32503, que contiene toda la información relevante del proceso.
   */
  public tramiteState!: Tramite32507State;

  /**
   * @property {Catalogo[]} optionAdace
   * @description Lista de entidades federativas cargadas desde un catálogo.
   */
  optoinAdace: Catalogo[] = [];

  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description Propiedad que representa la tabla de selección utilizada en el componente.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * @property {object} tablaDeDatos
   * @description Configuración de la tabla de datos utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaDeDatos: {
    encabezadas: {
      encabezado: string;
      clave: (ele: AvisoTabla) => string;
      orden: number;
    }[];
    datos: AvisoTabla[];
  } = TABLA_DE_DATOS_AVISO;

  /**
   * @property {AvisoTabla[]} filaSeleccionadaLista
   * @description Lista de filas seleccionadas en la tabla de avisos.
   * Contiene los datos de las filas seleccionadas por el usuario.
   */
  filaSeleccionadaLista: AvisoTabla[] = [];

  /**
   * @property {ElementRef} closeMercancia
   * @description Referencia al botón o elemento que cierra el modal de mercancía.
   * Utilizado para cerrar el modal de manera programática.
   */
  @ViewChild('closeMercancia') public closeMercancia!: ElementRef;

  /**
   * @property {FormGroup} mercanciaFormulario
   * @description Formulario reactivo que contiene los datos relacionados con la mercancía.
   */
  mercanciaFormulario!: FormGroup;

  avisoComponent: typeof AvisoComponent = AvisoComponent;
  /**
   * @property {Catalogo[]} fraccionArancelaria
   * @description Lista de fracciones arancelarias cargadas desde un catálogo.
   * Utilizadas para seleccionar la fracción arancelaria correspondiente a la mercancía.
   */
  fraccionArancelaria: Catalogo[] = [];

  /**
   * @property {Catalogo[]} unidadMedida
   * @description Lista de unidades de medida cargadas desde un catálogo.
   */
  unidadMedida: Catalogo[] = [];

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description Notificación que se genera en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {boolean} mostrarAlertaMercancias
   * @description Controla la visibilidad de la alerta cuando no hay mercancías agregadas.
   */
  mostrarAlertaMercancias: boolean = false;

  /**
   * @property {string} avisoMercancias
   * @protected
   * @description aviso usado en el modal de mercancias.
   */
  protected readonly avisoMercancias = TEXTO_MODAL_MERCANCIAS;

  /**
   * @constructor
   * @description Constructor del componente. Se utiliza para la inyección de dependencias.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite32507Store,
    public tramiteQuery: Tramite32507Query,
    public entregaActaService: EntregaActaService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  /**
   * @method convertirBooleanStringARadio
   * @description Convierte valores "true"/"false" del backend a "Si"/"No" para los radio buttons.
   * @param valor - Valor que viene del backend ("true", "false", o cualquier otro)
   * @returns "Si" si el valor es "true", "No" si es "false", o el valor original si no es ninguno
   */
  private convertirBooleanStringARadio(valor: string): string {
    if (valor === 'true' || valor === 'True' || valor === 'TRUE') {
      return 'Si';
    } else if (valor === 'false' || valor === 'False' || valor === 'FALSE') {
      return 'No';
    }
    return valor; // Retornar el valor original si ya está en formato correcto
  }

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          console.log("32507 state", seccionState);
          this.tramiteState = seccionState;
          this.tablaDeDatos.datos = seccionState.tablaDeDatos || [];

          if (this.avisoFormulario && seccionState.avisoFormulario) {
            // Convertir tipoBusqueda de "true"/"false" a "Si"/"No"
            const tipoBusquedaConvertido = this.convertirBooleanStringARadio(
              seccionState.avisoFormulario.tipoBusqueda
            );

            this.avisoFormulario.patchValue({
              adaceFormulario: {
                adace: seccionState.avisoFormulario.adace
              },
              datosEmpresa: {
                valorProgramaImmex: seccionState.avisoFormulario.valorProgramaImmex,
                valorAnioProgramaImmex: seccionState.avisoFormulario.valorAnioProgramaImmex
              },
              datosAdace: {
                tipoBusqueda: tipoBusquedaConvertido,
                levantaActa: seccionState.avisoFormulario.levantaActaClave
              }
            }, { emitEvent: false });
          }
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.cargarLevantaActa();
    this.cargarUnidadMedida();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarAvisoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnDestroy
   * @description Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  inicializarAvisoFormulario(): void {
    if (this.soloLectura) {
      this.avisoFormulario.disable();
    } else {
      this.avisoFormulario.enable();
    }
  }

  /**
   * @method setValoresStore
   * @description Método para establecer valores en el store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32507Store): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method inicializarFormulario
   * @description Método para inicializar los formularios reactivos del componente.
   */
  inicializarFormulario(): void {
    // Convertir tipoBusqueda al inicializar el formulario
    const TIPO_BUSQUEDA_INICIAL = this.convertirBooleanStringARadio(
      this.tramiteState?.avisoFormulario?.tipoBusqueda || ''
    );

    this.avisoFormulario = this.fb.group({
      adaceFormulario: this.fb.group({
        adace: [this.tramiteState?.avisoFormulario?.adace, [Validators.required]],
      }),
      datosEmpresa: this.fb.group({
        valorProgramaImmex: [
          this.tramiteState?.avisoFormulario?.valorProgramaImmex,
          [Validators.required, Validators.maxLength(9), Validators.pattern(REGEX_IMPORTE_PAGO)],
        ],
        valorAnioProgramaImmex: [
          this.tramiteState?.avisoFormulario?.valorAnioProgramaImmex,
          [Validators.required, Validators.maxLength(4), Validators.pattern(REGEX_IMPORTE_PAGO)],
        ],
      }),
      datosAdace: this.fb.group({
        tipoBusqueda: [TIPO_BUSQUEDA_INICIAL],
        levantaActa: [this.tramiteState?.avisoFormulario?.levantaActaClave, [Validators.required]],
      }),

      adaceForm: this.fb.group({
        siIdTransaccion: [this.tramiteState.avisoFormulario?.siIdTransaccion],
        transaccionId: [this.tramiteState.avisoFormulario?.transaccionId],
        cantidad: [
          this.tramiteState.avisoFormulario?.cantidad,
          [Validators.required, Validators.pattern(REGEX_NUMEROS_USD)],
        ],
        peso: [this.tramiteState.avisoFormulario?.peso, [Validators.required]],
        unidadMedida: [this.tramiteState.avisoFormulario?.unidadMedida, [Validators.required]],
        descripcion: [this.tramiteState.avisoFormulario?.descripcion, [Validators.required]],
      }),
    });
    this.inicializarAvisoFormulario();
  }

  /**
   *  @method get adaceForm
   * @description
   */
  get adaceForm(): FormGroup {
    return this.avisoFormulario.get('adaceForm') as FormGroup;
  }

  /**
   *  @method get adaceFormulario
   * @description Método para obtener el formulario `adaceFormulario` del formulario principal `avisoFormulario`.
   */
  get adaceFormulario(): FormGroup {
    return this.avisoFormulario.get('adaceFormulario') as FormGroup;
  }

  /**
   * @method get datosEmpresa
   *  @description Método para obtener el formulario `datosEmpresa` del formulario principal `avisoFormulario`.
   */
  get datosEmpresa(): FormGroup {
    return this.avisoFormulario.get('datosEmpresa') as FormGroup;
  }

  /**
   * @method get datosAdace
   * @description Método para obtener el formulario `datosAdace` del formulario principal `avisoFormulario`.
   */
  get datosAdace(): FormGroup {
    return this.avisoFormulario.get('datosAdace') as FormGroup;
  }

  /**
   * @method abrirModalMercancia
   * @description Método para abrir el modal de mercancía.
   */
  static sanitizeAlphanumeric(form: FormGroup, control: string, event: Event): void {
    const INPUT = event?.target as HTMLInputElement;
    const REEMPLAZAR = INPUT?.value.replace(REGEX_REEMPLAZAR, '');
    form.get(control)?.setValue(REEMPLAZAR, { emitEvent: false });
  }

  /**
   *
   * @param form
   * @param field
   * @returns
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Valida el formulario completo del aviso.
   *
   * Verifica que:
   * 1. Los campos de datosEmpresa estén completos y válidos (IMMEX)
   * 2. El campo levantaActa esté seleccionado
   * 3. Exista al menos una mercancía en la tabla
   *
   * @returns {boolean} true si el formulario es válido, false en caso contrario
   */
  public validarFormularioCompleto(): boolean {
    let esValido = true;

    // Validar que exista al menos una mercancía en la tabla (siempre se ejecuta)
    if (!this.tablaDeDatos || !this.tablaDeDatos.datos || this.tablaDeDatos.datos.length === 0) {
      this.mostrarAlertaMercancias = true;
      esValido = false;
    } else {
      this.mostrarAlertaMercancias = false;
    }

    // Validar datosEmpresa (IMMEX)
    const datosEmpresa = this.avisoFormulario.get('datosEmpresa');
    if (!datosEmpresa || !datosEmpresa.valid) {
      esValido = false;
    }

    // Validar datosAdace (levantaActa)
    const datosAdace = this.avisoFormulario.get('datosAdace');
    if (!datosAdace || !datosAdace.valid) {
      esValido = false;
    }

    return esValido;
  }

  /**
   * Obtiene los mensajes de error de validación del formulario.
   *
   * @returns {string[]} Array de mensajes de error
   */
  public obtenerMensajesError(): string[] {
    const errores: string[] = [];

    // Validar datosEmpresa
    const datosEmpresa = this.avisoFormulario.get('datosEmpresa');
    if (datosEmpresa) {
      const valorProgramaImmex = datosEmpresa.get('valorProgramaImmex');
      const valorAnioProgramaImmex = datosEmpresa.get('valorAnioProgramaImmex');

      if (valorProgramaImmex?.hasError('required')) {
        errores.push('El campo "Valor programa IMMEX" es obligatorio');
      }
      if (valorProgramaImmex?.hasError('pattern')) {
        errores.push('El campo "Valor programa IMMEX" tiene un formato inválido');
      }

      if (valorAnioProgramaImmex?.hasError('required')) {
        errores.push('El campo "Año programa IMMEX" es obligatorio');
      }
      if (valorAnioProgramaImmex?.hasError('pattern')) {
        errores.push('El campo "Año programa IMMEX" tiene un formato inválido');
      }
    }

    // Validar datosAdace
    const datosAdace = this.avisoFormulario.get('datosAdace');
    if (datosAdace) {
      const levantaActa = datosAdace.get('levantaActa');
      if (levantaActa?.hasError('required')) {
        errores.push('El campo "Levanta acta" es obligatorio');
      }
    }

    // Validar tabla
    if (!this.tablaDeDatos || !this.tablaDeDatos.datos || this.tablaDeDatos.datos.length === 0) {
      errores.push('Debe agregar al menos una mercancía a la tabla');
    }

    return errores;
  }

  /**
   * Marca todos los campos del formulario como touched para mostrar errores.
   */
  public marcarFormularioComoTouched(): void {
    // Marcar datosEmpresa
    const datosEmpresa = this.avisoFormulario.get('datosEmpresa') as FormGroup;
    if (datosEmpresa) {
      Object.keys(datosEmpresa.controls).forEach((key) => {
        datosEmpresa.get(key)?.markAsTouched();
      });
    }

    // Marcar datosAdace
    const datosAdace = this.avisoFormulario.get('datosAdace') as FormGroup;
    if (datosAdace) {
      Object.keys(datosAdace.controls).forEach((key) => {
        datosAdace.get(key)?.markAsTouched();
      });
    }
  }

  /**
   *
   * @param evento
   */
  filaSeleccionada(evento: AvisoTabla[]): void {
    this.filaSeleccionadaLista = evento;
  }

  /**
   * @method cargarFederativa
   * @description Método para cargar la lista de entidades federativas desde el servicio `avisoTrasladoService`.
   * Los datos obtenidos se asignan a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  public cargarLevantaActa(): void {
    this.entregaActaService
      .obtenerLevantaActa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optoinAdace = datos.datos;
      });
  }

  /**
   * @method onLevantaActaChange
   * @description Maneja el cambio de selección del catálogo LevantaActa.
   * Guarda la descripción en levantaActa y la clave/ID en levantaActaClave.
   *
   * @param {CatalogoShared} catalogo - El objeto catálogo seleccionado con id, descripcion, clave, etc.
   * @returns {void}
   */
  public onLevantaActaChange(catalogo: CatalogoShared): void {
    if (catalogo) {
      // Guardar la descripción en levantaActa
      if (catalogo.descripcion) {
        this.store.setAvisoFormularioLevantaActa(catalogo.descripcion);
      }
      // Guardar la clave/ID en levantaActaClave para que el select pueda mostrar la opción seleccionada
      const CLAVE = catalogo.clave ?? catalogo.id?.toString() ?? '';
      this.store.setAvisoFormularioLevantaActaClave(CLAVE);
    }
  }

  /**
   * @method cargarUnidadMedida
   * @description Método para cargar la lista de unidades de medida desde el servicio `avisoTrasladoService`.
   * Los datos obtenidos se asignan a la propiedad `unidadMedida`.
   *
   * @returns {void}
   */
  public cargarUnidadMedida(): void {
    this.entregaActaService
      .obtenerUnidadMedida()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.unidadMedida = datos.datos;
      });
  }

  /**
   * @method eliminarDomicilio
   * @description Método para eliminar las filas seleccionadas de la tabla de datos.
   */
  eliminarDomicilio(): void {
    this.tablaDeDatos.datos = this.tablaDeDatos.datos.filter((ele) => !this.filaSeleccionadaLista.includes(ele));
    this.filaSeleccionadaLista = [];
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * - Completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @method agregarMercancia
   * @description Método para agregar mercancías a la tabla de mercancías.
   *
   * - Valida el formulario de mercancías y agrega los datos a la tabla si es válido.
   * - Cierra el modal de mercancía.
   *
   * @returns {void}
   */
  agregarMercancia(): void {
    if (this.adaceForm.valid) {
      const FORM_VALUES = this.adaceForm.value;

      // Obtener la descripción de la unidad de medida desde el catálogo
      const UNIDAD_SELECCIONADA = this.unidadMedida.find(
        (unidad) => unidad.clave === FORM_VALUES.unidadMedida || unidad.clave?.toString() === FORM_VALUES.unidadMedida
      );

      // Crear nuevo registro para la tabla
      const NUEVO_REGISTRO: AvisoTabla = {
        idTransaccionVUCEM: FORM_VALUES.transaccionId || '',
        cantidad: FORM_VALUES.cantidad || '',
        pesoKg: FORM_VALUES.peso || '',
        cveUnidadMedida: String(UNIDAD_SELECCIONADA?.clave) || '',
        descripcionUnidadMedida: UNIDAD_SELECCIONADA?.descripcion || '',
        descripcion: FORM_VALUES.descripcion || '',
        siIdTransaccion: FORM_VALUES.siIdTransaccion || '',
      };

      // Agregar el nuevo registro a la tabla creando una nueva referencia del array
      this.tablaDeDatos.datos = [...this.tablaDeDatos.datos, NUEVO_REGISTRO];
      // guardamos en el store
      this.store.setTablaDeDatos(this.tablaDeDatos.datos);

      // Ocultar la alerta de mercancías vacías ya que se agregó al menos una
      this.mostrarAlertaMercancias = false;

      // Limpiar el formulario
      this.adaceForm.reset();

      // Cerrar el modal
      this.closeMercancia.nativeElement.click();
      this.esPopupAbierto = false;
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.adaceForm.controls).forEach((key) => {
        this.adaceForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * @method eliminarMercancia
   * @description Método para eliminar las filas seleccionadas de la tabla de mercancías.
   */
  eliminarMercancia(): void {
    // Crear una nueva referencia del array filtrado para que el componente detecte el cambio
    this.tablaDeDatos.datos = this.tablaDeDatos.datos.filter((ele) => !this.filaSeleccionadaLista.includes(ele));
    // Guardamos en el store
    this.store.setTablaDeDatos(this.tablaDeDatos.datos);
    this.filaSeleccionadaLista = [];

    // Mostrar alerta si la tabla quedó vacía después de eliminar
    if (this.tablaDeDatos.datos.length === 0) {
      this.mostrarAlertaMercancias = true;
    }
  }

  /**
   * @method cargarMercanciaTabla
   * @description Método para cargar los datos de la tabla de mercancías desde el servicio `avisoTrasladoService`.
   * Los datos obtenidos se asignan a la propiedad `tablaDeMercancia.datos`.
   *
   * @returns {void}
   */
  public cargarMercanciaTabla(): void {
    this.entregaActaService
      .obtenerAvisoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: AvisoTablaDatos) => {
        this.tablaDeDatos.datos = datos.datos;
        // Guardar en el store
        this.store.setTablaDeDatos(datos.datos);
      });
  }
}
