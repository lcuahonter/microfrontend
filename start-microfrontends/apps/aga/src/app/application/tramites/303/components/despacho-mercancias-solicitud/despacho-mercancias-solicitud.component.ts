import { Catalogo, Notificacion, TEXTOS_303, TablaSeleccion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { CONTROL_INVENTARIOS } from '../../../../core/enums/303/figuras.enum';
import { ControlInventario } from '../../../../core/models/303/control-inventario.model';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { TransportistaService } from '../../../../core/services/303/transportista.service';

@Component({
  selector: 'despacho-mercancias-solicitud',
  templateUrl: './despacho-mercancias-solicitud.component.html',
  styleUrls: ['./despacho-mercancias-solicitud.component.scss']
})
export class DespachoMercanciasSolicitudComponent implements OnInit, OnDestroy {
  /** Formulario para la solicitud de despacho de mercancías */
  formDespacho!: FormGroup;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Indica si se debe mostrar el select de IMMEX */
  mostrarSelectImmex = true;
  /** Indica si se deben mostrar los checkboxes de IMMEX */
  mostrarCheckboxesImmex = false;
  /** Catálogo de números IMMEX */
  catNumeroIMMEX: Catalogo[] = [];
  /** Variable para almacenar el valor del campo */
  valor!: string;
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado del trámite 303 consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Configuración de la tabla de selección */
  tablaSeleccion = TablaSeleccion;
  /** Encabezado de la tabla de figuras */
  encabezadoDeTablaInventarios = CONTROL_INVENTARIOS;
  /** Lista de control de inventarios */
  listaControlInventarios: ControlInventario[] = [];
  /** Lista de control de inventarios seleccionados */
  listaControlInventariosSeleccionados: ControlInventario[] = [];
  /** Indica si se debe mostrar el control de inventarios */
  mostrarControlInventarios = false;
  /** Formulario para el control de inventarios */
  formInventario!: FormGroup;
  /** Subject para destruir las suscripciones. */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /** Inventario en edición */
  inventarioEnEdicion?: ControlInventario;
  /** Texto de la sección */
  TEXTOS = TEXTOS_303;

  /**
   * Constructor del componente.
   * @param fb FormBuilder
   * @param tramite303State Estado del trámite 303.
   * @param transportistaService Servicio de transportista.
   * @param tramite303Query Consulta del trámite 303.
   */
  constructor(
    private fb: FormBuilder,
    private tramite303State: Tramite303StoreService,
    private transportistaService: TransportistaService,
    private tramite303Query: Tramite303Query
  ) {
    this.createFormulario();
  }

  /**
   * Valida el formulario de despacho y el formulario de inventario.
   * @returns boolean
   */
  validarFormulario(): boolean {
    this.formDespacho.markAllAsTouched();
    if (this.formDespacho.valid && this.formInventario.valid) {
      return true;
    }
    return false;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el catálogo de números IMMEX y asigna el valor a la variable `catNumeroIMMEX`.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteConsultado = seccionState;
          this.mostrarCheckboxesImmex = seccionState?.mostrarCheckboxesImmex || false;
          this.mostrarSelectImmex = seccionState?.mostrarSelectImmex ?? true;
          this.listaControlInventarios = seccionState?.listaInventarios || [];
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.formInventario = this.fb.group({
      nombreSistema: ['', Validators.required],
      lugarRadicacion: ['', Validators.required],
      esSistemaControl: [false]
    });
    this.createFormulario();
    this.ObtenerDatosCatalogoImmex();
  }

  /**
   * Obtiene los datos del catálogo IMMEX.
   */
  ObtenerDatosCatalogoImmex(): void {
    this.transportistaService.obtenerDatosImmex()
      .pipe(
        map((data) => {
          if (data) {
            this.catNumeroIMMEX = data;
          }
        }),
        catchError((_error) => {
          console.error('Error al consultar catálogo IMMEX', _error);
          return of([]);
        }),
        takeUntil(this.destruirSuscripcion$)
      )
      .subscribe();
  }

  /**
   * Crea el formulario para la solicitud de despacho de mercancías.
   */
  createFormulario(): void {
    this.formDespacho = this.fb.group({
      cumplimiento: [this.tramiteConsultado?.cumplimiento, Validators.required],
      autorizar: [this.tramiteConsultado?.autorizar, Validators.required],
      listado: [this.tramiteConsultado?.listado, Validators.required],
      certificados: [this.tramiteConsultado?.certificados, Validators.required],
      art17: [this.tramiteConsultado?.art17, Validators.required],
      buzon: [this.tramiteConsultado?.buzon, Validators.required],
      cuentaImmex: [this.tramiteConsultado?.cuentaImmex, Validators.required],
      checkboxImportacion1: [this.tramiteConsultado?.checkboxImportacion1 || false],
      checkboxImportacion2: [this.tramiteConsultado?.checkboxImportacion2 || false],
      immex: [this.tramiteConsultado?.immex, Validators.required],
      padron: [this.tramiteConsultado?.padron, Validators.required],
      controlInventarios: [this.tramiteConsultado?.controlInventarios, Validators.required],
      contabilidad: [this.tramiteConsultado?.contabilidad, Validators.required],
      interposicion: [this.tramiteConsultado?.interposicion, Validators.required],
      checkboxManifiesto1: [this.tramiteConsultado?.checkboxManifiesto1 || false],
      checkboxManifiesto2: [this.tramiteConsultado?.checkboxManifiesto2 || false],
      ingresoInforme: [this.tramiteConsultado?.ingresoInforme || false],
    });
    this.monitorValores();
  }


  /**
   * Monitorea los cambios en los valores de los controles del formulario.
   * Si se detecta un cambio en ciertos controles, se invoca la función `notificaciones`.
   */
  monitorValores(): void {
    Object.keys(this.formDespacho.controls).forEach(controlName => {
      this.formDespacho.get(controlName)?.valueChanges.subscribe(value => {
        if ((controlName === 'cumplimiento' || controlName === 'autorizar' || controlName === 'certificados' || controlName === 'buzon' || controlName === 'padron' || controlName === 'controlInventarios') && value === 'aa') {
          this.notificaciones();
        } else if ((controlName === 'listado' || controlName === 'art17' || controlName === 'interposicion') && value === 'a') {
          this.notificaciones();
        } else if (controlName === 'cuentaImmex') {
          if (value === 'a') {
            this.mostrarSelectImmex = true;
            this.mostrarCheckboxesImmex = false;
            this.tramite303State.setSelectImmex(true);
            this.tramite303State.setCheckboxesImmex(false);
          } else if (value === 'aa') {
            this.mostrarSelectImmex = false;
            this.mostrarCheckboxesImmex = true;
            this.tramite303State.setSelectImmex(false);
            this.tramite303State.setCheckboxesImmex(true);
          }
        }
        else if (controlName === 'controlInventarios' && value === 'a') {
          this.mostrarControlInventarios = true;
        }
        else if (controlName === 'controlInventarios' && value === 'aa') {
          this.mostrarControlInventarios = false;
        }
      });
    });
  }

  /**
   * Muestra una notificación al usuario con información relevante.
   * Esta función se invoca cuando se cumplen ciertas condiciones en los controles del formulario.
   */
  notificaciones(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'info',
      modo: 'action',
      titulo: '',
      mensaje: 'Es un requisito necesario para acceder al Registro de Despacho de Mercancías de las empresas, de conformidad con la regla 7.5.1. de las.G.C.E.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método para establecer los valores en el store del trámite 303.
   * @param form Formulario del componente.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método en el store para actualizar el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite303StoreService): void {
    const VALOR = form.get(campo)?.value;
    const ISCHECKBOX = campo === 'checkboxImportacion1' || campo === 'checkboxImportacion2';
    if (ISCHECKBOX) {
      (this.tramite303State[metodoNombre] as (value: boolean) => void)(Boolean(VALOR));
    } else {
      (this.tramite303State[metodoNombre] as (value: string) => void)(VALOR);
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para agregar un nuevo inventario.
   * @returns void
   */
  agregarInventario(): void {
    if (this.formInventario.invalid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'No hay información para guardar',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.inventarioEnEdicion) {
      const INVENTARIO_ACTUALIZADO: ControlInventario = {
        ...this.inventarioEnEdicion,
        nombreSistema: this.formInventario.get('nombreSistema')?.value,
        lugarRadicacion: this.formInventario.get('lugarRadicacion')?.value,
        esSistemaControl: (this.formInventario.get('esSistemaControl')?.value) as boolean
      };

      this.listaControlInventarios = this.listaControlInventarios.map(inv =>
        inv.id === this.inventarioEnEdicion?.id ? INVENTARIO_ACTUALIZADO : inv
      );

      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: 'Inventario modificado correctamente',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

      this.inventarioEnEdicion = undefined;
    } else {
      const NUEVOINVENTARIO: ControlInventario = {
        id: this.formInventario.get('nombreSistema')?.value + '-' + new Date().getTime(),
        nombreSistema: this.formInventario.get('nombreSistema')?.value,
        lugarRadicacion: this.formInventario.get('lugarRadicacion')?.value,
        esSistemaControl: (this.formInventario.get('esSistemaControl')?.value) as boolean
      };

      this.listaControlInventarios = [...this.listaControlInventarios, NUEVOINVENTARIO];

      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos guardados correctamente',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }

    this.tramite303State.setListaInventarios(this.listaControlInventarios);
    this.formInventario.reset({
      nombreSistema: '',
      lugarRadicacion: '',
      esSistemaControl: false
    });
  }

  /**
   * Método para modificar un inventario existente.
   * @returns void
   */
  modificarInventario(): void {
    if (!this.listaControlInventariosSeleccionados || this.listaControlInventariosSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'No hay inventarios seleccionados para modificar',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.listaControlInventariosSeleccionados.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Solo se puede modificar un inventario a la vez',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const INVENTARIO_SELECCIONADO = this.listaControlInventariosSeleccionados[0];
    this.inventarioEnEdicion = INVENTARIO_SELECCIONADO;

    this.formInventario.patchValue({
      nombreSistema: INVENTARIO_SELECCIONADO.nombreSistema,
      lugarRadicacion: INVENTARIO_SELECCIONADO.lugarRadicacion,
      esSistemaControl: INVENTARIO_SELECCIONADO.esSistemaControl
    });

    this.listaControlInventariosSeleccionados = [];
  }

  /**
   * Método para eliminar un inventario existente.
   * @returns void
   */
  eliminarInventario(): void {
    if (this.listaControlInventariosSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'No hay inventarios seleccionados para eliminar',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;

    }
    const IDS_INVENTARIOS = this.listaControlInventariosSeleccionados.map(item => item.id);
    this.listaControlInventarios = this.listaControlInventarios.filter(INVENTARIO => !IDS_INVENTARIOS.includes(INVENTARIO.id));
    this.listaControlInventariosSeleccionados = [];
    this.tramite303State.setListaInventarios(this.listaControlInventarios);
  }
}
