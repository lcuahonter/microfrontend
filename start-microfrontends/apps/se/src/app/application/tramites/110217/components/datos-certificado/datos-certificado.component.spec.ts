import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Catalogo } from '@libs/shared/data-access-user/src';


describe('DatosCertificadoComponent', () => {
  let component: DatosCertificadoComponent;
  let fixture: ComponentFixture<DatosCertificadoComponent>;
  let tramite110217StoreMock: any;
  let tramite110217QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite110217StoreMock = {
      setFormDatosCertificado: jest.fn(),
      setIdioma: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setFormValida: jest.fn(),
      setFormValidity: jest.fn()
    };

    tramite110217QueryMock = {
      formDatosCertificado$: of({
        observaciones: 'Observaciones de prueba',
        idioma: 1,
        entidadFederativa: 1,
        representacionFederal: 1
      }),
      selectSolicitud$: of({
        observaciones: 'Observaciones de prueba',
        idioma: 1,
        entidadFederativa: 1,
        representacionFederal: 1
      }),
      select: jest.fn().mockReturnValue(of([]))
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DatosCertificadoComponent
      ],
      providers: [
        provideHttpClient(),
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
        { provide: Tramite110217Store, useValue: tramite110217StoreMock },
        { provide: Tramite110217Query, useValue: tramite110217QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setIdioma when idiomaSeleccion is called', () => {
    const mockCatalogo: Catalogo = { id: 1, descripcion: 'Español', clave: '1' };
    component.idiomaSeleccion(mockCatalogo);
    expect(tramite110217StoreMock.setIdioma).toHaveBeenCalledWith('1');
  });

  it('should call setRepresentacionFederal when representacionFederalSeleccion is called', () => {
    const mockCatalogo: Catalogo = { id: 1, descripcion: 'Representación 1', clave: '1' };
    component.representacionFederalSeleccion(mockCatalogo);
    expect(tramite110217StoreMock.setRepresentacionFederal).toHaveBeenCalledWith('1');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call setFormDatosCertificado when obtenerDatosFormulario is called', () => {
    const mockData = { campo1: 'valor1', campo2: 'valor2' };
    component.obtenerDatosFormulario(mockData);
    expect(tramite110217StoreMock.setFormDatosCertificado).toHaveBeenCalledWith(mockData);
  });

  it('should call setFormValida when setFormValida is called', () => {
    component.setFormValida(true);
    expect(tramite110217StoreMock.setFormValida).toHaveBeenCalledWith({ datos: true });
  });

  it('should test setValoresStore method', () => {
    const mockEvent = {
      formGroupName: 'testForm',
      campo: 'testCampo',
      valor: undefined,
      storeStateName: 'testState'
    };
    component.setValoresStore(mockEvent);
    expect(tramite110217StoreMock.setFormDatosCertificado).toHaveBeenCalledWith({ 'testCampo': undefined });
  });

  it('should have correct default property values', () => {
    expect(component.precisa).toBe(false);
    expect(component.idioma).toBe(true);
    expect(component.presenta).toBe(false);
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should update esFormularioSoloLectura based on consultaQuery state', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should return form from childForm when datosCertificadoDeRef exists', () => {
    expect(component.childForm).toBeDefined();
    expect(component.childForm).not.toBeNull();
  });

  it('should return false for isChildFormValid when datosCertificadoDeRef is undefined', () => {
    expect(component.isChildFormValid()).toBe(false);
  });

  it('should return null for getChildFormControl when datosCertificadoDeRef is undefined', () => {
    expect(component.getChildFormControl('testControl')).toBeNull();
  });

  it('should not call patchValue when childForm is null in setChildFormValues', () => {
    const mockValues = { test: 'value' };
    expect(() => component.setChildFormValues(mockValues)).not.toThrow();
  });

  it('should return false and call setFormValida when validateAll is called', () => {
    const result = component.validateAll();
    expect(result).toBe(false); // Returns false because child form validation fails
    expect(tramite110217StoreMock.setFormValida).toHaveBeenCalledWith({ datos: false });
  });
});