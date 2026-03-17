import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { EnlaceOperativo } from '../../models/solicitud.model';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { REGEX_TELEFONO_DIGITOS } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegal } from '../../models/solicitud.model';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import { Solicitud32614State } from '../../estados/solicitud32614.store';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/**
 * Componente para agregar un enlace operativo.
 * Utiliza un formulario reactivo para capturar y emitir la información del enlace operativo.
 */
@Component({
  selector: 'app-agregar-enlace-operativo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './agregar-enlace-operativo.component.html',
  styleUrl: './agregar-enlace-operativo.component.scss',
})
/**
 * Componente para agregar un enlace operativo.
 * Utiliza un formulario reactivo para capturar y emitir la información del enlace operativo.
 */
export class AgregarEnlaceOperativoComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para capturar los datos del enlace operativo */
  agregarEnlaceOperativoForm!: FormGroup;

  /** Subject para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud */
  solicitud32614State: Solicitud32614State = {} as Solicitud32614State;

  /** Evento para emitir el objeto EnlaceOperativo al componente padre */
  @Output() agregarEnlaceOperativo = new EventEmitter<EnlaceOperativo>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor de la clase que inicializa las dependencias necesarias.
   *
   * @param fb - Constructor de formularios reactivos.
   * @param solicitudService - Servicio para obtener y gestionar los datos de la solicitud.
   * @param solicitud32614Store - Store de Akita para el estado de la solicitud 32614.
   * @param solicitud32614Query - Consulta (query) de Akita para acceder al estado de la solicitud 32614.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32614Store: Solicitud32614Store,
    public solicitud32614Query: Solicitud32614Query,
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
  }

  /** Inicializa el formulario y suscribe al estado de la solicitud */
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
      this.agregarEnlaceOperativoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.agregarEnlaceOperativoForm.enable();
    }
  }

  /**
   * Inicializa el formulario `agregarEnlaceOperativoForm` con los valores actuales
   * del estado `solicitud32614State`.
   *
   * Algunos campos están deshabilitados porque no deben ser editables por el usuario.
   * Aplica validaciones como `required`, `email`, y un patrón para el teléfono.
   *
   * Además, se suscribe a los cambios del estado de la solicitud (`selectSolicitud$`)
   * y actualiza los valores del formulario mediante `patchValue`.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.agregarEnlaceOperativoForm = this.fb.group({
      agregarEnlaceRfcTercero: [
        this.solicitud32614State.rfcTercero,
        [Validators.required],
      ],
      agregarEnlaceRfc: [
        { value: this.solicitud32614State.rfc, disabled: true },
      ],
      agregarEnlaceNombre: [
        { value: this.solicitud32614State.nombre, disabled: true },
      ],
      agregarEnlaceApellidoPaterno: [
        { value: this.solicitud32614State.apellidoPaterno, disabled: true },
      ],
      agregarEnlaceApellidoMaterno: [
        { value: this.solicitud32614State.apellidoMaterno, disabled: true },
      ],
      agregarEnlaceCiudadEstado: [
        {
          value: this.solicitud32614State.agregarEnlaceCiudadEstado,
          disabled: true,
        },
      ],
      agregarEnlaceCargo: [this.solicitud32614State.agregarEnlaceCargo],
      agregarEnlaceTelefono: [
        this.solicitud32614State.telefono,
        [Validators.required, Validators.pattern(REGEX_TELEFONO_DIGITOS)],
      ],
      agregarEnlaceCorreoElectronico: [
        this.solicitud32614State.correoElectronico,
        [Validators.required, Validators.email],
      ],
      agregarEnlaceSuplente: [this.solicitud32614State.agregarEnlaceSuplente],
    });

    /** Escucha los cambios en el estado de la solicitud y actualiza el formulario */
    this.solicitud32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32614State) => {
          this.solicitud32614State = respuesta;
          this.agregarEnlaceOperativoForm.patchValue({
            agregarEnlaceRfcTercero: this.solicitud32614State.rfcTercero,
            agregarEnlaceRfc: this.solicitud32614State.rfc,
            agregarEnlaceNombre: this.solicitud32614State.nombre,
            agregarEnlaceApellidoPaterno:
              this.solicitud32614State.apellidoPaterno,
            agregarEnlaceApellidoMaterno:
              this.solicitud32614State.apellidoMaterno,
            agregarEnlaceCiudadEstado:
              this.solicitud32614State.agregarEnlaceCiudadEstado,
            agregarEnlaceCargo: this.solicitud32614State.agregarEnlaceCargo,
            agregarEnlaceTelefono: this.solicitud32614State.telefono,
            agregarEnlaceCorreoElectronico:
              this.solicitud32614State.correoElectronico,
            agregarEnlaceSuplente:
              this.solicitud32614State.agregarEnlaceSuplente,
          });
        })
      )
      .subscribe();
  }

  /**
   * Llama al servicio para obtener los datos del representante legal
   * y actualiza el estado con esos datos.
   */
  buscarTerceroNacionalIDC(): void {
    if (this.agregarEnlaceOperativoForm.get('rfcTercero')?.value) {
      this.solicitudService
        .conseguirRepresentanteLegalDatos()
        .pipe(takeUntil(this.destroy$))
        .subscribe((respuesta: RepresentanteLegal) => {
          this.solicitud32614Store.actualizarEnlaceRfc(respuesta.rfc);
          this.solicitud32614Store.actualizarEnlaceNombre(respuesta.nombre);
          this.solicitud32614Store.actualizarEnlaceApellidoPaterno(
            respuesta.apellidoPaterno
          );
          this.solicitud32614Store.actualizarEnlaceApellidoMaterno(
            respuesta.apellidoMaterno
          );
          this.solicitud32614Store.actualizarEnlaceTelefono(respuesta.telefono);
          this.solicitud32614Store.actualizarEnlaceCorreoElectronico(
            respuesta.correoElectronico
          );
        });
    }
  }

  /** Actualiza el RFC del tercero en el store */
  actualizarRfcTercero(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarRfcTercero(VALOR);
  }

  /** Actualiza el teléfono en el store */
  actualizarTelefono(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTelefono(VALOR);
  }

  /** Actualiza el correo electrónico en el store */
  actualizarCorreoElectronico(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarCorreoElectronico(VALOR);
  }

  /** Actualiza el cargo en el store */
  agregarEnlaceCargo(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarEnlaceCargo(VALOR);
  }

  /** Actualiza el valor del campo suplente en el store */
  actualizarEnlaceSuplente(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).checked;
    this.solicitud32614Store.actualizarEnlaceSuplente(VALOR);
  }

  /**
   * Construye el objeto EnlaceOperativo con los valores del formulario
   * y lo emite al componente padre.
   */
  aceptarEnlaceSuplente(): void {
    const OBJETO_JSON: EnlaceOperativo = {
      rfc: this.agregarEnlaceOperativoForm.get('agregarEnlaceRfc')?.value,
      nombre: this.agregarEnlaceOperativoForm.get('agregarEnlaceNombre')?.value,
      apellidoPaterno: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceApellidoPaterno'
      )?.value,
      apellidoMaterno: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceApellidoMaterno'
      )?.value,
      claveCiudad: '',
      ciudad: this.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')
        ?.value,
      cargo: this.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.value,
      telefono: this.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')
        ?.value,
      correo: this.agregarEnlaceOperativoForm.get(
        'agregarEnlaceCorreoElectronico'
      )?.value,
      suplente:
        this.agregarEnlaceOperativoForm.get('agregarEnlaceSuplente')?.value ===
        true
          ? 'Maria López'
          : '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      codigoPostal: '',
      localidad: '',
      delegacionMunicipio: '',
    };
    this.agregarEnlaceOperativo.emit(OBJETO_JSON);
  }

  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.agregarEnlaceOperativoForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /** Finaliza todas las suscripciones para evitar fugas de memoria */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
