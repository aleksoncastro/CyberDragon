import { Component, OnInit } from "@angular/core";
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { Pedido } from "../../../models/pedido.model";
import { PedidoService } from "../../../services/pedido.service";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatMenuModule } from "@angular/material/menu";


@Component({
  selector: "app-user-profile",
  imports: [CommonModule, MatIconModule, RouterModule, MatMenuModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  breadcrumbs: Array<{ label: string; url: string }> = [];

  usuario!: Cliente;
  activeSection: string = 'conta';
  pedidos: Pedido[] = [];
  imagemUrl: string = '';
  fileName: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.clienteService.findByMe().subscribe({
      next: data => {
        console.log("Usuário carregado:", data);
        this.usuario = data;
        
        const imagens = this.usuario?.usuario?.listaImagem;

        if (imagens && imagens.length > 0) {
          const nomeImagem = imagens[0];
          this.imagemUrl = this.usuarioService.getImagemUrl(nomeImagem);
        }
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

  carregarImagemSelecionada(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processarArquivo(file);

      if (this.usuario?.usuario?.id) {
        this.uploadImage(this.usuario.usuario.id);
      }
    }
  }

  processarArquivo(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      this.snackbarService.showError(
        'Arquivo muito grande. O tamanho máximo é 10MB.'
      );
      return;
    }

    this.fileName = file.name;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagemUrl = reader.result as string; // ✅ Aqui atualiza a imagem de pré-visualização
    };
    reader.readAsDataURL(file);
  }

  private uploadImage(usuarioId: number) {
    if (this.selectedFile) {
      this.isUploading = true;

      this.usuarioService
        .uploadImage(usuarioId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: (usuarioAtualizado) => {
            this.snackbarService.showSuccess('Imagem enviada com sucesso');

            if (usuarioAtualizado?.listaImagem?.length > 0) {
              this.usuario.listaImagem = usuarioAtualizado.listaImagem;
              this.imagemUrl = usuarioAtualizado.listaImagem[0];
            }

            this.isUploading = false;
          },
          error: (err) => {
            console.log('Erro ao fazer o upload da imagem', err);
            this.snackbarService.showError('Erro ao enviar a imagem');
            this.isUploading = false;
          },
        });
    }
  }


  removerImagem() {
    this.imagemUrl = 'null';

    if (this.usuario?.listaImagem?.length) {
      this.usuario.listaImagem[0] = '';
    }

    this.snackbarService.showSuccess('Imagem removida com sucesso');
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
