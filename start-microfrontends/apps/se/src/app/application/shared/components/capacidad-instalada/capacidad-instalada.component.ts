import { CAPACIDAD_INSTALADA, CapacidadInstalada } from '../../constantes/capacidad-instalada.enum';
import { Catalogo, Catalogos, CatalogoSelectComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, } from '@libs/shared/data-access-user/src';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion,NotificacionesComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplementosSeccionQuery } from '../../../estados/queries/complementos-seccion.query';
import { ComplementosSeccionState } from '../../../estados/tramites/complementos-seccion.store';
import { Location } from '@angular/common';

import { ComplimentosService } from '../../services/complimentos.service';

import { AnexoUnoEncabezado } from '../../models/nuevo-programa-industrial.model';

/**
 * Componente para la capacidad instalada
 * @export CapacidadInstaladaComponent
 * */
@Component({
  selector: 'app-capacidad-instalada',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent, FormsModule,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  templateUrl: './capacidad-instalada.component.html',
  styleUrl: './capacidad-instalada.component.css',
})
export class CapacidadInstaladaComponent implements OnInit {
  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

    /**
   * @description
   * Objeto que representa una notificación de confirmación para agregar servicios.
   * Se utiliza para mostrar modal de confirmación al usuario.
   */
  public notificacionAgregarServicios!: Notificacion;
  /**
   * Notificación que se muestra al usuario.
  /**
   * Maneja el cambio en la fracción arancelaria del producto terminado.
   * 
   * Actualiza los campos 'umt' y 'descripcionComercialProductoTerminado' en el formulario
   * `capacidadForm` basándose en la selección realizada.
   * @param selected 
   */
  onFraccionArancelariaProductoTerminadoChange(): void {

  const SELECTED_CLAVE = this.capacidadForm.get('fraccionArancelariaProductoTerminado')?.value;
  if (!SELECTED_CLAVE) {
    this.capacidadForm.patchValue({
      umt: '',
      descripcionComercialProductoTerminado: ''
    });
    return;
  }
 
  const SELECTED_CATALOG = this.fraccionArancelariaProductoTerminadoCatlogo.find(
    (item: Catalogo) => item.clave === SELECTED_CLAVE || item.descripcion === SELECTED_CLAVE
  );
 
  const CAPACIDAD = this.anexoUnoTablaLista.find(
    (item: AnexoUnoEncabezado) => item.encabezadoFraccionArancelaria === SELECTED_CLAVE
  );
  if (SELECTED_CATALOG) {
    this.capacidadForm.get('umt')?.setValue(CAPACIDAD?.encabezadoUmt);
    this.capacidadForm.get('descripcionComercialProductoTerminado')?.setValue(CAPACIDAD?.encabezadoDescripcionComercial);
  } else {
    this.capacidadForm.patchValue({
      umt: '',
      descripcionComercialProductoTerminado: ''
    });
  }
}

  /**
   * Notificación que se muestra al usuario al eliminar un registro.
   */
  public nuevaNotificacionEliminar!: Notificacion;
  /**
   * Índice de la capacidad instalada que se está editando actualmente.
   */
  editingIndex: number | null = null;
  /**
  * Formulario reactivo que gestiona los datos relacionados con el pago de derechos, como clave, dependencia, banco,
  * llave, fecha e importe.
  */
  capacidadForm!: FormGroup;
  /**
    * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
    */
  public solicitudState!: ComplementarState;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Lista de encabezados del anexo Uno.
   * @type {AnexoUnoEncabezado[]}
   */
  @Input() anexoUnoTablaLista: AnexoUnoEncabezado[] = [];

  /**
 * Estado de la solicitud 250101, que contiene los valores actuales de la solicitud.
 */
  public complementosSeccionState!: ComplementosSeccionState;

  /**
   * Evento que emite la lista de objetos de tipo `CapacidadInstalada` para la tabla de capacidad instalada.
   * 
   * @event
   * @type {EventEmitter<CapacidadInstalada[]>}
   * @remarks
   * Este evento se dispara cuando hay cambios en la lista de capacidad instalada, permitiendo que componentes padres reciban la información actualizada.
   */
  @Output() obtenerCapacidadInstaladaTablaList: EventEmitter<
    CapacidadInstalada[]
  > = new EventEmitter<CapacidadInstalada[]>(true);

  /**
   * Constructor de la clase CapacidadInstaladaComponent
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador
   */
  constructor(private ubicaccion: Location, private fb: FormBuilder, private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery, private complementosSeccionQuery: ComplementosSeccionQuery,private cs: ComplimentosService) {

  }
  /**
  * Método que se ejecuta cuando el componente es inicializado.
  * 
  * Inicializa el formulario reactivo con los valores actuales de la solicitud.
  */
  ngOnInit(): void {
    // this.cs.getdatosProducto(this.anexoUnoTablaLista[0]?.encabezadoFraccionArancelaria ?? '29242999').pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
    //   this.fraccionArancelariaProductoTerminadoCatlogo = res.datos || [];
    // // });
    // this.complementosSeccionQuery.selectSolicitud$
    //   .pipe(
    //     takeUntil(this.destroyNotifier$),
    //     map((seccionState) => {
    //       this.complementosSeccionState = seccionState as ComplementosSeccionState;
    //       if (this.complementosSeccionState['fraccionArancelaria']) {
    //         this.fraccionArancelariaProductoTerminadoCatlogo.push({
    //           id: 1,
    //           descripcion: typeof this.complementosSeccionState['fraccionArancelaria'] === 'string'
    //             ? this.complementosSeccionState['fraccionArancelaria']
    //             : (typeof this.complementosSeccionState['fraccionArancelaria'] === 'object' && this.complementosSeccionState['fraccionArancelaria'] !== null && 'descripcion' in this.complementosSeccionState['fraccionArancelaria']
    //               ? (this.complementosSeccionState['fraccionArancelaria'] as { descripcion: string }).descripcion
    //               : '')
    //         })
    //       }
    //     })
    //   )
    //   .subscribe();
    this.fraccionArancelariaProductoTerminadoCatlogo = this.anexoUnoTablaLista.map(item => ({
      id: Number(item.encabezadoFraccionArancelaria),
      descripcion: item.encabezadoFraccionArancelaria,
      clave: '1_' + item.encabezadoFraccionArancelaria
    }));
      this.inicializarFormulario();
    if (!this.capacidadInstaladaDatos) {
      this.capacidadInstaladaDatos = [];
    }
    this.onFraccionArancelariaProductoTerminadoChange();
  }
  /**
   * Tipo de selección para la tabla de capacidad instalada
   * @property {TablaSeleccion} constructorapacidadInstaladaTablaSeleccion
   */
  constructorapacidadInstaladaTablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Encabezados de la tabla de capacidad instalada
   * @property {any} capacidadInstaladaEncabezado
   */
  capacidadInstaladaEncabezado = CAPACIDAD_INSTALADA;

  /**
   * Datos de la tabla de capacidad instalada
   * @property {any[]} capacidadInstaladaDatos
   */
  capacidadInstaladaDatos!: CapacidadInstalada[];

  /**
   * Datos de la tabla de capacidad instalada
   * @property {any[]} SelectedInstaladaDatos
   */
  SelectedInstaladaDatos!: CapacidadInstalada[];

  /**
   * Catálogo de fracciones arancelarias de producto terminado
   * @property {any[]} fraccionArancelariaProductoTerminadoCatlogo
   */
  fraccionArancelariaProductoTerminadoCatlogo: Catalogo[] = [];

