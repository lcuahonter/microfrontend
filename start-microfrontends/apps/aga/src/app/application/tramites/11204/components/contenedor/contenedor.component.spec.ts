import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorComponent } from './contenedor.component';
import { provideHttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContenedorComponent', () => {
  let component: ContenedorComponent;
  let fixture: ComponentFixture<ContenedorComponent>;
  let datosTramiteServiceMock: any;

  beforeEach(async () => {
    datosTramiteServiceMock = {
      getContenedores: jest.fn().mockReturnValue(of({ data: [] })),
      getTransporteList: jest.fn(),
      getAduanaLista: jest.fn().mockReturnValue(of({ data: [] })),
      agregarSolicitud: jest.fn().mockReturnValue(of({ success: true, datos: {} })),
      submitSolicitud: jest.fn(),
      getDatosTableData: jest.fn().mockReturnValue(of({ data: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [ContenedorComponent, ReactiveFormsModule, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: DatosTramiteService, useValue: datosTramiteServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
  });

  it('should call agregarSolicitud when datosCaptura is called with valid form', () => {
    const agregarSolicitudSpy = jest.spyOn(component, 'agregarSolicitud');
    component.solicitudForm.patchValue({
      aduana: 'aduana',
      fechaIngreso: '2024-03-13',
      vigencia: '2024-03-13',
      inicialesContenedor: 'BBZM',
      numeroContenedor: '1098765',
      contenedores: 'AC'
    });
    component.datosCaptura();
    expect(agregarSolicitudSpy).toHaveBeenCalled();
  });

  it('should emit continuarEvento on continuar', () => {
    const continuarEventoSpy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(continuarEventoSpy).toHaveBeenCalledWith('');
  });

  it('should call setValoresStore when onChange is called for inicialesContenedor', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.ngOnInit();
    const event = { target: { value: 'BBZM' } } as any;
    component.onChange('inicialesContenedor', event);
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.solicitudForm, 'inicialesContenedor', 'setInicialesContenedor');
  });

  it('should call setValoresStore when onChange is called for numeroContenedor', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.ngOnInit();
    const event = { target: { value: '234846' } } as any;
    component.onChange('numeroContenedor', event);
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.solicitudForm, 'numeroContenedor', 'setNumeroContenedor');
  });

  it('should call setValoresStore when onChange is called for digitoDeControl', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.ngOnInit();
    const event = { target: { value: '1' } } as any;
    component.onChange('digitoDeControl', event);
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.solicitudForm, 'digitoDeControl', 'setDigitoDeControl');
  });

  it('should call mostrarCampos when tipoBusqueda changes', () => {
    const mostrarCamposSpy = jest.spyOn(component, 'mostrarCampos');
    component.ngOnInit();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Contenedor');
    expect(mostrarCamposSpy).toHaveBeenCalled();
  });

  it('should reset form and flags on limpiarCampos', () => {
    component.limpiarCampos();
    expect(component.solicitudForm.pristine).toBeTruthy();
    expect(component.mostrarSeccionArchivoCsv).toBeFalsy();
    expect(component.mostrarSeccionAduanaaFecha).toBeFalsy();
    expect(component.mostrarSeccionContenedor).toBeFalsy();
    expect(component.mostrarSeccionExcel).toBeFalsy();
    expect(component.mostrarAgregarTipoContenedor).toBeFalsy();
  });

  it('should set mostrarAgregarTipoContenedor to true on mostrarTipoContenedor', () => {
    component.mostrarTipoContenedor();
    expect(component.mostrarAgregarTipoContenedor).toBeTruthy();
  });

  it('should call destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set value on cambioFechaIngreso', () => {
    component.inicializarFormulario();
    component.cambioFechaIngreso('2024-03-13');
    expect(component.solicitudForm.get('fechaIngreso')?.value).toBe('2024-03-13');
  });

  it('should set value on cambioVigencia', () => {
    component.inicializarFormulario();
    component.cambioVigencia('2024-03-13');
    expect(component.solicitudForm.get('vigencia')?.value).toBe('2024-03-13');
  });

  it('should call setValoresStore with correct params', () => {
    const storeSpy = jest.spyOn(component.Tramite11204Store, 'setTipoBusqueda' as any);
    component.inicializarFormulario();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Contenedor');
    component.setValoresStore(component.solicitudForm, 'tipoBusqueda', 'setTipoBusqueda');
    expect(storeSpy).toHaveBeenCalled();
  });

  it('should parse CSV and update datosTabla', () => {
    const csv = 'Aduana,Iniciales del equipo,Tipo de documento,Número de equipo,Dígito verificador,Fecha Ingreso,Vigencia\nA1,IE1,TD1,NE1,DV1,2024-03-13,2024-03-14';
    component.parseCSV(csv);
    expect(component.datosTabla.length).toBeGreaterThan(0);
    expect(component.datosTabla[0]['aduana']).toBe('A1');
  });

  it('should call tabSeleccionado and set idxActual', () => {
    localStorage.setItem('idxActual', '2');
    component.tabSeleccionado();
    expect(component.idxActual).toBe(2);
  });

  it('should call hideModal and set mostrarButtons to true', () => {
    component.modalElement = { nativeElement: document.createElement('div') } as any;
    component.mostrarButtons = false;
    component.hideModal();
    expect(component.mostrarButtons).toBe(true);
  });

  it('should return correct value from isValid', () => {
    component.inicializarFormulario();
    const result = component.isValid('aduana');
    expect(typeof result).toBe('boolean');
  });

  it('should return correct value from isInvalid', () => {
    component.inicializarFormulario();
    const result = component.isInvalid('aduana');
    expect(typeof result === 'boolean' || result === undefined).toBeTruthy();
  });

  it('should set mostrarSeccionArchivoCsv to true when mostrarCampos is called with "Archivo CSV"', () => {
    component.inicializarFormulario();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Archivo CSV');
    component.mostrarCampos();
    expect(component.mostrarSeccionArchivoCsv).toBe(true);
  });

  it('should set mostrarSeccionContenedor to true when mostrarCampos is called with "Contenedor"', () => {
    component.inicializarFormulario();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Contenedor');
    component.mostrarCampos();
    expect(component.mostrarSeccionContenedor).toBe(true);
  });

  it('should not set any mostrarSeccion flags if tipoBusqueda is unknown', () => {
    component.inicializarFormulario();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Desconocido');
    component.mostrarCampos();
    expect(component.mostrarSeccionArchivoCsv).toBeFalsy();
    expect(component.mostrarSeccionExcel).toBeFalsy();
    expect(component.mostrarSeccionContenedor).toBeFalsy();
  });

  it('should handle minimal CSV in parseCSV gracefully', () => {
    component.parseCSV('Aduana,Iniciales del equipo,Tipo de documento,Número de equipo,Dígito verificador,Fecha Ingreso,Vigencia\n');
    expect(component.datosTabla.length).toBe(0);
  });

  it('should call continuarEvento.emit with value on continuar', () => {
    const continuarEventoSpy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(continuarEventoSpy).toHaveBeenCalledWith('');
  });
});
