import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Fabricante, MercanciasDatos, Otros, ScianDatos } from '@libs/shared/data-access-user/src';
import { Observable,catchError, throwError } from 'rxjs';
import { EstadoCatalogResponse } from '../models/certificados-licencias-permisos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Solicitud260303State, Tramite260303Store } from '../../260303/Estados/tramite260303.store';

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
  constructor(private http: HttpClient,private tramite260303Store:Tramite260303Store) { 
    //
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * 
   * @param DATOS - Objeto de tipo Solicitud260303State que contiene los datos a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Solicitud260303State): void {
    // Datos generales del solicitante
    this.tramite260303Store.setDenominacionRazon(DATOS.denominacionRazon);
    this.tramite260303Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite260303Store.setEstado(DATOS.estado);
    this.tramite260303Store.setMunicipio(DATOS.municipio);
    this.tramite260303Store.setLocalidad(DATOS.localidad);
    this.tramite260303Store.setColonia(DATOS.colonia);
    this.tramite260303Store.setCalleYNumero(DATOS.calleYNumero);
    this.tramite260303Store.setCorreoElecronico(DATOS.correoElecronico);
    this.tramite260303Store.setLada(DATOS.lada);
    this.tramite260303Store.setTelefono(DATOS.telefono);

    // Información del trámite
    this.tramite260303Store.setClaveScianModal(DATOS.claveScianModal);
    this.tramite260303Store.setAvisoDeFuncionamiento(DATOS.avisoDeFuncionamiento);
    this.tramite260303Store.setClave(DATOS.clave);
    this.tramite260303Store.setDescripcion(DATOS.descripcion);
    this.tramite260303Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite260303Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260303Store.setRegimen(DATOS.regimen);
    this.tramite260303Store.setRegimenDestinara(DATOS.regimenDestinara);
    this.tramite260303Store.setAduanasEntradas(DATOS.aduana);
    this.tramite260303Store.setNumeroPermiso(DATOS.numeroPermiso);

    // Datos adicionales
    this.tramite260303Store.setManifiestos(DATOS.manifiestos);
    this.tramite260303Store.setLosDatosNo(DATOS.losDatosNo);
    this.tramite260303Store.setNombreORazon(DATOS.nombreORazon);

    // Información del producto
    this.tramite260303Store.setClasificacion(DATOS.clasificacion);
    this.tramite260303Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite260303Store.setDenominacionEspecifica(DATOS.denominacionEspecifica);
    this.tramite260303Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);
    this.tramite260303Store.setDenominacionComun(DATOS.denominacionComun);
    this.tramite260303Store.setTipoDeProducto(DATOS.tipoDeProducto);
    this.tramite260303Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite260303Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite260303Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite260303Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260303Store.setUMT(DATOS.UMT);
    this.tramite260303Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260303Store.setUMC(DATOS.UMC);
    this.tramite260303Store.setPresentacion(DATOS.presentacion);
    this.tramite260303Store.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite260303Store.setFechaCaducidad(DATOS.fechaCaducidad);
    this.tramite260303Store.setCumplimiento(DATOS.cumplimiento);

    // Información personal
    this.tramite260303Store.setRfc(DATOS.rfc);
    this.tramite260303Store.setNombre(DATOS.nombre);
    this.tramite260303Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260303Store.setApellidoMaterno(DATOS.apellidoMaterno);

    // Información química y comercial
    this.tramite260303Store.setDci(DATOS.dci);
    this.tramite260303Store.setMarcaComercialODenominacionDistintiva(DATOS.marcaComercialODenominacionDistintiva);
    this.tramite260303Store.setDescripcionDeLaFraccion(DATOS.descripcionDeLaFraccion);
    this.tramite260303Store.setNumeroCas(DATOS.numeroCas);
    this.tramite260303Store.setCantidadDeLotes(DATOS.cantidadDeLotes);
    this.tramite260303Store.setKgOrPorLote(DATOS.kgOrPorLote);

    // Información de procedencia
    this.tramite260303Store.setPais(DATOS.pais);
    this.tramite260303Store.setPaisDeProcedencia(DATOS.paisDeProcedencia);

    // Uso y piezas
    this.tramite260303Store.setDetallarUso(DATOS.detallarUso);
    this.tramite260303Store.setNumeroDePiezas(DATOS.numeroDePiezas);
    this.tramite260303Store.setDescripcionDelNumeroDePiezas(DATOS.descripcionDelNumeroDePiezas);

    // Registro y referencia
    this.tramite260303Store.setNumeroDeRegistro(DATOS.numeroDeRegistro);
    this.tramite260303Store.setClaveDeReferencia(DATOS.claveDeReferencia);

    // Información bancaria y de pago
    this.tramite260303Store.setCadenaDaLaDependencia(DATOS.cadenaDaLaDependencia);
    this.tramite260303Store.setBanco(DATOS.banco);
    this.tramite260303Store.setLaveDePago(DATOS.laveDePago);
    this.tramite260303Store.setFechaDePago(DATOS.fechaDePago);
    this.tramite260303Store.setImporteDePago(DATOS.importeDePago);

    // Documentos
    this.tramite260303Store.setTipoDocumento(DATOS.tipoDocumento);

    // Terceros relacionados
    this.tramite260303Store.setTercerosRelacionadosDenominacionSocial(DATOS.tercerosRelacionadosDenominacionSocial);
    this.tramite260303Store.setTercerosRelacionadosTerceroNombre(DATOS.tercerosRelacionadosTerceroNombre);
    this.tramite260303Store.setTercerosNacionalidad(DATOS.tercerosNacionalidad);
    this.tramite260303Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260303Store.setTercerosRelacionadosRfc(DATOS.tercerosRelacionadosRfc);
    this.tramite260303Store.setTercerosRelacionadosCurp(DATOS.tercerosRelacionadosCurp);
    this.tramite260303Store.setTercerosRelacionadosRazonSocial(DATOS.tercerosRelacionadosRazonSocial);
    this.tramite260303Store.setTercerosRelacionadosPais(DATOS.tercerosRelacionadosPais);
    this.tramite260303Store.setTercerosRelacionadosEstado(DATOS.tercerosRelacionadosEstado);
    this.tramite260303Store.setTercerosRelacionadosCodigoPostal(DATOS.tercerosRelacionadosCodigoPostal);
    this.tramite260303Store.setTercerosRelacionadosCalle(DATOS.tercerosRelacionadosCalle);
    this.tramite260303Store.setTercerosRelacionadosNumeroExterior(DATOS.tercerosRelacionadosNumeroExterior);
    this.tramite260303Store.setTercerosRelacionadosNumeroInterior(DATOS.tercerosRelacionadosNumeroInterior);
    this.tramite260303Store.setTercerosRelacionadosLada(DATOS.tercerosRelacionadosLada);
    this.tramite260303Store.setTercerosRelacionadosTelefono(DATOS.tercerosRelacionadosTelefono);
    this.tramite260303Store.setTercerosRelacionadosCorreoElectronico(DATOS.tercerosRelacionadosCorreoElectronico);
  }


  /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `EstadoCatalogResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getEstadoDatos(): Observable<EstadoCatalogResponse> {
    return this.http.get<EstadoCatalogResponse>('assets/json/260303/estado-catalog.json').pipe(
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
    return this.http.get<ScianDatos[]>('assets/json/260303/scian-tabla.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260303/clave-catalog.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260303/regimen-catalog.json').pipe(
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
    return this.http.get<MercanciasDatos[]>('assets/json/260303/mercancias-tabla.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260303/tipo-de-producto-catalog.json').pipe(
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
    return this.http.get<EstadoCatalogResponse>('assets/json/260303/pais-de-procedencia-catalog.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260303/fabricante-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260303/facturador-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260303/proveedor-tabla.json').pipe(
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
    return this.http.get<Fabricante[]>('assets/json/260303/certificado-analitico-tabla.json').pipe(
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
    return this.http.get<Otros[]>('assets/json/260303/otros-tabla.json').pipe(
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
    return this.http.get<JSONResponse>('assets/json/260303/banco-catalog.json').pipe(
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
    return this.http.get<JSONResponse>('assets/json/260303/tipo-de-documento.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    /**
     * Obtiene los datos iniciales para el formulario desde un archivo JSON local.
     * @returns Un `Observable` de tipo `Solicitud260303State` con los datos iniciales del formulario.
     */
    getFormularioData(): Observable<Solicitud260303State> {
      return this.http.get<Solicitud260303State>('assets/json/260303/inicializar-formulario.json');
    }

    /**
   * @method getPaisDatos
   * @description
   * Obtiene el catálogo de pais desde un archivo JSON local.
   * @returns {Observable<Catalogo>} Observable con los datos del catálogo de pais.
   */
    getPaisDatos(): Observable<Catalogo[]> {
      return this.http.get<Catalogo[]>('assets/json/260303/pais.json');
    }


}
