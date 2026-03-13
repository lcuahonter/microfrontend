import { ALERT,ID_PROCEDIMIENTO, OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/domicilio-del-establecimiento.enum';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
  
import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputCheckComponent, InputRadioComponent, REGEX_LOCALIDAD, REGEX_SOLO_DIGITOS, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';


import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';


import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIAS_DATA, MercanciasInfo, NICO_TABLA, NicoInfo } from '../../models/modificación-del-permiso-sanitario-de-importación-de-insumo.model';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260911State, Tramite260911Store } from '../../estados/tramite260911.store';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';

import { MercanciaForm } from '../../../../shared/models/datos-solicitud.model';

import { DomicilioDelEstablecimientoService } from '../../services/domicilio-del-establecimiento/domicilio-del-establecimiento.service';
import { Tramite260911Query } from '../../estados/tramite260911.query';





/**
 * Componente para gestionar el domicilio del establecimiento.
 * Permite la visualización y edición de los datos del domicilio, así como la gestión de tablas y catálogos asociados.
 * Incluye lógica para modo solo lectura y edición, integración con el store y servicios para obtener datos.
 *
 * @selector app-domicilio-del-establecimiento
 * @standalone true
 * @imports [
 *   CommonModule,
 *   TituloComponent,
 *   ReactiveFormsModule,
 *   CatalogoSelectComponent,
 *   AlertComponent,
 *   TablaDinamicaComponent,
 *   InputRadioComponent,
 *   InputCheckComponent
 * ]
 * @templateUrl ./domicilio-del-establecimiento.component.html
 * @styleUrl ./domicilio-del-establecimiento.component.scss
 */
