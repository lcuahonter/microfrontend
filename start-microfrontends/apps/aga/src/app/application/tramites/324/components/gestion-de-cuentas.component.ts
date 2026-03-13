import { ADUANA_CATALOGO, HEADERS_ACCESOS_TABLA, MOVIMIENTO_CATALOGO, ROL_CATALOGO, SISTEMA_CATALOGO } from '../constantes/tecnologicos.enum';
import { Catalogo, CatalogosSelect, ConfiguracionColumna, ConsultaioQuery, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud324State, Tramite324Store } from '../state/Tramite324.store';
import { AccesosTabla } from '../models/tecnologicos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CategoriaMensaje } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { TecnologicosService } from '../service/tecnologicos.service';
import {TipoNotificacionEnum} from '@ng-mf/data-access-user';
import { Tramite324Query } from '../state/Tramite324.query';


/**
 * Componente para gestionar la configuración de accesos en el trámite 324.
 * Incluye la configuración de catálogos, formularios y tablas dinámicas.
 */
@Component({
  selector: 'app-gestion-de-cuentas',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent, CatalogoSelectComponent, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './gestion-de-cuentas.component.html',
  styleUrl: './gestion-de-cuentas.component.scss',
})
export class GestionDeCuentasComponent implements OnInit, OnDestroy {
  // Notificación utilizada para mostrar mensajes o alertas en la interfaz.
  public nuevaNotificacion!: Notificacion;
  // Notificación para confirmación de eliminación
  public nuevaNotificacionEliminar!: Notificacion;
  /**
   * ReplaySubject utilizado para gestionar la destrucción de observables.
   * Se emite un valor cuando el componente se destruye para cancelar las suscripciones activas.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Referencia al elemento modal para gestionar accesos.
   */
  @ViewChild('modalAccesos') modalElementAccesos!: ElementRef;

  /**
   * Configuración de columnas para la tabla de accesos.
   */
  public headers: ConfiguracionColumna<AccesosTabla>[] = HEADERS_ACCESOS_TABLA;

  /**
   * Catálogo de opciones para "Tipo Movimiento".
   */
  public movimientoCatalogo: CatalogosSelect = MOVIMIENTO_CATALOGO;

  /**
   * Catálogo de opciones para "Sistema".
   */
  public sistemaCatalogo: CatalogosSelect = SISTEMA_CATALOGO;

  /**
   * Catálogo de opciones para "Aduana".
   */
  public aduanaCatalogo: CatalogosSelect = ADUANA_CATALOGO;

  /**
   * Catálogo de opciones para "Rol".
   */
  public rolCatalogo: CatalogosSelect = ROL_CATALOGO;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud324State;

  /**
   * Datos de la tabla de accesos.
   */
  public accesosTablaDatos: AccesosTabla[] = [];

  /**
   * Enumeración para la selección de tablas dinámicas.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Formulario reactivo para gestionar accesos.
   */
  accesosForm!: FormGroup;

   /**
   *  Arreglo que contiene los pedimentos registrados.
   * */
  public pedimentos: Array<Pedimento> = [];

  private modalInstanceAccesos!: Modal;

