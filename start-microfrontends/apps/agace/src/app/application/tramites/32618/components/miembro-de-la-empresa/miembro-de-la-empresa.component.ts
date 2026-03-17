import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadio } from '../../models/solicitud.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { RadioOptions } from '../../models/solicitud.model';
import { ReactiveFormsModule } from '@angular/forms';
import { SeccionSociosIC } from '../../models/solicitud.model';
import { SolicitudCatologoSelectLista } from '../../models/solicitud.model';
import { SolicitudQuery } from '../../estados/solicitud.query';
import { SolicitudRadioLista } from '../../models/solicitud.model';
import { SolicitudState } from '../../estados/solicitud.store';
import { SolicitudStore} from '../../estados/solicitud.store';
import { SolicitudeService } from '../../services/solicitude.service';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


/** Componente que representa un miembro de la empresa */
@Component({
  selector: 'app-miembro-de-la-empresa', // /** Identificador del componente en la plantilla */
  standalone: true, // /** Indica que el componente es independiente */
  imports: [
    CommonModule, // /** Módulo común de Angular */
    ReactiveFormsModule, // /** Módulo para formularios reactivos */
    TituloComponent, // /** Componente para mostrar el título */
    CatalogoSelectComponent, // /** Componente para selección de catálogo */
    InputRadioComponent, // /** Componente para botones de opción */
  ],
  templateUrl: './miembro-de-la-empresa.component.html', // /** Ruta de la plantilla HTML del componente */
 
})
/** Componente que representa un miembro de la empresa */
export class MiembroDeLaEmpresaComponent implements OnInit, OnDestroy {
  /** Evento para cerrar el modal */
  @Output() eventoCerrarModal = new EventEmitter<void>();

  /** Formulario para gestionar datos del miembro de la empresa */
  miembroEmpresaForm!: FormGroup;

  /** Valor seleccionado para obligación de tributar */
  seleccionarObligadoTributar: number | string = 0;

  /** Valor seleccionado para tipo de persona */
  seleccionarTipoDePersona: number = 0;

  /** Subject utilizado para destruir observables y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Opción seleccionada para "Sí" o "No" */
  sinoOpcion: InputRadio = {} as InputRadio;

  /** Estado actual de la solicitud  */
  SolicitudState: SolicitudState = {} as SolicitudState;

  /** Lista de opciones para el carácter del miembro */
  enSuCaracterDeLista: CatalogosSelect = {} as CatalogosSelect;

  /** Lista de opciones de nacionalidad */
  nacionalidadLista: CatalogosSelect = {} as CatalogosSelect;

  /** Lista de opciones para el tipo de persona */
  tipoDePersonaLista: CatalogosSelect = {} as CatalogosSelect;

  /** Evento para actualizar los datos del miembro de la empresa */
  @Output() eventoActualizarMiembro = new EventEmitter<SeccionSociosIC>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Constructor del componente */
  constructor(
    public fb: FormBuilder, // /** Servicio para manejar formularios reactivos */
    public solicitudService: SolicitudeService, // /** Servicio para manejar solicitudes */
    public solicitudStore: SolicitudStore, // /** Estado de la solicitud */
    public SolicitudQuery: SolicitudQuery, // /** Consultas sobre la solicitud */
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirSolicitudCatologoSelectLista(); // /** Obtiene los datos generales del catálogo */
    this.conseguirOpcionDeRadio(); // /** Obtiene las opciones de radio */
  }

