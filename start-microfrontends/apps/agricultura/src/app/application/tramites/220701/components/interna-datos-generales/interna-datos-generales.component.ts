/**
 * @component
 * @name InternaDatosGeneralesComponent
 * @description
 * Componente para manejar los datos generales internos del trámite 220701.
 * Permite gestionar formularios y datos relacionados con los trámites, incluyendo lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @example
 * <interna-datos-generales [esFormularioSoloLectura]="true"></interna-datos-generales>
 */

import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Subject, delay, map, takeUntil, tap } from 'rxjs';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';

import {
  ConsultaioQuery,
  TablaDinamicaComponent,
} from '@ng-mf/data-access-user';

import {
  InternaDatosGeneralesInt,
  MERCANCIA_SERVICIO,
  mercanciaInfo,
} from '../../modelos/datos-de-interfaz.model';

import { CatalogosService } from '../../servicios/catalogos.service';
import { MercanciaDatosService } from '../../servicios/mercancia-datos.service';
import { RevisionService } from '../../servicios/revision.service';

import {
  TramiteState,
  TramiteStore,
} from '../../estados/tramite220701.store';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';

/**
 * @component
 * @name InternaDatosGeneralesComponent
 * @description
 * Componente para manejar los datos generales internos del trámite 220701.
 * Permite gestionar formularios y datos relacionados con los trámites, incluyendo lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 *
 * - Gestiona la captura y visualización de datos generales del trámite.
 * - Sincroniza el estado del formulario con el store.
 * - Carga catálogos y datos auxiliares desde servicios.
 * - Permite el modo solo lectura para revisión.
 *
 * @example
 * <interna-datos-generales [esFormularioSoloLectura]="true"></interna-datos-generales>
 */
@Component({
  selector: 'interna-datos-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './interna-datos-generales.component.html',
  styleUrl: './interna-datos-generales.component.scss',
})
export class InternaDatosGeneralesComponent implements OnInit, OnDestroy {
  /**
   * Formulario principal del componente.
   * Contiene los campos y validaciones necesarias para los datos generales.
   */
  forma!: FormGroup;

  /**
   * Estado interno relacionado con los datos generales.
   * Contiene la información manejada dentro del componente.
   */
  internaDatosGeneralesState!: InternaDatosGeneralesInt;

  /**
   * Formulario con los datos de la solicitud.
   * Permite capturar y validar la información de la solicitud.
   */
  datosDelaSolicitud!: FormGroup;

  /**
   * Catálogo seleccionado para la empresa transportista.
   * Contiene las opciones disponibles para seleccionar una empresa.
   */
  empresaTransportista!: CatalogosSelect;

  /**
   * Formulario relacionado con la movilización de mercancía.
   * Permite capturar y validar los datos de movilización.
   */
  movilizacionForm!: FormGroup;

  /**
   * Dirección actual del flujo de navegación (1 = siguiente, -1 = anterior).
   */
  currentDirection: number | null = 1;

  /**
   * Datos cargados para los menús desplegables.
   * Utilizados para alimentar los selectores del formulario.
   */
  dropdownData = [];

 

  /**
   * Lista de opciones de aduana de ingreso.
   */
  aduanaDeIngreso: Catalogo[] = [];

  /**
   * Lista de opciones de sanidad agropecuaria.
   */
  sanidadAgropecuaria!: CatalogosSelect;

  /**
   * Lista de puntos de inspección.
   */
  puntoInspeccion!: CatalogosSelect;

  /**
   * Punto de verificación seleccionado.
   */
  puntoVerificacion!: CatalogosSelect;

  /**
   * Oficina de inspección seleccionada.
   */
  oficinaInspeccion!: CatalogosSelect;

  /**
   * Régimen al que se destinarán los productos.
   */
  regimenDestinaran!: CatalogosSelect;

   /**
   * Catálogo seleccionado de la aduana de ingreso.
   */
 

  aduanaIngreso!: CatalogosSelect;

  /**
   * Tipo de movilización nacional seleccionada.
   */
  movilizacionNacional!: CatalogosSelect;

  /**
   * Lista de establecimientos TIF disponibles.
   */
  establecimientoTIF!: CatalogosSelect;

  /**
   * Lista de veterinarios disponibles.
   */
  veterinario!: CatalogosSelect;

  /**
   * Identificador único del registro (opcional).
   */
  id?: number;

  /**
   * Descripción asociada al registro.
   */
  descripcion: string = '';

  /**
   * Tamaño del objeto o campo (opcional).
   */
  tam?: string;

