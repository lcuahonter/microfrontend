import { PantallasComponent } from './pantallas.component';
import { PANTA_PASOS } from '../../enums/permiso-petroleo.enum';
import { AccionBoton } from '../../models/permiso-importacion.model';

describe('PantallasComponent', () => {
  let component: PantallasComponent;

  beforeEach(() => {
    component = new PantallasComponent();
    // Mock the wizardComponent with spies for siguiente and atras
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pantallasPasos from PANTA_PASOS', () => {
    expect(component.pantallasPasos).toBe(PANTA_PASOS);
  });

  it('should initialize indice as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize datosPasos with correct values', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.siguiente when accion is "cont"', () => {
    const event: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(event);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras when accion is not "cont"', () => {
    const event: AccionBoton = { valor: 3, accion: 'back' };
    component.getValorIndice(event);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent if valor is out of range', () => {
    const event: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(event);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    const event2: AccionBoton = { valor: 5, accion: 'back' };
    component.getValorIndice(event2);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});