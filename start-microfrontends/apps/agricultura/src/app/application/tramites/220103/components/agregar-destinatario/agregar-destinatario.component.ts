/**
 * @component
 * @name AgregarDestinatarioComponent
 * @description
 * Componente que gestiona la funcionalidad para agregar destinatarios o instalaciones en el trámite 220103.
 * Proporciona un formulario dinámico y maneja la interacción con el estado del trámite.
 *
 *
 * @see Tramite220103Store
 * @see SanidadAcuicolaImportacionService
 * @see Tramite220103Query
 * @see FormasDinamicasComponent
 * @see TituloComponent
 * @see InputRadioComponent
 */

import { Subject, takeUntil } from "rxjs";

import { Catalogo, InputRadioComponent, ModeloDeFormaDinamica, TituloComponent } from "@libs/shared/data-access-user/src";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Tramite220103State, Tramite220103Store } from "../../estados/tramites/tramites220103.store";
import { SanidadAcuicolaImportacionService } from "../../services/sanidad-acuicola-importacion.service";
import { Tramite220103Query } from "../../estados/queries/tramites220103.query";

import { CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_DESTINATARIO, CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_INSTALACI, TIPO_PERSONA } from "../../constantes/sanidad-acuicola-importacion.enum";
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormasDinamicasComponent } from "@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component";
/**
 * app-app-agregar-destinatario Componente
 */
@Component({
  selector: 'app-agregar-destinatario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputRadioComponent,
    FormasDinamicasComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './agregar-destinatario.component.html',
  styleUrl: './agregar-destinatario.component.scss',
})
export class AgregarDestinatarioComponent implements OnInit, OnDestroy {


    /**
     * Referencia al botón o elemento que cierra el modal de agregar destinatario o instalación.
     * Se utiliza para cerrar el modal programáticamente desde el componente.
     */
    @ViewChild('cerrarModal') cerrarModalRef!: ElementRef;
  /**
   * Indica si el componente opera en modo instalación (`true`) o destinatario (`false`).
   * Afecta la configuración del formulario y la lógica de guardado.
   * @default false
   */
  @Input() esModoInstalacion: boolean = false;

  /**
   * Enumeración de tipos de persona (Física/Moral).
   * Utilizado para configurar la lógica de visibilidad del formulario.
   */
  tipoPersona = TIPO_PERSONA;

  /**
   * Subject utilizado para limpiar suscripciones y evitar fugas de memoria.
   * Se usa con takeUntil en las suscripciones.
   * @private
   */
  private notificadorDestruccion$ = new Subject<void>();

  /**
   * Configuración del formulario dinámico para agregar un destinatario.
   * Define los campos, validaciones y apariencia del formulario en modo destinatario.
   */
  configuracionFormularioDestinatario: ModeloDeFormaDinamica[] = CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_DESTINATARIO;

  /**
   * Configuración del formulario dinámico para agregar una instalación.
   * Define los campos, validaciones y apariencia del formulario en modo instalación.
   */
  configuracionFormularioInstalacion: ModeloDeFormaDinamica[] = CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_INSTALACI;

  /**
   * Formulario reactivo para manejar los datos al agregar un destinatario.
   * Contiene los controles definidos en `configuracionFormularioDestinatario`.
   */
  formularioAgregarDestinatario!: FormGroup;

  /**
   * Formulario reactivo para manejar los datos al agregar una instalación.
   * Contiene los controles definidos en `configuracionFormularioInstalacion`.
   */
  formularioAgregarInstalacion!: FormGroup;

  /**
   * Estado actual del trámite 220103 obtenido del store.
   * Utilizado para prellenar campos y tomar decisiones lógicas.
   */
  estadoSeleccionado!: Tramite220103State;

  /**
   * Constructor del componente. Inyecta las dependencias necesarias.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite220103Query: Tramite220103Query,
    private tramite220103Store: Tramite220103Store,
    private servicio: SanidadAcuicolaImportacionService
  ) {}

  /**
   * Método del ciclo de vida de Angular. Se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener datos iniciales (colonias, estado del trámite),
   * inicializa el formulario reactivo y configura la visibilidad inicial de los campos
   * según el tipo de persona.
   */
  ngOnInit(): void {
    this.obtenerColonia();
    this.obtenerEstadoValor();
    this.inicializarFormulario();
    this.cambiarValoresTipoPersona();
  }

