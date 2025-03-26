import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { UsuarioFormClienteComponent } from './components/usuario/usuario-form-cliente/usuario-form-cliente.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { estadoResolver } from './components/estado/estado-resolver';
import { UsuarioFormFuncionarioComponent } from './components/usuario/usuario-form-funcionario/usuario-form-funcionario.component';
import { FornecedorListComponent } from './components/fornecedores/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedores/fornecedor-form/fornecedor-form.component';

export const routes: Routes = [
    { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados' },
    { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' },
    { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: { estado: estadoResolver } },
    { path: 'usuarios/new', component: UsuarioFormClienteComponent, title: 'Novo Cliente' },
    { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios' },
    { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município' },
    { path: 'usuarios-funcionario/new', component: UsuarioFormFuncionarioComponent, title: 'Novo Funcionario' },
    { path: 'fornecedores', component: FornecedorListComponent },
    { path: 'fornecedores/new', component: FornecedorFormComponent },
    { path: 'fornecedores/edit/:id', component: FornecedorFormComponent },
];