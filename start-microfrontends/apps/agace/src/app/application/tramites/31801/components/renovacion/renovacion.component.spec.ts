import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { RenovacionComponent } from './renovacion.component';
import { RenovacionService } from '../../services/renovacion/renovacion.service';
import { Tramite31801Store } from '../../../../estados/tramites/tramite31801.store';
import { Tramite31801Query } from '../../../../estados/queries/tramite31801.query';
import { RenovacionRespuesta, ManifiestosRespuesta } from '../../models/renovacion.model';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';

describe('RenovacionComponent (pruebas en español)', () => {
  let component: RenovacionComponent;
  let fixture: ComponentFixture<RenovacionComponent>;
  let mockRenovacionService: jest.Mocked<RenovacionService>;
  let mockTramite31801Store: any;
  let mockTramite31801Query: any;

  beforeEach(async () => {
    mockRenovacionService = {
      obtenerRenovacionDatos: jest.fn(() => of({ code: 200, data: [], message: 'Éxito' } as RenovacionRespuesta)),
      getManifiestos: jest.fn(() => of({ code: 200, data: [], message: 'Éxito' } as ManifiestosRespuesta)),
      obtenerDocumentosSeleccionados: jest.fn(),
    } as unknown as jest.Mocked<RenovacionService>;

    mockTramite31801Store = {
      setSeleccionadaManifiesto: jest.fn(),
      setFechaPago: jest.fn(),
      setTramite31801State: jest.fn()
    };

    mockTramite31801Query = {
      selectSeccionState$: of({
        numeroOficio: 'A123',
        fechaInicialInput: '2025-01-01',
        fechaFinalInput: '2025-01-31',
        fechaPago: '2025-02-01',
        monedaNacional: 1,
        numeroOperacion: '99999',
        llavePago: 'LLAVE999',
        seleccionadaManifiesto: [false, false]
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        RenovacionComponent,
        InputFechaComponent
      ],
      providers: [
        { provide: RenovacionService, useValue: mockRenovacionService },
        { provide: Tramite31801Store, useValue: mockTramite31801Store },
        { provide: Tramite31801Query, useValue: mockTramite31801Query },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RenovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el formulario correctamente', () => {
    component.crearRenovacionForm();
    expect(component.renovacionForm instanceof FormGroup).toBe(true);
    expect(component.renovacionForm.get('numeroOficio')?.value).toBe('A123');
  });

  it('debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.renovacionForm.disabled).toBe(true);
  });

  it('debe habilitar el formulario si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.renovacionForm.enabled).toBe(true);
  });

  it('debe obtener y asignar los manifiestos correctamente', () => {
    const mockResponse: ManifiestosRespuesta = {
      code: 200,
      data: [
        {
          declaracion: { clave: '2', descripcion: 'Manifiesto 2' },
          manifiestoDeclaracion: false
        }
      ],
      message: 'Éxito'
    };
    mockRenovacionService.getManifiestos.mockReturnValue(of(mockResponse));
    component.obtenerManifiestos();
    expect(component.manifiestos.length).toBe(1);
    expect(component.manifiestos[0].declaracion.descripcion).toBe('Manifiesto 2');
  });

  it('debe actualizar el valor de seleccionadaManifiesto al cambiar el checkbox', () => {
    component.crearRenovacionForm();
    component.renovacionForm.setControl('seleccionadaManifiesto', new FormArray([new FormControl(false)]));
    const eventoMock = { target: { checked: true } } as unknown as Event;
    component.onManifiestoCheckboxCambiar(eventoMock, 0);
    expect(component.seleccionadaManifiesto.controls[0].value).toBe(true);
    expect(mockTramite31801Store.setTramite31801State).toHaveBeenCalledWith({ seleccionadaManifiesto: [true] });
  });

  it('debe actualizar la fecha de pago correctamente', () => {
    component.crearRenovacionForm();
    component.cambioFechaPago('2025-03-01');
    expect(component.renovacionForm.get('fechaPago')?.value).toBe('2025-03-01');
    expect(mockTramite31801Store.setTramite31801State).toHaveBeenCalledWith({ fechaPago: '2025-03-01' });
  });

  it('debe llamar a setValorStore con los parámetros correctos', () => {
    const spy = jest.spyOn(component, 'setValorStore');
    component.crearRenovacionForm();
    component.cambioFechaPago('2025-04-01');
    expect(spy).toHaveBeenCalledWith(component.renovacionForm, 'fechaPago');
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const spyNext = jest.spyOn(component['destruirNotificador$'], 'next');
    const spyComplete = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debe obtener el estado seleccionado del store', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toBeDefined();
    expect(component.estadoSeleccionado.numeroOficio).toBe('A123');
  });
});