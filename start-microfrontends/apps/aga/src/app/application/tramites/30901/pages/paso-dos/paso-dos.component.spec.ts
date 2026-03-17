import { TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { RenovacionesMuestrasMercanciasService } from '../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import { of } from 'rxjs';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src';
import { TEXTOS } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let mockCatalogosService: jest.Mocked<CatalogosService>;
  let mockRenovacionesService: jest.Mocked<RenovacionesMuestrasMercanciasService>;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(() => of([])),
    } as any;

    mockRenovacionesService = {} as any;

    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
        {
          provide: RenovacionesMuestrasMercanciasService,
          useValue: mockRenovacionesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS property set', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set catalogoDocumentos when getTiposDocumentos receives data', () => {
    const mockCatalogo = [{ id: 1, descripcion: 'Doc1' }];
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogo));
    component.getTiposDocumentos();
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('should not set catalogoDocumentos when getTiposDocumentos receives empty array', () => {
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([
      { id: 1, descripcion: 'Doc1' },
    ]);
  });
});