  /** Inicializa el formulario para gestionar datos del miembro de la empresa */
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
      this.miembroEmpresaForm.disable();
    } else {
      this.miembroEmpresaForm.enable();
    } 
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `SolicitudState`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    this.miembroEmpresaForm = this.fb.group({
      /** Caracter del miembro dentro de la empresa */
      miembroCaracterDe: [
        { value: this.SolicitudState.miembroCaracterDe, disabled: false },
        [Validators.required],
      ],
      /** Indica si el miembro está obligado a tributar en México */
      miembroTributarMexico: [
        {
          value: this.SolicitudState.miembroTributarMexico,
          disabled: false,
        },
        [Validators.required],
      ],
      /** Nacionalidad del miembro */
      miembroNacionalidad: [
        {
          value: this.SolicitudState.miembroNacionalidad,
          disabled: false,
        },
        [Validators.required],
      ],
      /** RFC del miembro */
      miembroRfc: [
        { value: this.SolicitudState.miembroRfc, disabled: false },
        [Validators.required],
      ],
      /** Registro federal del miembro */
      miembroRegistroFederal: [
        {
          value: this.SolicitudState.miembroRegistroFederal,
          disabled: true,
        },
        [Validators.required],
      ],
      /** Nombre completo del miembro */
      miembroNombreCompleto: [
        {
          value: this.SolicitudState.miembroNombreCompleto,
          disabled: true,
        },
        [Validators.required],
      ],
      /** Tipo de persona (física o moral) */
      miembroTipoPersonaMuestra: [
        {
          value: this.SolicitudState.miembroTipoPersonaMuestra,
          disabled: false,
        },
        [Validators.required],
      ],
      /** Nombre del miembro */
      miembroNombre: [
        { value: this.SolicitudState.miembroNombre, disabled: false },
        [Validators.required],
      ],
      /** Apellido paterno del miembro */
      miembroApellidoPaterno: [
        {
          value: this.SolicitudState.miembroApellidoPaterno,
          disabled: false,
        },
        [Validators.required],
      ],
      /** Apellido materno del miembro */
      miembroApellidoMaterno: [
        {
          value: this.SolicitudState.miembroApellidoMaterno,
          disabled: false,
        },
        [Validators.required],
      ],
      /** Nombre de la empresa asociada al miembro */
      miembroNombreEmpresa: [
        {
          value: this.SolicitudState.miembroNombreEmpresa,
          disabled: false,
        },
        [Validators.required],
      ],
    });

    /** Escucha cambios en el estado de la solicitud y actualiza el formulario */
    this.SolicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: SolicitudState) => {
          this.SolicitudState = respuesta;
          this.miembroEmpresaForm.patchValue({
            miembroCaracterDe: this.SolicitudState.miembroCaracterDe,
            miembroTributarMexico:
              this.SolicitudState.miembroTributarMexico,
            miembroNacionalidad: this.SolicitudState.miembroNacionalidad,
            miembroRfc: this.SolicitudState.miembroRfc,
            miembroRegistroFederal:
              this.SolicitudState.miembroRegistroFederal,
            miembroNombreCompleto:
              this.SolicitudState.miembroNombreCompleto,
            miembroTipoPersonaMuestra:
              this.SolicitudState.miembroTipoPersonaMuestra,
            miembroNombre: this.SolicitudState.miembroNombre,
            miembroApellidoPaterno:
              this.SolicitudState.miembroApellidoPaterno,
            miembroApellidoMaterno:
              this.SolicitudState.miembroApellidoMaterno,
            miembroNombreEmpresa: this.SolicitudState.miembroNombreEmpresa,
          });
        })
      )
      .subscribe();
  }

  /** Obtiene los datos generales del catálogo */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        /** Procesa la respuesta y asigna los valores correspondientes */
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.enSuCaracterDeLista = respuesta.enSuCaracterDe; // /** Lista de opciones para el carácter del miembro */
          this.nacionalidadLista = respuesta.nacionalidad; // /** Lista de opciones de nacionalidad */
          this.tipoDePersonaLista = respuesta.tipoDePersona; // /** Lista de opciones para el tipo de persona */
        },
      });
  }

  /**
   * Obtiene los datos generales correspondientes a las opciones de tipo de radio.
   * Asigna los valores recibidos a las propiedades correspondientes del componente.
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Cierra el modal y emite el evento correspondiente.
   */
  cerrarModal(): void {
    this.eventoCerrarModal.emit();
  }

  /**
   * Actualiza el carácter del miembro.
   * @param {Catalogo} evento - Datos del catálogo seleccionados.
   */
  actualizarMiembroCaracterDe(evento: Catalogo): void {
    this.solicitudStore.actualizarMiembroCaracterDe(evento.id);
  }

  /**
   * Actualiza la obligación de tributar en México.
   * @param {number | string} evento - Identificador de la obligación.
   */
  actualizarMiembroTributarMexico(evento: number | string): void {
    this.seleccionarObligadoTributar = evento;
    this.solicitudStore.actualizarMiembroTributarMexico(evento);
  }

  /**
   * Actualiza la nacionalidad del miembro.
   * @param {Catalogo} evento - Datos del catálogo seleccionados.
   */
  actualizarMiembroNacionalidad(evento: Catalogo): void {
    this.solicitudStore.actualizarMiembroNacionalidad(evento.id);
  }

  /**
   * Actualiza el RFC del miembro.
   * @param {Event} evento - Evento de entrada con el nuevo valor.
   */
  actualizarMiembroRFC(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMiembroRFC(VALOR);
  }

  /**
   * Actualiza el tipo de persona muestra.
   * @param {Catalogo} evento - Datos del catálogo seleccionados.
   */
  actualizarMiembroTipoPersonaMuestra(evento: Catalogo): void {
    this.solicitudStore.actualizarMiembroTipoPersonaMuestra(evento.id);
    this.seleccionarTipoDePersona = evento.id;
  }

  /**
   * Actualiza el nombre del miembro.
   * @param {Event} evento - Evento de entrada con el nuevo valor.
   */
  actualizarMiembroNombre(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMiembroNombre(VALOR);
  }

  /**
   * Actualiza el apellido paterno del miembro.
   * @param {Event} evento - Evento de entrada con el nuevo valor.
   */
  actualizarMiembroApellidoPaterno(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMiembroApellidoPaterno(VALOR);
  }

  /**
   * Actualiza el apellido materno del miembro.
   * @param {Event} evento - Evento de entrada con el nuevo valor.
   */
  actualizarMiembroApellidoMaterno(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMiembroApellidoMaterno(VALOR);
  }

  /**
   * Actualiza el nombre de la empresa del miembro.
   * @param {Event} evento - Evento de entrada con el nuevo valor.
   */
  actualizarMiembroNombreEmpresa(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMiembroNombreEmpresa(VALOR);
  }

  /**
   * Busca los datos del RFC del miembro y actualiza la información en la solicitud.
   */
  buscarRFCDatos(): void {
    const VALOR = this.miembroEmpresaForm.get('miembroRfc')?.value;
    if (VALOR) {
      this.solicitudStore.actualizarMiembroRegistroFederal(
        'MAVL621207C95'
      );
      this.solicitudStore.actualizarMiembroNombreCompleto(
        'EUROFOODS DE MEXICO GONZALEZ PINAL'
      );
    }
  }

  /**
   * Acepta el modal y recopila los valores seleccionados.
   */
  aceptarModal(): void {
    let CARACTER_DE_VALOR = '';
    let NACIONALIDAD_VALOR = '';
    let TIPO_PERSONA_VALOR = '';
    let TRIBUTAR_MEXICO_VALOR = '';

    /**
     * Obtiene la descripción del carácter del miembro.
     */
    this.enSuCaracterDeLista?.catalogos.forEach((element: Catalogo) => {
      if (
        element.id === this.miembroEmpresaForm.get('miembroCaracterDe')?.value
      ) {
        CARACTER_DE_VALOR = element.descripcion;
      }
    });

    /**
     * Obtiene la descripción de la nacionalidad del miembro.
     */
    this.nacionalidadLista.catalogos.forEach((element: Catalogo) => {
      if (
        element.id === this.miembroEmpresaForm.get('miembroNacionalidad')?.value
      ) {
        NACIONALIDAD_VALOR = element.descripcion;
      }
    });

    /**
     * Obtiene la descripción del tipo de persona.
     */
    this.tipoDePersonaLista.catalogos.forEach((element: Catalogo) => {
      if (
        element.id ===
        this.miembroEmpresaForm.get('miembroTipoPersonaMuestra')?.value
      ) {
        TIPO_PERSONA_VALOR = element.descripcion;
      }
    });

    /**
     * Obtiene la etiqueta de la opción de tributar en México.
     */
    this.sinoOpcion.radioOptions.forEach((element: RadioOptions) => {
      if (
        element.value ===
        this.miembroEmpresaForm.get('miembroTributarMexico')?.value
      ) {
        TRIBUTAR_MEXICO_VALOR = element.label;
      }
    });

    /**
     * Conjunto de valores recopilados y emitidos en el evento de actualización.
     */
    const VALORES = {
      tipoPersonaMuestra: TIPO_PERSONA_VALOR,
      nombreCompleto: this.miembroEmpresaForm.get('miembroNombreCompleto')
        ?.value,
      rfc: this.miembroEmpresaForm.get('miembroRfc')?.value,
      caracterDe: CARACTER_DE_VALOR,
      nacionalidad: NACIONALIDAD_VALOR,
      paisNombre: this.miembroEmpresaForm.get('miembroNombre')?.value,
      nombreEmpresa: this.miembroEmpresaForm.get('miembroNombreEmpresa')?.value,
      tributarMexico: TRIBUTAR_MEXICO_VALOR,
      razonSocial: this.miembroEmpresaForm.get('miembroRegistroFederal')?.value,
    };

    this.eventoActualizarMiembro.emit(VALORES);
  }

  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.miembroEmpresaForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Finaliza todas las suscripciones observables usando el subject destroy$.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
