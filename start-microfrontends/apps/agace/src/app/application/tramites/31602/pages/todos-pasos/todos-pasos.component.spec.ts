import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodospasosComponent } from './todos-pasos.component';
import { WizardComponent, BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { TITULO_PASO_UNO, TITULO_PASO_DOS, TITULO_PASO_TRES } from '../../services/comercio-exterior.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModalComponent } from '../../components/shared-modal/shared-modal.component';

describe('TodospasosComponent', () => {
  let component: TodospasosComponent;
  let fixture: ComponentFixture<TodospasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, HttpClientTestingModule, SolicitanteComponent,SharedModalComponent],
      declarations: [TodospasosComponent, PasoUnoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodospasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice and titulo to PASO_DOS and call siguiente on "cont"', () => {
    const accion = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(2);
    expect(component.titulo).toBe(TITULO_PASO_DOS);
    expect((component.wizardComponent.siguiente as jest.Mock)).toHaveBeenCalled();
  });

  it('should set indice and titulo to PASO_TRES and call atras on not "cont"', () => {
    const accion = { valor: 3, accion: 'back' };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(3);
    expect(component.titulo).toBe(TITULO_PASO_TRES);
    expect((component.wizardComponent.atras as jest.Mock)).toHaveBeenCalled();
  });

  it('should set indice and titulo to PASO_UNO for other values', () => {
    const accion = { valor: 1, accion: 'cont' };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(1);
    expect(component.titulo).toBe(TITULO_PASO_UNO);
    expect((component.wizardComponent.siguiente as jest.Mock)).toHaveBeenCalled();
  });

  it('should not change indice or call wizardComponent for out-of-range valor', () => {
    const initialIndice = component.indice;
    const initialTitulo = component.titulo;
    const accion = { valor: 0, accion: 'cont' };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(initialIndice);
    expect(component.titulo).toBe(initialTitulo);
    expect((component.wizardComponent.siguiente as jest.Mock)).not.toHaveBeenCalled();
    expect((component.wizardComponent.atras as jest.Mock)).not.toHaveBeenCalled();
  });

  it('should clean up destroyed$ on ngOnDestroy', () => {
    const destroyed$ = (component as any).destroyed$;
    const nextSpy = jest.spyOn(destroyed$, 'next');
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
  });
});