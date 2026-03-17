import { AlertComponent, CONDICIONES_JUEGOS_SURTIDOS, CONDICIONES_JUEGOS_SURTIDOS_ALIANZA, CategoriaMensaje, ConsultaioQuery, InputRadioComponent, MENSAJE_DE_SELECCION, Notificacion } from '@ng-mf/data-access-user';
import { CatalogosTramiteService } from '../../services/catalogo.service';

import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitante110101State, Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { PROTESTA } from '@ng-mf/data-access-user';
import { REQUERIDO } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';

import { DescripcionAlternaResponse, Mercancia } from '../../models/response/validar-solicitud-response.model';
import { OPCIONES, RADIO_OPCIONS, SELECCIONAR_TRANSFORMACION} from '../constante110101.enum';
import { MensajePantallaService } from '../../services/validaciones-tabs.service';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
* Este componente se utiliza para mostrar la forma del datos adicionales. - 110101
*/
@Component({
  selector: 'app-datos-adicionales',
  templateUrl: './datos-adicionales.component.html',
  styleUrl: './datos-adicionales.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    AlertComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    TooltipModule
  ]
})
export class DatosAdicionalesComponent implements OnInit, OnDestroy {

  /**
     * Notificación actual que se muestra en el componente.
     *
     * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
     * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
     */
    public nuevaNotificacion!: Notificacion;

  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea del tipo 'FormGroup'.
   *
   * @property {FormGroup} formulario - El formulario del componente.
   */
  public formulario!: FormGroup;

  /**
 * **Subject para manejar la destrucción de suscripciones**
 *
 * - Se utiliza para cancelar las suscripciones activas cuando el componente o servicio es destruido.
 * - Evita fugas de memoria al asegurarse de que las suscripciones se cancelen correctamente.
 * - Se emite un valor en `ngOnDestroy` y luego se completa.
 *
 * @private
 */
  private destroy$ = new Subject<void>();

  /**
   * Representa la entidad seleccionada del catálogo.
   * Se espera que esta propiedad sea del tipo 'CatalogosSelect'.
   *
   * @property {CatalogosSelect} entidad - La entidad seleccionada.
   */
  public entidad!: Catalogo[];

  /**
   * Representa la representación seleccionada del catálogo.
   * Se espera que esta propiedad sea del tipo 'CatalogosSelect'.
   *
   * @property {CatalogosSelect} representacion - La representación seleccionada.
   */

  public representacion!: Catalogo[];
  /**
    * Una cadena que representa la clase CSS para una alerta de información.
    * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
    */
  public infoAlert = 'alert-info';
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se está realizando una actualización de la consulta.
   * 
   * @default false
   */
  actualizacionCounsulta: boolean = false;

  /**
    * Una constante que contiene textos adicionales para el componente.
    * Se utiliza para almacenar datos adicionales relacionados con el componente.
    */
  public textos?: string;

  /**
   * Representa el estado actual del solicitante para el trámite 110101.
   * Esta propiedad contiene toda la información relevante y el estado del solicitante.
   */
  public solicitudeState!: Solicitante110101State;

  /**
   * Opciones disponibles para el grupo de radio.
   */
  public radioOpcions = RADIO_OPCIONS;

  /**
   * Opciones para el campo de radio (Si/No).
   */
  public opciones = OPCIONES;

  /**
   * Opciones para seleccionar el tipo de proceso (Transformación/Ensamble o montaje).
   */
  public seleccionarTransformacion = SELECCIONAR_TRANSFORMACION;

  /**
   * Indica si se deben mostrar los campos adicionales relacionados con la opción de exportador autorizado.
   * Cuando es `true`, se despliegan los campos adicionales en la interfaz; cuando es `false`, permanecen ocultos.
   *
   * @default false
   */
  public mostrarCampos: boolean = false;

  /**
   * Vista instancia de proceso de transformación
   * Cuando es 'true', permite ver la vista de proceso de transformación.
   */
  isProcesoTransformacion: boolean = false;

