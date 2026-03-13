/**
 * @fileoverview
 * Componente para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Permite buscar, agregar, modificar y eliminar terceros relacionados, así como mostrar tablas dinámicas de exportadores y destinos.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module TercerosrelacionadosComponent
 */

import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent, CatalogoSelectComponent, ConfiguracionColumna, ConsultaioQuery, InputRadioComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatosDeLaSolicitud, TercerosrelacionadosdestinoTable } from '../../models/tercerosrelacionados.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OPCION_DE_BOTON_DE_RADIO, SELECCIONADO } from '../../constantes/tercerosrelacionados.enum';
import { AgregardestinatariofinalComponent } from '../../../tramites/220201/components/agregardestinatariofinal/agregardestinatariofinal.component';
import { CommonModule } from '@angular/common';
import { DestinatarioForm } from '../../../tramites/220203/models/220203/importacion-de-acuicultura.module';
import { ModalComponent } from '../modal/modal.component';
import { RadioOpcion } from '../../../tramites/220201/models/220201/certificado-zoosanitario.model';
import { SharedFormService } from '../../../tramites/220201/services/220201/SharedForm.service';

import { Subject, takeUntil } from 'rxjs';
import { ZoosanitarioStore } from '../../../tramites/220201/estados/220201/zoosanitario.store';


/**
 * Componente para la gestión de terceros relacionados.
 * Permite buscar, agregar, modificar y eliminar terceros relacionados, así como mostrar tablas dinámicas de exportadores y destinos.
 *
 * @class TercerosrelacionadosComponent
 */
@Component({
  selector: 'app-tercerosrelacionados',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
  ],
  templateUrl: './tercerosrelacionados.component.html',
})
export class TercerosrelacionadosComponent implements OnInit {
  /**
   * Clase CSS para el tipo de alerta informativa.
   * @type {string}
   */
  infoAlert: string = "alert-info";

  /**
   * Valor de selección por defecto.
   * @type {string}
   */
  seleccionado: string = SELECCIONADO;

  /**
   * Indica si se muestra la vista de búsqueda avanzada.
   * @type {boolean}
   */
  mostrarVista: boolean = false;

  /**
   * Opciones para el botón de radio de tipo persona.
   * @type {RadioOpcion[]}
   */
  opcionDeBotonDeRadio: RadioOpcion[] = OPCION_DE_BOTON_DE_RADIO;

  /**
   * Referencia al siguiente campo de entrada para enfoque automático.
   * @type {ElementRef<HTMLInputElement>}
   */
  @ViewChild('nextField') nextField!: ElementRef<HTMLInputElement>;

  /**
   * Catálogos de datos de la solicitud, como países y estados.
   * @type {DatosDeLaSolicitud}
   */
  @Input() catalogosDatos: DatosDeLaSolicitud = {} as DatosDeLaSolicitud;
  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Indica si se deben eliminar los datos de la tabla.
   * @type {boolean}
   */
  public eliminarDatosTabla: boolean = false;
  /**
   * Indica si se deben eliminar los datos de exportador.
   * @type {boolean}
   */
  public eliminarDatoExportador: boolean = false;

  /**
   * Indica si se debe mostrar el mensaje de error.
   * @type {boolean}
   */
  public mostrarMensajeError: boolean = false;
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos.
   * @type {boolean}
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Cuerpo de la tabla de destinatarios.
   * @type {TercerosrelacionadosdestinoTable[]}
   */
  @Input() cuerpoTablaDestino: TercerosrelacionadosdestinoTable[] = [];
  /**
 * Cuerpo de la tabla de exportadores.
 * @type {TercerosrelacionadosTable[]}
 */
  @Input() cuerpoTablaExportador: DestinatarioForm[] = [];
  /**
   * Referencia al modal utilizado en el componente.
   * Permite abrir y cerrar el modal según sea necesario.
   * @type {ModalComponent}
   */
  @ViewChild('modalRef', { static: false }) modalRef!: ModalComponent;

  /**
   * Indica si el campo de exportador es obligatorio.
   * Cuando es verdadero, se requiere al menos un exportador en la tabla para validar el formulario.
   * @type {boolean}
   * @default false
   */
  @Input() exportadorRequired: boolean = false;

  /**
   * Indica si el campo de destinatario es obligatorio.
   * Cuando es verdadero, se requiere al menos un destinatario en la tabla para validar el formulario.
   * @type {boolean}
   * @default false
   */
  @Input() destinatarioRequired: boolean = false;


