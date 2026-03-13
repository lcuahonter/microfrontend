import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonumentoComponent } from './monumento.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query';
import { of } from 'rxjs';

describe('MonumentoComponent', () => {
  let component: MonumentoComponent;
  let fixture: ComponentFixture<MonumentoComponent>;
  let routerMock: any;
  let activatedRouteMock: any;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    activatedRouteMock = {};
    storeMock = { borrorMonumentos: jest.fn() };
    queryMock = {
      selectSolicitud$: of({
        monumentoTablaDatos: [{ titulo: 'Monumento 1', epoca: 'Epoca 1', autor: 'Autor 1',material: '',
          alto: 0,
          ancho: 0,
          profundidad: '',
          fraccion: '',
          descripcionEstado: '',
          descMaterial: '',
          descFraccion: '',
          descEpoca: '' }],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [MonumentoComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Tramite280101Store, useValue: storeMock },
        { provide: Tramite280101Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize monumentoTablaDatos on ngOnInit', () => {
    component.ngOnInit();
    expect(component['solicitudState']).toBeDefined();
    expect(Array.isArray(component.monumentoTablaDatos)).toBe(true);
  });

  it('should navigate to datos-monumento on agregar', () => {
    component.agregar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['../datos-monumento'], {
      relativeTo: activatedRouteMock,
    });
  });

  it('should not call borrorMonumentos if monumentoSeleccionLista is empty in Borrar', () => {
    component.monumentoSeleccionLista = [];
    component.Borrar();
    expect(storeMock.borrorMonumentos).not.toHaveBeenCalled();
  });

  it('should call borrorMonumentos with first selected and clear selection in Borrar', () => {
    const selected = { titulo: 'Monumento 1', epoca: 'Epoca 1', autor: 'Autor 1',material: '',
          alto: 0,
          ancho: 0,
          profundidad: '',
          fraccion: '',
          descripcionEstado: '',
          descMaterial: '',
          descFraccion: '',
          descEpoca: ''  };
    component.monumentoSeleccionLista = [selected];
    component.Borrar();
    expect(storeMock.borrorMonumentos).toHaveBeenCalledWith(selected);
    expect(component.monumentoSeleccionLista).toEqual([]);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
