import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoImmexVistaComponent } from './proyecto-immex-vista.component';

describe('ProyectoImmexVistaComponent', () => {
  let component: ProyectoImmexVistaComponent;
  let fixture: ComponentFixture<ProyectoImmexVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoImmexVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoImmexVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});