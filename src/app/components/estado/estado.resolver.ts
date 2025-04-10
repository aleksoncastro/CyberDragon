import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { EstadoService } from '../../services/estado.service';
import { Estado } from '../../models/estado.model';

export const estadoResolver: ResolveFn<Estado> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(EstadoService).findById(route.paramMap.get('id')!);
  };
