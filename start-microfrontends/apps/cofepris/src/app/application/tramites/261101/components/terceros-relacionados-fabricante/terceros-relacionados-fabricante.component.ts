import {
  AlertComponent,
  ConfiguracionColumna,
  Fabricante,
  LASTABLA,
  Otros,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TercerosRelacionadosModalPopupComponent, TipoTabla, ConfiguracionModalTerceros } from '../terceros-relacionados-modal-popup/terceros-relacionados-modal-popup.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FABRICANTE_TABLA } from '../../../../shared/constantes/terceros-relacionados-fabricante.enum';
import { OTROS_TABLA } from '../../../../shared/constantes/terceros-relacionados-fabricante.enum';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * TercerosRelacionadosComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-terceros-relacionados-fabricante',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    TercerosRelacionadosModalPopupComponent,
  ],
  templateUrl: './terceros-relacionados-fabricante.component.html',
  styleUrl: './terceros-relacionados-fabricante.component.scss',
})
export class TercerosRelacionadosFabricanteComponent implements OnInit, OnDestroy {
  /**
   * Un arreglo que contiene los datos de los fabricantes (Fabricante).
   * Esto se utiliza para gestionar y mostrar información relacionada con los fabricantes
   * en el contexto de la aplicación.
   */
  public fabricanteTablaDatos: Fabricante[] = [];

  /**
   * Un arreglo de objetos `Fabricante` que representa los datos para la tabla "facturador".
   * Esta propiedad se utiliza para almacenar y gestionar la lista de fabricantes o entidades relacionadas
   * que se muestran en la tabla dentro del componente.
   */
  public facturadorTablaDatos: Fabricante[] = [];

  /**
   * Un arreglo de objetos para la tabla "proveedor/distribuidor".
   */
  public proveedorTablaDatos: Fabricante[] = [];

  /**
   * Un arreglo de objetos para la tabla "certificado analítico".
   */
  public certificadoAnaliticoTablaDatos: Fabricante[] = [];

  /**
   * Representa una colección de objetos "Otros" utilizada para almacenar datos para el componente.
   * Este arreglo se inicializa como vacío y puede ser llenado con instancias del tipo `Otros`.
   */
  public otrosTablaDatos: Otros[] = [];

  /**
   * Representa el tipo de selección de casilla de verificación utilizado en la tabla.
   * Esto se asigna desde la enumeración `TablaSeleccion.CHECKBOX`.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Tipo de tabla actual que está siendo editada
   */
  public currentTableType: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros' = 'fabricante';

  /**
   * Objeto de configuración para la tabla "Fabricante".
   * Esto se utiliza para definir las configuraciones y propiedades de la tabla
   * en el componente "Terceros Relacionados".
   */
  public configuracionFabricante: Array<{ encabezado: string; clave: keyof Fabricante }> = FABRICANTE_TABLA as Array<{ encabezado: string; clave: keyof Fabricante }>;
  /**
   * Objeto de configuración para la tabla "Otros".
   * Esta propiedad se inicializa con la constante `OTROS_TABLA`,
   * que define la estructura y configuraciones para la tabla.
   */
  public configuracionOtros: Array<{ encabezado: string; clave: keyof Otros }> = OTROS_TABLA as Array<{ encabezado: string; clave: keyof Otros }>;

  /**
   * Una propiedad pública que contiene los datos o la configuración para el componente.
   * Se le asigna el valor de `LASTABLA`, que probablemente sea una constante o variable
   * definida en otra parte de la aplicación.
   */
  public TEXTOS = LASTABLA;

