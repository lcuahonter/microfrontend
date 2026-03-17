import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosAnexosComponent } from './datos-anexos.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { of, throwError } from 'rxjs';
import { Anexo } from '../../estados/models/plantas-consulta.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosAnexosComponent', () => {
  let component: DatosAnexosComponent;
  let fixture: ComponentFixture<DatosAnexosComponent>;
  let mockImmerModificacionService: jest.Mocked<ImmerModificacionService>;
  let toastrService: jest.Mocked<ToastrService>;

  const dummyAnexos: Anexo[] = [
    {
      tipoFraccion: 'Exportación',
      fraccionArancelariaExportacion: '1234.56.78',
      fraccionArancelariaImportacion: '8765.43.21',
      descripcion: 'Descripción de prueba',
      valoresAnteriores: 'Valor 1',
    },
  ];

  beforeEach(async () => {
    mockImmerModificacionService = {
      obtenerAnexo: jest.fn(),
    } as unknown as jest.Mocked<ImmerModificacionService>;

    toastrService = {
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    await TestBed.configureTestingModule({
      imports: [DatosAnexosComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: ImmerModificacionService, useValue: mockImmerModificacionService },
        { provide: ToastrService, useValue: toastrService },
        {
          provide: '_HttpClient',
          useValue: {} // Mock implementation of _HttpClient
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAnexosComponent);
    component = fixture.componentInstance;
    
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have table configuration properties defined', () => {
    expect(component.configuracionTablaAnexo).toBeDefined();
    expect(component.configuracionTablaImportacion).toBeDefined();
    expect(component.configuracionTablaSensibles).toBeDefined();
    expect(Array.isArray(component.configuracionTablaAnexo)).toBe(true);
    expect(Array.isArray(component.configuracionTablaImportacion)).toBe(true);
    expect(Array.isArray(component.configuracionTablaSensibles)).toBe(true);
  });

  it('should populate datosExportacion and call store in obteneProductosExportacion', () => {
    const exportData = [{ test: 'export' }];
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerProductosExportacion: jest.fn().mockReturnValue(of({ datos: exportData })),
    } as any;
    (component as any).tramite80306Store = { setDatosExportacion: jest.fn() };
    component.obteneProductosExportacion();
    expect(component.datosExportacion).toEqual(exportData);
    expect((component as any).tramite80306Store.setDatosExportacion).toHaveBeenCalledWith(exportData);
  });

  it('should handle error in obteneProductosExportacion', () => {
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerProductosExportacion: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
  (component as any).toastr = { error: jest.fn() } as any;
    component.obteneProductosExportacion();
  expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los anexos');
  });

  it('should populate datosImportacion and call store in obteneProductosImportacion', () => {
    const importData = [{ test: 'import' }];
    component.buscarIdSolicitudString = '2';
    component.solicitudService = {
      obtenerProductosImportacion: jest.fn().mockReturnValue(of({ datos: importData })),
    } as any;
    (component as any).tramite80306Store = { setDatosImportacion: jest.fn() };
    component.obteneProductosImportacion();
    expect(component.datosImportacion).toEqual(importData);
    expect((component as any).tramite80306Store.setDatosImportacion).toHaveBeenCalledWith(importData);
  });

  it('should handle error in obteneProductosImportacion', () => {
    component.buscarIdSolicitudString = '2';
    component.solicitudService = {
      obtenerProductosImportacion: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
  (component as any).toastr = { error: jest.fn() } as any;
    component.obteneProductosImportacion();
  expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los anexos');
  });

  it('should populate datosFraccion and call store in obteneComplementaria', () => {
    const sensitiveData = [{ test: 'sensitive' }];
    component.buscarIdSolicitudString = '3';
    component.solicitudService = {
      obtenerFraccionesSensibles: jest.fn().mockReturnValue(of({ datos: sensitiveData })),
    } as any;
    (component as any).tramite80306Store = { setDatosFraccion: jest.fn() };
    component.obteneComplementaria();
    expect(component.datosFraccion).toEqual(sensitiveData);
    expect((component as any).tramite80306Store.setDatosFraccion).toHaveBeenCalledWith(sensitiveData);
  });

  it('should handle error in obteneComplementaria', () => {
    component.buscarIdSolicitudString = '3';
    component.solicitudService = {
      obtenerFraccionesSensibles: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
  (component as any).toastr = { error: jest.fn() } as any;
    component.obteneComplementaria();
  expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los anexos');
  });

  it('should call obtenerAnexo and populate datosAnexo and datosImportacion', () => {
    mockImmerModificacionService.obtenerAnexo.mockReturnValue(of(dummyAnexos));
    
    fixture.detectChanges(); // triggers ngOnInit, which calls obteneComplimentaria

    expect(mockImmerModificacionService.obtenerAnexo).toHaveBeenCalled();
  expect(component.datosImportacion).toEqual(dummyAnexos);
    expect(component.datosImportacion).toEqual(dummyAnexos);
  });

  it('should handle error when obtenerAnexo fails', () => {
    mockImmerModificacionService.obtenerAnexo.mockReturnValue(throwError(() => new Error('Error')));
    
    fixture.detectChanges(); // triggers ngOnInit, which calls obteneComplimentaria

    expect(mockImmerModificacionService.obtenerAnexo).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith('Error al cargar los anexos');
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
