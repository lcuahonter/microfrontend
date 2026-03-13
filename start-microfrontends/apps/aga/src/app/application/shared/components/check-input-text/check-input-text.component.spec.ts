import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInputTextComponent } from './check-input-text.component';

describe('CheckInputTextComponent', () => {
  let component: CheckInputTextComponent;
  let fixture: ComponentFixture<CheckInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInputTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Creación del componente', () => {
    expect(component).toBeTruthy();
  });
});
