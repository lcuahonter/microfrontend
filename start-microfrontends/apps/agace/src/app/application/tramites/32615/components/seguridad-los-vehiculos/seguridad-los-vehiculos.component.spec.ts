import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadLosVehiculosComponent } from './seguridad-los-vehiculos.component';

describe('SeguridadLosVehiculosComponent', () => {
  let component: SeguridadLosVehiculosComponent;
  let fixture: ComponentFixture<SeguridadLosVehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadLosVehiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadLosVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
