import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PlacaDeVideoService } from '../../services/placadevideo.service';
import { PlacaDeVideo } from '../../models/placadevideo.model';

export const placadevideoResolver: ResolveFn<PlacaDeVideo> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(PlacaDeVideoService).findById(route.paramMap.get('id')!);
  };
