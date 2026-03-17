import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(() => of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PasoDosComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        { provide: CatalogosService, useValue: catalogosServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle error when getting tipos de documentos', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(
      throwError(() => new Error('API Error'))
    );
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const getTiposDocumentosSpy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(getTiposDocumentosSpy).toHaveBeenCalled();
  });


  it('should assign data to catalogoDocumentos when getTiposDocumentos is successful', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Documento 1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockResponse));
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalledWith(
      CATALOGOS_ID.CAT_TIPO_DOCUMENTO
    );
    expect(component.catalogoDocumentos).toEqual(mockResponse);
  });


  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

});
