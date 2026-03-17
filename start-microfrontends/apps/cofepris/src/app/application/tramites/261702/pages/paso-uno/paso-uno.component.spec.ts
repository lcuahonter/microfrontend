import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { RetirosCofeprisService } from '../../services/retiros-cofepris.service';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // <-- Add this import

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>; // <-- Add this line
  let retirosCofeprisServiceMock: any;

  beforeEach(async () => {
    retirosCofeprisServiceMock = {
      getImportacionDefinitivaData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: RetirosCofeprisService, useValue: retirosCofeprisServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // <-- Add this line
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe establecer esDatosRespuesta en true si consultaState.update es false', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debe actualizar el estado y llamar actualizarEstadoFormulario por cada campo', () => {
    const mockResp = { campo1: 'valor1', campo2: 'valor2' };
    retirosCofeprisServiceMock.getImportacionDefinitivaData.mockReturnValue(of(mockResp));
    component.guardarDatosFormulario();
    expect(retirosCofeprisServiceMock.getImportacionDefinitivaData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(retirosCofeprisServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('campo1', 'valor1');
    expect(retirosCofeprisServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('campo2', 'valor2');
  });

  it('guardarDatosFormulario no debe llamar actualizarEstadoFormulario si resp es falsy', () => {
    retirosCofeprisServiceMock.getImportacionDefinitivaData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(retirosCofeprisServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('seleccionaTab debe cambiar el índice y emitir el evento', () => {
    const spy = jest.spyOn(component.pestanaCambiado, 'emit');
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});