/**
 * @fileoverview
 * Componente para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Permite buscar, agregar, modificar y eliminar terceros relacionados, así como mostrar tablas dinámicas de exportadores y destinos.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module TercerosrelacionadosComponent
 */

import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertComponent,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OPCION_DE_BOTON_DE_RADIO,
  SELECCIONADO,
} from '../../constantes/220202/fitosanitario.enums';
import {
  RadioOpcion,
  TercerosRelacionados,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosdestinoTable,
} from '../../models/220202/fitosanitario.model';
import { CommonModule } from '@angular/common';


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
    NotificacionesComponent
  ],
  templateUrl: './tercerosrelacionados.component.html',
})
export class TercerosrelacionadosComponent {
  /**
   * Clase CSS para el tipo de alerta informativa.
   * @type {string}
   */
  infoAlert: string = 'alert-info';

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
   * @type {TercerosRelacionados}
   */
  @Input() catalogosDatos: TercerosRelacionados = {} as TercerosRelacionados;

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
   * @type {TercerosrelacionadosExportadorTable[]}
   */
  @Input() cuerpoTablaExportador: TercerosrelacionadosExportadorTable[] = [];

  /**
  * Evento emitido para abrir el modal de destinatario.
  * @type {abrirModalDestinatario}
  */
  @Output() abrirModalDestinatario = new EventEmitter<TercerosrelacionadosdestinoTable>();

  /**
   * Evento emitido para abrir el modal de exportador.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable>}
   */
  @Output() abrirModalExportador = new EventEmitter<TercerosrelacionadosExportadorTable>();

  /**
   * Evento emitido al eliminar una selección de destinatarios.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable[]>}
   */
  @Output() eliminarSeleccion: EventEmitter<
    TercerosrelacionadosdestinoTable[]
  > = new EventEmitter();

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
  listaDeFilaSeleccionadaFinal: TercerosrelacionadosExportadorTable[] = [];

