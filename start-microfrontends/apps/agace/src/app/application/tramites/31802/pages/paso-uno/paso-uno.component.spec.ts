import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tramite31802Store, createInitialState } from '../../state/Tramite31802.store';
import { Tramite31802Query } from '../../state/Tramite31802.query';
import { RegistroSolicitudService } from '../../services/registro-solicitud-service.service';
import { ValidacionesFormularioService, SolicitanteComponent, ConsultaioQuery, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lib-input-check',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputCheckComponent),
      multi: true,
    },
  ],
})
class MockInputCheckComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  value: any;
  onChange = (_: any) => { };
  onTouched = () => { };
  writeValue(obj: any): void { this.value = obj; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { }
}
describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let storeMock: any;
  let queryMock: any;
  let validacionesServiceMock: any;
  let solicitud31802ServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    storeMock = {
      setRenovacion: jest.fn(),
      setHomologacion: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of(createInitialState()),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    solicitud31802ServiceMock = {
      getDatosDeAvisoRenovacionDoc: jest.fn().mockReturnValue(of({
        numeroOperacion: 1,
        llave: 'llave',
        manifiesto1: 'm1',
        manifiesto2: 'm2',
        manifiesto3: 'm3',
        fechaPago: '2024-01-01',
        monedaNacional: 'MXN',
        renovacion: true,
        homologacion: false,
      })),
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SolicitanteComponent, HttpClientTestingModule],
      declarations: [PasoUnoComponent, MockInputCheckComponent],
      providers: [
        { provide: Tramite31802Store, useValue: storeMock },
        { provide: Tramite31802Query, useValue: queryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: RegistroSolicitudService, useValue: solicitud31802ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.solicitudState = createInitialState();
    component.registroForm = new FormBuilder().group({
      renovacion: [false, [Validators.required]],
      homologacion: [false, [Validators.required]],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to consultaQuery and set consultaState in ngOnInit', () => {
    component.consultaState = undefined as any;
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in ngOnInit', () => {
    component.consultaState = { update: false } as any;
    component.esDatosRespuesta = false;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario and set esDatosRespuesta in guardarDatosFormulario', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(solicitud31802ServiceMock.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should setRenovacion in store when establecerRenovacion is called', () => {
    const event = { target: { checked: true } } as any;
    component.establecerRenovacion(event);
    expect(storeMock.setRenovacion).toHaveBeenCalledWith(true);
  });

  it('should setHomologacion in store when establecerHomologacion is called', () => {
    const event = { target: { checked: false } } as any;
    component.establecerHomologacion(event);
    expect(storeMock.setHomologacion).toHaveBeenCalledWith(false);
  });

  it('should update indice in seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call validacionesService.isValid in esValido', () => {
    const form = new FormBuilder().group({ test: [''] });
    component.esValido(form, 'test');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(form, 'test');
  });

  it('should mark all as touched if registroForm is invalid in validarDestinatarioFormulario', () => {
    component.registroForm = new FormBuilder().group({
      renovacion: ['', Validators.required],
    });
    const spy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store method in setValoresStore', () => {
    component.registroForm.get('renovacion')?.setValue(true);
    component.setValoresStore(component.registroForm, 'renovacion', 'setRenovacion');
    expect(storeMock.setRenovacion).toHaveBeenCalledWith(true);
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});