  /**
   * Mensaje de alerta para selección de proceso de transformación de la mercancía
   * @property {string} mensajeDeSeleccion - Contiene el mensaje para selección de proceso de transformación
   */
  mensajeDeSeleccion = MENSAJE_DE_SELECCION;

  /**
   * Vista instancia de juegos o surtidos
   * Cuando es 'true', permite ver la vista de juegos o surtidos
   */
  isJuegosSurtidos: boolean = false;

  /**
   * Mensaje de alerta para juegos o surtidos
   * @property {string} condiciones - Contiene las condiciones para juegos o surtidos
   */
  condiciones = CONDICIONES_JUEGOS_SURTIDOS;

  /**
   * Mensaje de alerta para juegos o surtidos México - Panamá
   * @property {string} condicionAlianza - Contiene las condiciones para juegos o surtidos México - Panamá
   */
  condicionAlianza = CONDICIONES_JUEGOS_SURTIDOS_ALIANZA;

  /** Variable para validar el formulario */
  validarFormulario: boolean = false;

  /** Almacena los valores previos de los campos del formulario */
  private valoresPrevios: Record<string, number | null> = {};

  /**
   * Una constante que contiene la cadena de mensaje requerida.
   * Este mensaje se utiliza para indicar que un campo es obligatorio.
   */
  public MENSAJE_REQUERIDO = REQUERIDO;

  /** Controla la visualización de las descripciones alternas en la interfaz */
  descripcionesMostrar: boolean = false;

  /**
 * @property descripcionesPorTipo
 * @type {Array}
 * @public
 * @description
 * Almacena las descripciones alternas de mercancía organizadas por tipo de acuerdo comercial.
 * Cada elemento del array contiene el tipo de acuerdo y las descripciones asociadas con sus IDs.
 * Se utiliza para mostrar las descripciones disponibles en la interfaz de usuario.
 */
public descripcionesPorTipo: {
  tipo: string;
  descripciones: { id: number; descripcion: string }[];
}[] = [];


  /**
   * constructor de la clase
   * Fetch the fetchtiposDocumentos datos
   * Crea el formulario
   * @param fb: constructor de formularios
   * @param validacionesService: Validaciones comunes del formulario.
   */
  constructor(private fb: FormBuilder,
    private tramite110101Store: Tramite110101Store,
    private solicitanteQuery: Solicitante110101Query,
    private consultaioQuery: ConsultaioQuery,
    private catalogoTramiteService: CatalogosTramiteService,
    private mensajeService: MensajePantallaService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (seccionState.update) {
            this.actualizacionCounsulta = seccionState.update;

           }
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.solicitanteQuery.selectSolicitante$.pipe(takeUntil(this.destroy$), map((seccionState) => {
      this.solicitudeState = seccionState;
    })).subscribe();
    this.inicializarFormulario();
    this.getEntidadFederativa();
    this.getDeclaracionDatos();
    
    this.formulario.statusChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((_value) => {
          this.validarFormulario = this.formulario.valid;
          this.tramite110101Store.setValidacionFormulario('validacion_tab_datos_adicionales', this.formulario.valid);
        })
      )
      .subscribe(); 

     if(this.solicitudeState.validacion_formularios.validacion_tab_datos_adicionales === false){
      this.formulario.markAllAsTouched();
      this.validarFormularioAdicionales();
    }

