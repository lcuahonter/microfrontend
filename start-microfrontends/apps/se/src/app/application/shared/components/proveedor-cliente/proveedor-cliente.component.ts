import {
  AnexoDosEncabezado,
  AnexoUnoEncabezado,
  ProveedorClienteTabla,
} from '../../models/nuevo-programa-industrial.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  UppercaseDirective,
} from '@libs/shared/data-access-user/src';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplimentosService } from '../../services/complimentos.service';
import { Location } from '@angular/common';
import { PROVEEDOR_CLIENTE_TABLA_CONFIG } from '../../constantes/anexo-dos-y-tres.enum';

@Component({
  selector: 'app-proveedor-cliente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
    UppercaseDirective
  ],
  templateUrl: './proveedor-cliente.component.html',
  styleUrl: './proveedor-cliente.component.scss',
})
/**
 * Componente para gestionar los datos de proveedores y clientes.
 */
export class ProveedorClienteComponent implements OnChanges, OnInit {
  /**
   * Datos de la fracción seleccionada en la tabla.
   * @type {AnexoUnoEncabezado | AnexoDosEncabezado}
   */
  @Input() public fraccionTablaDatos!: AnexoUnoEncabezado | AnexoDosEncabezado;

  /**
   * Emisor de eventos para los datos actualizados de proveedores y clientes.
   * @type {EventEmitter<ProveedorClienteTabla[]>}
   */
  @Output() public datosActualizadosProveedorCliente = new EventEmitter<
    ProveedorClienteTabla[]
  >();

  /**
   * Formulario reactivo para gestionar los datos de proveedores y clientes.
   * @type {FormGroup}
   */
  public formularioProveedorCliente!: FormGroup;

  /**
   * Catálogo de países de destino.
   * @type {Catalogo[]}
   */
  public paisDestinoCatalog: Catalogo[] = [];

  /**
   * Datos de la tabla de proveedores y clientes.
   * @type {ProveedorClienteTabla[]}
   */
  @Input() proveedorClienteTablsDatos: ProveedorClienteTabla[] = [];

  /**
   * Lista de proveedores y clientes seleccionados.
   * @type {ProveedorClienteTabla[]}
   */
  public proveedorClienteListaSeleccionada: ProveedorClienteTabla[] = [];

  /**
   * Configuración de la selección de la tabla.
   * @type {TablaSeleccion}
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de la tabla de proveedores y clientes.
   * @type {any}
   */
  public readonly PROVEEDOR_CLIENTE_TABLA_CONFIG =
    PROVEEDOR_CLIENTE_TABLA_CONFIG;

  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
    *  * compodoc
   * @property {Subject<void>} destroyNotifier$
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public complementarState!: ComplementarState;

  /**
  * Contiene la notificación relacionada con la acción de agregar elementos.
  * 
  * Esta notificación puede mostrar mensajes de éxito, advertencia o error
  * según el resultado del proceso de agregado.
  */
  public agregarNotification!: Notificacion;

  /**
   * Notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada del tipo AnexoUnoEncabezado.
   * Se utiliza para almacenar y manipular la fila actualmente activa o seleccionada en la tabla.
   */
  public selectedRow: AnexoUnoEncabezado | AnexoDosEncabezado | null = null;

  /**
   * Fila seleccionada del tipo AnexoDosEncabezado.
   * Permite gestionar la fila activa o seleccionada dentro de la tabla correspondiente al Anexo Dos.
   */
  private selectedDosRow: AnexoDosEncabezado | null = null;

  /**
   * Constructor de la clase ProveedorClienteComponent.
   * @param {FormBuilder} fb - FormBuilder para la creación del formulario reactivo.
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador.
   */
  constructor(private fb: FormBuilder,
    private ubicaccion: Location,
    private complimentosService: ComplimentosService,
    private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery) {
    //
  }

