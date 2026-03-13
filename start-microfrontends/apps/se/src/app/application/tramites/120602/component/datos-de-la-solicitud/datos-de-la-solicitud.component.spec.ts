import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let consultaioSubject: BehaviorSubject<any>;
  let tipoEmpresaSubject: BehaviorSubject<any>;
  let actividadClaveSubject: BehaviorSubject<any>;

  const mockService = {
    obtenerEstado: jest.fn(() => of([{ id: 1, descripcion: 'Empresa A' }])),
    obtenerTipoEmpresaCatalogo: jest.fn(() => of({ datos: [{ id: 1, descripcion: 'Empresa A' }] })),
  };

  const mockStore = {
    setTipoDeEmpresa: jest.fn(),
    setActividadEconomicaClave: jest.fn(),
  };

  beforeEach(async () => {
    consultaioSubject = new BehaviorSubject<any>({ readonly: false });
    tipoEmpresaSubject = new BehaviorSubject<string>('EMP123');
    actividadClaveSubject = new BehaviorSubject<string>('1122');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, DatosDeLaSolicitudComponent],
      declarations: [],
      providers: [
        { provide: DatosEmpresaService, useValue: mockService },
        { provide: Tramite120602Store, useValue: mockStore },
        {
          provide: Tramite120602Query,
          useValue: {
            selectTipoDeEmpresa$: tipoEmpresaSubject.asObservable(),
            selectActividadEconomicaClave$: actividadClaveSubject.asObservable(),
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: consultaioSubject.asObservable(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  function initComponent() {
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create the component', () => {
    initComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize the form with observable values', () => {
    initComponent();
    expect(component.solicitudForm).toBeTruthy();
    expect(component.solicitudForm.get('tipoDeEmpresa')?.value).toBe('EMP123');
    expect(component.solicitudForm.get('actividadEconomicaClave')?.value).toBe('1122');
  });

  it('should update form values from observables', () => {
    initComponent();
    expect(component.solicitudForm.get('tipoDeEmpresa')?.value).toBe('EMP123');
    expect(component.solicitudForm.get('actividadEconomicaClave')?.value).toBe('1122');
    tipoEmpresaSubject.next('EMP999');
    actividadClaveSubject.next('9999');
    fixture.detectChanges();
    expect(component.solicitudForm.get('tipoDeEmpresa')?.value).toBe('EMP999');
    expect(component.solicitudForm.get('actividadEconomicaClave')?.value).toBe('9999');
  });

  it('should enable form controls when readonly is false', () => {
    consultaioSubject.next({ readonly: false });
    initComponent();
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.solicitudForm.get('tipoDeEmpresa')?.enabled).toBe(true);
    expect(component.solicitudForm.get('actividadEconomicaClave')?.enabled).toBe(true);
  });

  it('should call store.setTipoDeEmpresa on docSeleccionado', () => {
    initComponent();
    component.solicitudForm.get('tipoDeEmpresa')?.setValue('EMP456');
    component.docSeleccionado(new Event('change'));
    expect(mockStore.setTipoDeEmpresa).toHaveBeenCalledWith('EMP456');
  });

  it('should call store.setActividadEconomicaClave on setActividadEconomicaClave', () => {
    initComponent();
    component.solicitudForm.get('actividadEconomicaClave')?.setValue('9999');
    component.setActividadEconomicaClave();
    expect(mockStore.setActividadEconomicaClave).toHaveBeenCalledWith('9999');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    initComponent();
    const destroySpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */ 