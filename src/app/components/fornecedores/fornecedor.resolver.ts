import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../models/fornecedor.model';

export const fornecedorResolver: ResolveFn<Fornecedor> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // Convertendo o ID para número
    const id = Number(route.paramMap.get('id'));
    
    // Verificando se a conversão foi bem-sucedida antes de chamar o serviço
    if (isNaN(id)) {
      throw new Error('ID inválido');
    }

    // Chamando o método findById com o id convertido para número
    return inject(FornecedorService).findById(id);
  };
