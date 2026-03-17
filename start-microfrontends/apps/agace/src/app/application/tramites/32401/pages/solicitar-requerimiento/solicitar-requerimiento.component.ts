import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent, CatalogoSelectComponent, CatalogosSelect, ConfiguracionColumna, InputRadioComponent, TEXTOS, TablaDinamicaComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosDeLaTabla, Requerimiento, RequerimientoOpcions } from '../../models/datos-tramite.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { AutoridadService } from '../../services/autoridad.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Solicitud32401State } from '../../estados/tramite32401.store';
import { Subject } from 'rxjs';
import { Tramite32401Query } from '../../estados/tramite32401.query';
import { Tramite32401Store } from '../../estados/tramite32401.store';
/**
 * Componente que gestiona la solicitud de requerimientos.
 * Incluye lógica para inicialización de formularios, manejo de estados,
 * y generación de tablas dinámicas.
 */
@Component({
  /** Selector utilizado para identificar el componente en el HTML */
  selector: 'app-solicitar-requerimiento',
  /** Define el componente como autónomo (standalone) */
  standalone: true,
  /**
   * Importa los módulos, servicios y componentes necesarios para el funcionamiento.
   * Incluye formularios reactivos, componentes personalizados y servicios auxiliares.
   */
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
  ],
  /** Proveedores de servicios necesarios para el componente */
  providers: [BsModalService],
  /** Ruta del archivo HTML que define la estructura del componente */
  templateUrl: './solicitar-requerimiento.component.html',
  /** Ruta del archivo SCSS que define los estilos del componente */
  styleUrl: './solicitar-requerimiento.component.scss',
})
/**
 * Componente que gestiona la solicitud de requerimientos.
 * Incluye lógica para inicialización de formularios, manejo de estados,
 * y generación de tablas dinámicas.
 */
export class SolicitarRequerimientoComponent implements OnInit, OnDestroy {
  /** Textos compartidos utilizados en el componente */
  TEXTOS = TEXTOS;

  /** Clase CSS utilizada para mostrar una alerta informativa */
  infoAlert = 'alert-info';

  /** Formulario reactivo para gestionar la solicitud */
  solicitarForm!: FormGroup;

  /** Estado actual de la solicitud 32401 */
  public solicitud32401State!: Solicitud32401State;

  /** Indicador para mostrar/ocultar sección de aduana y fecha */
  mostrarSeccionAduanaaFecha: boolean = false;

  /** Indicador para mostrar/ocultar sección de no manifiesto */
  mostrarSeccionNoManifiesto: boolean = false;

  /** Opciones disponibles para el tipo de requerimiento */
  requerimientoOpcions: RequerimientoOpcions[] = [] as RequerimientoOpcions[];

  /** Lista de trámites obtenida desde el catálogo */
  tramiteList: CatalogosSelect = {} as CatalogosSelect;