  /**
   * Configuración de la tabla para los fabricantes relacionados.
   *
   * @type {ConfiguracionColumna<Fabricante>[]} Configuración de las columnas de la tabla.
   */
  public configuracionTabla: ConfiguracionColumna<Fabricante>[] =
    TercerosRelacionadosFabricanteComponent.generateConfiguracionTabla(this.configuracionFabricante);
  /**
   * @public
   * @property {ConfiguracionColumna<Fabricante>[]} configuracionFacturadorTabla
   *
   * Configuración de la tabla para los fabricantes relacionados.
   * Este arreglo se genera dinámicamente utilizando la configuración proporcionada
   * por `configuracionFabricante` a través del método `generateConfiguracionTabla`.
   */
  public configuracionFacturadorTabla: ConfiguracionColumna<Fabricante>[] =
    TercerosRelacionadosFabricanteComponent.generateConfiguracionTabla(this.configuracionFabricante);
  /**
   * Configuración de la tabla para "Proveedor".
   *
   * Esta configuración se genera dinámicamente utilizando la configuración `configuracionFabricante`
   * a través del método `generateConfiguracionTabla`.
   */
  public configuracionProveedorTabla: ConfiguracionColumna<Fabricante>[] =
    TercerosRelacionadosFabricanteComponent.generateConfiguracionTabla(this.configuracionFabricante);
  /**
   * Configuración de la tabla para el certificado analítico relacionado con los fabricantes.
   *
   * Esta propiedad utiliza la configuración proporcionada por `configuracionFabricante`
   * para generar las columnas necesarias en la tabla.
   *
   * @type {ConfiguracionColumna<Fabricante>[]} - Arreglo de configuraciones de columnas para la tabla.
   */
  public configuracionCertificadoAnaliticoTabla: ConfiguracionColumna<Fabricante>[] =
    TercerosRelacionadosFabricanteComponent.generateConfiguracionTabla(this.configuracionFabricante);
  /**
   * Configuración de la tabla para los datos de "Otros".
   *
   * @type {ConfiguracionColumna<Otros>[]} Configuración de las columnas de la tabla.
   */
  public configuracionOtrosTabla: ConfiguracionColumna<Otros>[] =
    TercerosRelacionadosFabricanteComponent.generateConfiguracionTablaOtros(this.configuracionOtros);
  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado del modal para agregar/editar fabricante
   */
  public mostrarModalFabricante: boolean = false;

  /**
   * Configuración del modal para fabricante
   */
  public configuracionModalFabricante: ConfiguracionModalTerceros | null = null;

  /**
   * Modo del modal: 'agregar' o 'editar'
   */
  public modoModal: 'agregar' | 'modificar' = 'agregar';

  /**
   * Datos para edición (cuando se está editando un fabricante existente)
   */
  public datosEdicion?: any;

  /**
   * Selected items for each table (stores the actual data and index)
   */
  public selectedItemFabricante: { data: any, index: number } | null = null;
  public selectedItemFacturador: { data: any, index: number } | null = null;
  public selectedItemProveedor: { data: any, index: number } | null = null;
  public selectedItemCertificado: { data: any, index: number } | null = null;
  public selectedItemOtros: { data: any, index: number } | null = null;

  /**
   * Constructor para SolicitanteComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery
  ) {
    // Ensure modal starts closed
    this.mostrarModalFabricante = false;
    
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState: { readonly: boolean })=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
      })
    )
    .subscribe()
  }

  ngOnInit(): void {
    // Explicitly ensure modal is closed on initialization
    this.mostrarModalFabricante = false;
    // Initialize modal configuration after component initialization
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Genera un arreglo de configuración para una tabla basado en el arreglo de datos proporcionado.
   *
   * @template T - El tipo de los objetos en la tabla.
   * @param datosArray - Un arreglo de objetos que contiene la configuración de las columnas de la tabla.
   * Cada objeto debe tener las siguientes propiedades:
   *   - `encabezado`: El texto del encabezado para la columna.
   *   - `clave`: La clave de la propiedad en el objeto de datos que se mostrará en la columna.
   * @returns Un arreglo de configuraciones de columnas, donde cada configuración incluye:
   *   - `encabezado`: El texto del encabezado para la columna.
   *   - `clave`: Una función que obtiene el valor de la clave especificada de un objeto de datos.
   *   - `orden`: El orden de la columna, comenzando desde 1.
   */
  static generateConfiguracionTabla(datosArray: Array<{ encabezado: string; clave: keyof Fabricante }>): ConfiguracionColumna<Fabricante>[] {
    return datosArray.map((field, index) => ({
      encabezado: field.encabezado,
      clave: (item: Fabricante) => item[field.clave] ?? undefined,
      orden: index + 1,
    }));
  }

