import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosComercialesComponent } from './socios-comerciales.component';

describe('SociosComercialesComponent', () => {
  let component: SociosComercialesComponent;
  let fixture: ComponentFixture<SociosComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosComercialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
