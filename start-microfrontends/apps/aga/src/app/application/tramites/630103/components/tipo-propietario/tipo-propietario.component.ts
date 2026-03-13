/**
 * tipo-propietario.component.ts
 * Componente que gestiona los datos del tipo de propietario para el trámite 630103.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */

import { CommonModule } from '@angular/common';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { SolicitanteComponent, TituloComponent } from '@ng-mf/data-access-user';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';

import { Catalogo, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';

import { FORMULARIO_DATOS_PROPIETARIO_DIRECCION, FORMULARIO_DATOS_PROPIETARIO_NOMBRE } from '../../enum/autorizacion-importacion-temporal.enum';
import { Tramite630103Query } from '../../estados/tramite630103.query';

import { Tramite630103State, Tramite630103Store } from '../../estados/tramite630103.store';
import { AutorizacionImportacionTemporalService } from '../../services/autorizacion-importacion-temporal.service';

/**
 * Componente que gestiona los datos del tipo de propietario para el trámite 630103.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
@Component({
  selector: 'app-tipo-propietario',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    SolicitanteComponent,
  ],
  templateUrl: './tipo-propietario.component.html',
  styleUrls: ['./tipo-propietario.component.scss'],
})
export class TipoPropietarioComponent implements OnInit, OnDestroy {
 
  /**
   * Indicador para mostrar el formulario de personas extranjeras.
   */
  mostrarFormularioPersonaExtranjera = false;

  /**
   * Indica si se debe mostrar el tipo de propietario.
   */
  mostrarTipoPropietario = false;

  /**
   * Indica si se debe mostrar el solicitante.
   */
  mostrarSolicitante = false;

  /**
   * Opciones de propietarios obtenidas desde un catálogo.
   */
  propietarioOpciones: Catalogo[] = [];

  /**
   * Opciones de tipos de propietarios obtenidas desde un catálogo.
   */
  tipoDePropietarioOpciones: Catalogo[] = [];

  /**
   * Formulario dinámico para gestionar los datos del tipo de propietario.
   */
  formularioDatosPropietarioDireccion: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_PROPIETARIO_DIRECCION;

  /**
   * Formulario dinámico para gestionar los datos del nombre del propietario.
   */
  formularioDatosPropietarioNombre: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_PROPIETARIO_NOMBRE;

  /**
   * Formulario reactivo para gestionar los datos del tipo de propietario.
   */
  tipoPropietarioFormulario!: FormGroup;

  /**
   * Estado seleccionado del trámite 630103.
   */
  estadoSeleccionado!: Tramite630103State;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura!: boolean;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630103State;

  /**
   * Constructor del componente.
   * fb - Constructor de formularios reactivos.
   * tramite630103Store - Store para manejar el estado del trámite.
   * tramite630103Query - Query para consultar el estado del trámite.
   * autorizacionImportacionTemporalService - Servicio para obtener datos de catálogos.
   * consultaioQuery - Query para observar el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private tramite630103Store: Tramite630103Store,
    private tramite630103Query: Tramite630103Query,
    private autorizacionImportacionTemporalService: AutorizacionImportacionTemporalService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormulario()
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.tipoPropietarioFormulario.disable();
      this.formularioDatosPropietarioNombre = this.formularioDatosPropietarioNombre.map(campo => ({
        ...campo,
        desactivado: true
      }));
      this.formularioDatosPropietarioDireccion = this.formularioDatosPropietarioDireccion.map(campo => ({
        ...campo,
        desactivado: true
      }));
      
    } else if (!this.esFormularioSoloLectura) {
      this.tipoPropietarioFormulario.enable();
      this.formularioDatosPropietarioNombre = this.formularioDatosPropietarioNombre.map(campo => ({
        ...campo,
        desactivado: false
      }));
      this.formularioDatosPropietarioDireccion = this.formularioDatosPropietarioDireccion.map(campo => ({
        ...campo,
        desactivado: false
      }));
      
    } 
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene datos de catálogos.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.getPropietario();
    this.getTipoDePropietario();
    this.inicializarFormulario()
    this.obtenerEstadoValor()
    this.getPais();
    this.cambiarPropietario();
    this.cambiarTipoPropietario();
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
      this.esFormularioSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario()
    });
  }

  /**
   * Cambia la visibilidad de los campos según el tipo de propietario seleccionado.
   */
  cambiarTipoPropietario(): void {
    const TIPO_PROPIETARIO_VALOR = this.tipoPropietarioFormulario.get('tipoDePropietario')?.value;
    const NOMBRE_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'nombre');
    const APELLIDO_PATERNO_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'apellidoPaterno');
    const APELLIDO_MATERNO_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'apellidoMaterno');
    const RAZON_SOCIAL_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'razonSocial');

    if (NOMBRE_CAMPO && APELLIDO_PATERNO_CAMPO && APELLIDO_MATERNO_CAMPO && RAZON_SOCIAL_CAMPO) {
      NOMBRE_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      APELLIDO_PATERNO_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      APELLIDO_MATERNO_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      RAZON_SOCIAL_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '2';
    }
    this.mostrarFormularioPersonaExtranjera = TIPO_PROPIETARIO_VALOR;
  }

  /**
   * Cambia la visibilidad de los componentes según el propietario seleccionado.
   */
  cambiarPropietario(): void {
    this.mostrarTipoPropietario = this.tipoPropietarioFormulario.get('propietario')?.value === '2';
    this.mostrarSolicitante = this.tipoPropietarioFormulario.get('propietario')?.value === '1';
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
    this.tipoPropietarioFormulario = this.fb.group({
      propietario: [this.estadoSeleccionado?.['propietario'] || '', Validators.required],
      tipoDePropietario: [this.estadoSeleccionado?.['tipoDePropietario'] || '', Validators.required],
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630103Query.selectTramite630103State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Obtiene las opciones de propietarios desde el servicio.
   */
  getPropietario(): void {
    this.autorizacionImportacionTemporalService
      .getPropietario()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.propietarioOpciones = data;
      });
  }

  /**
   * Obtiene las opciones de tipos de propietarios desde el servicio.
   */
  getTipoDePropietario(): void {
    this.autorizacionImportacionTemporalService
      .getTipoDePropietario()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoDePropietarioOpciones = data;
      });
  }

  /**
   * Obtiene las opciones de países desde el servicio.
   */
  getPais(): void {
    this.autorizacionImportacionTemporalService
      .getPais()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const PAIS_FIELD = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'pais');
        if (PAIS_FIELD) {
          PAIS_FIELD.opciones = data;
        }
      });
  }

  /**
   * Establece un cambio de valor en el store basado en un evento.
   * $event - Evento que contiene el campo y el valor a actualizar.
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
    this.tipoPropietarioFormulario.markAllAsTouched();
    return this.tipoPropietarioFormulario.valid;
  }
  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}