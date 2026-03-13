import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoServices, Fabricante, MercanciasDatos, Otros, ScianDatos } from '@libs/shared/data-access-user/src';
import { Observable,catchError, map, throwError } from 'rxjs';
import { Solicitud2603State, Tramite2603Store } from '../../estados/stores/2603/tramite2603.store';
import { EstadoCatalogResponse } from '@libs/shared/data-access-user/src/core/models/shared2603/certificados-licencias-permisos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Decorador Injectable que indica que este servicio puede ser inyectado en otros componentes o servicios.
// providedIn: 'root' significa que el servicio estará disponible en toda la aplicación.
@Injectable({
  providedIn: 'root'
})
// Definición de la clase del servicio para certificados, licencias y permisos.
export class CertificadosLicenciasPermisosService {

  /**
   * Constructor del servicio para manejar solicitudes HTTP relacionadas con 
   * certificados, licencias y permisos.
   * 
   * @param http - La instancia de HttpClient utilizada para realizar operaciones HTTP.
   */
  constructor(private http: HttpClient,private tramite2603Store:Tramite2603Store, private catalogoServices: CatalogoServices) { 
    //
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * 
   * @param DATOS - Objeto de tipo Solicitud2603State que contiene los datos a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Solicitud2603State): void {
    // Datos generales del solicitante
    this.tramite2603Store.setDenominacionRazon(DATOS.denominacionRazon);
    this.tramite2603Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite2603Store.setEstado(DATOS.estado);
    this.tramite2603Store.setMunicipio(DATOS.municipio);
    this.tramite2603Store.setLocalidad(DATOS.localidad);
    this.tramite2603Store.setColonia(DATOS.colonia);
    this.tramite2603Store.setCalleYNumero(DATOS.calleYNumero);
    this.tramite2603Store.setCorreoElecronico(DATOS.correoElecronico);
    this.tramite2603Store.setLada(DATOS.lada);
    this.tramite2603Store.setTelefono(DATOS.telefono);

    // Información del trámite
    this.tramite2603Store.setClaveScianModal(DATOS.claveScianModal);
    this.tramite2603Store.setAvisoDeFuncionamiento(DATOS.avisoDeFuncionamiento);
    this.tramite2603Store.setClave(DATOS.clave);
    this.tramite2603Store.setDescripcion(DATOS.descripcion);
    this.tramite2603Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite2603Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite2603Store.setRegimen(DATOS.regimen);
    this.tramite2603Store.setRegimenDestinara(DATOS.regimenDestinara);
    this.tramite2603Store.setAduanasEntradas(DATOS.aduana);
    this.tramite2603Store.setNumeroPermiso(DATOS.numeroPermiso);

    // Datos adicionales
    this.tramite2603Store.setManifiestos(DATOS.manifiestos);
    this.tramite2603Store.setLosDatosNo(DATOS.losDatosNo);
    this.tramite2603Store.setNombreORazon(DATOS.nombreORazon);

    // Información del producto
    this.tramite2603Store.setClasificacion(DATOS.clasificacion);
    this.tramite2603Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite2603Store.setDenominacionEspecifica(DATOS.denominacionEspecifica);
    this.tramite2603Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);
    this.tramite2603Store.setDenominacionComun(DATOS.denominacionComun);
    this.tramite2603Store.setTipoDeProducto(DATOS.tipoDeProducto);
    this.tramite2603Store.setEspecifique(DATOS.especifique);
    this.tramite2603Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite2603Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite2603Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite2603Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite2603Store.setUMT(DATOS.UMT);
    this.tramite2603Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite2603Store.setUMC(DATOS.UMC);
    this.tramite2603Store.setPresentacion(DATOS.presentacion);
    this.tramite2603Store.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite2603Store.setFechaCaducidad(DATOS.fechaCaducidad);
    this.tramite2603Store.setCumplimiento(DATOS.cumplimiento);

