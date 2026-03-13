import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ElementoAnadidasComponent } from './elemento-anadidos.component';
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';

describe('ElementoAnadidasComponent', () => {
  let component: ElementoAnadidasComponent;
  let fixture: ComponentFixture<ElementoAnadidasComponent>;
  let storeMock: any;
  let queryMock: any;
  let serviceMock: any;
  let routerMock: any;
  let locationMock: any;

  beforeEach(async () => {
    storeMock = {
      setElemento: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({}),
    };

    serviceMock = {
      getAduana: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Aduana 1' }])),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    locationMock = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, ElementoAnadidasComponent, TituloComponent, CatalogoSelectComponent],
      providers: [
        { provide: Tramite280101Store, useValue: storeMock },
        { provide: Tramite280101Query, useValue: queryMock },
        { provide: PermisoDeExportacionService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: HttpClient, useValue: { get: jest.fn().mockReturnValue(of([])) } }, // Mock HttpClient with get method
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ElementoAnadidasComponent);
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
    expect(component.parteForm).toBeDefined();
  });

  it('should call setElemento and reset the form on valid Guardar', () => {
    component.parteForm.patchValue({
      descElementoAnadido: 'Elemento 1',
      idElementoAnadido: '1',
      descripcionPresentacion: 'Presentación 1',
      alto: 10,
      ancho: 20,
      profundidad: 30,
    });

    const resetSpy = jest.spyOn(component.parteForm, 'reset');
    component.Guardar();
    expect(storeMock.setElemento).toHaveBeenCalledWith({
      descElementoAnadido: 'Elemento 1',
      idElementoAnadido: '1',
      descripcionPresentacion: 'Presentación 1',
      alto: 10,
      ancho: 20,
      profundidad: 30,
    });
    expect(resetSpy).toHaveBeenCalled();
    expect(locationMock.back).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('should mark all fields as touched on invalid Guardar', () => {
    component.Guardar();
    expect(component.parteForm.touched).toBeTruthy();
  });

  it('should update descElementoAnadido on cambiaElementoAnadido', () => {
    component.aduana = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' }
    ];
    component.parteForm.patchValue({ idElementoAnadido: 1 });
    component.cambiaElementoAnadido();
    expect(component.parteForm.get('descElementoAnadido')?.value).toBe('Aduana 1');
  });

  it('should reset the form and navigate back on CancelElemento', () => {
    component.parteForm.patchValue({
      descElementoAnadido: 'Elemento 1',
      idElementoAnadido: '1',
      descripcionPresentacion: 'Presentación 1',
      alto: 10,
      ancho: 20,
      profundidad: 30,
    });
    const resetSpy = jest.spyOn(component.parteForm, 'reset');
    component.CancelElemento();
    expect(resetSpy).toHaveBeenCalled();
    expect(locationMock.back).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyed$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
