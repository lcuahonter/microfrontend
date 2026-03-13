import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
        PasoUnoComponent
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
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('should enable isEnableModificacionTab when tipoDeEndosoChanges is called with 3', () => {
    component.tipoDeEndosoChanges(3);
    expect(component.isEnableModificacionTab).toBe(3);
  });

  it('should disable isEnableModificacionTab when tipoDeEndosoChanges is called with a value other than 3', () => {
    component.tipoDeEndosoChanges(2);
    expect(component.isEnableModificacionTab).toBe(2);

    component.tipoDeEndosoChanges(0);
    expect(component.isEnableModificacionTab).toBe(0);

    component.tipoDeEndosoChanges('test');
    expect(component.isEnableModificacionTab).toBe('test');
  });
});
