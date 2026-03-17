import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { of, throwError, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of([])) // Always return an observable by default
    };

    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar TEXTOS correctamente', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('debería llamar a getTiposDocumentos en ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería asignar catalogoDocumentos si la respuesta tiene elementos', () => {
    const mockDocs = [{ id: 1, nombre: 'doc1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockDocs));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('no debería asignar catalogoDocumentos si la respuesta está vacía', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'doc1' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 1, descripcion: 'doc1' }]);
  });

  it('debería manejar el error en getTiposDocumentos', () => {
    const error = new Error('error');
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => error));
    expect(() => component.getTiposDocumentos()).not.toThrow();
  });

  it('debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});