@Component({
  selector: 'app-domicilio-del-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    InputCheckComponent,
    DatosMercanciaContenedoraComponent
  ],
  templateUrl: './domicilio-del-establecimiento.component.html',
  styleUrl: './domicilio-del-establecimiento.component.scss',
})
export class DomicilioDelEstablecimientoComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
   /**
   * Indica si el componente debe estar deshabilitado.
   * Cuando es `true`, el componente no permite interacción del usuario.
   */
  @Input() disabled: boolean = false;

  /**
   * Tipo de trámite asociado al componente.
   * Este valor se recibe como entrada y determina el tipo de trámite que se está gestionando.
   */
  @Input() tipoTramite: string = '';


 /**
   * @property idProcedimiento
   * @description ID of the current procedure, defined as a read-only property.
   * @type {string | number}
   * @readonly
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * Índice del elemento de mercancía seleccionado en la tabla.
   */
  selectedMercanciaIndex: number | null = null;
  /**
   * Contador de elementos de mercancía seleccionados.
   */
  selectedMercanciaCount: number = 0;
  /**
   * Indica si la edición está bloqueada.
   */
  isEditBlocked: boolean = false;
  /**
   * Indica si la tabla de mercancías está deshabilitada.
   */
  isMercanciasTableDisabled: boolean = true;
  /**
   * Indica si la tabla de NICO está deshabilitada.
   */
  isNicoTablaDisabled: boolean = true;
  /**
   * Obtiene el estado del formulario de mercancía basado en el elemento seleccionado.
   *
   * @returns {MercanciaForm} El estado del formulario de mercancía.
   */
    private _mercanciaFormState: MercanciaForm = DomicilioDelEstablecimientoComponent.getEmptyMercanciaForm();
    get mercanciaFormState(): MercanciaForm {
      return this._mercanciaFormState;
    }
    set mercanciaFormState(value: MercanciaForm) {
      this._mercanciaFormState = value;
    }

  /**
   * Obtiene un formulario de mercancía vacío.
   *
   * @returns {MercanciaForm} Un formulario de mercancía vacío.
   */
  static getEmptyMercanciaForm(): MercanciaForm {
    return {
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      denominacionEspecificaProducto: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      fechaCaducidad: '',
      paisDeOriginDatos: [],
      paisDeProcedenciaDatos: [],
      usoEspecifico: [],
      marca: '',
      especifique: '',
      claveDeLos: '',
      fechaDeFabricacio: '',
      fechaDeCaducidad: '',
      especifiqueObligatorio: ''
    };
  }

  /**
   * Mapea la información de mercancías a un formulario de mercancía.
   *
   * @param {MercanciasInfo} info - La información de mercancías a mapear.
   * @returns {MercanciaForm} El formulario de mercancía resultante.
   */
  static mapMercanciasInfoToForm(info: MercanciasInfo): MercanciaForm {
    const MAPBASIC = (info: MercanciasInfo): {
      clasificacionProducto: string;
      especificarClasificacionProducto: string;
      denominacionEspecificaProducto: string;
      denominacionDistintiva: string;
      denominacionComun: string;
      tipoProducto: string;
      formaFarmaceutica: string;
      estadoFisico: string;
      fraccionArancelaria: string;
      descripcionFraccion: string;
      presentacion: string;
    } => ({
      clasificacionProducto: info.clasificacion || '',
      especificarClasificacionProducto: info.especificar || '',
      denominacionEspecificaProducto: info.denominacionEspecifica || '',
      denominacionDistintiva: info.denominacionDistintiva || '',
      denominacionComun: info.denominacionComun || '',
      tipoProducto: info.tipoProducto || '',
      formaFarmaceutica: info.formaFarmaceutica || '',
      estadoFisico: info.estadoFisico || '',
      fraccionArancelaria: info.fraccionArancelaria || '',
      descripcionFraccion: info.descripcionFraccion || '',
      presentacion: info.presentacion || '',
    });
    /**
     * Mapea la información de mercancías a un formulario de mercancía.
     *
     * @param info La información de mercancías a mapear.
     * @returns El formulario de mercancía resultante.
     */
    const MAPCANTIDAD = (info: MercanciasInfo): {
      cantidadUmtValor: string;
      cantidadUmt: string;
      cantidadUmcValor: string;
      cantidadUmc: string;
    } => ({
      cantidadUmtValor: info.unidadUMT || '',
      cantidadUmt: info.cantidadUMT || '',
      cantidadUmcValor: info.unidad || '',
      cantidadUmc: info.cantidadUMC || '',
    });
    
    /**
     * Mapea la información de un objeto `MercanciasInfo` a un nuevo objeto con campos específicos.
     * 
     * @param info - Objeto que contiene la información de las mercancías.
     * @returns Un objeto con los siguientes campos:
     * - `presentacion`: La presentación del producto.
     * - `numeroRegistroSanitario`: El número de registro sanitario.
     * - `fechaCaducidad`: La fecha de caducidad del producto.
     * - `paisDeOriginDatos`: Arreglo con el país de origen.
     * - `paisDeProcedenciaDatos`: Arreglo con el país de procedencia.
     * - `usoEspecifico`: Arreglo con el uso específico del producto.
     */
    const MAPEXTRA = (info: MercanciasInfo): {
      presentacion: string;
      numeroRegistroSanitario: string;
      fechaCaducidad: string;
      paisDeOriginDatos: string[];
      paisDeProcedenciaDatos: string[];
      usoEspecifico: string[];
    } => ({
      presentacion: info.presentacion || '',
      numeroRegistroSanitario: info.numeroRegistro || '',
      fechaCaducidad: info.fechaCaducidad || '',
      paisDeOriginDatos: info.paisDeOrigen ? [info.paisDeOrigen] : [],
      paisDeProcedenciaDatos: info.paisDeProcedencia ? [info.paisDeProcedencia] : [],
      usoEspecifico: info.usoEspecifico ? [info.usoEspecifico] : [],
    });
    /**
     * Crea un objeto con campos relacionados a la información de otros datos del establecimiento.
     * 
     * @returns Un objeto con las siguientes propiedades:
     * - marca: Marca del producto.
     * - especifique: Campo para especificar información adicional.
     * - claveDeLos: Clave identificadora.
     * - fechaDeFabricacio: Fecha de fabricación del producto.
     * - fechaDeCaducidad: Fecha de caducidad del producto.
     * - especifiqueObligatorio: Campo obligatorio para especificar información adicional.
     */
    const MAPOTHER = (): {
      marca: string;
      especifique: string;
      claveDeLos: string;
      fechaDeFabricacio: string;
      fechaDeCaducidad: string;
      especifiqueObligatorio: string;
    } => ({
      marca: '',
      especifique: '',
      claveDeLos: '',
      fechaDeFabricacio: '',
      fechaDeCaducidad: '',
      especifiqueObligatorio: ''
    });
    return {
      ...MAPBASIC(info),
      ...MAPCANTIDAD(info),
      ...MAPEXTRA(info),
      ...MAPOTHER()
    };
  }

  /**
   * Maneja el evento de selección de una fila en la tabla de mercancías.
   * 
   * Si se selecciona al menos una mercancía, actualiza el índice de la mercancía seleccionada
   * buscando la fila correspondiente en los datos de la tabla. Si no hay selección, 
   * establece el índice seleccionado como `null`.
   * 
   * @param event - Arreglo de objetos `MercanciasInfo` que representa las filas seleccionadas.
   */
  onMercanciaRowSelected(event: MercanciasInfo[]): void {
    this.selectedMercanciaCount = event ? event.length : 0;
    if (event && event.length > 0) {
      const SELECTED_ROW = event[0];
      this.selectedMercanciaIndex = this.mercanciasTablaDatos.findIndex(row => row === SELECTED_ROW);
    } else {
      this.selectedMercanciaIndex = null;
    }
  }

  /**
   * Maneja el evento de agregar una nueva mercancía.
   *
   * @param event - Objeto `MercanciasInfo` que representa la mercancía a agregar.
   */
  onAgregarMercancia(event: MercanciasInfo): void {
  if (this.selectedMercanciaIndex !== null && this.selectedMercanciaIndex >= 0) {
    this.mercanciasTablaDatos = this.mercanciasTablaDatos.map((row, idx) =>
      idx === this.selectedMercanciaIndex ? event : row
    );
    this.selectedMercanciaIndex = null;
  } else {
    this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, event];
  }
  this.cerrarMercanciaModal();
  }

  /**
   * Cierra el modal de selección de registro de mercancía.
   */
  cerrarSeleccionaRegistroMercanciaModal(): void {
    if (this.modalSeleccionaRegistroMercanciaInstance) {
      this.modalSeleccionaRegistroMercanciaInstance.hide();
    }
  }
  private modalSeleccionaRegistroMercanciaInstance: Modal | undefined;

  /**
   * Muestra el modal de selección de registro de mercancía.
   */
  mostrarSeleccionaRegistroMercancia(): void {
    const MODAL = document.getElementById('modalSeleccionaRegistroMercancia');
    if (MODAL) {
      const WIN = window as Window & { bootstrap?: { Modal?: typeof Modal } };
      this.modalSeleccionaRegistroMercanciaInstance = WIN.bootstrap?.Modal
        ? new WIN.bootstrap.Modal(MODAL)
        : undefined;
      this.modalSeleccionaRegistroMercanciaInstance?.show();
    }
  }

  /**
   * Maneja el evento de modificación de una mercancía.
   *
   * @param index - Índice de la mercancía a modificar.
   */
  onModificarMercancia(index: number): void {
    this.selectedMercanciaIndex = index;
    this.isEditBlocked = this.selectedMercanciaCount > 1;
    if (this.isEditBlocked) {
      return;
    }
    const SELECTED_ROW = this.mercanciasTablaDatos[index];
    this.mercanciaFormState = DomicilioDelEstablecimientoComponent.mapMercanciasInfoToForm(SELECTED_ROW);
    const CATALOGS_LOADED = [
      this.datosMercanciaContenedoraComp.clasificacionProductoDatos,
      this.datosMercanciaContenedoraComp.especificarClasificacionProductoDatos,
      this.datosMercanciaContenedoraComp.tipoProductoDatos,
      this.datosMercanciaContenedoraComp.formaFarmaceuticaDatos,
      this.datosMercanciaContenedoraComp.estadoFisicoDatos
    ].every(arr => Array.isArray(arr) && arr.length);

    const PATCH_CHILD_FORM = (): void => {
      this.datosMercanciaContenedoraComp.crearMercanciaForm();
      const CATALOG_FIELDS = [
        'clasificacionProducto',
        'especificarClasificacionProducto',
        'tipoProducto',
        'formaFarmaceutica',
        'estadoFisico'
      ];
      CATALOG_FIELDS.forEach(field => {
        if (!this.datosMercanciaContenedoraComp.mercanciaForm.contains(field)) {
          this.datosMercanciaContenedoraComp.mercanciaForm.addControl(field, new FormControl(null, Validators.required));
        }
      });
      if (this.datosMercanciaContenedoraComp.mercanciaForm) {
        this.datosMercanciaContenedoraComp.mercanciaForm.patchValue({
          clasificacionProducto: DatosMercanciaContenedoraComponent.matchCatalogId(this.datosMercanciaContenedoraComp.clasificacionProductoDatos, SELECTED_ROW.clasificacion),
          especificarClasificacionProducto: DatosMercanciaContenedoraComponent.matchCatalogId(this.datosMercanciaContenedoraComp.especificarClasificacionProductoDatos, SELECTED_ROW.especificar),
          tipoProducto: DatosMercanciaContenedoraComponent.matchCatalogId(this.datosMercanciaContenedoraComp.tipoProductoDatos, SELECTED_ROW.tipoProducto),
          formaFarmaceutica: DatosMercanciaContenedoraComponent.matchCatalogId(this.datosMercanciaContenedoraComp.formaFarmaceuticaDatos, SELECTED_ROW.formaFarmaceutica),
          estadoFisico: DatosMercanciaContenedoraComponent.matchCatalogId(this.datosMercanciaContenedoraComp.estadoFisicoDatos, SELECTED_ROW.estadoFisico),
          presentacion: SELECTED_ROW.presentacion,
          numeroRegistroSanitario: SELECTED_ROW.numeroRegistro,
          fraccionArancelaria: SELECTED_ROW.fraccionArancelaria,
          descripcionFraccion: SELECTED_ROW.descripcionFraccion,
          cantidadUmtValor: SELECTED_ROW.unidadUMT,
          cantidadUmt: SELECTED_ROW.cantidadUMT,
          cantidadUmcValor: SELECTED_ROW.unidad,
          cantidadUmc: SELECTED_ROW.cantidadUMC,
          fechaCaducidad: SELECTED_ROW.fechaCaducidad,
          paisDeOriginDatos: SELECTED_ROW.paisDeOrigen ? [SELECTED_ROW.paisDeOrigen] : [],
          paisDeProcedenciaDatos: SELECTED_ROW.paisDeProcedencia ? [SELECTED_ROW.paisDeProcedencia] : [],
          usoEspecifico: SELECTED_ROW.usoEspecifico ? [SELECTED_ROW.usoEspecifico] : []
        });
        this.datosMercanciaContenedoraComp.setEditBlocked(false);
      }
    };

    if (this.datosMercanciaContenedoraComp) {
      if (CATALOGS_LOADED) {
        PATCH_CHILD_FORM();
      } else {
        const RETRY_PATCH = (): void => {
          const LOADED = [
            this.datosMercanciaContenedoraComp.clasificacionProductoDatos,
            this.datosMercanciaContenedoraComp.especificarClasificacionProductoDatos,
            this.datosMercanciaContenedoraComp.tipoProductoDatos,
            this.datosMercanciaContenedoraComp.formaFarmaceuticaDatos,
            this.datosMercanciaContenedoraComp.estadoFisicoDatos
          ].every(arr => Array.isArray(arr) && arr.length);
          if (LOADED) {
            PATCH_CHILD_FORM();
          } else {
            setTimeout(RETRY_PATCH, 200);
          }
        };
        RETRY_PATCH();
      }
    }
    this.openMercanciaModal();
  }


    /**
     * Índice de la mercancía que se desea eliminar.
     * Si es `null`, no hay mercancía seleccionada para eliminar.
     * Utilizado para identificar el elemento en la lista de mercancías que será eliminado.
     */
    mercanciaEliminarIndex: number | null = null;
  /**
   * Abre un modal para confirmar la eliminación de una mercancía.
   *
   * @param index - Índice de la mercancía a eliminar.
   */
  private modalConfirmarEliminarMercanciaInstance: Modal | undefined;

  /**
   * Maneja el evento de eliminación de una mercancía.
   *
   * @param index - Índice de la mercancía a eliminar.
   */
  onEliminarMercancia(index: number | null): void {
    if (index === null || index === undefined) {
      
      return;
    }
    this.mercanciaEliminarIndex = index;
    const MODAL_CONFIRMAR_ELIMINAR_MERCANCIA_EL = document.getElementById('modalConfirmarEliminarMercancia');
    if (MODAL_CONFIRMAR_ELIMINAR_MERCANCIA_EL) {
      const WIN = window as Window & { bootstrap?: { Modal?: typeof Modal } };
      this.modalConfirmarEliminarMercanciaInstance = WIN.bootstrap?.Modal
        ? new WIN.bootstrap.Modal(MODAL_CONFIRMAR_ELIMINAR_MERCANCIA_EL)
        : undefined;
      this.modalConfirmarEliminarMercanciaInstance?.show();
    }
  }

  /**
   * Cancela el proceso de eliminación de una mercancía.
   * 
   * Si el modal de confirmación de eliminación de mercancía está abierto, lo oculta.
   * Además, restablece el índice de la mercancía a eliminar a `null`.
   */
  cancelarEliminarMercancia(): void {
    if (this.modalConfirmarEliminarMercanciaInstance) {
      this.modalConfirmarEliminarMercanciaInstance.hide();
    }
    this.mercanciaEliminarIndex = null;
  }

  /**
   * Elimina una mercancía de la lista `mercanciasTablaDatos` según el índice almacenado en `mercanciaEliminarIndex`.
   * Si el índice es válido (no es `null`), filtra la lista para excluir la mercancía correspondiente.
   * Después de eliminar, llama al método `cancelarEliminarMercancia` para restablecer el estado relacionado con la eliminación.
   *
   * @remarks
   * Este método se utiliza para confirmar la eliminación de una mercancía seleccionada en la tabla de datos.
   */
  aceptarEliminarMercancia(): void {
    if (this.mercanciaEliminarIndex !== null) {
      this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter((_, i) => i !== this.mercanciaEliminarIndex);
    }
    this.cancelarEliminarMercancia();
  }

  /**
   * Referencia al componente de datos de la mercancía contenedora.
   */
  @ViewChild(DatosMercanciaContenedoraComponent) datosMercanciaContenedoraComp!: DatosMercanciaContenedoraComponent;

  /**
   * Abre el modal para seleccionar un registro de SCIAN.
   */
  openScianModal(): void {
    document.querySelectorAll('.modal-backdrop').forEach(bd => bd.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    if (this.modalAddNicoTablaRef) {
      const WIN = window as Window & { bootstrap?: { Modal?: typeof Modal } };
      if (WIN.bootstrap && WIN.bootstrap.Modal) {
        this.bootstrapModalNicoTablaInstance = new WIN.bootstrap.Modal(this.modalAddNicoTablaRef.nativeElement);
        this.bootstrapModalNicoTablaInstance?.show();
      }
    }
  }
  /**
   * Cierra el modal de selección de registro de SCIAN.
   */

  openMercanciaModal(): void {
    document.querySelectorAll('.modal-backdrop').forEach(bd => bd.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    if (this.selectedMercanciaIndex === null) {
      const CATALOGS_LOADED = [
        this.datosMercanciaContenedoraComp?.clasificacionProductoDatos,
        this.datosMercanciaContenedoraComp?.especificarClasificacionProductoDatos,
        this.datosMercanciaContenedoraComp?.tipoProductoDatos,
        this.datosMercanciaContenedoraComp?.formaFarmaceuticaDatos,
        this.datosMercanciaContenedoraComp?.estadoFisicoDatos
      ].every(arr => Array.isArray(arr) && arr.length);

      const RESET_AND_OPEN = (): void => {
        this.mercanciaFormState = DomicilioDelEstablecimientoComponent.getEmptyMercanciaForm();
        if (this.datosMercanciaContenedoraComp) {
          this.datosMercanciaContenedoraComp.crearMercanciaForm();
          this.datosMercanciaContenedoraComp.resetForm();
        }
        if (this.modalAddMercanciasRef) {
          const WIN = window as Window & { bootstrap?: { Modal?: typeof Modal } };
          this.bootstrapModalMercanciasInstance = WIN.bootstrap?.Modal
            ? new WIN.bootstrap.Modal(this.modalAddMercanciasRef.nativeElement)
            : undefined;
          this.bootstrapModalMercanciasInstance?.show();
        }
      };

      if (CATALOGS_LOADED) {
        RESET_AND_OPEN();
        return;
      }
      const RETRY_RESET = (): void => {
        const LOADED = [
          this.datosMercanciaContenedoraComp.clasificacionProductoDatos,
          this.datosMercanciaContenedoraComp.especificarClasificacionProductoDatos,
          this.datosMercanciaContenedoraComp.tipoProductoDatos,
          this.datosMercanciaContenedoraComp.formaFarmaceuticaDatos,
          this.datosMercanciaContenedoraComp.estadoFisicoDatos
        ].every(arr => Array.isArray(arr) && arr.length);
        if (LOADED) {
          RESET_AND_OPEN();
        } else {
          setTimeout(RETRY_RESET, 200);
        }
      };
      RETRY_RESET();
      return;
    }
    if (this.modalAddMercanciasRef) {
      const WIN = window as Window & { bootstrap?: { Modal?: typeof Modal } };
      this.bootstrapModalMercanciasInstance = WIN.bootstrap?.Modal
        ? new WIN.bootstrap.Modal(this.modalAddMercanciasRef.nativeElement)
        : undefined;
      this.bootstrapModalMercanciasInstance?.show();
    }
  }

  /**
   * Cierra el modal de selección de registro de SCIAN.
   */
  cerrarMercanciaModal(): void {
    if (this.bootstrapModalMercanciasInstance && typeof this.bootstrapModalMercanciasInstance.hide === 'function') {
      this.bootstrapModalMercanciasInstance.hide();
    }
    this.selectedMercanciaIndex = null;
    const BACKDROPS = document.querySelectorAll('.modal-backdrop');
    BACKDROPS.forEach(bd => bd.parentNode?.removeChild(bd));
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    this.agregarModalBox = false;
  }
  selectedScianIndex: number | null = null;

  private modalSeleccionaRegistroInstance: Modal | undefined;
  private modalConfirmarEliminarScianInstance: Modal | undefined;
  @ViewChild('modalAddMercancias', { static: false }) modalAddMercanciasRef?: ElementRef<HTMLDivElement>;
  @ViewChild('modalAddNicoTabla', { static: false }) modalAddNicoTablaRef?: ElementRef<HTMLDivElement>;
  private bootstrapModalMercanciasInstance: Modal | undefined;
  private bootstrapModalNicoTablaInstance: Modal | undefined;

  /**
   * Inicializa las instancias de los modales después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    const WIN = window as unknown as { bootstrap?: { Modal?: typeof Modal } };
    if (WIN.bootstrap && WIN.bootstrap.Modal) {
      if (this.modalAddMercanciasRef) {
        this.bootstrapModalMercanciasInstance = new WIN.bootstrap.Modal(this.modalAddMercanciasRef.nativeElement);
      }
      if (this.modalAddNicoTablaRef) {
        this.bootstrapModalNicoTablaInstance = new WIN.bootstrap.Modal(this.modalAddNicoTablaRef.nativeElement);
      }
      const MODAL_SELECCIONA_REGISTRO_EL = document.getElementById('modalSeleccionaRegistro');
      if (MODAL_SELECCIONA_REGISTRO_EL) {
        this.modalSeleccionaRegistroInstance = new WIN.bootstrap.Modal(MODAL_SELECCIONA_REGISTRO_EL);
      }
      const MODAL_CONFIRMAR_ELIMINAR_SCIAN_EL = document.getElementById('modalConfirmarEliminarScian');
      if (MODAL_CONFIRMAR_ELIMINAR_SCIAN_EL) {
        this.modalConfirmarEliminarScianInstance = new WIN.bootstrap.Modal(MODAL_CONFIRMAR_ELIMINAR_SCIAN_EL);
      }
    }
  }
  /**
   * Subcatálogo de Representación federal filtrado por Entidad Federativa
   */
  public subRepresentacion: Catalogo[] = [];
  /** Formulario para el modal de agregar SCIAN (nicoTablaDatos) */
  nicoTablaForm!: FormGroup;
 
 /**
   * @property {Catalogo[]} entidad
   * @description
   * Lista de entidades federativas cargadas desde un archivo JSON.
   * Se usa para poblar el select de entidades en el formulario.
   *
   * @access public
   */
  public entidad: Catalogo[] = [];

     /**
   * @property {Catalogo[]} allRepresentaciones
   * @description
   * Almacena todas las opciones de representaciones federales disponibles.
   * Se utiliza para filtrar y mostrar las representaciones según la entidad seleccionada.
   */
  public allRepresentaciones: Catalogo[] = [];


    /**
   * @property {Catalogo[]} representacion
   * @description
   * Lista de representaciones federales cargadas desde un archivo JSON.
   * Se usa para poblar el select de representaciones en el formulario.
   *
   * @access public
   */
  public representacion: Catalogo[] = [];


   /**
   * Evento que emite el objeto seleccionado de tipo `TablaScianConfig`.
   * Se utiliza para notificar al componente padre cuando un SCiAN ha sido seleccionado.
   */
  @Output() scianSeleccionado: EventEmitter<TablaScianConfig> = new EventEmitter<TablaScianConfig>();


 

  /** Estado actual de la solicitud proveniente del store */
  public solicitudState!: Tramite260911State;

  /**
   * Indica si el botón debe estar desactivado para la opción de prórroga.
   * Cuando es `true`, el botón estará deshabilitado y no permitirá solicitar una prórroga.
   */
  botonDesactivarParaProrrogar: boolean =true;

  /**
   * Controla si los campos de nombre, apellidoPaterno y apellidoMaterno están habilitados
   */
  enableLegalFields: boolean = false;

  /** Indica si el formulario está en modo solo lectura */
  esFormularioSoloLectura: boolean = false;
  /** Indica si el modal de agregar está abierto */

  agregarModalBox: boolean = false;

  /**
   * Método para manejar el click en el botón Buscar del RFC
   * Si el RFC es inválido, habilita los campos de nombre, apellidoPaterno y apellidoMaterno
   */
  onBuscarRepresentanteLegal(): void {
    const RFC_CONTROL = this.representanteLegal.get('rfc');
    if (RFC_CONTROL && RFC_CONTROL.invalid) {
      // Si el RFC es inválido, limpiar y habilitar para entrada manual
      this.enableLegalFields = true;
      this.representanteLegal.get('nombre')?.setValue('');
      this.representanteLegal.get('apellidoPaterno')?.setValue('');
      this.representanteLegal.get('apellidoMaterno')?.setValue('');
      this.representanteLegal.get('nombre')?.enable();
      this.representanteLegal.get('apellidoPaterno')?.enable();
      this.representanteLegal.get('apellidoMaterno')?.enable();
      return;
    }

    // Si el RFC es válido, buscar en el servicio
    const RFC_VALUE = RFC_CONTROL?.value;
    if (RFC_VALUE) {
      this.domicilioDelEstablecimientoService.buscarRepresentanteLegalPorRFC(RFC_VALUE).subscribe(result => {
        if (result) {
          // Si se encuentra, puedes llenar los campos (opcional)
          this.representanteLegal.get('nombre')?.setValue(result.nombre);
          this.representanteLegal.get('apellidoPaterno')?.setValue(result.apellidoPaterno);
          this.representanteLegal.get('apellidoMaterno')?.setValue(result.apellidoMaterno);
          this.enableLegalFields = false;
          this.representanteLegal.get('nombre')?.disable();
          this.representanteLegal.get('apellidoPaterno')?.disable();
          this.representanteLegal.get('apellidoMaterno')?.disable();
        } else {
          // Si no se encuentra, limpiar y habilitar para entrada manual
          this.enableLegalFields = true;
          this.representanteLegal.get('nombre')?.setValue('');
          this.representanteLegal.get('apellidoPaterno')?.setValue('');
          this.representanteLegal.get('apellidoMaterno')?.setValue('');
          this.representanteLegal.get('nombre')?.enable();
          this.representanteLegal.get('apellidoPaterno')?.enable();
          this.representanteLegal.get('apellidoMaterno')?.enable();
        }
      });
    } else {
      // Si no hay RFC, deshabilitar los campos
      this.enableLegalFields = false;
      this.representanteLegal.get('nombre')?.disable();
      this.representanteLegal.get('apellidoPaterno')?.disable();
      this.representanteLegal.get('apellidoMaterno')?.disable();
    }
  }

  /**
   * Formulario principal reactivo para los datos del domicilio.
   */
  form!: FormGroup;

  /**
   * Lista de estados obtenida del catálogo.
   */
  estado: Catalogo[] = [];

  /**
   * Textos de alerta utilizados en el componente.
   */
  TEXTOS = ALERT;

  /**
   * Clase CSS para el tipo de alerta.
   */
  class = 'alert-warning';

  /**
   * Configuración para la selección de filas en la tabla (checkbox).
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla NICO.
   */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;

  /**
   * Datos cargados para la tabla NICO.
   */
  nicoTablaDatos: NicoInfo[] = [];

  /**
   * Referencia al componente de tabla dinámica para SCIAN.
   */
  onScianRowSelected(event: NicoInfo[]): void {
    if (event && event.length > 0) {
      const SELECTED_ROW = event[0];
      this.selectedScianIndex = this.nicoTablaDatos.findIndex(row => row === SELECTED_ROW);
    } else {
      this.selectedScianIndex = null;
    }
  }

  /**
   * Se llama cuando se hace clic en el botón Eliminar.
   */
  onEliminarScian(event: number | null | undefined): void {
    if (event === null || event === undefined) {
      this.selectedScianIndex = null;
      if (this.modalSeleccionaRegistroInstance) {
        this.modalSeleccionaRegistroInstance.show();
      }
    } else {
      this.selectedScianIndex = event as number;
      if (this.modalConfirmarEliminarScianInstance) {
        this.modalConfirmarEliminarScianInstance.show();
      }
    }
  }

  /**
   * Cierra el modal 'Selecciona un registro'.
   */
  cerrarSeleccionaRegistroModal(): void {
    if (this.modalSeleccionaRegistroInstance) {
      this.modalSeleccionaRegistroInstance.hide();
    }
  }

  /**
   * Cancela la eliminación y cierra el modal de confirmación.
   */
  cancelarEliminarScian(): void {
    if (this.modalConfirmarEliminarScianInstance) {
      this.modalConfirmarEliminarScianInstance.hide();
    }
  }

  /**
   * Acepta la eliminación de un registro SCIAN.
   * Elimina el registro seleccionado de la lista `nicoTablaDatos` y cierra el modal de confirmación.
   */
  aceptarEliminarScian(): void {
    if (this.selectedScianIndex !== null) {
      this.nicoTablaDatos = this.nicoTablaDatos.filter((_, i) => i !== this.selectedScianIndex);
      this.selectedScianIndex = null;
    }
    if (this.modalConfirmarEliminarScianInstance) {
      this.modalConfirmarEliminarScianInstance.hide();
    }
  }

  /**
   * Formulario reactivo para los datos del domicilio.
   */
  domicilio!: FormGroup;

  /**
   * Configuración de columnas para la tabla de mercancías.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;

  /**
   * Datos cargados para la tabla de mercancías.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Manifiestos de alerta utilizados en el componente.
   */
  manifests = ALERT.MANIFESTS;

  /**
   * Opciones para el botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Formulario reactivo para los datos del representante legal.
   */
  representanteLegal!: FormGroup;
  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroy$ = new Subject<void>();

  /**
   * Estado seleccionado del trámite 260911.
   */
  estadoSeleccionado!: Tramite260911State;

  /**
   * Constructor del componente.
   *
   * @param fb FormBuilder para crear formularios reactivos.
   * @param httpServicios Servicio HTTP para realizar peticiones.
   * @param tramite260911Query Consulta de datos del trámite.
   * @param tramite260911Store Almacenamiento de datos del trámite.
   * @param domicilioDelEstablecimientoService Servicio para obtener datos relacionados con el domicilio.
   * @param consultaioQuery Consulta de estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private tramite260911Query: Tramite260911Query,
    private tramite260911Store: Tramite260911Store,
    private domicilioDelEstablecimientoService: DomicilioDelEstablecimientoService,
    public consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario dependiendo del modo (solo lectura o editable).
   * Si está en solo lectura, carga y bloquea el formulario.
   * Si no, crea un formulario editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  /**
   * Crea el formulario y, si está en modo solo lectura, lo deshabilita.
   * De lo contrario, lo habilita para edición.
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.form.disable();
      this.domicilio.disable();
      this.representanteLegal.disable();
    } else {
      this.form.enable();
      this.domicilio.enable();
      this.representanteLegal.enable();
    }
  }

  /**
   * Método de inicialización del ciclo de vida del componente.
   * Inicializa el formulario y carga los datos necesarios para las tablas y catálogos.
   */
  ngOnInit(): void {
    this.loadEntidad();
    this.loadRepresentacion();
    this.inicializarEstadoFormulario();
    this.form.get('estado')?.disable();
    this.nicoTablaForm.get('entidad')?.disable();
    this.nicoTablaForm.get('representacion')?.disable();
    this.domicilio.get('regimen')?.disable();
    this.domicilio.get('aduanasEntradas')?.disable();
    this.obtenerTablaDatos();
    this.obtenerEstadoList();
    this.obtenerMercanciasDatos();
    this.nicoTablaForm.get('entidad')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((entidad) => {
      this.updateRepresentacionOptions(entidad);
      const FIRST_OPTION = this.subRepresentacion && this.subRepresentacion.length > 0 ? this.subRepresentacion[0].id : '';
      this.nicoTablaForm.get('representacion')?.setValue(FIRST_OPTION);
    });
    if (!this.esFormularioSoloLectura) {
      this.form?.disable();
      this.domicilio?.disable();
      this.representanteLegal?.disable();
    }
  }
  /**
   * Detecta cambios en las propiedades de entrada del componente.
   */
 
ngOnChanges(): void {
  if (this.tipoTramite === '1' || this.tipoTramite === '2') {
    this.isMercanciasTableDisabled = false;
    this.isNicoTablaDisabled = false;
    this.botonDesactivarParaProrrogar = false;
  } else {
    this.isMercanciasTableDisabled = true;
    this.isNicoTablaDisabled = true;
  }
  this.form.get('estado')?.disable();
  this.nicoTablaForm.get('entidad')?.disable();
  this.nicoTablaForm.get('representacion')?.disable();
  this.domicilio.get('regimen')?.disable();
  this.domicilio.get('aduanasEntradas')?.disable();
  if (!this.esFormularioSoloLectura && !this.disabled) {
    this.form?.disable();
    this.domicilio?.disable();
    this.representanteLegal?.disable();
    this.form?.get('estado')?.disable();
    this.nicoTablaForm?.get('entidad')?.disable();
    this.nicoTablaForm?.get('representacion')?.disable();
    this.domicilio?.get('regimen')?.disable();
    this.domicilio?.get('aduanasEntradas')?.disable();

    if (this.tipoTramite === '1' || this.tipoTramite === '2') {
      this.form?.enable();
      this.domicilio?.enable();
      this.representanteLegal?.enable();
     
      this.form?.get('estado')?.enable();
      this.nicoTablaForm?.get('entidad')?.enable();
      this.nicoTablaForm?.get('representacion')?.enable();
      this.domicilio?.get('regimen')?.enable();
      this.domicilio?.get('aduanasEntradas')?.enable();
      this.domicilio?.get('licenciaSanitaria')?.disable();
      this.representanteLegal?.get('nombre')?.disable();
      this.representanteLegal?.get('apellidoPaterno')?.disable();
      this.representanteLegal?.get('apellidoMaterno')?.disable();
    } else if (this.tipoTramite === '0') {
      this.botonDesactivarParaProrrogar = true;
      this.form?.disable();
      this.domicilio?.disable();
      this.representanteLegal?.disable();
      if (this.form?.get('justificacion')) {
        this.form.get('justificacion')?.enable();
      }
      this.form?.get('estado')?.disable();
      this.nicoTablaForm?.get('entidad')?.disable();
      this.nicoTablaForm?.get('representacion')?.disable();
      this.domicilio?.get('regimen')?.disable();
      this.domicilio?.get('aduanasEntradas')?.disable();
    }
    
    const AVISO_CHECKBOX_VALUE = this.domicilio?.get('avisoCheckbox')?.value;
    const LICENCIA_SANITARIA_CONTROL = this.domicilio?.get('licenciaSanitaria');
    if (LICENCIA_SANITARIA_CONTROL) {
      if (AVISO_CHECKBOX_VALUE) {
        LICENCIA_SANITARIA_CONTROL.disable();
      } else {
        LICENCIA_SANITARIA_CONTROL.enable();
      }
    }
    if (this.representanteLegal) {
      this.representanteLegal.get('nombre')?.disable();
      this.representanteLegal.get('apellidoPaterno')?.disable();
      this.representanteLegal.get('apellidoMaterno')?.disable();
    }
  }
    }


  /** Guarda los datos seleccionados en el modal SCIAN */
  guardarNicoTabla(): void {
    if (this.nicoTablaForm.valid) {
      // Aquí puedes agregar la lógica para guardar los datos seleccionados
    }
  }

  /**
   * Método de destrucción del ciclo de vida del componente.
   * Libera recursos y cancela suscripciones.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crea los formularios reactivos principales del componente usando los datos del store.
   * Incluye el formulario principal, el de domicilio y el de representante legal.
   */
  crearFormulario(): void {
    this.tramite260911Query.selectTramite260911$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.form = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(12)]],
      estado: [this.solicitudState?.estado],
      municipioOAlcaldia: [this.solicitudState?.municipioOAlcaldia, [Validators.required, Validators.maxLength(120)]],
      localidad: ['', [Validators.required, Validators.pattern(REGEX_LOCALIDAD), Validators.maxLength(120)]],
      colonias: [this.solicitudState?.colonias, [Validators.maxLength(120)]],
      calle: [this.solicitudState?.calle, [Validators.required, Validators.maxLength(100)]],
      lada: [this.solicitudState?.lada, [Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(5)]],
      telefono: [this.solicitudState.telefono, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(30)]],
    });

    this.nicoTablaForm = this.fb.group({
      /**
       * @property {string} entidad
       * @description
       * Campo del formulario para la selección de la entidad federativa.
       * Se inicializa como una cadena vacía.
       */
      entidad: [this.solicitudState?.entidad, [Validators.required]],

      /**
       * @property {string} representacion
       * @description
       * Campo del formulario para la selección de la representación federal.
       * Se inicializa como una cadena vacía.
       */
      representacion: [this.solicitudState?.representacion, [Validators.required]],
    });

    this.domicilio = this.fb.group({
      avisoCheckbox: [true],
      licenciaSanitaria: [this.solicitudState?.licenciaSanitaria],
      regimen: [this.solicitudState?.regimen, [Validators.required]],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas, [Validators.required]],
      importPermitNumberCNSNS: [{ value: this.solicitudState?.importPermitNumberCNSNS, disabled: false }],
      aifaCheckbox: [true],
      manifests: [true],
    });

   

    if (this.domicilio.get('avisoCheckbox')?.value) {
      this.domicilio.get('licenciaSanitaria')?.disable();
    }

    this.domicilio.get('avisoCheckbox')?.valueChanges.subscribe((checked: boolean) => {
      const LICENCIA_SANITARIA_CONTROL = this.domicilio.get('licenciaSanitaria');
      if (checked) {
        LICENCIA_SANITARIA_CONTROL?.disable();
      } else {
        LICENCIA_SANITARIA_CONTROL?.enable();
      }
    });

    this.representanteLegal = this.fb.group({
      acuerdoPublico:  [this.solicitudState?.acuerdoPublico || '0', [Validators.required]],
      rfc: [this.solicitudState?.rfc, [Validators.required, Validators.maxLength(13)]],
      nombre: [{ value: this.solicitudState?.nombre, disabled: true }, [Validators.required]],
      apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno, disabled: true }, [Validators.required]],
      apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno, disabled: true }, [Validators.required]],
    });
     this.form.get('estado')?.disable();
    this.nicoTablaForm.get('entidad')?.disable();
    this.nicoTablaForm.get('representacion')?.disable();
    this.domicilio.get('regimen')?.disable();
    this.domicilio.get('aduanasEntradas')?.disable();
  }

  /**
   * Obtiene los datos de la tabla NICO desde el servicio y los asigna a la propiedad correspondiente.
   */
  obtenerTablaDatos(): void {
    this.domicilioDelEstablecimientoService
      .obtenerTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.nicoTablaDatos = data?.data;
      });
  }

  /**
   * Obtiene la lista de estados desde el servicio y la asigna a la propiedad correspondiente.
   */
  obtenerEstadoList(): void {
    this.domicilioDelEstablecimientoService
      .obtenerEstadoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.estado = data?.data || [];
      });
  }

  /**
   * Obtiene los datos de mercancías desde el servicio y los asigna a la propiedad correspondiente.
   */
  obtenerMercanciasDatos(): void {
    this.domicilioDelEstablecimientoService
      .obtenerMercanciasDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.mercanciasTablaDatos = data?.data || [];
      });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param FormGroup Formulario reactivo del cual se obtiene el valor.
   * @param control Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite260911Store.setTramite260911State({
      [control]: VALOR
    });
  }

  /**
   * Maneja el cambio del checkbox de manifests y lo marca como touched
   */
  onManifestsChange(): void {
    this.domicilio.get('manifests')?.markAsTouched();
    this.setValorStore(this.domicilio, 'manifests');
  }

  /**
   * Maneja el evento de input del campo codigoPostal para validar en tiempo real
   * @param event Evento de input del campo
   */
  onCodigoPostalInput(event: Event): void {
    const INPUT_ELEMENT = event.target as HTMLInputElement;
    const VALUE = INPUT_ELEMENT.value;
    const CONTROL = this.form.get('codigoPostal');
    
    if (CONTROL) {
      CONTROL.markAsTouched();
      
      // Si el valor tiene exactamente 12 caracteres, forzar el error de maxlength
      if (VALUE && VALUE.length === 12) {
        CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 12, actualLength: VALUE.length } });
      } else if (VALUE && VALUE.length < 12) {
        // Si tiene menos de 12 caracteres, remover el error de maxlength pero mantener otros errores
        const ERRORS = CONTROL.errors;
        if (ERRORS) {
          delete ERRORS['maxlength'];
          const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
          CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
        }
      }
    }
  }

    /**
     * Maneja el evento de input del campo colonias para validar en tiempo real
     * @param event Evento de input del campo
     */

    /**
     * Maneja el evento de input del campo municipioOAlcaldia para validar en tiempo real
     * @param event Evento de input del campo
     */
    onMunicipioOAlcaldiaInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.form.get('municipioOAlcaldia');
    
      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 120) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 120, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 120) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }
  /**
   * Maneja el evento de input del campo localidad para validar en tiempo real
   * @param event Evento de input del campo
   */
  onLocalidadInput(event: Event): void {
    const INPUT_ELEMENT = event.target as HTMLInputElement;
    const VALUE = INPUT_ELEMENT.value;
    const CONTROL = this.form.get('localidad');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length > 120) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 120, actualLength: VALUE.length } });
        } else {
          const ERRORS = CONTROL.errors;
          if (ERRORS && ERRORS['maxlength']) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }
    /**
     * Maneja el evento de input del campo colonias para validar en tiempo real
     * @param event Evento de input del campo
     */
    onColoniasInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.form.get('colonias');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 120) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 120, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 120) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }

    /**
     * Maneja el evento de input del campo calle para validar en tiempo real
     * @param event Evento de input del campo
     */
    onCalleInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.form.get('calle');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 100) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 100, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 100) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }
    /**
     * Maneja el evento de input del campo lada para validar en tiempo real
     * @param event Evento de input del campo
     */
    onLadaInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.form.get('lada');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 5) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 5, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 5) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }

  

