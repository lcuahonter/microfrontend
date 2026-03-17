import { AlertComponent, Catalogo, CatalogoSelectComponent, ModeloDeFormaDinamica, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService, Validadores } from '@libs/shared/data-access-user/src';
import { CONFIGURACION_DATOS_SOLICITUD_DE_TABLA, DATOS_DE_LA_SOLICICTUD, INFORMACION_DE_LA_OBRA_ARTE, OBRA_DE_ARTE_ALERT } from '../../constantes/exportar-ilustraciones.enum';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExportarIlustraciones270101State, Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDelSolicitud } from '../../models/exportar-ilustraciones.model';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Modal } from 'bootstrap';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
import { ValidadoresDeFormulariosComponent } from '@libs/shared/data-access-user/src/tramites/components/validadores-de-formularios/validadores-de-formularios/validadores-de-formularios.component';

/**
  * @component DatosDeLaSolicitudComponent
  * @selector datos-de-la-solicitud
  * @description
  * Este componente es responsable de gestionar y renderizar los datos relacionados con la solicitud 
  * de exportación de obras de arte. Incluye formularios dinámicos, tablas configurables y modales 
  * para la interacción del usuario.
  * 
  * Funcionalidades principales:
  * - Renderiza un formulario dinámico basado en la configuración definida en `INFORMACION_DE_LA_OBRA_ARTE`.
  * - Muestra una tabla dinámica con los datos de la solicitud, configurada mediante `configuracionTabla`.
  * - Gestiona la apertura y cierre de modales para agregar o confirmar datos.
  * - Valida los campos del formulario utilizando el servicio `ValidacionesFormularioService`.
  * - Obtiene datos relacionados con monedas y fracciones arancelarias desde el servicio `ExportarIlustracionesService`.
  * 
  * Componentes importados:
  * - `TituloComponent`: Componente para mostrar títulos en el formulario.
  * - `TablaDinamicaComponent`: Componente para mostrar tablas dinámicas.
  * - `FormasDinamicasComponent`: Componente para renderizar formularios dinámicos.
  * - `AlertComponent`: Componente para mostrar alertas.
  * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
  * 
  * @templateUrl ./datos-de-la-solicitud.component.html
  * @styleUrl ./datos-de-la-solicitud.component.scss
  */
@Component({
  selector: 'datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    FormasDinamicasComponent,
    AlertComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    ValidadoresDeFormulariosComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})

