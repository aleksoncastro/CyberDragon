import { Component, type OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { CommonModule, NgIf } from "@angular/common"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatSelectModule } from "@angular/material/select"
import { MatCardModule } from "@angular/material/card"
import { ItemCarrinho } from "../../../models/item-carrinho"
import { Endereco } from "../../../models/endereco.model"
import { Cliente } from "../../../models/cliente.model"
import { Pedido } from "../../../models/pedido.model"
import { CarrinhoService } from "../../../services/carrinho.service"
import { ClienteService } from "../../../services/cliente.service"
import { PedidoService } from "../../../services/pedido.service"

@Component({
  selector: "app-pedido-pagamento",
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: "./pedido-pagamento.component.html",
  styleUrls: ["./pedido-pagamento.component.css"],
})
export class PedidoPagamentoComponent implements OnInit {
  carrinhoItens: ItemCarrinho[] = []
  enderecos: Endereco[] = []
  cliente!: Cliente
  pedidoCriado!: Pedido
  pedidoLast!: Pedido

  pagamentoForm!: FormGroup
  activeSection = "payment" // payment, pix, boleto, card, receipt

  // PIX
  pixQrCode = ""
  pixCopiaECola = ""
  pixTimer = 300 // 5 minutos
  pixInterval: any

  // Boleto
  boletoNumero = ""
  boletoVencimento = ""
  boletoCodigoBarras = ""

