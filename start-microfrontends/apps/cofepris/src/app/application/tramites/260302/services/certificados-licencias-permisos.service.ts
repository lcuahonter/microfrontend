import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Fabricante, MercanciasDatos, Otros, ScianDatos } from '@libs/shared/data-access-user/src';
import { Observable,catchError, throwError } from 'rxjs';
import { Solicitud260302StateUno, Tramite260302Store } from '../estados/stores/tramite260302.store';
import { EstadoCatalogResponse } from '../models/certificados-licencias-permisos.model';
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
  constructor(private http: HttpClient,private tramite260302Store:Tramite260302Store) { 
    //
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * 
   * @param DATOS - Objeto de tipo Solicitud260302State que contiene los datos a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Solicitud260302StateUno): void {
    // Datos generales del solicitante
    this.tramite260302Store.setDenominacionRazon(DATOS.denominacionRazon);
    this.tramite260302Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite260302Store.setEstado(DATOS.estado);
    this.tramite260302Store.setMunicipio(DATOS.municipio);
    this.tramite260302Store.setLocalidad(DATOS.localidad);
    this.tramite260302Store.setColonia(DATOS.colonia);
    this.tramite260302Store.setCalleYNumero(DATOS.calleYNumero);
    this.tramite260302Store.setCorreoElecronico(DATOS.correoElecronico);
    this.tramite260302Store.setLada(DATOS.lada);
    this.tramite260302Store.setTelefono(DATOS.telefono);

    // Información del trámite
    this.tramite260302Store.setClaveScianModal(DATOS.claveScianModal);
    this.tramite260302Store.setAvisoDeFuncionamiento(DATOS.avisoDeFuncionamiento);
    this.tramite260302Store.setClave(DATOS.clave);
    this.tramite260302Store.setDescripcion(DATOS.descripcion);
    this.tramite260302Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite260302Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260302Store.setRegimen(DATOS.regimen);
    this.tramite260302Store.setRegimenDestinara(DATOS.regimenDestinara);
    this.tramite260302Store.setAduanasEntradas(DATOS.aduana);
    this.tramite260302Store.setNumeroPermiso(DATOS.numeroPermiso);

    // Datos adicionales
    this.tramite260302Store.setManifiestos(DATOS.manifiestos);
    this.tramite260302Store.setLosDatosNo(DATOS.losDatosNo);
    this.tramite260302Store.setNombreORazon(DATOS.nombreORazon);

    // Información del producto
    this.tramite260302Store.setClasificacion(DATOS.clasificacion);
    this.tramite260302Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite260302Store.setDenominacionEspecifica(DATOS.denominacionEspecifica);
    this.tramite260302Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);
    this.tramite260302Store.setDenominacionComun(DATOS.denominacionComun);
    this.tramite260302Store.setTipoDeProducto(DATOS.tipoDeProducto);
    this.tramite260302Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite260302Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite260302Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite260302Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260302Store.setUMT(DATOS.UMT);
    this.tramite260302Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260302Store.setUMC(DATOS.UMC);
    this.tramite260302Store.setPresentacion(DATOS.presentacion);
    this.tramite260302Store.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite260302Store.setFechaCaducidad(DATOS.fechaCaducidad);
    this.tramite260302Store.setCumplimiento(DATOS.cumplimiento);

    // Información personal
    this.tramite260302Store.setRfc(DATOS.rfc);
    this.tramite260302Store.setNombre(DATOS.nombre);
    this.tramite260302Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260302Store.setApellidoMaterno(DATOS.apellidoMaterno);

    // Información química y comercial
    this.tramite260302Store.setDci(DATOS.dci);
    this.tramite260302Store.setMarcaComercialODenominacionDistintiva(DATOS.marcaComercialODenominacionDistintiva);
    this.tramite260302Store.setDescripcionDeLaFraccion(DATOS.descripcionDeLaFraccion);
    this.tramite260302Store.setNumeroCas(DATOS.numeroCas);
    this.tramite260302Store.setCantidadDeLotes(DATOS.cantidadDeLotes);
    this.tramite260302Store.setKgOrPorLote(DATOS.kgOrPorLote);

    // Información de procedencia
    this.tramite260302Store.setPais(DATOS.pais);
    this.tramite260302Store.setPaisDeProcedencia(DATOS.paisDeProcedencia);

    // Uso y piezas
    this.tramite260302Store.setDetallarUso(DATOS.detallarUso);
    this.tramite260302Store.setNumeroDePiezas(DATOS.numeroDePiezas);
    this.tramite260302Store.setDescripcionDelNumeroDePiezas(DATOS.descripcionDelNumeroDePiezas);

    // Registro y referencia
    this.tramite260302Store.setNumeroDeRegistro(DATOS.numeroDeRegistro);
    this.tramite260302Store.setClaveDeReferencia(DATOS.claveDeReferencia);

    // Información bancaria y de pago
    this.tramite260302Store.setCadenaDaLaDependencia(DATOS.cadenaDaLaDependencia);
    this.tramite260302Store.setBanco(DATOS.banco);
    this.tramite260302Store.setLaveDePago(DATOS.laveDePago);
    this.tramite260302Store.setFechaDePago(DATOS.fechaDePago);
    this.tramite260302Store.setImporteDePago(DATOS.importeDePago);

    // Documentos
    this.tramite260302Store.setTipoDocumento(DATOS.tipoDocumento);

    // Terceros relacionados
    this.tramite260302Store.setTercerosRelacionadosDenominacionSocial(DATOS.tercerosRelacionadosDenominacionSocial);
    this.tramite260302Store.setTercerosRelacionadosTerceroNombre(DATOS.tercerosRelacionadosTerceroNombre);
    this.tramite260302Store.setTercerosNacionalidad(DATOS.tercerosNacionalidad);
    this.tramite260302Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260302Store.setTercerosRelacionadosRfc(DATOS.tercerosRelacionadosRfc);
    this.tramite260302Store.setTercerosRelacionadosCurp(DATOS.tercerosRelacionadosCurp);
    this.tramite260302Store.setTercerosRelacionadosRazonSocial(DATOS.tercerosRelacionadosRazonSocial);
    this.tramite260302Store.setTercerosRelacionadosPais(DATOS.tercerosRelacionadosPais);
    this.tramite260302Store.setTercerosRelacionadosEstado(DATOS.tercerosRelacionadosEstado);
    this.tramite260302Store.setTercerosRelacionadosCodigoPostal(DATOS.tercerosRelacionadosCodigoPostal);
    this.tramite260302Store.setTercerosRelacionadosCalle(DATOS.tercerosRelacionadosCalle);
    this.tramite260302Store.setTercerosRelacionadosNumeroExterior(DATOS.tercerosRelacionadosNumeroExterior);
    this.tramite260302Store.setTercerosRelacionadosNumeroInterior(DATOS.tercerosRelacionadosNumeroInterior);
    this.tramite260302Store.setTercerosRelacionadosLada(DATOS.tercerosRelacionadosLada);
    this.tramite260302Store.setTercerosRelacionadosTelefono(DATOS.tercerosRelacionadosTelefono);
    this.tramite260302Store.setTercerosRelacionadosCorreoElectronico(DATOS.tercerosRelacionadosCorreoElectronico);
  }


  /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getEstadoDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/260302/estado-catalog.json').pipe(
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
    return this.http.get<ScianDatos[]>('assets/json/260302/scian-tabla.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260302/clave-catalog.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260302/regimen-catalog.json').pipe(
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
    return this.http.get<MercanciasDatos[]>('assets/json/260302/mercancias-tabla.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260302/tipo-de-producto-catalog.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260302/pais-de-procedencia-catalog.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260302/fabricante-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260302/facturador-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260302/proveedor-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260302/certificado-analitico-tabla.json').pipe(
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
    return this.http.get<Otros[]>('assets/json/260302/otros-tabla.json').pipe(
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
    return this.http.get<JSONResponse>('assets/json/260302/banco-catalog.json').pipe(
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
    return this.http.get<JSONResponse>('assets/json/260302/tipo-de-documento.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    /**
     * Obtiene los datos iniciales para el formulario desde un archivo JSON local.
     * @returns Un `Observable` de tipo `Solicitud260302State` con los datos iniciales del formulario.
     */
    getFormularioData(): Observable<Solicitud260302StateUno> {
      return this.http.get<Solicitud260302StateUno>('assets/json/260302/inicializar-formulario.json');
    }

    /**
   * @method getPaisDatos
   * @description
   * Obtiene el catálogo de pais desde un archivo JSON local.
   * @returns {Observable<Catalogo>} Observable con los datos del catálogo de pais.
   */
    getPaisDatos(): Observable<Catalogo[]> {
      return this.http.get<Catalogo[]>('assets/json/260302/pais.json');
    }


}
