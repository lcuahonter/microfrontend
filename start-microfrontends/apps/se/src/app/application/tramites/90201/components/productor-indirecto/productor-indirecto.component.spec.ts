import { ProductorIndirectoComponent } from './productor-indirecto.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('ProductorIndirectoComponent', () => {
  let component: ProductorIndirectoComponent;
  let tramite90201StoreMock: any;
  let tramite90201QueryMock: any;
  let consultaioQueryMock: any;
  let fb: FormBuilder;

  beforeEach(() => {
    tramite90201StoreMock = {
      setRfc: jest.fn()
    };
    tramite90201QueryMock = {
      selectSolicitud$: of({
        rfc: 'RFC123'
      })
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };
    fb = new FormBuilder();
    component = new ProductorIndirectoComponent(
      tramite90201StoreMock,
      tramite90201QueryMock,
      consultaioQueryMock,
      fb
    );
    component.solicitudState = { rfc: 'RFC123' } as any;
  });

  it('should initialize formProductorIndirecto with correct value', () => {
    component.inicializarProductorFormulario();
    expect(component.formProductorIndirecto).toBeDefined();
    expect(component.formProductorIndirecto.get('rfc')?.value).toBe('RFC123');
  });

  it('should disable form when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarProductorFormulario();
    expect(component.formProductorIndirecto.disabled).toBe(true);
  });

  it('should enable form when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.inicializarProductorFormulario();
    component.esFormularioSoloLectura = false;
    expect(component.formProductorIndirecto.enabled).toBe(true);
  });

  it('should call store method in setValoresStore', () => {
    component.rfc = 'RFC456';
    component.setValoresStore('rfc', 'setRfc');
    expect(tramite90201StoreMock.setRfc).toHaveBeenCalledWith('RFC456');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
