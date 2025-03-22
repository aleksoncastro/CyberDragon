import { Component, OnInit } from '@angular/core';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  templateUrl: './municipio-list.component.html',
  styleUrl: './municipio-list.component.css'
})
export class MunicipioListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acao'];
  municipios: Municipio[] = [];


  constructor(private municipioService: MunicipioService) {}

  ngOnInit(): void {
    this.municipioService.findAll().subscribe(data => {
      this.municipios = data;
    });
  }
}
