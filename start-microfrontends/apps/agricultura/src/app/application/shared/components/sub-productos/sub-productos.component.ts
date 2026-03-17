import { CONFIGURACION_DETALLAS_DATOS, FECHA_DE_DATA } from '../../constantes/datos-de-la-solicitue.enum';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, InputRadioComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DetallasDatos, ProductoDetallaEventos, ProductosCatalogosDatos } from '../../models/datos-de-la-solicitue.model';
import { FilaSolicitud, FraccionArancelariaDecripcionModel } from '../../../tramites/220201/models/220201/capturar-solicitud.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CommonModule } from '@angular/common';
import { RadioOpcion } from '../../../tramites/220202/models/220202/fitosanitario.model';
import { RegistroSolicitudService } from '../../../tramites/220201/services/220201/registro-solicitud/registro-solicitud.service';
import { Subject } from 'rxjs';

import { CatalogosService } from '../../../tramites/220201/services/220201/catalogos/catalogos.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


/**
 * Decorador que define un componente de Angular.
 * 
 * Este componente es independiente (`standalone`) y puede ser utilizado sin necesidad de declararlo
 * en un módulo. Está diseñado para gestionar y mostrar información relacionada con subproductos.
 * 
 * @selector `app-sub-productos` - Selector utilizado para instanciar este componente en una plantilla HTML.
 * 
 * @standalone `true` - Indica que este componente es independiente y no requiere ser declarado en un módulo.
 * 
 * @imports - Lista de módulos y componentes importados que son necesarios para el funcionamiento de este componente:
 * - `CommonModule`: Proporciona directivas y servicios comunes de Angular.
 * - `CatalogoSelectComponent`: Componente personalizado para seleccionar elementos de un catálogo.
 * - `TituloComponent`: Componente personalizado para mostrar títulos.
 * - `ReactiveFormsModule`: Módulo para trabajar con formularios reactivos en Angular.
 * - `TablaDinamicaComponent`: Componente personalizado para mostrar tablas dinámicas.
 * - `InputRadioComponent`: Componente personalizado para manejar botones de radio.
 * 
 * @templateUrl `./sub-productos.component.html` - Ruta al archivo de plantilla HTML que define la estructura visual del componente.
 * 
 * @styleUrl `./sub-productos.component.scss` - Ruta al archivo de estilos SCSS que define la apariencia del componente.
 */
@Component({
  selector: 'app-sub-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent, TooltipModule,
  ],
  templateUrl: './sub-productos.component.html',
  styleUrl: './sub-productos.component.scss',
})
export class SubProductosComponent implements OnInit, OnDestroy {
  fechaInicioInput: InputFecha = FECHA_DE_DATA;
  /**
   * Representa el formulario reactivo utilizado para gestionar los datos de la mercancía
   * en el componente de detalles de animales vivos.
   * 
   * @type {FormGroup}
   */
  productosForm!: FormGroup;

  /**
   * Configuración de las columnas de la tabla que muestra los detalles de los datos sensibles.
   * Utiliza un arreglo de tipo `ConfiguracionColumna<DetallasDatos>` para definir las propiedades
   * y características de cada columna en la tabla.
   * 
   * @type {ConfiguracionColumna<DetallasDatos>[]}
   */
  public configuracionDetallasDatosTabla: ConfiguracionColumna<DetallasDatos>[] = CONFIGURACION_DETALLAS_DATOS;

  /**
     * Arreglo que almacena los detalles de los datos sensibles ingresados en el formulario.
     * Cada elemento es un objeto de tipo `DetallasDatos` que contiene información específica
     * sobre los animales vivos, como número de lote, fechas de producción, etc.
     * 
     * @type {DetallasDatos[]}
     */
  public detallasDatosTablaDatos: DetallasDatos[] = [];

