import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelEstablecimientoRFCComponent } from './datos-del-establecimiento-rfc.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AvisocalidadStore } from '../../estados/stores/aviso-calidad.store';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';

describe('DatosDelEstablecimientoRFCComponent', () => {
  let component: DatosDelEstablecimientoRFCComponent;
  let fixture: ComponentFixture<DatosDelEstablecimientoRFCComponent>;
  let avisocalidadStoreMock: any;
  let avisocalidadQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    avisocalidadStoreMock = {
      setRFC: jest.fn(),
      setDenominacionRazonSocial: jest.fn(),
      setCorreoElectronico: jest.fn(),
    };
    avisocalidadQueryMock = {
      selectSolicitud$: of({
        rfcDel: 'RFC123',
        denominacionRazonSocial: 'Empresa SA',
        correoElectronico: 'test@email.com',
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDelEstablecimientoRFCComponent],
      providers: [
        FormBuilder,
        { provide: AvisocalidadStore, useValue: avisocalidadStoreMock },
        { provide: AvisocalidadQuery, useValue: avisocalidadQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelEstablecimientoRFCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores de solicitudState', () => {
    expect(component.datosDelForm.value).toEqual({
      rfcDel: 'RFC123',
      denominacionRazonSocial: 'Empresa SA',
      correoElectronico: 'test@email.com',
    });
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;
    component.solicitudState = {
      rfcDel: 'RFC123',
      denominacionRazonSocial: 'Empresa SA',
      correoElectronico: 'test@email.com',
    } as any;
    component.configurarGrupoForm();
    expect(component.datosDelForm.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es falso', () => {
    component.esFormularioSoloLectura = false;
    component.solicitudState = {
      rfcDel: 'RFC123',
      denominacionRazonSocial: 'Empresa SA',
      correoElectronico: 'test@email.com',
    } as any;
    component.configurarGrupoForm();
    expect(component.datosDelForm.enabled).toBe(true);
  });

  it('debe abrir el modal y establecer nuevaNotificacion y elementoParaEliminar', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('debe eliminar el pedimento cuando eliminarPedimento es llamado con true', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('no debe eliminar el pedimento cuando eliminarPedimento es llamado con false', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('debe limpiar recursos en ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('debe manejar closeModal ElementRef si está presente', () => {
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;
    expect(component.closeModal).toBeDefined();
  });
});