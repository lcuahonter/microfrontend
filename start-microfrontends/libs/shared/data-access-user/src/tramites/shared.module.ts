import { NgModule,forwardRef } from '@angular/core';
import { InputCheckComponent } from './components/input-check/input-check.component';

@NgModule({
  declarations: [
  ],
  imports: [
    forwardRef(() =>InputCheckComponent),    
   ],
  exports: [
  ]
})
export class SharedModule { }
