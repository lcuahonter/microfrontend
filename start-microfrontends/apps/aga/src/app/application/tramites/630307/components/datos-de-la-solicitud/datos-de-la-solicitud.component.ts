/**
 * datos-de-la-solicitud.component.ts
 * @description Componente que gestiona los datos de la solicitud para el trámite 630307.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */

import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModeloDeFormaDinamica } from '@ng-mf/data-access-user';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosRetornoAutorizacionComponent } from '../datos-retorno-autorizacion/datos-retorno-autorizacion.component';
import { DatosRetornoProrrogaComponent } from '../datos-retorno-prorroga/datos-retorno-prorroga.component';

import { FORMULARIO_DATOS_SOLICITUD } from '../../enum/retorno-importacion-temporal.enum';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630307Query } from '../../estados/tramite630307.query';

import { Tramite630307State, Tramite630307Store } from '../../estados/tramite630307.store';

/**
 * Componente que gestiona los datos de la solicitud para el trámite 630307.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    DatosRetornoProrrogaComponent,
    DatosRetornoAutorizacionComponent,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
   * Indica si se deben mostrar los datos de prórroga.
   */
  showDatosRetornoProrroga = false;

  /**
   * Modelo dinámico del formulario con estructura definida por el trámite.
   */
  formularioDatosSolicitud: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_SOLICITUD;

  /**
   * Formulario reactivo para los datos de importación temporal.
   */
  datosImportacionTemporalFormulario!: FormGroup;

  /**
   * Subject para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado actual del trámite cargado desde el store.
   */
  estadoSeleccionado!: Tramite630307State;

   /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param fb Constructor de formularios reactivos.
   * @param retornoImportacionTemporalService Servicio para obtener datos de catálogos.
   * @param tramite630307Store Store para actualizar el estado del trámite.
   * @param tramite630307Query Query para observar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
    private tramite630307Store: Tramite630307Store,
    private tramite630307Query: Tramite630307Query,
   private consultaioQuery: ConsultaioQuery
  ) {
  this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
       this.inizializarFormulario();
      })
    )
    .subscribe();
  }

  /**
   * Ciclo de vida: Inicializa el formulario y carga datos de catálogos al iniciar el componente.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarEstadoFormulario();
    this.getAduanaDeIngreso();
    this.getSeccionAduanera();
    this.getProrroga();
    this.cambiarCuentaProrroga();
  }

   /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.inizializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosImportacionTemporalFormulario.disable();
    } else {
      this.datosImportacionTemporalFormulario.enable();
    }
  }

    /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
    this.inizializarFormulario();
    }
  }

  

  /**
   * Inicializa el formulario reactivo vacío (campos dinámicos se agregan aparte).
   */
  inizializarFormulario(): void {
    this.datosImportacionTemporalFormulario = this.fb.group({});
  }

  /**
   * Obtiene las opciones de Aduanas de Ingreso y las asigna al formulario dinámico.
   */
  getAduanaDeIngreso(): void {
    this.retornoImportacionTemporalService.getAduanaDeIngreso()
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
   */
  getSeccionAduanera(): void {
    this.retornoImportacionTemporalService.getSeccionAduanera()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const SECCION_ADUANERA = this.formularioDatosSolicitud.find((item) => item.id === 'cveSeccionAduanera');
        if (SECCION_ADUANERA) {
          SECCION_ADUANERA.opciones = data;
        }
      });
  }

  /**
   * Obtiene las opciones para el campo Cuenta Prórroga.
   */
  getProrroga(): void {
    this.retornoImportacionTemporalService.getProrroga()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const PRORROGA = this.formularioDatosSolicitud.find((item) => item.id === 'cuentaProrroga');
        if (PRORROGA) {
          PRORROGA.opciones = data;
        }
      });
  }

  /**
   * Observa los cambios del store del trámite y actualiza el estado local.
   */
  getValorStore(): void {
    this.tramite630307Query.selectTramite630307State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Establece un nuevo valor en el store del trámite según el evento emitido desde el formulario.
   *
   * @param $event Evento con el campo y el valor a establecer.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630307Store.setTramite630307State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630307Store.setTramite630307State($event.campo, $event.valor);
    }
    if ($event.campo === 'cuentaProrroga') {
      this.cambiarCuentaProrroga();
    }
  }

  /**
   * Cambia la visibilidad del componente de prórroga según el valor seleccionado.
   */
  cambiarCuentaProrroga(): void {
    this.showDatosRetornoProrroga = this.estadoSeleccionado?.['cuentaProrroga'] === '1';
  }

  /**
   * Ciclo de vida: Libera recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
