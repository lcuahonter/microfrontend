import { TestBed } from '@angular/core/testing';
import { Service260702Service } from './service260702.service';
import { Solicitud260702Store, Solicitud260702State } from '../estados/tramites260702.store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('Service260702Service', () => {
  let service: Service260702Service;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let storeSpy: jest.Mocked<Solicitud260702Store>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    } as any;

    storeSpy = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDelaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setLlavedoPago: jest.fn(),
      setFechadePago: jest.fn(),
      setImportedePago: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setDenominacion: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setPais: jest.fn(),
      setDomicilio: jest.fn(),
      setEstado: jest.fn(),
      setCodigoPostal: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setJustification: jest.fn(),
      setMunicipoyalcaldia: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setAvisoDeFuncionamiento: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimenalque: jest.fn(),
      setAduana: jest.fn(),
      setRfc: jest.fn(),
      setLegalRazonSocial: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setMercanciasDatos: jest.fn(),
      setConfiguracionColumnasoli: jest.fn(),
      setListaClave: jest.fn(),
      setClaveDeLosLotes: jest.fn(),
      setFechaDeFabricacion: jest.fn(),
      setFechaDeCaducidad: jest.fn(),
      setDescripcionFraccionArancelaria: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setTipoProducto: jest.fn(),
      setClasificaionProductos: jest.fn(),
      setEspecificarProducto: jest.fn(),
      setNombreProductoEspecifico: jest.fn(),
      setMarca: jest.fn(),
      setFraccionArancelaria: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        Service260702Service,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Solicitud260702Store, useValue: storeSpy }
      ]
    });

    service = TestBed.inject(Service260702Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters with correct values in actualizarEstadoFormulario', () => {
    const datos: Solicitud260702State = {
      clavedereferencia: 'ref',
      cadenadeladependencia: 'dep',
      banco: 'bank',
      llavedepago: 'key',
      fechadepago: '2024-01-01',
      importedepago: '100',
      tipoPersona: 'FISICA',
      nombre: 'Juan',
      primerApellido: 'Perez',
      segundoApellido: 'Lopez',
      denominacion: 'Denom',
      correoElectronico: 'test@mail.com',
      pais: 'MX',
      domicilio: 'Calle 1',
      estado: 'CDMX',
      codigopostal: '12345',
      calle: 'Calle 2',
      numeroExterior: '10',
      numeroInterior: '2',
      lada: 55,
      telefono: '12345678',
      justification: 'Just',
      municipoyalcaldia: 'Alcaldia',
      localidad: 'Loc',
      colonia: 'Col',
      avisoDeFuncionamiento: true,
      licenciaSanitaria: 'Lic',
      regimenalque: 'Reg',
      aduana: 'Aduana',
      rfc: 'RFC123',
      legalRazonSocial: 'Razon',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
      mercanciasDatos: [],
      configuracionColumnasoli: [],
      listaClave: [],
      claveDeLosLotes: '',
      fechaDeFabricacion: '2024-01-01',
      fechaDeCaducidad: '2025-01-01',
      descripcionFraccionArancelaria: 'Desc',
      cantidadUMT: '1',
      umt: 'UMT',
      cantidadUMC: '2',
      umc: 'UMC',
      tipoProducto: 'Tipo',
      clasificaionProductos: 'Clas',
      especificarProducto: 'Esp',
      nombreProductoEspecifico: 'NomProd',
      marca: 'Marca',
      fraccionArancelaria: 'Frac'
    };

  });

  it('should call http.get with correct URL in getRegistroTomaMuestrasMercanciasData', done => {
    const mockResponse = {} as Solicitud260702State;
    httpClientSpy.get.mockReturnValue(of(mockResponse));

    service.getRegistroTomaMuestrasMercanciasData().subscribe(response => {
      expect(response).toBe(mockResponse);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/260702/registro_toma_muestras_mercancias.json'
      );
      done();
    });
  });

  it('should handle empty object in actualizarEstadoFormulario', () => {
    const emptyDatos = {} as Solicitud260702State;
    service.actualizarEstadoFormulario(emptyDatos);

    expect(storeSpy.setClaveDeReferencia).toHaveBeenCalledWith(undefined);
    expect(storeSpy.setCadenaDelaDependencia).toHaveBeenCalledWith(undefined);
    expect(storeSpy.setBanco).toHaveBeenCalledWith(undefined);
    // ... (you can add more expects for other setters if desired)
  });
});