    if(this.solicitudeState.descripcion_evaluar){
      this.activarDescripciones(this.solicitudeState.descripcion_evaluar);
    }
  
  }

  /**
   * Inicializa el formulario reactivo del componente con los valores por defecto
   * del estado actual `solicitudeState`. El formulario contiene los controles
   * 'entidad' y 'representacion', ambos marcados como requeridos.
   * Este método debe llamarse para configurar el formulario antes de la interacción del usuario.
   */
  public inicializarFormulario(): void {
    this.formulario = this.fb.group({
      entidad: [this.solicitudeState?.entidad, Validators.required],
      representacion: [this.solicitudeState?.representacion, Validators.required],
      metodoSeparacion: [Boolean(this.solicitudeState?.metodoSeparacion)],
      exportadorAutorizado: [Boolean(this.solicitudeState?.exportadorAutorizado)],
      exportadorAutorizadoJPN: [Boolean(this.solicitudeState?.exportadorAutorizadoJPN)],
      informacionRadios: [this.solicitudeState?.informacionRadios],
      informacionRadiosJPN: [this.solicitudeState?.informacionRadiosJPN],
      transformacion53:[this.solicitudeState?.transformacion53],
      descripcionJuegoSurtido: [this.solicitudeState?.juegos_surtidos_tab_procesos],
      juegosSurtidosBooleanMexicoPeru: [this.solicitudeState?.juegosSurtidosBooleanMexicoPeru],
      juegosSurtidosBooleanMexicoPanama: [this.solicitudeState?.juegosSurtidosBooleanMexicoPanama],
      juegosSurtidosBooleanAlianzaPacifico: [this.solicitudeState?.juegosSurtidosBooleanAlianzaPacifico],
      protesto_verdad: [this.solicitudeState?.protesto_verdad, Validators.requiredTrue],
      descripcionUE: [this.solicitudeState?.descripcionUE],
      descripcionAELC: [this.solicitudeState?.descripcionAELC],
      descripcionSGP: [this.solicitudeState?.descripcionSGP],
      descripcionACE: [this.solicitudeState?.descripcionACE],
    });
  }

  /**
   * @method getEntidadFederativa
   * @description Obtiene el catálogo de la entidad federativa
   *
   * Recupera y establece la información de la entidad federativa.
   * El objeto de entidad incluye el nombre de la etiqueta, el estado requerido, la opción predeterminada,
   * y un catálogo de opciones disponibles.
   *
   * @returns {void}
   */
  public getEntidadFederativa(): void {
    this.catalogoTramiteService.getCatEntidadesFederativas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            // El backend manda "datos"
            const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.entidad = DATOS.map((item, index) => ({
            id: index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
          }));
          
        const VALOR_GUARDADO = this.formulario.get('entidad')?.value;
        if (VALOR_GUARDADO) {
          const OPCION = this.entidad.find(
                (c) => c.clave === VALOR_GUARDADO || c.id === VALOR_GUARDADO);
          
          this.formulario.patchValue({
            entidad: OPCION?.id,
          }, { emitEvent: false }); // IMPORTANTE: evitar bucles
          this.getRepresentacionFederal(OPCION?.clave || '');
          

        }
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error catálogo de entidad federativa.',
            mensaje: response.causa || response.mensaje || 'Error catálogo de entidad federativa',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: 'Error al obtener catálogo de entidad federativa.',
          mensaje: err?.mensaje || 'Error al obtener catálogo de entidad federativa.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      }
    });
  }

  /**
   * @method getRepresentacionFederal
   * @description Obtiene el catálogo de la representación federal.
   * @param cveEntidad - Clave de la entidad federativa para filtrar la representación federal.
   * 
   * Recupera y establece la información de la entidad federativa.
   * El objeto de entidad incluye el nombre de la etiqueta, el estado requerido, la opción predeterminada,
   * y un catálogo de opciones disponibles.
   *
   * @returns {void}
   */
  public getRepresentacionFederal(cveEntidad: string): void {
    this.tramite110101Store.setEntidad(cveEntidad);
    this.catalogoTramiteService.getCatRepresentacionFederal(cveEntidad)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            // El backend manda "datos"
            const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.representacion = DATOS.map((item, index) => ({
            id: index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
          }));
          const VALOR_GUARDADO_REPRESENTACION = this.formulario.get('representacion')?.value;
          const OPCION_REPRESENTACION = this.representacion.find(
            (c) => c.clave === VALOR_GUARDADO_REPRESENTACION || c.id === VALOR_GUARDADO_REPRESENTACION
          );
          this.formulario.patchValue({
            representacion: OPCION_REPRESENTACION?.id
          }, { emitEvent: false }); // IMPORTANTE: evitar bucles
        }else{
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error catálogo de representación federal.',
            mensaje: response.causa || response.mensaje || 'Error catálogo de representación federal',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: 'Error al obtener catálogo de representación federal.',
          mensaje: err?.mensaje || 'Error al obtener catálogo de representación federal.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      }
    });
  }

  /**
   * @method onRepresentacionFederal
   * @description Maneja el evento de selección de una representación federal.
   * @param {Catalogo} selectedOption - La opción seleccionada de representación federal.
   * @returns {void} No retorna ningún valor.
   */
  onRepresentacionFederal(selectedOption: Catalogo): void {
    this.getRepresentacionFederal(selectedOption.clave || '');
  }

  /**
   * Maneja el cambio de selección de representación federal y 
   * actualiza el estado del store con la clave seleccionada.
   *
   * @method onRepresentacionChange
   * @param {Catalogo} event - Objeto del catálogo que representa la opción seleccionada.
   * @returns {void} No retorna ningún valor.
   */
  onRepresentacionChange(event: Catalogo): void {
    this.tramite110101Store.setRepresentacion(event.clave ?? null);
  }

  /**
   * @method getDeclaracionDatos
   * @description Obtiene el catálogo de la declaración de datos.
   * Recupera y establece la información de la declaración de datos.
   * El objeto de declaración de datos incluye el nombre de la etiqueta y la descripción.
   *
   * @returns {void}
   */
  public getDeclaracionDatos(): void {
    this.catalogoTramiteService.getCatDeclaracionDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.codigo === CodigoRespuesta.EXITO) {          
         this.textos = response.datos?.[0]?.descripcion ?? undefined;
         this.tramite110101Store.clearDeclaraciones();
         this.tramite110101Store.addDeclaraciones(response.datos ?? []);
        }else {
        this.textos = PROTESTA.ADJUNTAR;}
      });
  }
  
  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110101Store, campoStore?: string): void {
    const VALOR = form.get(campo)?.value;
    if (metodoNombre === 'setValor' ) {
      const CAMPO = (campoStore) as keyof Solicitante110101State;
      this.tramite110101Store.setValor(CAMPO, VALOR);
    }else{
      (this.tramite110101Store[metodoNombre] as (value: unknown) => void)(VALOR);
    }
  }


   /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStoreDescripciones(form: FormGroup, campo: string, metodoNombre: keyof Tramite110101Store, campoStore?: string): void {
    const VALOR = form.get(campo)?.value;

     const VALOR_ANTERIOR = this.valoresPrevios[campo];

    let MODIFICADO = false;

    const AMBOS_VACIOS =
      (VALOR === null || VALOR === undefined) &&
      (VALOR_ANTERIOR === null || VALOR_ANTERIOR === undefined);

    if (!AMBOS_VACIOS) {
      MODIFICADO = VALOR !== VALOR_ANTERIOR;
    }

    this.tramite110101Store.setValor('descripcion_alterna_modificada', MODIFICADO);

    // Guardar valor para siguiente comparación
    this.valoresPrevios[campo] = VALOR;

    if (metodoNombre === 'setValor' ) {
      const CAMPO = (campoStore) as keyof Solicitante110101State;
      this.tramite110101Store.setValor(CAMPO, VALOR);
    }else{
      (this.tramite110101Store[metodoNombre] as (value: unknown) => void)(VALOR);
    }
  }

  /**
   * Busca un país en la tabla de datos del servicio de solicitud.
   * @param country - El código del país a buscar.
   * @returns true si el país se encuentra en la tabla, false en caso contrario.
   */
  busquedaPaises(country: string): boolean {
  const DATA = this.solicitudeState?.respuestaServicioDatosTabla;
  return Array.isArray(DATA) ? DATA.some(item => item?.cve_pais === country) : false;
}

