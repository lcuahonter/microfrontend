import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { CancelacionComponent } from '../../components/cancelacion/cancelacion.component';
import { HttpClientModule } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [SolicitanteComponent, CancelacionComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice and emit event when seleccionaTab is called', () => {
    const spyEmit = jest.spyOn(component.pestanaCambiado, 'emit');
    const newIndex = 3;
  
    component.seleccionaTab(newIndex);
  
    expect(component.indice).toBe(newIndex);
    expect(spyEmit).toHaveBeenCalledWith(newIndex);
  });

  it('should handle invalid indice gracefully', () => {
    const spyEmit = jest.spyOn(component.pestanaCambiado, 'emit');
    const invalidIndex = NaN;
  
    component.seleccionaTab(invalidIndex);
  
    expect(component.indice).toBe(NaN);
    expect(spyEmit).toHaveBeenCalledWith(invalidIndex);
  });

  it('should emit the pestanaCambiado event with correct value', (done) => {
    const newIndex = 2;
  
    component.pestanaCambiado.subscribe((value) => {
      expect(value).toBe(newIndex);
      done();
    });
  
    component.seleccionaTab(newIndex);
  });
  
});
