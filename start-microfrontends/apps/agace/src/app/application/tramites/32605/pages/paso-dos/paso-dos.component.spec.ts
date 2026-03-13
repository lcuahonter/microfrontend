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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(() => of([])),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [
        
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
      ],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should assign catalogoDocumentos when getTiposDocumentos returns data', () => {
    const mockDocs: Catalogo[] = [{ id: 1, descripcion: 'Doc1' } as Catalogo];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockDocs));

    component.getTiposDocumentos();

    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(mockDocs);
  });

  it('should not assign catalogoDocumentos when getTiposDocumentos returns empty array', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' } as Catalogo];

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual([
      { id: 1, descripcion: 'Doc1' } as Catalogo,
    ]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
