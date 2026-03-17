import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementarFraccionVistaComponent } from './complementar-fraccion-vista.component';

describe('ComplementarFraccionVistaComponent', () => {
  let component: ComplementarFraccionVistaComponent;
  let fixture: ComponentFixture<ComplementarFraccionVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementarFraccionVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplementarFraccionVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});