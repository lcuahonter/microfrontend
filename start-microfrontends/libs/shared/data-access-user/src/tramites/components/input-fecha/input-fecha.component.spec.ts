import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFechaComponent } from './input-fecha.component';
import { InputFecha } from '../../../core/models/shared/components.model';

describe('InputFechaComponent', () => {
  let component: InputFechaComponent;
  let fixture: ComponentFixture<InputFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFechaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputFechaComponent);
    component = fixture.componentInstance;
     component.datos = {
      labelNombre: 'Fecha',
      required: false,
      habilitado: true,
    } as InputFecha;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
