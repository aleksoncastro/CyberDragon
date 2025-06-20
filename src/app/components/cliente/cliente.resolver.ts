import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { Cliente } from "../../models/cliente.model";
import { ClienteService } from "../../services/cliente.service";

@Injectable({ providedIn: 'root' })
export class ClienteResolver implements Resolve<Cliente> {
  constructor(private clienteService: ClienteService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Cliente> {
    const id = route.paramMap.get('id');
    return id ? this.clienteService.findById(id) : of({} as Cliente);
  }
}
