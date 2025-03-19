import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { UsuarioFormClienteComponent } from './components/usuario/usuario-form-cliente/usuario-form-cliente.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';

export const routes: Routes = [
    {path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
    {path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
    {path: 'usuarios/new', component: UsuarioFormClienteComponent, title: 'Novo Cliente'},
    {path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios'},
    {path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município'},
];