import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import { Solicitud32614State } from '../../estados/solicitud32614.store';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TransportistasTable } from '../../models/solicitud.model';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Decorador que define el componente 'AgregarTransportistasComponent'.
 * Incluye configuración de selector, template, estilos y módulos importados.
 */
@Component({
  selector: 'app-agregar-transportistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './agregar-transportistas.component.html',
  styleUrl: './agregar-transportistas.component.scss',
})
/**
 * Decorador que define el componente 'AgregarTransportistasComponent'.
 * Incluye configuración de selector, template, estilos y módulos importados.
 */
export class AgregarTransportistasComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para capturar datos del transportista */
  transportistaCertificacionForm!: FormGroup;

  /** Sujeto utilizado para cancelar suscripciones y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud obtenido desde el store */
  solicitud32614State: Solicitud32614State = {} as Solicitud32614State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Evento que emite los datos del transportista seleccionado al componente padre */
  @Output() transportistasDatos = new EventEmitter<TransportistasTable>();

  /**
   * Constructor del componente. Se inyectan los servicios necesarios para formularios y gestión de estado.
   */
  constructor(
    private fb: FormBuilder,
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

  /**
   * Ciclo de vida ngOnInit: inicializa el formulario y se suscribe al estado de la solicitud.
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
      this.transportistaCertificacionForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.transportistaCertificacionForm.enable();
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
    this.transportistaCertificacionForm = this.fb.group({
      transportistaRFC: [
        this.solicitud32614State.transportistaRFC,
        [Validators.required, Validators.maxLength(13)],
      ],
      transportistaRFCModifTrans: [
        {
          value: this.solicitud32614State.transportistaRFCModifTrans,
          disabled: true,
        },
        [Validators.maxLength(13)],
      ],
      transportistaRazonSocial: [
        {
          value: this.solicitud32614State.transportistaRazonSocial,
          disabled: true,
        },
        [Validators.maxLength(254)],
      ],
      transportistaDomicilio: [
        {
          value: this.solicitud32614State.transportistaDomicilio,
          disabled: true,
        },
        [Validators.maxLength(300)],
      ],
      transportistaCaat: [
        { value: this.solicitud32614State.transportistaCaat, disabled: true },
        [Validators.maxLength(254)],
      ],
      transportistaIdDomicilio: [
        this.solicitud32614State.transportistaIdDomicilio,
      ],
      transportistaIdRFC: [this.solicitud32614State.transportistaIdRFC],
      transportistaIdRazonSocial: [
        this.solicitud32614State.transportistaIdRazonSocial,
      ],
      transportistaIdCaat: [this.solicitud32614State.transportistaIdCaat],
    });

    /** Se suscribe al estado de la solicitud para mantener sincronizado el formulario */
    this.solicitud32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32614State) => {
          this.solicitud32614State = respuesta;
          this.transportistaCertificacionForm.patchValue({
            transportistaRFC: respuesta.transportistaIdRFC,
            transportistaRFCModifTrans: respuesta.transportistaRFCModifTrans,
            transportistaRazonSocial: respuesta.transportistaIdRazonSocial,
            transportistaDomicilio: respuesta.transportistaDomicilio,
            transportistaCaat: respuesta.transportistaCaat,
          });
        })
      )
      .subscribe();
  }

  /**
   * Actualiza el RFC del transportista en el store.
   */
  actualizarTransportistaRFC(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTransportistaRFC(VALOR);
  }

  /**
   * Actualiza el RFC modificado del transportista en el store.
   */
  actualizarTransportistaRFCModifTrans(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTransportistaRFCModifTrans(VALOR);
  }

  /**
   * Actualiza la razón social del transportista en el store.
   */
  actualizarTransportistaRazonSocial(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTransportistaRazonSocial(VALOR);
  }

  /**
   * Actualiza el domicilio del transportista en el store.
   */
  actualizarTransportistaDomicilio(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTransportistaDomicilio(VALOR);
  }

  /**
   * Actualiza el CAAT del transportista en el store.
   */
  actualizarTransportistaCaat(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32614Store.actualizarTransportistaCaat(VALOR);
  }

  /**
   * Verifica si un control del formulario es inválido y ha sido tocado.
   * @param id ID del control del formulario
   * @returns booleano que indica si el campo es inválido
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.transportistaCertificacionForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Ejecuta la búsqueda del transportista si el RFC ha sido ingresado.
   */
  selectBuscarTransportista(): void {
    if (this.transportistaCertificacionForm.get('transportistaRFC')?.value) {
      this.conseguirTransportistasLista();
    }
  }

  /**
   * Llama al servicio para obtener la lista de transportistas y actualiza el store.
   */
  conseguirTransportistasLista(): void {
    this.solicitudService
      .conseguirTransportistasLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: TransportistasTable[]) => {
          this.solicitud32614Store.actualizarTransportistaRazonSocial(
            respuesta[0].razonSocial
          );
          this.solicitud32614Store.actualizarTransportistaDomicilio(
            respuesta[0].domicilio
          );
          this.solicitud32614Store.actualizarTransportistaCaat(
            respuesta[0].caat
          );
        },
      });
  }

  /**
   * Prepara un objeto con los datos del transportista y lo emite al componente padre.
   */
  aceptarTransportista(): void {
    const OBJETO_JSON: TransportistasTable = {
      rfc: this.transportistaCertificacionForm.get('transportistaRFCModifTrans')
        ?.value,
      razonSocial: this.transportistaCertificacionForm.get(
        'transportistaRazonSocial'
      )?.value,
      domicilio: this.transportistaCertificacionForm.get(
        'transportistaDomicilio'
      )?.value,
      caat: this.transportistaCertificacionForm.get('transportistaCaat')?.value,
    };
    this.transportistasDatos.emit(OBJETO_JSON);
  }

  /**
   * Ciclo de vida ngOnDestroy: finaliza el observable para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
