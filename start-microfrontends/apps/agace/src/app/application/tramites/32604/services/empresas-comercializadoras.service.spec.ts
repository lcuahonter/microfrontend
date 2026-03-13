import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EmpresasComercializadorasService } from './empresas-comercializadoras.service';

describe('EmpresasComercializadorasService', () => {
  let service: EmpresasComercializadorasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EmpresasComercializadorasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return EnlaceOperativo[] from conseguirEnlaceOperativoDatos', () => {
    const mockData = [
      {
        rfc: 'RFC123', nombre: 'Juan', apellidoPaterno: 'Perez', apellidoMaterno: 'Lopez', claveCiudad: '001', ciudad: 'CDMX', cargo: 'Gerente', telefono: '5551234567', correo: 'juan@example.com', suplente: 'No', calle: 'Av. Reforma', numeroExterior: '100', numeroInterior: '10', colonia: 'Centro', codigoPostal: '06000', localidad: 'Centro', delegacionMunicipio: 'Cuauhtémoc'
      }
    ];
    service.conseguirEnlaceOperativoDatos().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/enlace-operativo-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  afterEach(() => {
    httpMock.verify();
  });
    it('should return RepresentanteLegal from conseguirRepresentanteLegalDatos', () => {
    const mockData = {
      rfcTercero: 'RFC_TERCERO', rfc: 'RFC123', nombre: 'Ana', apellidoPaterno: 'Garcia', apellidoMaterno: 'Mendez', telefono: '5559876543', correoElectronico: 'ana@example.com'
    };
    service.conseguirRepresentanteLegalDatos().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/representante-legal-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return TransportistasTable[] from conseguirTransportistasLista', () => {
    const mockData = [
      { transportistaRFCModifTrans: 'RFC_T1', transportistaRazonSocial: 'Trans S.A.', transportistaDomicilio: 'Calle 1', transportistaCaat: 'CAAT1' }
    ];
    service.conseguirTransportistasLista().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/transportistas-lista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return SeccionSubcontratados from conseguirSeccionSubcontratados', () => {
    const mockData = {
      subcontrataRFC: 'RFC_SUB', subcontrataRazonSocial: 'Subcontrata S.A.', subcontrataEmpleados: '10', subcontrataBimestre: '1'
    };
    service.conseguirSeccionSubcontratados().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/seccion-subcontratados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return RespuestaConsulta from guardarDatosFormulario', () => {
    const mockData = {
      success: true,
      datos: { id: 1 },
      message: 'OK'
    };
    service.guardarDatosFormulario().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/guardar-datos-formulario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return Instalaciones[] from getDatosTableData', () => {
    const mockData = [
      { id: 1, entidadFederativa: 'CDMX', municipio: 'Benito Juarez', coloniaCalleNumero: 'Colonia 1', codigoPostal: '03100', registroAduana: 'Aduana1', instalacionPerfil: 'Perfil1', instalacionPerfilRFE: 'RFE1', instalacionPerfilAuto: 'Auto1', instalacionPerfilFerro: 'Ferro1', instalacionPerfilRf: 'RF1', instalacionPerfilMensajeria: 'Mensajeria1', instalacionPerfilAlmacen: 'Almacen1', nombreCompleto: 'Juan Perez', rfc: 'RFC1', caracterDe: 'Socio', nacionalidad: 'Mexicana', tributarMexico: 'Si', nombreEmpresa: 'Empresa1', tipoPersonaMuestra: 'Física' }
    ];
    service.getDatosTableData().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32604/datosTabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call all store update methods in actualizarEstadoFormulario', () => {
    type StoreMockType = { [key: string]: jest.Mock };
    const storeMock: StoreMockType = {};
    const keys = [190,191,199,2034,236,237,238,239,240,243,244,245,246,247,248,249,250,251,2089,2090,2091,2042,2043,2044];
    keys.forEach(k => { storeMock[`actualizar${k}`] = jest.fn(); });
    [
      'actualizarIdPersonaSolicitud','actualizarRfcTercero','actualizarRfc','actualizarNombre','actualizarApellidoPaterno','actualizarApellidoMaterno','actualizarTelefono','actualizarCorreoElectronico','actualizarEnlaceRfcTercero','actualizarEnlaceRfc','actualizarEnlaceNombre','actualizarEnlaceApellidoPaterno','actualizarEnlaceApellidoMaterno','actualizarEnlaceCiudadEstado','actualizarEnlaceCargo','actualizarEnlaceTelefono','actualizarEnlaceCorreoElectronico','actualizarEnlaceSuplente','actualizarFechaInicioComercio','actualizarFechaPago','actualizarMonto','actualizarOperacionesBancarias','actualizarLlavePago','actualizarTransportistaRFC','actualizarTransportistaRFCModifTrans','actualizarTransportistaRazonSocial','actualizarTransportistaDomicilio','actualizarTransportistaCaat','actualizarTransportistaIdDomicilio','actualizarTransportistaIdRFC','actualizarTransportistaIdRazonSocial','actualizarTransportistaIdCaat','actualizarMiembroCaracterDe','actualizarMiembroTributarMexico','actualizarMiembroNacionalidad','actualizarMiembroRFC','actualizarMiembroRegistroFederal','actualizarMiembroNombreCompleto','actualizarMiembroTipoPersonaMuestra','actualizarMiembroNombre','actualizarMiembroApellidoPaterno','actualizarMiembroApellidoMaterno','actualizarMiembroNombreEmpresa','actualizarSubcontrataRFCBusqueda','actualizarSubcontrataRFC','actualizarSubcontrataRazonSocial','actualizarSubcontrataEmpleados','actualizarSubcontrataBimestre','actualizarPrincipales','actualizarMunicipio','actualizarTipoDeInstalacion','actualizarEntidadFederativa','actualizarRegistroSESAT','actualizarDescripcion','actualizarCodigoPostal','actualizarProcesoProductivo','actualizarGoceDelInmueble','actualizarEmpresa','actualizarComercioExterior','actualizarMutuo','actualizarCatseleccionados','actualizarServicio','actualizarEmpleados','actualizarBimestre','actualizarIndiqueTodos','actualizarFile1','actualizarFile2','actualizarIdentificacion','actualizarLugarDeRadicacion','actualizarCheckbox1','actualizarCheckbox2','actualizarCheckbox3','actualizarActualmente2','actualizarActualmente1'
    ].forEach(fn => { storeMock[fn] = jest.fn(); });
    const resp: any = {};
    keys.forEach(k => { resp[k] = k; });
    resp.idPersonaSolicitud = 'id';
    resp.rfcTercero = 'rfcTercero';
    resp.rfc = 'rfc';
    resp.nombre = 'nombre';
    resp.apellidoPaterno = 'apellidoPaterno';
    resp.apellidoMaterno = 'apellidoMaterno';
    resp.telefono = 'telefono';
    resp.correoElectronico = 'correoElectronico';
    resp.agregarEnlaceRfcTercero = 'enlaceRfcTercero';
    resp.agregarEnlaceRfc = 'enlaceRfc';
    resp.agregarEnlaceNombre = 'enlaceNombre';
    resp.agregarEnlaceApellidoPaterno = 'enlaceApellidoPaterno';
    resp.agregarEnlaceApellidoMaterno = 'enlaceApellidoMaterno';
    resp.agregarEnlaceCiudadEstado = 'enlaceCiudadEstado';
    resp.agregarEnlaceCargo = 'enlaceCargo';
    resp.agregarEnlaceTelefono = 'enlaceTelefono';
    resp.agregarEnlaceCorreoElectronico = 'enlaceCorreoElectronico';
    resp.agregarEnlaceSuplente = true;
    resp.fechaInicioComercio = 'fechaInicio';
    resp.fechaPago = 'fechaPago';
    resp.monto = 'monto';
    resp.operacionesBancarias = 'operacionesBancarias';
    resp.llavePago = 'llavePago';
    resp.transportistaRFC = 'transportistaRFC';
    resp.transportistaRFCModifTrans = 'transportistaRFCModifTrans';
    resp.transportistaRazonSocial = 'transportistaRazonSocial';
    resp.transportistaDomicilio = 'transportistaDomicilio';
    resp.transportistaCaat = 'transportistaCaat';
    resp.transportistaIdDomicilio = 'transportistaIdDomicilio';
    resp.transportistaIdRFC = 'transportistaIdRFC';
    resp.transportistaIdRazonSocial = 'transportistaIdRazonSocial';
    resp.transportistaIdCaat = 'transportistaIdCaat';
    resp.miembroCaracterDe = 'miembroCaracterDe';
    resp.miembroTributarMexico = 'miembroTributarMexico';
    resp.miembroNacionalidad = 'miembroNacionalidad';
    resp.miembroRfc = 'miembroRfc';
    resp.miembroRegistroFederal = 'miembroRegistroFederal';
    resp.miembroNombreCompleto = 'miembroNombreCompleto';
    resp.miembroTipoPersonaMuestra = 'miembroTipoPersonaMuestra';
    resp.miembroNombre = 'miembroNombre';
    resp.miembroApellidoPaterno = 'miembroApellidoPaterno';
    resp.miembroApellidoMaterno = 'miembroApellidoMaterno';
    resp.miembroNombreEmpresa = 'miembroNombreEmpresa';
    resp.subcontrataRFCBusqueda = 'subcontrataRFCBusqueda';
    resp.subcontrataRFC = 'subcontrataRFC';
    resp.subcontrataRazonSocial = 'subcontrataRazonSocial';
    resp.subcontrataEmpleados = 'subcontrataEmpleados';
    resp.subcontrataBimestre = 'subcontrataBimestre';
    resp.principales = 'principales';
    resp.municipio = 'municipio';
    resp.tipoDeInstalacion = 'tipoDeInstalacion';
    resp.entidadFederativa = 'entidadFederativa';
    resp.registroSESAT = 'registroSESAT';
    resp.descripcion = 'descripcion';
    resp.codigoPostal = 'codigoPostal';
    resp.procesoProductivo = 'procesoProductivo';
    resp.goceDelInmueble = 'goceDelInmueble';
    resp.empresa = 'empresa';
    resp.comercioExterior = 'comercioExterior';
    resp.mutuo = 'mutuo';
    resp.catseleccionados = 1;
    resp.servicio = 2;
    resp.empleados = 'empleados';
    resp.bimestre = 3;
    resp.indiqueTodos = 1;
    resp.file1 = 'file1';
    resp.file2 = 'file2';
    resp.identificacion = 'identificacion';
    resp.lugarDeRadicacion = 'lugarDeRadicacion';
    resp.checkbox1 = true;
    resp.checkbox2 = false;
    resp.checkbox3 = true;
    resp.actualmente2 = 'actualmente2';
    resp.actualmente1 = 'actualmente1';
    const customService = new EmpresasComercializadorasService({} as any, storeMock as any);
    customService.actualizarEstadoFormulario(resp);
    keys.forEach(k => {
      expect(storeMock[`actualizar${k}`]).toHaveBeenCalledWith(resp[k]);
    });
    [
      'actualizarIdPersonaSolicitud','actualizarRfcTercero','actualizarRfc','actualizarNombre','actualizarApellidoPaterno','actualizarApellidoMaterno','actualizarTelefono','actualizarCorreoElectronico','actualizarEnlaceRfcTercero','actualizarEnlaceRfc','actualizarEnlaceNombre','actualizarEnlaceApellidoPaterno','actualizarEnlaceApellidoMaterno','actualizarEnlaceCiudadEstado','actualizarEnlaceCargo','actualizarEnlaceTelefono','actualizarEnlaceCorreoElectronico','actualizarEnlaceSuplente','actualizarFechaInicioComercio','actualizarFechaPago','actualizarMonto','actualizarOperacionesBancarias','actualizarLlavePago','actualizarTransportistaRFC','actualizarTransportistaRFCModifTrans','actualizarTransportistaRazonSocial','actualizarTransportistaDomicilio','actualizarTransportistaCaat','actualizarTransportistaIdDomicilio','actualizarTransportistaIdRFC','actualizarTransportistaIdRazonSocial','actualizarTransportistaIdCaat','actualizarMiembroCaracterDe','actualizarMiembroTributarMexico','actualizarMiembroNacionalidad','actualizarMiembroRFC','actualizarMiembroRegistroFederal','actualizarMiembroNombreCompleto','actualizarMiembroTipoPersonaMuestra','actualizarMiembroNombre','actualizarMiembroApellidoPaterno','actualizarMiembroApellidoMaterno','actualizarMiembroNombreEmpresa','actualizarSubcontrataRFCBusqueda','actualizarSubcontrataRFC','actualizarSubcontrataRazonSocial','actualizarSubcontrataEmpleados','actualizarSubcontrataBimestre','actualizarPrincipales','actualizarMunicipio','actualizarTipoDeInstalacion','actualizarEntidadFederativa','actualizarRegistroSESAT','actualizarDescripcion','actualizarCodigoPostal','actualizarProcesoProductivo','actualizarGoceDelInmueble','actualizarEmpresa','actualizarComercioExterior','actualizarMutuo','actualizarCatseleccionados','actualizarServicio','actualizarEmpleados','actualizarBimestre','actualizarIndiqueTodos','actualizarFile1','actualizarFile2','actualizarIdentificacion','actualizarLugarDeRadicacion','actualizarCheckbox1','actualizarCheckbox2','actualizarCheckbox3','actualizarActualmente2','actualizarActualmente1'
    ].forEach(fn => {
      const prop = fn.replace('actualizar','');
      if (Object.prototype.hasOwnProperty.call(resp, prop)) {
        expect(storeMock[fn]).toHaveBeenCalledWith(resp[prop]);
      }
    });
  });

});
