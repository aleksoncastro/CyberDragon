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
import { PlacadevideoListComponent } from './components/placadevideo/placadevideo-list/placadevideo-list.component';
import { PlacaDeVideoFormComponent } from './components/placadevideo/placadevideo-form/placadevideo-form.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';

export const routes: Routes = [

    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administrativo',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'estados' },
            { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados' },
            { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' },
            { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: { estado: estadoResolver } },
            { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios' },
            { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município' },
            { path: 'usuarios-funcionario/new', component: UsuarioFormFuncionarioComponent, title: 'Novo Funcionario' },
            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores' },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor' },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, title: 'Edit de Fornecedor' },
            { path: 'placasdevideo', component: PlacadevideoListComponent, title: 'Lista de Placas de Video' },
            { path: 'placasdevideo/new', component: PlacaDeVideoFormComponent, title: 'Nova Placas de Video' },
            { path: 'lotes', component: LoteListComponent, title: 'Lista de Lotes' },
            { path: 'lotes/new', component: LoteFormComponent, title: 'Novo Lote' },
        ]
    },

    { path: 'usuarios/new', component: UsuarioFormClienteComponent, title: 'Novo Cliente' },

];