  /**
     * Arreglo que almacena los detalles de los datos sensibles ingresados en el formulario.
     * Cada elemento es un objeto de tipo `DetallasDatos` que contiene información específica
     * sobre los animales vivos, como número de lote, fechas de producción, etc.
     * 
     * @type {DetallasDatos[]}
     */
  public detallasDatosTablaSeleccionada: DetallasDatos[] = [];
  /**
   * Representa el formulario reactivo utilizado para gestionar los detalles específicos
   * de los animales vivos, como número de lote, color de pelaje, edad, etc.
   * 
   * @type {FormGroup}
   */
  detalleForm!: FormGroup;

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
   * Datos de la solicitud que se recibirán como entrada en el componente.
   * 
   * @type {ProductosCatalogosDatos}
   */
  @Input() catalogosDatos!: ProductosCatalogosDatos;

  /**
   * Opciones para el botón de radio.
   * @property {RadioOpcion[]} opcionDeBotonDeRadio
   */
  opcionDeBotonDeRadio: RadioOpcion[] = [
    {
      "label": "No",
      "value": "no"
    },
    {
      "label": "Sí",
      "value": "si"
    },
  ];

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es true, los campos del formulario no serán editables por el usuario.
   * 
   * @type {boolean}
   */
  public tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
     * Evento que se emite cuando se agregan datos al formulario de solicitud de animales vivos.
     * Este evento permite al componente padre recibir los datos del formulario para su procesamiento.
     * 
     * @type {EventEmitter<ProductoDetallaEventos>}
     */
  @Output() agregarDatosFormulario = new EventEmitter<ProductoDetallaEventos>();
  /**
   * Datos del formulario de solicitud de animales vivos.
   * Este objeto contiene la información relacionada con la solicitud de animales vivos,
   * como los detalles de la mercancía y los datos específicos de los animales.
   * 
   * @type {AnimalesFormularioSolicitud}
   */
  @Input() formularioSolicitud!: FilaSolicitud;
  @Output() cerrar = new EventEmitter<void>();


  /**
   * Configuración de las columnas sensibles para la tabla de sub-productos.
   * Utiliza la configuración definida en `CONFIGURACION_DETALLAS_DATOS` para
   * mostrar los datos detallados de los sub-productos en la interfaz.
   *
   * @type {ConfiguracionColumna<DetallasDatos>[]}
   * @see CONFIGURACION_DETALLAS_DATOS
   */
  public configuracionSensiblesTabla: ConfiguracionColumna<DetallasDatos>[] = CONFIGURACION_DETALLAS_DATOS;


  /**
   * Lista de objetos de tipo `DetallasDatos` que contiene los datos detallados
   * para mostrar en la tabla de sub-productos.
   * 
   * @remarks
   * Este input permite recibir desde el componente padre la información
   * necesaria para renderizar los detalles en la tabla.
   */
  @Input() detalleTablaDatos: DetallasDatos[] = [];

  /**
   * Arreglo que almacena los detalles seleccionados en la tabla de sub-productos.
   * Cada elemento es un objeto de tipo `DetallasDatos` que representa una fila seleccionada por el usuario.
   * 
   * @type {DetallasDatos[]}
   */
  public detalleTablaDatosSeleccionada: DetallasDatos[] = [];

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion | null;

  /**
   * Guarda el tipo de proceso que se eligió y de acuerdo a lo elegido se tomá decision en el modal.
   */
  public procesoModal!: string;

  /**
   * Obtiene el grupo de formulario 'datosServicio' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'datosServicio'.
   */
  get datosServicio(): FormGroup {
    return this.detalleForm?.get('detalleForm') as FormGroup;
  }

  @Input() cantidadRegistros: number = 0;