  /**
   * Genera un arreglo de configuración para una tabla de "Otros" basado en el arreglo de datos proporcionado.
   *
   * @param datosArray - Un arreglo de objetos que contiene la configuración de las columnas de la tabla.
   * @returns Un arreglo de configuraciones de columnas para el tipo Otros.
   */
  static generateConfiguracionTablaOtros(datosArray: Array<{ encabezado: string; clave: keyof Otros }>): ConfiguracionColumna<Otros>[] {
    return datosArray.map((field, index) => ({
      encabezado: field.encabezado,
      clave: (item: Otros) => item[field.clave] ?? undefined,
      orden: index + 1,
    }));
  }

  /**
   * Abre el modal para agregar un nuevo tercero a la tabla especificada
   */
  agregarTercero(tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): void {
    this.currentTableType = tipoTabla;
    this.modoModal = 'agregar';
    // Configurar el modal según el tipo de tabla
    this.configuracionModalFabricante = this.getModalConfiguration(tipoTabla);
    this.datosEdicion = undefined;
    this.mostrarModalFabricante = true;
  }

  /**
   * Obtiene la configuración del modal según el tipo de tabla
   */
  private getModalConfiguration(tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): ConfiguracionModalTerceros {
    const configuraciones = {
      fabricante: {
        tipo: TipoTabla.FABRICANTE,
        titulo: 'Fabricante',
        camposRequeridos: ['denominacionRazonSocial', 'pais', 'calle']
      },
      facturador: {
        tipo: TipoTabla.FABRICANTE, // Mismo tipo pero diferente título
        titulo: 'Facturador',
        camposRequeridos: ['denominacionRazonSocial', 'pais', 'calle']
      },
      proveedor: {
        tipo: TipoTabla.PROVEEDOR,
        titulo: 'Proveedor/Distribuidor',
        camposRequeridos: ['denominacionRazonSocial', 'pais']
      },
      certificado: {
        tipo: TipoTabla.OTROS,
        titulo: 'Certificado Analítico',
        camposRequeridos: ['denominacionRazonSocial']
      },
      otros: {
        tipo: TipoTabla.OTROS,
        titulo: 'Otros',
        camposRequeridos: ['denominacionRazonSocial']
      }
    };

    const config = configuraciones[tipoTabla] || configuraciones.fabricante;
    return {
      ...config,
      mostrarNacionalidad: true,
      mostrarTipoPersona: true
    };
  }

  /**
   * Método de compatibilidad - mantiene la funcionalidad anterior
   * @deprecated Use agregarTercero('fabricante') instead
   */
  agregarFabricante(): void {
    this.agregarTercero('fabricante');
  }

  /**
   * Abre el modal para editar un tercero existente
   */
  editarTercero(datos: any, tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): void {
    this.currentTableType = tipoTabla;
    this.modoModal = 'modificar';
    this.configuracionModalFabricante = this.getModalConfiguration(tipoTabla);
    this.datosEdicion = datos;
    this.mostrarModalFabricante = true;
  }

  /**
   * Método de compatibilidad - mantiene la funcionalidad anterior
   * @deprecated Use editarTercero(datos, 'fabricante') instead
   */
  editarFabricante(datos: any): void {
    this.editarTercero(datos, 'fabricante');
  }

