import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TituloComponent, TablaDinamicaComponent, CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { DatosMonumentoComponent } from './datos-monumentos.component';
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';
import { HttpClientModule } from '@angular/common/http';

describe('DatosMonumentoComponent', () => {
  let component: DatosMonumentoComponent;
  let fixture: ComponentFixture<DatosMonumentoComponent>;
  let storeMock: any;
  let queryMock: any;
  let serviceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    storeMock = {
      setMonumento: jest.fn(),
      borrorElemento: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        elementoTablaDatos: [],
        aduana: [{ id: 1, descripcion: 'Aduana 1' }],
        fracciones: [{ id: 1, descripcion: 'Fraccion 1' }], // Ensure mock data matches test case
      }),
    };

    serviceMock = {
      getAduana: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Aduana 1' }])),
      indice: 0,
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        DatosMonumentoComponent,
        TituloComponent,
        TablaDinamicaComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        { provide: Tramite280101Store, useValue: storeMock },
        { provide: Tramite280101Query, useValue: queryMock },
        { provide: PermisoDeExportacionService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMonumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and fetch aduana data on ngOnInit', () => {
    const getAduanaSpy = jest.spyOn(component, 'getAduana');
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(getAduanaSpy).toHaveBeenCalled();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
    expect(component.mercanciaForm).toBeDefined();
  });

  it('should call setMonumento and reset the form on valid Guardar', () => {
    component.mercanciaForm.patchValue({
      descripcionMercancia: 'Mercancia 1',
      generica2: 'Epoca 1',
      descripcionIdentificacion: 'Autor 1',
      generica1: 'Material 1',
      cantidadPresentacion: 10,
      componente: 20,
      importeTotalComponente: 30,
      idFraccionGubernamental: 'Fraccion 1',
      descripcionUsoMercancia: 'Estado 1',
    });
    const resetSpy = jest.spyOn(component.mercanciaForm, 'reset');
    component.Guardar();

    expect(storeMock.setMonumento).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['../permiso'], { relativeTo: component.activatedRoute });
    resetSpy.mockRestore();
  });

  it('should mark all fields as touched on invalid Guardar', () => {
    component.Guardar();
    expect(component.mercanciaForm.touched).toBeTruthy();
  });

  it('should update descEpoca on cambiaEpoca', () => {
     component.aduana = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' }
    ];
    component.mercanciaForm.patchValue({ generica2: 1 });
    component.cambiaEpoca();
    expect(component.mercanciaForm.get('descEpoca')?.value).toBe('Aduana 1');
  });

  it('should update descMaterial on cambiaMaterial', () => {
     component.aduana = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' }
    ];
    component.mercanciaForm.patchValue({ generica1: 1 });
    component.cambiaMaterial();
    expect(component.mercanciaForm.get('descMaterial')?.value).toBe('Aduana 1');
  });

  it('should update descFraccion on cambiaFraccion', () => {

     component.aduana = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' }
    ];
    component.mercanciaForm.patchValue({ idFraccionGubernamental: 1 });
    component.cambiaFraccion();
    expect(component.mercanciaForm.get('descFraccion')?.value).toBe('Aduana 1'); // Ensure test case aligns with mock data
  });

  it('should call borrorElemento on Borrar', () => {
    const elemento = { descElementoAnadido: 'Elemento 1', idElementoAnadido: '1', descripcionPresentacion: 'Presentacion', alto: 10, ancho: 20, profundidad: 30 };
    component.elementoSeleccionLista = [elemento];
    component.Borrar();
    expect(storeMock.borrorElemento).toHaveBeenCalledWith(elemento); // Ensure the correct argument is passed
    expect(component.elementoSeleccionLista.length).toBe(0);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
  
});