  /**
   * Evento emitido al eliminar una selección de destinatarios.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable[]>}
   */
  @Output() eliminarSeleccion: EventEmitter<TercerosrelacionadosdestinoTable[]> = new EventEmitter();
  /**
 * Evento emitido al eliminar una selección de destinatarios.
 * @type {EventEmitter<TercerosrelacionadosdestinoTable[]>}
 */
  @Output() eliminarSeleccionEstinoTable: EventEmitter<DestinatarioForm[]> = new EventEmitter();

  /**
   * Tipo de selección para la tabla de destinatarios.
   * Utiliza la enumeración TablaSeleccion para definir el tipo de selección.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoli: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Lista de filas seleccionadas de destinatarios.
   * @type {TercerosrelacionadosdestinoTable[]}
   */
  listaDeFilaSeleccionada: TercerosrelacionadosdestinoTable[] = [];
  /**
   * Lista de filas seleccionadas de destinatarios finales.
   * @type {TercerosrelacionadosdestinoTable[]}
   */
  listaDeFilaSeleccionadaFinal: DestinatarioForm[] = [];

  /**
   * Configuración de las columnas para la tabla de exportadores.
   * @type {ConfiguracionColumna<TercerosrelacionadosTable>[]}
   */
  configuracionColumnasExportador: ConfiguracionColumna<DestinatarioForm>[] = [
    {
      encabezado: 'Nombre/denominació o razón social', clave: (fila) => fila ? fila.razonSocial?.trim()
        || [fila.nombre, fila.primerApellido, fila.segundoApellido]
          .filter(v => v?.trim())
          .join(' ')
        : '', orden: 1
    },
    {
      encabezado: 'Teléfono', clave: (fila) => fila
        ? [fila.lada, fila.telefono]
          .map(v => v?.toString().trim())
          .filter(Boolean)
          .join('-')
        : '', orden: 2
    },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correo, orden: 3 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilio, orden: 4 },
    { encabezado: 'País', clave: (fila) => fila.paisDescripcion, orden: 5 },
  ];
  /**
   * Evento emitido para abrir el modal de destinatario.
   */
  @Output() abrirModalDestinatario: EventEmitter<TercerosrelacionadosdestinoTable> = new EventEmitter<TercerosrelacionadosdestinoTable>();
  /**
   * Evento emitido para abrir el modal de exportador.
   */
  @Output() abrirModalExportador: EventEmitter<DestinatarioForm> = new EventEmitter<DestinatarioForm>();

  /**
   * Configuración de las columnas para la tabla de destinatarios.
   * @type {ConfiguracionColumna<TercerosrelacionadosdestinoTable>[]}
   */
  configuracionColumnasDestino: ConfiguracionColumna<TercerosrelacionadosdestinoTable>[] = [
    {
      encabezado: 'Nombre/denominació o razón social', clave: (fila) => fila ? fila.razonSocial?.trim()
        || [fila.nombre, fila.primerApellido, fila.segundoApellido]
          .filter(v => v?.trim())
          .join(' ')
        : '', orden: 1
    },
    {
      encabezado: 'Teléfono', clave: (fila) => fila
        ? [fila.lada, fila.telefono]
          .map(v => v?.toString().trim())
          .filter(Boolean)
          .join('-')
        : '', orden: 2
    },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correo, orden: 3 },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 4 },
    { encabezado: 'Número exterior', clave: (fila) => fila.numeroExterior, orden: 5 },
    { encabezado: 'Número interior', clave: (fila) => fila.numeroInterior, orden: 6 },
    { encabezado: 'País', clave: (fila) => fila.paisDescripcion, orden: 7 },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaDescripcion, orden: 8 },
    { encabezado: 'Municipio/Alcaldía', clave: (fila) => fila.municipioDescripcion, orden: 9 },
    { encabezado: 'Entidad Federativa', clave: (fila) => fila.estadoDescripcion, orden: 10 },
    { encabezado: 'Código Postal', clave: (fila) => fila.codigoPostal, orden: 11 },
  ];

  /**
   * Formulario reactivo para búsqueda de destinatarios.
   * @type {FormGroup}
   */
  buscarForm!: FormGroup;

  tableErrorMeassageDispalyExportador: boolean = false;
  tableErrorMeassageDispalyDestinatario: boolean = false;
  private destroyNotifier$ = new Subject<void>();

  /**
   * Indica si hay una fila seleccionada en la tabla de exportadores.
   * Se utiliza para habilitar o deshabilitar acciones como modificar o eliminar.
   * @type {boolean}
   * @default false
   */
  filaSeleccionadaExportador: boolean = false;

  /**
   * Indica si hay una fila seleccionada en la tabla de destinatarios.
   * Se utiliza para habilitar o deshabilitar acciones como modificar o eliminar.
   * @type {boolean}
   * @default false
   */
  filaSeleccionadaDestinatario: boolean = false;

  /**
   * Referencia al componente hijo de terceros relacionados.
   * Permite acceder a los métodos y propiedades del componente hijo desde el componente padre.
   * @type {AgregardestinatariofinalComponent}
   */
  @ViewChild('tercerosRelacionadosReff') tercerosRelacionados!: AgregardestinatariofinalComponent;

  @ViewChild(AgregardestinatariofinalComponent, { static: false })