  /**
   * Maneja el evento de guardar datos del modal
   */
  onRowClick(rowData: any, tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): void {
    let tableData: any[];
    
    // Get the appropriate table data
    switch (tipoTabla) {
      case 'fabricante':
        tableData = this.fabricanteTablaDatos;
        break;
      case 'facturador':
        tableData = this.facturadorTablaDatos;
        break;
      case 'proveedor':
        tableData = this.proveedorTablaDatos;
        break;
      case 'certificado':
        tableData = this.certificadoAnaliticoTablaDatos;
        break;
      case 'otros':
        tableData = this.otrosTablaDatos;
        break;
      default:
        return;
    }

    // Find the index of the clicked row
    const index = tableData.findIndex(item => item === rowData);
    
    if (index !== -1) {
      // Store the selected item and its index
      const selectedItem = { data: rowData, index: index };
      
      switch (tipoTabla) {
        case 'fabricante':
          this.selectedItemFabricante = selectedItem;
          // Clear other selections
          this.selectedItemFacturador = null;
          this.selectedItemProveedor = null;
          this.selectedItemCertificado = null;
          this.selectedItemOtros = null;
          break;
        case 'facturador':
          this.selectedItemFacturador = selectedItem;
          this.selectedItemFabricante = null;
          this.selectedItemProveedor = null;
          this.selectedItemCertificado = null;
          this.selectedItemOtros = null;
          break;
        case 'proveedor':
          this.selectedItemProveedor = selectedItem;
          this.selectedItemFabricante = null;
          this.selectedItemFacturador = null;
          this.selectedItemCertificado = null;
          this.selectedItemOtros = null;
          break;
        case 'certificado':
          this.selectedItemCertificado = selectedItem;
          this.selectedItemFabricante = null;
          this.selectedItemFacturador = null;
          this.selectedItemProveedor = null;
          this.selectedItemOtros = null;
          break;
        case 'otros':
          this.selectedItemOtros = selectedItem;
          this.selectedItemFabricante = null;
          this.selectedItemFacturador = null;
          this.selectedItemProveedor = null;
          this.selectedItemCertificado = null;
          break;
      }
    }
  }

  /**
   * Modifica el tercero seleccionado
   */
  modificarTerceroSeleccionado(tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): void {
    let selectedItem: { data: any, index: number } | null = null;

    // Get the selected item for the table type
    switch (tipoTabla) {
      case 'fabricante':
        selectedItem = this.selectedItemFabricante;
        break;
      case 'facturador':
        selectedItem = this.selectedItemFacturador;
        break;
      case 'proveedor':
        selectedItem = this.selectedItemProveedor;
        break;
      case 'certificado':
        selectedItem = this.selectedItemCertificado;
        break;
      case 'otros':
        selectedItem = this.selectedItemOtros;
        break;
    }

    if (!selectedItem) {
      return;
    }

    // Map the data back to form format
    const datosParaEdicion = {
      denominacionRazonSocial: selectedItem.data.nombre,
      pais: selectedItem.data.pais,
      estadoLocalidad: selectedItem.data.estadoLocalidad,
      codigoPostaloEquivalente: selectedItem.data.codigoPostaloEquivalente,
      calle: selectedItem.data.calle,
      numeroExterior: selectedItem.data.numeroExterior,
      numeroInterior: selectedItem.data.numeroInterior,
      lada: selectedItem.data.lada,
      telefono: selectedItem.data.telefono,
      correoElectronico: selectedItem.data.correoElectronico,
      _originalIndex: selectedItem.index
    };

    this.currentTableType = tipoTabla;
    this.modoModal = 'modificar';
    this.configuracionModalFabricante = this.getModalConfiguration(tipoTabla);
    this.datosEdicion = datosParaEdicion;
    this.mostrarModalFabricante = true;
  }

