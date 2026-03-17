import {

  DetalleVidaSilvestre,
} from '../../../../shared/models/datos-de-la-solicitue.model';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AnimalesEventos, DatosMercancia, FilaSolicitud } from '../../models/220202/fitosanitario.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosService } from '../../services/220202/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { MercanciaFormComponent } from '../../shared/mercancia-form/mercancia-form.component';

/**
 * @description Decorador que define un componente de Angular llamado `AnimalesVivoContenedoraComponent`.
 * Este componente es independiente (standalone) y utiliza el módulo común de Angular (`CommonModule`) 
 * y el componente `AnimalesVivoDetallesComponent` como dependencias importadas.
 * 
 * @selector `app-animales-vivo-contenedora` - Selector utilizado para instanciar este componente en una plantilla HTML.
 * 
 * @templateUrl `./animales-vivo-contenedora.component.html` - Ruta del archivo HTML que define la estructura visual del componente.
 * 
 * @styleUrl `./animales-vivo-contenedora.component.scss` - Ruta del archivo SCSS que contiene los estilos específicos del componente.
 */
@Component({
  selector: 'app-agregar-mercancia',
  standalone: true,
  imports: [CommonModule, MercanciaFormComponent],
  templateUrl: './agregar-mercancia.component.html',
})
export class AgregarMercanciaComponent implements OnDestroy{
  /**
   * Datos de la solicitud que se recibirán como entrada en el componente.
   * @type {DatosDeLaSolicitud}
   */
  public catalogosDatos: DatosMercancia ={
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
    tipoDeProductoList: []
  }

  /**
   * @description Subject utilizado para destruir las suscripciones y evitar fugas de memoria cuando el componente se destruye.
   * @type {Subject<void>}
   */
  public destroyNotifier$ = new Subject<void>();

  @Output() cerrar = new EventEmitter<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es true, los campos del formulario no serán editables por el usuario.
   */
  public formularioSolicitud!: FilaSolicitud;

  /**
   * @description Datos de la tabla principal.
   * @type {FilaSolicitud[]}
   */
  cuerpoTabla: FilaSolicitud[] = [];

