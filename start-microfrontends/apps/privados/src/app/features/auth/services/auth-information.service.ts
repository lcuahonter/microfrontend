import { Injectable } from '@angular/core';

interface AuthInfo {
  rfc: string;
  name: string;
  subrol: string;
  rol: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthInformationService {
  authInfo: AuthInfo = {
    rfc: 'AAL0409235E6',
    name: 'MIGUEL ANGEL CRUZ CANCHE',
    rol: 'funcionario',
    subrol: 'aduanaCentraLocal',
  };
}
