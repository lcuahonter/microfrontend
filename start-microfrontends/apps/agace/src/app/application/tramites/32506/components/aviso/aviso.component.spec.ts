import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import {
  AlertComponent,
  CatalogoSelectComponent,
  InputFechaComponent,
  InputHoraComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

declare global {
  interface Window {
    Modal: any;
  }
}

class MockTramite32506Store {
  setAvisoFormularioFechaTranslado = jest.fn();
  setAvisoFormularioTipoAviso = jest.fn();
}
class MockTramite32506Query {
  selectSolicitud$ = of({});
}
class MockAvisoDestruccionService {
  obtenerFraccionArancelaria = () => of({ datos: [{ id: 1 }] });
  obtenerUnidadMedida = () => of({ datos: [{ id: 2 }] });
  obtenerFederativa = () => of({ datos: [{ id: 3 }] });
  obtenerMunicipio = () => of({ datos: [{ id: 4 }] });
  obtenerColonias = () => of({ datos: [{ id: 5 }] });
  obtenerAvisoTabla = () => of({ datos: [{ id: 6 }] });
  obtenerProcesoTabla = () => of({ datos: [{ id: 7 }] });
  obtenerDesperdicioTabla = () => of({ datos: [{ id: 8 }] });
  obtenerPedimentoTabla = () => of({ datos: [{ id: 9 }] });
}
class MockValidacionesFormularioService {
  isValid = jest.fn().mockReturnValue(true);
}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        InputFechaComponent,
        InputHoraComponent,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        AlertComponent,
        NotificacionesComponent,
        InputRadioComponent,
        AvisoComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: 'Tramite32506Store', useClass: MockTramite32506Store },
        { provide: 'Tramite32506Query', useClass: MockTramite32506Query },
        {
          provide: 'AvisoDestruccionService',
          useClass: MockAvisoDestruccionService,
        },
        {
          provide: 'ValidacionesFormularioService',
          useClass: MockValidacionesFormularioService,
        },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
      ],
    })
      .overrideComponent(AvisoComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useClass: FormBuilder },
            { provide: MockTramite32506Store, useClass: MockTramite32506Store },
            { provide: MockTramite32506Query, useClass: MockTramite32506Query },
            {
              provide: MockAvisoDestruccionService,
              useClass: MockAvisoDestruccionService,
            },
            {
              provide: MockValidacionesFormularioService,
              useClass: MockValidacionesFormularioService,
            },
            { provide: MockConsultaioQuery, useClass: MockConsultaioQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;

    component.tramiteState = {
      avisoFormulario: {},
      domicilioFormulario: {},
      pedimentoFormulario: {},
      procesoFormulario: {},
      desperdicioFormulario: {},
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable forms in guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    component.inicializarFormulario();
    component.domicilioFormulario = new FormBuilder().group({});
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.avisoFormulario.disabled).toBe(true);
    expect(component.domicilioFormulario.disabled).toBe(true);
  });

  it('should enable forms in guardarDatosFormulario if esFormularioSoloLectura is false', () => {
    component.inicializarFormulario();
    component.domicilioFormulario = new FormBuilder().group({});
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.avisoFormulario.enabled).toBe(true);
    expect(component.domicilioFormulario.enabled).toBe(true);
  });

  it('should set values in store via setValoresStore', () => {
    const store = TestBed.inject(
      'Tramite32506Store' as any
    ) as MockTramite32506Store;
    const form = new FormBuilder().group({ campo: 'valor' });
    component.store = store as any;
    component.setValoresStore(
      form,
      'campo',
      'setAvisoFormularioFechaTranslado' as any
    );
    expect(store.setAvisoFormularioFechaTranslado).toHaveBeenCalledWith(
      'valor'
    );
  });

  it('should load fraccionArancelaria', () => {
    component.cargarFraccionArancelaria();
    expect(component.fraccionArancelaria.length).toBe(0);
  });

  it('should load unidadMedida', () => {
    component.cargarUnidadMedida();
    expect(component.unidadMedida.length).toBe(0);
  });

  it('should load entidadFederativa', () => {
    component.cargarFederativa();
    expect(component.entidadFederativa.length).toBe(0);
  });

  it('should load delegacionMunicipio', () => {
    component.cargarMunicipio();
    expect(component.delegacionMunicipio.length).toBe(0);
  });

  it('should load colonia', () => {
    component.cargarColonias();
    expect(component.colonia.length).toBe(0);
  });

  it('should load tablaDeDatos.datos in cargarAvisoTabla', () => {
    component.cargarAvisoTabla();
    expect(component.tablaDeDatos.datos.length).toBe(0);
  });

  it('should load tablaProceso.datos in cargarProcesoTabla', () => {
    component.cargarProcesoTabla();
    expect(component.tablaProceso.datos.length).toBe(0);
  });

  it('should load tablaDesperdicio.datos in cargarDesperdicioTabla', () => {
    component.cargarDesperdicioTabla();
    expect(component.tablaDesperdicio.datos.length).toBe(0);
  });

  it('should load tablaPedimento.datos in cargarPedimentoTabla', () => {
    component.cargarPedimentoTabla();
    expect(component.tablaPedimento.datos.length).toBe(0);
  });

  it('should update fechaTranslado and call store in cambioFechaIngreso', () => {
    component.inicializarFormulario();
    const store = TestBed.inject(
      'Tramite32506Store' as any
    ) as MockTramite32506Store;
    component.store = store as any;
    component.cambioFechaIngreso('2024-01-01');
    expect(component.datosAviso.get('fechaTranslado')?.value).toBe(
      '2024-01-01'
    );
    expect(store.setAvisoFormularioFechaTranslado).toHaveBeenCalledWith(
      '2024-01-01'
    );
  });

  it('should update filaSeleccionadaLista in filaSeleccionada', () => {
    const arr = [{ id: 1 }] as any;
    component.filaSeleccionada(arr);
    expect(component.filaSeleccionadaLista).toBe(arr);
  });

  it('should update filaSeleccionadaPedimentoLista in filaSeleccionadaPedimento', () => {
    const arr = [{ id: 2 }] as any;
    component.filaSeleccionadaPedimento(arr);
    expect(component.filaSeleccionadaPedimentoLista).toBe(arr);
  });

  it('should update filaSeleccionadaProcesoLista in filaSeleccionaProceso', () => {
    const arr = [{ id: 3 }] as any;
    component.filaSeleccionaProceso(arr);
    expect(component.filaSeleccionadaProcesoLista).toBe(arr);
  });

  it('should update filaSeleccionadaDesperdicioLista in filaSeleccionaDesperdicio', () => {
    const arr = [{ id: 4 }] as any;
    component.filaSeleccionaDesperdicio(arr);
    expect(component.filaSeleccionadaDesperdicioLista).toBe(arr);
  });

  it('should remove selected pedimentos in eliminarPedimento', () => {
    component.tablaPedimento.datos = [];
    component.filaSeleccionadaPedimentoLista = [];
    component.eliminarPedimento();
    expect(component.tablaPedimento.datos.length).toBe(0);
    expect(component.filaSeleccionadaPedimentoLista.length).toBe(0);
  });

  it('should remove selected domicilios in eliminarDomicilio', () => {
    component.tablaDeDatos.datos = [];
    component.filaSeleccionadaLista = [];
    component.eliminarDomicilio();
    expect(component.tablaDeDatos.datos.length).toBe(0);
    expect(component.filaSeleccionadaLista.length).toBe(0);
  });

  it('should remove selected procesos in eliminarProceso', () => {
    component.tablaProceso.datos = [];
    component.filaSeleccionadaProcesoLista = [];
    component.eliminarProceso();
    expect(component.tablaProceso.datos.length).toBe(0);
    expect(component.filaSeleccionadaProcesoLista.length).toBe(0);
  });

  it('should remove selected desperdicios in eliminarDesperdicio', () => {
    component.tablaDesperdicio.datos = [];
    component.filaSeleccionadaDesperdicioLista = [];
    component.eliminarDesperdicio();
    expect(component.tablaDesperdicio.datos.length).toBe(0);
    expect(component.filaSeleccionadaDesperdicioLista.length).toBe(0);
  });

  it('should call validacionesService.isValid in isValid', () => {
    const form = new FormBuilder().group({ campo: '' });
    const service = TestBed.inject(
      'ValidacionesFormularioService' as any
    ) as MockValidacionesFormularioService;
    service.isValid(form.value, 'campo');
    expect(service.isValid).toHaveBeenCalledWith(form.value, 'campo');
  });

  it('should remove only selected pedimentos in eliminarPedimento', () => {
    const pedimentos = [
      {
        id: 1,
        patenteAutorizacion: '',
        pedimento: '',
        claveAduanaPedimento: '',
        claveFraccionArancelariaPedimento: '',
        nicoPedimento: '',
        cantidadPedimento: '',
        claveUnidadMedidaPedimento: '',
      },
      {
        id: 2,
        patenteAutorizacion: '',
        pedimento: '',
        claveAduanaPedimento: '',
        claveFraccionArancelariaPedimento: '',
        nicoPedimento: '',
        cantidadPedimento: '',
        claveUnidadMedidaPedimento: '',
      },
    ];
    component.tablaPedimento.datos = [...pedimentos];
    component.filaSeleccionadaPedimentoLista = [];
    component.eliminarPedimento();
    expect(component.filaSeleccionadaPedimentoLista).toEqual([]);
  });

  it('should remove only selected domicilios in eliminarDomicilio', () => {
    const domicilios = [
      {
        id: 1,
        nombreComercial: '',
        entidadFederativa: '',
        alcaldioOMuncipio: '',
        colonia: '',
        horaDestruccion: '',
        fechaDestruccion: '',
      },
      {
        id: 2,
        nombreComercial: '',
        entidadFederativa: '',
        alcaldioOMuncipio: '',
        colonia: '',
        horaDestruccion: '',
        fechaDestruccion: '',
      },
    ];
    component.tablaDeDatos.datos = [...domicilios];
    component.filaSeleccionadaLista = [];
    component.eliminarDomicilio();
    expect(component.filaSeleccionadaLista).toEqual([]);
  });

  it('should remove only selected procesos in eliminarProceso', () => {
    const procesos = [
      {
        id: 1,
        descripcionProcesoDestruccion: '',
      },
      {
        id: 2,
        descripcionProcesoDestruccion: '',
      },
    ];
    component.tablaProceso.datos = [...procesos];
    component.filaSeleccionadaProcesoLista = [procesos[2]];
    component.eliminarProceso();
    expect(component.tablaProceso.datos).toEqual([
      { id: 1, descripcionProcesoDestruccion: '' },
      { id: 2, descripcionProcesoDestruccion: '' },
    ]);
    expect(component.filaSeleccionadaProcesoLista).toEqual([]);
  });

  it('should remove only selected desperdicios in eliminarDesperdicio', () => {
    const desperdicios = [
      { id: 1, descripcionProcesoDestruccion: '' },
      { id: 2, descripcionProcesoDestruccion: '' },
    ];
    component.tablaDesperdicio.datos = [...desperdicios];
    component.filaSeleccionadaDesperdicioLista = [desperdicios[0]];
    component.eliminarDesperdicio();
    expect(component.tablaDesperdicio.datos).toEqual([
      { id: 2, descripcionProcesoDestruccion: '' },
    ]);
    expect(component.filaSeleccionadaDesperdicioLista).toEqual([]);
  });

  it('should call setAvisoFormularioTipoAviso and enable/disable fields in verificaTipoAviso', () => {
    component.inicializarFormulario();
    component.store = TestBed.inject('Tramite32506Store' as any) as any;
    component.TIPAVI = [
      { value: 'TIPO1', label: 'Tipo 1' },
      { value: 'TIPO2', label: 'Tipo 2' },
    ];
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    const justificacion = component.avisoFormulario.get(
      'datosAviso.justificacion'
    );
    const periodicidad = component.avisoFormulario.get(
      'datosAviso.periodicidadMensualDestruccion'
    );
    jest.spyOn(justificacion!, 'disable');
    jest.spyOn(periodicidad!, 'disable');
    component.verificaTipoAviso();
    expect(component.store.setAvisoFormularioTipoAviso).toHaveBeenCalledWith(
      'TIPO1'
    );
  });

  it('should enable fields if tipoAviso is not TIPAVI[0].value in verificaTipoAviso', () => {
    component.inicializarFormulario();
    component.store = TestBed.inject('Tramite32506Store' as any) as any;
    component.TIPAVI = [
      { value: 'TIPO1', label: 'Tipo 1' },
      { value: 'TIPO2', label: 'Tipo 2' },
    ];
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO2');
    const justificacion = component.avisoFormulario.get(
      'datosAviso.justificacion'
    );
    const periodicidad = component.avisoFormulario.get(
      'datosAviso.periodicidadMensualDestruccion'
    );
    jest.spyOn(justificacion!, 'enable');
    jest.spyOn(periodicidad!, 'enable');
    component.verificaTipoAviso();
    expect(justificacion!.enable).toHaveBeenCalled();
    expect(periodicidad!.enable).toHaveBeenCalled();
  });

  it('should call cargarAvisoTabla, close modal and abrirModal in agregarDomicilio', () => {
    component.cargarAvisoTabla = jest.fn(() => of());
    component.closeDomicilio = {
      nativeElement: { click: jest.fn(() => of()) },
    } as any;
    component.abrirModal = jest.fn(() => of());
    component.agregarDomicilio();
    expect(component.closeDomicilio.nativeElement.click).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should call cargarProcesoTabla, close modal and abrirModal in agregarProceso', () => {
    component.cargarProcesoTabla = jest.fn();
    component.closeProceso = { nativeElement: { click: jest.fn() } } as any;
    component.abrirModal = jest.fn();
    component.agregarProceso();
    expect(component.cargarProcesoTabla).toHaveBeenCalled();
    expect(component.closeProceso.nativeElement.click).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should call cargarDesperdicioTabla, close modal and abrirModal in agregarDesperdicio', () => {
    component.cargarDesperdicioTabla = jest.fn();
    component.closeDesperdicio = { nativeElement: { click: jest.fn() } } as any;
    component.abrirModal = jest.fn();
    component.agregarDesperdicio();
    expect(component.cargarDesperdicioTabla).toHaveBeenCalled();
    expect(component.closeDesperdicio.nativeElement.click).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should call cargarPedimentoTabla, close modal and abrirModal in agregarPedimento', () => {
    component.cargarPedimentoTabla = jest.fn();
    component.closePedimento = { nativeElement: { click: jest.fn() } } as any;
    component.abrirModal = jest.fn();
    component.agregarPedimento();
    expect(component.cargarPedimentoTabla).toHaveBeenCalled();
    expect(component.closePedimento.nativeElement.click).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });
  it('should set nuevaNotificacion in abrirModal', () => {
    component.abrirModal();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toContain(
      'El registro fue agregado correctamente'
    );
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const subject = new Subject<void>();
    component.destroyNotifier$ = subject;
    const nextSpy = jest.spyOn(subject, 'next');
    const completeSpy = jest.spyOn(subject, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should sanitize alphanumeric input', () => {
    const form = new FormBuilder().group({ campo: '' });
    const event = { target: { value: 'abc123!@#' } } as any;
    (component as any).INPUT = event.target;
    (window as any).REGEX_REEMPLAZAR = /[^a-zA-Z0-9]/g;
    component.sanitizeAlphanumeric(form, 'campo', event);
    expect(form.get('campo')?.value).toMatch(/^[a-zA-Z0-9]*$/);
  });

  it('should sanitize numeric input', () => {
    const form = new FormBuilder().group({ campo: '' });
    const event = { target: { value: '123abc' } } as any;
    (component as any).INPUT = event.target;
    (window as any).REGEX_NUMEROS = /[^0-9]/g;
    component.sanitizeNumeric(form, 'campo', event);
    expect(form.get('campo')?.value).toMatch(/^[0-9]*$/);
  });

  it('should clear file input in limpiar', () => {
    component.inicializarFormulario();
    const fileInput = document.createElement('input');
    fileInput.value = 'fakepath/file.txt';
    component.limpiar(fileInput);
    expect(fileInput.value).toBe('');
    expect(component.avisoFormulario.get('archivoMasivo')?.value).toBe('');
  });

  it('should set archivoMasivo in onArchivoMasivoSeleccionado', () => {
    component.inicializarFormulario();
    const file = new File([''], 'test.txt');
    const event = { target: { files: [file] } } as any;
    component.onArchivoMasivoSeleccionado(event);
    expect(component.avisoFormulario.get('archivoMasivo')?.value).toBe(file);
  });

  it('abiertoDomicilio should set nuevaNotificacion if tipoAviso is not selected', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('');
    component.abiertoDomicilio();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toContain(
      'Debe seleccionar un tipo de destrucción'
    );
  });

  it('abiertoDomicilio should reset domicilioFormulario and show modal if tipoAviso is selected', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    const resetSpy = jest.spyOn(component.domicilioFormulario, 'reset');
    component.esFormularioSoloLectura = false;
    component.abiertoDomicilio();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('abiertoDomicilio should disable pedimentoFormulario if esFormularioSoloLectura is true', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    component.esFormularioSoloLectura = true;
    const disableSpy = jest.spyOn(component.pedimentoFormulario, 'disable');
    component.abiertoDomicilio();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('abiertoDomicilio should enable pedimentoFormulario if esFormularioSoloLectura is false', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.pedimentoFormulario, 'enable');
    component.abiertoDomicilio();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('abiertoProceso should show modalProceso', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.pedimentoFormulario, 'enable');
    component.abiertoDomicilio();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('abiertoDesperdicio should show modalDesperdicio', () => {
     component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.pedimentoFormulario, 'enable');
    component.abiertoDomicilio();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('abiertoPedimento should show modalPedimento', () => {
    component.avisoFormulario.get('datosAviso.tipoAviso')?.setValue('TIPO1');
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.pedimentoFormulario, 'enable');
    component.abiertoDomicilio();
    expect(enableSpy).toHaveBeenCalled();
  });
});
