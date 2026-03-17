/**
 * tipo-propietario.component.ts
 * Componente que gestiona los datos del tipo de propietario para el trámite 630303.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
import { Catalogo, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, SolicitanteComponent, TituloComponent } from '@ng-mf/data-access-user';
import { FORMULARIO_DATOS_PROPIETARIO_DIRECCION, FORMULARIO_DATOS_PROPIETARIO_NOMBRE } from '../../enums/retorno-importacion-temporal.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite630104State, Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';


/**
 * Componente que gestiona los datos del tipo de propietario para el trámite 630303.
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
   * Estado seleccionado del trámite 630303.
   */
  estadoSeleccionado!: Tramite630104State;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;


  /**
   * Constructor del componente.
   * 
   * @param fb - Constructor de formularios reactivos.
   * @param tramite630104Store - Store para manejar el estado del trámite.
   * @param tramite630104Query - Query para consultar el estado del trámite.
   * @param equipoEInstrumentosMusicalesService - Servicio para obtener datos de catálogos.
   * @param consultaioQuery - Servicio para consultar el estado de la consulta de entrada/salida
   */
  constructor(
    private fb: FormBuilder,
    private tramite630104Store: Tramite630104Store,
    private tramite630104Query: Tramite630104Query,
    private equipoEInstrumentosMusicalesService: EquipoEInstrumentosMusicalesService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormulario()
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
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
    this.inicializarFormulario();
    this.obtenerEstadoValor();
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
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
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
    this.mostrarFormularioPersonaExtranjera = TIPO_PROPIETARIO_VALOR ;
  }

  /**
   * Cambia la visibilidad de los componentes según el propietario seleccionado.
   */
  cambiarPropietario(): void {
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
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
    this.tramite630104Query.selectTramite630104State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Obtiene las opciones de propietarios desde el servicio.
   */
  getPropietario(): void {
    this.equipoEInstrumentosMusicalesService
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
    this.equipoEInstrumentosMusicalesService
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
    this.equipoEInstrumentosMusicalesService
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
   *  Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (!$event || typeof $event !== 'object' || !$event.campo) {
      return;
    }

    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630104Store.setTramite630104State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630104Store.setTramite630104State($event.campo, $event.valor);
    }
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