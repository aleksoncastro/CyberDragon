import { Routes } from '@angular/router';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/estado.resolver';
import { FornecedorFormComponent } from './components/fornecedores/fornecedor-form/fornecedor-form.component';
import { FornecedorListComponent } from './components/fornecedores/fornecedor-list/fornecedor-list.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { loteResolver } from './components/lote/lote.resolver';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { PlacaDeVideoFormComponent } from './components/placadevideo/placadevideo-form/placadevideo-form.component';
import { PlacadevideoListComponent } from './components/placadevideo/placadevideo-list/placadevideo-list.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UsuarioFormClienteComponent } from './components/usuario/usuario-form-cliente/usuario-form-cliente.component';
import { UsuarioFormFuncionarioComponent } from './components/usuario/usuario-form-funcionario/usuario-form-funcionario.component';
import { fornecedorResolver } from './components/fornecedores/fornecedor.resolver';
import { municipioResolver } from './components/municipio/municipio.resolver';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { PlacadevideoVitrineComponent } from './components/placadevideo/placadevideo-vitrine/placadevideo-vitrine.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { placadevideoResolver } from './components/placadevideo/placaDeVideo.resolver';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { PlacaCardListComponent } from './components/cards/placa-card-list/placa-card-list.component';

export const routes: Routes = [
    
    
    {
        path: '',
        component: UserTemplateComponent,
        title: 'E-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'placa-card-list' },
            { path: 'placa-card-list', component: PlacaCardListComponent , title: 'Cards de Placa' },
            { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados' },
            { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' },
            { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: { estado: estadoResolver } },
            { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios' },
            { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município' },
            { path: 'municipios/edit/:id', component: MunicipioFormComponent, title: 'Edit de Municipio', resolve: { municipio: municipioResolver } },
            { path: 'usuarios-funcionario/new', component: UsuarioFormFuncionarioComponent, title: 'Novo Funcionario' },
            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores' },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor' },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, title: 'Edit de Fornecedor', resolve: { fornecedor: fornecedorResolver } },
            { path: 'placasdevideo', component: PlacadevideoListComponent, title: 'Lista de Placas de Video' },
            { path: 'placasdevideo/new', component: PlacaDeVideoFormComponent, title: 'Nova Placa de Video' },
            { path: 'placasdevideo/edit/:id', component: PlacaDeVideoFormComponent, title: 'Edição de Placas de Video', resolve: {placadevideo : placadevideoResolver} },
            { path: 'lotes', component: LoteListComponent, title: 'Lista de Lotes' },
            { path: 'lotes/new', component: LoteFormComponent, title: 'Novo Lote' },
            { path: 'lotes/edit/:id', component: LoteFormComponent, title: 'Edição de Lote', resolve: { lote: loteResolver }},
            { path: 'funcionarios', component: FuncionarioListComponent, title: 'Novo Funcionário' },
            { path: 'home', component: HomeComponent, title: 'Painel Administrativo' },
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administrativo',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados' },
            { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' },
            { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: { estado: estadoResolver } },
            { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios' },
            { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município' },
            { path: 'municipios/edit/:id', component: MunicipioFormComponent, title: 'Edit de Municipio', resolve: { municipio: municipioResolver } },
            { path: 'usuarios-funcionario/new', component: UsuarioFormFuncionarioComponent, title: 'Novo Funcionario' },
            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores' },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor' },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, title: 'Edit de Fornecedor', resolve: { fornecedor: fornecedorResolver } },
            { path: 'placasdevideo', component: PlacadevideoListComponent, title: 'Lista de Placas de Video' },
            { path: 'placasdevideo/new', component: PlacaDeVideoFormComponent, title: 'Nova Placa de Video' },
            { path: 'placasdevideo/edit/:id', component: PlacaDeVideoFormComponent, title: 'Edição de Placas de Video', resolve: {placadevideo : placadevideoResolver} },
            { path: 'lotes', component: LoteListComponent, title: 'Lista de Lotes' },
            { path: 'lotes/new', component: LoteFormComponent, title: 'Novo Lote' },
            { path: 'lotes/edit/:id', component: LoteFormComponent, title: 'Edição de Lote', resolve: { lote: loteResolver }},
            { path: 'funcionarios', component: FuncionarioListComponent, title: 'Novo Funcionário' },
            { path: 'home', component: HomeComponent, title: 'Painel Administrativo' },
        ]
    },

    { path: 'usuarios/new', component: UsuarioFormClienteComponent, title: 'Novo Cliente' },
    { path: 'placas-vitrine', component: PlacadevideoVitrineComponent, title: 'Lista de Placas de Video' },

    { path: '**', component: NotFoundComponent, title: 'Página não encontrada' }

];