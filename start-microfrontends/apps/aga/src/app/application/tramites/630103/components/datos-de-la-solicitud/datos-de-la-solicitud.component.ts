/**
 * datos-de-la-solicitud.component.ts
 * Componente que gestiona los datos de la solicitud para el trámite 630103.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { takeUntil } from 'rxjs';

import { Subject} from 'rxjs';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { FORMULARIO_DATOS_SOLICITUD } from '../../enum/autorizacion-importacion-temporal.enum';
import { Tramite630103Query } from '../../estados/tramite630103.query';

import { Tramite630103State, Tramite630103Store } from '../../estados/tramite630103.store';
import { AutorizacionImportacionTemporalService } from '../../services/autorizacion-importacion-temporal.service';

/**
 * Componente que gestiona los datos de la solicitud para el trámite 630103.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;
  
  /**
   * Modelo dinámico del formulario con estructura definida por el trámite.
   * {ModeloDeFormaDinamica[]}
   */
  formularioDatosSolicitud: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_SOLICITUD;

  /**
   * Formulario reactivo para los datos de importación temporal.
   * {FormGroup}
   */
  datosImportacionTemporalFormulario!: FormGroup;

  /**
   * Subject para manejar la destrucción de suscripciones.
   * {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado actual del trámite cargado desde el store.
   * {Tramite630103State}
   */
  estadoSeleccionado!: Tramite630103State;

  /**
   * Estado de la solicitud actual.
   * {Tramite630103State}
   */
  public solicitudState!: Tramite630103State;

  /**
   * Constructor del componente.
   * {FormBuilder} formBuilder - Constructor de formularios reactivos.
   * {AutorizacionImportacionTemporalService} autorizacionImportacionTemporalService - Servicio para obtener datos de catálogos.
   * {Tramite630103Store} tramite630103Store - Store para actualizar el estado del trámite.
   * {Tramite630103Query} tramite630103Query - Query para observar el estado del trámite.
   * {ConsultaioQuery} consultaioQuery - Query para observar el estado de solo lectura.
   */
  constructor(
    private formBuilder: FormBuilder,
    private autorizacionImportacionTemporalService: AutorizacionImportacionTemporalService,
    private tramite630103Store: Tramite630103Store,
    private tramite630103Query: Tramite630103Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.datosImportacionTemporalFormulario = this.formBuilder.group({});
    
  }


  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * {void}
   */
  guardarDatosFormulario(): void {
    if (this.esSoloLectura) {
      this.datosImportacionTemporalFormulario.disable();
    } else {
      this.datosImportacionTemporalFormulario.enable();
    }
  }

  /**
   * Ciclo de vida: Inicializa el formulario y carga datos de catálogos al iniciar el componente.
   * {void}
   */
  ngOnInit(): void {
    this.getValorStore();
    this.obtenerEstadoValor()
    this.getAduanaDeIngreso();
    this.getSeccionAduanera();
  }
  
  /**
   * Se suscribe al observable del estado del trámite (`Tramite220103Query`)
   * para obtener y almacenar el estado actual en `estadoSeleccionado`.
   * La suscripción se gestiona con `takeUntil` para limpiarse automáticamente
   * en `ngOnDestroy`.
   */
  obtenerEstadoValor(): void {
   this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estadoConsulta) => {
      this.esSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario()
    });
  }
  
  /**
   * Obtiene las opciones de Aduanas de Ingreso y las asigna al formulario dinámico.
   * {void}
   */
  getAduanaDeIngreso(): void {
    this.autorizacionImportacionTemporalService.getAduanaDeIngreso()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const ADUANA_INGRESO = this.formularioDatosSolicitud.find((item) => item.id === 'cveAduana');
        if (ADUANA_INGRESO) {
          ADUANA_INGRESO.opciones = data;
        }
      });
  }

  /**
   * Obtiene las opciones de Sección Aduanera desde el servicio.
   * {void}
   */
  getSeccionAduanera(): void {
    this.autorizacionImportacionTemporalService.getSeccionAduanera()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const SECCION_ADUANERA = this.formularioDatosSolicitud.find((item) => item.id === 'cveSeccionAduanera');
        if (SECCION_ADUANERA) {
          SECCION_ADUANERA.opciones = data;
        }
      });
  }

  /**
   * Observa los cambios del store del trámite y actualiza el estado local.
   * {void}
   */
  getValorStore(): void {
    this.tramite630103Query.selectTramite630103State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Establece un nuevo valor en el store del trámite según el evento emitido desde el formulario.
   * {{ campo: string; valor: unknown }} $event - Evento con el campo y el valor a establecer.
   * {void}
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630103Store.setTramite630103State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630103Store.setTramite630103State($event.campo, $event.valor);
    }
  }
 /*
  * Valida el formulario de datos de importación temporal.
  * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
  */
  validarFormulario(): boolean {
    this.datosImportacionTemporalFormulario.markAllAsTouched();
    return this.datosImportacionTemporalFormulario.valid;
  }

  /**
   * Ciclo de vida: Libera recursos al destruir el componente.
   * {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