/**
 * Maneja el evento de entrada en el campo de licencia sanitaria.
 * 
 * Si el valor ingresado no está vacío ni compuesto solo por espacios,
 * desmarca el checkbox 'avisoCheckbox' en el formulario 'domicilio'.
 * Luego, actualiza el valor de 'licenciaSanitaria' en el store correspondiente.
 * 
 * @param event Evento de entrada del usuario en el campo de licencia sanitaria.
 */
onLicenciaSanitariaInput(event: Event): void {
  const INPUT_ELEMENT = event.target as HTMLInputElement;
  const VALUE = INPUT_ELEMENT.value;
  if (VALUE && VALUE.trim() !== '') {
    this.domicilio.get('avisoCheckbox')?.setValue(false);
  }
  this.setValorStore(this.domicilio, 'licenciaSanitaria');
}

    /**
     * Maneja el evento de input del campo telefono para validar en tiempo real
     * @param event Evento de input del campo
     */
    onTelefonoInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.form.get('telefono');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 30) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 30, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 30) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }

    /**
     * Maneja el evento de input del campo RFC para validar en tiempo real
     * @param event Evento de input del campo
     */
    onRfcInput(event: Event): void {
      const INPUT_ELEMENT = event.target as HTMLInputElement;
      const VALUE = INPUT_ELEMENT.value;
      const CONTROL = this.representanteLegal.get('rfc');

      if (CONTROL) {
        CONTROL.markAsTouched();
        if (VALUE && VALUE.length === 13) {
          CONTROL.setErrors({ ...CONTROL.errors, maxlength: { requiredLength: 13, actualLength: VALUE.length } });
        } else if (VALUE && VALUE.length < 13) {
          const ERRORS = CONTROL.errors;
          if (ERRORS) {
            delete ERRORS['maxlength'];
            const HAS_OTHER_ERRORS = Object.keys(ERRORS).length > 0;
            CONTROL.setErrors(HAS_OTHER_ERRORS ? ERRORS : null);
          }
        }
      }
    }

 /**
   * @method loadEntidad
   * @description
   * Carga la información de las entidades federativas desde el servicio correspondiente
   * y la asigna a la propiedad local `entidad` para poblar el select en el formulario.
   * Utiliza un observable para manejar la suscripción y evitar fugas de memoria.
   *
   * @returns {void}
   */
  loadEntidad(): void {
    this.domicilioDelEstablecimientoService
      .getEntidad()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Catalogo[]) => {
        this.entidad = data;
       
       });
  }


  /**
   * @method loadRepresentacion
   * @description
   * Carga la información de las representaciones federales desde el servicio correspondiente
   * y la asigna a la propiedad local `allRepresentaciones` para mantener todas las opciones disponibles.
   * Posteriormente, actualiza las opciones de representación mostradas según la entidad seleccionada en el formulario.
   * Utiliza un observable para manejar la suscripción y evitar fugas de memoria.
   *
   * @returns {void}
   */
  loadRepresentacion(): void {
    this.domicilioDelEstablecimientoService
      .getRepresentacion()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Catalogo[]) => {
        this.allRepresentaciones = data;
      this.updateRepresentacionOptions(this.nicoTablaForm.get('entidad')?.value);
      });
  }

 /**
   * @method updateRepresentacionOptions
   * @description
   * Filtra y actualiza la lista de representaciones federales disponibles según la entidad seleccionada.
   * Si hay una entidad seleccionada, se muestran solo las representaciones relacionadas con dicha entidad.
   * Si no hay entidad seleccionada, la lista de representaciones se vacía.
   *
   * @param {Catalogo | null} selectedEntidad - Entidad federativa seleccionada en el formulario.
   * @returns {void}
   */
  public updateRepresentacionOptions(selectedEntidad: Catalogo | null): void {
    if (selectedEntidad) {
      this.representacion = this.allRepresentaciones.filter(
        (e => e.relacionadaUmtId === Number(selectedEntidad))
      );
      this.subRepresentacion = [...this.representacion];
    } else {
      this.representacion = [];
      this.subRepresentacion = [];
    }
  }
   /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.nicoTablaForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Agrega un nuevo elemento SCIAN a la lista seleccionada y emite el evento correspondiente.
   * 
   * Este método crea un objeto de configuración `TablaScianConfig` utilizando los valores
   * proporcionados en el formulario y la lista `scianNinoLista`. Luego, emite el objeto
   * creado a través del evento `scianSeleccionado` y navega hacia atrás en la ubicación actual.
   * 
   * @returns {void} No retorna ningún valor.
   */
  agregarScian(): void {
    if (this.nicoTablaForm.invalid) {
      this.nicoTablaForm.markAllAsTouched();
      return;
    }
    
    const ENTIDAD_VALUE = this.nicoTablaForm.get('entidad')?.value;
    const REPRESENTACION_VALUE = this.nicoTablaForm.get('representacion')?.value;
    
    const ENTIDAD_OBJ = this.entidad.find(e => e.id === ENTIDAD_VALUE);
    const REPRESENTACION_OBJ = this.subRepresentacion.find(r => r.id === REPRESENTACION_VALUE);
    const NEW_SCIAN: NicoInfo = {
      clave_Scian: ENTIDAD_OBJ ? ENTIDAD_OBJ.descripcion : String(ENTIDAD_VALUE),
      descripcion_Scian: REPRESENTACION_OBJ ? REPRESENTACION_OBJ.descripcion : String(REPRESENTACION_VALUE)
    };
    
    this.nicoTablaDatos = [...this.nicoTablaDatos, NEW_SCIAN];
    
    const LAST_ENTIDAD = ENTIDAD_VALUE;
    
    this.nicoTablaForm.reset();
    
    if (LAST_ENTIDAD) {
      this.nicoTablaForm.get('entidad')?.setValue(LAST_ENTIDAD);
      this.updateRepresentacionOptions(LAST_ENTIDAD);
    }
    
    if (this.bootstrapModalNicoTablaInstance && typeof this.bootstrapModalNicoTablaInstance.hide === 'function') {
      this.bootstrapModalNicoTablaInstance.hide();
    }
    document.querySelectorAll('.modal-backdrop').forEach(bd => bd.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    this.agregarModalBox = false;
  }

/**
   * Restablece el formulario SCIAN a su estado inicial.
   * Este método reinicia todos los campos del formulario SCIAN,
   * eliminando cualquier dato ingresado previamente.
   */
  limpiarScian(): void {
    this.nicoTablaForm.reset();
  }


/**
 * Valida que todos los campos requeridos en los formularios estén completos y correctos.
 * 
 * - Marca todos los controles como "tocados" si son inválidos para mostrar los errores de validación.
 * - Verifica los formularios principales: `form`, `domicilio` y `representanteLegal`.
 * 
 * @returns {boolean} `true` si todos los campos requeridos son válidos, `false` en caso contrario.
 */
public validateRequiredFields(): boolean {
    let isValid = true;
  if (this.form && this.form.invalid) {
    isValid = false;
    this.form.markAllAsTouched();
  }
  
  if (this.domicilio && this.domicilio.invalid) {
    isValid = false;
    this.domicilio.markAllAsTouched();
  }

  if (this.representanteLegal && this.representanteLegal.invalid) {
    isValid = false;
    this.representanteLegal.markAllAsTouched();
  }
  
  return isValid;
}

/**
 * Marca todos los campos de los formularios asociados como 'touched' y 'dirty', 
 * y actualiza la validez de sus valores. 
 * 
 * Este método recorre los controles de los formularios `form`, `domicilio` y `representanteLegal`, 
 * asegurando que todos los campos sean marcados como modificados y tocados, 
 * lo que puede ser útil para mostrar mensajes de validación en la interfaz de usuario.
 * 
 * @remarks
 * Útil para forzar la visualización de errores de validación en todos los campos de los formularios.
 */
public markAllFieldsTouched(): void {
 if (this.form) {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
  
  if (this.domicilio) {
    Object.values(this.domicilio.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
  
  // Mark representanteLegal form fields as touched
  if (this.representanteLegal) {
    Object.values(this.representanteLegal.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
}
    /**
   * Navega a la ubicación anterior en el historial de navegación.
   * Utiliza el servicio de ubicación para retroceder una página.
   */
  cancelar(scian: boolean = false): void {
    
    if (scian) {
      if (this.bootstrapModalNicoTablaInstance && typeof this.bootstrapModalNicoTablaInstance.hide === 'function') {
        this.bootstrapModalNicoTablaInstance.hide();
      }
      this.nicoTablaForm.reset();
      const BACKDROPS = document.querySelectorAll('.modal-backdrop');
      BACKDROPS.forEach(bd => bd.parentNode?.removeChild(bd));
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
    } else {
      if (this.bootstrapModalMercanciasInstance && typeof this.bootstrapModalMercanciasInstance.hide === 'function') {
        this.bootstrapModalMercanciasInstance.hide();
      }
    }
    this.agregarModalBox = false;
  }

  /**
   * Restablece todos los formularios reactivos del componente a sus valores iniciales.
   * Utiliza los valores actuales del store para restaurar los datos prellenados.
   */
  resetForm() {
    // Obtiene el estado actual del store para valores iniciales
    this.tramite260911Query.selectTramite260911$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.resetPrincipalForm(state);
        this.resetNicoTablaForm(state);
        this.resetDomicilioForm(state);
        this.resetRepresentanteLegalForm(state);
      });
  }

  /**
   * @private
   * Restablece el formulario principal con los valores proporcionados en el estado dado.
   * 
   * Si el formulario existe, se reinicia con los valores del estado recibido. 
   * Los campos se llenan con los valores del estado o con una cadena vacía si no están definidos.
   * 
   * @param state El estado actual del trámite, utilizado para poblar los campos del formulario.
   */
  private resetPrincipalForm(state: Tramite260911State): void {
    if (this.form) {
      this.form.reset({
        codigoPostal: state?.codigoPostal || '',
        estado: state?.estado || '',
        municipioOAlcaldia: state?.municipioOAlcaldia || '',
        localidad: '',
        colonias: state?.colonias || '',
        calle: state?.calle || '',
        lada: state?.lada || '',
        telefono: state?.telefono || ''
      });
    }
  }

  /**
   * Restablece el formulario `nicoTablaForm` con los valores proporcionados en el estado dado.
   * 
   * @param state El estado actual del trámite, utilizado para inicializar los campos del formulario.
   * 
   * @remarks
   * Si el formulario existe, se reinicia con los valores de `entidad` y `representacion` del estado.
   * Si estos valores no están definidos, se asigna una cadena vacía por defecto.
   */
  private resetNicoTablaForm(state: Tramite260911State): void {
    if (this.nicoTablaForm) {
      this.nicoTablaForm.reset({
        entidad: state?.entidad || '',
        representacion: state?.representacion || ''
      });
    }
  }

  /**
   * Restablece el formulario de domicilio con los valores proporcionados en el estado.
   * 
   * @param state El estado actual del trámite, utilizado para poblar los campos del formulario.
   * 
   * @remarks
   * - Si el formulario `domicilio` existe, se reinicia con los valores predeterminados y los valores del estado.
   * - Los campos `avisoCheckbox`, `aifaCheckbox` y `manifests` se establecen en `true` por defecto.
   * - Los campos `licenciaSanitaria`, `regimen`, `aduanasEntradas` y `importPermitNumberCNSNS` se obtienen del estado o se inicializan como cadena vacía si no están definidos.
   */
  private resetDomicilioForm(state: Tramite260911State): void {
    if (this.domicilio) {
      this.domicilio.reset({
        avisoCheckbox: true,
        licenciaSanitaria: state?.licenciaSanitaria || '',
        regimen: state?.regimen || '',
        aduanasEntradas: state?.aduanasEntradas || '',
        importPermitNumberCNSNS: state?.importPermitNumberCNSNS || '',
        aifaCheckbox: true,
        manifests: true
      });
    }
  }

  /**
   * Restablece el formulario de representante legal con los valores proporcionados en el estado.
   * 
   * @param state - El estado actual del trámite, que contiene los datos del representante legal.
   * 
   * @remarks
   * Si el formulario de representante legal existe, se reinicia con los valores del estado.
   * Si algún valor no está presente en el estado, se utiliza un valor predeterminado.
   * 
   * @compo
   * Esta función se utiliza para limpiar y establecer los valores del formulario de representante legal
   * cuando se actualiza el estado del trámite.
   */
  private resetRepresentanteLegalForm(state: Tramite260911State): void {
    if (this.representanteLegal) {
      this.representanteLegal.reset({
        acuerdoPublico: state?.acuerdoPublico || '1',
        rfc: state?.rfc || '',
        nombre: state?.nombre || '',
        apellidoPaterno: state?.apellidoPaterno || '',
        apellidoMaterno: state?.apellidoMaterno || ''
      });
    }
  }
  }