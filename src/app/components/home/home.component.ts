import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatInputModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  summary = [
    { title: 'Funcionários', value: '12 ativos', icon: 'supervisor_account' },
    { title: 'Fornecedores', value: '5 cadastrados', icon: 'business' },
    { title: 'Placas de Vídeo', value: '28 registradas', icon: 'memory' },
    { title: 'Lotes', value: '3 em estoque', icon: 'inventory_2' }
  ];

  modules = [
    {
      name: 'Funcionários',
      description: 'Gerencie a equipe da empresa.',
      icon: 'supervisor_account',
      link: '/admin/funcionarios'
    },
    {
      name: 'Fornecedores',
      description: 'Cadastro e gerenciamento de fornecedores.',
      icon: 'business',
      link: '/admin/fornecedores'
    },
    {
      name: 'Placas de Vídeo',
      description: 'Controle de produtos e especificações.',
      icon: 'memory',
      link: '/admin/placasdevideo'
    },
    {
      name: 'Lotes',
      description: 'Gestão de entradas e saídas.',
      icon: 'inventory_2',
      link: '/admin/lotes'
    },
    {
      name: 'Estados e Municípios',
      description: 'Dados de localização utilizados nos cadastros.',
      icon: 'location_city',
      link: '/admin/municipios'
    }
  ];
}