export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;
  
  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalSolicitud') modalElement!: ElementRef;

  /**
   * Referencia al modal de confirmación.
   */
  @ViewChild('confirmarModal') confirmarModalElement!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;
  /**
   * Configuración de la tabla de selección.
   */
  public tablaSeleccion = TablaSeleccion;

  /**
  * @property informacionlabel
  * @type {typeof DATOS_DE_LA_SOLICICTUD}
  * @description
  * Esta propiedad almacena las etiquetas de los campos del formulario, basadas en la constante `DATOS_DE_LA_SOLICICTUD`. 
  * Se utiliza para acceder dinámicamente a los nombres de los campos y mostrarlos en el formulario.
  * 
  * @example
  * console.log(this.informacionlabel.AUTOR);
  * // Muestra "Autor", que es el valor asociado a la clave `AUTOR` en `DATOS_DE_LA_SOLICICTUD`.
  */
  public informacionlabel = DATOS_DE_LA_SOLICICTUD;

  /**
   * Configuración de la tabla.
   */
  public configuracionTabla = CONFIGURACION_DATOS_SOLICITUD_DE_TABLA;

  /**
   * Datos configurados para la tabla.
   */
  public configuracionTablaDatos: DatosDelSolicitud[] = [];

 
  /**
  * @property forma
  * @type {FormGroup}
  * @description
  * Este es el formulario reactivo principal del componente, que contiene un grupo de controles 
  * y subgrupos para gestionar los datos de la solicitud. Cada control está configurado con un valor inicial, 
  * un estado (habilitado o deshabilitado) y validadores específicos.
  * 
  * Controles principales:
  * - `ninoFormGroup`: Subgrupo de formularios anidado para datos específicos.
  * - `anoDeCreacion`: Campo obligatorio para el año de creación.
  * - `avaluo`: Campo obligatorio para el avalúo.
  * - `moneda`: Campo obligatorio para seleccionar la moneda.
  * - `propietario`: Campo obligatorio para el propietario.
  * - `fraccionArancelaria`: Campo obligatorio para la fracción arancelaria.
  * - `descripcion`: Campo deshabilitado para la descripción.
  * 
  * @example
  * console.log(this.forma.value);
  * // Muestra los valores actuales de los campos del formulario.
  */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
    anoDeCreacion: new FormControl({value: '', disabled: false}, Validators.required),
    avaluo: new FormControl({value: '', disabled: false}, Validators.required),
    moneda: new FormControl({value: '', disabled: false}, Validators.required),
    propietario: new FormControl({value: '', disabled: false}, Validators.required),
    fraccionArancelaria: new FormControl({value: '', disabled: false}, Validators.required),
    descripcion: new FormControl({value: '', disabled: true}),
  });

  /**
   * compo doc
   * @getter ninoFormGroup
   * @description
   * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
   * dentro del formulario reactivo principal `forma`.
   * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
   *
   * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
   *
   * @example
   * const grupo = this.ninoFormGroup;
   * grupo.get('campo').setValue('nuevo valor');
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

   /**
   * compo doc
   * @property informacionFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `INFORMACION_DE_LA_OBRA_ARTE`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
   public informacionFormData = INFORMACION_DE_LA_OBRA_ARTE;

   /**
  * @property alertInformacion
  * @type {string}
  * @description
  * Esta propiedad almacena el mensaje de alerta relacionado con la información de la obra de arte. 
  * El valor de esta propiedad se obtiene de la constante `OBRA_DE_ARTE_ALERT`, que contiene el contenido 
  * predefinido para mostrar en el componente de alerta.
  * 
  * @example
  * console.log(this.alertInformacion);
  * // Muestra el contenido de la alerta configurada en `OBRA_DE_ARTE_ALERT`.
  */
  public alertInformacion = OBRA_DE_ARTE_ALERT;

  /** Subject para destruir el componente */
    public destroy$ = new Subject<void>();

  /**
    * @property {Catalogo[]} monedaData
    * @description
    * Almacena los datos relacionados con las monedas.
    * @default []
    */
    public monedaData: Catalogo[] = [];

    /**
   * @property {Catalogo[]} arancelariaData
   * @description
   * Almacena los datos relacionados con las fracciones arancelarias.
   * @default []
   */
  public arancelariaData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} autorData
   * @description
   * Almacena los datos relacionados con las fracciones arancelarias.
   * @default []
   */
  public autorData: Catalogo[] = [];

  /**
  * @property validadores
  * @type {Validadores[]}
  * @description
  * Esta propiedad define un conjunto de validadores utilizados para validar los campos del formulario. 
  * Cada validador incluye el tipo de validación, un valor asociado (si aplica) y un mensaje de error 
  * que se muestra cuando la validación falla.
  * 
  * Funcionalidad:
  * - Valida los campos del formulario asegurándose de que cumplan con los requisitos especificados.
  * - Muestra un mensaje de error personalizado si el campo no cumple con la validación.
  * 
  * @example
  * public validadores: Validadores[] = [
  *   { tipo: 'required', valor: '', mensaje: 'Este campo es obligatorio' }
  * ];
  */
public validadores: Validadores[] = [
  { tipo: 'required', valor: '', mensaje: 'Este campo es obligatorio' }
];

  /**
  * Estado de la solicitud de la sección 301.
  * @type {ExportarIlustraciones270101State}
  * @memberof DatosdelasolicitudComponent
  */
  public exportarIlustracionesState!: ExportarIlustraciones270101State;

  /**
   * Datos configurados para la tabla.
   */
  public datosSeleccionados: DatosDelSolicitud[] = [];

  /**
  * @constructor
  * @description
  * Este constructor inicializa el componente `DatosDeLaSolicitudComponent` e inyecta los servicios necesarios 
  * para gestionar los datos y validaciones del formulario. 
  * 
  * Servicios inyectados:
  * - `ExportarIlustracionesService`: Servicio utilizado para obtener datos relacionados con monedas y fracciones arancelarias.
  * - `ValidacionesFormularioService`: Servicio utilizado para validar los campos del formulario.
  * 
  * @param {ExportarIlustracionesService} exportarIlustracionesService - Servicio para gestionar datos de exportación.
  * @param {ValidacionesFormularioService} validacionesService - Servicio para manejar validaciones del formulario.
  * @param tramite270101Store Servicio encargado de gestionar el estado dinámico asociado al trámite 270101.
  * @param tramite270101Query Consulta que facilita la obtención de datos específicos del estado del trámite 270101.
  */
