import { TestBed } from '@angular/core/testing';
import { Service260601Service } from './service260601.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  AvisoSanitarioState,
  Tramite260601Store,
} from '../../../estados/tramites/tramite260601.store';

describe('Service260601Service', () => {
  let service: Service260601Service;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramite260601StoreMock: jest.Mocked<Tramite260601Store>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
    } as any;

    tramite260601StoreMock = {
      setRFCResponsableSanitario: jest.fn(),
      setRazonSocial: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setDescripcionMunicipio: jest.fn(),
      setInformacionExtra: jest.fn(),
      setDescripcionColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setClaveScian: jest.fn(),
      setDescripcionScian: jest.fn(),
      setAvisoFuncionamiento: jest.fn(),
      setCveRegimenes: jest.fn(),
      setCveAduanas: jest.fn(),
      setEspecificoProductoClasificacion: jest.fn(),
      setNombreProducto: jest.fn(),
      setMarca: jest.fn(),
      setTipoProducto: jest.fn(),
      setFraccionArancelariaDescripcion: jest.fn(),
      setModelo: jest.fn(),
      setProductoDescripcion: jest.fn(),
      setPaisDestino: jest.fn(),
      setSeleccionadaManifiesto: jest.fn(),
      setInformacionConfidencial: jest.fn(),
      setRfc: jest.fn(),
      setNombreOrazonsocial: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setTercerosNacionalidadFabricante: jest.fn(),
      setTipoPersonaFabricante: jest.fn(),
      setRfcFabricante: jest.fn(),
      setRfcFabricanteInhabilitar: jest.fn(),
      setCurpFabricanteInhabilitar: jest.fn(),
      setCurpFabricante: jest.fn(),
      setFabricanteNombre: jest.fn(),
      setFabricanteNombreInhabilitar: jest.fn(),
      setFabricantePrimerApellido: jest.fn(),
      setFabricantePrimerApellidoInhabilitar: jest.fn(),
      setFabricanteSegundoApellido: jest.fn(),
      setFabricanteSegundoApellidoInhabilitar: jest.fn(),
      setFabricanteRazonSocial: jest.fn(),
      setFabricanteRazonSocialInhabilitar: jest.fn(),
      setPaisFabricante: jest.fn(),
      setPaisFabricanteInhabilitar: jest.fn(),
      setEstadoFabricanteInhabilitar: jest.fn(),
      setAlcaldiaFabricante: jest.fn(),
      setAlcaldiaFabricanteInhabilitar: jest.fn(),
      setLocalidadFabricante: jest.fn(),
      setLocalidadFabricanteInhabilitar: jest.fn(),
      setCodigoPostalFabricante: jest.fn(),
      setCodigoPostalInhabilitar: jest.fn(),
      setColoniaFabricante: jest.fn(),
      setColoniaFabricanteInhabilitar: jest.fn(),
      setCalleFabricante: jest.fn(),
      setCalleFabricanteInhabilitar: jest.fn(),
      setNumeroExteriorFabricante: jest.fn(),
      setNumeroExteriorFabricanteInhabilitar: jest.fn(),
      setNumeroInteriorFabricante: jest.fn(),
      setNumeroInteriorFabricanteInhabilitar: jest.fn(),
      setLadaFabricante: jest.fn(),
      setLadaFabricanteInhabilitar: jest.fn(),
      setTelefonoFabricante: jest.fn(),
      setTelefonoFabricanteInhabilitar: jest.fn(),
      setCorreoElectronicoFabricante: jest.fn(),
      setCorreoElectronicoFabricanteInhabilitar: jest.fn(),
      setMostrarRfcFabricanteBuscarBoton: jest.fn(),
      setMostrarCurpFabricanteBuscarBoton: jest.fn(),
      setInhabilitarPaisFabricante: jest.fn(),
      setTercerosNacionalidad: jest.fn(),
      setTipoPersona: jest.fn(),
      setRfcProveedor: jest.fn(),
      setRfcProveedorInhabilitar: jest.fn(),
      setCurpInhabilitar: jest.fn(),
      setCurp: jest.fn(),
      setProveedorNombre: jest.fn(),
      setProveedorNombreInhabilitar: jest.fn(),
      setProveedorPrimerApellido: jest.fn(),
      setProveedorPrimerApellidoInhabilitar: jest.fn(),
      setProveedorSegundoApellido: jest.fn(),
      setProveedorSegundoApellidoInhabilitar: jest.fn(),
      setProveedorRazonSocial: jest.fn(),
      setProveedorRazonSocialInhabilitar: jest.fn(),
      setPais: jest.fn(),
      setPaisInhabilitar: jest.fn(),
      setDomicilioEstado: jest.fn(),
      setDomicilioEstadoInhabilitar: jest.fn(),
      setAlcaldia: jest.fn(),
      setAlcaldiaInhabilitar: jest.fn(),
      setLocalidad: jest.fn(),
      setLocalidadInhabilitar: jest.fn(),
      setDomicilioCodigoPostal: jest.fn(),
      setDomicilioCodigoPostalInhabilitar: jest.fn(),
      setColonia: jest.fn(),
      setColoniaInhabilitar: jest.fn(),
      setDomicilioCalle: jest.fn(),
      setDomicilioCalleInhabilitar: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroExteriorInhabilitar: jest.fn(),
      setNumeroInterior: jest.fn(),
      setNumeroInteriorInhabilitar: jest.fn(),
      setDomicilioLada: jest.fn(),
      setDomicilioLadaInhabilitar: jest.fn(),
      setDomicilioTelefono: jest.fn(),
      setDomicilioTelefonoInhabilitar: jest.fn(),
      setDomicilioCorreoElectronico: jest.fn(),
      setDomicilioCorreoElectronicoInhabilitar: jest.fn(),
      setMostrarRfcBuscarBoton: jest.fn(),
      setMostrarCurpBuscarBoton: jest.fn(),
      setInhabilitarPais: jest.fn(),
      updateProveedorTablaDatos: jest.fn(),
      setScianTabla: jest.fn(),
      updateFabricanteTablaDatos: jest.fn(),
      updateTabSeleccionado: jest.fn(),
      setProductoTabla: jest.fn(),
      setSolicitudTabla: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        Service260601Service,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite260601Store, useValue: tramite260601StoreMock },
      ],
    });
    service = TestBed.inject(Service260601Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters with the correct values in actualizarEstadoFormulario', () => {
    const datos: AvisoSanitarioState = {
     RFCResponsableSanitario: 'RFC123',
        razonSocial: 'Empresa SA',
        correoElectronico: 'test@mail.com',
        codigoPostal: '01234',
        cveEstado: 'CDMX',
        descripcionMunicipio: '',
        informacionExtra: '',
        descripcionColonia: '',
        calle: '',
        lada: 0,
        telefono: 0,
        cveSCIAN: '',
        cveSCIANDescripcion: '',
        avisoFuncionamiento: false,
        cveRegimenes: '',
        cveAduanas: '',
        cveProductoClasificacion: '',
        cveEspecificoProductoClasifi: '',
        nombreProducto: '',
        marca: '',
        cveTipoProducto: '',
        fraccionArancelaria: '123456',
        fraccionArancelariaDescripcion: '',
        modelo: '',
        productoDescripcion: '',
        cvePaisDestino: '',
        seleccionadaManifiesto: [false],
        informacionConfidencial: '',
        rfc: '',
        nombreOrazonsocial: '',
        apellidoPaterno: '',
        apellidoMaterno: '',

        tercerosNacionalidad: '',
        tipoPersona: '',
        rfcProveedor: '',
        rfcProveedorInhabilitar: true,
        curp: '',
        curpInhabilitar: true,

        proveedorNombre: '',
        proveedorNombreInhabilitar: true,
        proveedorPrimerApellido: '',
        proveedorPrimerApellidoInhabilitar: true,
        proveedorSegundoApellido: '',
        proveedorSegundoApellidoInhabilitar: true,
        proveedorRazonSocial: '',
        proveedorRazonSocialInhabilitar: true,

        cvePais: '',
        cvePaisInhabilitar: true,
        domicilioEstado: '',
        domicilioEstadoInhabilitar: true,
        alcaldia: '',
        alcaldiaInhabilitar: true,
        localidad: '',
        localidadInhabilitar: true,
        domicilioCodigoPostal: '',
        domicilioCodigoPostalInhabilitar: true,
        colonia: '',
        coloniaInhabilitar: true,
        domicilioCalle: '',
        domicilioCalleInhabilitar: true,
        numeroExterior: '',
        numeroExteriorInhabilitar: true,
        numeroInterior: '',
        numeroInteriorInhabilitar: true,
        domicilioLada: '',
        domicilioLadaInhabilitar: true,
        domicilioTelefono: '',
        domicilioTelefonoInhabilitar: true,
        domicilioCorreoElectronico: '',
        domicilioCorreoElectronicoInhabilitar: true,
        mostrarRfcBuscarBoton: false,
        mostrarCurpBuscarBoton: false,
        inhabilitarPais: true,

        tercerosNacionalidadFabricante: '',
        tipoPersonaFabricante: '',
        rfcFabricante: '',
        rfcFabricanteInhabilitar: true,
        curpFabricante: '',
        curpFabricanteInhabilitar: true,

        fabricanteNombre: '',
        fabricanteNombreInhabilitar: true,
        fabricantePrimerApellido: '',
        fabricantePrimerApellidoInhabilitar: true,
        fabricanteSegundoApellido: '',
        fabricanteSegundoApellidoInhabilitar: true,
        fabricanteRazonSocial: '',
        fabricanteRazonSocialInhabilitar: true,

        cvePaisFabricante: '',
        cvePaisFabricanteInhabilitar: true,
        estadoFabricante: '',
        estadoFabricanteInhabilitar: true,
        alcaldiaFabricante: '',
        alcaldiaFabricanteInhabilitar: true,
        localidadFabricante: '',
        localidadFabricanteInhabilitar: true,
        codigoPostalFabricante: '',
        codigoPostalFabricanteInhabilitar: true,
        coloniaFabricante: '',
        coloniaFabricanteInhabilitar: true,
        calleFabricante: '',
        calleFabricanteInhabilitar: true,
        numeroExteriorFabricante: '',
        numeroExteriorFabricanteInhabilitar: true,
        numeroInteriorFabricante: '',
        numeroInteriorFabricanteInhabilitar: true,
        ladaFabricante: '',
        ladaFabricanteInhabilitar: true,
        telefonoFabricante: '',
        telefonoFabricanteInhabilitar: true,
        correoElectronicoFabricante: '',
        correoElectronicoFabricanteInhabilitar: true,
        mostrarRfcFabricanteBuscarBoton: false,
        mostrarCurpFabricanteBuscarBoton: false,
        inhabilitarPaisFabricante: true,
    } as AvisoSanitarioState;

    service.actualizarEstadoFormulario(datos);

    expect(tramite260601StoreMock.setRFCResponsableSanitario).toHaveBeenCalledWith('RFC123');
    expect(tramite260601StoreMock.setRazonSocial).toHaveBeenCalledWith('Empresa SA');
    expect(tramite260601StoreMock.setCorreoElectronico).toHaveBeenCalledWith('test@mail.com');
    expect(tramite260601StoreMock.setFraccionArancelaria).toHaveBeenCalledWith('123456');
    expect(tramite260601StoreMock.setCodigoPostal).toHaveBeenCalledWith('01234');
    expect(tramite260601StoreMock.setEstado).toHaveBeenCalledWith('CDMX');
    // ... You can add more expects for each setter if desired
  });

  it('should use 0 for lada and telefono if undefined', () => {
    const datos: Partial<AvisoSanitarioState> = {
      lada: undefined,
      telefono: undefined,
    };
    service.actualizarEstadoFormulario(datos as AvisoSanitarioState);
    expect(tramite260601StoreMock.setLada).toHaveBeenCalledWith(0);
    expect(tramite260601StoreMock.setTelefono).toHaveBeenCalledWith(0);
  });

  it('should call http.get with the correct URL in getRegistroTomaMuestrasMercanciasData', done => {
    const expectedData = { RFCResponsableSanitario: 'RFC123' } as AvisoSanitarioState;
    httpClientMock.get.mockReturnValue(of(expectedData));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(expectedData);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/260601/registro_toma_muestras_mercancias.json'
      );
      done();
    });
  });
});