import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { AutoridadService } from '../../services/autoridad.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosDeLaTabla } from '../../models/datos-tramite.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Requerimiento } from '../../models/datos-tramite.model';
import { Router } from '@angular/router';
import { Solicitud31501State } from '../../../../estados/tramites/tramite31501.store';
import { Subject } from 'rxjs';
import { TEXTOS } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { Tramite31501Query } from '../../../../estados/queries/tramite31501.query';
import { Tramite31501Store } from '../../../../estados/tramites/tramite31501.store';
import { TramiteList } from '../../models/datos-tramite.model';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent
  ],
  providers: [BsModalService],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Constante que referencia el objeto `TEXTOS`.
   *
   * `TEXTOS` contiene los textos utilizados en la aplicación para esta página específica.
   * Se utiliza para centralizar y facilitar la gestión de los textos mostrados al usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * Clase CSS utilizada para mostrar un mensaje de alerta con estilo informativo.
   * Se puede aplicar a elementos HTML para resaltar información importante.
   */
  infoAlert = 'alert-info';

  /**
   * Formulario principal de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitud31501State!: Solicitud31501State;

  /**
   * Bandera para mostrar la sección de aduana y fecha.
   */
  mostrarSeccionAduanaaFecha: boolean = false;

  /**
   * Representa la lista de trámites utilizada en el componente.
   *
   * @property catalogos - Un arreglo de objetos de tipo `TramiteList` que contiene los catálogos relacionados con los trámites.
   * @property labelNombre - Una cadena que representa el nombre de la etiqueta asociada al trámite.
   * @property primerOpcion - Una cadena que indica la primera opción seleccionable en la lista de trámites.
   */
  tramiteList: {
    catalogos: TramiteList[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Lista de aduanas.
   */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Configuración de las columnas para la tabla en el componente `paso-uno`.
   *
   * Cada objeto en el arreglo `encabezadoDeTabla` representa una columna de la tabla
   * con las siguientes propiedades:
   *
   * - `encabezado`: El texto que se mostrará como encabezado de la columna.
   * - `clave`: Una función que define cómo obtener el valor de la columna a partir de un objeto de datos.
   * - `orden`: El orden en el que se mostrarán las columnas en la tabla.
   * - `hiperenlace` (opcional): Indica si el contenido de la columna debe mostrarse como un hipervínculo.
   *
   * @type {ConfiguracionColumna<datosDeLaTabla>[]}
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDeLaTabla>[] = [
    { encabezado: '', clave: (artículo) => artículo.id, orden: 0 },
    {
      encabezado: 'Folio trámite',
      clave: (artículo) => artículo.folioTramite,
      orden: 1,
      hiperenlace: true,
    },
    {
      encabezado: 'Tipo trámite',
      clave: (artículo) => artículo.tipoTramite,
      orden: 2,
    },
    { encabezado: 'RFC', clave: (artículo) => artículo.rfc, orden: 3 },
    {
      encabezado: 'Razón social',
      clave: (artículo) => artículo.razonSocial,
      orden: 4,
    },
    {
      encabezado: 'Estado del trámite',
      clave: (artículo) => artículo.estadoDelTramite,
      orden: 5,
    },
  ];

  /**
   * Arreglo que almacena los datos de la tabla relacionados con los contenedores.
   *
   * @type {DatosDeLaTabla[]}
   */
  public datosDelContenedor: DatosDeLaTabla[] = [];

  /**
  * Opciones de radio.
  */
   public radioOpcions = [
     { label: 'Requerimiento por parte de la autoridad', value: 'Requerimiento' },
     { label: 'Inicio de cancalecíon', value: 'Inicio' }
   ];

  /**
  * Valor seleccionado del radio.
  */
  public valorSeleccionado!: string;

  /**
   * Sujeto para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    public tramite31501Store: Tramite31501Store,
    private tramite31501Query: Tramite31501Query,
    private validacionesService: ValidacionesFormularioService,
    private autoridadService: AutoridadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tramiteList = {
      catalogos: [],
      labelNombre: 'Tipo de trámite',
      primerOpcion: 'Seleccione un valor',
    };
    this.aduana = {
      catalogos: [],
      labelNombre: 'Tipo de trámite',
      primerOpcion: 'Selecciona el tipo de Trámite',
    };
  }

  ngOnInit(): void {
    this.tramite31501Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitud31501State = {
            ...this.solicitud31501State,
            ...seccionState,
          };
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.fetchAduanaList();
  }

  /**
   * Inicializa el formulario `solicitudForm` con los valores predeterminados
   * provenientes del estado `solicitud31501State` y aplica las validaciones necesarias.
   *
   * Campos inicializados:
   * - `tipoBusqueda`: Campo obligatorio que se inicializa con el valor de `tipoBusqueda` en el estado.
   * - `rfc`: Campo opcional que se inicializa con el valor de `rfc` en el estado.
   * - `tipoDeTramite`: Campo obligatorio que se inicializa con el valor de `tipoDeTramite` en el estado.
   * - `folioDeTramite`: Campo obligatorio que se inicializa con el valor de `folioDeTramite` en el estado.
   *
   * relacionadas con la visualización de los campos del formulario.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      tipoBusqueda: [
        this.solicitud31501State?.tipoBusqueda,
        Validators.required,
      ],
      rfc: [this.solicitud31501State?.rfc],
      tipoDeTramite: [
        this.solicitud31501State?.tipoDeTramite,
        Validators.required,
      ],
      folioDeTramite: [
        this.solicitud31501State?.folioDeTramite,
        Validators.required,
      ],
    });
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31501Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31501Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Obtiene la lista de aduanas desde el servicio de autoridad y actualiza el catálogo de trámites.
   *
   * @remarks
   * Este método realiza una solicitud al servicio `autoridadService` para obtener la lista de trámites
   * y actualiza la propiedad `catalogos` del objeto `tramiteList` con los datos recibidos.
   *
   * @returns {void} No retorna ningún valor.
   */
  public fetchAduanaList(): void {
    this.autoridadService
      .getTramiteList('tramiteList').pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.tramiteList.catalogos = respuesta.data;
      });
  }

  /**
   * Método que se encarga de agregar una nueva solicitud utilizando el servicio `autoridadService`.
   * Al recibir una respuesta exitosa, actualiza los datos del contenedor,
   * refresca el estado del formulario y sincroniza el estado en el store.
   *
   * @remarks
   * - Si la respuesta es exitosa (`respuesta.success`), se agrega un nuevo elemento a la lista de datos del contenedor.
   * - El formulario se reinicia y se marca como no modificado.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  obtenerTablaPoblada(): void {
    this.autoridadService.agregarSolicitud().pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
      // Manejar éxito, posiblemente refrescar la grilla o mostrar mensaje
      if (respuesta?.success) {
        respuesta.datos.id = this.datosDelContenedor.length + 1;
        this.datosDelContenedor = [...this.datosDelContenedor, respuesta.datos];
        (
          this.tramite31501Store.setDelContenedor as (
            valor: DatosDeLaTabla[]
          ) => void
        )(this.datosDelContenedor);
        this.solicitudForm.patchValue({
          aduana: '',
          fechaIngreso: '',
          digitoDeControl: '',
          inicialesContenedor: '',
          numeroContenedor: '',
          contenedores: '',
        });
        this.solicitudForm.markAsUntouched();
        this.solicitudForm.markAsPristine();
      }
    });
  }

  /**
   * Restablece el formulario de solicitud a su estado inicial,
   * preservando el valor del campo 'tipoBusqueda'.
   * También limpia los datos del contenedor y los catálogos de trámites.
   *
   * @remarks
   * - El campo 'tipoBusqueda' mantiene su valor actual después del reinicio.
   * - Los campos 'rfc', 'tipoDeTramite' y 'folioDeTramite' se reinician a cadenas vacías.
   * - La lista `datosDelContenedor` se vacía.
   * - La propiedad `catalogos` de `tramiteList` se reinicia a un arreglo vacío.
   */
  limpiarFormulario(): void {
    const TIPO_BUSQUEDA_VALUE = this.solicitudForm.get('tipoBusqueda')?.value;
    this.solicitudForm.reset({
      tipoBusqueda: TIPO_BUSQUEDA_VALUE,
      rfc: '',
      tipoDeTramite: '',
      folioDeTramite: '',
    });
    this.datosDelContenedor = [];
    this.tramiteList.catalogos = [];
  }

  /**
   * Navega a una ruta específica si el objeto de la fila contiene un `folioTramite`.
   *
   * @param row - Objeto que representa una fila, debe contener la propiedad `folioTramite`.
   *
   * Este método verifica si la propiedad `folioTramite` está presente en el objeto `row`.
   * Si está presente, redirige al usuario a la ruta `/pago/autoridad/requiremento` y pasa
   * el objeto `row` como parte del estado de navegación.
   *
   * También registra en la consola el valor de `folioTramite` para fines de depuración.
   */
  valorDeAlternancia(row: Requerimiento): void {
    const CURRENT_URL = this.router.url;
    if (row?.row?.folioTramite) {
      if(CURRENT_URL.includes('agace')){
        this.router.navigate(['/agace/autoridad/requiremento'], {
          state: { data: row },
        });
      }
      if(CURRENT_URL.includes('pago')){
        this.router.navigate(['/pago/autoridad/requiremento'], {
          state: { data: row },
        });
      }
    }
  }

  /**
  * Cambia el valor seleccionado del radio.
  * @param value Valor seleccionado.
  */
  public cambiarRadio(value: string | number): void {
    this.valorSeleccionado = value as string;
  }

    ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}