  /**
   * Documento Personal de Identificación (DPI) (opcional).
   */
  dpi?: string;

  /**
   * Lista de opciones de régimen.
   */
  regimen: Catalogo[] = [];

  /**
   * Valor seleccionado por el usuario (por defecto 'no').
   */
  seleccionadoValor: string = 'no';

  /**
   * Configuración de columnas para la tabla de mercancías.
   */
  mercanciaTabla: ConfiguracionColumna<mercanciaInfo>[] = MERCANCIA_SERVICIO;

  /**
   * Datos cargados para la tabla de mercancías.
   */
  mercanciaTablaDatos: mercanciaInfo[] = [];

  /**
   * Datos de mercancía obtenidos desde la API.
   */
  mercanciaApiDatos: mercanciaInfo[] = [];

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * Notificador para destruir suscripciones al destruir el componente.
   * Se usa en combinación con `takeUntil`.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Estado actual de la sección gestionada por Akita.
   */
  private seccion!: SeccionLibState;

  /**
   * Índice actual del paso o pestaña activa.
   */
  currentIndex = 0;

  /**
   * Constructor del componente.
   * Inicializa los servicios e inyecta las dependencias necesarias.
   *
   * @param fb Servicio para construir formularios reactivos.
   * @param revisionService Servicio para revisar y validar datos del trámite.
   * @param validacionesService Servicio para aplicar validaciones personalizadas.
   * @param mercanciaDatosService Servicio para gestionar datos relacionados con mercancías.
   * @param catalogosService Servicio para consultar catálogos.
   * @param httpServicios Cliente HTTP para realizar peticiones.
   * @param cdr ChangeDetectorRef para controlar el ciclo de detección de cambios.
   * @param tramiteStoreQuery Query de estado del trámite (Akita).
   * @param tramiteStore Store del estado del trámite (Akita).
   * @param seccionQuery Query de la sección actual (Akita).
   * @param seccionStore Store de la sección actual (Akita).
   * @param consultaioQuery Query para consultar datos de IO.
   */
  constructor(
    private readonly fb: FormBuilder,
    private revisionService: RevisionService,
    private validacionesService: ValidacionesFormularioService,
    private mercanciaDatosService: MercanciaDatosService,
    private catalogosService: CatalogosService,
    private httpServicios: HttpClient,
    private cdr: ChangeDetectorRef,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Lógica constructora
  }

