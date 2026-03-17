import {
  AnexoDosEncabezado,
  AnexoUnoEncabezado,
  Catalogo,
  ComplimentarFraccion,
  ComplimentarFraccionResoponse,
} from '../../models/nuevo-programa-industrial.model';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplimentosService } from '../../services/complimentos.service';
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { Location } from '@angular/common';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RestringirNegativosDirective } from '@libs/shared/data-access-user/src/tramites/directives/restringir-negativos/restringir-negativos.directive';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-complementar-fraccion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    RestringirNegativosDirective,
    NotificacionesComponent
  ],
  templateUrl: './complementar-fraccion.component.html',
  styleUrl: './complementar-fraccion.component.scss',
})
/**
 * Componente para complementar fracción.
 */
export class ComplementarFraccionComponent implements OnInit {

    /**
   * Evento para devolver la llamada del Anexo Uno
   */
  @Output() obtenerAnexoUnoDevolverLaLlamada: EventEmitter<
    AnexoUnoEncabezado[]
  > = new EventEmitter<AnexoUnoEncabezado[]>(true);
  /**
   * Notificación para mostrar mensajes al usuario.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Datos de la categoría seleccionada.
   */
  @Input() catagoriaSeleccionDatos!: Catalogo[];

  /**
   * Datos para complementar fracción.
   */
  @Input() complimentarFraccionDatos!: ComplimentarFraccion;

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Evento para emitir los datos de complementar fracción.
   */
  @Output()
  emitirComplimentarFraccionDatos: EventEmitter<ComplimentarFraccionResoponse> =
    new EventEmitter<ComplimentarFraccionResoponse>(true);
  /**
   * Evento para cerrar el popup.
   */
  @Output() cerrarPopup = new EventEmitter<void>();
  /**
   * Formulario para complementar fracción.
   */
  public complimentarForm!: FormGroup;

  /**
   * Fila seleccionada del tipo AnexoUnoEncabezado.
   * Se utiliza para almacenar y manipular la fila actualmente activa o seleccionada en la tabla.
   */
  selectedRow: AnexoUnoEncabezado | null = null;

