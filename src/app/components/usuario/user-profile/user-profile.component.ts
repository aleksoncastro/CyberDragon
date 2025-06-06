import { Component, OnInit } from "@angular/core";
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { Pedido } from "../../../models/pedido.model";
import { PedidoService } from "../../../services/pedido.service";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterModule } from "@angular/router";


@Component({
  selector: "app-user-profile",
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  breadcrumbs: Array<{ label: string; url: string }> = [];

  usuario!: Cliente;
  activeSection: string = 'conta';
  pedidos: Pedido[] = [];


  constructor(private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.clienteService.findByMe().subscribe({
      next: data => {
        console.log("Usuário carregado:", data);
        this.usuario = data;
        this.carregarPedidos();
      },
      error: err => {
        console.error("Erro ao carregar usuário", err);
      }
    });
  }
  carregarPedidos(): void {
    this.pedidoService.findByUsername().subscribe({
      next: data => {
        console.log("Pedidos: ", data)
        this.pedidos = data;
      },
      error: err => {
        console.error("Erro ao carregar pedidos", err);
      }
    });
  }

  getTipoPagamentoLabel(tipo: number): string {
    switch (tipo) {
      case 1:
        return 'PIX';
      case 2:
        return 'Boleto';
      case 3:
        return 'Cartão de Crédito';
      default:
        return 'Desconhecido';
    }
  }


  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string; url: string }> = []): Array<{ label: string; url: string }> {
    let children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;

        const label = child.snapshot.data['breadcrumb'] || routeURL;

        breadcrumbs.push({ label, url });
      }
      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  getUltimoStatus(pedido: Pedido): string {
  if (pedido.statusPedido && pedido.statusPedido.length > 0) {
    return pedido.statusPedido[pedido.statusPedido.length - 1].status.label;
  }
  return 'Status não disponível';
}



  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getFirstName(): string {
    return this.usuario?.nome?.split(" ")[0] ?? '';
  }
}