/**
 * @description Valida el formulario principal y el de otras instancias antes de continuar.
 * @method validarFormularioAdicionales
 * @returns {boolean} Retorna `true` si todos los formularios son válidos, de lo contrario `false`.
 */
 validarFormularioAdicionales(): boolean {
    if (this.formulario.valid === false) {
     this.formulario.markAllAsTouched();
      return false;
    }
    return true
  }


/**
 * @method activarDescripciones
 * @description
 * Activa y configura las descripciones alternas de mercancía para mostrar en la interfaz.
 * Procesa los datos de respuesta de validación y organiza las descripciones por tipo
 * (UE, AELC, SGP, ACE) cuando están disponibles.
 * @param {ValidarSolicitudResponse} data - Datos de respuesta de la validación que contienen la información de mercancía.
 * @returns {void}
 */
  public activarDescripciones(data: Mercancia): void {
  if (!data) {
    this.descripcionesMostrar = false;
    return;
  }
  type ClaveDescripcionAlterna =
  | 'descripciones_alternas_ue'
  | 'descripciones_alternas_aelc'
  | 'descripciones_alternas_sgp'
  | 'descripciones_alternas_ace';
  this.descripcionesPorTipo = [];
  const TIPOS: { key: ClaveDescripcionAlterna; label: string }[] = [
    { key: 'descripciones_alternas_ue', label: 'la Unión Europea (UE)' },
    { key: 'descripciones_alternas_aelc', label: 'la Asociación Europea de Libre Comercio (AELC)' },
    { key: 'descripciones_alternas_sgp', label: 'el SGP' },
    { key: 'descripciones_alternas_ace', label: 'la ACE' }
  ];

  for (const TIPO of TIPOS) {
       const LISTA = data[TIPO.key];
    if (Array.isArray(LISTA) && LISTA.length > 0) {
      this.descripcionesPorTipo.push({
        tipo: TIPO.label,
        descripciones: LISTA.map((item: DescripcionAlternaResponse) => ({
          id: item.id_descripcion_alterna_fraccion,
          descripcion: item.descripcion
        }))
      });
    }
  }

  this.descripcionesMostrar = this.descripcionesPorTipo.length > 0;
      
  }

  /**
   * @method getFormControlName
   * @description
   * Obtiene el nombre del control del formulario según el tipo de descripción.
   * Asocia cada tipo de acuerdo comercial con su correspondiente control en el formulario.
   * @param {string} tipo - Tipo de descripción (UE, AELC, SGP, ACE).
   * @returns {string} Nombre del control del formulario correspondiente al tipo.
   */
  public getFormControlName(tipo: string): string {
  switch (tipo) {
    case 'la Unión Europea (UE)':
      return 'descripcionUE';
    case 'la Asociación Europea de Libre Comercio (AELC)':
      return 'descripcionAELC';
    case 'el SGP':
      return 'descripcionSGP';
    case 'la ACE':
      return 'descripcionACE';
    default:
      return '';
  }
}


  /**
   * **Ciclo de vida: Destruye las suscripciones y limpia recursos**
   * 
   * - `this.destroy$.next();` emite un valor para notificar a las suscripciones activas que deben finalizar.
   * - `this.destroy$.complete();` marca el `Subject` como completado, asegurando que no se emitan más valores en el futuro.
   * - Esto previene fugas de memoria al garantizar que las suscripciones dependientes de `takeUntil(this.destroy$)` se cancelen correctamente.
   */
  ngOnDestroy(): void {
    this.tramite110101Store.setValidacionFormulario('validacion_tab_datos_adicionales', this.validarFormularioAdicionales() ?? null);
    this.destroy$.next(); // Notifica a las suscripciones activas que deben finalizar
    this.destroy$.complete(); // Completa el Subject para evitar futuras emisiones
  }

}
