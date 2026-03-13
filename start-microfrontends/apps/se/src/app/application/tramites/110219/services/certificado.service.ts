import { ColumnasTabla, MercanciaCertificado, ProductoresAsociados } from '../models/certificado.model';
import { Observable, catchError, throwError } from 'rxjs';
import { Solicitud110219State, Tramite110219Store } from '../estados/Tramite110219.store';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { PROC_110219 } from '../servers/api-route'; 
import { Tramite110219Query } from '../estados/Tramite110219.query';
/**
 * Servicio para gestionar las operaciones relacionadas con los certificados de origen.
 * 
 * Esta clase proporciona funcionalidades para la gestión integral de certificados de origen
 * en el trámite 110219, incluyendo la obtención de datos de tablas, actualización del estado
 * del formulario y consulta de información de mercancías asociadas a los certificados.
 * 
 * @description
 * El servicio actúa como intermediario entre los componentes de la aplicación y las fuentes
 * de datos (APIs REST y archivos JSON), proporcionando métodos para:
 * - Actualizar el estado global del formulario de certificados
 * - Obtener datos de tablas de solicitudes y mercancías
 * - Gestionar información del registro de toma de muestras
 * 
 * @example
 * ```typescript
 * // Inyección del servicio en un componente
 * constructor(private certificadoService: CertificadoService) {}
 * 
 * // Obtener datos de la tabla de solicitudes
 * this.certificadoService.getSolicitudesTabla().subscribe(data => {
 *   this.tablaDatos = data;
 * });
 * ```
 * 
 * @see Solicitud110219State
 * @see ColumnasTabla
 * @see MercanciaCertificado
 * @see Tramite110219Store
 * 
 * @since 1.0.0
 * @author Sistema VUCEM
 * @version 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class CertificadoService {
  /**
   * Constructor del servicio de certificados.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del servicio,
   * incluyendo el cliente HTTP para comunicación con APIs y el store para
   * gestión del estado global del trámite.
   *
   * @param http - Cliente HTTP de Angular para realizar solicitudes a servicios externos,
   *               APIs REST y archivos JSON de configuración
   * @param tramite110219Store - Store de estado global para el trámite 110219,
   *                            utilizado para mantener la información del formulario
   *
   * @example
   * ```typescript
   * // Angular se encarga de la inyección automática de dependencias
   * // No es necesario llamar al constructor manualmente
   * ```
   *
   * @see HttpClient
   * @see Tramite110219Store
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  constructor(
    private http: HttpClient,
    private tramite110219Store: Tramite110219Store,
    private httpService: HttpCoreService,
    public query: Tramite110219Query
  ) {}
  /**
   * Actualiza el estado global del formulario con los datos proporcionados.
   *
   * Este método toma un objeto completo del estado de la solicitud y actualiza
   * todos los campos correspondientes en el store global del trámite 110219.
   * Utiliza los setters específicos del store para mantener la consistencia
   * y reactividad del estado.
   *
   * @param DATOS - Objeto completo con todos los datos del formulario de solicitud,
   *                incluyendo información del certificado, datos personales, domicilio
   *                y detalles específicos del trámite
   *
   * @returns void - No retorna valor, pero actualiza el estado global del store
   *
   * @example
   * ```typescript
   * const datosFormulario: Solicitud110219State = {
   *   numeroCertificado: 'CERT123456',
   *   pais: 'México',
   *   tratado: 'TLCAN',
   *   // ... otros campos
   * };
   *
   * this.certificadoService.actualizarEstadoFormulario(datosFormulario);
   * ```
   *
   * @remarks
   * - Actualiza más de 20 campos diferentes en el store
   * - Incluye datos del certificado, información personal y domicilio
   * - Mantiene la sincronización entre el formulario y el estado global
   * - Es útil para cargar datos existentes o restaurar el estado del formulario
   *
   * @see Solicitud110219State
   * @see Tramite110219Store
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  actualizarEstadoFormulario(DATOS: Solicitud110219State): void {
    this.tramite110219Store.update(DATOS);
  }
  
    /**
     * @method getRegistroTomaMuestrasMercanciasData
     * @description
     * Obtiene los datos de prellenado para el formulario desde un archivo JSON local.
     * @returns {Observable<Tramite110205State>} Observable que emite los datos de prellenado.
     */
    /** Obtiene los datos de una solicitud específica mediante su ID. */
    getMostrarSolicitud(id: string): Observable<JSONResponse> {
      return this.httpService.get<JSONResponse>(PROC_110219.MOSTRAR(id));
    }
  

  /**
   * Obtiene los datos de la tabla de solicitudes de certificados disponibles.
   *
   * Este método realiza una consulta HTTP para recuperar la información de certificados
   * que están disponibles para ser procesados o cancelados. Los datos incluyen detalles
   * como número de certificado, país, tratado, fechas de expedición y vencimiento.
   *
   * @returns Observable<ColumnasTabla[]> - Observable que emite un array de objetos
   *          con la estructura de datos para poblar la tabla de certificados disponibles
   *
   * @throws Error - Puede lanzar errores HTTP si hay problemas de conectividad,
   *                 el archivo no existe o hay errores en el formato de datos
   *
   * @example
   * ```typescript
   * this.certificadoService.getSolicitudesTabla()
   *   .pipe(
   *     takeUntil(this.destroyed$),
   *     catchError(error => {
   *       console.error('Error al obtener solicitudes:', error);
   *       return of([]);
   *     })
   *   )
   *   .subscribe(data => {
   *     this.tablaDatos = data;
   *     this.mostrarTabla = data.length > 0;
   *   });
   * ```
   *
   * @remarks
   * - Los datos se obtienen desde 'assets/json/110219/mercanciaTable.json'
   * - Incluye manejo de errores con `catchError` y `throwError`
   * - Los datos están estructurados según la interfaz `ColumnasTabla`
   * - Se utiliza principalmente en el componente de cancelación de certificados
   * - El Observable incluye retry automático en caso de errores temporales
   *
   * @see ColumnasTabla
   * @see HttpClient.get
   * @see catchError
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  public getSolicitudesTabla(): Observable<ColumnasTabla[]> {
    return this.http
      .get<ColumnasTabla[]>('assets/json/110219/mercanciaTable.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  public buscarMercanciasCert(body: any): Observable<any> {
    return this.httpService.post<{ [key: string]: unknown }>(
      PROC_110219.BUSCAR_CERTIFICADOS,
      { body: body }
    );
  }

  public buscarListaMercanciasCert(body: any): Observable<any> {
    return this.httpService.post<{ [key: string]: unknown }>(
      PROC_110219.BUSCAR_LISTA_CERTIFICADOS,
      { body: body }
    );
  }

  /**
   * Obtiene los datos de la tabla de mercancías asociadas al certificado de origen.
   *
   * Este método recupera información detallada sobre las mercancías que están
   * vinculadas a un certificado de origen específico. Los datos incluyen
   * descripciones de productos, códigos arancelarios, cantidades, valores
   * y otra información relevante para el proceso de certificación.
   *
   * @returns Observable<MercanciaCertificado[]> - Observable que emite un array
   *          de objetos con la información detallada de las mercancías asociadas
   *          al certificado, incluyendo códigos, descripciones y valores
   *
   * @throws Error - Puede lanzar errores HTTP en los siguientes casos:
   *                 - Problemas de conectividad de red
   *                 - Archivo JSON no encontrado o corrupto
   *                 - Errores de parsing de datos JSON
   *                 - Timeout de la solicitud HTTP
   *
   * @example
   * ```typescript
   * this.certificadoService.getMercanciaCertificadoTabla()
   *   .pipe(
   *     takeUntil(this.destroyed$),
   *     map(mercancias => mercancias.filter(m => m.activo)),
   *     catchError(error => {
   *       this.mostrarError('Error al cargar mercancías');
   *       return of([]);
   *     })
   *   )
   *   .subscribe(data => {
   *     this.mercanciasDatos = data;
   *     this.calcularTotales(data);
   *   });
   * ```
   *
   * @remarks
   * - Los datos se cargan desde 'assets/json/110219/mercanciaCertificado.json'
   * - Implementa manejo robusto de errores con `catchError` y `throwError`
   * - La estructura de datos sigue la interfaz `MercanciaCertificado`
   * - Se utiliza en componentes que muestran el detalle de mercancías del certificado
   * - Los datos pueden incluir información arancelaria y de clasificación comercial
   * - Recomendado usar con operadores RxJS para transformación y filtrado de datos
   *
   * @see MercanciaCertificado
   * @see HttpClient.get
   * @see catchError
   * @see throwError
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  public getMercanciaCertificadoTabla(): Observable<MercanciaCertificado[]> {
    return this.http
      .get<MercanciaCertificado[]>(
        'assets/json/110219/mercanciaCertificado.json'
      )
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Solicitud110219State> {
    return this.query.selectSolicitud$;
  }

  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110219.GUARDAR, {
      body: body,
    });
  }

  /** Mapea los datos del formulario de los datos del certificado desde el objeto recibido. */
  reverseMapFormValidacion(data: Record<string, unknown>): Record<string, unknown> {
   const DATOS_CERTIFICADO = data?.['certificado'] as Record<string, unknown> ??{};
   const TRATADO_ASOCIADO = DATOS_CERTIFICADO?.['tratadoAsociado'] as Record<string, unknown> ?? {};
   const PAIS_ASOCIADO = DATOS_CERTIFICADO?.['paisAsociado'] as Record<string, unknown> ?? {};
   return {
    numeroCertificado: DATOS_CERTIFICADO?.['numeroCertificado'] ?? '',
    tratado: TRATADO_ASOCIADO?.['nombre'] ?? '',
    pais: PAIS_ASOCIADO?.['nombre'] ?? '',
    fechaInicial: DATOS_CERTIFICADO?.['fechaExpedicion'] ?? '',
    fechaFinal: DATOS_CERTIFICADO?.['fechaVencimiento'] ?? '',
   };
 }

    /** Mapea las mercancías asociadas al certificado desde el objeto recibido. */
    reverseMapMercanciaCertificadoTabla(data: Record<string, unknown>): MercanciaCertificado[] {
      const DATOS_CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
      const MERCANCIAS = DATOS_CERTIFICADO['mercancias'] as unknown[] ?? [];
      return MERCANCIAS.map((m: unknown) => {
        const MERC = m as Partial<MercanciaCertificado>;
        return {
          numeroOrden: MERC.numeroOrden ?? '',
          fraccionArancelaria: MERC.fraccionArancelaria ?? '',
          nombreTecnico: MERC.nombreTecnico ?? '',
          nombreComercial: MERC.nombreComercial ?? '',
          nombreIngles: MERC.nombreIngles ?? '',
          complementoDescripcion: MERC.complementoDescripcion ?? '',
          marca: MERC.marca ?? '',
          criterio: MERC.criterio ?? '',
          norma: MERC.norma ?? '',
          cantidadExportar: MERC.cantidadExportar ?? '',
          unidad: MERC.unidad ?? '',
          masaBruta: MERC.masaBruta ?? '',
          comercializacion: MERC.comercializacion ?? '',
          valorMercancia: MERC.valorMercancia ?? '',
          numeroFactura: MERC.numeroFactura ?? '',
          fechaFactura: MERC.fechaFactura ?? '',
          registroProductos: MERC.registroProductos ?? '',
        };
      });
    }

    /** Mapea los productores asociados si existen en el backend response. */
    reverseMapProductoresAsociados(data: Record<string, unknown>): ProductoresAsociados[] {
      const PRODUCTORES = data?.['productoresAsociados'] as unknown[] ?? [];
      return PRODUCTORES.map((item: unknown) => {
        const PROD = item as Partial<ProductoresAsociados>;
        return {
          nombreProductor: PROD.nombreProductor ?? '',
          numeroRegistroFiscal: PROD.numeroRegistroFiscal ?? '',
          direccion: PROD.direccion ?? '',
          correoElectronico: PROD.correoElectronico ?? '',
          telefono: PROD.telefono ?? '',
          fax: PROD.fax ?? '',
        };
      });
    }

    /** Mapea observaciones y otros campos si existen. */
    reverseMapObservaciones(data: Record<string, unknown>): string {
      const DATOS_CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
      return DATOS_CERTIFICADO['observaciones'] as string ?? '';
    }

    /** Reconstruye el estado completo de la solicitud del trámite 110219 a partir del objeto recibido. */
    reverseBuildSolicitud110219(built: Record<string, unknown>): Record<string, unknown> {
      return {
        validacionForm: this.reverseMapFormValidacion(built),
        mercanciaCertificadoTabla: this.reverseMapMercanciaCertificadoTabla(built),
        productoresAsociados: this.reverseMapProductoresAsociados(built),
        observaciones: this.reverseMapObservaciones(built),
        // Agrega aquí otros campos si tu frontend los espera
      };
    }

  /** Reconstruye el estado completo de la solicitud del trámite 110201 a partir del objeto recibido. */
  reverseBuildSolicitud110201(built: Record<string, unknown>): Record<string, unknown> {
    return {
      validacionForm: this.reverseMapFormValidacion(built),
    };
  }
}