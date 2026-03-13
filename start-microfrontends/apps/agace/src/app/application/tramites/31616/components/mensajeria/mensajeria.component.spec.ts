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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.mensajeriaGroup).toBeDefined();
    expect(component.susFilialesForm).toBeDefined();
    expect(component.lasEmpresasForm).toBeDefined();
  });

  it('should call obtenerTablaDatos on ngOnInit', () => {
    const obtenerTablaDatosSpy = jest.spyOn(component, 'obtenerTablaDatos');
    component.ngOnInit();
    expect(obtenerTablaDatosSpy).toHaveBeenCalled();
  });

  it('should open the first modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaInstance, 'show');
    component.openTablaModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('should close the first modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaInstance, 'hide');
    component.closeTablaModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('should open the second modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaDosInstance, 'show');
    component.openTablaDosModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('should close the second modal', () => {
    const modalInstanceSpy = jest.spyOn(component.tablaDosInstance, 'hide');
    component.closeTablaDosModal();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('should set values in the store and update flags', () => {
    const form = component.mensajeriaGroup;
    form.patchValue({ laSolicitante: '1' });
    component.setValoresStore(form, 'laSolicitante', 'setLaSolicitante');
    expect(component.isLaSolicitante).toBe(true);
  });

  it('should update fechaFactura and propagate to store', () => {
    const form = component.mensajeriaGroup;
    const setValueSpy = jest.spyOn(form.get('fechaFactura')!, 'setValue');
    component.cambioFechaFactura('2023-01-01', form, 'fechaFactura', 'setFechaFactura');
    expect(setValueSpy).toHaveBeenCalledWith('2023-01-01');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledWith();
  });
});
