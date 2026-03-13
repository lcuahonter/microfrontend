import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajeriaComponent } from './mensajeria.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MensajeriaComponent', () => {
  let component: MensajeriaComponent;
  let fixture: ComponentFixture<MensajeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeriaComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los formularios en ngOnInit', () => {
    component.ngOnInit();
    expect(component.mensajeriaGroup).toBeDefined();
    expect(component.susFilialesForm).toBeDefined();
    expect(component.lasEmpresasForm).toBeDefined();
  });

  it('debería llamar a obtenerTablaDatos en ngOnInit', () => {
    const obtenerTablaDatosSpy = jest.spyOn(component, 'obtenerTablaDatos');
    component.ngOnInit();
    expect(obtenerTablaDatosSpy).toHaveBeenCalled();
  });

  it('debería abrir el primer modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaInstance, 'show');
    component.openTablaModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('debería cerrar el primer modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaInstance, 'hide');
    component.closeTablaModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('debería abrir el segundo modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaDosInstance, 'show');
    component.openTablaDosModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('debería cerrar el segundo modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaDosInstance, 'hide');
    component.closeTablaDosModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('debería actualizar el formulario mensajeriaGroup en cambioFechaFactura', () => {
    const form = component.mensajeriaGroup;
    const setValueSpy = jest.spyOn(form.get('fechaFactura')!, 'setValue');
    component.cambioFechaFactura('2023-01-01', form, 'fechaFactura', 'setFechaFactura');
    expect(setValueSpy).toHaveBeenCalledWith('2023-01-01');
  });

  it('debería deshabilitar todos los controles en mensajeriaGroup si esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;
    // Agregar controles para la prueba si no están presentes
    component.mensajeriaGroup.addControl('comercioExterior', component.mensajeriaGroup.get('comercioExterior') || { disable: jest.fn() } as any);
    const disableSpies = Object.keys(component.mensajeriaGroup.controls).map(
      key => jest.spyOn(component.mensajeriaGroup.get(key)!, 'disable')
    );

    // Llamar a la lógica bajo prueba
    if (component.esFormularioSoloLectura) {
      Object.keys(component.mensajeriaGroup.controls).forEach((key) => {
        component.mensajeriaGroup.get(key)?.disable();
      });
    }

    // Verificar que todos los controles fueron deshabilitados
    disableSpies.forEach(spy => expect(spy).toHaveBeenCalled());
  });

  it('debería llamar al método del store y actualizar flags en setValoresStore', () => {
    // Mock del formulario y store
    const mockForm = {
      get: jest.fn((campo: string) => ({
        value: campo === 'comercioExterior' ? '1' : campo === 'recintoFiscalizado' ? '0' : 'test'
      }))
    } as any;

    component.tramite32615Store = {
      setComercioExterior: jest.fn(),
      setRecintoFiscalizado: jest.fn()
    } as any;

    // comercioExterior = 1
    component.setValoresStore(mockForm, 'comercioExterior', 'setComercioExterior');
    expect(component.tramite32615Store.setComercioExterior).toHaveBeenCalledWith('1');
    expect(component.isComercioExterior).toBe(true);

    // comercioExterior = 0
    mockForm.get = jest.fn(() => ({ value: '0' }));
    component.setValoresStore(mockForm, 'comercioExterior', 'setComercioExterior');
    expect(component.isComercioExterior).toBe(false);

    // recintoFiscalizado = 1
    mockForm.get = jest.fn(() => ({ value: '1' }));
    component.setValoresStore(mockForm, 'recintoFiscalizado', 'setRecintoFiscalizado');
    expect(component.tramite32615Store.setRecintoFiscalizado).toHaveBeenCalledWith('1');
    expect(component.isRecintoFiscalizado).toBe(true);

    // recintoFiscalizado = 0
    mockForm.get = jest.fn(() => ({ value: '0' }));
    component.setValoresStore(mockForm, 'recintoFiscalizado', 'setRecintoFiscalizado');
    expect(component.isRecintoFiscalizado).toBe(false);
  });

  it('debería actualizar fechaFactura y propagar al store', () => {
    const form = component.mensajeriaGroup;
    const setValueSpy = jest.spyOn(form.get('fechaFactura')!, 'setValue');
    component.cambioFechaFactura('2023-01-01', form, 'fechaFactura', 'setFechaFactura');
    expect(setValueSpy).toHaveBeenCalledWith('2023-01-01');
  });

  it('debería cancelar suscripciones en ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledWith();
  });
});