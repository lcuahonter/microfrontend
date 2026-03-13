import { TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  const mockTiposDocumentos: Catalogo[] = [
    { id: 3, descripcion: 'Documento 3' },
    { id: 4, descripcion: 'Documento 4' }
  ];

  beforeEach(async () => {
    const mockCatalogosService = {
      getCatalogo: jest.fn(()=> of())
    };

    await TestBed.configureTestingModule({
      imports: [PasoDosComponent, HttpClientTestingModule],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    catalogosServiceMock = TestBed.inject(CatalogosService) as jest.Mocked<CatalogosService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set tiposDocumentos when getTiposDocumentos returns data', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockTiposDocumentos));
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.tiposDocumentos).toEqual(mockTiposDocumentos);
  });

  it('should not set tiposDocumentos when getTiposDocumentos returns empty array', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.tiposDocumentos = [];
    component.getTiposDocumentos();
    expect(component.tiposDocumentos).toEqual([]);
  });

  it('should add a document to documentosSeleccionados when agregarDocumento is called', () => {
    component.tiposDocumentos = [
      { id: 10, descripcion: 'Doc 10' },
      { id: 11, descripcion: 'Doc 11' }
    ];
    const initialLength = component.documentosSeleccionados.length;
    component.agregarDocumento(10);
    expect(component.documentosSeleccionados.length).toBe(initialLength + 1);
    expect(component.documentosSeleccionados[component.documentosSeleccionados.length - 1]).toEqual({ id: 10, descripcion: 'Doc 10' });
  });

  it('should not add a document if id does not exist in tiposDocumentos', () => {
    component.tiposDocumentos = [{ id: 20, descripcion: 'Doc 20' }];
    const initialLength = component.documentosSeleccionados.length;
    component.agregarDocumento(99);
    expect(component.documentosSeleccionados.length).toBe(initialLength);
  });

  it('should remove a document from documentosSeleccionados when eliminar is called', () => {
    component.documentosSeleccionados = [{ id: 1, descripcion: 'Doc 1' }];
    const initialLength = component.documentosSeleccionados.length;
    component.eliminar(0);
    expect(component.documentosSeleccionados.length).toBe(initialLength - 1);
  });

  it('should not throw if eliminar is called with invalid index', () => {
    expect(() => component.eliminar(100)).not.toThrow();
  });
});