  /**
   * Ciclo de vida `OnInit` del componente.
   *
   * Inicializa el formulario principal y carga datos necesarios para su funcionamiento.
   * Realiza las siguientes acciones:
   *
   * - Crea la estructura inicial del formulario con `crearFormulario()`.
   * - Desactiva campos específicos mediante `disableFormControls()`.
   * - Carga catálogos y opciones desplegables a través de varios métodos (`getOficinaInspeccion`, `obtenerEstablecimientoList`, `obtenerVeterinarioList`, etc.).
   * - Se suscribe al estado del store `TramiteStoreQuery` para recuperar y aplicar datos previos al formulario.
   * - Se suscribe a los cambios del estado del formulario (`statusChanges`) para guardar automáticamente los datos en el store.
   * - Llama al método `obtenerDatos()` para cargar datos adicionales (dependiendo del negocio).
   * - Se suscribe al estado de sección desde `SeccionQuery` y guarda el estado actual.
   *
   * Las suscripciones se cancelan automáticamente mediante el `destroyNotifier$` al destruir el componente.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  ngOnInit(): void {
    this.esFormularioSoloLectura = this.consultaioQuery.getValue().readonly;
    
    // Inicializar internaDatosGeneralesState si está indefinido
    if (!this.internaDatosGeneralesState) {
      this.internaDatosGeneralesState = {} as InternaDatosGeneralesInt;
    }
    
    this.inicializarFormulario();
    /**
     * Se suscribe al estado de `ConsultaioQuery` para obtener si el formulario debe estar en modo de solo lectura.
     * También inicializa el estado del formulario cada vez que cambia el estado.
     *
     * Esta suscripción se cancela automáticamente al destruir el componente mediante `takeUntil`.
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            this.forma.disable();
            this.movilizacionForm.disable();
          } else {
            this.forma.enable();
            this.movilizacionForm.enable();
            // Mantener campos específicos deshabilitados
            this.forma.get('datosDelaSolicitud')?.get('claveControlUnico')?.disable();
            this.forma.get('datosDelaSolicitud')?.get('folioControlUnico')?.disable();
            this.forma.get('datosDelaSolicitud')?.get('numeroGuia')?.disable();
            // tipoMercancia solo se deshabilita en modo solo lectura
            if (this.esFormularioSoloLectura) {
              this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.disable();
            } else {
              this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.enable();
            }
            this.movilizacionForm.get('coordenadas')?.disable();
            this.movilizacionForm.get('identTransporte')?.disable();
            this.movilizacionForm.get('empresaTransportista')?.disable();
          }
        })
      )
      .subscribe();

    this.getAduanaIngreso();
    this.obtenerSanidadAgropecuariaList();
    this.getOficinaInspeccion();
    this.getRegimenDestinaran();
    this.getMovilizacionNacional();
    this.getPuntoVerificacion();
    this.getEmpresaTransportista();
    this.obtenerListasDesplegables();

    /**
     * Suscripción al estado del trámite para actualizar los formularios y el store.
     *
     * - Se suscribe a los cambios en el estado del trámite (`selectSolicitudTramite$`).
     * - Cuando hay cambios, actualiza el estado interno y aplica los valores a los formularios principales.
     * - Si el formulario está en modo solo lectura, deshabilita los controles después de aplicar los valores.
     * - También se suscribe a los cambios de estado de ambos formularios (`forma` y `movilizacionForm`), y guarda automáticamente el estado actualizado en el store.
     * - Todas las suscripciones se cancelan automáticamente al destruir el componente mediante `takeUntil(this.destroyNotifier$)`.
     * - Finalmente, se suscribe al estado de la sección para mantener sincronizado el estado local.
     */
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: TramiteState) => {
          if (seccionState) {
            this.internaDatosGeneralesState =
              seccionState?.InternaDatosGeneralesState;
            this.forma.patchValue({
              datosDelaSolicitud: this.internaDatosGeneralesState,
            });
            this.movilizacionForm.patchValue(this.internaDatosGeneralesState);
            
            if (this.esFormularioSoloLectura) {
              this.forma.disable();
              this.movilizacionForm.disable();
              this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.disable();
            } else {
              this.forma.enable();
              this.movilizacionForm.enable();
              // Mantener campos específicos deshabilitados incluso cuando el formulario está habilitado
              this.forma.get('datosDelaSolicitud')?.get('claveControlUnico')?.disable();
              this.forma.get('datosDelaSolicitud')?.get('folioControlUnico')?.disable();
              this.forma.get('datosDelaSolicitud')?.get('numeroGuia')?.disable();
              this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.enable();
              this.movilizacionForm.get('coordenadas')?.disable();
              this.movilizacionForm.get('identTransporte')?.disable();
              this.movilizacionForm.get('empresaTransportista')?.disable();
            }
          }
        })
      )
      .subscribe();

    this.forma.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap(() => {
          const ACTIVE_STATE = { ...this.forma.value };
          this.tramiteStore.setInternaDatosGeneralesTramite(ACTIVE_STATE);
        })
      )
      .subscribe();

    this.movilizacionForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap(() => {
          const ACTIVE_STATE = { ...this.movilizacionForm.value };
          this.tramiteStore.setInternaDatosGeneralesTramite(ACTIVE_STATE);
        })
      )
      .subscribe();

    this.obtenerDatos();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario dependiendo del modo de acceso.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), guarda los datos actuales del formulario.
   * En caso contrario, inicializa el formulario para su edición.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
      this.movilizacionForm.disable();
    } else {
      this.forma.enable();
      this.movilizacionForm.enable();
      // Mantener campos específicos deshabilitados
      this.forma.get('datosDelaSolicitud')?.get('claveControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('folioControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('numeroGuia')?.disable();
      // tipoMercancia solo se deshabilita en modo solo lectura
      if (this.esFormularioSoloLectura) {
        this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.disable();
      } else {
        this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.enable();
      }
      this.movilizacionForm.get('coordenadas')?.disable();
      this.movilizacionForm.get('identTransporte')?.disable();
      this.movilizacionForm.get('empresaTransportista')?.disable();
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
      this.movilizacionForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.forma.enable();
      this.movilizacionForm.enable();
      // Mantener campos específicos deshabilitados
      this.forma.get('datosDelaSolicitud')?.get('claveControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('folioControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('numeroGuia')?.disable();
      // tipoMercancia solo se deshabilita en modo solo lectura
      if (this.esFormularioSoloLectura) {
        this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.disable();
      } else {
        this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.enable();
      }
      this.movilizacionForm.get('identTransporte')?.disable();
      this.movilizacionForm.get('empresaTransportista')?.disable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }
  /**
   * Inicializa los formularios `forma` y `movilizacionForm`, y sus estructuras de control.
   *
   * También se suscribe al estado del store de trámite para obtener los datos actuales
   * del estado `InternaDatosGeneralesState`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  inicializarFormulario(): void {
    // Inicializar internaDatosGeneralesState si está indefinido
    if (!this.internaDatosGeneralesState) {
      this.internaDatosGeneralesState = {} as InternaDatosGeneralesInt;
    }
    
    this.forma = this.fb.group({
      datosDelaSolicitud: this.fb.group({
        aduanaIngreso: [this.internaDatosGeneralesState?.aduanaIngreso, Validators.required],
        oficinaInspeccion: [this.internaDatosGeneralesState?.oficinaInspeccion, Validators.required],
        puntoInspeccion: [this.internaDatosGeneralesState?.puntoInspeccion, Validators.required],
        claveControlUnico: [this.internaDatosGeneralesState?.claveControlUnico, { disabled: true }, Validators.required],
        establecimientoTIFs: [this.internaDatosGeneralesState?.establecimientoTIFs, Validators.required],
        nombreVeterinario: [this.internaDatosGeneralesState?.nombreVeterinario, Validators.required],
        regimen: [this.internaDatosGeneralesState?.regimen],
        folioControlUnico: [this.internaDatosGeneralesState?.folioControlUnico, { disabled: true }],
        numeroGuia: [this.internaDatosGeneralesState?.numeroGuia, { disabled: true }],
        tipoMercancia: [this.internaDatosGeneralesState?.tipoMercancia || 'subproductos', { disabled: true }],
      }),
    });

    this.movilizacionForm = this.fb.group({
      coordenadas: [{ value: this.internaDatosGeneralesState?.coordenadas || '', disabled: true }],
      movilizacionNacional: [this.internaDatosGeneralesState?.movilizacionNacional],
      identTransporte: [{ value: this.internaDatosGeneralesState?.identTransporte || '', disabled: true }],
      puntoVerificacion: [this.internaDatosGeneralesState?.puntoVerificacion],
      empresaTransportista: [{ value: this.internaDatosGeneralesState?.empresaTransportista || '', disabled: true }],
    });

    // Deshabilitar formularios si la bandera está establecida
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
      this.movilizacionForm.disable();
    } else {
      // Mantener campos específicos deshabilitados incluso cuando el formulario está habilitado
      this.forma.get('datosDelaSolicitud')?.get('claveControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('folioControlUnico')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('numeroGuia')?.disable();
      this.forma.get('datosDelaSolicitud')?.get('tipoMercancia')?.disable();
      this.movilizacionForm.get('coordenadas')?.disable();
      this.movilizacionForm.get('identTransporte')?.disable();
      this.movilizacionForm.get('empresaTransportista')?.disable();
    }
  }

  /**
   * Crea e inicializa el formulario principal `forma` con su estructura básica.
   *
   * En este caso, se define un único grupo anidado llamado `datosDelaSolicitud`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  crearFormulario(): void {
    this.forma = this.fb.group({
      datosDelaSolicitud: this.fb.group({}),
    });
  }

  /**
   * Verifica si un campo específico dentro de un formulario es válido.
   *
   * Utiliza el servicio `ValidacionesFormularioService` para determinar si el campo cumple con las validaciones definidas.
   *
   * @param {FormGroup} form El formulario que contiene el campo a validar.
   * @param {string} field El nombre del campo dentro del formulario a verificar.
   * @returns {boolean} Retorna `true` si el campo es válido, `false` en caso contrario.
   * @memberof InternaDatosGeneralesComponent
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Obtiene los datos de mercancía desde el servicio `MercanciaDatosService`.
   *
   * Se suscribe al observable retornado por `getDatos()`, asignando la respuesta
   * al arreglo `mercanciaTablaDatos` si la respuesta tiene el formato esperado.
   *
   * En caso de error o respuesta inesperada, se registra un error en la consola.
   * Se usa `takeUntil` con `destroyNotifier$` para cancelar la suscripción al destruir el componente.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerDatos(): void {
    this.mercanciaDatosService
      .getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: { mercanciaApiDatos: mercanciaInfo[] }) => {
          if (response && Array.isArray(response.mercanciaApiDatos)) {
            this.mercanciaTablaDatos = response.mercanciaApiDatos;
            this.cdr.detectChanges();
          }
        }
      });
  }

  /**
   * Ejecuta la carga de las listas desplegables necesarias para el formulario.
   *
   * Este método agrupa y llama a otros métodos que obtienen datos
   * para diferentes selectores del formulario, como aduana de ingreso,
   * sanidad agropecuaria, puntos de inspección, establecimientos,
   * veterinarios y regímenes.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerListasDesplegables(): void {
    this.obtenerIngresoSelectList();
    this.obtenerSanidadAgropecuariaList();
    this.obtenerPuntoInspeccionList();
    this.obtenerEstablecimientoList();
    this.obtenerVeterinarioList();
    this.obtenerRegimenList();
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde el servicio de catálogos
   * y asigna los datos a la propiedad `aduanaDeIngreso`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerIngresoSelectList(): void {
    this.catalogosService
      .obtenerAduanaDeIngreso()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        const DATOS = data?.data;
        this.aduanaDeIngreso = DATOS;
      });
  }

  /**
   * Obtiene la lista de sanidad agropecuaria desde el servicio de catálogos
   * y asigna los datos a la propiedad `sanidadAgropecuaria`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerSanidadAgropecuariaList(): void {
    this.catalogosService
      .obtenerSanidadAgropecuaria()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if(resp.code === 200) {
          const RESPONSE = resp.data;
       
        this.sanidadAgropecuaria = {
          labelNombre: 'Oficina de inspección de sanidad Agropecuaria',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
      });
  }

  /**
   * Obtiene la lista de puntos de inspección desde el servicio de revisión
   * y asigna los datos a la propiedad `puntoInspeccion`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerPuntoInspeccionList(): void {
    this.revisionService
      .getPuntoInspeccion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.puntoInspeccion = {
            labelNombre: 'Punto de inspección',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de establecimientos TIF desde el servicio de revisión
   * y asigna los datos a la propiedad `establecimientoTIF`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerEstablecimientoList(): void {
    this.revisionService
      .getEstablecimiento()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.establecimientoTIF = {
            labelNombre: 'Establecimiento TIF',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de veterinarios desde el servicio de revisión
   * y asigna los datos a la propiedad `veterinario`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerVeterinarioList(): void {
    this.revisionService
      .getVeterinario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.veterinario = {
            labelNombre: 'Nombre del médico veterinario',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de regímenes desde el servicio de catálogos
   * y asigna los datos a la propiedad `regimen`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  obtenerRegimenList(): void {
    this.catalogosService
      .obtenerRegimen()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        const DATOS = data?.data;
        this.regimen = DATOS;
      });
  }

  /**
   * Obtiene la aduana de ingreso desde el servicio de revisión
   * y asigna la configuración al control `aduanaIngreso`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getAduanaIngreso(): void {
    this.revisionService
      .getAduanaIngreso()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.aduanaIngreso = {
            labelNombre: 'Aduana de ingreso',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la oficina de inspección desde el servicio de revisión
   * y asigna la configuración al control `oficinaInspeccion`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getOficinaInspeccion(): void {
    this.revisionService
      .getOficianaInspeccion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.oficinaInspeccion = {
            labelNombre: 'Oficina de Inspección de Sanidad Agropecuaria',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los regímenes a los que se destinarán las mercancías desde el servicio de revisión
   * y asigna la configuración al control `regimenDestinaran`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getRegimenDestinaran(): void {
    this.revisionService
      .getRegimenDestinaran()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.regimenDestinaran = {
            labelNombre: 'Régimen al que se destinarán las mercancías',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene las opciones de movilización nacional desde el servicio de revisión
   * y asigna la configuración al control `movilizacionNacional`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getMovilizacionNacional(): void {
    this.revisionService
      .getMovilizacionNacional()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.movilizacionNacional = {
            labelNombre: 'Datos para movilización nacional',
            required: false,
            primerOpcion: 'Aéreo',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los puntos de verificación federales desde el servicio de revisión
   * y asigna la configuración al control `puntoVerificacion`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getPuntoVerificacion(): void {
    this.revisionService
      .getPuntoVerificacion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.puntoVerificacion = {
            labelNombre: 'Punto de verificación federal',
            required: false,
            primerOpcion: 'REGIÓN NORTE, LA CONCHA, SIN.',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de empresas transportistas desde el servicio de revisión
   * y asigna la configuración al control `empresaTransportista`.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  getEmpresaTransportista(): void {
    this.revisionService
      .getEmpresaTransportista()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.empresaTransportista = {
            labelNombre: 'Nombre de la empresa transportista',
            required: false,
            primerOpcion: '',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Método del ciclo de vida para limpiar las suscripciones
   * y evitar fugas de memoria al destruir el componente.
   *
   * @returns {void}
   * @memberof InternaDatosGeneralesComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
