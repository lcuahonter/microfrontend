import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadPersonalComponent } from './seguridad-personal.component';

describe('SeguridadPersonalComponent', () => {
  let component: SeguridadPersonalComponent;
  let fixture: ComponentFixture<SeguridadPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
});
