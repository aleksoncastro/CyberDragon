import { Component, type OnInit } from "@angular/core"

// Interfaces baseadas nas suas classes TypeScript
interface Endereco {
  id?: number
  cep: string
  cidade: string
  estado: string
  bairro: string
  rua: string
  numero: string
}

interface TelefoneCliente {
  id?: number
  numero: string
  tipo: string
}

interface Cartao {
  id?: number
  numero: string
  titular: string
  dataValidade: string
  cvv: string
  cpf: string
}

interface Cliente {
  id?: number
  nome: string
  dataNascimento: string
  enderecos: Endereco[]
  telefones: TelefoneCliente[]
  cartoes?: Cartao[]
}

interface Pedido {
  id: string
  pagamento: string
  data: string
  valor: string
  status: string
  produto: string
  dataEnvio: string
}

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  activeSection = "minha-conta"

  cliente: Cliente = {
    id: 1,
    nome: "Alékson Castro de Souza",
    dataNascimento: "1990-05-15",
    enderecos: [
      {
        id: 1,
        cep: "77500-000",
        cidade: "Porto Nacional",
        estado: "TO",
        bairro: "Jardim Querido",
        rua: "Rua Sorocaba",
        numero: "2190",
      },
      {
        id: 2,
        cep: "77500-000",
        cidade: "Porto Nacional",
        estado: "TO",
        bairro: "Jardim Querido",
        rua: "Rua Sorocaba",
        numero: "2190",
      },
    ],
    telefones: [{ id: 1, numero: "(63) 9850-01993", tipo: "Celular" }],
    cartoes: [
      {
        id: 1,
        numero: "**** **** **** 1234",
        titular: "Alékson Castro de Souza",
        dataValidade: "2025-12-31",
        cvv: "***",
        cpf: "***.***.***-**",
      },
    ],
  }

  mockPedidos: Pedido[] = [
    {
      id: "#1008550231",
      pagamento: "PAGUE VIA PIX",
      data: "08/06/2024 17:59:16",
      valor: "R$ 103,89",
      status: "CONCLUÍDO",
      produto: "Produto Enviado",
      dataEnvio: "11/06/2024 09:44:37",
    },
  ]

  sidebarItems = [
    { id: "minha-conta", label: "Minha Conta", icon: "fas fa-user" },
    { id: "meus-pedidos", label: "Meus Pedidos", icon: "fas fa-shopping-bag" },
    { id: "meus-favoritos", label: "Meus Favoritos", icon: "fas fa-heart" },
    { id: "enderecos", label: "Endereços", icon: "fas fa-map-marker-alt" },
    { id: "meus-dados", label: "Meus dados", icon: "fas fa-cog" },
  ]

  quickActions = [
    { id: "meus-dados", title: "MEUS DADOS", icon: "fas fa-user" },
    { id: "meus-pedidos", title: "MEUS PEDIDOS", icon: "fas fa-shopping-bag" },
    { id: "enderecos", title: "ENDEREÇOS", icon: "fas fa-map-marker-alt" },
    { id: "meus-favoritos", title: "FAVORITOS", icon: "fas fa-heart" },
  ]

  constructor() {}

  ngOnInit(): void {}

  setActiveSection(section: string): void {
    this.activeSection = section
  }

  getFirstName(): string {
    return this.cliente.nome.split(" ")[0]
  }
}
