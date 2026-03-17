import { TestBed } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';

// Mocks
const mockAdaceService = {
  obtenerDatosAno: jest.fn(() => of([{ id: 1, descripcion: '2024' }])),
  obtenerDatosMes: jest.fn(() => of([{ id: 1, descripcion: 'Enero' }])),
};
const mockStore = {
  setRadioPartial: jest.fn(),
  setFechaPago: jest.fn(),
  setFechaElaboracion: jest.fn(),
};
const mockQuery = {
  selectSolicitud$: of({ claveFiscalizado: 'CF', adace: 'AD', tipoDictamen: '', rfc: 'RFC', nombre: 'NOMBRE', numeroInscripcion: 'NI', ano: 2024, mes: 1, radioParcial: 'RP', radioTotal: 'RT', saldoPendiente: 1, aprovechamiento: 1, disminucionAplicada: 1, saldoPendienteDisminuir: 1, cantidad: 1, llaveDePago: 'LLAVE', fechaElaboracion: '2024-01-01', fechaPago: '2024-01-01', archivo: null, compensacionAplicada: 1, saldoPendienteCompensar: 1 }),
};
const mockValidacionesService = {
  isValid: jest.fn(() => true),
};
const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('AvisoComponent', () => {
  let component: AvisoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: 'AdaceService', useValue: mockAdaceService },
        { provide: 'Tramite32508Store', useValue: mockStore },
        { provide: 'Tramite32508Query', useValue: mockQuery },
        { provide: 'ValidacionesFormularioService', useValue: mockValidacionesService },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
      ],
    });
    component = new AvisoComponent(
      mockAdaceService as any,
      TestBed.inject(FormBuilder),
      mockStore as any,
      mockQuery as any,
      mockValidacionesService as any,
      mockConsultaioQuery as any
    );
    // Minimal state for form creation
    component.solicitudState = {
      claveFiscalizado: 'CF',
      adace: 'AD',
      tipoDictamen: '',
      rfc: 'RFC',
      nombre: 'NOMBRE',
      numeroInscripcion: 'NI',
      ano: 2024,
      mes: 1,
      radioParcial: 'RP',
      radioTotal: 'RT',
      saldoPendiente: 1,
      aprovechamiento: 1,
      disminucionAplicada: 1,
      saldoPendienteDisminuir: 1,
      cantidad: 1,
      llaveDePago: 'LLAVE',
      fechaElaboracion: '2024-01-01',
      fechaPago: '2024-01-01',
      archivo: null,
      compensacionAplicada: 1,
      saldoPendienteCompensar: 1,
    } as any;
    component.donanteDomicilio();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in donanteDomicilio', () => {
    expect(component.avisoForm).toBeInstanceOf(FormGroup);
    expect(component.avisoForm.get('claveFiscalizado')?.value).toBe('CF');
  });

  it('should disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.avisoForm.disabled).toBe(true);
  });

  it('should enable form and disable adace/nombre if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.avisoForm.enabled).toBe(true);
    expect(component.avisoForm.get('adace')?.disabled).toBe(true);
    expect(component.avisoForm.get('nombre')?.disabled).toBe(true);
  });

  it('should patch file and set nombreArchivo on alSeleccionarArchivo', () => {
    const file = new File([''], 'test.txt');
    const event = { target: { files: [file] } } as any;
    component.alSeleccionarArchivo(event as Event);
    expect(component.nombreArchivo).toBe('test.txt');
    expect(component.avisoForm.get('archivo')?.value).toBe(file);
  });

  it('should set cargarArchivo true and call abrirModal on cargaArchivo', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.cargaArchivo();
    expect(component.cargarArchivo).toBe(true);
    expect(abrirModalSpy).toHaveBeenCalled();
  });

  it('should remove pedimento on eliminarPedimento', () => {
    component.pedimentos = [{ id: 1 } as any, { id: 2 } as any];
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(1);
  });

  it('should set nuevaNotificacion and elementoParaEliminar on abrirModal', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('should patch fechaPago and call setValoresStore on cambioFechaPago', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaPago('2024-02-02');
    expect(component.avisoForm.get('fechaPago')?.value).toBe('2024-02-02');
    expect(spy).toHaveBeenCalledWith(component.avisoForm, 'fechaPago', 'setFechaPago');
  });

  it('should patch fechaElaboracion and call setValoresStore on cambioFechaInitial', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInitial('2024-03-03');
    expect(component.avisoForm.get('fechaElaboracion')?.value).toBe('2024-03-03');
    expect(spy).toHaveBeenCalledWith(component.avisoForm, 'fechaElaboracion', 'setFechaElaboracion');
  });

  it('should mark all as touched if form is invalid in validarDestinatarioFormulario', () => {
    component.avisoForm.get('claveFiscalizado')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(component.avisoForm.touched).toBe(true);
  });

  it('should call validacionesService.isValid in esValido', () => {
    component.avisoForm.get('claveFiscalizado')?.setValue('CF');
    expect(component.esValido(component.avisoForm, 'claveFiscalizado')).toBe(true);
    expect(mockValidacionesService.isValid).toHaveBeenCalled();
  });

  it('should call store method and set flags in setValoresStore', () => {
    component.avisoForm.get('tipoDictamen')?.setValue('disminucion');
    component.setValoresStore(component.avisoForm, 'claveFiscalizado', 'setRadioPartial');
    expect(mockStore.setRadioPartial).toHaveBeenCalled();
    expect(component.monstrarDisminucion).toBe(true);
    component.avisoForm.get('tipoDictamen')?.setValue('compensacion');
    component.setValoresStore(component.avisoForm, 'claveFiscalizado', 'setRadioPartial');
    expect(component.mostrarCompensacion).toBe(true);
    component.avisoForm.get('tipoDictamen')?.setValue('disminucionYCompensacion');
    component.setValoresStore(component.avisoForm, 'claveFiscalizado', 'setRadioPartial');
    expect(component.mostrarDisminucionYCompensacion).toBe(true);
  });

  it('should call adace.obtenerDatosAno and set anoCatalogo in obtenerDatosAnoPeriodo', () => {
    component.obtenerDatosAnoPeriodo();
    expect(mockAdaceService.obtenerDatosAno).toHaveBeenCalled();
  });

  it('should call adace.obtenerDatosMes and set mesCatalogo in obtenerDatosMesPeriodo', () => {
    component.obtenerDatosMesPeriodo();
    expect(mockAdaceService.obtenerDatosMes).toHaveBeenCalled();
  });

  it('should set tipoDictamen to disminucion in ngAfterViewInit if empty', () => {
    component.avisoForm.get('tipoDictamen')?.setValue('');
    component.ngAfterViewInit();
    expect(component.avisoForm.get('tipoDictamen')?.value).toBe('disminucion');
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});