  /**
   *  Índice del pedimento marcado para eliminación.
   * */
  public elementoParaEliminar!: number;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  accesosTablaDatosSeleccionados: AccesosTabla[] = [];


  
  /**
   * Constructor del componente.
   * @param tecnologicos Servicio para obtener datos tecnológicos.
   * @param store Almacén para gestionar el estado del trámite.
   * @param query Consulta para obtener el estado del trámite.
   * @param fb Constructor de formularios reactivos.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    private tecnologicos: TecnologicosService,
    private store: Tramite324Store,
    private query: Tramite324Query,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) { 
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.accesosForm = this.fb.group({
      rfc: ['', Validators.required],
      aduana: ['', Validators.required],
      sistema: ['', Validators.required],
      rol: ['', Validators.required],
      tipoMovimiento: ['', Validators.required],
    });

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.accesosTablaDatos = [...seccionState.AccesosDatos];
        })
      )
      .subscribe();

    this.donanteDomicilio();
    this.obtenerDatosAduana();
    this.obtenerDatosRol();
    this.obtenerDatosSistema();
    this.obtenerDatosTipoMovimiento();
  }

  /**
   * Obtiene los datos del catálogo de "Aduana".
   */
  obtenerDatosAduana(): void {
    this.tecnologicos
      .obtenerDatosAduana()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.aduanaCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Obtiene los datos del catálogo de "Rol".
   */
  obtenerDatosRol(): void {
    this.tecnologicos
      .obtenerDatosRol()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.rolCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Obtiene los datos del catálogo de "Sistema".
   */
  obtenerDatosSistema(): void {
    this.tecnologicos
      .obtenerDatosSistema()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.sistemaCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Obtiene los datos del catálogo de "Tipo Movimiento".
   */
  obtenerDatosTipoMovimiento(): void {
    this.tecnologicos
      .obtenerDatosTipoMovimiento()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.movimientoCatalogo.catalogos = resp as Catalogo[];
      });
  }

 

  /**
   * Abre el modal para gestionar accesos.
   */
  abrirAccesos(): void {
    if (this.modalElementAccesos) {
      // Create the modal only once
      if (!this.modalInstanceAccesos) {
        this.modalInstanceAccesos = new Modal(this.modalElementAccesos.nativeElement, {
          backdrop: 'static',
          keyboard: false
        });
      }
      this.modalInstanceAccesos.show();
    }
  }
  
  obtenerRegistroSeleccionado(event: AccesosTabla[]): void {
    // Actualizar la colección de registros seleccionados
    this.accesosTablaDatosSeleccionados = event;
  }

  /**
   * Agrega un nuevo acceso a la tabla si el formulario es válido.
   */
  agregarAccesos(): void {
    if(this.accesosForm.invalid){
      this.accesosForm.markAllAsTouched();
     return;
    }
    if (this.accesosForm.valid) {
      const FORM_VALUE = this.accesosForm.value;
      const GET_DESCRIPCION = (catalogo: CatalogosSelect, value: number | string): string => {
        const NUM_VALUE = typeof value === 'string' ? Number(value) : value;
        const ITEM = catalogo.catalogos?.find((c: Catalogo) => c.id === NUM_VALUE);
        return ITEM ? ITEM.descripcion : String(value);
      };

      const NUEVO_ACCESO = {
        ...FORM_VALUE,
        aduana: GET_DESCRIPCION(this.aduanaCatalogo, FORM_VALUE.aduana),
        sistema: GET_DESCRIPCION(this.sistemaCatalogo, FORM_VALUE.sistema),
        rol: GET_DESCRIPCION(this.rolCatalogo, FORM_VALUE.rol),
        tipoMovimiento: GET_DESCRIPCION(this.movimientoCatalogo, FORM_VALUE.tipoMovimiento),
      };

      this.store.addAccesosDatos(NUEVO_ACCESO);
      this.accesosForm.reset();
      this.cerrarModal();
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.EXITO,
        modo: 'action',
        titulo: '',
        mensaje: 'El acceso se agregó correctamente.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
  /**
 * Cierra el modal de accesos.
 */
  cerrarModal(): void {
    if (this.modalInstanceAccesos) {
      this.modalInstanceAccesos.hide();
    }
  }
 
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }
  // Abre el modal y configura la notificación para eliminar un pedimento.
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: 'El acceso se agrego correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /**
   * Valida todos los campos del formulario.
   */
  validarDestinatarioFormulario(): void {
    if (this.accesosForm.invalid) {
      this.accesosForm.markAllAsTouched();
    }
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param form Formulario reactivo.
   * @param field Nombre del campo a verificar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
 * Elimina las filas seleccionadas de la tabla de accesos
 * Verifica que haya al menos una fila seleccionada antes de eliminar
 */
eliminarAccesos(): void {
  if (!this.accesosTablaDatos || this.accesosTablaDatos.length === 0) {
     this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: 'Sin información.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    return;
  }
  if (!this.accesosTablaDatosSeleccionados || this.accesosTablaDatosSeleccionados.length === 0) {
   
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: 'Selecciona un registro.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    return;
  }
  
  // Mostrar confirmación antes de eliminar
  this.nuevaNotificacionEliminar = {
    tipoNotificacion: TipoNotificacionEnum.ALERTA,
    categoria: CategoriaMensaje.ALERTA,
    modo: 'action',
    titulo: '',
    mensaje: '¿Desea eliminar el acceso seleccionado?.',
    cerrar: true,
    tiempoDeEspera: 2000,
    txtBtnCancelar: 'Cancelar',
    txtBtnAceptar: 'Aceptar',
  };
}

/**
 * Confirma y ejecuta la eliminación de registros seleccionados
 */
confirmarEliminacion(confirmar: boolean): void {
  if (!confirmar) {
    return;
  }
  
  const DATOS_ACTUALIZADOS = this.accesosTablaDatos.filter(
    item => !this.accesosTablaDatosSeleccionados.includes(item)
  );
 
  this.accesosTablaDatos = DATOS_ACTUALIZADOS;
 
  this.accesosTablaDatosSeleccionados = [];
  
  this.nuevaNotificacion = {
    tipoNotificacion: TipoNotificacionEnum.ALERTA,
    categoria: CategoriaMensaje.EXITO,
    modo: 'action',
    titulo: '',
    mensaje: 'El acceso se eliminó correctamente.',
    cerrar: true,
    tiempoDeEspera: 3000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
}

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método del almacén para actualizar el estado.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite324Store): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Configura el formulario con los valores iniciales del estado.
   */
  donanteDomicilio(): void {
    this.accesosForm = this.fb.group({
      rfc: [this.solicitudState?.rfc, [Validators.required,Validators.maxLength(15)]],
      aduana: [this.solicitudState?.aduana, [Validators.required]],
      sistema: [this.solicitudState?.sistema, [Validators.required]],
      rol: [this.solicitudState?.rol, [Validators.required]],
      tipoMovimiento: [this.solicitudState?.tipoMovimiento, [Validators.required]],
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Cancela las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();

    if (this.modalInstanceAccesos) {
      this.modalInstanceAccesos.dispose();
    }
  }
}
