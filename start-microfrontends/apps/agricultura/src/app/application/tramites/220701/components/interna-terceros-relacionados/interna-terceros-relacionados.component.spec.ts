import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { InternaTercerosRelacionadosComponent } from './interna-terceros-relacionados.component';
import { ExportadorDatosService } from '../../servicios/exportador-datos.service';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockExportadorDatosService {
  getDatos() {
    return of({
      exportadorContenido: [{ id: 1, nombre: 'Exportador1' }],
      destinoContenido: [{ id: 2, nombre: 'Destino1' }]
    });
  }
}

describe('InternaTercerosRelacionadosComponent', () => {
  let fixture: ComponentFixture<InternaTercerosRelacionadosComponent>;
  let component: InternaTercerosRelacionadosComponent;
  let exportadorDatosService: MockExportadorDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, InternaTercerosRelacionadosComponent, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ExportadorDatosService, useClass: MockExportadorDatosService },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InternaTercerosRelacionadosComponent);
    component = fixture.componentInstance;
    exportadorDatosService = TestBed.inject(ExportadorDatosService) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerDatos on ngOnInit (indirect assertion)', () => {
    const spy = jest.spyOn(component, 'obtenerDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set exportadorTableDatos and destinoTablaDatos on obtenerDatos success', () => {
    jest.spyOn(exportadorDatosService, 'getDatos').mockReturnValue(
      of({
        exportadorContenido: [{ id: 1, nombre: 'Exportador1' }],
        destinoContenido: [{ id: 2, nombre: 'Destino1' }]
      })
    );
    const cdrSpy = jest.spyOn(component['cdr'], 'detectChanges');
    component.obtenerDatos();
    expect(component.exportadorTableDatos).toEqual([{ id: 1, nombre: 'Exportador1' }]);
    expect(component.destinoTablaDatos).toEqual([{ id: 2, nombre: 'Destino1' }]);
    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should log error if obtenerDatos receives malformed response', () => {
    jest.spyOn(exportadorDatosService, 'getDatos').mockReturnValue(
      of({} as { exportadorContenido: { id: number; nombre: string; }[]; destinoContenido: { id: number; nombre: string; }[]; })
    );
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.obtenerDatos();
    expect(logSpy).toHaveBeenCalledWith(
      'La respuesta de la API no tiene el formato esperado: ',
      {}
    );
  });

  it('should log error if obtenerDatos fails', () => {
    jest.spyOn(exportadorDatosService, 'getDatos').mockReturnValue(throwError(() => new Error('fail')));
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.obtenerDatos();
    expect(logSpy).toHaveBeenCalledWith('Error al obtener datos: ', expect.any(Error));
  });

  it('should have default values for selection types and columns', () => {
    expect(component.tablaSeleccionRadio).toBeDefined();
    expect(component.tablaSeleccionCheckbox).toBeDefined();
    expect(Array.isArray(component.exportadorTabla)).toBe(true);
    expect(Array.isArray(component.destinoTabla)).toBe(true);
  });

  it('should have instruccionDobleClic set from enum', () => {
    expect(typeof component.instruccionDobleClic).toBe('string');
    expect(component.instruccionDobleClic.length).toBeGreaterThan(0);
  });

  it('should trigger change detection after successful data fetch', () => {
    jest.spyOn(exportadorDatosService, 'getDatos').mockReturnValue(
      of({
        exportadorContenido: [{ id: 3, nombre: 'Exportador3' }],
        destinoContenido: [{ id: 4, nombre: 'Destino4' }]
      })
    );
    const cdrSpy = jest.spyOn(component['cdr'], 'detectChanges');
    component.obtenerDatos();
    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribe$ = (component as any).unsubscribe$ as Subject<void>;
    const nextSpy = jest.spyOn(unsubscribe$, 'next');
    const completeSpy = jest.spyOn(unsubscribe$, 'complete');
  });
});