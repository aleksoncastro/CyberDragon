import { Component, type OnInit, Input, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms";
import { CartaoService } from "../../../services/cartao.service";
import { ClienteService } from "../../../services/cliente.service";
import { Cartao } from "../../../models/cartao.model";
import { Cliente } from "../../../models/cliente.model";

@Component({
  selector: "app-cartao-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./cartao-form.component.html",
  styleUrls: ["./cartao-form.component.css"],
})
export class CartaoFormComponent implements OnInit {
  @Input() cartao?: Cartao
  @Input() clienteId?: number
  @Output() cartaoSaved = new EventEmitter<Cartao>()
  @Output() cancelled = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private cartaoService = inject(CartaoService)
  private clienteService = inject(ClienteService)

  cartaoForm!: FormGroup
  loading = false
  loadingUserData = false
  errorMessage = ""
  successMessage = ""
  isEditMode = false
  clienteLogado?: Cliente
  dadosPreenchidosAutomaticamente = false

  ngOnInit() {
    this.initializeForm()
    this.isEditMode = !!this.cartao?.id

    if (this.cartao) {
      this.populateForm()
    } else {
      // Se não está editando, busca dados do usuário logado
      this.loadUserData()
    }
  }

  private initializeForm() {
    this.cartaoForm = this.fb.group({
      numero: ["", [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      titular: ["", [Validators.required, Validators.minLength(2)]],
      dataValidade: [
        "",
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), this.expiryDateValidator],
      ],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cpf: ["", [Validators.required]],
    })
  }

  private loadUserData() {
    this.loadingUserData = true
    this.clienteService.findByMe().subscribe({
      next: (cliente) => {
        this.clienteLogado = cliente
        this.preencherDadosUsuario(cliente)
        this.loadingUserData = false
      },
      error: (error) => {
        console.warn("Não foi possível carregar dados do usuário:", error)
        this.loadingUserData = false
        // Não exibe erro para o usuário, apenas não preenche automaticamente
      },
    })
  }

  private preencherDadosUsuario(cliente: Cliente) {
    if (cliente.nome) {
      this.cartaoForm.patchValue({
        titular: cliente.nome.toUpperCase(),
      })
      this.dadosPreenchidosAutomaticamente = true
    }

    if (cliente.usuario?.cpf) {
      this.cartaoForm.patchValue({
        cpf: this.formatCPFDisplay(cliente.usuario.cpf),
      })
      this.dadosPreenchidosAutomaticamente = true
    }

    // Se conseguiu preencher dados automaticamente, mostra mensagem
    if (this.dadosPreenchidosAutomaticamente) {
      this.successMessage = "Dados do titular preenchidos automaticamente"
      setTimeout(() => {
        this.successMessage = ""
      }, 3000)
    }
  }

  private populateForm() {
    if (this.cartao) {
      this.cartaoForm.patchValue({
        numero: this.formatCardNumberDisplay(this.cartao.numero),
        titular: this.cartao.titular,
        dataValidade: this.formatExpiryDateDisplay(this.cartao.dataValidade),
        cvv: this.cartao.cvv,
        cpf: this.formatCPFDisplay(this.cartao.cpf),
      })
    }
  }

  // Validadores customizados
  private expiryDateValidator(control: any) {
    if (!control.value) return null

    const [month, year] = control.value.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const cardYear = Number.parseInt(year)
    const cardMonth = Number.parseInt(month)

    if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
      return { expired: true }
    }

    return null
  }

  private cpfValidator(control: any) {
    if (!control.value) return null

    const cpf = control.value.replace(/\D/g, "")

    if (cpf.length !== 11) return { invalidCpf: true }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return { invalidCpf: true }

    // Validação do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(9))) return { invalidCpf: true }

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(10))) return { invalidCpf: true }

    return null
  }

  // Formatadores de input
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, "")
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
    event.target.value = value
    this.cartaoForm.get("numero")?.setValue(value)
  }

  formatTitular(event: any) {
    const value = event.target.value.toUpperCase()
    event.target.value = value
    this.cartaoForm.get("titular")?.setValue(value)
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }
    event.target.value = value
    this.cartaoForm.get("dataValidade")?.setValue(value)
  }

  formatCVV(event: any) {
    const value = event.target.value.replace(/\D/g, "")
    event.target.value = value
    this.cartaoForm.get("cvv")?.setValue(value)
  }

  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, "")
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    event.target.value = value
    this.cartaoForm.get("cpf")?.setValue(value)
  }

  // Formatadores para exibição
  private formatCardNumberDisplay(numero: string): string {
    return numero.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  private formatExpiryDateDisplay(dataValidade: string): string {
    // Converte de yyyy-MM-dd para MM/yy
    const date = new Date(dataValidade)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)
    return `${month}/${year}`
  }

  private formatCPFDisplay(cpf: string): string {
    // Remove formatação se já existir
    const cleanCpf = cpf.replace(/\D/g, "")
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cartaoForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  limparDadosPreenchidos() {
    this.cartaoForm.patchValue({
      titular: "",
      cpf: "",
    })
    this.dadosPreenchidosAutomaticamente = false
  }

  onSubmit() {
    if (this.cartaoForm.valid) {
      this.loading = true
      this.errorMessage = ""
      this.successMessage = ""

      const formValue = this.cartaoForm.value
      const cartaoData: Cartao = {
        numero: formValue.numero.replace(/\s/g, ""),
        titular: formValue.titular,
        dataValidade: this.convertExpiryToDate(formValue.dataValidade),
        cvv: formValue.cvv,
        cpf: formValue.cpf.replace(/\D/g, ""),
      }

      if (this.isEditMode && this.cartao?.id) {
        cartaoData.id = this.cartao.id
        this.updateCartao(cartaoData)
      } else {
        this.createCartao(cartaoData)
      }
    }
  }

  private convertExpiryToDate(expiry: string): string {
    const [month, year] = expiry.split("/")
    const fullYear = 2000 + Number.parseInt(year)
    return `${fullYear}-${month.padStart(2, "0")}-01`
  }

  private createCartao(cartao: Cartao) {
    // Usa o ID do cliente logado se não foi fornecido um clienteId específico
    const clienteIdParaUsar = this.clienteId || this.clienteLogado?.id

    if (clienteIdParaUsar) {
      // Adicionar cartão a um cliente específico
      this.clienteService.addCartao(clienteIdParaUsar, cartao).subscribe({
        next: (response) => {
          this.loading = false
          this.successMessage = "Cartão adicionado com sucesso!"
          this.cartaoSaved.emit(response)
          setTimeout(() => this.resetForm(), 2000)
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = "Erro ao adicionar cartão. Tente novamente."
          console.error("Erro ao criar cartão:", error)
        },
      })
    } else {
      // Criar cartão independente
      this.cartaoService.insert(cartao).subscribe({
        next: (response) => {
          this.loading = false
          this.successMessage = "Cartão criado com sucesso!"
          this.cartaoSaved.emit(response)
          setTimeout(() => this.resetForm(), 2000)
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = "Erro ao criar cartão. Tente novamente."
          console.error("Erro ao criar cartão:", error)
        },
      })
    }
  }

  private updateCartao(cartao: Cartao) {
    if (cartao.id) {
      this.cartaoService.update(cartao.id, cartao).subscribe({
        next: (response) => {
          this.loading = false
          this.successMessage = "Cartão atualizado com sucesso!"
          this.cartaoSaved.emit(cartao)
          setTimeout(() => this.resetForm(), 2000)
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = "Erro ao atualizar cartão. Tente novamente."
          console.error("Erro ao atualizar cartão:", error)
        },
      })
    }
  }

  onCancel() {
    this.cancelled.emit()
    this.resetForm()
  }

  private resetForm() {
    this.cartaoForm.reset()
    this.errorMessage = ""
    this.successMessage = ""
    this.loading = false
    this.dadosPreenchidosAutomaticamente = false
  }
}