constructor(
  public exportarIlustracionesService: ExportarIlustracionesService,
  private validacionesService: ValidacionesFormularioService,
  private tramite270101Store: Tramite270101Store,
  private tramite270101Query: Tramite270101Query
 ) {
  //
 }

   /**
  * @method ngOnInit
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * después de que Angular haya inicializado todas las propiedades vinculadas al componente. 
  * En este caso, se utiliza para obtener datos relacionados con las monedas y las fracciones 
  * arancelarias desde los servicios correspondientes y asignarlos a las propiedades del componente.
  * 
  * Funcionalidad:
  * - Obtiene los datos de monedas desde el servicio `exportarIlustracionesService` y los asigna a `monedaData`.
  * - Obtiene los datos de fracciones arancelarias desde el servicio `exportarIlustracionesService` y los asigna a `arancelariaData`.
  * - Utiliza `takeUntil` para gestionar la destrucción de las suscripciones y evitar fugas de memoria.
  * 
  * @example
  * ngOnInit(): void {
  *   this.exportarIlustracionesService.getMonedaData()
  *     .pipe(takeUntil(this.destroy$))
  *     .subscribe((data) => {
  *       this.monedaData = data;
  *     });
  * 
  *   this.exportarIlustracionesService.getArancelariaData()
  *     .pipe(takeUntil(this.destroy$))
  *     .subscribe((data) => {
  *       this.arancelariaData = data;
  *     });
  * }
  */
ngOnInit(): void {
  this.tramite270101Query.selectExportarIlustraciones$
    .pipe(
      takeUntil(this.destroy$),
      map((seccionState) => {
        this.exportarIlustracionesState = seccionState;

        if (
          this.exportarIlustracionesState &&
          typeof this.exportarIlustracionesState === 'object' &&
          this.exportarIlustracionesState !== null &&
          'configuracionTablaDatos' in this.exportarIlustracionesState
        ) {
          const DATOS = this.exportarIlustracionesState['configuracionTablaDatos'] || [];
          DATOS.forEach((item: DatosDelSolicitud) => {
            const IS_ALREADY_ADDED = this.configuracionTablaDatos.some((i: { titulo: string }) => i.titulo === item.titulo);
            if (!IS_ALREADY_ADDED) {
              this.configuracionTablaDatos.push(item);
            }
          });
        }
      })
    )
    .subscribe();

  
  // Este código espera a que se carguen todos los archivos JSON y luego ejecuta la función agregarTablaDatos

  let terminado = 0;
  const COMPROBAR_TODO_CARGADO = (): void => {
    terminado++;
    if (terminado === 3 && this.consultaState.readonly) {
      this.agregarTablaDatos();
    }
  };
  this.obtenerAutor(COMPROBAR_TODO_CARGADO);
  this.obtenerMonedaDatos(COMPROBAR_TODO_CARGADO);
  this.obtenerArancelariaDatos(COMPROBAR_TODO_CARGADO);
}

/**
 * @method tablaDatos
 * Genera un objeto con los datos de la solicitud a partir del estado actual del formulario de exportación de ilustraciones
 */
tablaDatos(): DatosDelSolicitud {
  const DETALLES = {
    autor: DatosDeLaSolicitudComponent.obtenerDescripcion(this.autorData, this.exportarIlustracionesState['autor']),
    titulo: this.exportarIlustracionesState['titulo'],
    tecnicaDeRealizacion: this.exportarIlustracionesState['technicaDeRealizacion'],
    conMarco: this.exportarIlustracionesState['medidas'],
    ancho: this.exportarIlustracionesState['ancho'],
    alto: this.exportarIlustracionesState['alto'],
    profundidad: this.exportarIlustracionesState['profundidad'],
    diametro: this.exportarIlustracionesState['diametro'],
    variables: this.exportarIlustracionesState['variables'],
    anoDeCreacion: this.exportarIlustracionesState['anoDeCreacion'],
    avaluo: this.exportarIlustracionesState['avaluo'],
    moneda: DatosDeLaSolicitudComponent.obtenerDescripcion(this.monedaData, this.exportarIlustracionesState['moneda']),
    propietario: this.exportarIlustracionesState['propietario'],
    fraccionArancelaria: DatosDeLaSolicitudComponent.obtenerDescripcion(this.arancelariaData, this.exportarIlustracionesState['fraccionArancelaria']),
    descripcion: this.exportarIlustracionesState['descripcion']
  };
  return DETALLES;
}

