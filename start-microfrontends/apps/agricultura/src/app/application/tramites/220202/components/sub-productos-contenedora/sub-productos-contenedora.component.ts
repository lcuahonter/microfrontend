import {
  ProductoDetallaEventos,
  ProductosCatalogosDatos,
} from '../../../../shared/models/datos-de-la-solicitue.model';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilaSolicitud } from '../../models/220202/fitosanitario.model';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { SubProductosComponent } from '../../../../shared/components/sub-productos/sub-productos.component';
import { Subject } from 'rxjs';

/**
 * @description Componente que actúa como contenedor para la gestión de subproductos.
 * Proporciona la funcionalidad necesaria para manejar datos relacionados con los catálogos
 * de productos y la interacción con el formulario de solicitud de animales vivos.
 *
 * @selector app-sub-productos-contenedora
 * @standalone Este componente es independiente y puede ser utilizado sin necesidad de un módulo.
 * @imports
 * - CommonModule: Módulo común de Angular que proporciona directivas y tuberías esenciales.
 * - SubProductosComponent: Componente hijo que gestiona la lógica específica de los subproductos.
 * @templateUrl Ruta al archivo de plantilla HTML asociado al componente.
 * @styleUrl Ruta al archivo de estilos SCSS asociado al componente.
 */
@Component({
  selector: 'app-sub-productos-contenedora',
  standalone: true,
  imports: [CommonModule, SubProductosComponent],
  templateUrl: './sub-productos-contenedora.component.html',
})
export class SubProductosContenedoraComponent {
  
  /**
   * @description Datos de la solicitud que se recibirán como entrada en el componente.
   * @type {ProductosCatalogosDatos}
   * */
  public catalogosDatos: ProductosCatalogosDatos = {
    tipoRequisitoList: [],
    requisitoList: [],
    fraccionArancelariaList: [],
    nicoList: [],
    umtList: [],
    umcList: [],
    especieList: [],
    usoList: [],
    paisOrigenList: [],
    paisDeProcedenciaList: [],
    sexoList: [],
    presentacionList: [],
    cantidadPresentacionList: [],
    tipoPresentacionList: [],
    tipoPlantaList: [],
    plantaAutorizadaOrigenList: [],
  };

  /**
   * @description Subject utilizado para destruir las suscripciones y evitar fugas de memoria cuando el componente se destruye.
   * @type {Subject<void>}
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * Constructor de la clase `SubProductosContenedoraComponent`.
   *
   * Este constructor inicializa los servicios necesarios para la funcionalidad del componente.
   *
   * @param agriculturaApiService - Servicio para interactuar con la API de Agricultura.
   * @param fitosanitarioQuery - Servicio para realizar consultas relacionadas con fitosanitarios.
   * @param fitosanitarioStore - Servicio para gestionar el estado de fitosanitarios.
   *
   * Dentro del constructor, se realiza una solicitud a la API para obtener los datos de productos
   * desde el archivo `productos.json`. La respuesta de esta solicitud se asigna a la propiedad
   * `catalogosDatos` del componente.
   */
  constructor(
    public agriculturaApiService: AgriculturaApiService,
    public fitosanitarioQuery: FitosanitarioQuery,
    public fitosanitarioStore: FitosanitarioStore
  ) {
    this.agriculturaApiService
      .obtenerProductoRespuestaPorUrl('productos.json')
      .subscribe((resp) => {
        this.catalogosDatos = resp;
      });
  }

  /**
   * @description Método que se ejecuta al enviar el formulario de solicitud de animales vivos.
   * @param valor Datos del formulario de solicitud de animales vivos.
   */
  agregarDatosFormulario(valor: ProductoDetallaEventos): void {
    const DATOS: FilaSolicitud = {
      id: 0, // Asigna aquí el valor adecuado para 'id'
      noPartida: '',
      tipoRequisito: valor.formulario.tipoRequisito || '',
      requisito: valor.formulario.requisito || '',
      numeroCertificadoInternacional: '',
      fraccionArancelaria: valor.formulario.fraccionArancelaria || '',
      descripcionFraccion: valor.formulario.descripcionFraccion || '',
      idDescripcionFraccion: valor.formulario.idDescripcionFraccion || 0, 
      nico: valor.formulario.nico || '',
      descripcionNico: valor.formulario.descripcionNico || '',
      descripcion: valor.formulario.descripcion || '',
      umt: '',
      cantidadUMT: valor.formulario.cantidadUMT || '',
      umc: valor.formulario.umc || '',
      cantidadUMC: valor.formulario.cantidadUMC || '',
      uso: valor.formulario.uso || '',
      tipoDeProducto: Number(valor.formulario.tipoDeProducto) || 0,
      numeroDeLote: '',
      paisDeOrigen: '',
      paisDeProcedencia: valor.formulario.paisDeProcedencia || '',
      certificadoInternacionalElectronico: '',
    };
    this.fitosanitarioStore.update((state) => ({
      ...state,
      tablaDatos: [...state.tablaDatos, DATOS],
      selectedDatos: [],
    }));
  }
}