  /** Configuración de las columnas de la tabla dinámica */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDeLaTabla>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 0 },
    {
      encabezado: 'Folio trámite: ',
      clave: (articulo) => articulo.folioTramite,
      orden: 1,
      hiperenlace: true,
    },
    {
      encabezado: 'Tipo trámite',
      clave: (articulo) => articulo.tipoTramite,
      orden: 2,
    },
    { encabezado: 'RFC', clave: (articulo) => articulo.rfc, orden: 3 },
    {
      encabezado: 'Razón social',
      clave: (articulo) => articulo.razonSocial,
      orden: 4,
    },
    {
      encabezado: 'Estado del trámite',
      clave: (articulo) => articulo.estadoDelTramite,
      orden: 5,
    },
  ];

  /** Datos utilizados para la tabla dinámica */
  public datosDelContenedor: DatosDeLaTabla[] = [];

  /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente
   * Inyecta servicios necesarios para el manejo de formularios, estados y navegación.
   * @param fb FormBuilder para construir formularios reactivos.
   * @param tramite32401Store Store que gestiona el estado del trámite 32401.
   * @param tramite32401Query Query para seleccionar estados del store.
   * @param validacionesService Servicio para validar formularios.
   * @param autoridadService Servicio para interactuar con la API de autoridad.
   * @param router Servicio para gestionar la navegación entre rutas.
   * @param route ActivatedRoute para obtener información de la ruta activa.
   */
  constructor(
    private fb: FormBuilder,
    public tramite32401Store: Tramite32401Store,
    private tramite32401Query: Tramite32401Query,
    private validacionesService: ValidacionesFormularioService,
    private autoridadService: AutoridadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Constructor vacío
    this.obtenerTablaPoblada();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura los formularios y suscribe los cambios en el estado.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerAduanaLista();
    this.agregarRequerimientoOpcions();
    this.tramite32401Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: Solicitud32401State) => {
          this.solicitud32401State = {
            ...this.solicitud32401State,
            ...seccionState,
          };
          this.solicitarForm.patchValue({
            tipoBusqueda: this.solicitud32401State.tipoBusqueda,
            rfc: this.solicitud32401State.rfc,
            tipoDeTramite: this.solicitud32401State.tipoDeTramite,
            folioDeTramite: this.solicitud32401State.folioDeTramite,
          });
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con campos requeridos.
   */
  inicializarFormulario(): void {
    this.solicitarForm = this.fb.group({
      tipoBusqueda: [
        this.solicitud32401State?.tipoBusqueda,
        Validators.required,
      ],
      rfc: [this.solicitud32401State?.rfc],
      tipoDeTramite: [
        this.solicitud32401State?.tipoDeTramite,
        Validators.required,
      ],
      folioDeTramite: [
        this.solicitud32401State?.folioDeTramite,
        Validators.required,
      ],
    });
  }

  /**
   * Cambia la sección visible en función del tipo de requerimiento seleccionado.
   * @param evento Valor del tipo de búsqueda seleccionado.
   */
  cambiarRequerimiento(evento: string | number): void {
    this.tramite32401Store.setTipoBusqueda(evento);
    const TIPO_BUSQUEDA = evento;
    this.mostrarSeccionAduanaaFecha = false;
    this.mostrarSeccionNoManifiesto = false;
    switch (TIPO_BUSQUEDA) {
      case 'Requerimiento':
        this.mostrarSeccionAduanaaFecha = true;
        break;
      case 'Inicio':
        this.mostrarSeccionNoManifiesto = true;
        break;
      default:
        break;
    }
  }

  /**
   * Establece valores en el store a partir del formulario.
   * @param form Formulario reactivo con los datos.
   * @param campo Campo del formulario a actualizar.
   * @param metodoNombre Método correspondiente en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32401Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32401Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Valida un campo específico en el formulario.
   * @param form Formulario reactivo.
   * @param field Campo a validar.
   * @returns `true` si es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Método que llama al servicio para obtener y agregar las opciones de requerimiento.
   * Se suscribe al observable y asigna la respuesta al arreglo `requerimientoOpcions`.
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   */
  public agregarRequerimientoOpcions(): void {
    this.autoridadService
      .agregarRequerimientoOpcions()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: RequerimientoOpcions[]) => {
        this.requerimientoOpcions = respuesta;
      });
  }

  /**
   * Obtiene la lista de aduanas desde el servicio de autoridad.
   */
  public obtenerAduanaLista(): void {
    this.autoridadService
      .obtenerTramiteLista()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: CatalogosSelect) => {
        this.tramiteList = respuesta;
      });
  }

  /**
   * Población de la tabla con los datos obtenidos desde el servicio.
   */
  obtenerTablaPoblada(): void {
    this.autoridadService
      .agregarSolicitud()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta?.success) {
          respuesta.datos.id = this.datosDelContenedor.length + 1;
          this.datosDelContenedor.push(respuesta.datos);
          (
            this.tramite32401Store.setDelContenedor as (
              valor: DatosDeLaTabla[]
            ) => void
          )(this.datosDelContenedor);
          this.solicitarForm.markAsUntouched();
          this.solicitarForm.markAsPristine();
        }
      });
  }

  /**
   * Limpia el formulario y restablece los valores predeterminados.
   */
  limpiarFormulario(): void {
    const TIPO_BUSQUEDA_VALUE = this.solicitarForm.get('tipoBusqueda')?.value;
    this.solicitarForm.reset({
      tipoBusqueda: TIPO_BUSQUEDA_VALUE,
      rfc: '',
      tipoDeTramite: '',
      folioDeTramite: '',
    });
    this.datosDelContenedor = [];
    this.tramiteList.catalogos = [];
  }

  /**
   * Maneja la selección de una fila en la tabla y
   */
  valorDeAlternancia(row: Requerimiento): void {
    this.router.navigate(['agace/manifiesto-aereo/requiremento'], {
      state: { data: row },
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y finaliza observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
