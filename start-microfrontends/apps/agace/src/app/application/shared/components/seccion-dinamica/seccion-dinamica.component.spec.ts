import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionDinamicaComponent } from './seccion-dinamica.component';
import { Component, Type, ViewContainerRef } from '@angular/core';
import { SeccionDinamica } from '@libs/shared/data-access-user/src/core/models/shared/seccion-dinamica.model';

@Component({
  standalone: true,
  template: '<p>Mock dynamic component</p>',
})
class MockDynamicComponent {}

describe('SeccionDinamicaComponent', () => {
  let component: SeccionDinamicaComponent;
  let fixture: ComponentFixture<SeccionDinamicaComponent>;
  const mockSecciones: SeccionDinamica[] = [
    {
      titulo: 'Sección 1',
      componentClase: MockDynamicComponent as Type<unknown>,
    },
    {
      titulo: 'Sección 2',
      componentClase: MockDynamicComponent as Type<unknown>,
    },
  ];
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionDinamicaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeccionDinamicaComponent);
    component = fixture.componentInstance;
    component.secciones = mockSecciones;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a section and load component', async () => {
    const mockViewContainerRef: Partial<ViewContainerRef> = {
      clear: jest.fn(),
      createComponent: jest.fn(),
    };
    component['contenedores'] = {
      get: jest.fn().mockReturnValue(mockViewContainerRef),
    } as any;
    component.acordeonAbierto(0);
    await new Promise(resolve => setTimeout(resolve));
    expect(component.indiceAbierto).toBe(0);
    expect(mockViewContainerRef.clear).toHaveBeenCalled();
    expect(mockViewContainerRef.createComponent).toHaveBeenCalledWith(MockDynamicComponent);
  });
});
