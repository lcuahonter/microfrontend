import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadFisicaComponent } from './seguridad-fisica.component';

describe('SeguridadFisicaComponent', () => {
  let component: SeguridadFisicaComponent;
  let fixture: ComponentFixture<SeguridadFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadFisicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
