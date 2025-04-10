import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Lote } from '../../models/lote.model';
import { LoteService } from '../../services/lote.service';
import { map } from 'rxjs';

export const loteResolver: ResolveFn<Lote> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(LoteService).findById(route.paramMap.get('id')!).pipe(
      map(lote => ({
        ...lote,
        idPlacaDeVideo: lote.placaDeVideo?.id ?? 0 
      }))
    );
};