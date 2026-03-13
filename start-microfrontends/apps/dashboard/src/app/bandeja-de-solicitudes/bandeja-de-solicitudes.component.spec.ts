import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BandejaDeSolicitudesComponent } from './bandeja-de-solicitudes.component';
import { BandejaDeSolicitudeService } from '../services/bandeja-de-solicitude.service';
import { of, throwError } from 'rxjs';
import { LibBandejaComponent, BandejaDeSolicitudes, JSONResponse } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

describe('BandejaDeSolicitudesComponent (Jest)', () => {
  let component: BandejaDeSolicitudesComponent;
  let fixture: ComponentFixture<BandejaDeSolicitudesComponent>;
  let mockService: jest.Mocked<BandejaDeSolicitudeService>;

  const expectedData: BandejaDeSolicitudes[] = [
    {
      id: 1,
      tipoDeTramite: "Solicitud de Permiso",
      fecha: "2023-10-01",
      fechaActualizacion: "2023-10-05",
      diasTranscurridos: "4",
      departamento: "AGA",
      numeroDeProcedimiento: "301",
      id_solicitud: ''
    }
  ];
  
  const mockResponse: JSONResponse = {
    id: 1,
    descripcion: 'Success',
    codigo: '200',
    data: expectedData as any
  };
  

  beforeEach(async () => {
    mockService = {
      getSolicitudeTablaDatos: jest.fn()
    } as unknown as jest.Mocked<BandejaDeSolicitudeService>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, LibBandejaComponent, BandejaDeSolicitudesComponent],
      providers: [
        { provide: BandejaDeSolicitudeService, useValue: mockService, },
        provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(BandejaDeSolicitudesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSolicitudeTablaDatos and set bandejaTablaDatos', () => {
    mockService.getSolicitudeTablaDatos.mockReturnValue(of(mockResponse));

    component.getSolicitudeTablaDatos();

    expect(mockService.getSolicitudeTablaDatos).toHaveBeenCalled();
    expect(component.bandejaTablaDatos).toEqual(mockResponse);
  });

  it('should call getSolicitudeTablaDatos on ngOnInit', () => {
    mockService.getSolicitudeTablaDatos.mockReturnValue(of(mockResponse));
    const spy = jest.spyOn(component, 'getSolicitudeTablaDatos');

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle service error gracefully', () => {
    const mockError = new Error('Test error');
  mockService.getSolicitudeTablaDatos.mockReturnValue(throwError(() => mockError));

  expect(() => component.getSolicitudeTablaDatos()).not.toThrow();
  expect(mockService.getSolicitudeTablaDatos).toHaveBeenCalled();
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not modify other properties of selectedDepartamentoObj', () => {
    const initialObj = {
      tieneDepartamento: true,
      numeroDeProcedimiento: '1',
      nombreDelDepartamento: 'Depto'
    };
    component.selectedDepartamentoObj = { ...initialObj };
    const evento = { campo: 'numeroDeProcedimiento', valor: '1' };
    component.procedureNumero(evento);
    expect(component.selectedDepartamentoObj.tieneDepartamento).toBe(true);
    expect(component.selectedDepartamentoObj.nombreDelDepartamento).toBe('Depto');
    expect(component.selectedDepartamentoObj.numeroDeProcedimiento).toBe('1');
  });

  it('should not modify other properties of selectedDepartamentoObj', () => {
    const initialObj = {
      tieneDepartamento: true,
      numeroDeProcedimiento: '1',
      nombreDelDepartamento: 'Depto'
    };
    component.selectedDepartamentoObj = { ...initialObj };
    const evento = { campo: 'numeroDeProcedimiento', valor: '1' };
    component.procedureNumero(evento);
    expect(component.selectedDepartamentoObj.tieneDepartamento).toBe(true);
    expect(component.selectedDepartamentoObj.nombreDelDepartamento).toBe('Depto');
    expect(component.selectedDepartamentoObj.numeroDeProcedimiento).toBe('1');
  });

  describe('bandejaConfiguracionTabla', () => {
    it('should have 7 columns with correct headers and order', () => {
      expect(component.bandejaConfiguracionTabla.length).toBe(7);

      const headers = component.bandejaConfiguracionTabla.map(col => col.encabezado);
      expect(headers).toEqual([
        'Id solicitud',
        'Tipo de trámite',
        'Fecha creación',
        'Fecha actualización',
        'Dias transcurridos',
        'Departamento',
        'Número de procedimiento'
      ]);

      const orders = component.bandejaConfiguracionTabla.map(col => col.orden);
      expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should extract correct values using clave functions', () => {
      const testRow = {
        id: 42,
        tipoDeTramite: 'Alta',
        fecha: '2024-06-01',
        fechaActualizacion: '2024-06-02',
        diasTranscurridos: '1',
        departamento: 'TI',
        numeroDeProcedimiento: '2'
      };

      expect(component.bandejaConfiguracionTabla[0].clave(testRow)).toBe(42);
      expect(component.bandejaConfiguracionTabla[1].clave(testRow)).toBe('Alta');
      expect(component.bandejaConfiguracionTabla[2].clave(testRow)).toBe('2024-06-01');
      expect(component.bandejaConfiguracionTabla[3].clave(testRow)).toBe('2024-06-02');
      expect(component.bandejaConfiguracionTabla[4].clave(testRow)).toBe('1');
      expect(component.bandejaConfiguracionTabla[5].clave(testRow)).toBe('TI');
      expect(component.bandejaConfiguracionTabla[6].clave(testRow)).toBe('2');
    });
  });

});
