import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroComponent } from './miembro.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Tramite32606Store, Solicitud32606State } from '../../state/Tramite32606.store';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('MiembroComponent', () => {
  let component: MiembroComponent;
  let fixture: ComponentFixture<MiembroComponent>;
  let mockEconomicoService: jest.Mocked<EconomicoService>;
  let mockTramite32606Query: jest.Mocked<Tramite32606Query>;
  let mockTramite32606Store: jest.Mocked<Tramite32606Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let selectConsultaioState$: BehaviorSubject<ConsultaioState>;
  let selectSolicitud$: BehaviorSubject<Solicitud32606State>;
  let fb: FormBuilder;

  const consultaioState: ConsultaioState = {
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null
  };
  const solicitudState: Solicitud32606State = {
    tipoRadio14: 'a',
    tipoRadio15: 'b',
    tipoRadio16: 'c',
    tipoRadio17: 'd',
    tipoRadio34: 'e',
    caracter: 'caracter',
    nacionalidad: 'nacionalidad',
    tipoRadio01: '', tipoRadio02: '', tipoRadio03: '', tipoRadio04: '', tipoRadio05: '', tipoRadio06: '', tipoRadio07: '', tipoRadio08: '', tipoRadio09: '', tipoRadio10: '', tipoRadio11: '', tipoRadio12: '', tipoRadio13: '', tipoRadio18: '', tipoRadio19: '', tipoRadio20: '', tipoRadio21: '', tipoRadio22: '', tipoRadio23: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', sectorProductivo: '', servicio: '', domicilio: '', biomestre: '', numeroEmpleados: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', sistemaIdentificacion: '', lugarRadicacion: '', sistemaControlInventarios: false, rfcTercero: '', rfc: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', correoElectronico: '', monto: '', operacionesBancarias: '', llavePago: '', modalidad: '', fechaRegistro: '', numeroAutorizacion: '', radioAutorizo: '', radioClasificacion: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };

  beforeEach(async () => {
     mockEconomicoService = {
    obtenerCaracter: jest.fn().mockReturnValue(of([])),
    obtenerNacionalidad: jest.fn().mockReturnValue(of([]))
  } as unknown as jest.Mocked<EconomicoService>;
    mockTramite32606Query = {
      selectSolicitud$: new BehaviorSubject<Solicitud32606State>(solicitudState).asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;
    mockTramite32606Store = {
      setCaracter: jest.fn(),
      setNacionalidad: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;
    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(consultaioState);
    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MiembroComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MiembroComponent);
    component = fixture.componentInstance;
    component.solicitudState = solicitudState;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('donanteDomicilio inicializa el formulario', () => {
    component.solicitudState = solicitudState;
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.miembroForm.get('tipoRadio14')?.value).toBe('a');
    expect(component.miembroForm.get('caracter')?.value).toBe('caracter');
    expect(component.miembroForm.get('nacionalidad')?.value).toBe('nacionalidad');
  });

  it('inicializarEstadoFormulario llama guardarDatosFormulario si soloLectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario llama donanteDomicilio si no soloLectura', () => {
    const spy = jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario deshabilita el formulario si soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = true;
    const spy = jest.spyOn(component.miembroForm, 'disable');
    component.guardarDatosFormulario();
  });

  it('guardarDatosFormulario habilita el formulario si no soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = false;
    const spy = jest.spyOn(component.miembroForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('obtenerCaracter actualiza catalogos', () => {
    const resp = [{ id: 1, descripcion: 'A' }];
    mockEconomicoService.obtenerCaracter.mockReturnValue(of(resp));
    component.obtenerCaracter();
    expect(component.caracterCatalogo.catalogos).toEqual(resp);
  });

  it('obtenerNacionalidad actualiza catalogos', () => {
    const resp = [{ id: 2, descripcion: 'B' }];
    mockEconomicoService.obtenerNacionalidad.mockReturnValue(of(resp));
    component.obtenerNacionalidad();
    expect(component.nacionalidadCatalogo.catalogos).toEqual(resp);
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.miembroForm.setErrors({ invalid: true });
    const spy = jest.spyOn(component.miembroForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.miembroForm.setErrors(null);
    const spy = jest.spyOn(component.miembroForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setValoresStore llama al método correcto del store', () => {
    component.donanteDomicilio();
    component.miembroForm.get('caracter')?.setValue('nuevo');
    component.setValoresStore(component.miembroForm, 'caracter', 'setCaracter');
    expect(mockTramite32606Store.setCaracter).toHaveBeenCalledWith('nuevo');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.miembroForm, 'noExiste', 'setCaracter');
    expect(mockTramite32606Store.setCaracter).toHaveBeenCalledWith(undefined);
  });

  it('ngOnDestroy completa destroyed$', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});