import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionSeguridadComponent } from './capacitacion-seguridad.component';

describe('CapacitacionSeguridadComponent', () => {
  let component: CapacitacionSeguridadComponent;
  let fixture: ComponentFixture<CapacitacionSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacitacionSeguridadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});