  /**
   * Constructor del componente.
   * 
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param ubicaccion - Servicio de ubicación para navegar entre páginas.
   */
  constructor(
    private fb: FormBuilder,
    private registroSolicitudService: RegistroSolicitudService,
    private catalogoService: CatalogosService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se crea el formulario reactivo y se configuran los campos necesarios.
   */
  ngOnInit(): void {
    this.crearFormulario();
  }


  /**
   * Crea y configura los formularios reactivos `productosForm` y `detalleForm` 
   * utilizados en el componente para gestionar los datos relacionados con 
   * productos y detalles específicos.
   * 
   * El formulario `productosForm` incluye los siguientes campos:
   * - `tipoRequisito`: Campo obligatorio para especificar el tipo de requisito.
   * - `requisito`: Campo obligatorio para definir el requisito.
   * - `numeroCertificado`: Campo opcional con un máximo de 50 caracteres y que 
   *   solo permite caracteres alfanuméricos.
   * - `fraccionArancelaria`: Campo obligatorio para la fracción arancelaria.
   * - `descripcionFraccion`: Campo opcional para la descripción de la fracción.
   * - `nico`: Campo obligatorio para el NICO (Número de Identificación Comercial).
   * - `descripcionNico`: Campo opcional para la descripción del NICO.
   * - `descripcion`: Campo opcional con un máximo de 1000 caracteres y que solo 
   *   permite caracteres alfanuméricos.
   * - `cantidadUMT`: Campo opcional que acepta un número con hasta 12 dígitos 
   *   enteros y 3 decimales.
   * - `umt`: Campo obligatorio que está deshabilitado inicialmente.
   * - `cantidadUMC`: Campo opcional que acepta un número con hasta 12 dígitos 
   *   enteros y 3 decimales.
   * - `umc`: Campo obligatorio para la unidad de medida comercial.
   * - `especie`: Campo obligatorio para especificar la especie.
   * - `uso`: Campo obligatorio para definir el uso.
   * - `paisOrigen`: Campo obligatorio para el país de origen.
   * - `paisDeProcedencia`: Campo obligatorio para el país de procedencia.
   * - `presentacion`: Campo opcional para la presentación del producto.
   * - `cantidadPresentacion`: Campo opcional para la cantidad en la presentación.
   * - `tipoPresentacion`: Campo opcional para el tipo de presentación.
   * - `tipoPlanta`: Campo opcional para el tipo de planta.
   * - `plantaAutorizadaOrigen`: Campo opcional para la planta autorizada de origen.
   * 
   * El formulario `detalleForm` incluye los siguientes campos:
   * - `numeroLote`: Campo opcional con un máximo de 16 caracteres y que solo 
   *   permite caracteres alfanuméricos.
   * - `rangoDeFecha`: Campo opcional para especificar un rango de fechas.
   * 
   * Este método inicializa ambos formularios con sus respectivos validadores 
   * para garantizar la integridad de los datos ingresados.
   */
  crearFormulario(): void {
    this.productosForm = this.fb.group({
      id: [0, Validators.required],
      noPartida: [''],
      tipoRequisito: ['', Validators.required],
      requisito: ['', Validators.required],
      numeroCertificadoInternacional: ['', [Validators.required,Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      fraccionArancelaria: ['', Validators.required],
      descripcionFraccion: ['', Validators.required],
      nico: ['', Validators.required],
      descripcionNico: ['', Validators.required],
      descripcion: ['', [Validators.required,Validators.maxLength(1000), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      umt: ['', Validators.required],
      cantidadUMT: ['', [Validators.required,Validators.maxLength(16), Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      umc: ['', Validators.required],
      cantidadUMC: ['', [Validators.required,Validators.maxLength(16),Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      uso: ['', Validators.required],
      tipoDeProducto: [''],
      numeroDeLote: [''],
      paisDeOrigen: ['', Validators.required],
      paisDeProcedencia: ['', Validators.required],
      certificadoInternacionalElectronico: [''],
      especie: ['', Validators.required],
      tipoPresentacion: [''],
      tipoPlanta: [''],
      plantaAutorizadaOrigen: [''],
      presentacion: [''],
      cantidadPresentacion: [],
      detalleProductos: this.fb.array([]),
      clave_fraccion: [''],
      clave_umt: [''],
      modificado: [false],
      id_tipoPlanta: [''],
      id_tipo_presentacion: [''],
      id_planta_autorizada: ['']
    });

    this.detalleForm = this.fb.group({
      numeroLote: ['', [Validators.required, Validators.maxLength(16), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      rangoDeFecha: ['si'],
      procesoStart: [''],
      procesoEnd: [''],
      sacrificio: [''],
      sacrificioEnd: [''],
      caducidad: [''],
      caducidadEnd: [''],
      fechaElaboracionEmpaqueProceso: [null],
      fechaProduccionSacrificio: [''],
      fechaCaducidadProducto: [''],
      fechaFinElaboracionEmpaqueProceso: [''],
      fechaFinProduccionSacrificio: [''],
      fechaFinCaducidadProducto: ['']

    });
    if (this.formularioSolicitud) {
      this.productosForm.patchValue({
        ...this.formularioSolicitud
      });
    }
    if (this.formularioSolicitud) {
      this.detalleTablaDatos = [...(this.formularioSolicitud.detalleProductos || [])];
      this.plantaAutorizadaOrigen();
    }

  }

  /**
* Maneja la selección del botón de radio y actualiza el store.
* @method radioBotonSeleccionado
*/
  radioBotonSeleccionado(): void {
    const VALOR = this.detalleForm.value.rangoDeFecha;
    this.detalleForm.patchValue({
      rangoDeFecha: VALOR ? VALOR : ''
    });
  }

  /**
* Navega a la ubicación anterior en el historial de navegación.
* Utiliza el servicio de ubicación para retroceder una página.
*/
  cancelar(): void {
    this.productosForm.reset();
    this.detalleForm.reset();
    this.cerrar.emit();
  }

  /**
   * Agrega los productos al formulario y emite un evento con los datos.
   * 
   * Este método recopila los valores actuales del formulario `productosForm` y los detalles
   */
  // eslint-disable-next-line complexity
  agregarProductos(): void {
    const FUEMODIFICADO = this.productosForm.get('modificado')?.value as boolean;
    const DETALLE_PRODUCTOS_ARRAY = this.productosForm.get('detalleProductos') as FormArray;

    if (FUEMODIFICADO) {
      this.productosForm.reset();
      this.detalleForm.reset();
      this.detalleTablaDatos = [];
    }

    if (this.productosForm.invalid) {
      this.productosForm.markAllAsTouched();
    }
    else {

      // Formatea cantidadUMC a dos decimales si es un número válido
      let cantidadUMCValue = this.productosForm.get('cantidadUMC')?.value || '';
      if (cantidadUMCValue !== '' && !isNaN(Number(cantidadUMCValue))) {
        cantidadUMCValue = Number(cantidadUMCValue).toFixed(2);
      }
      DETALLE_PRODUCTOS_ARRAY.clear();
      this.detalleTablaDatos.forEach(detalle => {
        DETALLE_PRODUCTOS_ARRAY.push(this.fb.group(detalle));
      });

      // Construye el objeto FilaSolicitud a partir de los valores del formulario
      const NUEVOS_SENSIBLES: FilaSolicitud = {
        ...this.productosForm.getRawValue(),
        noPartida: FUEMODIFICADO ? this.productosForm.get('noPartida')?.value : this.cantidadRegistros + 1,
        descripcionTipoRequisito: this.catalogosDatos.tipoRequisitoList.find(item => item.clave === this.productosForm.get('tipoRequisito')?.value)?.descripcion || '',
        descripcionEspecie: this.catalogosDatos.especieList.find(item => item.clave === this.productosForm.get('especie')?.value)?.descripcion || '',
        descripcionUso: this.catalogosDatos.usoList.find(item => item.clave === this.productosForm.get('uso')?.value)?.descripcion || '',
        descripcionPaisDeOrigen: this.catalogosDatos.paisOrigenList.find(item => item.clave === this.productosForm.get('paisDeOrigen')?.value)?.descripcion || '',
        descripcionPaisDeProcedencia: this.catalogosDatos.paisDeProcedenciaList.find(item => item.clave === this.productosForm.get('paisDeProcedencia')?.value)?.descripcion || '',
        descripcionNico:  this.productosForm.get('descripcionNico')?.value || '',
        descripcionFraccion: this.productosForm.get('descripcionFraccion')?.value || '',
        descripcion_fracción_arancelaria: this.productosForm.get('fraccionArancelaria')?.value || '',
        descripcionUMT: this.catalogosDatos.umtList.find(item => item.clave === this.productosForm.get('umt')?.value)?.descripcion || '',
        descripcionUMC: this.catalogosDatos.umcList.find(item => item.clave === this.productosForm.get('umc')?.value)?.descripcion || '',
        tipoPresentacion: this.productosForm.get('tipoPresentacion')?.value || '',
        tipoPlanta: this.catalogosDatos.tipoPlantaList.find(item => item.clave === this.productosForm.get('tipoPlanta')?.value)?.descripcion || '',
        id_tipo_planta: this.productosForm.get('tipoPlanta')?.value || '',
        id_tipo_presentacion: this.productosForm.get('tipoPresentacion')?.value || '',
        id_planta_autorizada: this.productosForm.get('plantaAutorizadaOrigen')?.value || '',
        descripcion_planta_autorizada: this.catalogosDatos.plantaAutorizadaOrigenList.find(item => item.clave === this.productosForm.get('plantaAutorizadaOrigen')?.value)?.descripcion || '',
        descr: this.catalogosDatos.tipoPlantaList.find(item => item.clave === this.productosForm.get('tipoPlanta')?.value)?.clave || '',
        plantaAutorizadaOrigen: this.catalogosDatos.plantaAutorizadaOrigenList.find(item => item.clave === this.productosForm.get('plantaAutorizadaOrigen')?.value)?.descripcion || '',
        descripcion_tipo_planta: this.catalogosDatos.tipoPlantaList.find(item => item.clave === this.productosForm.get('tipoPlanta')?.value)?.descripcion || '',
        tipoPresentacionDescripcion: this.catalogosDatos.tipoPresentacionList.find(item => item.clave === this.productosForm.get('tipoPresentacion')?.value)?.descripcion || '',
        cantidadUMC: cantidadUMCValue,
        modificado: FUEMODIFICADO || this.cantidadRegistros > 0 ? true : false,
        fraccionArancelaria: this.productosForm.get('fraccionArancelaria')?.value || '',
        descripcion_nico: this.catalogosDatos.nicoList.find(item => item.clave === this.productosForm.get('nico')?.value)?.descripcion || '',
        nico: this.productosForm.get('nico')?.value || '',
        umt: this.productosForm.get('clave_umt')?.value || '',
        umc: this.productosForm.get('umc')?.value || '',
        detalleProductos: this.detalleTablaDatos,
        cantidadPresentacion: this.productosForm.get('cantidadPresentacion')?.value || '',
        presentacion: this.productosForm.get('presentacion')?.value || '',
        descripcion: this.productosForm.get('descripcion')?.value || '',
        id_fraccion_gubernamental: this.productosForm.get('clave_fraccion')?.value || ''
      };
      // Si no hay selección, agrega normalmente
      this.agregarDatosFormulario.emit(
        {
          formulario: NUEVOS_SENSIBLES,
          detallasDatosTablaDatos: this.detalleTablaDatos
        }
      );

      this.cerrar.emit();
    }
  }

  /**
 * Limpia los datos relacionados con los animales vivos.
 * 
 * Este método vacía el arreglo `sensiblesTablaDatos` y reinicia el formulario `mercanciaForm`,
 * dejando ambos en su estado inicial. Útil para restablecer el formulario y los datos de la tabla
 * cuando se requiere comenzar una nueva operación o descartar los cambios actuales.
 */
  limpiarAnimalesVivo(): void {
    this.productosForm.reset();
    this.detalleForm.reset();
    this.detallasDatosTablaDatos = [];
    this.detalleForm.get('rangoDeFecha')?.setValue('si');
    this.productosForm.get('modificado')?.setValue(false);
  }

  /**
   * Agrega un nuevo detalle a la tabla de datos.
   * Este método crea un nuevo objeto `DetallasDatos` a partir del formulario `detalleForm`
   * y lo agrega al arreglo `detallasDatosTablaDatos`.
   */
  eliminarDetalle(): void {
    this.detallasDatosTablaDatos = [];
  }


  /**
   * Agrega un nuevo detalle a la tabla de datos y reinicia el formulario de detalles.
   * 
   * Este método crea un objeto de tipo `DetallasDatos` utilizando los valores del formulario
   * `detalleForm` y lo agrega al arreglo `detallasDatosTablaDatos`. Posteriormente, reinicia
   * el formulario para que esté listo para ingresar nuevos datos.
   * 
   * @remarks
   * - Las propiedades de fecha en el objeto `DetallasDatos` se inicializan como cadenas vacías.
   * - Este método asume que `detalleForm` está correctamente configurado con los controles necesarios.
   * 
   * @example
   * // Ejemplo de uso:
   * this.agregarDetalle();
   * 
   * @returns {void} Este método no devuelve ningún valor.
   */
  agregarDetalle(): void {
    const VALOR: DetallasDatos = {
      numeroDeLote: this.detalleForm.value.numeroLote,
      fechaElaboracionEmpaqueProceso: '',
      fechaProduccionSacrificio: '',
      fechaCaducidadProducto: '',
      fechaFinElaboracionEmpaqueProceso: '',
      fechaFinProduccionSacrificio: '',
      fechaFinCaducidadProducto: ''
    }
    this.detallasDatosTablaDatos.push(VALOR);
    this.detalleTablaDatos = [...this.detalleTablaDatos, VALOR];
    this.detalleForm.reset();
  }

  /**
     * Actualiza los datos almacenados en el store.
     * @method setValoresStore
     */
  setValoresStoreFraccion(): void {
    const VALOR = this.productosForm.value.fraccionArancelaria;
    this.registroSolicitudService.obtieneFraccionArancelariaDescripcion(220201, VALOR).subscribe(
      (response: BaseResponse<FraccionArancelariaDecripcionModel>) => {
        if (response && response.codigo === '00' && response.datos) {
          this.productosForm.get('descripcionFraccion')?.setValue(response.datos.descripcion);
          this.productosForm.get('clave_fraccion')?.setValue(response.datos.id_fraccion);
        } else {
          this.productosForm.get('descripcionFraccion')?.setValue('');
        }
      }
    );

    this.registroSolicitudService.obtieneUnidadMedida(220201, VALOR).subscribe(
      (response: BaseResponse<Catalogo>) => {
        if (response && response.codigo === '00' && response.datos) {
          this.productosForm.get('clave_umt')?.setValue(response.datos.cve_unidad_medida);          
          this.productosForm.get('umt')?.setValue(response.datos.descripcion);
        } else {
          this.productosForm.get('umt')?.setValue('');
        }
      }
    );

  }

  /**
   * Establece los valores de la descripción del NICO en el formulario de productos
   * utilizando los valores de fracción arancelaria y NICO proporcionados.
   * 
   * Realiza una solicitud al servicio `registroSolicitudService` para obtener
   * la descripción del NICO correspondiente y actualiza el formulario con el
   * resultado. Si no se encuentra una descripción válida, se establece un valor vacío.
   */
  setValoresStoreFraccionNico(): void {
    const VALOR_FRACCION = this.productosForm.value.fraccionArancelaria;
    const VALOR_NICO = this.productosForm.value.nico;
    this.registroSolicitudService.obtieneNicoDescripcion(220201, VALOR_FRACCION, VALOR_NICO).subscribe(
      (response: BaseResponse<Catalogo>) => {
        if (response && response.codigo === '00' && response.datos) {
          this.productosForm.get('descripcionNico')?.setValue(response.datos);
        } else {
          this.productosForm.get('descripcionNico')?.setValue('');
        }
      }
    );
  }


  /**
   * Agrega un nuevo detalle a la tabla de datos utilizando los valores actuales del formulario.
   * 
   * - Crea un objeto `DETALLE` con los valores del formulario, asignando cada campo a su propiedad correspondiente.
   * - Añade el objeto `DETALLE` al arreglo `detalleTablaDatos`.
   * - Reinicia el formulario para permitir la captura de nuevos datos.
   *
   * @remarks
   * Este método se utiliza para registrar los detalles de subproductos en la tabla de datos,
   * asegurando que cada registro provenga de los valores ingresados en el formulario.
   */
  agregarDetalleTablaDatos(): void {
    if (
      this.detalleForm.value.numeroLote === '' ||
      this.detalleForm.value.numeroLote === null
    ) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.detalleForm.get('numeroLote')?.markAsTouched();
      return;
    }

    if (this.detalleForm.value.numeroDeLote !== '') {
      const DETALLE: DetallasDatos = {
        numeroDeLote: this.detalleForm.value.numeroLote,
        fechaElaboracionEmpaqueProceso: this.detalleForm.value.fechaElaboracionEmpaqueProceso,
        fechaProduccionSacrificio: this.detalleForm.value.fechaProduccionSacrificio,
        fechaCaducidadProducto: this.detalleForm.value.fechaCaducidadProducto,
        fechaFinElaboracionEmpaqueProceso: this.detalleForm.value.fechaFinElaboracionEmpaqueProceso,
        fechaFinProduccionSacrificio: this.detalleForm.value.fechaFinProduccionSacrificio,
        fechaFinCaducidadProducto: this.detalleForm.value.fechaFinCaducidadProducto,
      };
      this.detalleTablaDatos = [...this.detalleTablaDatos, DETALLE];
      this.detalleForm.reset();
    }
    this.detalleForm.get('rangoDeFecha')?.setValue('si');
  }


  /**
   * Actualiza el valor de un campo de formulario con una nueva fecha y marca el campo como no modificado.
   * 
   * @param nuevo_valor - El nuevo valor de fecha que se asignará al campo.
   * @param campo - El nombre del campo en el formulario que será actualizado.
   */
  public seleccionaFecha(nuevo_valor: string, campo: string): void {
    this.detalleForm.get(campo)?.setValue(nuevo_valor);
    this.detalleForm.get(campo)?.markAsUntouched();
  }

  /**
   * Elimina todos los elementos del arreglo `detalleTablaDatos`.
   * 
   * Esta función limpia la tabla de detalles, dejando el arreglo vacío.
   */
  eliminarDetalleTablaDatos(items: DetallasDatos[]): void {

    if (!items || items.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona al menos un registro para eliminar.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.detalleTablaDatos = this.detalleTablaDatos.filter(detalle => !items.includes(detalle));
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de destruir el componente.
   * Emite una señal a través del observable `destroy$` para notificar a los suscriptores que deben limpiar recursos y cancelar suscripciones.
   * Posteriormente, completa el observable para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Maneja la confirmación de acciones en un modal según el proceso actual.
   * 
   * @param confirmar - Indica si se confirma la acción (true) o se cancela (false).
   */
  confirmacionModal(confirmar: boolean): void {
    switch (this.procesoModal) {
      case 'lda_dd':
        {
          if (confirmar) {
            this.eliminarDetalle();
          }
          this.procesoModal = '';
          break;
        }
      default:
        // No se requiere ninguna acción para otros casos
        break;
    }
  }

  /**
   * Obtiene la lista de plantas autorizadas según el tipo de planta y el país de origen seleccionados.
   * Si no se encuentran plantas autorizadas, muestra una notificación de advertencia al usuario.
   *
   * @remarks
   * Este método realiza una llamada al servicio `catalogoService` para obtener el catálogo de plantas autorizadas.
   * 
   * @returns {void} No retorna ningún valor.
   */
  plantaAutorizadaOrigen(): void {
    const VALORTIPOPLANTA = this.productosForm.value.tipoPlanta;
    const VALORPAISDEORIGEN = this.productosForm.value.paisDeOrigen;

    if (VALORPAISDEORIGEN && VALORTIPOPLANTA) {
      this.catalogoService.obtieneCatalogoPlantasAutorizadas(220201, VALORPAISDEORIGEN, VALORTIPOPLANTA).subscribe((data) => {
        if (data.datos && data.datos.length > 0) {
          this.catalogosDatos.plantaAutorizadaOrigenList = data.datos;
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'warning',
            modo: 'action',
            titulo: '',
            mensaje: 'No existen plantas para el tipo seleccionado.',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
        }
      });
    }
  }

}
