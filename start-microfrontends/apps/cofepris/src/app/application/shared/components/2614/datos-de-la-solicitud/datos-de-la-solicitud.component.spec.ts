import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SolicitudModificacionPermisoInternacionService } from '../../../services/shared2614/solicitud-modificacion-permiso-internacion.service';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let tramite2614StoreMock: jest.Mocked<Tramite2614Store>;
  let tramite2614QueryMock: jest.Mocked<Tramite2614Query>;

  beforeEach(async () => {
    tramite2614StoreMock = {
      actualizarEstado: jest.fn(),
    } as unknown as jest.Mocked<Tramite2614Store>;

    tramite2614QueryMock = {
      selectSolicitud$: of({
        observaciones: 'Test Observations',
      }),
    } as unknown as jest.Mocked<Tramite2614Query>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, HttpClientModule, DatosDeLaSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: Tramite2614Store, useValue: tramite2614StoreMock },
        { provide: Tramite2614Query, useValue: tramite2614QueryMock },
        { provide: SolicitudModificacionPermisoInternacionService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with data from the query', () => {
    expect(component.formulario).toBeDefined();
    expect(component.formulario.get('observaciones')?.value).toBe('Test Observations');
  });

  it('should call actualizarEstado in the store when setValoresStore is called', () => {
    const mockForm = new FormBuilder().group({
      observaciones: 'Updated Observations',
    });

    component.setValoresStore(mockForm, 'observaciones');

    expect(tramite2614StoreMock.actualizarEstado).toHaveBeenCalledWith({
      observaciones: 'Updated Observations',
    });
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should create the form in crearFormulario', () => {
    component.crearFormulario();
    expect(component.formulario).toBeDefined();
    expect(component.formulario.get('observaciones')).toBeTruthy();
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
});