  /**
   * Vuelve a la ubicación anterior en el historial del navegador
   * @returns {void}
   */
  regrasar(): void {
    this.obtenerCapacidadInstaladaTablaList.emit(this.capacidadInstaladaDatos);
    this.cerrarPopup.emit();

  }
  /** Inicializa los datos del formulario suscribiéndose al estado del trámite.  
 *  Asigna el estado actual al modelo local del componente. */
  inicializarFormulario(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementarState;
        })
      )
      .subscribe();
    this.capacidadForm = this.fb.group({
      fraccionArancelariaProductoTerminado: [this.solicitudState.fraccionArancelariaProductoTerminado, Validators.required],
      umt: [{ value: this.solicitudState.umt, disabled: true }, Validators.required],
      descripcionComercialProductoTerminado: [{ value: this.solicitudState.descripcionComercialProductoTerminado, disabled: true }, Validators.required],
      turnos: [this.solicitudState.turnos, [Validators.required]],
      horasPorTurno: [this.solicitudState.horasPorTurno, [Validators.required]],
      cantidadEmpleados: [this.solicitudState.cantidadEmpleados, [Validators.required]],
      cantidadMaquinaria: [this.solicitudState.cantidadMaquinaria, [Validators.required]],
      descripcionMaquinaria: [this.solicitudState.descripcionMaquinaria, [Validators.required, Validators.maxLength(300)]],
      capacidadInstaladaMensual: [this.solicitudState.capacidadInstaladaMensual, [Validators.required, Validators.maxLength(11), Validators.pattern('^\\d{1,11}$')]],
      capacidadInstaladaAnual: [this.solicitudState.capacidadInstaladaAnual, [Validators.required]],
      calculoCapacidadInstalada: [{ value: this.solicitudState.calculoCapacidadInstalada, disabled: true }, Validators.required],
      capacidadUtilizadaPct: [this.solicitudState.capacidadUtilizadaPct, Validators.required]
    });
    if(this.solicitudState.capacidadInstaladaDatos.length >0){
      this.capacidadInstaladaDatos = this.solicitudState.capacidadInstaladaDatos;
      this.limpiar();
    }

  }

  /**
   * Limita la entrada de un campo de texto a un número máximo de caracteres numéricos.
   * @param event Event del input
   * @param maxLength Longitud máxima permitida
   * @param controlPath Ruta del control en el formulario
   */
  onInputMaxLength(event: Event, maxLength: number, controlPath: string): void {
    const TARGET = event.target as HTMLInputElement;
    let value = TARGET.value;
    value = value.replace(/\D/g, '').slice(0, maxLength);
    TARGET.value = value;
    this.capacidadForm.get(controlPath)?.setValue(value, { emitEvent: false });
  }
  /**
  * Método que se ejecuta cuando el campo capacidadUtilizadaPct pierde el foco (blur).
  * Autopopula el valor de calculoCapacidadInstalada con el valor actual de capacidadUtilizadaPct.
  */
  alPerderFocoCapacidadUtilizadaPct(): void {
    const VAL = ((this.capacidadForm.get('turnos')?.value* this.capacidadForm.get('horasPorTurno')?.value)*this.capacidadForm.get('cantidadEmpleados')?.value/(this.capacidadForm.get('capacidadUtilizadaPct')?.value /100)) || 0;
    this.capacidadForm.get('calculoCapacidadInstalada')?.setValue(VAL);
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
   * Agrega una nueva capacidad instalada al arreglo `capacidadInstaladaDatos` 
   * basado en los valores proporcionados en el formulario `capacidadForm`.
   * 
   * Este método crea un objeto de tipo `CapacidadInstalada` con los datos 
   * ingresados en el formulario, lo agrega al arreglo y luego limpia el formulario.
   * 
   * @remarks
   * - Asegúrese de que los campos del formulario estén correctamente mapeados 
   *   a las propiedades del objeto `CapacidadInstalada`.
   * - Este método también llama al método `limpiar` para restablecer los valores 
   *   del formulario después de agregar los datos.
   * 
   * @example
   * // Ejemplo de uso:
   * componente.agregar();
   * 
   * @throws
   * Este método no lanza excepciones explícitas, pero puede fallar si los valores 
   * del formulario no están definidos o no son válidos.
   */
  agregar(): void {
      if (!this.capacidadForm.valid) {
         this.notificacionAgregarServicios = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',          
        };
        this.capacidadForm.markAllAsTouched();
  }
  else
  {
      this.alPerderFocoCapacidadUtilizadaPct();
const CAPACIDAD: CapacidadInstalada = {
      PLANTA: this.cs.plantaID,// Adjust field mapping as needed
      FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: this.capacidadForm.value.fraccionArancelariaProductoTerminado,
      UMT: this.capacidadForm.get('umt')?.value,
      DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: this.capacidadForm.get('descripcionComercialProductoTerminado')?.value,
      TURNOS: this.capacidadForm.value.turnos,
      HORAS_POR_TURNO: this.capacidadForm.value.horasPorTurno,
      CANTIDAD_EMPLEADOS: this.capacidadForm.value.cantidadEmpleados,
      CANTIDAD_MAQUINARIA: this.capacidadForm.value.cantidadMaquinaria,
      DESCRIPCION_MAQUINARIA: this.capacidadForm.value.descripcionMaquinaria,
      CAPACIDAD_INSTALADA_MENSUAL: this.capacidadForm.value.capacidadInstaladaMensual,
      CAPACIDAD_INSTALADA_ANUAL: this.capacidadForm.value.capacidadInstaladaAnual,
      CAPACIDAD_EFECTIVAMENTE_UTILIZADA: this.capacidadForm.value.capacidadUtilizadaPct,
      CALCULO_CAPACIDAD_INSTALADA: this.capacidadForm.get('calculoCapacidadInstalada')?.value,
    };
    if(parseInt(CAPACIDAD.HORAS_POR_TURNO,10) > 8 || parseInt(CAPACIDAD.HORAS_POR_TURNO,10)===0){
      this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Las horas por turno debe ser menores o iguales a 8.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',          
      };
      return;
    }else if(parseInt(CAPACIDAD.CAPACIDAD_EFECTIVAMENTE_UTILIZADA, 10) > 100){
      this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'El porcentaje es incorrecto, el valor debe ser entre 0-100.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',          
      };
      return;
    }
   const FIELD_LABELS: { key: keyof typeof CAPACIDAD; label: string }[] = [
  { key: 'TURNOS', label: 'TURNO' },
  { key: 'CANTIDAD_EMPLEADOS', label: 'CANTIDAD DE EMPLEADOS' },
  { key: 'CANTIDAD_MAQUINARIA', label: 'CANTIDAD DE MAQUINARIA' },
];

