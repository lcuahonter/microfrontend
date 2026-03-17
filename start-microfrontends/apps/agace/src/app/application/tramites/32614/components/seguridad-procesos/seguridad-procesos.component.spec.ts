import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadProcesosComponent } from './seguridad-procesos.component';

describe('SeguridadProcesosComponent', () => {
  let component: SeguridadProcesosComponent;
  let fixture: ComponentFixture<SeguridadProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadProcesosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
