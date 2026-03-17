import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBusquedaComponent } from './datos-busqueda.component';

describe('DatosBusquedaComponent', () => {
  let component: DatosBusquedaComponent;
  let fixture: ComponentFixture<DatosBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
