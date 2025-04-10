import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../models/fornecedor.model';

export const fornecedorResolver: ResolveFn<Fornecedor> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(FornecedorService).findById(route.paramMap.get('id')!);
  };