for (const FILED of FIELD_LABELS) {
  if (CAPACIDAD[FILED.key] === '0') {
    this.notificacionAgregarServicios = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: `El ${FILED.label} debe ser mayor a cero.`,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    return;
  }
}
     if (this.editingIndex === null) {
      const EXISTE = this.capacidadInstaladaDatos.findIndex(item => item.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO === CAPACIDAD.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO);
      if (EXISTE !== -1) {
      this.notificacionAgregarServicios = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: `El regitro que intenta capturar ya se encuentra registrado`,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    return;
      }
  }
    if (this.editingIndex !== null && this.editingIndex > -1) {
      this.capacidadInstaladaDatos[this.editingIndex] = CAPACIDAD;
      this.capacidadInstaladaDatos = [...this.capacidadInstaladaDatos];
      this.editingIndex = null;
     
    } else {  
      this.capacidadInstaladaDatos = [...this.capacidadInstaladaDatos, CAPACIDAD];
    }
    this.complementarStore.setCapacidadInstaladaDatos(this.capacidadInstaladaDatos);
    this.SelectedInstaladaDatos = [];
    this.limpiar();
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La operación se realizó exitosamente.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
    
  }

  /**
   * Método invocado cuando ocurre un cambio en la fracción arancelaria.
   * 
   * Este método actualiza el estado de la tienda con los valores correspondientes
   * relacionados con la fracción arancelaria del producto terminado. Utiliza el formulario
   * `capacidadForm` para obtener los datos necesarios y llama a la función `setValoresStore`
   * para realizar la actualización en el estado global.
   * 
   * @returns {void} Este método no devuelve ningún valor.
   */
  onFraccionArancelariaChange(): void {
    this.setValoresStore(this.capacidadForm, 'fraccionArancelariaProductoTerminado', 'setFraccionArancelariaProductoTerminado');
  }

  /**
   * Restablece el formulario de capacidad a su estado inicial.
   *
   * Este método realiza las siguientes acciones en el formulario `capacidadForm`:
   * - Restablece todos los valores del formulario a sus valores iniciales mediante `reset()`.
   * - Marca el formulario como "prístino" (sin cambios) utilizando `markAsPristine()`.
   * - Marca el formulario como "no tocado" utilizando `markAsUntouched()`.
   * - Actualiza el estado de validez del formulario llamando a `updateValueAndValidity()`.
   *
   * Útil para limpiar el formulario y prepararlo para un nuevo ingreso de datos.
   */
  limpiar(): void {
    this.capacidadForm.reset();
    this.capacidadForm.markAsPristine();
    this.capacidadForm.markAsUntouched();
    this.capacidadForm.updateValueAndValidity();
  }


  /**
   * Maneja la selección de capacidades instaladas.
   * 
   * @param capacidadInstalada - Arreglo de objetos `CapacidadInstalada` seleccionados.
   * Si el arreglo contiene elementos, actualiza la propiedad `SelectedInstaladaDatos` con la selección.
   */
  onCapacidadInstaladaSeleccionadas(capacidadInstalada: CapacidadInstalada[]): void { 
      this.SelectedInstaladaDatos = capacidadInstalada;

  }

  /**
   * Elimina las capacidades instaladas seleccionadas de la lista `capacidadInstaladaDatos`.
   * 
   * Recorre el arreglo `SelectedInstaladaDatos` y elimina cada elemento correspondiente
   * de `capacidadInstaladaDatos` si existe. Al finalizar, actualiza la referencia del arreglo
   * para asegurar la detección de cambios en Angular.
   *
   * @remarks
   * Esta función asume que `SelectedInstaladaDatos` y `capacidadInstaladaDatos` son arreglos
   * de objetos comparables mediante igualdad estricta (`===`).
   */
  eliminarCapacidadInstalada(): void {
    if (this.SelectedInstaladaDatos?.length > 0) { 
      this.mostrarEliminarCapacidadInstalada();
      this.SelectedInstaladaDatos.forEach(planta => {
        const INDEX = this.capacidadInstaladaDatos.findIndex(row => row === planta);
        if (INDEX !== -1) {
          this.capacidadInstaladaDatos.splice(INDEX, 1);
        }
      });
      this.capacidadInstaladaDatos = [...this.capacidadInstaladaDatos];
      this.complementarStore.setCapacidadInstaladaDatos(this.capacidadInstaladaDatos);
    }
    else
    {
      this.mostrarEliminarCapacidadInstalada();
    }
  }

  /**
   * Muestra una notificación de advertencia si no se ha seleccionado ningún registro para eliminar.
   * 
   * Esta función configura la propiedad `nuevaNotificacionEliminar` con los detalles de la notificación
   */
  mostrarEliminarCapacidadInstalada(): void {
     this.nuevaNotificacionEliminar = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: this.SelectedInstaladaDatos?.length > 0 ? 'El registro fue eliminado correctamente.':'Debe elegir al menos un registro de Capacidad Instalada para eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
  }
  /**
   * Edita la capacidad instalada seleccionada.
   */
  editarCapacidadInstalada(): void {
    if (this.SelectedInstaladaDatos?.length === 1) {
      const SELECTED = this.SelectedInstaladaDatos[0];
      this.capacidadForm.patchValue({
        fraccionArancelariaProductoTerminado: SELECTED.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO,
        umt: SELECTED.UMT,
        descripcionComercialProductoTerminado: SELECTED.DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO,
        turnos: SELECTED.TURNOS,
        horasPorTurno: SELECTED.HORAS_POR_TURNO,
        cantidadEmpleados: SELECTED.CANTIDAD_EMPLEADOS,
        cantidadMaquinaria: SELECTED.CANTIDAD_MAQUINARIA,
        descripcionMaquinaria: SELECTED.DESCRIPCION_MAQUINARIA,
        capacidadInstaladaMensual: SELECTED.CAPACIDAD_INSTALADA_MENSUAL,
        capacidadInstaladaAnual: SELECTED.CAPACIDAD_INSTALADA_ANUAL,
        calculoCapacidadInstalada: SELECTED.CALCULO_CAPACIDAD_INSTALADA,
        capacidadUtilizadaPct: SELECTED.CAPACIDAD_EFECTIVAMENTE_UTILIZADA
      });

      setTimeout(() => {
        const NATIVE_EL = document.querySelector(
          'app-catalogo-select[formControlName="fraccionArancelariaProductoTerminado"] select'
        ) as HTMLElement | null;
        if (NATIVE_EL) {
          NATIVE_EL.focus();
        }
      }, 0);
      this.editingIndex = this.capacidadInstaladaDatos.findIndex(row => row === SELECTED);
    }
    else if (!this.SelectedInstaladaDatos || this.SelectedInstaladaDatos.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir un registro de complemento para actualizar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
}

}