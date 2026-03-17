import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { PasoUnoComponent } from './paso-uno.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

class MockSolicitud32513Store {}
class MockSolicitud32513Query {}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        PasoUnoComponent,
        SolicitanteComponent,
      ],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: 'Solicitud32513Store', useClass: MockSolicitud32513Store },
        { provide: 'Solicitud32513Query', useClass: MockSolicitud32513Query },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('should enable isEnableModificacionTab when tipoDeEndosoChanges is called with 3', () => {
    component.tipoDeEndosoChanges(3);
    expect(component.isEnableModificacionTab).toBe(true);
  });

  it('should disable isEnableModificacionTab when tipoDeEndosoChanges is called with a value other than 3', () => {
    component.tipoDeEndosoChanges(2);
    expect(component.isEnableModificacionTab).toBe(false);

    component.tipoDeEndosoChanges(0);
    expect(component.isEnableModificacionTab).toBe(false);

    component.tipoDeEndosoChanges('test');
    expect(component.isEnableModificacionTab).toBe(false);
  });
});
