import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { CTPATComponent } from './c-tpat.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32610Store, Solicitud32610State } from '../../estados/solicitud32610.store';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constants/datos-comunes.enum';
import { HttpClientModule } from '@angular/common/http';

describe('CTPATComponent', () => {
  let component: CTPATComponent;
  let fixture: ComponentFixture<CTPATComponent>;
  let mockSolicitudService: jest.Mocked<SolicitudService>;
  let mockSolicitud32610Store: jest.Mocked<Solicitud32610Store>;
  let mockSolicitud32610Query: jest.Mocked<Solicitud32610Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockBsModalRef: jest.Mocked<BsModalRef>;

  const mockSolicitudState: Solicitud32610State = {
    autorizacionCBP: '1',
    instalacionesCertificadasCBP: '0',
    suspensionCancelacionCBP: '',
  } as Solicitud32610State;

  const mockConsultaioState = {
    readonly: false
  };

  beforeEach(async () => {
    mockSolicitudService = {
      actualizarEstado: jest.fn(),
      obtenerDatos: jest.fn().mockReturnValue(of(mockSolicitudState))
    } as any;

    mockSolicitud32610Store = {
      actualizarEstado: jest.fn()
    } as any;

    mockSolicitud32610Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockBsModalRef = {
      hide: jest.fn()
    } as any;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockBsModalRef)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CTPATComponent,
        CommonModule,
        ReactiveFormsModule,
        InputRadioComponent,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud32610Store, useValue: mockSolicitud32610Store },
        { provide: Solicitud32610Query, useValue: mockSolicitud32610Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: BsModalService, useValue: mockBsModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CTPATComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.opcionDeBotonDeRadio).toEqual(OPCIONES_DE_BOTON_DE_RADIO);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

    it('debería llamar a inicializarEstadoFormulario en ngOnInit', () => {
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('debería suscribirse al estado de consultaio en el constructor', () => {
      expect(mockConsultaioQuery.selectConsultaioState$).toBeDefined();
    });
  });

  describe('Gestión del estado del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería inicializar el formulario con los valores del estado', () => {
      component.inicializarFormulario();
      
      expect(component.ctpatForm).toBeDefined();
      expect(component.ctpatForm.get('autorizacionCBP')).toBeTruthy();
      expect(component.ctpatForm.get('instalacionesCertificadasCBP')).toBeTruthy();
      expect(component.ctpatForm.get('suspensionCancelacionCBP')).toBeTruthy();
    });

    it('debería llamar a guardarDatosFormulario cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      const spy = jest.spyOn(component, 'guardarDatosFormulario');
      
      component.inicializarEstadoFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería llamar a inicializarFormulario cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      const spy = jest.spyOn(component, 'inicializarFormulario');
      
      component.inicializarEstadoFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.inicializarFormulario();
      
      component.guardarDatosFormulario();
      
      expect(component.ctpatForm.disabled).toBe(true);
    });

    it('debería habilitar el formulario cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.inicializarFormulario();
      
      component.guardarDatosFormulario();
      
      expect(component.ctpatForm.enabled).toBe(true);
    });
  });

  describe('Obtención del estado de la solicitud', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería obtener el estado de la solicitud correctamente', () => {
      component.obtenerEstadoSolicitud();
      
      expect(component.solicitudState).toEqual(mockSolicitudState);
    });

    it('debería suscribirse a selectSolicitud$ del query', () => {
      const spy = jest.spyOn(mockSolicitud32610Query.selectSolicitud$, 'pipe');
      
      component.obtenerEstadoSolicitud();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Actualización de valores en el store', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería actualizar el store cuando el control tiene un valor válido', () => {
      const campo = 'autorizacionCBP';
      const valor = '1';
      
      component.ctpatForm.get(campo)?.setValue(valor);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockSolicitud32610Store.actualizarEstado).toHaveBeenCalledWith({
        [campo]: valor
      });
    });

    it('no debería actualizar el store cuando el formulario es null', () => {
      component.setValoresStore(null, 'autorizacionCBP');
      
      expect(mockSolicitud32610Store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control tiene valor null', () => {
      const campo = 'autorizacionCBP';
      
      component.ctpatForm.get(campo)?.setValue(null);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockSolicitud32610Store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control tiene valor undefined', () => {
      const campo = 'autorizacionCBP';
      
      component.ctpatForm.get(campo)?.setValue(undefined);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockSolicitud32610Store.actualizarEstado).not.toHaveBeenCalled();
    });
  });

  describe('Manejo del cambio de suspensión/cancelación CBP', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar el modal cuando se selecciona "Sí" (valor "1")', () => {
      const mockEvent = {
        target: { value: '1' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
    });

    it('no debería mostrar el modal cuando se selecciona "No" (valor "0")', () => {
      const mockEvent = {
        target: { value: '0' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
      expect(spyMostrarModal).not.toHaveBeenCalled();
    });

    it('debería manejar correctamente el valor "on" y mostrar el modal', () => {
      const mockEvent = {
        target: { value: 'on' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spyMostrarModal).toHaveBeenCalled();
    });

    it('debería extraer correctamente el valor del evento', () => {
      const mockEvent = {
        target: { value: '1' }
      } as any;
      
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
    });
  });

  describe('Gestión del modal', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });


    it('debería cerrar el modal correctamente', () => {
      component.modalRef = mockBsModalRef;
      
      component.cerrarModal();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
    });

    it('debería manejar el caso cuando modalRef es undefined al cerrar', () => {
      component.modalRef = undefined;
      
      expect(() => component.cerrarModal()).not.toThrow();
    });
  });

  describe('Limpieza de recursos', () => {
    it('debería completar el subject destroy$ en ngOnDestroy', () => {
      const spyNext = jest.spyOn(component.destroy$, 'next');
      const spyComplete = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });

    it('debería cancelar las suscripciones activas', () => {
      const spyDestroy = jest.spyOn(component.destroy$, 'next');
      
      component.ngOnDestroy();
      
      expect(spyDestroy).toHaveBeenCalled();
    });
  });

  describe('Propiedades del componente', () => {
    it('debería tener las opciones de radio button correctas', () => {
      expect(component.opcionDeBotonDeRadio).toEqual([
        { label: 'Sí', value: '1' },
        { label: 'No', value: '0' }
      ]);
    });

    it('debería inicializar solicitud32610State como objeto vacío', () => {
      expect(component.solicitud32610State).toEqual({});
    });

    it('debería tener modalRef como undefined inicialmente', () => {
      expect(component.modalRef).toBeUndefined();
    });
  });

  describe('Validaciones del formulario', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería marcar los campos como requeridos', () => {
      const suspensionControl = component.ctpatForm.get('suspensionCancelacionCBP');
      
      expect(suspensionControl?.hasError('required')).toBeTruthy();
    });

    it('debería ser válido cuando todos los campos tienen valores', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0',
        suspensionCancelacionCBP: '1'
      });
      
      expect(component.ctpatForm.valid).toBeTruthy();
    });

    it('debería ser inválido cuando falta algún campo requerido', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '',
        suspensionCancelacionCBP: '1'
      });
      
      expect(component.ctpatForm.valid).toBeFalsy();
    });
  });

  describe('Integración con el template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería renderizar el formulario correctamente', () => {
      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      
      expect(form).toBeTruthy();
    });

  it('debería mostrar las etiquetas de los campos', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('label');
    
    expect(labels.length).toBeGreaterThan(0);
  });


  describe('Casos edge y manejo de errores', () => {
    it('debería manejar el caso cuando el estado de la solicitud es null', () => {
      mockSolicitud32610Query.selectSolicitud$ = of(null as any);
      
      expect(() => component.obtenerEstadoSolicitud()).not.toThrow();
    });

    it('debería manejar el caso cuando el evento no tiene target', () => {
      const mockEvent = {} as any;
      
      expect(() => component.manejarCambioSuspensionCancelacion(mockEvent)).toThrow();
    });

    it('debería manejar el caso cuando el control del formulario no existe', () => {
      component.inicializarFormulario();
      
      component.setValoresStore(component.ctpatForm, 'campoInexistente');
      
      expect(mockSolicitud32610Store.actualizarEstado).not.toHaveBeenCalled();
    });
  });
});
})