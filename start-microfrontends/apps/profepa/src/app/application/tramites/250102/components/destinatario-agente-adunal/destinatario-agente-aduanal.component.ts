import {
  AGREGAR_MIEMBRO_TABLA,
  Adunal,
  Destinatarios,
  TABLA_AGENT_ADUNALDATA,
  TablaDatos,
} from '../../models/flora-fauna.models';
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/flora-fauna.enum';
import { DistinatarioService } from '../../../250102/services/distinatario.service';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250102Query } from '../../estados/tramite250102.query';
import { Tramite250102Store } from '../../estados/tramite250102.store';

/**
 * Componente para la gestión de destinatarios y agentes aduanales en el trámite 250102.
 * Permite agregar, visualizar, eliminar y almacenar información de destinatarios y agentes aduanales,
 * así como gestionar la visualización de los formularios y tablas correspondientes.
 * 
 * @component
 * @example
 * <app-destinatario-agente-aduanal></app-destinatario-agente-aduanal>
 */
@Component({
  selector: 'app-destinatario-agente-aduanal',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './destinatario-agente-aduanal.component.html',
  styleUrl: './destinatario-agente-aduanal.component.scss',
})
export class DestinatarioAgenteAduanalComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Sujeto para limpieza de suscripciones.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * Configuración de la tabla de destinatarios.
   * @type {ConfiguracionColumna<Destinatarios>[]}
   */
  public tablaDestinatariosData: ConfiguracionColumna<Destinatarios>[] = AGREGAR_MIEMBRO_TABLA;

  /**
   * Configuración de la tabla de agentes aduanales.
   * @type {ConfiguracionColumna<Adunal>[]}
   */
  public tablaAgenteAduanalData: ConfiguracionColumna<Adunal>[] = TABLA_AGENT_ADUNALDATA;

  /**
   * Datos de destinatarios en la tabla.
   * @type {Destinatarios[]}
   */
  public agregarDestinatariosTablaDatos: Destinatarios[] = [];

  /**
   * Datos de agentes aduanales en la tabla.
   * @type {Adunal[]}
   */
  public agregarAgenteAduanalTablaDatos: Adunal[] = [];

  /**
   * Modo de selección de tabla (CHECKBOX).
   * @type {TablaSeleccion}
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Formulario para datos de destinatarios.
   * @type {FormGroup}
   */
  public formDestinatariosModal!: FormGroup;

  /**
   * Formulario para datos de agentes aduanales.
   * @type {FormGroup}
   */
  public formAgenteAduanal!: FormGroup;

  /**
   * Visibilidad del modal de destinatarios.
   * @type {boolean}
   */
  showDestinatarioModal = false;

  /**
   * Opciones de radio para destinatarios.
   * @type {any[]}
   */
  destinatarioOpcionDeBotonDeRadio = DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Visibilidad de la sección de tabla.
   * @type {boolean}
   */
  showTableDiv = true;

  /**
   * Datos de países.
   * @type {Catalogo[]}
   */
  paisData: Catalogo[] = [];

  /**
   * Datos de entidades federativas.
   * @type {Catalogo[]}
   */
  estadoData: Catalogo[] = [];

  /**
   * Filas de la tabla de destinatarios.
   * @type {TablaDatos[]}
   */
  tablaDestinatarioFilaDatos: TablaDatos[] = [];

  /**
   * Filas de la tabla de agentes aduanales.
   * @type {TablaDatos[]}
   */
  tablaAgenteAduanaFilaDatos: TablaDatos[] = [];

  /**
   * Visibilidad del modal de confirmación.
   * @type {boolean}
   */
  showAceptarModal = false;

  /**
   * Visibilidad del modal de agentes aduanales.
   * @type {boolean}
   */
  showAgenteModal = false;

  /**
   * Visibilidad del modal de selección de destinatarios.
   * @type {boolean}
   */
  showDestinatarioSeleccionarModal = false;

  /**
   * Filas seleccionadas de destinatarios.
   * @type {Destinatarios[]}
   */
  public selectedDestinatarioRows: Destinatarios[] = [];

  /**
   * Filas seleccionadas de agentes aduanales.
   * @type {Adunal[]}
   */
  public selectedAgenteAduanalRows: Adunal[] = [];

  /**
   * Indica si el destinatario es nacional.
   * @type {boolean}
   */
  public esNacional = true;

  /**
   * Indica si el destinatario es extranjero.
   * @type {boolean}
   */
  public esExtranjero = false;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite250102Store Almacén de estado del trámite.
   * @param tramite250102Query Consulta el estado del trámite.
   * @param destinatarioService Servicio para obtener datos de países y entidades federativas.
   * @param consultaioQuery Consulta el estado del usuario.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250102Store: Tramite250102Store,
    private tramite250102Query: Tramite250102Query,
    private destinatarioService: DistinatarioService,
    public consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente, carga datos y configura formularios.
   */
  ngOnInit(): void {
    this.obtenerPaisData();
    this.obtenerEstadoData();
    this.tramite250102Query.selectDestinatarioRowData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rowData) => {
        this.agregarDestinatariosTablaDatos = rowData.map((item: TablaDatos) => ({
          nombre: item.Datosdeltabledata[0],
          pais: item.Datosdeltabledata[1],
          ciudad: item.Datosdeltabledata[2],
          entidadfederativa: item.Datosdeltabledata[3],
          domicilio: item.Datosdeltabledata[4],
          codigopostal: item.Datosdeltabledata[5],
        }));
      });

    this.tramite250102Query.selectAgenteAduanalRowData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rowData) => {
        this.agregarAgenteAduanalTablaDatos = rowData.map(
          (item: TablaDatos) => ({
            nombre: item.Datosdeltabledata[0],
            primerapellido: item.Datosdeltabledata[1],
            segundoapellido: item.Datosdeltabledata[2],
            patente: item.Datosdeltabledata[3],
          })
        );
      });
    this.establecerFormDestinatariosModal();
    this.establecerFormAgenteAduanal();
    this.formDestinatariosModal.get('destinatarioRadio')?.setValue('1');
    this.formDestinatariosModal.get('destinatarioRadio')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.esNacional = value === '1';
        this.esExtranjero = value === '2';
      });
  }

  /**
   * Configura el formulario de destinatarios con validaciones.
   */
  establecerFormDestinatariosModal(): void {
    this.formDestinatariosModal = this.fb.group({
      destinatarioRadio: new FormControl('1', [
        Validators.required,
      ]),
      destinatarioRazonSocial: new FormControl('', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      paisNacionalDestinatario: new FormControl('', [Validators.required]),
      entidadFederativaDestinatario: new FormControl('', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      ciudadNacionalDestinatario: new FormControl('', [Validators.required]),
      codigoPostalDestinatario: new FormControl('', [
        Validators.required,
        Validators.maxLength(12),
      ]),
      domicilioDestinatario: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
    });
  }

  /**
   * Configura el formulario de agentes aduanales con validaciones.
   */
  establecerFormAgenteAduanal(): void {
    this.formAgenteAduanal = this.fb.group({
      nombreAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(28),
      ]),
      primerApellidoAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      segundoApellidoAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      patenteAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(4),
      ]),
    });
  }

  /**
   * Procesa y agrega datos de agente aduanal a la tabla.
   */
  enviarAgenteAduanalFormulario(): void {
    const AGENTE_ADUANAL_FILA = {
      Datosdeltabledata: [
        this.formAgenteAduanal.value.nombreAgenteAduanal,
        this.formAgenteAduanal.value.primerApellidoAgenteAduanal,
        this.formAgenteAduanal.value.segundoApellidoAgenteAduanal,
        this.formAgenteAduanal.value.patenteAgenteAduanal,
      ],
    };
    this.tablaAgenteAduanaFilaDatos.push(AGENTE_ADUANAL_FILA);
    this.tramite250102Store.establecerAgenteAduanal(
      this.tablaAgenteAduanaFilaDatos
    );
    this.showTableDiv = !this.showTableDiv;
    this.showAgenteModal = !this.showAgenteModal;
    this.limparAgenteAduana();
  }

  /**
   * Procesa y agrega datos de destinatario a la tabla.
   */
  enviarDestinatarioFormulario(): void {
    const PAIS_VALOR = this.paisData.find(
      (item: Catalogo) =>
        item.id === this.formDestinatariosModal.value.paisNacionalDestinatario
    )?.descripcion;

    const ENTIDAD_FEDERATIVA_VALOR = this.estadoData.find(
      (item: Catalogo) =>
        item.id ===
        this.formDestinatariosModal.value.entidadFederativaDestinatario
    )?.descripcion;

    const DESTINATARIO_FILA = {
      Datosdeltabledata: [
        this.formDestinatariosModal.value.destinatarioRazonSocial,
        PAIS_VALOR,
        this.formDestinatariosModal.value.ciudadNacionalDestinatario || '',
        ENTIDAD_FEDERATIVA_VALOR,
        this.formDestinatariosModal.value.domicilioDestinatario,
        this.formDestinatariosModal.value.codigoPostalDestinatario,
      ],
    };

    this.tablaDestinatarioFilaDatos.push(DESTINATARIO_FILA);
    this.tramite250102Store.establecerDestinatario(
      this.tablaDestinatarioFilaDatos
    );

    this.showTableDiv = !this.showTableDiv;
    this.limparAgenteAduana();
  }

  /**
   * Carga datos de países.
   */
  obtenerPaisData(): void {
    this.destinatarioService.obtenerPaisData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.paisData = data;
      });
  }

  /**
   * Carga datos de entidades federativas.
   */
  obtenerEstadoData(): void {
    this.destinatarioService.obtenerEstadoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.estadoData = data;
      });
  }

  /**
   * Alterna visibilidad del modal de destinatarios.
   */
  cambiarDestinatario(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatarioModal = !this.showDestinatarioModal;
  }

  /**
   * Alterna visibilidad del modal de agentes aduanales.
   */
  cambiarAgenteAduanal(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showAgenteModal = !this.showAgenteModal;
  }

  /**
   * Alterna visibilidad del modal de selección de destinatarios.
   */
  cambiarDestinatarioSeleccionar(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatarioSeleccionarModal = !this.showDestinatarioSeleccionarModal;
  }

  /**
   * Abre el modal de confirmación.
   */
  openAceptarModal(): void {
    this.showDestinatarioModal = !this.showDestinatarioModal;
    this.showAceptarModal = true;
  }

  /**
   * Confirma la adición de un destinatario.
   */
  confirmAgregar(): void {
    this.enviarDestinatarioFormulario();
    this.showAceptarModal = false;
    this.limparDestinatario();
  }

  /**
   * Actualiza filas seleccionadas de destinatarios.
   * @param filas Filas seleccionadas.
   */
  onSeleccionDestinatario(filas: Destinatarios[]): void {
    this.selectedDestinatarioRows = filas;
  }

  /**
   * Actualiza filas seleccionadas de agentes aduanales.
   * @param filas Filas seleccionadas.
   */
  onSeleccionAgenteAduanal(filas: Adunal[]): void {
    this.selectedAgenteAduanalRows = filas;
  }

  /**
   * Elimina destinatarios seleccionados.
   */
  eliminarUbicacionDetinatario(): void {
    if (!this.selectedDestinatarioRows.length) {
      return;
    }
    this.agregarDestinatariosTablaDatos = this.agregarDestinatariosTablaDatos.filter(
      (fila) => !this.selectedDestinatarioRows.includes(fila)
    );
    this.tablaDestinatarioFilaDatos = this.agregarDestinatariosTablaDatos.map((item) => ({
      Datosdeltabledata: [
        item.nombre,
        item.pais,
        item.ciudad,
        item.entidadfederativa,
        item.domicilio,
        item.codigopostal,
      ],
    }));
    this.tramite250102Store.establecerDestinatario(this.tablaDestinatarioFilaDatos);
    this.selectedDestinatarioRows = [];
  }

  /**
   * Elimina agentes aduanales seleccionados.
   */
  eliminarAgenteAduanal(): void {
    if (!this.selectedAgenteAduanalRows.length) {
      return;
    }

    this.agregarAgenteAduanalTablaDatos = this.agregarAgenteAduanalTablaDatos.filter(
      (fila) => !this.selectedAgenteAduanalRows.includes(fila)
    );

    this.tablaAgenteAduanaFilaDatos = this.agregarAgenteAduanalTablaDatos.map((item) => ({
      Datosdeltabledata: [
        item.nombre,
        item.primerapellido,
        item.segundoapellido,
        item.patente,
      ],
    }));

    this.tramite250102Store.establecerAgenteAduanal(this.tablaAgenteAduanaFilaDatos);
    this.selectedAgenteAduanalRows = [];
  }

  /**
   * Restablece el formulario de destinatarios.
   */
  limparDestinatario(): void {
    this.formDestinatariosModal.reset();
    this.formDestinatariosModal.get('destinatarioRadio')?.setValue('1');
  }

  /**
   * Restablece el formulario de agentes aduanales.
   */
  limparAgenteAduana(): void {
    this.formAgenteAduanal.reset();
  }

  /**
   * Limpia suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}