  /**
   * Elimina el tercero seleccionado
   */
  eliminarTerceroSeleccionado(tipoTabla: 'fabricante' | 'facturador' | 'proveedor' | 'certificado' | 'otros'): void {
    let selectedItem: { data: any, index: number } | null = null;

    // Get the selected item for the table type
    switch (tipoTabla) {
      case 'fabricante':
        selectedItem = this.selectedItemFabricante;
        break;
      case 'facturador':
        selectedItem = this.selectedItemFacturador;
        break;
      case 'proveedor':
        selectedItem = this.selectedItemProveedor;
        break;
      case 'certificado':
        selectedItem = this.selectedItemCertificado;
        break;
      case 'otros':
        selectedItem = this.selectedItemOtros;
        break;
    }

    if (!selectedItem) {
      return;
    }

    // Remove the item from the corresponding table
    switch (tipoTabla) {
      case 'fabricante':
        this.fabricanteTablaDatos = this.fabricanteTablaDatos.filter((_, index) => index !== selectedItem!.index);
        this.selectedItemFabricante = null;
        break;
      case 'facturador':
        this.facturadorTablaDatos = this.facturadorTablaDatos.filter((_, index) => index !== selectedItem!.index);
        this.selectedItemFacturador = null;
        break;
      case 'proveedor':
        this.proveedorTablaDatos = this.proveedorTablaDatos.filter((_, index) => index !== selectedItem!.index);
        this.selectedItemProveedor = null;
        break;
      case 'certificado':
        this.certificadoAnaliticoTablaDatos = this.certificadoAnaliticoTablaDatos.filter((_, index) => index !== selectedItem!.index);
        this.selectedItemCertificado = null;
        break;
      case 'otros':
        this.otrosTablaDatos = this.otrosTablaDatos.filter((_, index) => index !== selectedItem!.index);
        this.selectedItemOtros = null;
        break;
    }
  }

  /**
   * Maneja el evento de guardar datos del modal
   */
  onGuardarFabricante(datos: any): void {  
    if (datos.modo === 'agregar') {
      // Agregar nuevo registro a la tabla correspondiente
      this.addToCorrectTable(datos);
    } else if (datos.modo === 'modificar') {
      // Actualizar registro existente en la tabla correspondiente
      this.updateInCorrectTable(datos);
    }
    this.mostrarModalFabricante = false;
  }

  /**
   * Agrega un nuevo registro a la tabla correcta según currentTableType
   */
  private addToCorrectTable(datos: any): void {
    switch (this.currentTableType) {
      case 'fabricante':
        this.fabricanteTablaDatos = [...this.fabricanteTablaDatos, datos];
        break;
      case 'facturador':
        this.facturadorTablaDatos = [...this.facturadorTablaDatos, datos];
        break;
      case 'proveedor':
        this.proveedorTablaDatos = [...this.proveedorTablaDatos, datos];
        break;
      case 'certificado':
        this.certificadoAnaliticoTablaDatos = [...this.certificadoAnaliticoTablaDatos, datos];
        break;
      case 'otros':
        this.otrosTablaDatos = [...this.otrosTablaDatos, datos];
        break;
    }
  }

