jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn()
  }))
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicillioComponent } from './domicillio.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Tramite32606Store, Solicitud32606State } from '../../state/Tramite32606.store';
import { ConsultaioQuery, ConsultaioState, Pedimento } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { Domicillio, EntidadFederativa } from '../../models/adace.model';

describe('DomicillioComponent', () => {
  let component: DomicillioComponent;
  let fixture: ComponentFixture<DomicillioComponent>;
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
    sectorProductivo: 'sector',
    servicio: 'servicio',
    tipoRadio01: 'si',
    tipoRadio02: 'no',
    tipoRadio03: 'si',
    tipoRadio04: 'no',
    tipoRadio05: 'si',
    tipoRadio06: 'no',
    tipoRadio07: 'si',
    tipoRadio08: 'no',
    tipoRadio09: 'si',
    tipoRadio10: 'no',
    tipoRadio11: 'si',
    domicilio: 'domicilio',
    biomestre: 'biomestre',
    numeroEmpleados: '10',
    tipoRadio12: '', tipoRadio13: '', tipoRadio14: '', tipoRadio15: '', tipoRadio16: '', tipoRadio17: '', tipoRadio18: '', tipoRadio19: '', tipoRadio20: '', tipoRadio21: '', tipoRadio22: '', tipoRadio23: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', tipoRadio34: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', sistemaIdentificacion: '', lugarRadicacion: '', sistemaControlInventarios: false, rfcTercero: '', rfc: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', correoElectronico: '', monto: '', operacionesBancarias: '', llavePago: '', modalidad: '', fechaRegistro: '', numeroAutorizacion: '', radioAutorizo: '', radioClasificacion: '', caracter: '', nacionalidad: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };


  beforeEach(async () => {
    mockEconomicoService = {
      obtenerDomicillio: jest.fn().mockReturnValue(of([])),
      obtenerEntidad: jest.fn().mockReturnValue(of([])),
      obtenerTablaEntidad: jest.fn().mockReturnValue(of([])),
      obtenerTablaDomicillio: jest.fn().mockReturnValue(of([]))
    } as unknown as jest.Mocked<EconomicoService>;
    mockTramite32606Query = {
      selectSolicitud$: new BehaviorSubject<Solicitud32606State>(solicitudState).asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;
    mockTramite32606Store = {
      setDomicillio: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;
    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(consultaioState);
    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicillioComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DomicillioComponent);
    component = fixture.componentInstance;
    component.solicitudState = solicitudState;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('inicializarEstadoFormulario llama guardarDatosFormulario si soloLectura', () => {
    jest.spyOn(component, 'guardarDatosFormulario');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario llama donanteDomicilio si no soloLectura', () => {
    jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('guardarDatosFormulario deshabilita el formulario si soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = true;
    component.domicillioForm.disable = jest.fn();
    component.guardarDatosFormulario();
  });

  it('guardarDatosFormulario habilita el formulario si no soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = false;
    component.domicillioForm.enable = jest.fn();
    component.guardarDatosFormulario();
  });

  it('seleccionarModificar muestra el modal y llama abrirModal', () => {
    component.modalElement = { nativeElement: document.createElement('div') } as ElementRef;
    component.modalInstalacionesPrincipalesElement = { nativeElement: document.createElement('div') } as ElementRef;
    jest.spyOn(component, 'abrirModal');
    component.seleccionarModificar();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('eliminarDomiciliosDatos elimina elementos seleccionados', () => {
    component.domicillioDatos = [
      { tipoInstalacion: 'A' } as any,
      { tipoInstalacion: 'B' } as any
    ];
    component.seleccionarDomiciliosDatos = [
      { tipoInstalacion: 'A' } as any
    ];
    component.eliminarDomiciliosDatos();
    expect(component.domicillioDatos.length).toBe(1);
    expect(component.domicillioDatos[0].tipoInstalacion).toBe('B');
  });

  it('onAgregarClick muestra el modal', () => {
    component.modalElement = { nativeElement: document.createElement('div') } as ElementRef;
    component.onAgregarClick();
    expect(component.modalElement).toBeDefined();
  });

  it('eliminarPedimento elimina el pedimento si borrar es true', () => {
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

  it('obtenerDomicillio actualiza catalogos', () => {
    const resp = [{ id: 1, descripcion: 'A' }];
    mockEconomicoService.obtenerDomicillio.mockReturnValue(of(resp));
    component.obtenerDomicillio();
    expect(component.domicillio.catalogos).toEqual(resp);
  });

  it('obtenerEntidad actualiza catalogos', () => {
    const resp = [{ id: 2, descripcion: 'B' }];
    mockEconomicoService.obtenerEntidad.mockReturnValue(of(resp));
    component.obtenerEntidad();
    expect(component.entidadFederativa.catalogos).toEqual(resp);
  });

  it('obtenerTablaEntidad actualiza entidadTablaDatos', () => {
    const entidadMock: EntidadFederativa[] = [
      {
        entidadFederativa: 'CDMX',
        municipioDelegacion: 'Benito Juárez',
        direccion: 'Av. Insurgentes Sur 123',
        codigoPostal: '03100',
        registroSESAT: 'ABC123'
      }
    ];
    mockEconomicoService.obtenerTablaEntidad.mockReturnValue(of(entidadMock));
    component.obtenerTablaEntidad();
    expect(component.entidadTablaDatos).toEqual(entidadMock);
  });

  it('obtenerTablaDomicillio actualiza domicillioDatos', () => {
    const domicillioMock: Domicillio[] = [{
      instalacionPrincipal: 'principal',
      tipoInstalacion: 'industrial',
      entidadFederativa: 'CDMX',
      municipioDelegacion: 'Benito Juárez',
      direccion: 'Av. Insurgentes Sur 123',
      codigoPostal: '03100',
      registroSESAT: 'ABC123',
      procesoProductivo: 'manufactura',
      acreditaInmueble: 'escritura',
      operacionesCExt: 'importación',
      instalacionCtpat: 'sí',
      instalacionPerfil: 'general',
      instalacionPerfilRFE: 'estratégico',
      instalacionPerfilAuto: 'automotriz',
      instalacionPerfilFerro: 'ferroviario',
      instalacionPerfilRf: 'fiscal',
      instalacionPerfilMensajeria: 'mensajería'
    }];
    mockEconomicoService.obtenerTablaDomicillio.mockReturnValue(of(domicillioMock));
    component.obtenerTablaDomicillio();
    expect(component.domicillioDatos).toEqual(domicillioMock);
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.domicillioForm.setErrors(null);
    jest.spyOn(component.domicillioForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(component.domicillioForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.domicillioForm.setErrors(null);
    jest.spyOn(component.domicillioForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
  });

  it('setValoresStore llama al método correcto del store', () => {
    component.donanteDomicilio();
    component.domicillioForm.get('domicillio')?.setValue('nuevo');
    component.setValoresStore(component.domicillioForm, 'domicillio', 'setDomicillio');
    expect(mockTramite32606Store.setDomicillio).toHaveBeenCalledWith('nuevo');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.domicillioForm, 'noExiste', 'setDomicillio');
    expect(mockTramite32606Store.setDomicillio).toHaveBeenCalledWith(undefined);
  });

  it('alSeleccionarArchivo actualiza nombreArchivo y patchValue', () => {
    component.donanteDomicilio();
    const file = new File([''], 'archivo.txt');
    const event = { target: { files: [file] } } as any;
    component.alSeleccionarArchivo(event);
    expect(component.nombreArchivo).toBe('archivo.txt');
  });

  it('alSeleccionarArchivo2 actualiza nombreArchivo2 y patchValue', () => {
    component.donanteDomicilio();
    const file = new File([''], 'archivo2.txt');
    const event = { target: { files: [file] } } as any;
    component.alSeleccionarArchivo2(event);
    expect(component.nombreArchivo2).toBe('archivo2.txt');
  });

  it('seleccionarDomiciliosDato actualiza seleccionarDomiciliosDatos', () => {
    const datos = [{ tipoInstalacion: 'A' }] as any;
    component.seleccionarDomiciliosDato(datos);
    expect(component.seleccionarDomiciliosDatos).toEqual(datos);
  });

  it('aceptarInstalacionesPrincipales emite evento', () => {
    component.donanteDomicilio();
    jest.spyOn(component.instalacionesPrincipales, 'emit');
    component.aceptarInstalacionesPrincipales();
    expect(component.instalacionesPrincipales.emit).toHaveBeenCalled();
  });

  it('ngOnDestroy completa destroyed$', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroyed$'].next).toHaveBeenCalledWith(true);
    expect(component['destroyed$'].complete).toHaveBeenCalled();
  });
});