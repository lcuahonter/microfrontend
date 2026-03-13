import { CommonModule } from '@angular/common';

import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, REGEX_SOLO_NUMEROS } from '@libs/shared/data-access-user/src';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { CrossListLable } from '@libs/shared/data-access-user/src';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';

import { TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { CROSLISTA_DE_PAISES } from '../../constantes/datos-producto.enum';
import { DATOS_PRODUCTO } from '../../constantes/datos-scian.enum';
import { SCIAN_DATA } from '../../constantes/datos-scian.enum';

import { DatosProducto } from '../../../shared/models/datos-modificacion.model';
import { PreOperativo } from '../../../shared/models/datos-modificacion.model';
import { ScianData } from '../../../shared/models/datos-modificacion.model';


import { DomicilioState } from '../../estados/stores/domicilio.store';

import { DomicilioStore } from '../../estados/stores/domicilio.store';

import { DomicilioQuery } from '../../../shared/estados/queries/domicilio.query';

import { DatosService } from '../../../shared/services/datos.service';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipDirective } from "ngx-bootstrap/tooltip";

/**
 * Componente que gestiona el formulario y las interacciones relacionadas con el domicilio del establecimiento.
 */
@Component({
  selector: 'app-domicilio-del-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    CrosslistComponent,
    TooltipDirective
],
  templateUrl: './domicilio-del-establecimiento.component.html',
  styleUrls: ['./domicilio-del-establecimiento.component.scss'],
})
export class DomicilioDelEstablecimientoComponent implements OnInit, OnDestroy {
 defaultSelect: string = 'Si';
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se ha seleccionado un establecimiento.
   */
  establecimientoSeleccionado: boolean = false;
  /**
   * Referencia a los componentes Crosslist.
   */
  @ViewChild(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: DomicilioState;
  /**
   * Formulario reactivo para capturar los datos del domicilio.
   */
  domicilioForm!: FormGroup;

  /**
   * Formulario reactivo para capturar la clave y descripción SCIAN.
   */
  claveScianForm!: FormGroup;

  /**
   * Formulario reactivo para capturar los datos de mercancía.
   */
  DatosMercanciaForm!: FormGroup;

  /**
   * Lista de estados cargados dinámicamente.
   */
  datosEstado: Catalogo[] = [];

  /**
   * Lista de claves SCIAN cargadas dinámicamente.
   */
  claveScian: Catalogo[] = [];

  /**
   * Opciones de radio cargadas dinámicamente.
   */
  radioOptions: PreOperativo[] = [];

  /**
   * Lista de descripciones SCIAN cargadas dinámicamente.
   */
  descripcionScian: Catalogo[] = [];

  /**
   * Lista de clasificaciones de productos cargadas dinámicamente.
   */
  clasificacionProducto: Catalogo[] = [];

  /**
   * Indica si el checkbox "Aviso de funcionamiento" está marcado.
   * Cuando está marcado, el campo "No. de licencia sanitaria" se deshabilita.
   */
  public avisoFuncionamientoChecked: boolean = false;

  /**
   * Notificador para destruir observables relacionados con los servicios.
   */
  private destroy$ = new Subject<void>();

  /**
   * Enum para la selección de tablas.
   */
  tipoSeleccionTabla = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla de datos SCIAN.
   */
  configuracionTabla: ConfiguracionColumna<ScianData>[] = SCIAN_DATA;

  /**
   * Datos cargados dinámicamente para la tabla SCIAN.
   */
  datosData: ScianData[] = [];

  /**
   * Controla la visibilidad de una sección colapsable.
   */
  colapsable: boolean = false;

  /**
   * Lista de países para la selección de origen.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Lista de países para seleccionar el origen de la primera sección.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /**
   * Etiquetas para la lista cruzada de países.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso específico seleccionado*:',
  };

  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[0].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[0].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].quitar('t') },
  ];

  /**
   * Configuración de columnas para la tabla de datos de productos.
   */
  configuracionTablaProductoDatos: ConfiguracionColumna<DatosProducto>[] = DATOS_PRODUCTO.map(col => ({
    ...col,
    clave: (item: DatosProducto): string | number | undefined => {
      const VALUE = col.clave(item);
      return VALUE instanceof Date ? VALUE.toISOString() : VALUE;
    }
  }));

  /**
   * Datos cargados dinámicamente para la tabla de productos.
   */
  datosProducto: DatosProducto[] = [];

  /**
   * Controla la visibilidad del modal.
   */
  public modal: string = 'modal';

  /**
   * Referencia al elemento de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;
  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param datosService Servicio para obtener datos dinámicos.
   * @param domicilioStore Store para gestionar el estado de la solicitud.
   * @param tramite260603Query Query para obtener datos del estado.
   */
  constructor(
    private fb: FormBuilder,
    private datosService: DatosService,
    private domicilioStore: DomicilioStore,
    private domicilioquery: DomicilioQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Constructor
  }

  /**
   * Método del ciclo de vida de Angular que inicializa el componente.
   */
  ngOnInit(): void {
    // Restablecer la selección de establecimiento cuando se inicializa el componente (cambio de pestaña)  
    this.domicilioStore.resetEstablecimientoSeleccionado();
    
    this.domicilioquery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    /**
      * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
      *
      * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
      * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
      * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
      */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()

    // Suscríbase al estado de selección de establecimientos
    this.domicilioquery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          const PREV_ESTABLECIMIENTO_SELECCIONADO = this.establecimientoSeleccionado;
          this.establecimientoSeleccionado = state.establecimientoSeleccionado;
          this.solicitudState = state;
          
          // Actualizar el estado del formulario cuando cambie la selección del establecimiento o se inicialicen los formularios.
          if (PREV_ESTABLECIMIENTO_SELECCIONADO !== this.establecimientoSeleccionado || 
              (this.domicilioForm && this.claveScianForm && this.DatosMercanciaForm)) {
            this.updateFormState();
          }
        })
      )
      .subscribe();

    this.cargarEstadoData();
    this.cargarDatosTabla();
    this.cargarDatosProductoTabla();
    this.obtenerDatosClave();
    this.obtenerDatosDescripcion();
    this.obtenerDatosPreOperativo();
    this.obtenerclassificacionProductos();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    this.updateFormState();
  }

  /**
   * Actualiza el estado de los formularios basado en las condiciones actuales.
   */
  updateFormState(): void {
    // Gestiona el modo de solo lectura por separado; si es de solo lectura, deshabilita todo.
    if (this.esFormularioSoloLectura) {
      this.domicilioForm?.disable();
      this.claveScianForm?.disable();
      this.DatosMercanciaForm?.disable();
      return;
    }

    // Manejar la lógica de selección de establecimiento
    if (!this.establecimientoSeleccionado) {
      this.domicilioForm?.disable();
      this.claveScianForm?.disable();
      this.DatosMercanciaForm?.disable();
      
      // Mantenga siempre habilitados estos campos específicos (independientemente de la selección del establecimiento).
      this.domicilioForm?.get('autorizacionIVAIEPS')?.enable();
      this.domicilioForm?.get('aviso')?.enable();
      
      // Para noLicenciaSanitaria, verificar el estado del checkbox
      if (this.avisoFuncionamientoChecked) {
        this.domicilioForm?.get('noLicenciaSanitaria')?.disable();
      } else {
        this.domicilioForm?.get('noLicenciaSanitaria')?.enable();
      }
    } else {
      this.domicilioForm?.enable();
      this.claveScianForm?.enable();
      this.DatosMercanciaForm?.enable();
      
      // Incluso cuando el establecimiento está seleccionado, mantener la lógica del checkbox
      if (this.avisoFuncionamientoChecked) {
        this.domicilioForm?.get('noLicenciaSanitaria')?.disable();
      }
    }
  }

  /**
  * Inicializa el formulario reactivo para capturar el valor de 'registro'.
  * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
  * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
  * con el valor inicial obtenido del store.
  */

  inicializarFormulario(): void {
    this.domicilioForm = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal, [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS),]],
      estado: [this.solicitudState?.estado, Validators.required],
      municipio: [this.solicitudState?.municipio, Validators.required],
      localidad: [this.solicitudState?.localidad, [Validators.required]],
      colonia: [this.solicitudState?.colonia, [Validators.required]],
      calle: [this.solicitudState?.calle, [Validators.required, Validators.maxLength(300)]],
      lada: [this.solicitudState?.lada, [Validators.pattern(REGEX_SOLO_NUMEROS)]],
      telefono: [this.solicitudState?.telefono, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(24)]],
      scian: [this.solicitudState?.scian],
      aviso: [this.solicitudState?.aviso],
      noLicenciaSanitaria: [this.solicitudState?.noLicenciaSanitaria, Validators.required],
      regimenDestinado: [this.solicitudState?.regimenDestinado, Validators.required],
      aduana: [this.solicitudState?.aduana, Validators.required],
      datosProducto: [this.solicitudState?.datosProducto, Validators.required],
      autorizacionIVAIEPS: [this.solicitudState?.autorizacionIVAIEPS, Validators.required],
    });

    this.claveScianForm = this.fb.group({
      claveScian: [this.solicitudState?.claveScian, Validators.required],
      descripcionScian: [this.solicitudState?.descripcionScian, Validators.required],
    });

    this.DatosMercanciaForm = this.fb.group({
      clasificacionProducto: [this.solicitudState?.clasificacionProducto, Validators.required],
      especificarClasificacion: [this.solicitudState?.especificarClasificacion, Validators.required],
      marcaComercial: [this.solicitudState?.marcaComercial, Validators.required],
      denominacionGenerica: [this.solicitudState?.denominacionGenerica, Validators.required],
      tipoProducto: [this.solicitudState?.tipoProducto, Validators.required],
      estadoFisico: [this.solicitudState?.estadoFisico, Validators.required],
      fraccionArancelaria: [this.solicitudState?.fraccionArancelaria, Validators.required],
      descripcionFraccionArancelaria: [{ value: this.solicitudState?.descripcionFraccionArancelaria, disabled: true }, Validators.required],
      cantidadUMC: [this.solicitudState?.cantidadUMC, Validators.required],
      umc: [this.solicitudState?.umc, Validators.required],
      porcentajeConcentracion: [this.solicitudState?.porcentajeConcentracion, Validators.required],
      valorComercial: [this.solicitudState?.valorComercial, Validators.required],
      fechaMovimiento: [{ value: this.solicitudState?.fechaMovimiento, disabled: true }, Validators.required],
      presentacionFarmaceutica: [this.solicitudState?.presentacionFarmaceutica, Validators.required],
      paisDestino: [this.solicitudState?.paisDestino, Validators.required],
      paisProcedencia: [this.solicitudState?.paisProcedencia, Validators.required],
    });

    this.avisoFuncionamientoChecked = Boolean(this.domicilioForm.get('aviso')?.value);


    this.updateFormState();
  }

  /**
    * Actualiza el estado del store con los valores del formulario.
    * @param form Formulario reactivo.
    * @param campo Campo del formulario.
    * @param metodoNombre Método del store a invocar.
    */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DomicilioStore): void {
    const VALOR = form.get(campo)?.value;
    (this.domicilioStore[metodoNombre] as (value: string | number) => void)(VALOR);
  }

  /**
   * Alterna la visibilidad de la sección colapsable.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Habilita o deshabilita el campo "No Licencia Sanitaria" según el estado del checkbox.
   * @param event Evento del checkbox.
   */
  toggleNoLicenciaSanitaria(event: Event): void {
    this.avisoFuncionamientoChecked = (event.target as HTMLInputElement).checked;
    const NO_LICENCIA_SANITARIA = this.domicilioForm.get('noLicenciaSanitaria');

    if (this.avisoFuncionamientoChecked) {
      NO_LICENCIA_SANITARIA?.disable();
      NO_LICENCIA_SANITARIA?.setValue(''); 
    } else {

      if (!this.esFormularioSoloLectura && (this.establecimientoSeleccionado || !this.establecimientoSeleccionado)) {
        NO_LICENCIA_SANITARIA?.enable();
      }
    }
  }

  /**
   * Carga los datos de los estados desde el servicio.
   */
  cargarEstadoData(): void {
    this.datosService
      .obtenerEstadoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.datosEstado = resp;
      });
  }

  /**
   * Carga los datos de la tabla SCIAN desde el servicio.
   */
  cargarDatosTabla(): void {
    this.datosService
      .obternerDatosData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.datosData = resp;
      });
  }

  /**
   * Carga los datos de la tabla de productos desde el servicio.
   */
  cargarDatosProductoTabla(): void {
    this.datosService
      .obtenerDatosProducto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.datosProducto = resp;
      });
  }

  /**
   * Carga las claves SCIAN desde el servicio.
   */
  obtenerDatosClave(): void {
    this.datosService
      .obtenerClaveScian()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.claveScian = resp;
      });
  }

  /**
   * Carga las descripciones SCIAN desde el servicio.
   */
  obtenerDatosDescripcion(): void {
    this.datosService
      .obtenerDescripcionScian()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.descripcionScian = resp;
      });
  }

  /**
   * Carga las opciones de radio desde el servicio.
   */
  obtenerDatosPreOperativo(): void {
    this.datosService
      .obtenerPreOperativo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.radioOptions = resp;
      });
  }

  /**
   * Carga las clasificaciones de productos desde el servicio.
   */
  obtenerclassificacionProductos(): void {
    this.datosService
      .obtenerClasificationProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.clasificacionProducto = resp;
      });
  }

  /**
   * Muestra el modal para la clave SCIAN.
   */
  public mostrarModeloClave(): void {
    this.modal = 'show'; // Muestra el modal
  }

  /**
   * Muestra el modal para los datos del producto.
   */
  public datosDelProducto(): void {
    this.modal = 'show';
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.domicilioForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }


  /**
   * Método del ciclo de vida de Angular que destruye el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}