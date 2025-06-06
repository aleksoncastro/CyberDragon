import { Component, OnInit } from "@angular/core";
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule, NgIf } from "@angular/common";
import { Pedido } from "../../../models/pedido.model";
import { PedidoService } from "../../../services/pedido.service";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";


@Component({
  selector: "app-user-profile",
  imports: [CommonModule, MatIconModule, RouterModule, NgIf],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  breadcrumbs: Array<{ label: string; url: string }> = [];

  usuario!: Cliente;
  activeSection: string = 'conta';
  pedidos: Pedido[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;


  constructor(private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private usuarioService: UsuarioService
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

  getImagemUrl(): string | null {
    const imagens = this.usuario?.listaImagem;
    if (imagens && imagens.length > 0) {
      // Adiciona timestamp para forçar recarregamento da imagem
      return this.usuarioService.getImagemUrl(imagens[0]) + '?t=' + new Date().getTime();
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Criar URL para mostrar prévia
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImagem(): void {
    if (!this.selectedFile || !this.usuario?.id) return;

    this.usuarioService.uploadImage(this.usuario.id, this.selectedFile.name, this.selectedFile).subscribe({
      next: (response) => {
        console.log('Imagem enviada com sucesso', response);
        // Recarrega o usuário para atualizar a imagem do backend
        this.clienteService.findByMe().subscribe({
          next: (data) => {
            this.usuario = data;
            this.selectedFile = null;
            this.previewUrl = null;
          },
          error: (err) => {
            console.error('Erro ao recarregar usuário após upload', err);
            // Mesmo com erro, limpar pra não travar UI
            this.selectedFile = null;
            this.previewUrl = null;
          }
        });
      },
      error: (err) => {
        console.error('Erro ao enviar imagem', err);
      }
    });
  }

  deletarImagem(): void {
    if (!this.usuario?.id || !this.usuario.listaImagem?.length) return;

    // Usando o primeiro nome de imagem do usuário, ajuste se necessário
    const nomeImagem = this.usuario.listaImagem[0];

    this.usuarioService.deleteImage(this.usuario.id, nomeImagem).subscribe({
      next: () => {
        console.log('Imagem deletada com sucesso');
        this.reloadUsuario();
      },
      error: (err) => {
        console.error('Erro ao deletar imagem', err);
      }
    });
  }

  reloadUsuario(): void {
    this.clienteService.findByMe().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Erro ao recarregar usuário', err);
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getFirstName(): string {
    return this.usuario?.nome?.split(" ")[0] ?? '';
  }
}
