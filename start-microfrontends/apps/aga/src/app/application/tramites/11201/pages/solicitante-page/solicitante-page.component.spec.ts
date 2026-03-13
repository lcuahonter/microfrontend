import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, WizardComponent, PasoUnoComponent, PasoDosComponent, BtnContinuarComponent, PasoTresComponent],
      declarations: [SolicitantePageComponent],
      providers: [
        provideHttpClient(),
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        })]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos and datosPasos on ngOnInit', () => {
    expect(component.pasos.length).toBe(3);
    expect(component.datosPasos.nroPasos).toBe(3);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should update paso title on ngOnInit', () => {
    const paso = component.pasos.find(p => p.indice === 2);
    expect(paso?.titulo).toBe('Cargar pago');
  });

  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras on getValorIndice with accion "prev"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.getValorIndice({ accion: 'prev', valor: 1 });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call getValorIndice on continuar', () => {
    const getValorIndiceSpy = jest.spyOn(component, 'getValorIndice');
    component.continuar();
    expect(getValorIndiceSpy).toHaveBeenCalledWith({ accion: 'cont', valor: component.indice });
  });

  it('should render paso-uno component when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const pasoUnoElement = fixture.debugElement.query(By.css('paso-uno'));
    expect(pasoUnoElement).toBeTruthy();
  });

  it('should render paso-tres component when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    const pasoTresElement = fixture.debugElement.query(By.css('paso-tres'));
    expect(pasoTresElement).toBeTruthy();
  });

  it('should render app-paso-dos component when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const pasoDosElement = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(pasoDosElement).toBeTruthy();
  });
  it('should reset the indice to 1 when cancelar is called', () => {
    component.indice = 3;
    component.cancelar();
    expect(component.indice).toBe(1);
  });
});