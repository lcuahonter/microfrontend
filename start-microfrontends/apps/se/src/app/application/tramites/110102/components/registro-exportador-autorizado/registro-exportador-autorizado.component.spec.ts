import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegistroExportadorAutorizadoComponent } from './registro-exportador-autorizado.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExportadorAutorizadoService } from "@ng-mf/data-access-user";
import { Tramite110102Store } from '../../estados/store/tramite110102.store';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';
import { of } from 'rxjs';

describe('RegistroExportadorAutorizadoComponent', () => {
  let component: RegistroExportadorAutorizadoComponent;
  let fixture: ComponentFixture<RegistroExportadorAutorizadoComponent>;
  let mockService: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockService = {
      getExportadorAutorizado: jest.fn().mockReturnValue(of([{ label: 'A', value: 1 }])),
      getExportadorAutorizadoJPN: jest.fn().mockReturnValue(of([{ label: 'B', value: 2 }]))
    };
    mockStore = { establecerDatos: jest.fn() };
    mockQuery = { selectTramite110102$: of({
      solicitaSeparacionContable: true,
      solicitaExportadorAutorizado: true,
      condicionExportador: 'COND',
      solicitaExportadorAutorizadoJPN: false,
      condicionExportadorJPN: 'CONDJPN'
    }) };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistroExportadorAutorizadoComponent],
      providers: [
        FormBuilder,
        { provide: ExportadorAutorizadoService, useValue: mockService },
        { provide: Tramite110102Store, useValue: mockStore },
        { provide: Tramite110102Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroExportadorAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe inicializar el formulario y cargar opciones', () => {
    expect(component.formularioRegistroExportador).toBeDefined();
    expect(mockService.getExportadorAutorizado).toHaveBeenCalled();
    expect(mockService.getExportadorAutorizadoJPN).toHaveBeenCalled();
    expect(component.opcionesExportador).toEqual([{ label: 'A', value: 1 }]);
    expect(component.opcionesExportadorJapon).toEqual([{ label: 'B', value: 2 }]);
    expect(component.mostrarOpcionesExportador).toBe(true);
    expect(component.mostrarOpcionesExportadorJapon).toBe(false);
  });

  it('alCambiarExportadorAutorizado debe actualizar mostrarOpcionesExportador y llamar establecerValoresEnEstado', () => {
    const EVENT = { target: { checked: true } } as any;
    const SPY = jest.spyOn(component, 'establecerValoresEnEstado');
    component.alCambiarExportadorAutorizado(EVENT);
    expect(component.mostrarOpcionesExportador).toBe(true);
    expect(SPY).toHaveBeenCalledWith(component.formularioRegistroExportador, 'solicitaExportadorAutorizado');
  });

  it('alCambiarExportadorAutorizadoJapon debe actualizar mostrarOpcionesExportadorJapon y llamar establecerValoresEnEstado', () => {
    const EVENT = { target: { checked: true } } as any;
    const SPY = jest.spyOn(component, 'establecerValoresEnEstado');
    component.alCambiarExportadorAutorizadoJapon(EVENT);
    expect(component.mostrarOpcionesExportadorJapon).toBe(true);
    expect(SPY).toHaveBeenCalledWith(component.formularioRegistroExportador, 'solicitaExportadorAutorizadoJPN');
  });

  it('establecerValoresEnEstado debe llamar a establecerDatos en el store', () => {
    component.formularioRegistroExportador.get('condicionExportador')?.setValue('VALOR');
    component.establecerValoresEnEstado(component.formularioRegistroExportador, 'condicionExportador');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ condicionExportador: 'VALOR' });
  });

  it('obtenerValoresDelEstado debe actualizar el formulario con valores del store', () => {
    component.formularioRegistroExportador.patchValue({
      solicitaSeparacionContable: false,
      solicitaExportadorAutorizado: false,
      condicionExportador: '',
      solicitaExportadorAutorizadoJPN: false,
      condicionExportadorJPN: ''
    });
    component.obtenerValoresDelEstado();
    expect(component.formularioRegistroExportador.get('solicitaSeparacionContable')?.value).toBe(true);
    expect(component.formularioRegistroExportador.get('solicitaExportadorAutorizado')?.value).toBe(true);
    expect(component.formularioRegistroExportador.get('condicionExportador')?.value).toBe('COND');
    expect(component.formularioRegistroExportador.get('solicitaExportadorAutorizadoJPN')?.value).toBe(false);
    expect(component.formularioRegistroExportador.get('condicionExportadorJPN')?.value).toBe('CONDJPN');
  });

  it('ngOnDestroy debe completar el subject destruido$', () => {
    const SPY_NEXT = jest.spyOn((component as any).destruido$, 'next');
    const SPY_COMPLETE = jest.spyOn((component as any).destruido$, 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});