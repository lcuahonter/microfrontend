import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CancelacionesStore } from '../estados/cancelaciones.store';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: any;
  let storeMock: any;

  beforeEach(() => {
    httpMock = { get: jest.fn() };
    storeMock = {
      setEntidadFed: jest.fn(),
      setColonia: jest.fn(),
      setLocalidad: jest.fn(),
      setMunicipiosAlcaldia: jest.fn(),
      setPaisInput: jest.fn(),
      setNumeroInterior: jest.fn(),
      setCodigoPostal: jest.fn(),
      setTelefono: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setRfcIngresado: jest.fn(),
      setMotivoCancelacion: jest.fn(),
      setEntidadExterna: jest.fn(),
      setNombreSolicitanteIPC: jest.fn(),
      setCargoSolicitanteIPC: jest.fn(),
      setFolioOficioSolicitudIPC: jest.fn(),
      setCorreoSolicitanteIPC: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SolicitudService,
        { provide: HttpClient, useValue: httpMock },
        { provide: CancelacionesStore, useValue: storeMock }
      ]
    });

    service = TestBed.inject(SolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters in actualizarEstadoFormulario', () => {
    const datos = {
      entidadFederativa: 'CDMX',
      colonia: 'Centro',
      localidad: 'Localidad',
      municipio: 'Benito Juárez',
      paisInput: 'MX',
      numeroInterior: '12',
      codigoPostal: '12345',
      telefono: '55555555',
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      correoElectronico: 'juan@mail.com',
      rfcIngresado: 'XAXX010101000',
      motivoCancelacion: 'Motivo',
      entidadExterna: 'Entidad',
      nombreSolicitanteIPC: 'Solicitante',
      cargoSolicitanteIPC: 'Cargo',
      folioOficioSolicitudIPC: 'Folio',
      correoSolicitanteIPC: 'correo@ipc.com'
    };

    service.actualizarEstadoFormulario(datos as any);

    expect(storeMock.setEntidadFed).toHaveBeenCalledWith('CDMX');
    expect(storeMock.setColonia).toHaveBeenCalledWith('Centro');
    expect(storeMock.setLocalidad).toHaveBeenCalledWith('Localidad');
    expect(storeMock.setMunicipiosAlcaldia).toHaveBeenCalledWith('Benito Juárez');
    expect(storeMock.setPaisInput).toHaveBeenCalledWith('MX');
    expect(storeMock.setNumeroInterior).toHaveBeenCalledWith('12');
    expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('12345');
    expect(storeMock.setTelefono).toHaveBeenCalledWith('55555555');
    expect(storeMock.setNombre).toHaveBeenCalledWith('Juan');
    expect(storeMock.setApellidoPaterno).toHaveBeenCalledWith('Pérez');
    expect(storeMock.setCorreoElectronico).toHaveBeenCalledWith('juan@mail.com');
    expect(storeMock.setRfcIngresado).toHaveBeenCalledWith('XAXX010101000');
    expect(storeMock.setMotivoCancelacion).toHaveBeenCalledWith('Motivo');
    expect(storeMock.setEntidadExterna).toHaveBeenCalledWith('Entidad');
    expect(storeMock.setNombreSolicitanteIPC).toHaveBeenCalledWith('Solicitante');
    expect(storeMock.setCargoSolicitanteIPC).toHaveBeenCalledWith('Cargo');
    expect(storeMock.setFolioOficioSolicitudIPC).toHaveBeenCalledWith('Folio');
    expect(storeMock.setCorreoSolicitanteIPC).toHaveBeenCalledWith('correo@ipc.com');
  });

  it('should only call setters for present fields in actualizarEstadoFormulario', () => {
    const datos = {
      paisInput: 'MX',
      nombre: 'Juan'
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(storeMock.setPaisInput).toHaveBeenCalledWith('MX');
    expect(storeMock.setNombre).toHaveBeenCalledWith('Juan');
    expect(storeMock.setEntidadFed).not.toHaveBeenCalled();
    expect(storeMock.setColonia).not.toHaveBeenCalled();
    expect(storeMock.setLocalidad).not.toHaveBeenCalled();
    expect(storeMock.setMunicipiosAlcaldia).not.toHaveBeenCalled();
  });

  it('should get registro toma muestras mercancias data', () => {
    const mockData = { nombre: 'Juan' };
    httpMock.get.mockReturnValue(of(mockData));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(result => {
      expect(result).toEqual(mockData);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/140201/actualizar-datos-estado.json');
  });
});