    // Información personal
    this.tramite2603Store.setRfc(DATOS.rfc);
    this.tramite2603Store.setNombre(DATOS.nombre);
    this.tramite2603Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite2603Store.setApellidoMaterno(DATOS.apellidoMaterno);

    // Información química y comercial
    this.tramite2603Store.setDci(DATOS.dci);
    this.tramite2603Store.setMarcaComercialODenominacionDistintiva(DATOS.marcaComercialODenominacionDistintiva);
    this.tramite2603Store.setDescripcionDeLaFraccion(DATOS.descripcionDeLaFraccion);
    this.tramite2603Store.setNumeroCas(DATOS.numeroCas);
    this.tramite2603Store.setCantidadDeLotes(DATOS.cantidadDeLotes);
    this.tramite2603Store.setKgOrPorLote(DATOS.kgOrPorLote);

    // Información de procedencia
    this.tramite2603Store.setPais(DATOS.pais);
    this.tramite2603Store.setPaisDeProcedencia(DATOS.paisDeProcedencia);

    // Uso y piezas
    this.tramite2603Store.setDetallarUso(DATOS.detallarUso);
    this.tramite2603Store.setNumeroDePiezas(DATOS.numeroDePiezas);
    this.tramite2603Store.setDescripcionDelNumeroDePiezas(DATOS.descripcionDelNumeroDePiezas);

    // Registro y referencia
    this.tramite2603Store.setNumeroDeRegistro(DATOS.numeroDeRegistro);
    this.tramite2603Store.setClaveDeReferencia(DATOS.claveDeReferencia);

    // Información bancaria y de pago
    this.tramite2603Store.setCadenaDaLaDependencia(DATOS.cadenaDaLaDependencia);
    this.tramite2603Store.setBanco(DATOS.banco);
    this.tramite2603Store.setLaveDePago(DATOS.laveDePago);
    this.tramite2603Store.setFechaDePago(DATOS.fechaDePago);
    this.tramite2603Store.setImporteDePago(DATOS.importeDePago);

    // Documentos
    this.tramite2603Store.setTipoDocumento(DATOS.tipoDocumento);

