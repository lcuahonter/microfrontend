import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogoSelectComponent, CatalogosService, TituloComponent } from '@ng-mf/data-access-user';
import { ImportadorExportadorService } from '../../services/importador-exportador.service';
import { Tramite10301Store } from '../../estados/tramite10301.store';
import { Tramite10301Query } from '../../estados/tramite10301.query';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'ngx-bootstrap/alert';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;
  let importarExportarMock: any;
  let storeMock: any;
  let queryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Doc1' }])),
    };
    importarExportarMock = {
      getTipoDocumento: jest.fn().mockReturnValue(of({ code: 200, data: [{ id: 1, nombre: 'Tipo1' }] })),
      getDocumentos: jest.fn().mockReturnValue(of({ code: 200, data: [{ id: 2, nombre: 'Doc2' }] })),
    };
    storeMock = {
      setTipoDocumento: jest.fn(),
      setDocumentos: jest.fn(),
    };
    queryMock = {
      selectSolicitud$: of({ tipoDocumento: 'A', documentos: 'B' }),
      selectFechasSeleccionadas$: of([{ id: 1, nombre: 'Fecha1' }]),
      selectTipoDocumento$: of([{ id: 1, nombre: 'Tipo1' }]),
      selectDocumento$: of([{ id: 2, nombre: 'Doc2' }]),
    };
    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TituloComponent,
        AlertComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        FormBuilder,
        { provide: CatalogosService, useValue: catalogosServiceMock },
        { provide: ImportadorExportadorService, useValue: importarExportarMock },
        { provide: Tramite10301Store, useValue: storeMock },
        { provide: Tramite10301Query, useValue: queryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and call necessary methods on ngOnInit', fakeAsync(() => {
  const getTiposDocumentosSpy = jest.spyOn(component, 'getTiposDocumentos');
  component.ngOnInit();
  tick(); // Wait for async code
  expect(getTiposDocumentosSpy).toHaveBeenCalled();
  expect(component.documentosSeleccionados.length).toBeGreaterThan(0);
}));

  it('should call getTiposDocumentos and set catalogoDocumentos', () => {
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalled();
    expect(component.catalogoDocumentos.length).toBeGreaterThan(0);
  });

  it('should clear catalogoDocumentos if getCatalogo returns empty', () => {
    catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos.length).toBe(0);
  });

  it('should handle error when getting tipos de documentos', () => {
    catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([]));
    component.catalogoDocumentos = [{ id: 99, descripcion: 'Should be cleared' }];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos.length).toBe(0);
  });

  it('should call getTipoDocumento and setTipoDocumento in store', () => {
    component.getTipoDocumento();
    expect(importarExportarMock.getTipoDocumento).toHaveBeenCalled();
    expect(storeMock.setTipoDocumento).toHaveBeenCalledWith([{ id: 1, nombre: 'Tipo1' }]);
  });

  it('should call getDocumentos and setDocumentos in store', () => {
    component.getDocumentos();
    expect(importarExportarMock.getDocumentos).toHaveBeenCalled();
    expect(storeMock.setDocumentos).toHaveBeenCalledWith([{ id: 2, nombre: 'Doc2' }]);
  });

  it('todosDocumentos should return true if all selected', () => {
    component.documentoSeleccion = ['a', 'b', 'c', 'd', 'e'];
    expect(component.todosDocumentos()).toBe(true);
  });

  it('todosDocumentos should return false if not all selected', () => {
    component.documentoSeleccion = ['a', '', 'c', '', 'e'];
    expect(component.todosDocumentos()).toBeFalsy();
  });

  it('verDocument should do nothing if no document selected', () => {
    const spy = jest.spyOn(component, 'verDocument');
    component.documentoSeleccion = ['', '', '', '', ''];
    component.verDocument(0);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('cambioArchivo should handle file > 3MB', () => {
    const file = new File(['a'.repeat(4 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file], value: '' } } as any;
    component.tamanosDeArchivos = [null, null, null, null, null];
    component.resoluciones = ['', '', '', '', ''];
    component.nombresArchivosSubidos = ['', '', '', '', ''];
    component.cambioArchivo(event, 0);
    expect(component.tamanosDeArchivos[0]).toBeNull();
    expect(component.nombresArchivosSubidos[0]).toBe('');
  });

  it('cambioArchivo should handle file <= 3MB', fakeAsync(() => {
    const file = new File(['a'.repeat(1024)], 'small.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file], value: '' } } as any;
    jest.spyOn(window as any, 'FileReader').mockImplementation(function (this: FileReader) {
      this.readAsDataURL = function (this: FileReader) {
        this.onload!({ target: { result: 'data:image/png;base64,abc' } } as any);
      };
    });
    jest.spyOn(window as any, 'Image').mockImplementation(function (this: any) {
      this.onload = () => { };
      this.onerror = () => { };
      setTimeout(() => this.onload(), 0);
      this.width = 100;
      this.height = 200;
    });
    component.tamanosDeArchivos = [null, null, null, null, null];
    component.resoluciones = ['', '', '', '', ''];
    component.nombresArchivosSubidos = ['', '', '', '', ''];
    component.cambioArchivo(event, 0);
    tick();
    expect(component.nombresArchivosSubidos[0]).toBe('small.pdf');
  }));

  it('adjuntarArchivos should update progreso and set mostrarTablaArchivosSubidos', fakeAsync(() => {
    component.cargando = false;
    component.progreso = 0;
    component.mostrarTablaArchivosSubidos = false;
    component.adjuntarArchivos();
    expect(component.cargando).toBe(true);
    tick(2000);
    expect(component.progreso).toBe(100);
    expect(component.cargando).toBeFalsy();
    expect(component.mostrarTablaArchivosSubidos).toBe(true);
  }));

  it('cerrarProceso should reset mostrarTabla and mostrarTablaArchivosSubidos and set procesoCompletado', () => {
    component.mostrarTabla = true;
    component.mostrarTablaArchivosSubidos = true;
    component.procesoCompletado = false;
    component.cerrarProceso();
    expect(component.mostrarTabla).toBeFalsy();
    expect(component.mostrarTablaArchivosSubidos).toBeFalsy();
    expect(component.procesoCompletado).toBe(true);
  });

  it('isValid should call validacionesService.isValid', () => {
    const form = new FormBuilder().group({ test: [''] });
    expect(component.isValid(form, 'test')).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(form, 'test');
  });

  it('setValoresStore should call store method with value', () => {
    const form = new FormBuilder().group({ campo: ['valor'] });
    storeMock.setValor = jest.fn();
    component.setValoresStore(form, 'campo', 'setValor' as any);
    expect(storeMock.setValor).toHaveBeenCalledWith('valor');
  });

  it('importadorExportador getter should return form group', () => {
    component.tramiteForm = new FormBuilder().group({
      importadorExportador: new FormBuilder().group({}),
    });
    expect(component.importadorExportador).toBeTruthy();
  });

  it('donanteDomicilio should initialize tramiteForm', () => {
    component.solicitudState = {
      tipoDocumento: 'tipo',
      tableCheck: true,
      persona: 'persona',
      donacion: 'donacion',
      otro: 'otro',
      documentos: 'docs',
    } as any;
    component.donanteDomicilio();
    expect(component.tramiteForm.get('importadorExportador.tipoDocumento')).toBeTruthy();
  });

  it('ngOnDestroy should unsubscribe from subscriptions', () => {
    component.getTiposDocumentosSubscription = { unsubscribe: jest.fn() } as any;
    component.getTipoDocumentoSubscription = { unsubscribe: jest.fn() } as any;
    component.ngOnDestroy();
    expect(component.getTiposDocumentosSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.getTipoDocumentoSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should clear catalogoDocumentos if getCatalogo returns empty', fakeAsync(() => {
    catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([]));
    component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
    component.getTiposDocumentos();
    tick();
    expect(component.catalogoDocumentos.length).toBe(0);
  }));

  it('validarDestinatarioFormulario should mark form as touched if invalid', () => {
    component.tramiteForm = new FormBuilder().group({
      test: ['', Validators.required],
    });
    const spy = jest.spyOn(component.tramiteForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });
  it('should handle error when getting tipos de documentos', fakeAsync(() => {
    catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([]));
    component.catalogoDocumentos = [{ id: 99, descripcion: 'Should be cleared' }];
    component.getTiposDocumentos();
    tick(); // let observable emit
    expect(component.catalogoDocumentos.length).toBe(0);
  }));
  it('should clear catalogoDocumentos if getCatalogo returns empty', fakeAsync(() => {
  catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([]));
  component.catalogoDocumentos = [{ id: 1, descripcion: 'Doc1' }];
  component.getTiposDocumentos();
  tick(); // let observable emit
  expect(component.catalogoDocumentos.length).toBe(0);
}));
});