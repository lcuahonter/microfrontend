import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { AlertComponent, BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PermisoSanitarioModule} from '../../../260211/permiso-sanitario.module';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent, PasoUnoComponent],
      imports: [SolicitanteComponent, WizardComponent, BtnContinuarComponent, AlertComponent, PermisoSanitarioModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
    expect(component.pantallasPasos).toEqual(PANTA_PASOS);
    expect(component.avisoPrivacidadAlert).toBe(AVISO.Aviso);
    expect(component.datosPasos).toEqual({
      nroPasos: PANTA_PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should update indice and navigate forward', () => {
    const mockEvent = { valor: 2, accion: 'cont' };
    jest.spyOn(component.wizardComponent, 'siguiente');
  
    component.getValorIndice(mockEvent);
  
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and navigate backward', () => {
    const mockEvent = { valor: 1, accion: 'prev' };
    jest.spyOn(component.wizardComponent, 'atras');
  
    component.getValorIndice(mockEvent);
  
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or navigate for invalid values', () => {
    const mockEvent = { valor: 5, accion: 'cont' }; // Assuming PANTA_PASOS has less than 5 steps
    jest.spyOn(component.wizardComponent, 'siguiente');
    jest.spyOn(component.wizardComponent, 'atras');
  
    component.getValorIndice(mockEvent);
  
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should handle invalid tab index gracefully', () => {
    component.pestanaCambiado(undefined as any);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

  it('should update indiceDePestanaSeleccionada', () => {
    component.pestanaCambiado(3);
    expect(component.indiceDePestanaSeleccionada).toBe(3);
  });
  
});
