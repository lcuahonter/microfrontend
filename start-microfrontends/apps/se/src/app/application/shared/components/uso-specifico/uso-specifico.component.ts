import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Catalogo, CatalogoSelectComponent, TituloComponent, TablaDinamicaComponent, NotificacionesComponent, ConfiguracionColumna, TablaSeleccion, Notificacion } from "@libs/shared/data-access-user/src";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FraccionArancelariaProsec } from '../../models/partidas-de-la-mercancia.model';
import { FRACCIONES_ANARCIA_TABLA } from '../../constantes/partidas-de-la-mercancia.enum';
import { Tramite130103Store } from '../../../estados/tramites/tramite130103.store';

/**
 * @component
 * Componente para gestionar el uso específico y las fracciones arancelarias Prosec.
 */
@Component({
  selector: 'app-uso-specifico',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './uso-specifico.component.html',
  styleUrl: './uso-specifico.component.css',
})
export class UsoSpecificoComponent implements OnInit {

  /** Formulario reactivo para uso específico. */
  @Input() usoEspicificoForm!: FormGroup;

  /** Catálogo de fracciones arancelarias Prosec. */
  @Input() catalogosProsec: Catalogo[] = [];

  /** Evento para actualizar valores en el store. */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string }>();

  /** Evento para notificar cambios en datosSocios. */
  @Output() datosSociosChange = new EventEmitter<FraccionArancelariaProsec[]>();

  /** Evento para notificar filas seleccionadas en la tabla. */
  @Output() filaSeleccionadaChange = new EventEmitter<FraccionArancelariaProsec[]>();

  /** Configuración de columnas para la tabla dinámica. */
  @Input() configuracionTabla: ConfiguracionColumna<FraccionArancelariaProsec>[] = FRACCIONES_ANARCIA_TABLA;

  /** Lista de fracciones arancelarias agregadas. */
  @Input() datosSocios: FraccionArancelariaProsec[] = [];

  /** Tipo de selección de la tabla (checkbox). */
  CHECKBOX: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Indica si las partidas son inválidas. */
  @Input() isInvalidaPartidas: boolean = false;

  /** Bandera para modo solo lectura del formulario. */
  @Input() esFormularioSoloLectura!: boolean;

  /** Filas seleccionadas en la tabla. */
  selectedRows: FraccionArancelariaProsec[] = [];

  /** Notificación de alerta para el usuario. */
  public alertaNotificacion!: Notificacion;

  /** Bandera para confirmar eliminación de partidas. */
  confirmandoEliminarPartida = false;

  /** Bandera para mostrar notificación en pantalla. */
  mostrarNotificacion = false;

  /** Evento para notificar partidas eliminadas. */
  @Output() partidasEliminadas = new EventEmitter<string[]>();

  /** Evento para validar y enviar el formulario. */
  @Output() validarYEnviarFormularioEvent = new EventEmitter<void>();

  /** Inyección del store para actualizar estado global. */
  constructor(private tramite130103Store: Tramite130103Store) { }

  /** Inicializa el componente. */
  ngOnInit(): void {
  }

  /** Maneja el cambio de selección en la tabla. */
  alCambiarSeleccion(event: FraccionArancelariaProsec[]): void {
    this.selectedRows = event;
    if (this.selectedRows.length > 0) {
      this.isInvalidaPartidas = false;
    }
    this.filaSeleccionadaChange.emit(event);
  }

  /** Emite evento para actualizar valores en el store. */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }

  /** Agrega una nueva fracción arancelaria a la lista. */
  agregar(): void {
    if (this.usoEspicificoForm.valid) {
      const FRACCIONID = this.usoEspicificoForm.get('fraccionArancelariaProsec')?.value;
      const DESCRIPCION = this.usoEspicificoForm.get('descripcionFraccionProsec')?.value;
      const EXISTS = this.datosSocios.some(item => item.fraccionArancelariaProsec === FRACCIONID);
      const DESCRIPCION_EXISTS = this.datosSocios.some(item => item.descripcionFraccionProsec === DESCRIPCION);
      if (!EXISTS && !DESCRIPCION_EXISTS && FRACCIONID && DESCRIPCION) {
        const NUEVO: FraccionArancelariaProsec = {
          fraccionArancelariaProsec: FRACCIONID,
          descripcionFraccionProsec: DESCRIPCION,
          id: Date.now().toString() 
        };
        this.datosSocios = [...this.datosSocios, NUEVO];
        this.usoEspicificoForm.reset();
      }
    } else {
      Object.values(this.usoEspicificoForm.controls).forEach(control => control.markAsTouched());
    }
    this.filaSeleccionadaChange.emit(this.datosSocios);
  }

  /** Muestra notificación para eliminar partidas seleccionadas. */
  eliminarSeleccionadas(): void {
    if (!this.selectedRows?.length) {
      return;
    }

    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Confirmación',
      mensaje: '¿Desea eliminar los registros seleccionados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /** Maneja la confirmación del modal de eliminación. */
  onConfirmacionModal(accion: boolean): void {
    if (this.confirmandoEliminarPartida && accion === true) {
      this.eliminarPartidasSeleccionadas();
      this.confirmandoEliminarPartida = false;
    }
    this.mostrarNotificacion = false;
  }

  /** Elimina las partidas seleccionadas de la lista. */
  eliminarPartidasSeleccionadas(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      const IDS_ELIMINAR = this.selectedRows.map(row => row.id);
      this.datosSocios = this.datosSocios.filter(row => !IDS_ELIMINAR.includes(row.id));
      this.selectedRows = [];
      this.partidasEliminadas.emit(IDS_ELIMINAR);
    }
  }
}
