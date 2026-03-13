import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaisesComponent } from './select-paises.component';

describe('SelectPaisesComponent', () => {
  let component: SelectPaisesComponent;
  let fixture: ComponentFixture<SelectPaisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPaisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectPaisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