  /**
   * Actualiza un registro en la tabla correcta según currentTableType
   */
  private updateInCorrectTable(datos: any): void {
    const originalIndex = datos._originalIndex;
    if (originalIndex === undefined) {
      return;
    }

    // Update the record in the corresponding table by preserving existing structure
    switch (this.currentTableType) {
      case 'fabricante':
        if (originalIndex >= 0 && originalIndex < this.fabricanteTablaDatos.length) {
          const originalItem = this.fabricanteTablaDatos[originalIndex];
          const updatedItem: Fabricante = {
            ...originalItem, // Preserve existing fields
            nombre: datos.nombre,
            pais: datos.pais,
            estado: datos.estadoLocalidad, // Map estadoLocalidad to estado
            cp: datos.codigoPostaloEquivalente, // Map codigoPostaloEquivalente to cp
            calle: datos.calle,
            numeroExterior: datos.numeroExterior,
            numeroInterior: datos.numeroInterior,
            telefono: datos.telefono,
            correoElectronico: datos.correoElectronico
          };
          
          this.fabricanteTablaDatos = [
            ...this.fabricanteTablaDatos.slice(0, originalIndex),
            updatedItem,
            ...this.fabricanteTablaDatos.slice(originalIndex + 1)
          ];
          this.selectedItemFabricante = null;
        }
        break;
      case 'facturador':
        if (originalIndex >= 0 && originalIndex < this.facturadorTablaDatos.length) {
          const originalItem = this.facturadorTablaDatos[originalIndex];
          const updatedItem: Fabricante = {
            ...originalItem, // Preserve existing fields
            nombre: datos.nombre,
            pais: datos.pais,
            estado: datos.estadoLocalidad, // Map estadoLocalidad to estado
            cp: datos.codigoPostaloEquivalente, // Map codigoPostaloEquivalente to cp
            calle: datos.calle,
            numeroExterior: datos.numeroExterior,
            numeroInterior: datos.numeroInterior,
            telefono: datos.telefono,
            correoElectronico: datos.correoElectronico
          };
          
          this.facturadorTablaDatos = [
            ...this.facturadorTablaDatos.slice(0, originalIndex),
            updatedItem,
            ...this.facturadorTablaDatos.slice(originalIndex + 1)
          ];
          this.selectedItemFacturador = null;
        }
        break;
      case 'proveedor':
        if (originalIndex >= 0 && originalIndex < this.proveedorTablaDatos.length) {
          const originalItem = this.proveedorTablaDatos[originalIndex];
          const updatedItem: Fabricante = {
            ...originalItem, // Preserve existing fields
            nombre: datos.nombre,
            pais: datos.pais,
            estado: datos.estadoLocalidad, // Map estadoLocalidad to estado
            cp: datos.codigoPostaloEquivalente, // Map codigoPostaloEquivalente to cp
            calle: datos.calle,
            numeroExterior: datos.numeroExterior,
            numeroInterior: datos.numeroInterior,
            telefono: datos.telefono,
            correoElectronico: datos.correoElectronico
          };
          
          this.proveedorTablaDatos = [
            ...this.proveedorTablaDatos.slice(0, originalIndex),
            updatedItem,
            ...this.proveedorTablaDatos.slice(originalIndex + 1)
          ];
          this.selectedItemProveedor = null;
        }
        break;
      case 'certificado':
        if (originalIndex >= 0 && originalIndex < this.certificadoAnaliticoTablaDatos.length) {
          const originalItem = this.certificadoAnaliticoTablaDatos[originalIndex];
          const updatedItem: Fabricante = {
            ...originalItem, // Preserve existing fields
            nombre: datos.nombre,
            pais: datos.pais,
            estado: datos.estadoLocalidad, // Map estadoLocalidad to estado
            cp: datos.codigoPostaloEquivalente, // Map codigoPostaloEquivalente to cp
            calle: datos.calle,
            numeroExterior: datos.numeroExterior,
            numeroInterior: datos.numeroInterior,
            telefono: datos.telefono,
            correoElectronico: datos.correoElectronico
          };
          
          this.certificadoAnaliticoTablaDatos = [
            ...this.certificadoAnaliticoTablaDatos.slice(0, originalIndex),
            updatedItem,
            ...this.certificadoAnaliticoTablaDatos.slice(originalIndex + 1)
          ];
          this.selectedItemCertificado = null;
        }
        break;
      case 'otros':
        if (originalIndex >= 0 && originalIndex < this.otrosTablaDatos.length) {
          const originalItem = this.otrosTablaDatos[originalIndex];
          const updatedItem: Otros = {
            ...originalItem, // Preserve existing fields
            nombre: datos.nombre,
            pais: datos.pais,
            estado: datos.estadoLocalidad, // Map estadoLocalidad to estado
            cp: datos.codigoPostaloEquivalente, // Map codigoPostaloEquivalente to cp
            calle: datos.calle,
            numeroExterior: datos.numeroExterior,
            numeroInterior: datos.numeroInterior,
            telefono: datos.telefono,
            correoElectronico: datos.correoElectronico
          };
          
          this.otrosTablaDatos = [
            ...this.otrosTablaDatos.slice(0, originalIndex),
            updatedItem,
            ...this.otrosTablaDatos.slice(originalIndex + 1)
          ];
          this.selectedItemOtros = null;
        }
        break;
    }
  }

  /**
   * Maneja el evento de cancelar del modal
   */
  onCancelarModal(): void {
    this.mostrarModalFabricante = false;
  }

  /**
   * Maneja el evento de cerrar del modal
   */
  onCerrarModal(): void {
    this.mostrarModalFabricante = false;
  }
}
