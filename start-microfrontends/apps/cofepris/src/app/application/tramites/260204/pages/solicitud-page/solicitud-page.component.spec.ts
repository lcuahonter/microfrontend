import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { AccionBoton } from '@ng-mf/data-access-user';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct title and index', () => {
    expect(component.tituloMensaje).toBe(
      'Permiso sanitario de importación de medicamentos con registro sanitario'
    );
    expect(component.indice).toBe(1);
  });

  it('should change index with seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update index and title with getValorIndice (cont)', () => {
    // Mock wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.tituloMensaje).toBe('Anexar requisitos');
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update index and title with getValorIndice (atras)', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accion: AccionBoton = { valor: 1, accion: 'atras' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.tituloMensaje).toBe(
      'Permiso sanitario de importación de medicamentos con registro sanitario'
    );
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('obtenerNombreDelTítulo should return correct titles', () => {
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(1)).toBe(
      'Permiso sanitario de importación de medicamentos con registro sanitario'
    );
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(2)).toBe(
      'Anexar requisitos'
    );
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(3)).toBe(
      'Firmar solicitud'
    );
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(99)).toBe(
      'Permiso sanitario de importación de medicamentos con registro sanitario'
    );
  });
});
