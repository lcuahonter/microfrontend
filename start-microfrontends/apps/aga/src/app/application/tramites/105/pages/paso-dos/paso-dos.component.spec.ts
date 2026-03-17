import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { of } from 'rxjs';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Para ignorar elementos desconocidos como `ng-titulo`
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { TEXTOS } from '@ng-mf/data-access-user';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    // Crear un mock de CatalogosService
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of([])), // Mock del método getCatalogo
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }, // Proveer el servicio mock
      ],
      imports: [HttpClientModule], // Importar HttpClientModule
      schemas: [NO_ERRORS_SCHEMA], // Ignorar componentes desconocidos como 'ng-titulo'
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener TEXTOS definido', () => {
    expect(component.TEXTOS).toEqual(TEXTOS);
  });

  it('debería llamar a getCatalogo en la inicialización', () => {
    const spy = jest.spyOn(catalogosServiceMock, 'getCatalogo');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
  });

  it('debería almacenar los documentos del catálogo en catalogoDocumentos', () => {
    const mockCatalogo = [{ id: 1, descripcion: 'Documento 1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalogo));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('debería manejar una respuesta vacía de getCatalogo', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual([]);
  });
});