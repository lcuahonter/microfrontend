import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDeFraccionesComponent } from './carga-de-fracciones.component';

describe('CargaDeFraccionesComponent', () => {
  let component: CargaDeFraccionesComponent;
  let fixture: ComponentFixture<CargaDeFraccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaDeFraccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaDeFraccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