  /**
   * Inicializa el formulario reactivo principal (`formularioAgregarDestinatario` o `formularioAgregarInstalacion`)
   * basándose en el valor de `esModoInstalacion`. Establece el control 'tipoPersona' con
   * validación requerida y valor inicial obtenido del estado del trámite.
   */
  inicializarFormulario(): void {
    if (!this.esModoInstalacion) {
      this.formularioAgregarDestinatario = this.formBuilder.group({
        tipoPersona: [
          this.estadoSeleccionado?.['tipoPersona'] || '',
          Validators.required,
        ],
      });
    } else {
      this.formularioAgregarInstalacion = this.formBuilder.group({
        tipoPersona: [
          this.estadoSeleccionado?.['tipoPersona'] || '',
          Validators.required,
        ],
      });
    }
  }

  /**
   * Se suscribe al observable del estado del trámite (`Tramite220103Query`)
   * para obtener y almacenar el estado actual en `estadoSeleccionado`.
   * La suscripción se gestiona con `takeUntil` para limpiarse automáticamente
   * en `ngOnDestroy`.
   */
  obtenerEstadoValor(): void {
    this.tramite220103Query.selectTramite220103State$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estado: Tramite220103State) => {
        this.estadoSeleccionado = estado;
      });
  }

  /**
   * Llama al servicio `SanidadAcuicolaImportacionService` para obtener el catálogo de colonias.
   * Una vez recibidas las opciones, busca el campo 'colonia' en la configuración del
   * formulario de destinatario (`configuracionFormularioDestinatario`) y de instalación (`configuracionFormularioInstalacion`)
   * y actualiza sus `opciones`.
   * La suscripción se gestiona con `takeUntil`.
   */
  obtenerColonia(): void {
    this.servicio
      .getColonia()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones: Catalogo[]) => {
        this.configuracionFormularioDestinatario = this.configuracionFormularioDestinatario.map(campo => {
          if (campo.campo === 'colonia') {
            return { ...campo, opciones: [...opciones] };
          }
          return campo;
        });
        this.configuracionFormularioInstalacion = this.configuracionFormularioInstalacion.map(campo => {
          if (campo.campo === 'colonia') {
            return { ...campo, opciones: [...opciones] };
          }
          return campo;
        });
      });
  }

  /**
   * Ajusta la propiedad `mostrar` de los campos del formulario dinámico
   * ('nombre', 'primerApellido', 'segundoApellido', 'razonSocial')
   * basándose en el 'tipoPersona' seleccionado en el estado (`estadoSeleccionado`).
   * Opera sobre la configuración de formulario correcta (`configuracionFormularioDestinatario` o
   * `configuracionFormularioInstalacion`) según `esModoInstalacion`.
   * Muestra los campos de persona física si es 'Fisica', y 'razonSocial' si es 'Moral'.
   */
  cambiarValoresTipoPersona(): void {
    const TIPO_PERSONA_SELECCIONADA = this.estadoSeleccionado?.['tipoPersona'];

    if (!TIPO_PERSONA_SELECCIONADA) {
      return;
    }

    const CONFIG_FORM = this.esModoInstalacion
      ? this.configuracionFormularioInstalacion
      : this.configuracionFormularioDestinatario;

    const NOMBRES_CAMPOS = [
      'nombre',
      'primerApellido',
      'segundoApellido',
      'razonSocial',
    ];
    const CAMPOS = NOMBRES_CAMPOS.reduce((acc, nombreCampo) => {
      acc[nombreCampo] = CONFIG_FORM.find((campo) => campo.campo === nombreCampo);
      return acc;
    }, {} as Record<string, ModeloDeFormaDinamica | undefined>);

    const TODOS_CAMPOS_ENCONTRADOS = NOMBRES_CAMPOS.every((nombre) => CAMPOS[nombre]);

    if (TODOS_CAMPOS_ENCONTRADOS) {
      const ES_FISICA = TIPO_PERSONA_SELECCIONADA === 'Fisica';

      if (CAMPOS['nombre']) {
        CAMPOS['nombre'].mostrar = ES_FISICA;
      }
      if (CAMPOS['primerApellido']) {
        CAMPOS['primerApellido'].mostrar = ES_FISICA;
      }
      if (CAMPOS['segundoApellido']) {
        CAMPOS['segundoApellido'].mostrar = ES_FISICA;
      }
      if (CAMPOS['razonSocial']) {
        CAMPOS['razonSocial'].mostrar = !ES_FISICA;
      }
    }
  }

  /**
   * Actualiza una propiedad específica en el estado del trámite (`Tramite220103Store`).
   * Si el campo actualizado es 'tipoPersona', llama a `cambiarValoresTipoPersona`
   * para ajustar la visibilidad de los campos dependientes.
   * @param evento Objeto con el nombre del campo y el nuevo valor.
   * @param prop (Opcional) Propiedad adicional para actualizar en el estado.
   */
  establecerCambioDeValor(
    evento: { campo: string; valor: unknown },
    prop?: string
  ): void {
    this.tramite220103Store.setTramite220103State(
      evento.campo,
      evento.valor,
      prop
    );
    if (evento.campo === 'tipoPersona') {
      this.cambiarValoresTipoPersona();
    }
  }

  /**
   * Gestiona el proceso de guardar el destinatario o la instalación.
   * Valida el formulario correspondiente (`formularioAgregarInstalacion` o `formularioAgregarDestinatario`).
   * Si es válido:
   * 1. Llama al método de servicio apropiado (`getInstalacion` o `getDestinatario`) para actualizar la tabla correspondiente en el estado.
   * 3. Resetea el formulario correspondiente.
   * 4. Resetea el estado temporal en `Tramite220103Store` usado por este modal.
   * Si no es válido, marca todos los controles del formulario como 'touched' para mostrar errores de validación.
   */
  guardarDestinatario(): void {
    if (this.esModoInstalacion) {
      if (this.formularioAgregarInstalacion.valid) {
        this.getInstalacion();
        this.cerrarModal();
        this.formularioAgregarInstalacion.reset();
      } else {
        this.formularioAgregarInstalacion.markAllAsTouched();
      }
    } else {
      if (this.formularioAgregarDestinatario.valid) {
        this.getDestinatario();
        this.cerrarModal();
        this.formularioAgregarDestinatario.reset();
      } else {
        this.formularioAgregarDestinatario.markAllAsTouched();
      }
    }
  }

  /**
   * Llama al método `getDestinatario` del servicio `SanidadAcuicolaImportacionService`.
   * Se suscribe al resultado y actualiza la propiedad 'tablaDestinatario' en el
   * estado del trámite (`Tramite220103Store`) con los datos recibidos.
   * La suscripción se gestiona con `takeUntil`.
   */
  getDestinatario(): void {
    this.servicio
      .getDestinatario()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((valor: unknown) => {
        this.tramite220103Store.setTramite220103State(
          'tablaDestinatario',
          valor
        );
      });
  }

  /**
   * Llama al método `getInstalacion` del servicio `SanidadAcuicolaImportacionService`.
   * Se suscribe al resultado y actualiza la propiedad 'tablaInstalacion' en el
   * estado del trámite (`Tramite220103Store`) con los datos recibidos.
   * La suscripción se gestiona con `takeUntil`.
   */
  getInstalacion(): void {
    this.servicio
      .getInstalacion()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((valor: unknown) => {
        this.tramite220103Store.setTramite220103State(
          'tablaInstalacion',
          valor
        );
      });
  }

  /**
   * Cierra el modal de agregar destinatario o instalación.
   * Utiliza la referencia al elemento del modal (`cerrarModalRef`) para simular un clic
   * y cerrar el modal desde el código.
   */
  cerrarModal(): void {
    if (this.cerrarModalRef) {
      this.cerrarModalRef.nativeElement.click();
    }
  }

  /**
   * Método del ciclo de vida de Angular. Se ejecuta justo antes de que el componente sea destruido.
   * Emite un valor en `notificadorDestruccion$` y lo completa. Esto provoca que todas
   * las suscripciones que usan `takeUntil(this.notificadorDestruccion$)` se desuscriban
   * automáticamente, previniendo fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}