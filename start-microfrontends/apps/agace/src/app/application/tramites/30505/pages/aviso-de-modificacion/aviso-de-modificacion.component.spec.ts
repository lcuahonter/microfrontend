import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import {AvisoDeModificacionComponent} from './aviso-de-modificacion.component';
import { WizardComponent,BtnContinuarComponent,SolicitanteComponent } from '@ng-mf/data-access-user';

describe('AvisoDeModificacionComponent', () => {
  let component: AvisoDeModificacionComponent;
  let fixture: ComponentFixture<AvisoDeModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule,WizardComponent,BtnContinuarComponent,SolicitanteComponent],
      declarations: [
        AvisoDeModificacionComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoDeModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indice with 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: component.pasos.length,
      indice: component.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should update indice and call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    const SPY = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(SPY).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras on getValorIndice with accion "atras"', () => {
    const SPY = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'atras', valor: 0 });
    expect(component.indice).toBe(0);
    expect(SPY).toHaveBeenCalled();
  });

  it('should call ngOnInit and initialize variables correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
  });
});
