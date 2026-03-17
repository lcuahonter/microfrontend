import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { CAMPO_OBLIGATORIO_DERECHOS } from '../../constants/datos-solicitud.enum';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let datosService: Partial<DatosSolicitudService>;
  let query: Partial<ConsultaioQuery>;
  const bancosMock = [{ id: '1', descripcion: 'Banco1' }];

  beforeEach(async () => {
    // Stub the data service and query
    datosService = {
      obtenerBancos: jest.fn().mockReturnValue(of(bancosMock)),
    };
    const queryStub = {
      selectConsultaioState$: of({ readonly: false }),
    } as unknown as ConsultaioQuery;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PagoDeDerechosComponent, // standalone component import
      ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: datosService },
        { provide: ConsultaioQuery, useValue: queryStub },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore unknown sub-components
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    // set an ID that’s guaranteed to be in the constant array
    component.idProcedimiento = CAMPO_OBLIGATORIO_DERECHOS[0] || 0;
    fixture.detectChanges(); // triggers ngOnInit, cargarDatos, etc.
  });

  it('should create and initialize form & bancos', () => {
    expect(component).toBeTruthy();
    expect(component.pagoDerechosForm).toBeInstanceOf(FormGroup);
    expect(component.bancoDatos).toEqual(bancosMock);
  });

  it('should set campoObligatorio true when idProcedimiento is in constant', () => {
    expect(component.campoObligatorio).toBeTruthy();
  });

  it('onFechaCambiada should update fechaPago control', () => {
    component.onFechaCambiada('2025-06-26');
    expect(component.pagoDerechosForm.get('fechaPago')?.value).toBe(
      '2025-06-26'
    );
  });

  it('onImportePagoInput should strip non-digits and cap to 22 chars', () => {
    // prepare an input element
    const input = document.createElement('input');
    input.value = 'abc123def456ghi7890123456';
    component.onImportePagoInput({ target: input } as any);
    const val = component.pagoDerechosForm.get('importePago')?.value as string;
    expect(val).toHaveLength(16);
    expect(/^\d+$/.test(val)).toBe(true);
  });

  it('onReset should mark all controls as touched if invalid', () => {
    // make form invalid
    component.pagoDerechosForm.get('claveReferencia')?.setValue('');
    const spy = jest.spyOn(component.pagoDerechosForm, 'markAllAsTouched');
    component.onReset();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnChanges toggles form enable/disable based on esFormularioSoloLectura', () => {
    // disable branch
    component.pagoDerechosForm.enable();
    component.esFormularioSoloLectura = true;
    component.ngOnChanges({
      esFormularioSoloLectura: new SimpleChange(false, true, false),
    });
    expect(component.pagoDerechosForm.disabled).toBeTruthy();

    // enable branch
    component.esFormularioSoloLectura = false;
    component.ngOnChanges({
      esFormularioSoloLectura: new SimpleChange(true, false, false),
    });
    expect(component.pagoDerechosForm.enabled).toBeTruthy();
  });

  it('valueChanges on form emits updatePagoDerechos event', () => {
    const emitSpy = jest.spyOn(component.updatePagoDerechos, 'emit');
    component.pagoDerechosForm.get('claveReferencia')?.setValue('TEST');
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ claveReferencia: 'TEST' })
    );
  });
});
