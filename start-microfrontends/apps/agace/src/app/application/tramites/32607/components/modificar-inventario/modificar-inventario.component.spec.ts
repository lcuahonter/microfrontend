import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarInventarioComponent } from './modificar-inventario.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import {
  ConsultaioQuery,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModificarInventarioComponent', () => {
  let component: ModificarInventarioComponent;
  let fixture: ComponentFixture<ModificarInventarioComponent>;
  let storeMock: any;
  let queryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    storeMock = {
      actualizarInventarioNombre: jest.fn(() => of()),
      actualizarInventarioAnexo: jest.fn(() => of()),
      actualizarInventarioLugar: jest.fn(() => of()),
    };

    queryMock = {
      selectSolicitud$: of({
        inventarioNombre: 'Inventario 1',
        inventarioAnexo: true,
        inventarioLugar: 'Lugar 1',
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        ModificarInventarioComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Solicitud32607Store, useValue: storeMock },
        { provide: Solicitud32607Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with store values', () => {
    expect(component.modificarInventarioForm.value).toEqual({
      inventarioNombre: 'Inventario 1',
      inventarioAnexo: true,
      inventarioLugar: 'Lugar 1',
    });
  });

  it('should call actualizarInventarioNombre when input is changed', () => {
    const event = { target: { value: 'Nuevo Inventario' } } as any;
    component.actualizarInventarioNombre(event);
    expect(storeMock.actualizarInventarioNombre).toHaveBeenCalledWith(
      'Nuevo Inventario'
    );
  });

  it('should call actualizarInventarioAnexo when checkbox is changed', () => {
    const event = { target: { checked: true } } as any;
    component.actualizarInventarioAnexo(event);
    expect(storeMock.actualizarInventarioAnexo).toHaveBeenCalledWith(true);
  });

  it('should call actualizarInventarioLugar when input is changed', () => {
    const event = { target: { value: 'Nuevo Lugar' } } as any;
    component.actualizarLugarDeRadicacion(event);
    expect(storeMock.actualizarInventarioLugar).toHaveBeenCalledWith(
      'Nuevo Lugar'
    );
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.modificarInventarioForm = new FormBuilder().group({
      inventarioNombre: [{ value: 'Inventario 1', disabled: true }],
      inventarioAnexo: [{ value: false, disabled: true }],
      inventarioLugar: [{ value: '', disabled: true }],
    });
    component.guardarDatosFormulario();
    expect(component.modificarInventarioForm.disabled).toBe(true);
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