  constructor(
    private fb: FormBuilder,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carrinhoItens = this.carrinhoService.obter()

    this.pagamentoForm = this.fb.group({
      enderecoId: [null, Validators.required],
      tipoPagamento: [null, Validators.required],
    })

    this.clienteService.findByMe().subscribe({
      next: (cliente) => {
        this.cliente = cliente
        this.enderecos = cliente.enderecos || []
        if (this.enderecos.length > 0) {
          this.pagamentoForm.patchValue({ enderecoId: this.enderecos[0].id })
        }
      },
      error: (err) => {
        console.error("Erro ao buscar cliente:", err)
      },
    })

  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  obterIdCartaoSelecionado(): number {
    return 123
  }





  confirmarPagamento() {
    if (this.pagamentoForm.invalid) {
      this.pagamentoForm.markAllAsTouched()
      alert("Preencha todos os campos obrigatórios.")
      return
    }

    const tipoPagamentoSelecionado: number = Number.parseInt(this.pagamentoForm.get("tipoPagamento")?.value)

    // Redirecionar para a tela específica do método de pagamento
    switch (tipoPagamentoSelecionado) {
      case 1: // PIX
        this.iniciarPagamentoPix()
        break
      case 2: // Boleto
        this.iniciarPagamentoBoleto()
        break
      case 3: // Cartão
        this.iniciarPagamentoCartao()
        break
    }
  }

  iniciarPagamentoPix() {
    // Simular geração do PIX
    this.pixCopiaECola = this.gerarCopiaCola()
    this.activeSection = "pix"
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ou 'auto'

    // Iniciar timer
    this.iniciarTimerPix()
  }

  iniciarPagamentoBoleto() {
    // Simular geração do boleto
    this.boletoNumero = this.gerarNumeroBoleto()
    this.boletoVencimento = this.gerarDataVencimento()
    this.boletoCodigoBarras = this.gerarCodigoBarras()
    this.activeSection = "boleto"
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ou 'auto'
  }

  iniciarPagamentoCartao() {
    // Para cartão, vai direto para processamento
    this.processarPedido()
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ou 'auto'
  }



  gerarCopiaCola(): string {
    const valor = this.calcularTotal().toFixed(2).replace(".", "")
    return `00020126580014BR.GOV.BCB.PIX0136${this.gerarChavePix()}520400005303986540${valor.padStart(10, "0")}5802BR5925LOJA PLACAS DE VIDEO LTDA6009SAO PAULO62070503***6304${this.gerarCrc()}`
  }

  gerarChavePix(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  gerarCrc(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase()
  }

  gerarNumeroBoleto(): string {
    return `${Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0")}.${Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, "0")} ${Math.floor(Math.random() * 99999)
          .toString()
          .padStart(5, "0")}.${Math.floor(Math.random() * 999999)
            .toString()
            .padStart(6, "0")} ${Math.floor(Math.random() * 99999)
              .toString()
              .padStart(5, "0")}.${Math.floor(Math.random() * 999999)
                .toString()
                .padStart(6, "0")} ${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 99999999999999)
                  .toString()
                  .padStart(14, "0")}`
  }

  gerarDataVencimento(): string {
    const hoje = new Date()
    hoje.setDate(hoje.getDate() + 3)
    return hoje.toLocaleDateString("pt-BR")
  }

  gerarCodigoBarras(): string {
    return Math.floor(Math.random() * 99999999999999999999999999999999999999999999)
      .toString()
      .padStart(44, "0")
  }

  iniciarTimerPix() {
    this.pixInterval = setInterval(() => {
      this.pixTimer--
      if (this.pixTimer <= 0) {
        clearInterval(this.pixInterval)
        alert("Tempo para pagamento PIX expirado. Gerando novo código...")
        this.pixTimer = 300
        this.pixCopiaECola = this.gerarCopiaCola()
        this.iniciarTimerPix()
      }
    }, 1000)
  }

  formatarTempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  copiarCodigoPixParaClipboard() {
    navigator.clipboard.writeText(this.pixCopiaECola).then(() => {
      alert("Código PIX copiado para a área de transferência!")
    })
  }

  confirmarPagamentoPix() {
    if (this.pixInterval) {
      clearInterval(this.pixInterval)
    }
    this.processarPedido()
  }

  confirmarPagamentoBoleto() {
    this.processarPedido()
  }

  processarPedido() {
    const enderecoIdSelecionado: number = this.pagamentoForm.get("enderecoId")?.value
    const tipoPagamentoSelecionado: number = Number.parseInt(this.pagamentoForm.get("tipoPagamento")?.value)

    const enderecoSelecionado = this.enderecos.find((e) => e.id === enderecoIdSelecionado)

    if (!enderecoSelecionado) {
      alert("Endereço inválido.")
      return
    }

    const itensPedido = this.carrinhoItens.map((item) => ({
      idProduto: item.id,
      quantidade: item.quantidade,
    }))

    const idCartao = tipoPagamentoSelecionado === 3 ? this.obterIdCartaoSelecionado() : 0

    const pedido = {
      valorTotal: this.calcularTotal(),
      listaItemPedido: itensPedido,
      idEndereco: enderecoIdSelecionado,
      tipoPagamento: tipoPagamentoSelecionado,
      idCartao: idCartao,
    }

    console.log("Enviando pedido com dados:", pedido);

    this.pedidoService.create(pedido).subscribe({
      next: () => {
        console.log("Pedido criado com sucesso. Buscando pedidos do usuário...");
        // Depois de criar, busca todos os pedidos do usuário
        this.pedidoService.findByUsername().subscribe({
          next: (pedidos) => {
            // Assumimos que o último pedido é o mais recente
            const ultimoPedido = pedidos.sort((a, b) =>
              new Date(b.data).getTime() - new Date(a.data).getTime()
            )[0];

            if (ultimoPedido) {
              this.pedidoCriado = ultimoPedido;
              console.log("Pedido retornado:", this.pedidoCriado);
              this.activeSection = "receipt";
              this.carrinhoService.removerTudo();
            } else {
              alert("Pedido criado, mas não foi possível carregá-lo.");
            }
          },
          error: (err) => {
            console.error("Erro ao buscar pedidos do usuário:", err);
            alert("Pedido criado, mas houve erro ao carregar os detalhes.");
          },
        });
      },
      error: (err) => {
        console.error(err);
        alert("Erro ao processar o pedido. Tente novamente.");
      },
    });
  }

  buscarPedidoCompleto() {
    console.log("Buscando pedidos do cliente...");

    this.pedidoService.findByUsername().subscribe({
      next: (pedidos) => {
        if (!pedidos || pedidos.length === 0) {
          alert("Nenhum pedido encontrado.");
          return;
        }

        // Ordena os pedidos por data decrescente
        const pedidosOrdenados = pedidos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        // Pega o mais recente
        this.pedidoCriado = pedidosOrdenados[0];

        console.log("Pedido mais recente:", this.pedidoCriado);
      },
      error: (err) => {
        console.error("Erro ao buscar pedidos do cliente:", err);
        alert("Erro ao carregar o recibo.");
      }
    });
  }

  voltarParaPagamento() {
    this.activeSection = "payment"
    if (this.pixInterval) {
      clearInterval(this.pixInterval)
    }
  }

  voltarParaLoja() {
    this.router.navigate(["/placasdevideo"])
  }

  imprimirRecibo() {
    window.print()
  }

  obterNomeMetodoPagamento(tipo: number): string {
    switch (tipo) {
      case 1:
        return "PIX"
      case 2:
        return "Boleto Bancário"
      case 3:
        return "Cartão de Crédito"
      default:
        return "Não informado"
    }
  }

  obterEnderecoCompleto(): string {
    if (!this.pedidoCriado?.enderecoEntrega) return ""
    const end = this.pedidoCriado.enderecoEntrega
    return `${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.estado} - CEP: ${end.cep}`
  }

  ngOnDestroy() {
    if (this.pixInterval) {
      clearInterval(this.pixInterval)
    }
  }
}
