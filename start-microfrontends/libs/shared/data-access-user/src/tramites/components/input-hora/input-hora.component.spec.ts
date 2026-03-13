import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHoraComponent } from './input-hora.component';

describe('InputHoraComponent', () => {
  let component: InputHoraComponent;
  let fixture: ComponentFixture<InputHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputHoraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