/**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], id: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.id) === Number(id))?.descripcion;
    return DESCRIPCION ?? '';
  }

  /**
 * @method agregarTablaDatos
 * Construye y devuelve un objeto con los datos completos de la ilustración a partir del estado actual del formulario.
 */
agregarTablaDatos(): void {
  this.configuracionTablaDatos?.push(this.tablaDatos());
}

  /**
  * @method obtenerAutor
  * @description
  * Este método se utiliza para obtener los datos relacionados con los autores desde el servicio 
  * `ExportarIlustracionesService` y asignarlos al campo correspondiente en el formulario dinámico.
  * 
  * Funcionalidad:
  * - Realiza una solicitud al servicio para obtener los datos de los autores.
  * - Asigna los datos obtenidos a la propiedad `autorData`.
  * - Busca el campo "autor" en la configuración del formulario dinámico (`informacionFormData`).
  * - Si el campo "autor" no tiene opciones configuradas, asigna las opciones obtenidas del servicio.
  * 
  * @example
  * this.obtenerAutor();
  * // Obtiene los datos de los autores y los asigna al formulario dinámico.
  */
  public obtenerAutor(callback: () => void): void {
    this.exportarIlustracionesService.getAutorData()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.autorData = data;
        const AUTOR_FIELD = this.informacionFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'autor') as ModeloDeFormaDinamica;
        if (AUTOR_FIELD) {
          if (!AUTOR_FIELD.opciones) {
            AUTOR_FIELD.opciones = this.autorData.map((item: { id: number; descripcion: string }) => ({
              descripcion: item.descripcion,
              id: item.id,
            }));
          }
        }
        callback();
      });
  }

  /**
  * @method obtenerMonedaDatos
  * @description
  * Este método se utiliza para obtener los datos relacionados con las monedas desde el servicio 
  * `ExportarIlustracionesService` y asignarlos a la propiedad `monedaData`.
  * 
  * Funcionalidad:
  * - Realiza una solicitud al servicio para obtener los datos de las monedas.
  * - Asigna los datos obtenidos a la propiedad `monedaData`.
  * - Utiliza `takeUntil` para gestionar la destrucción de las suscripciones y evitar fugas de memoria.
  * 
  * @example
  * this.obtenerMonedaDatos();
  * // Obtiene los datos de las monedas y los asigna a `monedaData`.
  */
  public obtenerMonedaDatos(callback: () => void): void {
    this.exportarIlustracionesService.getMonedaData()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (resp: Catalogo[]) => {
        if (Array.isArray(resp) && resp.length > 0) {
          this.monedaData = resp;
        } else {
          this.monedaData = [];
        }
        callback(); 
      },
      error: () => {
        this.monedaData = [];
      }
    });
  }

  /**
  * @method obtenerArancelariaDatos
  * @description
  * Este método se utiliza para obtener los datos relacionados con las fracciones arancelarias desde el servicio 
  * `ExportarIlustracionesService` y asignarlos a la propiedad `arancelariaData`.
  * 
  * Funcionalidad:
  * - Realiza una solicitud al servicio para obtener los datos de las fracciones arancelarias.
  * - Asigna los datos obtenidos a la propiedad `arancelariaData`.
  * - Utiliza `takeUntil` para gestionar la destrucción de las suscripciones y evitar fugas de memoria.
  * 
  * @example
  * this.obtenerArancelariaDatos();
  * // Obtiene los datos de las fracciones arancelarias y los asigna a `arancelariaData`.
  */
  public obtenerArancelariaDatos(callback: () => void): void {
    this.exportarIlustracionesService.getArancelariaData()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (resp: Catalogo[]) => {
        if (Array.isArray(resp) && resp.length > 0) {
          this.arancelariaData = resp;
        } else {
          this.arancelariaData = [];
        }
        callback(); 
      },
      error: () => {
        this.arancelariaData = [];
      }
    });
  }

  /**
  * @method abrirDialogo
  * @description
  * Este método se utiliza para abrir un modal en el componente. 
  * Verifica si existe una referencia al elemento del modal (`modalElement`) 
  * y, de ser así, crea una instancia del modal y lo muestra.
  * 
  * Funcionalidad:
  * - Verifica la existencia de la referencia al elemento del modal.
  * - Crea una instancia del modal utilizando Bootstrap y lo muestra.
  * 
  * @example
  * this.abrirDialogo();
  * // Abre el modal configurado en el componente.
  */
  abrirDialogo(): void {
    if (this.modalElement) {
      const INSTANCIA_MODAL = new Modal(this.modalElement.nativeElement);
      INSTANCIA_MODAL.show();
    }
  }

  /**
  * @method cerrarModal
  * @description
  * Este método se utiliza para cerrar el modal actual en el componente. 
  * Verifica si existe una referencia al botón de cierre del modal (`closeModal`) 
  * y, de ser así, simula un clic en dicho botón para cerrar el modal.
  * 
  * Funcionalidad:
  * - Verifica la existencia de la referencia al botón de cierre del modal.
  * - Simula un clic en el botón para cerrar el modal.
  * 
  * @example
  * this.cerrarModal();
  * // Cierra el modal actual.
  */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
  * @method agregarConfirmarModal
  * @description
  * Este método abre un modal de confirmación si el formulario `ninoFormGroup` es válido. 
  * Si el formulario no es válido, marca todos los campos como tocados para mostrar los errores de validación.
  * 
  * Funcionalidad:
  * - Verifica si el formulario `ninoFormGroup` es válido.
  * - Si es válido, cierra el modal actual y abre el modal de confirmación.
  * - Si no es válido, marca todos los campos del formulario como tocados.
  * 
  * @example
  * this.agregarConfirmarModal();
  * // Abre el modal de confirmación si el formulario es válido.
  */
  agregarConfirmarModal(): void {
    if (this.ninoFormGroup.valid && this.forma.valid) {
      const DETALLES = {
        autor: this.ninoFormGroup.get('autor')?.value,
        titulo: this.ninoFormGroup.get('titulo')?.value,
        tecnicaDeRealizacion: this.ninoFormGroup.get('tecnicaDeRealizacion')?.value,
        conMarco: this.ninoFormGroup.get('medidas')?.value,
        ancho: this.ninoFormGroup.get('ancho')?.value,
        alto: this.ninoFormGroup.get('alto')?.value,
        profundidad: this.ninoFormGroup.get('profundidad')?.value,
        diametro: this.ninoFormGroup.get('diametro')?.value,
        variables: this.ninoFormGroup.get('variables')?.value,
        anoDeCreacion: this.forma.get('anoDeCreacion')?.value,
        avaluo: this.forma.get('avaluo')?.value,
        moneda: this.forma.get('moneda')?.value,
        propietario: this.forma.get('propietario')?.value,
        fraccionArancelaria: this.forma.get('fraccionArancelaria')?.value,
        descripcion: this.forma.get('descripcion')?.value,
      };
      this.configuracionTablaDatos?.push(DETALLES);
      this.exportarIlustracionesService.setDatosDeSolicitudArray(DETALLES);
      this.cambioEnValoresStore('configuracionTablaDatos', this.configuracionTablaDatos)
      this.ninoFormGroup.reset();
      this.forma.reset();
      this.cerrarModal();
    } else {
      this.ninoFormGroup.markAllAsTouched();
      this.forma.markAllAsTouched();
    }
  }

  /**
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.forma, campo);
  }

  /**
  * @method cambioEvento
  * @description
  * Este método se utiliza para manejar los eventos de cambio en los campos del formulario. 
  * Obtiene el valor actual del campo modificado y lo registra en la consola para su seguimiento.
  * 
  * Funcionalidad:
  * - Verifica si el evento y el nombre del campo son válidos.
  * - Obtiene el control del formulario asociado al campo proporcionado.
  * - Recupera el valor actual del campo y lo imprime en la consola.
  * 
  * @param {Event} event - Evento de cambio generado por el campo del formulario.
  * @param {string} campo - Nombre del campo que se modificó.
  * 
  * @example
  * this.cambioEvento($event, 'anoDeCreacion');
  * // Registra en la consola el valor actual del campo "anoDeCreacion".
  */
  public cambioEvento(event: Event, campo: string): void {
    let VALOR;
    if (event.target) {
      VALOR = (event.target as HTMLInputElement).value;
    } else {
      const CONTROL = this.forma.get(campo);
      VALOR = CONTROL ? CONTROL.value : null;
    }
    this.cambioEnValoresStore(campo, VALOR);
  }

  /**
  * compo doc
  * @method establecerCambioDeValor
  * @description
  * Este método se utiliza para manejar los cambios en los valores de un formulario dinámico.
  * Recibe un evento que contiene el nombre del campo y su nuevo valor, y actualiza el estado
  * dinámico del formulario en el store correspondiente.
  * 
  * @param event - Un objeto que contiene el campo que ha cambiado y su nuevo valor.
  * El objeto tiene la estructura: `{ campo: string; valor: any }`.
  * 
  * @example
  * establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
  * // Actualiza el campo 'nombre' con el valor 'Juan' en el store dinámico.
  */
  establecerCambioDeValor(event: { campo: string; valor: object | string }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
    }
  }

  /**
  * compo doc
  * @method cambioEnValoresStore
  * @description 
  * Este método se utiliza para emitir un evento cuando hay un cambio en los valores del formulario.
  * Recibe como parámetros el formulario preactivo (FormGroup) y el campo que ha cambiado.
  * Luego, emite un objeto con esta información utilizando el EventEmitter `emitirValorCambiado`.
  * @param form - El formulario reactivo que contiene los datos.
  * @param campo - El nombre del campo que ha cambiado.
  */
  public cambioEnValoresStore(campo: string, valor: unknown): void {
    this.tramite270101Store.setDynamicFieldValue(campo, valor);
  }

  /**
  * @method listaDeFilaSeleccionada
  * @description
  * Este método se utiliza para manejar la selección de filas en la tabla dinámica. 
  * Cuando se seleccionan filas, los datos correspondientes se agregan a la propiedad `datosSeleccionados`.
  * 
  * Funcionalidad:
  * - Verifica si el evento contiene elementos seleccionados.
  * - Itera sobre los elementos seleccionados y los agrega a la lista `datosSeleccionados`.
  * 
  * @param {DatosDelSolicitud[]} event - Lista de elementos seleccionados en la tabla dinámica.
  * 
  * @example
  * this.listaDeFilaSeleccionada(seleccionados);
  * // Agrega los elementos seleccionados a `datosSeleccionados`.
  */
  public listaDeFilaSeleccionada(event: DatosDelSolicitud[]): void {
    if (event.length > 0) {
        event.forEach((item) => {
            this.datosSeleccionados.push(item);
        });
    }
  }
  
  /**
  * @method eliminar
  * @description
  * Este método se utiliza para eliminar las filas seleccionadas de la tabla dinámica. 
  * Itera sobre los elementos seleccionados en `datosSeleccionados`, busca su índice en 
  * `configuracionTablaDatos` y los elimina si existen. Luego, actualiza el estado del store 
  * con los datos actualizados de la tabla.
  * 
  * Funcionalidad:
  * - Itera sobre los elementos seleccionados en `datosSeleccionados`.
  * - Busca el índice de cada elemento en `configuracionTablaDatos`.
  * - Elimina el elemento si se encuentra en la tabla.
  * - Actualiza el estado del store con los datos actualizados.
  * 
  * @example
  * this.eliminar();
  * // Elimina las filas seleccionadas de la tabla dinámica.
  */
  public eliminar(): void {
    this.datosSeleccionados.forEach((item) => {
      const INDEX = this.configuracionTablaDatos?.findIndex((obj) => obj.titulo === item.titulo);
      if (INDEX !== -1) {
        this.configuracionTablaDatos?.splice(INDEX, 1);
        this.cambioEnValoresStore('configuracionTablaDatos', this.configuracionTablaDatos);
      }
    });
  }

  /**
  * @method ngOnDestroy
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones 
  * activas y evitar fugas de memoria en la aplicación.
  * 
  * Funcionalidad:
  * - Notifica a través del `Subject` `destroy$` que el componente será destruido.
  * - Completa el `Subject` para liberar los recursos asociados.
  * 
  * @example
  * ngOnDestroy(): void {
  *   this.destroy$.next();
  *   this.destroy$.complete();
  * }
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
