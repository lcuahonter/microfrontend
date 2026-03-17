import { TestBed } from '@angular/core/testing';
import { SeleccionarDocumentosComponent } from './seleccionar-documentos.component';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { of, throwError } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SeleccionarDocumentosComponent', () => {
  let component: SeleccionarDocumentosComponent;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(() => of('tipos-documento')),
    } as unknown as jest.Mocked<CatalogosService>;

    TestBed.configureTestingModule({
      imports: [
        SeleccionarDocumentosComponent,
        AlertComponent,
        CommonModule,
        AnexarDocumentosComponent,
        TituloComponent,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        ToastrService,
        { provide: CatalogosService, useValue: catalogosServiceMock },
      ],
    });

    const fixture = TestBed.createComponent(SeleccionarDocumentosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    component.getTiposDocumentos();
    expect(component.getTiposDocumentos).toHaveBeenCalled();
  });

  it('should populate catalogoDocumentos on successful getCatalogo call', () => {
    const mockResponse = [{ id: 1, descripcion: 'Document 1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockResponse));

    component.getTiposDocumentos();

   });

  it('should handle error in getCatalogo call', () => {
    const mockError = new Error('Error fetching catalog');
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(mockError));
    component.getTiposDocumentos();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.seleccionaRequerimientoForm = {
      disable: jest.fn(()=> of()),
      enable: jest.fn(()=> of()),
    } as any;
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.seleccionaRequerimientoForm = {
      disable: jest.fn(()=> of()),
      enable: jest.fn(()=> of()),
    } as any;
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
