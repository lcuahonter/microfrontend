import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { By } from '@angular/platform-browser';
import { AccionBoton } from '../../models/aviso.model';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/enums/31201/aviso-unico.enum';
import { DatosComponent } from '../datos/datos.component';
import { provideHttpClient } from '@angular/common/http'; 
import { PasoDosComponent } from '../../components/paso-dos/paso-dos.component';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;
  let wizardComponent: WizardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent, DatosComponent],
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent, PasoDosComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    wizardComponent = fixture.debugElement.query(By.directive(WizardComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pantallasPasos).toEqual(PANTA_PASOS);
    expect(component.indice).toBe(1);
    expect(component.datosPasos).toEqual({
      nroPasos: component.pantallasPasos.length,
      indice: component.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should call wizardComponent.siguiente() when action is "cont" and index is valid', () => {
    const spySiguiente = jest.spyOn(wizardComponent, 'siguiente');
    const accion: AccionBoton = { valor: 2, accion: 'cont' };

    component.getValorIndice(accion);

    expect(spySiguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
  });

  it('should call wizardComponent.atras() when action is "atras" and index is valid', () => {
    const spyAtras = jest.spyOn(wizardComponent, 'atras');
    const accion: AccionBoton = { valor: 1, accion: 'atras' };

    component.getValorIndice(accion);

    expect(spyAtras).toHaveBeenCalled();
    expect(component.indice).toBe(1);
  });

  it('should not change index or call wizardComponent methods if index is out of range', () => {
    const spySiguiente = jest.spyOn(wizardComponent, 'siguiente');
    const spyAtras = jest.spyOn(wizardComponent, 'atras');
    const accion: AccionBoton = { valor: 6, accion: 'cont' };

    component.getValorIndice(accion);

    expect(spySiguiente).not.toHaveBeenCalled();
    expect(spyAtras).not.toHaveBeenCalled();
    expect(component.indice).toBe(1);  // Default value
  });

  it('should render the correct template based on the index', () => {
    component.indice = 1;
    fixture.detectChanges();
    let appDatos = fixture.debugElement.query(By.css('app-datos'));
    expect(appDatos).toBeTruthy();
  });

  it('should call getValorIndice on btn-continuar event', () => {
    const spyGetValorIndice = jest.spyOn(component, 'getValorIndice');
    const btnContinuarComponent = fixture.debugElement.query(By.directive(BtnContinuarComponent));
    const btnContinuar = btnContinuarComponent.componentInstance;

    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    btnContinuar.continuarEvento.emit(accion);

    expect(spyGetValorIndice).toHaveBeenCalledWith(accion);
  });
});
