/**
 * Importaciones necesarias para el componente DatosDelCertificado.
 */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Importaciones necesarias para el componente DatosDelCertificado.
 */
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
/** Importación de componentes reutilizables y modelos. */
import { Subject, map, takeUntil } from 'rxjs';
import { Agregar220401Store } from '../../../../estados/tramites/agregar220401.store';
import { AgregarArchivoComponent } from '@ng-mf/data-access-user';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';
import { CatalogoResponse } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CombinacionRequeridaComponent } from '../combinacion-requerida/combinacion-requerida.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosGeneralesAnimalesComponent } from '../datos-generales-animales/datos-generales-animales.component';
import { DetosDelService } from '../../services/pantallas.service';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { Modal } from 'bootstrap';
import { Pantallas220401Service } from '../pantallas220401.service';
import { Solicitud220401State } from '../../../../estados/tramites/agregar220401.store';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import radioOptionsData from '@libs/shared/theme/assets/json/220401/tipo-de-certifico.json';
import unidadRadioFields from '@libs/shared/theme/assets/json/220401/unidad.json';

import { AlertComponent,Catalogo } from '@ng-mf/data-access-user';
import { LOCALIDAD_COLONIA } from '../../constantes/certificados-licencias.enum';
import { TipoDeCertificoOption } from '../../models/tipoCertificoOption.model';

/**
 * Componente que gestiona los datos del certificado en la solicitud 220401.
 */