  /**
   * Fila seleccionada del tipo AnexoDosEncabezado.
   * Permite gestionar la fila activa o seleccionada dentro de la tabla correspondiente al Anexo Dos.
   */
  selectedDosRow: AnexoDosEncabezado | null = null;

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
   * Evento para notificar el éxito de una operación.
   */
  @Output() notificarExito = new EventEmitter<void>();
/**
 * Evento para mostrar el proyecto IMMEX.
 */
  @Output() mostrarProyectoImmex = new EventEmitter<string>();

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios.
   * @param ubicaccion Servicio de ubicación para navegación.
   */
  // eslint-disable-next-line no-empty-function
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private complimentosService: ComplimentosService,
    private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery
  ) { }

  /**
   * Método de inicialización del componente.
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
      this.crearFormularioComplimentar();
      if (this.formularioDeshabilitado) {
        this.complimentarForm.disable();
      }
    });

    this.complimentosService.anexoDosFilaSeleccionada$.subscribe(row => {
      this.selectedDosRow = row;
      this.crearFormularioComplimentar();
      if (this.formularioDeshabilitado) {
        this.complimentarForm.disable();
      }
    });

    if (!(this.complementarState.tipoCategoriaOptions.length)) {
      this.obtenertipoCatagoriaOptions('ENU_TIPO_CATEGORIA');
    } else {
      this.catagoriaSeleccionDatos = [...this.complementarState.tipoCategoriaOptions];
    }
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

  /** Obtiene y actualiza las opciones del catálogo de tipo de categoría desde el servicio. */
  obtenertipoCatagoriaOptions(tipo: string): void {
    this.complimentosService.getTipoCategoria(tipo)
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.complementarStore.setTipoCategoriaOptions(res.datos);
        this.catagoriaSeleccionDatos = res.datos;
      });
  }

  /**
   * Crea el formulario del Anexo Uno.
   */
  crearFormularioComplimentar(): void {
    const ROW = this.selectedRow || this.selectedDosRow;
    this.complimentarForm = this.fb.group({
      catagoria: [
        ROW?.encabezadoCategoria,
        Validators.required,
      ],
      descripcion: [
        { value: ROW?.encabezadoDescripcionComercial, disabled:false},
        Validators.required,
      ],
      monedaNacionalMensual: [
       ROW?.encabezadoValorEnMonedaAnual,
       [Validators.required, Validators.maxLength(16)],
      ],
      monedaNacionalDeDosPeriodos: [
        ROW?.encabezadoValorEnMonedaAnual,
        [Validators.required, Validators.maxLength(21)],
      ],
      volumenMensual: [
        ROW?.encabezadoVolumenMensual,
        [Validators.required, Validators.maxLength(16)],
      ],
      twoPeriodVolume: [
        ROW?.encabezadoVolumenAnual,
         [Validators.required, Validators.maxLength(21)],
      ],
    });
  }

  /**
   * Método para seleccionar categoría.
   */
  seleccionGuardar(): void {
    if (this.complimentarForm.invalid) {
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
    }
    else
    {         
      this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'success',
          modo: 'action',
          titulo: '',
          mensaje: 'La operación se realizó exitosamente.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        }; 
    const CATEGORIA_VALUE = this.complimentarForm.get('catagoria')?.value;

    const COMP_VLAUES :AnexoUnoEncabezado[]=[{
      encabezadoFraccion: this.selectedRow?.encabezadoFraccion || '',
      encabezadoFraccionArancelaria: this.selectedRow?.encabezadoFraccionArancelaria || '',
      encabezadoDescripcionComercial: this.selectedRow?.encabezadoDescripcionComercial || '',
      encabezadoAnexoII: this.selectedRow?.encabezadoAnexoII || '',
      encabezadoTipo: this.selectedRow?.encabezadoTipo || '',
      encabezadoUmt: this.selectedRow?.encabezadoUmt || '',
      encabezadoCategoria: CATEGORIA_VALUE,
      encabezadoValorEnMonedaMensual: this.complimentarForm.get('monedaNacionalMensual')?.value,
      encabezadoValorEnMonedaAnual: this.complimentarForm.get('monedaNacionalDeDosPeriodos')?.value,
      encabezadoVolumenMensual: this.complimentarForm.get('volumenMensual')?.value,
      encabezadoVolumenAnual: this.complimentarForm.get('twoPeriodVolume')?.value,
      estatus: false
    }]
    this.obtenerAnexoUnoDevolverLaLlamada.emit(COMP_VLAUES);
  this.mostrarProyectoImmex.emit(CATEGORIA_VALUE);

    }

  }

/**  
  * Confirma la acción y emite los datos del formulario si es válido.
   */
  confirmacionModal(): void {
   
    if (this.complimentarForm.valid) {
      // this.emitirComplimentarFraccionDatos.emit(this.complimentarForm.value);
       this.cerrarPopup.emit();
       this.notificarExito.emit();
    }
  }

  /**
   * Vuelve a la ubicación anterior en el historial del navegador.
   * @returns {void}
   */
  regresar(): void {
    this.cerrarPopup.emit();
  }

  /**
   * Restringe la entrada del usuario a solo números positivos.
   * 
   * Este método se ejecuta cuando el usuario ingresa un valor en un campo del formulario.
   * Elimina cualquier carácter que no sea un dígito (`0-9`) del valor ingresado,
   * actualiza el campo del formulario correspondiente sin emitir eventos de cambio.
   * 
   * @param event Evento de entrada generado por el campo de texto.
   * @param fieldName Nombre del campo del formulario que se desea actualizar.
   */
  onIngreseNumerosPositivos(event: Event, fieldName: string): void {
    const TARGET = event.target as HTMLInputElement;
    let value = TARGET.value;
    value = value.replace(/\D/g, '');
    TARGET.value = value;
    this.complimentarForm.get(fieldName)?.setValue(value, { emitEvent: false });
  }

  /**
   * Restringe la entrada del usuario a solo dígitos.
   * @param event 
   * @param controlName 
   */
  onSoloDigitosInput(event: Event, controlName: string): void {
    const INPUT = event.target as HTMLInputElement;
    const DIGITS = INPUT.value.replace(/[^0-9]/g, '');
    INPUT.value = DIGITS;
    this.complimentarForm.get(controlName)?.setValue(DIGITS, { emitEvent: false });
  }
}
