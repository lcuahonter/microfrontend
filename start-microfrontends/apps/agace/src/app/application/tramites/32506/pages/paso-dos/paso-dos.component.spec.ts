import { TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let mockCatalogosService: jest.Mocked<CatalogosService>;
  const mockCatalogo: Catalogo[] = [
    { id: 1, descripcion: 'Documento 1' } as Catalogo,
    { id: 2, descripcion: 'Documento 2' } as Catalogo,
  ];

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(()=> of()),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should fetch and set catalogoDocumentos in getTiposDocumentos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogo));
    component.getTiposDocumentos();
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
