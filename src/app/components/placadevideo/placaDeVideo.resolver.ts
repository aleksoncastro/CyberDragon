import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PlacaDeVideoService } from '../../services/placadevideo.service';
import { PlacaDeVideo } from '../../models/placadevideo.model';

export const placadevideoResolver: ResolveFn<PlacaDeVideo> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // Convertendo o ID para número
    const id = Number(route.paramMap.get('id'));
    
    // Verificando se a conversão foi bem-sucedida antes de chamar o serviço
    if (isNaN(id)) {
      throw new Error('ID inválido');
    }

    // Chamando o método findById com o id convertido para número
    return inject(PlacaDeVideoService).findById(id);
  };
