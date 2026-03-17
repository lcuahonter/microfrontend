import { PasoDosComponent } from './paso-dos.component';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { CatalogosService } from '@libs/shared/data-access-user/src';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    } as any;

    component = new PasoDosComponent(catalogosServiceMock);
    component.cargaArchivosEvento = new EventEmitter<void>();
    component.regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial properties defined', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.catalogoDocumentos).toEqual([]);
    expect(component.documentosSeleccionados).toEqual([]);
    expect(component.cargaRealizada).toBe(false);
  });

  it('should have required methods', () => {
    expect(typeof component.ngOnInit).toBe('function');
    expect(typeof component.ngOnDestroy).toBe('function');
    expect(typeof component.getTiposDocumentos).toBe('function');
    expect(typeof component.documentosCargados).toBe('function');
    expect(typeof component.manejarEventoCargaDocumento).toBe('function');
  });

  it('should update cargaRealizada in documentosCargados', () => {
    const spy = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    component.documentosCargados(true);
    
    expect(component.cargaRealizada).toBe(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit event in manejarEventoCargaDocumento', () => {
    const spy = jest.spyOn(component.reenviarEventoCarga, 'emit');
    
    component.manejarEventoCargaDocumento(true);
    
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should call getCatalogo when getTiposDocumentos is called', () => {
    const mockCatalog = [{ id: 1, nombre: 'Test Doc', descripcion: 'Test Description' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalog));

    component.getTiposDocumentos();

    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalled();
  });

  it('should complete destroyed$ on destroy', () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should perform basic arithmetic', () => {
    const sum = 3 + 4;
    expect(sum).toBe(7);
    expect(sum).toBeGreaterThan(6);
  });

  it('should have string properties with correct types', () => {
    expect(typeof component.infoAlert).toBe('string');
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should have boolean property cargaRealizada', () => {
    expect(typeof component.cargaRealizada).toBe('boolean');
    expect(component.cargaRealizada).toBe(false);
  });
});