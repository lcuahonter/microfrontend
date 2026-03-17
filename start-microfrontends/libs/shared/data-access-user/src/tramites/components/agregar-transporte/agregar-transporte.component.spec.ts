import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTransporteComponent } from './agregar-transporte.component';

describe('AgregarTransporteComponent', () => {
  let component: AgregarTransporteComponent;
  let fixture: ComponentFixture<AgregarTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarTransporteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
