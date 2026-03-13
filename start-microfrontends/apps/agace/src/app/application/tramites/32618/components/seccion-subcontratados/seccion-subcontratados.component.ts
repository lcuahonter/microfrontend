import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';


import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NumeroDeEmpleados } from '../../models/solicitud.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SeccionSubcontratados } from '../../models/solicitud.model';
import { SolicitudCatologoSelectLista } from '../../models/solicitud.model';
import { SolicitudQuery } from '../../estados/solicitud.query';
import { SolicitudState } from '../../estados/solicitud.store';
import { SolicitudStore } from '../../estados/solicitud.store';   
import { SolicitudeService } from '../../services/solicitude.service';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/** Selector del componente, utilizado para integrarlo en el HTML
 *  Indica que este componente es independiente (standalone) y no depende de un módulo Angular específico
 *  Importación de módulos necesarios para el componente
 *  Servicios que estarán disponibles para este componente
 */
@Component({
  selector: 'app-seccion-subcontratados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
  ],
  templateUrl: './seccion-subcontratados.component.html',
 
})
/** Selector del componente, utilizado para integrarlo en el HTML
 *  Indica que este componente es independiente (standalone) y no depende de un módulo Angular específico
 *  Importación de módulos necesarios para el componente
 *  Servicios que estarán disponibles para este componente
 */
export class SeccionSubcontratadosComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para manejar los datos de los subcontratados */
  subcontratadosForm!: FormGroup;

  /** Sujeto para manejar la destrucción de observables y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Objeto que contiene la información del bimestre */
  bimestre: CatalogosSelect = {} as CatalogosSelect;

  /** Estado que contiene los datos de la solicitud */
  SolicitudState: SolicitudState = {} as SolicitudState;

  /** Emisor de eventos con los datos de subcontratados */
  @Output() seccionSubcontratados = new EventEmitter<NumeroDeEmpleados>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  constructor(
    /** Servicio para crear formularios reactivos */
    private fb: FormBuilder,

    /** Servicio para gestionar las solicitudes */
    private solicitudService: SolicitudeService,

    /** Store para gestionar el estado de la solicitud 32618 */
    private solicitudStore: SolicitudStore,

    /** Query para obtener datos del store de solicitud 32618 */
    private SolicitudQuery: SolicitudQuery,
    /** Servicio para consultar el estado de la consulta */
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    /** Obtiene la lista de catálogos cuando se inicializa el componente */
    this.conseguirSolicitudCatologoSelectLista();
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
      this.subcontratadosForm.disable();
    } else {
      this.subcontratadosForm.enable();
    } 
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `SolicitudState`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    /** Inicializa el formulario reactivo con validadores */
    this.subcontratadosForm = this.fb.group({
      subcontrataRFCBusqueda: [
        '',
        [Validators.required, Validators.maxLength(13)],
      ],
      subcontrataRFC: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(13)],
      ],
      subcontrataRazonSocial: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(254)],
      ],
      subcontrataEmpleados: [
        '',
        [Validators.required, Validators.maxLength(5)],
      ],
      subcontrataBimestre: ['', [Validators.required]],
    });

    /** Suscripción al estado de la solicitud para actualizar el formulario con los datos */
    this.SolicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$), // Asegura que la suscripción se cancele al destruir el componente
        map((respuesta: SolicitudState) => {
          this.SolicitudState = respuesta; // Asigna el estado a la variable
          this.subcontratadosForm.patchValue({
            subcontrataRFCBusqueda:
              this.SolicitudState.subcontrataRFCBusqueda,
            subcontrataRFC: this.SolicitudState.subcontrataRFC,
            subcontrataRazonSocial:
              this.SolicitudState.subcontrataRazonSocial,
            subcontrataEmpleados: this.SolicitudState.subcontrataEmpleados,
            subcontrataBimestre: this.SolicitudState.subcontrataBimestre,
          });
        })
      )
      .subscribe();
  }

  /** Método para obtener la lista de catálogos de solicitud */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.bimestre = respuesta.bimestre;
        },
      });
  }

  /** Método para buscar la información de subcontratados por RFC */
  buscarRFC(): void {
    this.solicitudService
      .conseguirSeccionSubcontratados()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SeccionSubcontratados) => {
          /** Actualiza el estado del RFC y la razón social con los datos obtenidos */
          this.solicitudStore.actualizarSubcontrataRFC(
            respuesta.subcontrataRFC
          );
          this.solicitudStore.actualizarSubcontrataRazonSocial(
            respuesta.subcontrataRazonSocial
          );
        },
      });
  }

  /** Método para actualizar el RFC de búsqueda en el store */
  actualizarSubcontrataRFCBusqueda(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarSubcontrataRFCBusqueda(VALOR);
  }

  /** Método para actualizar el RFC de la subcontratista en el store */
  actualizarSubcontrataRFC(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarSubcontrataRFC(VALOR);
  }

  /** Método para actualizar la razón social de la subcontratista en el store */
  actualizarSubcontrataRazonSocial(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarSubcontrataRazonSocial(VALOR);
  }

  /** Método para actualizar el número de empleados en el store */
  actualizarSubcontrataEmpleados(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarSubcontrataEmpleados(VALOR);
  }

  /** Método para actualizar el bimestre en el store */
  actualizarSubcontrataBimestre(evento: Catalogo): void {
    this.solicitudStore.actualizarSubcontrataBimestre(evento.id);
  }

  /** Método para emitir los datos del formulario al componente padre */
  cerrarModal(): void {
    const OBJETO_JSON = {
      denominacion: this.subcontratadosForm.get('subcontrataRazonSocial')
        ?.value,
      RFC: this.subcontratadosForm.get('subcontrataRFC')?.value,
      numeroDeEmpleados: this.subcontratadosForm.get('subcontrataEmpleados')
        ?.value,
      bimestre: this.subcontratadosForm.get('subcontrataBimestre')?.value,
    };

    this.seccionSubcontratados.emit(OBJETO_JSON); // Emite los datos al componente padre
  }

  /** Método que se ejecuta cuando el componente se destruye, cancelando la suscripción */
  ngOnDestroy(): void {
    this.destroy$.next(); // Desactiva la suscripción
    this.destroy$.complete(); // Completa el sujeto de destrucción
  }
}