  /**
   * Configuración de las columnas para la tabla de exportadores.
   * @type {ConfiguracionColumna<TercerosrelacionadosTable>[]}
   */
  configuracionColumnasExportador: ConfiguracionColumna<TercerosrelacionadosExportadorTable>[] = [
    {
      encabezado: 'Nombre/denominación o razón social', clave: (fila) => fila ? fila.razonSocial?.trim()
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
    { encabezado: 'País', clave: (fila) => this.obtenerDescripcionPais(fila.pais), orden: 5 },
  ];

  /**
   * Configuración de las columnas para la tabla de destinatarios.
   * @type {ConfiguracionColumna<TercerosrelacionadosdestinoTable>[]}
   */
  configuracionColumnasDestino: ConfiguracionColumna<TercerosrelacionadosdestinoTable>[] = [
    {
      encabezado: 'Nombre/denominación o razón social', clave: (fila) => fila
        ? fila.razonSocial?.trim()
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
    { encabezado: 'País', clave: (fila) => fila.paisDescripcion || this.obtenerDescripcionPais(fila.pais), orden: 7 },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaDescripcion || this.obtenerDescripcionColonia(fila.colonia), orden: 8 },
    { encabezado: 'Municipio o alcaldía', clave: (fila) => fila.municipioDescripcion || this.obtenerDescripcionMunicipio(fila.municipio), orden: 9 },
    { encabezado: 'Entidad federativa', clave: (fila) => fila.estadoDescripcion || this.obtenerDescripcionEstado(fila.estado), orden: 10 },
    { encabezado: 'Código postal', clave: (fila) => fila.codigoPostal, orden: 11 },
  ];

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
   * Evento emitido al eliminar una selección de destinatarios.
   * @type {EventEmitter<TercerosrelacionadosdestinoTable[]>}
   */
  @Output() eliminarSeleccionEstinoTable: EventEmitter<TercerosrelacionadosExportadorTable[]> = new EventEmitter();

  /**
   * Formulario reactivo para búsqueda de destinatarios.
   * @type {FormGroup}
   */
  buscarForm!: FormGroup;

  /**
    * Catálogos de datos de la solicitud, como países y estados.
    * @type {DatosDeLaSolicitud}
    */
  @Input() mensajeErrorTablaExportador: boolean = false;

  /**
  * Catálogos de datos de la solicitud, como países y estados.
  * @type {DatosDeLaSolicitud}
  */
  @Input() mensajeErrorTablaDestinatario: boolean = false;



  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento de Angular.
   * @param route Información de la ruta activa.
   * @param fb FormBuilder para crear el formulario reactivo.
   */
  constructor(
    public readonly router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.buscarForm = this.fb.group({
      tipoPersona: ['yes'],
      razonSocial: [''],
      correoElectronico: [''],
      pais: ['1'],
      entidadFederativa: [''],
    });
  }

  /**
   * Navega a la pantalla para agregar un nuevo destinatario.
   * @method goToAgregarDestinatario
   */
  goToAgregarDestinatario(): void {
    this.abrirModalDestinatario.emit();
  }

  /**
   * Navega a la pantalla para agregar un nuevo exportador.
   * Resetea las selecciones y el formulario para evitar mostrar datos previos.
   * @method goToAgregarExportador
   */
  goToAgregarExportador(): void {
    this.abrirModalExportador.emit();
  }

  /**
   * Navega a la pantalla para modificar un destinatario existente.
   * @method modificarDestinatario
   */
  modificarDestinatario(): void {
   if (this.listaDeFilaSeleccionada[0]) {
      this.abrirModalDestinatario.emit(this.listaDeFilaSeleccionada[0]);
    }
    else {
      this.abrirModalDestinatario.emit();
    }
  }
  /**
   * Navega a la pantalla para modificar un exportador existente.
   * @method modificarExportador
   */
  modificarExportador(): void {
    if (this.listaDeFilaSeleccionadaFinal[0] ) {
      this.abrirModalExportador.emit(this.listaDeFilaSeleccionadaFinal[0]);
    }
    else {
      this.abrirModalExportador.emit();
    }
  }

  /**
   * Actualiza la lista de filas seleccionadas de destinatarios.
   * @param filas Filas seleccionadas.
   * @method onSeleccionDestinatario
   */
  onSeleccionDestinatario(filas: TercerosrelacionadosdestinoTable[]): void {
    this.listaDeFilaSeleccionada = filas;
  }

  /**
   * Actualiza la lista de filas seleccionadas de destinatarios.
   * @param filas Filas seleccionadas.
   * @method onSeleccionDestinatario
   */
  onSeleccionDestinatarioFinal(
    filas: TercerosrelacionadosExportadorTable[]
  ): void {
    this.listaDeFilaSeleccionadaFinal = filas;
  }
  /**
   * Emite el evento para eliminar la selección de destinatarios.
   * @method emitEliminar
   * Agrupa ambas funcionalidades: notificación y emisión del evento.
   */
  emitEliminar(): void {
    this.eliminarSeleccion.emit(this.listaDeFilaSeleccionada); 
  }

  // emitEliminar(): void {
  //   this.nuevaNotificacion = {
  //     tipoNotificacion: 'alert',
  //     categoria: 'danger',
  //     modo: 'action',
  //     titulo: 'Confirmar eliminación',
  //     mensaje: 'Está seguro que desea eliminar estos datos?',
  //     cerrar: false,
  //     tiempoDeEspera: 2000,
  //     txtBtnAceptar: 'Aceptar',
  //     txtBtnCancelar: 'Cancelar',
  //   };
  //   this.eliminarSeleccion.emit(this.listaDeFilaSeleccionada); 
  //   this.eliminarDatosTabla = true;

  // }

  /**
   * Emite el evento para eliminar la selección de destinatarios finales.
   * @method emitEliminarFinal
   * Agrupa ambas funcionalidades: notificación y emisión del evento.
   */
  emitEliminarFinal(): void {
    this.eliminarSeleccionEstinoTable.emit(this.listaDeFilaSeleccionadaFinal);
  }

  // emitEliminarFinal(): void {
  //   this.nuevaNotificacion = {
  //     tipoNotificacion: 'alert',
  //     categoria: 'danger',
  //     modo: 'action',
  //     titulo: 'Confirmar eliminación',
  //     mensaje: 'Está seguro que desea eliminar estos datos?',
  //     cerrar: false,
  //     tiempoDeEspera: 2000,
  //     txtBtnAceptar: 'Aceptar',
  //     txtBtnCancelar: 'Cancelar',
  //   };
  //   this.eliminarSeleccionEstinoTable.emit(this.listaDeFilaSeleccionadaFinal); 
  //   this.eliminarDatoExportador = true;
  // }

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
      tipoPersona: 'yes',
      pais: '1',
    });
  }

  eliminarPedimentoDatos(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatosTabla = false;
      this.eliminarSeleccion.emit(this.listaDeFilaSeleccionada);
    } else {
      this.eliminarDatosTabla = false;
    }

  }

  eliminarExportador(borrar: boolean): void {
    if (borrar) {
      this.eliminarDatoExportador = false;
      this.eliminarSeleccionEstinoTable.emit(this.listaDeFilaSeleccionadaFinal);
    } else {
      this.eliminarDatoExportador = false;
    }

  }

  /**
   * Obtiene la descripción del país a partir de su ID.
   * @param paisId ID del país a buscar
   * @returns Descripción del país o el ID si no se encuentra
   * @method obtenerDescripcionPais
   */
  obtenerDescripcionPais(paisId: string): string {
    return this.catalogosDatos?.paises?.find(p => p.id?.toString() === paisId?.toString())?.descripcion || paisId || '';
  }

  /**
   * Obtiene la descripción del estado a partir de su ID.
   * @param estadoId ID del estado a buscar
   * @returns Descripción del estado o el ID si no se encuentra
   * @method obtenerDescripcionEstado
   */
  obtenerDescripcionEstado(estadoId: string): string {
    return this.catalogosDatos?.estados?.find(e => e.id?.toString() === estadoId?.toString())?.descripcion || estadoId || '';
  }

  /**
   * Obtiene la descripción del municipio a partir de su ID.
   * @param municipioId ID del municipio a buscar
   * @returns Descripción del municipio o el ID si no se encuentra
   * @method obtenerDescripcionMunicipio
   */
  obtenerDescripcionMunicipio(municipioId: string | undefined): string {
    return this.catalogosDatos?.municipio?.find(m => m.id?.toString() === municipioId?.toString())?.descripcion || municipioId || '';
  }

  /**
   * Obtiene la descripción de la colonia a partir de su ID.
   * @param coloniaId ID de la colonia a buscar
   * @returns Descripción de la colonia o el ID si no se encuentra
   * @method obtenerDescripcionColonia
   */
  obtenerDescripcionColonia(coloniaId: string | undefined): string {
    return this.catalogosDatos?.colonias?.find(c => c.id?.toString() === coloniaId?.toString())?.descripcion || coloniaId || '';
  }

}
