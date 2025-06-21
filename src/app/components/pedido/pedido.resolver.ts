import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { PedidoADMService } from '../../services/pedidoADM.service';


export const pedidoResolver: ResolveFn<Pedido> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // Convertendo o ID para número
    const id = Number(route.paramMap.get('id'));
    
    // Verificando se a conversão foi bem-sucedida antes de chamar o serviço
    if (isNaN(id)) {
      throw new Error('ID inválido');
    }

    // Chamando o método findById com o id convertido para número
    return inject(PedidoADMService).findById(id);
  };
