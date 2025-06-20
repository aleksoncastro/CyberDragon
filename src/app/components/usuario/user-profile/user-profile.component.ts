import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { ItemPedido, Pedido } from "../../../models/pedido.model";
import { PedidoService } from "../../../services/pedido.service";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatMenuModule } from "@angular/material/menu";
import { PlacaDeVideoService } from "../../../services/placadevideo.service";
import { PlacaDeVideo } from "../../../models/placadevideo.model";
import { FornecedorService } from "../../../services/fornecedor.service";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Usuario } from "../../../models/usuario.model";
import { TelefoneCliente } from "../../../models/telefone-cliente.model";
import { Endereco } from "../../../models/endereco.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogCadastrarClienteComponent } from "../dialog-cadastrar-cliente/dialog-cadastrar-cliente.component";


@Component({
  selector: "app-user-profile",
  imports: [CommonModule, MatIconModule, RouterModule, MatMenuModule, MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  breadcrumbs: Array<{ label: string; url: string }> = [];

  cliente: Cliente | null = null;
  activeSection: string = 'conta';
  pedidos: Pedido[] = [];
  imagensPorPedido: { [pedidoId: number]: string[] } = {};
  placasDoPedido: PlacaDeVideo[] = [];
  imagemUrl: string = '';
  fileName: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;
  placaItem: PlacaDeVideo | null = null;
  pedidoItem!: Pedido;
  usuario!: Usuario;
  enderecosVisiveis2: Endereco[] = [];


  placasMap: Map<number, PlacaDeVideo> = new Map();
  fornecedoresMap: Map<number, string> = new Map();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private snackbarService: SnackbarService,
    private placaService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  usuarioFinal: { nome?: string, username?: string, listaImagem?: string[] } | null = null;

  ngOnInit(): void {
  this.usuarioService.findByMe().subscribe({
    next: data => {
      console.log("Usuario carregado: ", data);
      this.usuario = data;

      // Buscar cliente pelo id do usuario
      this.clienteService.findByIdUsuario(data.id).subscribe({
        next: clienteData => {
          if (!clienteData) {
            console.warn("Cliente retornado é null");
            this.cliente = null;
          
            // Abre o diálogo
            this.dialog.open(DialogCadastrarClienteComponent, {
              width: '400px', // ajuste como quiser
              disableClose: true
            });
          
            return;
          }

          this.cliente = clienteData;

          if (!this.usuarioFinal) {
            this.usuarioFinal = this.usuario;
          }

          const imagens: string[] = data?.listaImagem ?? [];
          if (imagens.length > 0 && !this.imagemUrl) {
            const nomeImagem = imagens[0];
            this.imagemUrl = this.usuarioService.getImagemUrl(nomeImagem);
          }

          this.carregarPedidos();
          this.pedidos.forEach(pedido => this.carregarImagensDoPedido(pedido));
        },
        error: err => {
          console.error("Erro ao buscar cliente pelo id do usuário", err);
        }
      });
    },
    error: err => {
      console.error("Erro ao carregar usuário", err);
    }
  });
}

get telefonePrincipal(): TelefoneCliente | null {
  return this.cliente?.telefones?.length ? this.cliente.telefones[0] : null;
}

get enderecosVisiveis(): Endereco[] {
  return this.cliente?.enderecos?.length ? this.cliente.enderecos.slice(0, 2) : [];
}




  carregarPedidos(): void {
    this.pedidoService.findByUsername().subscribe({
      next: data => {
        console.log("Pedidos: ", data)
        this.pedidos = data;
        this.pedidos.forEach(pedido => this.carregarImagensDoPedido(pedido));
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

  getStatusClass(pedido: any): string {
    const status = this.getUltimoStatus(pedido)?.toLowerCase()

    switch (status) {
      case "pendente":
        return 'status-pendente';
      case "processando":
        return 'status-processando';
      case "enviado":
        return 'status-enviado';
      case "entregue":
        return 'status-entregue';
      case "cancelado":
        return 'status-cancelado';
      default:
        return 'status-pendente';
    }
  }

  getStatusIcon(pedido: any)
    : string {
    const status = this.getUltimoStatus(pedido)?.toLowerCase()

    switch (status) {
      case "pendente":
        return 'schedule';
      case "processando":
        return 'autorenew';
      case "enviado":
        return 'local_shipping';
      case "entregue":
        return 'check_circle';
      case "cancelado":
        return 'cancel';
      default:
        return 'help_outline';
    }
  }

  getImagensPedido(pedido: Pedido): string[] {
    if (typeof pedido.id !== 'number') return [];
    return this.imagensPorPedido[pedido.id] ?? [];
  }

  temImagensPedido(pedido: Pedido): boolean {
    if (!pedido.id) return false;
    const imagens = this.imagensPorPedido[pedido.id];
    return Array.isArray(imagens) && imagens.length > 0;
  }

  getListaItemPedido(pedido: Pedido): string {
    return pedido.listaItemPedido
      .map((item: any) => {
        const placa = this.placaService.findById(item.idProduto);
        const nome = item.nome ?? 'Modelo desconhecido';

        console.log(item);
        return `Quantidade: ${item.quantidade}x 
        Modelo: ${nome}`;
      })
      .join(', ');
  }

  getListaId(pedido: Pedido): number[] {
    return pedido.listaItemPedido.map((item: any) => item.idProduto);
  }

  verDetalhes(pedido: Pedido): void {
    const ids = this.getListaId(pedido);
    const idItem = ids[0]; // usa o primeiro ID da lista

    if (idItem != null) {
      this.router.navigate(['placadevideo-detail', idItem]);
    } else {
      console.error('Nenhum ID de placa de vídeo encontrado no pedido.');
    }
  }


  carregarImagensDoPedido(pedido: Pedido): void {
    const ids = pedido.listaItemPedido.map((item: any) => item.idProduto);

    ids.forEach(id => {
      this.placaService.findById(id).subscribe(placa => {
        if (!this.imagensPorPedido[pedido.id!]) {
          this.imagensPorPedido[pedido.id!] = [];
        }

        // Pega só a imagem da posição 0 (se existir)
        const primeiraImagem = placa.listaImagem?.[0];
        if (primeiraImagem) {
          const url = this.placaService.getImagemUrl(primeiraImagem);
          this.imagensPorPedido[pedido.id!].push(url);
        }
      });
    });
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

      if (this.usuario?.id) {
        this.uploadImage(this.usuario.id);
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
    return this.usuario?.username?.split(" ")[0] ?? '';
  }



}