  /**
   * Constructor de la clase `AnimalesVivoContenedoraComponent`.
   * 
   * Este constructor inicializa los servicios necesarios y configura las suscripciones
   * para manejar los datos relacionados con los animales vivos en el contexto de la aplicación.
   * 
   * @param agriculturaApiService Servicio para interactuar con la API de Agricultura.
   *                              Se utiliza para obtener datos desde un archivo JSON remoto.
   * @param fitosanitarioQuery Servicio de consulta para acceder al estado de los datos fitosanitarios.
   *                           Proporciona un flujo reactivo para observar cambios en el estado.
   * @param fitosanitarioStore Servicio para manejar el almacenamiento del estado fitosanitario.
   *                           Permite la gestión centralizada del estado de la aplicación.
   * 
   * @description
   * - Obtiene datos desde un archivo JSON remoto utilizando el servicio `AgriculturaApiService`.
   * - Configura una suscripción al estado reactivo proporcionado por `FitosanitarioQuery`.
   * - Actualiza las propiedades locales `cuerpoTabla` y `formularioSolicitud` basándose en los datos
   *   seleccionados del estado reactivo.
   * - Maneja la destrucción de las suscripciones utilizando `takeUntil` con un observable de notificación.
   */
  constructor(public agriculturaApiService: AgriculturaApiService,
    public fitosanitarioQuery: FitosanitarioQuery,
    public fitosanitarioStore: FitosanitarioStore,
    public catalogosService: CatalogosService

  ) {
    //ponemos la lista nico vacia por que s¿depende de lo que seleccione fracciona arancelaria
    // vamos por el catalogo de Fraccion arancelaria
    this.getFraccionArancelariaLista();
    this.getCatalogoUnidadesMedidaComerciales();
    this.getCatalogoUsosMercancia();
    this.getCatalogoTiposProducto();

    this.fitosanitarioQuery.seleccionarState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((estado) => {

          if (estado.selectedDatos[0]?.fraccionArancelaria !== undefined && estado.selectedDatos[0]?.fraccionArancelaria !== '') {
            this.getNicoFraccionArancelariaLista(estado.selectedDatos[0].fraccionArancelaria);
          }
          this.cuerpoTabla = estado.tablaDatos;
          const VALOR = estado.selectedDatos[0];
          if (VALOR) {
            this.formularioSolicitud = {
              id: VALOR.id || Math.floor(Math.random() * 1000000),
              tipoRequisito: VALOR.tipoRequisito || '',
              requisito: VALOR.requisito || '',
              descripcionTipoRequisito: VALOR.descripcionTipoRequisito || '',
              numeroCertificadoInternacional: VALOR.numeroCertificadoInternacional || '',
              fraccionArancelaria: VALOR.fraccionArancelaria || '',
              descripcionFraccion: VALOR.descripcionFraccion || '',
              idDescripcionFraccion: VALOR.idDescripcionFraccion || 0,      

              nico: VALOR.nico || '',
              descripcionNico: VALOR.descripcionNico || '',
              descripcion: VALOR.descripcion || '',
              cantidadUMT: String(VALOR.cantidadUMT || ''),
              umt: VALOR.umt || '',
              descripcionUMT: VALOR.descripcionUMT || '',
              cantidadUMC: String(VALOR.cantidadUMC || ''),
              umc: VALOR.umc || '',
              descripcionUMC: VALOR.descripcionUMC || '',
              uso: VALOR.uso || '',
              descripcionUso: VALOR.descripcionUso || '',
              paisDeOrigen: VALOR.paisDeOrigen || '',
              descripcionPaisDeOrigen: VALOR.descripcionPaisDeOrigen || '',
              paisDeProcedencia: VALOR.paisDeProcedencia || '',
              descripcionPaisDeProcedencia: VALOR.descripcionPaisDeProcedencia || '',
              noPartida: VALOR.noPartida || '',
              tipoDeProducto: VALOR.tipoDeProducto || 0,
              descripcionTipoDeProducto: VALOR.descripcionTipoDeProducto || '',
              numeroDeLote: VALOR.numeroDeLote || '',
              certificadoInternacionalElectronico: VALOR.certificadoInternacionalElectronico || '',
              detalleVidaSilvestre: VALOR.detalleVidaSilvestre || []
            };
          }
        })
      )
      .subscribe();
  }

  /**
   * @description Método que se ejecuta al enviar el formulario de solicitud de animales vivos.
   * @param valor Datos del formulario de solicitud de animales vivos.
   */
  agregarDatosFormulario(valor: AnimalesEventos): void {
    const NOMBRES_CIENTIFICOS:Catalogo[] = valor?.formulario['nombresCientificos'] as Catalogo[];
    const DATOS: FilaSolicitud = {
      id: valor.formulario.id || Math.floor(Math.random() * 1000000),
      noPartida: '',
      tipoRequisito: valor.formulario.tipoRequisito || '',
      descripcionTipoRequisito: valor.formulario.descripcionTipoRequisito || '',
      requisito: valor.formulario.requisito || '',
      numeroCertificadoInternacional: valor.formulario.numeroCertificadoInternacional || '',
      fraccionArancelaria: valor.formulario.fraccionArancelaria || '',
      descripcionFraccion: valor.formulario.descripcionFraccion || '',
      idDescripcionFraccion: valor.formulario.idDescripcionFraccion || 0,      
      nico: valor.formulario.nico || '',
      descripcionNico: valor.formulario.descripcionNico || '',
      descripcion: valor.formulario.descripcion || '',
      umt: valor.formulario.umt || '',
      descripcionUMT: valor.formulario.descripcionUMT || '',
      cantidadUMT: valor.formulario.cantidadUMT || '',
      umc: valor.formulario.umc || '',
      descripcionUMC: valor.formulario.descripcionUMC || '',
      cantidadUMC: valor.formulario.cantidadUMC || '',
      uso: valor.formulario.uso || '',
      descripcionUso: valor.formulario.descripcionUso || '',
      tipoDeProducto: Number(valor.formulario.tipoDeProducto) || 0,
      descripcionTipoDeProducto: valor.formulario.descripcionTipoDeProducto || '',
      numeroDeLote: valor.formulario.numeroDeLote || '',
      paisDeOrigen: valor.formulario.paisDeOrigen || '',
      descripcionPaisDeOrigen: valor.formulario.descripcionPaisDeOrigen || '',
      paisDeProcedencia: valor.formulario.paisDeProcedencia || '',
      descripcionPaisDeProcedencia: valor.formulario.descripcionPaisDeProcedencia || '',
      certificadoInternacionalElectronico: valor.formulario.certificadoInternacionalElectronico || '',
      detalleVidaSilvestre: NOMBRES_CIENTIFICOS.map((nombre:Catalogo):DetalleVidaSilvestre => ({
          idDetalleMercancia: 0,
          idMercanciaGob: 0,
          idVidaSilvestre: parseInt(nombre.clave ?? '0', 10),
          nombreCientifico: nombre.descripcion,
        }
      ))
    }
    this.fitosanitarioStore.update(state => {
      const INDEX = state.tablaDatos.findIndex(item => item.id === DATOS.id);

      const UPDATE_TABLA_DATOS = (
        INDEX !== -1
          ? state.tablaDatos.map((item, i) => (i === INDEX ? DATOS : item))
          : [...state.tablaDatos, DATOS]
      ).map((item, index) => ({
        ...item,
        noPartida: String(index + 1)
      }));

      return {
        ...state,
        tablaDatos: UPDATE_TABLA_DATOS,
        selectedDatos: [] 
      };
    });

  }

  /**
   * @description Obtiene la lista de fraccion arancelaria desde un archivo JSON.
   * @method getFraccionArancelariaLista
   * @returns {void}
   */
  getFraccionArancelariaLista(): void {
    this.catalogosService.obtieneCatalogoFraccionesArancelarias(220202)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (data): void => {
          this.catalogosDatos.fraccionArancelariaList = data.datos ?? [];
        }
      );

  }

  /**
     * @description Obtiene la lista de unidades de medida comerciales.
     * @method getCatalogoUnidadesMedidaComerciales
     * @returns {void}
     */
  getCatalogoUnidadesMedidaComerciales(): void {
    this.catalogosService.obtieneCatalogoUnidadesMedidaComerciales(220202)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (data): void => {
          this.catalogosDatos.umcList = data.datos ?? [];
        }
      );

  }

  /**
   * @description Obtiene la lista de catalogo de usos de mercancia.
   * @method getCatalogoUsosMercancia
   * @returns {void}
   */
  getCatalogoUsosMercancia(): void {
    this.catalogosService.obtieneCatalogoUsosMercancia(220202)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (data): void => {
          this.catalogosDatos.usoList = data.datos ?? [];
        }
      );

  }

  /**
 * @description Obtiene la lista de catalogo tipos de producto.
 * @method getCatalogoTiposProducto
 * @returns {void}
 */
  getCatalogoTiposProducto(): void {
    this.catalogosService.obtieneCatalogoTiposProducto(220202)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (data): void => {
          this.catalogosDatos.tipoDeProductoList = data.datos ?? [];
        }
      );

  }

  /**
    * @description Obtiene la lista de fraccion arancelaria desde un archivo JSON.
    * @method getFraccionArancelariaLista
    * @returns {void}
    */
  getNicoFraccionArancelariaLista(clave: string): void {
    this.catalogosService.obtieneCatalogoNicoFraccionArancelaria(220202, clave)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (data): void => {
          this.catalogosDatos.nicoList = data.datos ?? [];
        }
      );
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar recursos y suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
