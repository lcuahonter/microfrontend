import { Tramite140111State,Tramite140111Store } from "./tramite140111.store";
import { Injectable} from "@angular/core";
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite140111Query extends Query <Tramite140111State> {


  selectTramite140111$= this.select((state) => {
    return state;
  });


  constructor(
    protected override store: Tramite140111Store) {
    super(store);
  }
}