    // Terceros relacionados
    this.tramite2603Store.setTercerosRelacionadosDenominacionSocial(DATOS.tercerosRelacionadosDenominacionSocial);
    this.tramite2603Store.setTercerosRelacionadosTerceroNombre(DATOS.tercerosRelacionadosTerceroNombre);
    this.tramite2603Store.setTercerosNacionalidad(DATOS.tercerosNacionalidad);
    this.tramite2603Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite2603Store.setTercerosRelacionadosRfc(DATOS.tercerosRelacionadosRfc);
    this.tramite2603Store.setTercerosRelacionadosCurp(DATOS.tercerosRelacionadosCurp);
    this.tramite2603Store.setTercerosRelacionadosRazonSocial(DATOS.tercerosRelacionadosRazonSocial);
    this.tramite2603Store.setTercerosRelacionadosPais(DATOS.tercerosRelacionadosPais);
    this.tramite2603Store.setTercerosRelacionadosEstado(DATOS.tercerosRelacionadosEstado);
    this.tramite2603Store.setTercerosRelacionadosCodigoPostal(DATOS.tercerosRelacionadosCodigoPostal);
    this.tramite2603Store.setTercerosRelacionadosCalle(DATOS.tercerosRelacionadosCalle);
    this.tramite2603Store.setTercerosRelacionadosNumeroExterior(DATOS.tercerosRelacionadosNumeroExterior);
    this.tramite2603Store.setTercerosRelacionadosNumeroInterior(DATOS.tercerosRelacionadosNumeroInterior);
    this.tramite2603Store.setTercerosRelacionadosLada(DATOS.tercerosRelacionadosLada);
    this.tramite2603Store.setTercerosRelacionadosTelefono(DATOS.tercerosRelacionadosTelefono);
    this.tramite2603Store.setTercerosRelacionadosCorreoElectronico(DATOS.tercerosRelacionadosCorreoElectronico);
  }


  /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getEstadoDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/2603/estado-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo SCIAN desde un archivo JSON local.
   * @returns Un `Observable` de tipo `ScianDatos[]` que contiene los datos del catálogo SCIAN.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getScianDatos(): Observable<ScianDatos[]> {
    return this.http.get<ScianDatos[]>('assets/json/2603/scian-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Recupera los datos del catálogo de claves desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del catálogo de claves.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getClaveDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/2603/clave-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Recupera los datos del catálogo de régimen desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del catálogo de régimen.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getRegimenDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/2603/regimen-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos de mercancías desde un archivo JSON local.
   * @returns Un `Observable` de tipo `MercanciasDatos[]` que contiene los datos de las mercancías.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getMercanciasDatos(): Observable<MercanciasDatos[]> {
    return this.http.get<MercanciasDatos[]>('assets/json/2603/mercancias-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de tipo de producto desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del catálogo de tipo de producto.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getTipoDeProductoDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/2603/tipo-de-producto-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Recupera los datos del catálogo de país de procedencia desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del catálogo de país de procedencia.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getPaisDeProcedenciaDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/2603/pais-de-procedencia-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de fabricantes desde un archivo JSON local.
   * @returns Un `Observable` de tipo `Fabricante[]` que contiene los datos de los fabricantes.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getFabricanteDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/2603/fabricante-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de facturadores desde un archivo JSON local.
   * @returns Un `Observable` de tipo `Fabricante[]` que contiene los datos de los facturadores.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getFacturadorDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/2603/facturador-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de proveedores desde un archivo JSON local.
   * @returns Un `Observable` de tipo `Fabricante[]` que contiene los datos de los proveedores.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getProveedorDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/2603/proveedor-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de certificados analíticos desde un archivo JSON local.
   * @returns Un `Observable` de tipo `Fabricante[]` que contiene los datos de los certificados analíticos.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getCertificadoDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/2603/certificado-analitico-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del catálogo de otros desde un archivo JSON local.
   * @returns Un `Observable` de tipo `Otros[]` que contiene los datos de otros.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getOtrosDatos(): Observable<Otros[]> {
    return this.http.get<Otros[]>('assets/json/2603/otros-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `JSONResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getBancoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/2603/banco-catalog.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `JSONResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getTipoDeDocumentoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/2603/tipo-de-documento.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
    /**
   * @method getClaveCatalogDatos
   * @description
   * Obtiene el catálogo de pais desde un archivo JSON local.
   * @returns {Observable<Catalogo>} Observable con los datos del Clasificación del producto.
   */
    getClaveCatalogDatos(): Observable<EstadoCatalogResponse> {
      return this.http.get<EstadoCatalogResponse>('assets/json/2603/clasificacion-del-producto.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
    /**
     * Obtiene los datos iniciales para el formulario desde un archivo JSON local.
     * @returns Un `Observable` de tipo `Solicitud2603State` con los datos iniciales del formulario.
     */
    getFormularioData(): Observable<Solicitud2603State> {
      return this.http.get<Solicitud2603State>('assets/json/2603/inicializar-formulario.json');
    }

    /**
   * @method getPaisDatos
   * @description
   * Obtiene el catálogo de pais desde un archivo JSON local.
   * @returns {Observable<Catalogo>} Observable con los datos del catálogo de pais.
   */
    getPaisDatos(tramitesID: string): Observable<any> {
       return this.catalogoServices.paisesCatalogo(tramitesID).pipe(
          map(res => res?.datos ?? [])
        );
    }

  /**
   * @method getArancelariaDatos
   * @description
   * Obtiene el catálogo de fracción arancelaria desde un archivo JSON local.
   * @returns {Observable<Catalogo>} Observable con los datos del catálogo de fracción arancelaria.
   */
    getArancelariaDatos(): Observable<Catalogo[]> {
      return this.http.get<Catalogo[]>('assets/json/2603/fraccion-arancelaria.json');
    }
}
