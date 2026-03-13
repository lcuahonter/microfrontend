/**
 * datos-de-la-solicitud.component.ts
 * @description Componente que gestiona los datos de la solicitud para el trámite 630303.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite630303State, Tramite630303Store } from '../../estados/tramite630303.store';
import { CommonModule } from '@angular/common';
import { DatosRetornoAutorizacionComponent } from '../datos-retorno-autorizacion/datos-retorno-autorizacion.component';
import { DatosRetornoProrrogaComponent } from '../datos-retorno-prorroga/datos-retorno-prorroga.component';
import { FORMULARIO_DATOS_SOLICITUD } from '../../enum/retorno-importacion-temporal.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630303Query } from '../../estados/tramite630303.query';

/**
 * Componente que gestiona los datos de la solicitud para el trámite 630303.
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
   * Referencia al componente de datos de retorno de autorización.
   */
  @ViewChild(DatosRetornoAutorizacionComponent) datosRetornoAutorizacionComponent!: DatosRetornoAutorizacionComponent;

  /**
   * Referencia al componente de datos de retorno de prórroga.
   */
  @ViewChild(DatosRetornoProrrogaComponent) datosRetornoProrrogaComponent!: DatosRetornoProrrogaComponent;

  /**
   * Indica si el formulario debe estar en modo de solo lectura.
   * Cuando es true, todos los campos del formulario se deshabilitan para prevenir modificaciones.
   * El valor se obtiene del estado de consulta y se aplica automáticamente al formulario.
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
  esSoloLectura!: boolean;

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
  estadoSeleccionado!: Tramite630303State;

   /**
   * Estado de la solicitud actual.
   * {Tramite630303State}
   */
  public solicitudState!: Tramite630303State;

  /**
   * Constructor del componente.
   * Inicializa las dependencias necesarias y crea el formulario reactivo base.
   * 
   * @param formBuilder - Constructor de formularios reactivos de Angular para crear y manejar formularios.
   * @param retornoImportacionTemporalService - Servicio para obtener datos de catálogos relacionados con importación temporal.
   * @param tramite630303Store - Store para actualizar y mantener el estado del trámite 630303.
   * @param tramite630303Query - Query para observar y consultar el estado del trámite 630303.
   * @param consultaioQuery - Query para obtener el estado de consulta y determinar el modo de solo lectura.
   * @memberof DatosDeLaSolicitudComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
    private tramite630303Store: Tramite630303Store,
    private tramite630303Query: Tramite630303Query,
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
   */
  ngOnInit(): void {
    this.getValorStore();
    this.obtenerEstadoValor();
    this.getAduanaDeIngreso();
    this.getSeccionAduanera();
    this.getProrroga();
    this.cambiarCuentaProrroga();
  }

  /**
   * Obtiene y observa el estado de consulta para determinar el modo de solo lectura.
   * Se suscribe al observable del estado de consulta y actualiza la propiedad esSoloLectura
   * según el valor de la propiedad readonly del estado. Automáticamente aplica los cambios
   * al formulario mediante el método guardarDatosFormulario.
   * 
   * @description Este método establece la reactividad del componente al estado de consulta,
   * permitiendo que el formulario se adapte dinámicamente entre modo edición y solo lectura.
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   */
 obtenerEstadoValor(): void {
  this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estadoConsulta) => {
      this.esSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario();
    });
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
    this.tramite630303Query.selectTramite630303State$
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
      this.tramite630303Store.setTramite630303State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630303Store.setTramite630303State($event.campo, $event.valor);
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
   * Valida todos los formularios del componente incluyendo el componente de autorización.
   * Solo valida campos que están visibles según las condiciones.
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  public validarTodosFormularios(): boolean {
    let esValido = true;

    // Validar formulario principal y marcar todos los controles como tocados
    if (this.datosImportacionTemporalFormulario) {
      Object.keys(this.datosImportacionTemporalFormulario.controls).forEach(controlName => {
        const CONTROL = this.datosImportacionTemporalFormulario.get(controlName);
        if (CONTROL) {
          CONTROL.markAsTouched({ onlySelf: true });
        }
      });
      if (this.datosImportacionTemporalFormulario.invalid) {
        esValido = false;
      }
    }

    // Validar datos de retorno de autorización y marcar todos los controles como tocados
    // Verificar que el ViewChild esté disponible antes de acceder a su formulario
    if (this.datosRetornoAutorizacionComponent?.datosImportacionRetornoAutorizacionGeneralFormulario) {
      const FORM = this.datosRetornoAutorizacionComponent.datosImportacionRetornoAutorizacionGeneralFormulario;
      if (FORM && FORM.controls) {
        Object.keys(FORM.controls).forEach(controlName => {
          const CONTROL = FORM.get(controlName);
          if (CONTROL) {
            CONTROL.markAsTouched({ onlySelf: true });
          }
        });
        if (FORM.invalid) {
          esValido = false;
        }
      }
    }

    // Validar datos de retorno de prórroga SOLO si está visible (cuando cuentaProrroga = "1")
    if (this.showDatosRetornoProrroga && this.datosRetornoProrrogaComponent?.datosImportacionRetornoProrrogaGeneralFormulario) {
      const PRORROGA_FORM = this.datosRetornoProrrogaComponent.datosImportacionRetornoProrrogaGeneralFormulario;
      if (PRORROGA_FORM && PRORROGA_FORM.controls) {
        Object.keys(PRORROGA_FORM.controls).forEach(controlName => {
          const CONTROL = PRORROGA_FORM.get(controlName);
          if (CONTROL) {
            CONTROL.markAsTouched({ onlySelf: true });
          }
        });
        if (PRORROGA_FORM.invalid) {
          esValido = false;
        }
      }
    }

    return esValido;
  }

  /**
   * Ciclo de vida: Libera recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