  /**
 * Inicializa el componente, suscribe al estado de la solicitud y carga las opciones de país si es necesario.
 */
  ngOnInit(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.complementarState = seccionState as ComplementarState;
        })
      )
      .subscribe();

    this.complimentosService.anexoUnoFilaSeleccionada$.subscribe(row => {
      this.selectedRow = row;
    });
    this.complimentosService.anexoDosFilaSeleccionada$.subscribe(row => {
      this.selectedDosRow = row;
    });
    this.inicializarFormularioProveedorCliente();
    
    // Clear any previous selection state when component initializes
    this.proveedorClienteListaSeleccionada = [];
    
    if (!(this.complementarState.paisOptions.length)) {
      this.obtenerPaisOptions();
    } else {
      this.paisDestinoCatalog = [...this.complementarState.paisOptions];
    }
  }

  /** Obtiene y actualiza las opciones del catálogo de pais desde el servicio. */
  obtenerPaisOptions(): void {
    this.complimentosService.getPais()
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.complementarStore.setPaisOptions(res.datos);
        this.paisDestinoCatalog = res.datos;
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando se detectan cambios en las propiedades de entrada.
   * Actualiza el formulario con los datos de la fracción seleccionada.
   * @returns {void}
   */
  ngOnChanges(): void {
    if (this.fraccionTablaDatos && this.formularioProveedorCliente) {
      this.formularioProveedorCliente.patchValue({
        descripcionComercial:
          this.fraccionTablaDatos.encabezadoDescripcionComercial,
      });
    }
  }

  /**
   * Maneja el cambio de país de destino en el formulario.
   * @param {Catalogo} event - El catálogo seleccionado.
   * @returns {void}
   */
  cambioPaisDestino(event: Catalogo): void {
    this.formularioProveedorCliente.patchValue({
      paisDestino: event.id || event.clave,
    });
  }

  /**
   * Inicializa el formulario de proveedores y clientes.
   * @returns {void}
   */
  inicializarFormularioProveedorCliente(): void {
    const ROW = this.selectedRow || this.selectedDosRow;
    this.formularioProveedorCliente = this.fb.group({
      descripcionComercial: [{ value: ROW?.encabezadoDescripcionComercial, disabled: true }, [Validators.required, Validators.maxLength(100)]],
      paisDestino: ['', Validators.required], // Start with empty instead of store value
      rfc: ['', [Validators.required, Validators.maxLength(100)]], // Start with empty instead of store value
      razonSocialCliente: ['', [Validators.required, Validators.maxLength(180)]], // Start with empty instead of store value
    });
  }

  /**
   * Limpia los campos del formulario de proveedores y clientes.
   * @returns {void}
   */
  limpar(): void {
    const currentDescripcionComercial = this.formularioProveedorCliente.get('descripcionComercial')?.value;
    
    this.formularioProveedorCliente.reset({
      descripcionComercial: currentDescripcionComercial,
      paisDestino: '',
      rfc: '',
      razonSocialCliente: '',
    });
    this.formularioProveedorCliente.markAsUntouched();
    this.formularioProveedorCliente.markAsPristine();
    
    // Clear selection state as well
    this.proveedorClienteListaSeleccionada = [];
  }

  /**
  * Método que actualiza el store con los valores del formulario.
  * 
  * @param form - Formulario reactivo con los datos actuales.
  * @param campo - El campo que debe actualizarse en el store.
  * @param metodoNombre - El nombre del método en el store que se debe invocar.
  */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof ComplementarStore): void {
    const VALOR = form.get(campo)?.value;
    (this.complementarStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Maneja la selección de proveedores y clientes en la tabla.
   * @param {ProveedorClienteTabla[]} lista - La lista de proveedores y clientes seleccionados.
   * @returns {void}
   */
  proveedorClienteSeleccinados(lista: ProveedorClienteTabla[]): void {
    this.proveedorClienteListaSeleccionada = lista;
    
    if (lista && lista.length > 0) {
     
      this.selectedRow = lista[0] as any;
    }
  }
 
  /** Obtiene la fracción arancelaria del encabezado seleccionado.
   * @returns {string} La fracción arancelaria.
   */
  get encabezadoFraccionArancelaria(): string {
    if (!this.selectedRow) {return '';}
  
    return (this.selectedRow as any).encabezadoFraccionArancelaria || (this.selectedRow as any).encabezadoFraccionExportacion || '';
  }

  /** Obtiene el anexo II del encabezado seleccionado.
   * @returns {string} El anexo II.
   */
  get encabezadoAnexoII(): string {
    if (!this.selectedRow) {return '';}
    return (this.selectedRow as any).encabezadoAnexoII || '';
  }

  /**
   * Obtiene el tipo del encabezado seleccionado.
   * @returns {string} El tipo.
   */
  get encabezadoTipo(): string {
    if (!this.selectedRow) {return '';}
    return (this.selectedRow as any).encabezadoTipo || '';
  }
  /** Obtiene el UMT del encabezado seleccionado.
   * @returns {string} El UMT.
   */
  get encabezadoUmt(): string {
    if (!this.selectedRow) {return '';}
    return (this.selectedRow as any).encabezadoUmt || '';
  }

  /**
   * Agrega un nuevo proveedor o cliente a la tabla.
   * @returns {void}
   */
  aggregar(): void {
     if (this.formularioProveedorCliente.invalid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if( this.formularioProveedorCliente.valid ){
    const PROVEEDOR_CLIENTE: ProveedorClienteTabla = {
      fraccion: (this.proveedorClienteTablsDatos.length + 1).toString(),
      paisDestino: this.obtenerValorPaisDeDestino(
        this.formularioProveedorCliente.get('paisDestino')?.value
      ),
      rfcClinte: (this.formularioProveedorCliente.get('rfc')?.value || '').toUpperCase(),
      razonSocial:
        this.formularioProveedorCliente.get('razonSocialCliente')?.value,
    };
    this.proveedorClienteTablsDatos = [...this.proveedorClienteTablsDatos, PROVEEDOR_CLIENTE];
    this.formularioProveedorCliente.reset();
    this.formularioProveedorCliente.get('descripcionComercial')?.setValue('Test Complementar');
     this.agregarNotification = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje:
        'La operación se realizó exitosamente.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
  }
  }
  /**
   * Obtiene la descripción del país de destino a partir de su ID.
   * @param {number} id - El ID del país de destino.
   * @returns {string} La descripción del país de destino.
   */
  obtenerValorPaisDeDestino(id: string): string {
    const PAIS = this.paisDestinoCatalog.find(
      (ele) => ele.clave === id
    );
    return PAIS ? PAIS.descripcion : '';
  }

  /**
   * Obtiene el ID del país de destino a partir de su descripción.
   * @param {string} valor - La descripción del país de destino.
   * @returns {number} El ID del país de destino.
   */
  obtenerValorPaisDeDestinoId(valor: string): number {
    const PAIS = this.paisDestinoCatalog.find(
      (ele) => ele.descripcion === valor
    );
    return PAIS ? PAIS.id : 0;
  }

  /**
   * Obtiene la clave del país de destino a partir de su descripción.
   * @param {string} valor - La descripción del país de destino.
   * @returns {string} La clave del país de destino.
   */
  obtenerClavePaisDeDestino(valor: string): string {
    const PAIS = this.paisDestinoCatalog.find(
      (ele) => ele.descripcion === valor
    );
    return PAIS ? (PAIS.clave || PAIS.id?.toString() || '') : '';
  }

  /**
   * Elimina los proveedores o clientes seleccionados de la tabla.
   * @returns {void}
   */
  elimiar(): void {
    if (this.proveedorClienteListaSeleccionada.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir al menos un firmante para eliminar.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    
    if (this.proveedorClienteListaSeleccionada.length > 0) {
      this.proveedorClienteTablsDatos = this.proveedorClienteTablsDatos.filter(
        (ele) => !this.proveedorClienteListaSeleccionada.includes(ele)
      );
    }
  }

  /**
   * Edita los datos del proveedor o cliente seleccionado en el formulario.
   * @returns {void}
   */
  eidtar(): void {
    if (!this.proveedorClienteListaSeleccionada || this.proveedorClienteListaSeleccionada.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un registro de proveedor cliente para actualizar',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.proveedorClienteListaSeleccionada.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir solo un registro para editar.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (
      this.proveedorClienteListaSeleccionada &&
      this.proveedorClienteListaSeleccionada.length > 0 &&
      this.formularioProveedorCliente
    ) {
      this.formularioProveedorCliente.patchValue({
        paisDestino: this.obtenerClavePaisDeDestino(
          this.proveedorClienteListaSeleccionada[0].paisDestino
        ),
        rfc: this.proveedorClienteListaSeleccionada[0].rfcClinte,
        razonSocialCliente:
          this.proveedorClienteListaSeleccionada[0].razonSocial,
      });
    }
  }

  /**
   * Regresa a la vista anterior y emite los datos actualizados de proveedores y clientes.
   * @returns {void}
   */
  regrsarAnnexoI(): void {
    this.limpar();
    this.cerrarPopup.emit();
    this.datosActualizadosProveedorCliente.emit(
      this.proveedorClienteTablsDatos
    );
  }
}
