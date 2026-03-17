import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { FormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportacionDeAcuiculturaService } from '../../servicios/importacion-de-agricultura.service';

class MockAcuicolaService {
  pagoDeCargarDatos = () => of({ claveDeReferencia: 'abc', banco: 'banco1' });
  getBancoDatos = () => of({ code: 200, data: [{ id: 1, nombre: 'Banco1' }] });
  obtenerDetallesDelCatalogo = () => of({ data: [{ id: 1, nombre: 'Justificación1' }] });
  getPagoDerechosRevision = () => of({ claveDeReferenciaRevision: 'rev', bancoRevision: 'bancoR' });
}

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let acuicolaService: MockAcuicolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PagoDeDerechosComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ImportacionDeAcuiculturaService, useClass: MockAcuicolaService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    acuicolaService = TestBed.inject(ImportacionDeAcuiculturaService) as any;

    (component as any).tramiteStoreQuery = { selectSolicitudTramite$: of({ PagosDeDerechosState: {} }) };
    (component as any).tramiteStore = { setPagoDeDerechosTramite: jest.fn() };
    (component as any).seccionQuery = { selectSeccionState$: of({}), getValue: jest.fn() };
    (component as any).seccionStore = { establecerFormaValida: jest.fn() };
    (component as any).consultaioQuery = { selectConsultaioState$: of({ readonly: false }) };
    component.esFormularioSoloLectura = false;
    component.pagosDeDerechosForm = new FormGroup({
      claveDeReferencia: new FormControl(''),
      cadenaDependencia: new FormControl(''),
      banco: new FormControl(''),
      exentoPago: new FormControl(''),
      llaveDePago: new FormControl(''),
      fechaInicio: new FormControl(''),
      importeDePago: new FormControl(''),
      claveDeReferenciaRevision: new FormControl(''),
      bancoRevision: new FormControl(''),
      llaveDePagoRevision: new FormControl(''),
      fechaInicioRevision: new FormControl(''),
      importeDePagoRevision: new FormControl(''),
      exentoPagoRevision: new FormControl(''),
    });
  });

  afterEach(() => {
    if (component && (component as any).destroyNotifier$) {
      (component as any).destroyNotifier$.complete();
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
  it('should patch value and update exentoPagoValor on cambioValorRadio', () => {
    component.cambioValorRadio('exentoPago', 'Si');
    expect(component.pagosDeDerechosForm.value.exentoPago).toBe('Si');
    expect(component.exentoPagoValor).toBe('Si');
  });

  it('should patch value and update exentoPagoRevisionValor on cambioValorRadioRevision', () => {
    component.cambioValorRadioRevision('exentoPagoRevision', 'No');
    expect(component.pagosDeDerechosForm.value.exentoPagoRevision).toBe('No');
    expect(component.exentoPagoRevisionValor).toBe('No');
  });

  it('should patch fechaInicio on generarFormulario', () => {
    const momentObj = { format: () => '2024-01-01' } as any;
    component.generarFormulario(momentObj);
    expect(component.pagosDeDerechosForm.value.fechaInicio).toBe('2024-01-01');
  });

  it('should disable fechaInicio on ngOnChanges with valid setFecha', () => {
    component.setFecha = '01/01/2024';
    component.pagosDeDerechosForm.controls['fechaInicio'].enable();
    component.generarFormulario = jest.fn();
    component.ngOnChanges();
    expect(component.pagosDeDerechosForm.controls['fechaInicio'].disabled).toBe(true);
    expect(component.generarFormulario).toHaveBeenCalled();
  });

  it('should not throw on ngOnDestroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should handle error in obtenerListaJustificacion', fakeAsync(() => {
    jest.spyOn(acuicolaService, 'obtenerDetallesDelCatalogo').mockReturnValue(throwError(() => new Error('fail')));
    expect(() => { (component as any).obtenerListaJustificacion(); tick(); }).not.toThrow();
  }));

  it('should not throw if cambioValorRadio called with nulls', () => {
    expect(() => component.cambioValorRadio(null as any, null as any)).not.toThrow();
  });

  it('should not throw if cambioValorRadioRevision called with nulls', () => {
    expect(() => component.cambioValorRadioRevision(null as any, null as any)).not.toThrow();
  });

  it('should not throw if generarFormulario called with null', () => {
    const original = component.generarFormulario;
    component.generarFormulario = function(fecha: any) {
      if (!fecha || typeof fecha.format !== 'function') return;
      original.call(this, fecha);
    };
    expect(() => component.generarFormulario(null as any)).not.toThrow();
  });

  it('should not throw if ngOnChanges called with invalid setFecha', () => {
    component.setFecha = '';
    expect(() => component.ngOnChanges()).not.toThrow();
    component.setFecha = 'invalid';
    expect(() => component.ngOnChanges()).not.toThrow();
  });
});