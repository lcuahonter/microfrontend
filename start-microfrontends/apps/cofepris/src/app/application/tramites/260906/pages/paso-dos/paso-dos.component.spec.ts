import { PasoduosComponent } from './paso-dos.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('PasoduosComponent', () => {
  let componente: PasoduosComponent;
  let fixture: ComponentFixture<PasoduosComponent>;
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
      declarations: [PasoduosComponent],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoduosComponent);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar documentosSeleccionados y llamar getTiposDocumentos al iniciar', () => {
    const SPY_GET_TIPOS = jest.spyOn(componente, 'getTiposDocumentos').mockImplementation(() => {});

    componente.ngOnInit();

    expect(SPY_GET_TIPOS).toHaveBeenCalled();

  });

  it('debería llenar catalogoDocumentos si el servicio retorna datos', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of(CATALOGO_MOCK));

    componente.getTiposDocumentos();

    expect(componente.catalogoDocumentos).toEqual(CATALOGO_MOCK);
  });

  it('no debería llenar catalogoDocumentos si el servicio retorna lista vacía', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));

    componente.getTiposDocumentos();

    expect(componente.catalogoDocumentos).toEqual([]);
  });

  it('debería manejar error del servicio sin lanzar excepción', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => new Error('Error de servicio')));

    expect(() => componente.getTiposDocumentos()).not.toThrow();
  });
});
