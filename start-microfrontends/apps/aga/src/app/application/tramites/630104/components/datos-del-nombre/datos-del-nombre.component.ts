/**
 * Componente que gestiona los datos del nombre del propietario para el trámite 630104.
 * Este componente permite la gestión de formularios dinámicos, la interacción con catálogos,
 * y la visualización condicional de campos según el tipo de propietario seleccionado.
 */

import { Catalogo, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { FORMULARIO_TIPO_REPRESENTANTE_DIRECCION, FORMULARIO_TIPO_REPRESENTANTE_NOMBRE} from '../../enums/retorno-importacion-temporal.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite630104State, Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { DomicilioFiscalComponent } from '../domicilio-fiscal/domicilio-fiscal.component';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { REGEX_NOMBRE } from "@libs/shared/data-access-user/src/tramites/constantes/regex.constants";
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';


@Component({
  selector: 'app-datos-del-nombre',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent, CatalogoSelectComponent, DatosGeneralesComponent, DomicilioFiscalComponent, TituloComponent, ReactiveFormsModule],
  templateUrl: './datos-del-nombre.component.html',
  styleUrl: './datos-del-nombre.component.scss',
})
export class DatosDelNombreComponent implements OnInit, OnDestroy {

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
  consultarPorRFC: Catalogo[] = [];

  /**
   * Opciones de tipos de propietarios obtenidas desde un catálogo.
   */
  tipoDeRepresentanteOpciones: Catalogo[] = [];

  /**
   * Formulario dinámico para gestionar los datos del tipo de propietario.
   */
  formularioDatosPropietarioDireccion: ModeloDeFormaDinamica[] = FORMULARIO_TIPO_REPRESENTANTE_DIRECCION;

  /**
   * Formulario dinámico para gestionar los datos del nombre del propietario.
   */
  formularioDatosPropietarioNombre: ModeloDeFormaDinamica[] = FORMULARIO_TIPO_REPRESENTANTE_NOMBRE;

  /**
   * Formulario reactivo para gestionar los datos del tipo de propietario.
   */
  datisDelNombre!: FormGroup;

  /**
   * Estado seleccionado del trámite 630104.
   */
  estadoSeleccionado!: Tramite630104State;

  /**
   * Indicador para determinar si la opción "Consultar por RFC" está seleccionada.
   */
  public consultarPorRFCOpcionseleccionada: boolean = false;

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
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;
          })
        )
        .subscribe();
   }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene datos de catálogos.
   */
  ngOnInit(): void {
     this.tramite630104Query.selectSeccionState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estado: Tramite630104State) => {
      this.estadoSeleccionado = estado;
      this.inicializarFormulario();
      this.inicializarEstadoFormulario();
      this.cambiarPropietario();
    });
    this.getValorStore();
    this.inicializarFormulario();
    this.getconsultarPorRFC();
    this.getTipoDeRepresentante();
    this.getPais();
    this.cambiarPropietario();
    this.cambiarTipoPropietario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
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
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datisDelNombre.disable();
    } else {
      this.datisDelNombre.enable();
    }
  }


  /**
   * Cambia el estado de la opción "Consultar por RFC" según el valor del formulario.
   */
  continuar(): void {
    if (this.datisDelNombre.get('esConsultaRep')?.value === '1') {
      this.consultarPorRFCOpcionseleccionada = true;
    }
    else if (this.datisDelNombre.get('esConsultaRep')?.value === '2') {
      this.consultarPorRFCOpcionseleccionada = false;
    }
  }

  /**
   * Cambia la visibilidad de los campos según el tipo de propietario seleccionado.
   */
    cambiarTipoPropietario(): void {
    const TIPO_REPRESENTANTE_VALOR = this.datisDelNombre.get('datosRepresentante')?.value;
    const CURP_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'td_curp_representantev');
    const NOMBRE_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'nombre');
    const APELLIDO_PATERNO_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'apellidoPaterno');
    const APELLIDO_MATERNO_CAMPO = this.formularioDatosPropietarioNombre.find((campo) => campo.id === 'apellidoMaterno');

    // Only show for Persona Fisica Nacional (id === '1' or 1)
    const IS_FISICA_NACIONAL = TIPO_REPRESENTANTE_VALOR === '1' || TIPO_REPRESENTANTE_VALOR === 1;

    if (CURP_CAMPO && NOMBRE_CAMPO && APELLIDO_PATERNO_CAMPO && APELLIDO_MATERNO_CAMPO) {
      CURP_CAMPO.mostrar = IS_FISICA_NACIONAL;
      NOMBRE_CAMPO.mostrar = IS_FISICA_NACIONAL;
      APELLIDO_PATERNO_CAMPO.mostrar = IS_FISICA_NACIONAL;
      APELLIDO_MATERNO_CAMPO.mostrar = IS_FISICA_NACIONAL;
    }
    this.mostrarFormularioPersonaExtranjera = IS_FISICA_NACIONAL;
  }

  /**
   * Cambia la visibilidad de los componentes según el propietario seleccionado.
   */
  cambiarPropietario(): void {
    this.mostrarTipoPropietario = this.datisDelNombre.get('esConsultaRep')?.value === '2';
    this.mostrarSolicitante = this.datisDelNombre.get('esConsultaRep')?.value === '1';
    if (this.mostrarSolicitante && this.esFormularioSoloLectura) {
      this.datisDelNombre.get('rfc')?.disable({ emitEvent: false });
  }
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
    this.datisDelNombre = this.fb.group({
      esConsultaRep: [this.estadoSeleccionado?.['esConsultaRep'] || '', Validators.required],
      datosRepresentante: [this.estadoSeleccionado?.['datosRepresentante'] || '', Validators.required],
      rfc: [this.estadoSeleccionado?.['rfc'] || '', [Validators.required, Validators.pattern(REGEX_NOMBRE)]],
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
  getconsultarPorRFC(): void {
    this.equipoEInstrumentosMusicalesService
      .getconsultarPorRFC()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.consultarPorRFC = data;
      });
  }

  /**
   * Obtiene las opciones de tipos de propietarios desde el servicio.
   */
  getTipoDeRepresentante(): void {
    this.equipoEInstrumentosMusicalesService
      .getTipoDeRepresentante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoDeRepresentanteOpciones = data;
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
   * 
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630104Store.setTramite630104State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630104Store.setTramite630104State($event.campo, $event.valor);
    }
    this.consultarPorRFCOpcionseleccionada = this.datisDelNombre.get('consultarPorRFC')?.value;
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