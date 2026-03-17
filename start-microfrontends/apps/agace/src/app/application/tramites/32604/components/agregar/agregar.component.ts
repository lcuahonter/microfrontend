import { CommonModule } from '@angular/common';

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery} from '@ng-mf/data-access-user';

import { Aduanas, Instalaciones } from '../../constants/agregar.model';
import { ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO } from '../../constants/empresas-comercializadoras.enum';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';

import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Domicilios } from '../../models/empresas-comercializadoras.model';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, TablaDinamicaComponent, ReactiveFormsModule],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.scss',
})
export class AgregarComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la selección de aduana.
   */
  form!: FormGroup;

  /**
   * Lista de aduanas.
   */
  aduanaList: {
    catalogos: Aduanas[];
    labelNombre: string;
    primerOpcion: string;
  };

    /**
   * Sujeto para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

    /**
   * Referencia a la clase o enumeración `TablaSeleccion`.
   *
   * Esta propiedad se utiliza para acceder a las funcionalidades
   * o valores definidos en `TablaSeleccion` dentro del componente.
   */
  TablaSeleccion = TablaSeleccion;

    /**
   * Define los datos que se mostrarán en la tabla dinámica.
   * Inicialmente vacío, se poblará cuando se seleccione una aduana.
   */
  datosTabla: Instalaciones[] = [];

  /**
   * Indica si se ha seleccionado una aduana.
   * Se utiliza para controlar la visibilidad de la tabla.
   */
  aduanaSeleccionada: boolean = false;

  /**
   * Encabezado de la tabla para el manifiesto de contenedores.
   * 
   * Esta propiedad almacena la configuración de los encabezados que se mostrarán
   * en la tabla del manifiesto dentro del componente. Utiliza la constante
   * `ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO` para definir las columnas y sus
   * respectivos títulos.
   */
  public encabezadoDeTablaManifiesto = ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO;

  /**
   * Array para almacenar los datos seleccionados de la tabla
   */
  datosTablaSeleccionados: Instalaciones[] = [];

  /**
   * Mensaje de error que se mostrará en el modal
   */
  mensajeError: string = '';

  /**
   * Referencia al modal de error.
   * ViewChild que permite acceder al elemento DOM del modal de error
   * para mostrar mensajes de validación.
   */
  @ViewChild('modalError', { static: false })
  elementoModalError!: ElementRef;

    /**
     * Estado de la solicitud.
     */
    public seccionState!: Solicitud32604State;

  /**
   * Emisor de eventos para enviar datos seleccionados al componente padre
   */
  @Output() datosSeleccionados = new EventEmitter<Instalaciones[]>();

  /**
   * Emisor de eventos para notificar al componente padre que debe cerrar el modal
   */
  @Output() cerrarModalEvento = new EventEmitter<void>();

  /**
   * Datos existentes de domicilios para verificar duplicados
   */
  @Input() domiciliosExistentes: Domicilios[] = [];

  constructor(
    public fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    this.aduanaList = {
      catalogos: [],
      labelNombre: 'Entidad federativa',
      primerOpcion: 'Seleccione una opción',
    };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectSolicitud$` para actualizar el estado de la sección (`seccionState`)
   *   con los datos obtenidos, hasta que se emita la notificación de destrucción (`destroyNotifier$`).
   * - Inicializa el formulario llamando a `inicializeFormulario()`.
   * - Obtiene la lista de entidades llamando a `fetchEntidadList()`.
   */
  ngOnInit(): void {
    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = {
            ...this.seccionState,
            ...seccionState,
          };
        })
      )
      .subscribe();
      this.inicializeFormulario();
      this.fetchEntidadList();
  }
  
  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Completa el sujeto destroyNotifier$ para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario reactivo para el componente.
   * 
   * Crea un nuevo formulario utilizando FormBuilder y asigna el valor inicial del campo 'aduana'
   * a partir del estado actual de la sección (`seccionState.aduana`).
   * También añade validadores requeridos para el campo aduana.
   * 
   * @returns {void} No retorna ningún valor.
   */
    inicializeFormulario(): void {
    this.form = this.fb.group({
      aduana: [this.seccionState.aduana, [Validators.required]]
    });
  }
  
  /**
   * Método para cargar la lista de aduanas desde el servicio.
   * 
   * Utiliza el servicio `empresasComercializadorasService` para obtener la lista de aduanas
   * y asigna el resultado a `aduanaList.catalogos`.
   */
  public fetchEntidadList(): void {
    this.empresasComercializadorasService
      .getEntidadList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.aduanaList.catalogos = respuesta.data;
      });
  }

    /**
   * Cargar datos de la tabla.
   *
   * Este método obtiene los datos de la tabla desde el servicio `empresasComercializadorasService`
   * y los almacena en la propiedad `datosTabla`. Utiliza `takeUntil` para cancelar la suscripción
   * cuando el componente se destruye, evitando fugas de memoria.
   *
   * @example
   * // Llamar al método para cargar los datos de la tabla
   * this.cargarDatosDeLaTabla();
   */
  cargarDatosDeLaTabla(): void {
    this.empresasComercializadorasService
      .getDatosTableData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosTabla = data;
        this.aduanaSeleccionada = true;
      });
  }

  /**
   * Maneja el evento de cambio de selección de aduana.
   * Cuando se selecciona una aduana, carga los datos de la tabla.
   *
   * @param {Catalogo} selectedAduana - La aduana seleccionada
   */
  onAduanaSelectionChange(selectedAduana: Catalogo): void {
    if (selectedAduana) {
      // Una aduana fue seleccionada, cargar los datos de la tabla
      this.cargarDatosDeLaTabla();
    } else {
      // No hay selección válida, limpiar la tabla
      this.datosTabla = [];
      this.aduanaSeleccionada = false;
    }
  }

  /**
   * Maneja eventos de selección de filas de la tabla
   * @param datosSeleccionados - Array de filas seleccionadas de la tabla
   */
  onTableRowSelected(datosSeleccionados: Instalaciones[]): void {
    this.datosTablaSeleccionados = datosSeleccionados;
  }

  /**
   * Verifica si alguno de los registros seleccionados ya existe en los datos guardados
   * @param datosSeleccionados - Array de instalaciones seleccionadas
   * @returns Array de registros duplicados encontrados
   */
  verificarDuplicados(datosSeleccionados: Instalaciones[]): Instalaciones[] {
    const DUPLICADOS: Instalaciones[] = [];
    
    datosSeleccionados.forEach(instalacion => {
      // Buscar si ya existe un domicilio con los mismos datos clave
      const EXISTE_DUPLICADO = this.domiciliosExistentes.some(domicilio => 
        domicilio.entidadFederativa === instalacion.entidadFederativa &&
        domicilio.municipioDelegacion === instalacion.municipio &&
        domicilio.direccion === instalacion.coloniaCalleNumero &&
        domicilio.codigoPostal === instalacion.codigoPostal
      );
      
      if (EXISTE_DUPLICADO) {
        DUPLICADOS.push(instalacion);
      }
    });
    
    return DUPLICADOS;
  }

  /**
   * Método público para verificar duplicados usado en el template
   * @returns true si hay registros duplicados
   */
  tieneRegistrosDuplicados(): boolean {
    return this.verificarDuplicados(this.datosTablaSeleccionados).length > 0;
  }

  /**
   * Maneja el clic del botón "Aceptar"
   * Valida el formulario y los datos seleccionados antes de emitir al componente padre y cerrar el modal
   */
  cerrarModal(): void {
    // Siempre validar si hay datos seleccionados primero
    if (!this.datosTablaSeleccionados || this.datosTablaSeleccionados.length === 0) {
      this.mostrarModalError('Seleccione un registro.');
      return;
    }

    // Validar formulario
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Verificar registros duplicados
    const DUPLICADOS = this.verificarDuplicados(this.datosTablaSeleccionados);
    if (DUPLICADOS.length > 0) {
      // Mostrar mensaje de error específico para duplicados
      this.mostrarModalError('Los registros seleccionados ya han sido agregados anteriormente. Por favor, seleccione registros diferentes.');
      return;
    }

    // Si todas las validaciones pasan, emitir datos y notificar cierre de modal
    this.datosSeleccionados.emit(this.datosTablaSeleccionados);
    this.datosTablaSeleccionados = [];
    
    // Notificar al componente padre para cerrar el modal
    this.cerrarModalEvento.emit();
  }

  /**
   * Maneja el clic del botón "Cancelar"
   * Reinicia los datos seleccionados y cierra el modal sin emitir datos
   */
  cancelarModal(): void {
    this.datosTablaSeleccionados = [];
  }

  /**
   * Reinicia el estado del componente cuando se abre el modal
   */
  resetModalState(): void {
    this.datosTablaSeleccionados = [];
    this.aduanaSeleccionada = false;
    this.datosTabla = [];
    this.form.reset();
  }

  /**
   * Muestra el modal de error con el mensaje especificado.
   * @param mensaje El mensaje de error a mostrar en el modal
   */
  private mostrarModalError(mensaje: string): void {
    this.mensajeError = mensaje;
    
    if (this.elementoModalError) {
      const MODAL_INSTANCIA = new Modal(this.elementoModalError.nativeElement, {
        backdrop: true,
        keyboard: true,
        focus: true
      });
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Cierra el modal de error.
   */
  private cerrarModalError(): void {
    if (this.elementoModalError) {
      const MODAL_INSTANCIA = Modal.getInstance(this.elementoModalError.nativeElement);
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
  }
}
