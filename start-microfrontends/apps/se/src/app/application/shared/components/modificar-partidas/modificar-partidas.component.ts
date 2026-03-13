
import { AlertComponent, ConfiguracionAporteColumna, Notificacion, NotificacionesComponent, TablaConEntradaComponent, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { ModificarPartidasModelo } from '../../models/modificar-partidas.model';
import { ModificarPartidasService } from '../../services/modificar-partidas.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../constantes/modificar-partidas.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * ModificarPartidasComponent
 * Este componente es responsable de gestionar las partidas de la mercancía.
 * Proporciona un formulario para capturar datos, una tabla dinámica para mostrar información
 * y eventos para interactuar con otros componentes o servicios.
 */
@Component({
  selector: 'app-modificar-partidas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaConEntradaComponent,
    TooltipModule,
    AlertComponent,
    NotificacionesComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './modificar-partidas.component.html',
  styleUrl: './modificar-partidas.component.scss',
})
export class ModificarPartidasComponent implements OnChanges, OnInit {
  /**
   * idTramite
   * Identificador del trámite actual.
   */
  @Input() idTramite!: number;

  /**
   * idSolicitud
   * Identificador de la solicitud actual.
   */
  @Input() idSolicitud!: string;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;
  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description Referencia al elemento de la partida que se va a modificar.
   */
  @ViewChild('modificarPartidaModal') modificarPartidaElemento!: ElementRef;
  /**
  * @description Indica si el formulario debe mostrarse en modo solo lectura.
  */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * modificarPartidasDelaMercanciaForm
   * Formulario reactivo para modificar las partidas.
   */
  @Input() modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  @Input() formForTotalCount!: FormGroup;

  /**
 * Tipo de selección de la tabla dinámica.
 * Define el tipo de selección que se utilizará en la tabla dinámica (por ejemplo, checkbox).
 */
  CHECKBOX: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla dinámica.
   * Este campo define las columnas que se mostrarán en la tabla, incluyendo encabezados y claves.
   */
  @Input() tableHeaderData: ConfiguracionAporteColumna<ModificarPartidasModelo>[] =
  PARTIDASDELAMERCANCIA_TABLA;

  /**
   * Datos que se mostrarán en la tabla dinámica.
   * Este campo contiene las filas de datos que se renderizarán en el cuerpo de la tabla.
   */
  @Input() tableBodyData: ModificarPartidasModelo[] = [];

  /**
   * selectedRows
   * Arreglo de filas seleccionadas en la tabla dinámica de partidas de la mercancía.
   */
  selectedRows: ModificarPartidasModelo[] = [];

  /**
   * Indica si las partidas son inválidas.
   * 
   * Este valor se recibe como una propiedad de entrada desde el componente padre.
   * Cuando es `true`, puede utilizarse para mostrar mensajes de error, deshabilitar acciones
   * o aplicar estilos visuales de validación.
   *
   * @type {boolean}
   * @Input()
   */
  @Input() isInvalidaPartidas: boolean = false;

   /**
   * Si es true, los antecedentes son editables; si es false, son de solo lectura.
   */
  @Input() soloLectura: boolean = false;

  /**
   * Constructor para inicializar el componente e inyectar dependencias.
   * FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder, public modificarPartidasService: ModificarPartidasService) {
    //  Constructor del componente
  }

  /**
   * ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se configuran los formularios reactivos utilizados en el componente.
   */
  ngOnInit(): void {
    this.formForTotalCount = this.fb.group({
      cantidadTotalSolicitada: [{ value: '', disabled: true }],
      valorSolicitado: [{ value: '', disabled: true }],
      cantidadTotalAutorizada: [{ value: '', disabled: true }],
      valorAutorizado: [{ value: '', disabled: true }]
    });

    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadModificar: [''],
      descripcionModificar: ['']
    });
  }

  /**
   * ngOnChanges
   * Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada.
   * @param changes Objeto que contiene los cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idTramite'] || changes['idSolicitud']) {
      this.getModificarPartidasPex(this.idTramite, this.idSolicitud);
    }

    if (changes['soloLectura']) {
      this.formForTotalCount?.disable();
      this.modificarPartidasDelaMercanciaForm?.disable();
      this.esFormularioSoloLectura = this.soloLectura;
    }
  }

  /**
   * Maneja las filas seleccionadas en la tabla dinámica y emite un evento.
   * Lista de filas seleccionadas.
   */
  handleListaDeFilaSeleccionada(event: ModificarPartidasModelo[]): void {
    const SELECTED_ROW = event;
    if (SELECTED_ROW.length > 0) {
      const SOLICITUD_ID = Number(SELECTED_ROW[0].idSolicitud ?? 0);
      const ID_PARTIDA_SOL = Number(SELECTED_ROW[0].idPartidaSol ?? 0);
      this.getTestarPartidasPex(this.idTramite, SOLICITUD_ID, ID_PARTIDA_SOL);
    }else if(event.length === 0){
      this.getModificarPartidasPex(this.idTramite, this.idSolicitud);
    }
  }

  /**
   * Navega para modificar una partida específica, emitiendo un evento.
   */
  navegarParaModificarPartida(): void {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: this.idTramite === 130109 ? 'Debe seleccionar una partida de mercancía.' : 'Debe seleccionar un elemento',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }

    if (this.modificarPartidaElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.modificarPartidaElemento?.nativeElement,
        { backdrop: false }
      );
      this.modificarPartidasDelaMercanciaForm.patchValue({
        cantidadModificar: this.selectedRows[0].unidadesAutorizadas,
        descripcionModificar: this.selectedRows[0].descripcionAutorizada,
      });

      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Cancela la modificación de una partida específica, cerrando el modal.
   */
  modalCancelar(): void {
    if (this.modificarPartidaElemento && this.modificarPartidaElemento.nativeElement) {
      const MODAL_INSTANCIA = Modal.getInstance(
        this.modificarPartidaElemento.nativeElement
      );
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
  }

  /**
   * Valida los campos del formulario antes de modificar una partida.
   * Si la validación es exitosa, actualiza los datos de la tabla y cierra el modal.
   */
  validarModificarPartida(): void {
    if (this.modificarPartidasDelaMercanciaForm.get('cantidadModificar')?.value > (this.selectedRows[0].unidadesAutorizadas || 0)) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'La cantidad autorizada no puede ser mayor a la cantidad solicitada. Favor de verificar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }

    this.tableBodyData = this.tableBodyData.map(row =>
      row.idSolicitud === this.selectedRows[0].idSolicitud
        ? {
          ...row,
          unidadesAutorizadas: this.modificarPartidasDelaMercanciaForm.get('cantidadModificar')?.value,
          descripcionAutorizada: this.modificarPartidasDelaMercanciaForm.get('descripcionModificar')?.value
        }
        : row
    );

    this.modificarPartidasPex(
      this.idTramite,
      Number(this.selectedRows[0].idSolicitud),
      Number(this.selectedRows[0].idPartidaSol),
      Number(this.modificarPartidasDelaMercanciaForm.get('cantidadModificar')?.value),
      this.modificarPartidasDelaMercanciaForm.get('descripcionModificar')?.value
    );

    if (this.modificarPartidaElemento && this.modificarPartidaElemento.nativeElement) {
      const MODAL_INSTANCIA = Modal.getInstance(this.modificarPartidaElemento.nativeElement);
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
  }

  /**
   * Modifica las partidas de la mercancía para el trámite y solicitud especificados.
   * @param tramite Identificador del trámite.
   * @param solicitudId Identificador de la solicitud.
   * @param idPartidaSol Identificador de la partida de la solicitud.
   * @param unidadesAutorizadas Cantidad autorizada para la partida.
   * @param descripcionAutorizada Descripción autorizada para la partida.
   */
  modificarPartidasPex(tramite: number, solicitudId: number, idPartidaSol: number, unidadesAutorizadas: number, descripcionAutorizada: string): void {
    this.modificarPartidasService.setModificarPartidasPex(tramite, solicitudId, idPartidaSol, unidadesAutorizadas, descripcionAutorizada).subscribe({
      next: (data: ModificarPartidasModelo[]) => {
        const RESPONSE = data[0];

        this.tableBodyData = this.tableBodyData.map(row =>
          row.idSolicitud === RESPONSE?.idSolicitud
            ? {
              ...row,
              unidadesAutorizadas: RESPONSE.unidadesAutorizadas ?? 0,
              descripcionAutorizada: RESPONSE.descripcionAutorizada ?? '',
              importeUnitarioUSDAutorizado: RESPONSE.importeUnitarioUSDAutorizado ?? 0,
              importeTotalUSDAutorizado: RESPONSE.importeTotalUSDAutorizado ?? 0
            }
            : row
        );

        this.formForTotalCount.patchValue({
          cantidadTotalAutorizada: this.tableBodyData.reduce((sum, partida) => sum + (Number(partida.unidadesAutorizadas) || 0), 0),
          valorAutorizado: this.tableBodyData.reduce((sum, partida) => sum + (Number(partida.importeTotalUSDAutorizado?.toFixed(3)) || 0), 0)
        });
      },
      error: (error) => {
        console.error('Error fetching Modificar Partidas PEX data:', error);
      }
    });
  }

  /**
   * Obtiene las partidas de prueba para el trámite y solicitud especificados.
   * @param tramite Identificador del trámite.
   * @param solicitudId Identificador de la solicitud.
   * @param idPartidaSol Identificador de la partida de la solicitud.
   */
  getTestarPartidasPex(tramite: number, solicitudId: number, idPartidaSol: number): void {
    this.modificarPartidasService.getTestarPartidasPex(tramite, solicitudId, idPartidaSol).subscribe({
      next: (data: ModificarPartidasModelo[]) => {
        const RESPONSE = data[0];
        this.tableBodyData = this.tableBodyData.map(row =>
          row.idSolicitud === RESPONSE?.idSolicitud
            ? {
              ...row,
              ...RESPONSE
            }
            : row
        );
        this.formForTotalCount.patchValue({
          cantidadTotalAutorizada: 0,
          valorAutorizado: 0
        });
      },
      error: (error) => {
        console.error('Error fetching Modificar Partidas PEX data:', error);
      }
    });
  }


  /**
   * Obtiene las partidas de la mercancía para el trámite y solicitud especificados.
   * @param tramite Identificador del trámite.  
   * @param solicitudId Identificador de la solicitud.
   */
  getModificarPartidasPex(tramite: number, solicitudId: string): void {
    this.modificarPartidasService.getModificarPartidasPex(tramite, solicitudId).subscribe({
      next: (data: ModificarPartidasModelo[]) => {
        this.tableBodyData = (data || []) as ModificarPartidasModelo[];
        if (this.tableBodyData.length > 0) {
          this.formForTotalCount?.patchValue({
            cantidadTotalSolicitada: this.tableBodyData
              .reduce((sum, p) => sum + (p.unidadesSolicitadas ?? 0), 0)
              .toFixed(3),

            valorSolicitado: this.tableBodyData
              .reduce((sum, p) => sum + (p.importeTotalUSD ?? 0), 0)
              .toFixed(3),

            cantidadTotalAutorizada: this.tableBodyData
              .reduce((sum, p) => sum + (Number(p.unidadesAutorizadas) ?? 0), 0)
              .toFixed(3),

            valorAutorizado: this.tableBodyData
              .reduce((sum, p) => sum + (Number(p.importeTotalUSDAutorizado) ?? 0), 0)
              .toFixed(3)
          });

        }
      },
      error: (error) => {
        console.error('Error fetching Modificar Partidas PEX data:', error);
      }
    });
  }

  /**
   *  Maneja la confirmación del modal de notificación.
   * @param accion  Indica si se confirmó la acción en el modal.
   */
  onConfirmacionModal(accion: boolean): void {
    if (accion === true) {
      this.mostrarNotificacion = false;
    }
  }

  /**
   * Maneja el evento cuando se selecciona una fila con el radio button.
   * @param event  Evento de selección de fila.
   */
  handleFilaRadioBtnSeleccionada(event: any): void {
    this.selectedRows = [event];
  }
}