@Component({
  selector: 'app-datos-del-certificado',
  templateUrl: './datos-del-certificado.component.html',
  standalone: true,
  styleUrl: './datos-del-certificado.component.scss',
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    AgregarArchivoComponent,
    TableComponent,
    CatalogoSelectComponent,
    AlertComponent,DatosGeneralesAnimalesComponent,CombinacionRequeridaComponent
  ],
})
export class DatosDelCertificadoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;
  /** Formulario principal para la solicitud. */
  solicitudForm!:FormGroup;
 /** Opciones de radio importadas desde JSON. */
  radioOptions = radioOptionsData; // Use imported JSON data
  /**
   * Valor seleccionado en el componente de radio.
   */
  public certificadaValue: string = 'Producto';
 /** Valor seleccionado en el componente de radio. */
  public defaultSelect: string | number = 'oficina central';
  /** Notificador para destruir las suscripciones al salir del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Formulario de datos del certificado. */
  datosdelForm!: FormGroup;
  /**
   * Opciones de radio para unidad, importadas desde un archivo JSON.
   */
  public radioBotonProducto = unidadRadioFields; // importar datos desde Json
  
  /**
   * Configuración de catálogos para el formulario.
   * Contiene los nombres de los controles y las rutas de los catálogos.
   */
  public radioBotonAnimal!: TipoDeCertificoOption[];
  /**
   * Configuración de catálogos para el formulario.
   * Contiene los nombres de los controles y las rutas de los catálogos.
   */
  public radioBotonQFBA! : TipoDeCertificoOption[];

  /**
   * Estado de la solicitud 220401.
   */
  public solicitudState!: Solicitud220401State;
  /**
   * Arreglo para almacenar el catálogo de estados.
   */
  estadoJson: CatalogoResponse[] = [];

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * Cuando es `true`, los campos del formulario no pueden ser editados por el usuario.
   * Cuando es `false`, el formulario es editable.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente, inyecta los servicios necesarios.
   */

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los países de origen disponibles.
   * Se utiliza para cargar y gestionar los países de origen seleccionados en el formulario.
   */
    public paisOrigen!: Catalogo[];

   /**
   * Representa el tipo de alerta que se mostrará.
   * El valor es típicamente una cadena que indica el estilo de alerta, como 'alert-warning'.
   */
  public infoAlert = 'alert-warning';

  /**
   * Una constante que contiene el valor de `LOCALIDAD_COLONIA`.
   * Probablemente se utiliza para representar o almacenar información textual
   * relacionada con una localidad o colonia específica en la aplicación.
   */
  public TEXTO = LOCALIDAD_COLONIA;

  constructor(private fb: FormBuilder,
    private agregar220401Store: Agregar220401Store,
    private agregarQuery: AgregarQuery, 
    private _pantallas220401Service: Pantallas220401Service,
    private consultaioQuery: ConsultaioQuery,  
    private detosDelService: DetosDelService
   
) {
  this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if(seccionState.readonly || seccionState.update){
             this.inicializarFormulario();
             this.setCatalogosDatos();
             this.guardarDatosFormulario();
          }
        })
      )
      .subscribe()
}
/**
   * Inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
  }

  /**
   * Inicializa el formulario del certificado según el modo de la vista.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), 
   * guarda los datos actuales del formulario llamando a `guardarDatosFormulario()`.
   * En caso contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
    
  }

    /**
     * Inicializa el formulario y ajusta su estado (habilitado o deshabilitado) según el modo de solo lectura.
     * 
     * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es verdadero), deshabilita los formularios `datosdelForm` y `formGroup1`.
     * - Si no está en modo solo lectura, habilita ambos formularios.
     * - Si ninguna de las condiciones anteriores se cumple, no realiza ninguna acción adicional.
     */
    guardarDatosFormulario(): void { 
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.datosdelForm.disable();
        this.formGroup1.disable();
      } else {
        this.datosdelForm.enable();
        this.formGroup1.enable();
      } 
  }

  /**
   * @comdoc
   * Inicializa y configura los formularios reactivos utilizados en el componente.
   * 
   * - Crea los formularios `datosdelForm` y `formGroup1` con sus respectivos controles y validaciones.
   * - Suscribe al observable `selectSolicitud$` para obtener y almacenar el estado de la solicitud.
   * - Agrega controles dinámicamente a `formGroup1` según la configuración de catálogos (`catalogConfigs`).
   * - Carga los datos de delegaciones mediante `loaddataDelegacionesData`.
   * - Sincroniza los valores de los controles de `formGroup1` con el estado almacenado en el servicio `_pantallas220401Service`.
   * - Actualiza el formulario `datosdelForm` con los datos actuales de la solicitud.
   */
  inicializarFormulario():void{
    this.formGroup1 = this.fb.group({});
    /** Suscripción para obtener el estado de la solicitud. */
    this.agregarQuery.selectSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    )
    .subscribe();
    this.formGroup1= this.fb.group({
      radioBotonAnimal:[this.solicitudState?.radioBotonAnimal],
      radioBotonQFBA:[this.solicitudState?.radioBotonQFBA],
      radioBotonProducto:[this.solicitudState?.radioBotonProducto],
    });
    
    this.catalogConfigs.forEach((config) => {
      this.formGroup1.addControl(
        config.controlName,
        new FormControl({value: '', disabled: config.disabled}, Validators.required)
      );
    });
    this.loaddataDelegacionesData();

    this._pantallas220401Service.getState().subscribe((state) => {
      this.catalogConfigs.forEach((config) => {
        if (state[config.controlName]) {
          this.formGroup1
            .get(config.controlName)
            ?.setValue(state[config.controlName]);
        }
      });
    });

    this.detosDelService.getCertificadoData() 
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.radioBotonAnimal = data;
      });

    this.detosDelService.getCertificado() 
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.radioBotonQFBA = data;
      });

      this.datosdelForm= this.fb.group({
        datoscertificado:[this.solicitudState?.datoscertificado],
        certificada: ['Producto', Validators.required],
        tratamiento:[this.solicitudState?.tratamiento],
        tipoCertificado: ['', Validators.required],
        message: [{ value: '', disabled: true }],
        numeroTotal:[''],
        condiciones:['',Validators.required],
        cantidadTotal:[''],
        tipoEmbalaje:[''],
        uso:['',Validators.required],
      })
      
      this._pantallas220401Service.getPaisOrigen().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.paisOrigen = data;
    });
  }

  /**
   * Establece el valor predeterminado "1" para cada control de formulario especificado en la configuración de catálogos.
   * 
   * Itera sobre la lista `catalogConfigs` y, para cada configuración, busca el control correspondiente en `formGroup1`
   * utilizando el nombre del control (`controlName`). Si el control existe, se le asigna el valor "1".
   * 
   * @remarks
   * Este método se utiliza para inicializar los controles de selección (dropdown) con un valor por defecto.
   */
  setCatalogosDatos(): void {
    this.catalogConfigs.forEach((config) => {
      const DROP_DOWN = this.formGroup1.get(config.controlName);
      if (DROP_DOWN) {
        DROP_DOWN.setValue("1");
      }
    });
  }
    /**
   * Abre el modal para modificar mercancías.
   */
  openModificarMercancias(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

      /**
   * Maneja los cambios en el valor seleccionado.
   */
  
   onValueChange(value: string | number):void {
        this.defaultSelect = value.toString();
        if(value === 'Oficinacentral'){
          this.formGroup1.get('delegacionesControl')?.disable();
          this.formGroup1.get('delegacionesControl2')?.disable();
          this.formGroup1.get('delegacionesControl3')?.enable();
          this.formGroup1.get('delegacionesControl')?.reset();
          this.formGroup1.get('delegacionesControl2')?.reset();
        }else if(value === 'Establecimiento'){
          this.formGroup1.get('delegacionesControl')?.disable();
          this.formGroup1.get('delegacionesControl2')?.enable();
          this.formGroup1.get('delegacionesControl3')?.disable();
          this.formGroup1.get('delegacionesControl')?.reset();
          this.formGroup1.get('delegacionesControl3')?.reset();
        }else if(value === 'Oficina'){
          this.formGroup1.get('delegacionesControl')?.enable();
          this.formGroup1.get('delegacionesControl2')?.disable();
          this.formGroup1.get('delegacionesControl3')?.disable();
          this.formGroup1.get('delegacionesControl2')?.reset();
          this.formGroup1.get('delegacionesControl3')?.reset();
      }
    }
  
    /**
     * Carga los datos de delegaciones desde el servicio y actualiza la configuración de catálogos.
     */
    loaddataDelegacionesData(): void {
      this._pantallas220401Service.getDelegacionesData().subscribe((data) => {
      this.delegacionesJson = data;
      this.updateCatalogConfigs();
      });
    }
    /**
     * Actualiza la configuración de los catálogos con los datos de delegaciones actuales.
     */
    updateCatalogConfigs(): void {
      this.catalogConfigs.forEach((config) => {
      config.catalogo = this.delegacionesJson;
      });
    }

  /**
   * Arreglo que almacena las delegaciones obtenidas para los catálogos.
   * Se utiliza para poblar los selectores de delegaciones en el formulario.
   */
  delegacionesJson: CatalogoResponse[] = [];

  
  /**
   * Formulario reactivo adicional utilizado para gestionar controles dinámicos relacionados con delegaciones.
   * Se inicializa en el método `inicializarFormulario` y se utiliza para almacenar y manipular los valores
   * de los selectores de delegaciones en el formulario.
   */
  formGroup1!: FormGroup;

  /**
   * Configuración de los catálogos utilizados en el formulario.
   * Cada objeto representa un selector de delegaciones con sus propiedades:
   * - catalogo: datos de delegaciones cargados dinámicamente.
   * - label: etiqueta mostrada en el formulario.
   * - controlName: nombre del control en el formulario reactivo.
   * - required: indica si el campo es obligatorio.
   * - catalogos: opciones disponibles para el selector.
   * - primerOpcion: valor de la primera opción (por defecto vacío).
   */
  public catalogConfigs = [
    {
      catalogo: this.delegacionesJson,
      label: 'Delegaciones estatales SAGARPA',
      controlName: 'delegacionesControl',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
      disabled: true
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Establecimiento TIF',
      controlName: 'delegacionesControl2',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
      disabled: true
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Oficina central',
      controlName: 'delegacionesControl3',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
      disabled: true
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Distrito desarrollo rural (DDR)',
      controlName: 'delegacionesControl4',
      required: false,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
      disabled: false
    },
  ];

  /**
   * Configuración de los catálogos para el formulario de animales.
   * Incluye delegaciones estatales, OISA, oficina central y distrito desarrollo rural.
   */
 public catalogConfigsAnimal = [
    {
      catalogo: this.delegacionesJson,
      label: 'Delegaciones estatales SAGARPA',
      controlName: 'delegacionesControl',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
    {
      catalogo: this.delegacionesJson,
      label: 'OISA',
      controlName: 'delegacionesControl2',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Oficina central',
      controlName: 'delegacionesControl3',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Distrito desarrollo rural (DDR)',
      controlName: 'delegacionesControl4',
      required: false,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
  ];
  
  /**
   * Configuración de los catálogos para el formulario de QFBA.
   * Incluye delegaciones estatales, oficina central y distrito desarrollo rural.
   */
  public catalogConfigsQFBA = [
    {
      catalogo: this.delegacionesJson,
      label: 'Delegaciones estatales SAGARPA',
      controlName: 'delegacionesControl',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Oficina central',
      controlName: 'delegacionesControl3',
      required: true,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
    {
      catalogo: this.delegacionesJson,
      label: 'Distrito desarrollo rural (DDR)',
      controlName: 'delegacionesControl4',
      required: false,
      catalogos: DatosDelCertificadoComponent.getCatalogos(),
      primerOpcion: '',
    },
  ];
  /**
   * Obtiene los valores seleccionados de las delegaciones a partir de la configuración del catálogo
   * y actualiza el estado correspondiente en el servicio _pantallas220401Service.
   *
   * Para cada configuración en `catalogConfigs`, extrae el nombre del control y su valor actual
   * del formulario `formGroup1`, luego utiliza estos datos para actualizar el estado en el servicio.
   *
   * @comdoc
   */
  getDelegaciones():void {
    const SELECTED_DELEGCIONES = this.catalogConfigs.map((config) => ({
      controlName: config.controlName,
      value: this.formGroup1.get(config.controlName)?.value,
    }));
    SELECTED_DELEGCIONES.forEach((delegacion) => {
      this._pantallas220401Service.setState(
        delegacion.controlName,
        delegacion.value
      );
    });
  }
  /**
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  
  }

   
    
    /**
     * @comdoc
     * Columnas de la tabla de mercancías.
     */
    tableColumns = [
      'No. partida',
      'Fracción arancelaria',
      'Descripción de la fracción',
      'Unidad de medida fracción de tarifa (UMT)',
      'Cantidad UMT',
      'Unidad de medida de comercialización (UMC)',
      'Cantidad UMC',
      'Tratamiento',
      'Presentación',
      'Marcas embarque',
      'Fecha de caducidad',
      'Fecha sacrificio inicio',
      'Número de autorización CITES',
      'Número de lote'
    ];
  
    /**
     * @comdoc
     * Datos de ejemplo para la tabla de mercancías.
     */
    mercanciasData = [
      {
     tbodyData: [
          '1', '0201.30.00', 'Carne de bovino fresca', 'Kilogramo', '500', 'Caja', '25',
          'Refrigerado', 'Caja sellada', 'MarcaX', '2025-12-31', '2024-06-01', 'CITES-123456', 'Lote-7890'
        ],
      },
    ];
    /**
     * Establece un valor en el store usando el formulario, el nombre del campo y el método correspondiente.
     * 
     * @param form Formulario reactivo del que se obtiene el valor.
     * @param campo Nombre del campo dentro del formulario.
     * @param metodoNombre Nombre del método del store a invocar.
     */
    setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Agregar220401Store): void {
      const VALOR = form.get(campo)?.value;
      (this.agregar220401Store[metodoNombre] as (value: string) => void)(VALOR);
    }
    
 cerrarModal(): void {
 if (this.modalElement) {
      const MODAL_INSTANCE = Modal.getInstance(this.modalElement.nativeElement);
      MODAL_INSTANCE?.hide();
    }
}
 
  /**
   * @comdoc
   * Devuelve un arreglo de opciones de catálogo para los selectores de delegaciones.
   * Cada opción contiene un identificador y una descripción.
   *
   * @returns {Array<{ id: number; descripcion: string }>} Opciones del catálogo.
   */
  private static getCatalogos(): { id: number; descripcion: string }[] {
    return [
      { id: 1, descripcion: 'Opción 1' },
      { id: 2, descripcion: 'Opción 2' },
      { id: 3, descripcion: 'Opción 3' },
    ];
  }
}