modalExportador!: AgregardestinatariofinalComponent;

  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento de Angular.
   * @param route Información de la ruta activa.
   * @param fb FormBuilder para crear el formulario reactivo.
   */
  constructor(
    public readonly router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private sharedService: SharedFormService,
    public certificadoZoosanitarioStore: ZoosanitarioStore,
    private consultaQuery: ConsultaioQuery,
  ) {
    this.buscarForm = this.fb.group({
      tipoPersona: [''],
      razonSocial: [''],
      correoElectronico: [''],
      pais: [''],
      paisDescripcion: [''],
      entidadFederativa: ['']
    });
  }

  ngOnInit(): void {
    this.cuerpoTablaDestino = [];
    this.cuerpoTablaExportador = [];
    this.cargarDatosPrellenado();
  }

  cargarDatosPrellenado(): void {
    this.sharedService.dataTerceros$.pipe(takeUntil(this.destroyNotifier$)).subscribe({
      next: (data) => {
        if (data) {
          this.cuerpoTablaDestino = [];
          this.cuerpoTablaExportador = [];
          data.terceros_destinatario.forEach(destinatario => {
            const MAPPED_DESTINO: TercerosrelacionadosdestinoTable = {
              codigoPostal: destinatario.codigo_postal,
              estado: destinatario.cve_entidad,
              calle: destinatario.calle,
              numeroExterior: destinatario.num_exterior,
              tipoMercancia: destinatario.num_interior,
              nombre: destinatario.nombre + ' ' + destinatario.razon_social,
              primerApellido: destinatario.apellido_materno,
              razonSocial: destinatario.razon_social + ' ' + destinatario.nombre,
              pais: destinatario.pais,
              telefono: destinatario.telefonos,
              correo: destinatario.correo,
              colonia: destinatario.cve_colonia,
              municipio: destinatario.cve_deleg_mun,
              numeroInterior: destinatario.num_interior,
            };
            this.cuerpoTablaDestino = [...this.cuerpoTablaDestino, MAPPED_DESTINO];
            this.certificadoZoosanitarioStore.updateTercerosRelacionados(this.cuerpoTablaDestino);
          });

          data.terceros_exportador.forEach(tercero => {
            const MAPPED_EXPORTADOR: DestinatarioForm = {
              nombre: tercero.nombre,
              razonSocial: tercero.razon_social + ' ' + tercero.nombre,
              pais: tercero.pais,
              telefono: tercero.telefonos,
              correo: tercero.correo,
              tipoMercancia: tercero.tipo_persona_sol === 'yes' || tercero.tipo_persona_sol === 'no' ? tercero.tipo_persona_sol : 'no',
              primerApellido: tercero.apellido_paterno || '',
              segundoApellido: tercero.apellido_materno || '',
              domicilio: tercero.descripcion_ubicacion || '',
              lada: tercero.lada || '',
            };
            this.cuerpoTablaExportador = [...this.cuerpoTablaExportador, MAPPED_EXPORTADOR];
            this.certificadoZoosanitarioStore.updatedatosForma(this.cuerpoTablaExportador);
          });
        } else {
          this.cuerpoTablaDestino = [];
          this.cuerpoTablaExportador = [];
        }
      }
    });
  }

  /**
   * Navega a la pantalla para agregar un nuevo destinatario.
   * @method goToAgregarDestinatario
   */
  goToAgregarDestinatario(): void {
    this.abrirModalDestinatario.emit();
  }
  goToAgregarExportador(): void {
    this.abrirModalExportador.emit();
  }
  /**
   * Navega a la pantalla para modificar un destinatario existente.
   * @method modificarDestinatario
   */
  modificarDestinatario(): void {
    if (this.listaDeFilaSeleccionada.length !== 0) {
      if (this.listaDeFilaSeleccionada[0]) {
        this.abrirModalDestinatario.emit(this.listaDeFilaSeleccionada[0]);
      }
      else {
        this.abrirModalDestinatario.emit();
      }
    }
    else {
      this.errorMessageExportador();
    }
  }
  /**
 * Navega a la pantalla para modificar un destinatario existente.
 * @method modificarDestinatario
 */
  modificarDestinatarioFinal(): void {
    if (this.listaDeFilaSeleccionadaFinal.length !== 0) {
      if (this.listaDeFilaSeleccionadaFinal[0]) {
        this.abrirModalExportador.emit(this.listaDeFilaSeleccionadaFinal[0]);
      }
      else {
        this.abrirModalExportador.emit();
      }
    }
    else {
      this.errorMessageExportador();
    }
  }


  /**
   * Actualiza la lista de filas seleccionadas de destinatarios.
   * @param filas Filas seleccionadas.
   * @method onSeleccionDestinatario
   */
  onSeleccionDestinatario(filas: TercerosrelacionadosdestinoTable[]): void {
    this.listaDeFilaSeleccionada = filas;
    this.filaSeleccionadaDestinatario = filas.length > 0 ? true : false;
  }

  /**
   * Actualiza la lista de filas seleccionadas de destinatarios.
   * @param filas Filas seleccionadas.
   * @method onSeleccionDestinatario
   */
  onSeleccionDestinatarioFinal(filas: DestinatarioForm[]): void {
    this.listaDeFilaSeleccionadaFinal = filas;
    this.filaSeleccionadaExportador = filas.length > 0 ? true : false;
  }
  /**
   * Emite el evento para eliminar la selección de destinatarios.
   * @method emitEliminar
   */
  emitEliminar(): void {
    if (this.listaDeFilaSeleccionada.length !== 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Confirmar eliminación',
        mensaje: '¿Está seguro que desea eliminar estos datos?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.eliminarDatosTabla = true;
    }
    else {
      this.errorMessageExportador();
    }

  }
  /**
  * Emite el evento para eliminar la selección de destinatarios.
  * @method emitEliminar
  */
  emitEliminarFinal(): void {
    if (this.listaDeFilaSeleccionadaFinal.length !== 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Confirmar eliminación',
        mensaje: '¿Está seguro que desea eliminar estos datos?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.eliminarDatoExportador = true;
    }
    else {
      this.errorMessageExportador();
    }
  }

  /**
   * Activa la vista de búsqueda avanzada y enfoca el siguiente campo.
   * @method buscarDestinatario
   */
  buscarDestinatario(): void {
    this.mostrarVista = !this.mostrarVista;
    this.nextField.nativeElement.focus();
  }

  /**
   * Limpia el formulario de búsqueda y restablece los valores por defecto.
   * @method limpiarFormulario
   */
  limpiarFormulario(): void {
    this.buscarForm.reset();
    this.buscarForm.patchValue({
      tipoPersona: '',
      pais: 'MEX',
    });
  }
  eliminarPedimentoDatos(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatosTabla = false;
      this.certificadoZoosanitarioStore.updateTercerosRelacionados([]);
      this.eliminarSeleccion.emit(this.listaDeFilaSeleccionada);
    } else {
      this.eliminarDatosTabla = false;
    }

  }
  eliminarExportador(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatoExportador = false;
      this.certificadoZoosanitarioStore.updateTercerosRelacionados([]);
      this.eliminarSeleccionEstinoTable.emit(this.listaDeFilaSeleccionadaFinal);
      if (this.tercerosRelacionados) {
        this.tercerosRelacionados.onLimpiarDestinatario();
      }
      this.filaSeleccionadaExportador = false;
    } else {
      this.eliminarDatoExportador = false;
    }
  }

  eliminarErrorMessage(): void {
    this.mostrarMensajeError = false;
  }
  validarFormulario(): boolean {
    let VALIDATE = false;
    if (this.exportadorRequired) {

      VALIDATE = this.cuerpoTablaExportador.length > 0;
      this.tableErrorMeassageDispalyExportador = !VALIDATE;
    }
    if (this.destinatarioRequired) {
      VALIDATE = this.cuerpoTablaDestino.length > 0;
      this.tableErrorMeassageDispalyDestinatario = !VALIDATE;
    }
    if (!this.destinatarioRequired && !this.exportadorRequired) {
      VALIDATE = true;
    }
    return VALIDATE;
  }

  errorMessageExportador(): void {
    if (this.listaDeFilaSeleccionadaFinal.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'info',
        titulo: 'Selección requerida',
        mensaje: 'Debe seleccionar al menos un exportador para continuar.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Cancelar',
        txtBtnCancelar: '',
      };
    }
    this.mostrarMensajeError = true;
  }

}