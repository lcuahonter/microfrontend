import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuerellaComponent } from './querella.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Tramite32606Store, Solicitud32606State } from '../../state/Tramite32606.store';
import { ConsultaioQuery, ConsultaioState, Pedimento } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { Querella } from '../../models/adace.model';

describe('QuerellaComponent', () => {
  let component: QuerellaComponent;
  let fixture: ComponentFixture<QuerellaComponent>;
  let mockEconomicoService: jest.Mocked<EconomicoService>;
  let mockTramite32606Query: jest.Mocked<Tramite32606Query>;
  let mockTramite32606Store: jest.Mocked<Tramite32606Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let selectConsultaioState$: BehaviorSubject<ConsultaioState>;
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
    tipoRadio18: 'a',
    tipoRadio19: 'b',
    tipoRadio20: 'c',
    sistemaIdentificacion: 'sistema',
    lugarRadicacion: 'lugar',
    sistemaControlInventarios: true,
    tipoRadio01: '', tipoRadio02: '', tipoRadio03: '', tipoRadio04: '', tipoRadio05: '', tipoRadio06: '', tipoRadio07: '', tipoRadio08: '', tipoRadio09: '', tipoRadio10: '', tipoRadio11: '', tipoRadio12: '', tipoRadio13: '', tipoRadio14: '', tipoRadio15: '', tipoRadio16: '', tipoRadio17: '', tipoRadio21: '', tipoRadio22: '', tipoRadio23: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', tipoRadio34: '', sectorProductivo: '', servicio: '', domicilio: '', biomestre: '', numeroEmpleados: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', rfcTercero: '', rfc: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', correoElectronico: '', monto: '', operacionesBancarias: '', llavePago: '', modalidad: '', fechaRegistro: '', numeroAutorizacion: '', radioAutorizo: '', radioClasificacion: '', caracter: '', nacionalidad: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };

  beforeEach(async () => {
    mockEconomicoService = {
      obtenerTablaQuerella: jest.fn().mockReturnValue(of([]))
    } as unknown as jest.Mocked<EconomicoService>;

    mockTramite32606Query = {
      selectSolicitud$: new BehaviorSubject<Solicitud32606State>(solicitudState).asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;

    mockTramite32606Store = {
      setSistemaIdentificacion: jest.fn(),
      setLugarRadicacion: jest.fn(),
      setSistemaControlInventarios: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;

    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(consultaioState);

    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;

    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, QuerellaComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuerellaComponent);
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
    expect(component.querellaForm.get('tipoRadio18')?.value).toBe('a');
    expect(component.querellaForm.get('sistemaIdentificacion')?.value).toBe('sistema');
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
    const spy = jest.spyOn(component.querellaForm, 'disable');
    component.guardarDatosFormulario();
  });

  it('guardarDatosFormulario habilita el formulario si no soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = false;
    const spy = jest.spyOn(component.querellaForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('eliminarPedimento elimina elementos si borrar es true', () => {
    component.pedimentos = [{}, {}, {}] as Pedimento[];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('eliminarPedimento no elimina si borrar es false', () => {
    component.pedimentos = [{}, {}, {}] as Pedimento[];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('abrirModal actualiza nuevaNotificacion y elementoParaEliminar', () => {
    component.abrirModal(5);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(5);
  });

  it('obtenerTablaQuerella actualiza querellaDatos', () => {
    const resp: Querella[] = [
      {
        sistemaIdentificacion: 'X',
        lugarRadicacion: 'Y',
        indiqueSiCuenta: true
      }
    ];
    mockEconomicoService.obtenerTablaQuerella.mockReturnValue(of(resp));
    component.obtenerTablaQuerella();
    expect(component.querellaDatos).toEqual(resp);
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.querellaForm.setErrors({ invalid: true });
    const spy = jest.spyOn(component.querellaForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.querellaForm.setErrors(null);
    const spy = jest.spyOn(component.querellaForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setValoresStore llama al método correcto del store', () => {
    component.donanteDomicilio();
    component.querellaForm.get('sistemaIdentificacion')?.setValue('nuevo');
    component.setValoresStore(component.querellaForm, 'sistemaIdentificacion', 'setSistemaIdentificacion');
    expect(mockTramite32606Store.setSistemaIdentificacion).toHaveBeenCalledWith('nuevo');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.querellaForm, 'noExiste', 'setSistemaIdentificacion');
    expect(mockTramite32606Store.setSistemaIdentificacion).toHaveBeenCalledWith(undefined);
  });

  it('ngOnDestroy completa destroyed$', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});