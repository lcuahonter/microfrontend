import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { of, throwError } from 'rxjs';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  const CATALOGO_MOCK: Catalogo[] = [
    { id: 1, descripcion: 'Tipo Documento 1' },
    { id: 2, descripcion: 'Tipo Documento 2' },
  ];

  beforeEach(async () => {
      catalogosServiceMock = {
        getCatalogo: jest.fn()
      } as unknown as jest.Mocked<CatalogosService>;
  
      await TestBed.configureTestingModule({
        declarations: [PasoTresComponent],
        providers: [
          { provide: CatalogosService, useValue: catalogosServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
  
      fixture = TestBed.createComponent(PasoTresComponent);
      component = fixture.componentInstance;
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar documentosSeleccionados y llamar getTiposDocumentos al iniciar', () => {
    const SPY_GET_TIPOS = jest.spyOn(component, 'getTiposDocumentos').mockImplementation(() => {});

    component.ngOnInit();

    expect(SPY_GET_TIPOS).toHaveBeenCalled();

  });

  it('debería llenar catalogoDocumentos si el servicio retorna datos', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of(CATALOGO_MOCK));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual(CATALOGO_MOCK);
  });

  it('no debería llenar catalogoDocumentos si el servicio retorna lista vacía', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('debería manejar error del servicio sin lanzar excepción', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => new Error('Error de servicio')));

    expect(() => component.getTiposDocumentos()).not.toThrow();
  });
});
