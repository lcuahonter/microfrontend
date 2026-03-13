import { TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn(() => of()),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
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

  it('should set catalogoDocumentos when getTiposDocumentos returns data', () => {
    const mockDocs: Catalogo[] = [{ id: 1, descripcion: 'Doc1' } as Catalogo];
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockDocs));

    component.getTiposDocumentos();

    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('should not set catalogoDocumentos when getTiposDocumentos returns empty array', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));

    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' } as Catalogo];
    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual([
      { id: 1, descripcion: 'Doc1' } as Catalogo,
    ]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifier$ = (component as any)
      .destroyNotifier$ as Subject<void>;
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
