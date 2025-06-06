import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatPaginatorModule, type PageEvent } from "@angular/material/paginator"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatDividerModule } from "@angular/material/divider"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { PlacaDeVideoService } from "../../../services/placadevideo.service"
import { CarrinhoService } from "../../../services/carrinho.service"
import { FavoritosService } from "../../../services/favoritos.service"
import { PlacaDeVideo } from "../../../models/placadevideo.model"
import { FiltroPlacaDeVideoDTO } from "../../../models/filtro-placadevideo.model"
import { ItemCarrinho } from "../../../models/item-carrinho"
import { ItemFavorito } from "../../../models/item-favorito"

@Component({
  selector: "app-placadevideo-search",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: "./placadevideo-search.component.html",
  styleUrls: ["./placadevideo-search.component.css"],
})
export class PlacadevideoSearchComponent implements OnInit {
  filterForm: FormGroup
  appliedFilters: FiltroPlacaDeVideoDTO = new FiltroPlacaDeVideoDTO()

  placasDeVideo: PlacaDeVideo[] = []
  loading = false
  isFilterOpen = true // Inicialmente aberto em desktop, fechado em mobile
  searchText = "" // Para exibir o termo de pesquisa atual

  // Paginação
  currentPage = 0
  pageSize = 10
  totalItems = 0
  pageSizeOptions = [5, 10, 20, 50]

  categorias = ["Entry-Level", "Mid-Range", "High-End", "Gaming", "Professional", "Workstation"]

  constructor(
    private fb: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
    private carrinhoService: CarrinhoService,
    private favoritosService: FavoritosService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      categoria: [null],
      memoriaMin: [null],
      memoriaMax: [null],
      precoMin: [null],
      precoMax: [null],
      rayTracing: [null],
    })
  }

  ngOnInit(): void {
    // Verificar se é mobile para definir o estado inicial do filtro
    if (window.innerWidth < 992) {
      this.isFilterOpen = false
    }

    // Recuperar parâmetros da URL
    this.route.queryParams.subscribe((params) => {
      this.searchText = params["q"] || ""
      this.currentPage = params["page"] ? Number.parseInt(params["page"]) : 0

      // Preencher formulário de filtros
      if (params["categoria"]) this.filterForm.get("categoria")?.setValue(params["categoria"])
      if (params["memoriaMin"]) this.filterForm.get("memoriaMin")?.setValue(Number.parseInt(params["memoriaMin"]))
      if (params["memoriaMax"]) this.filterForm.get("memoriaMax")?.setValue(Number.parseInt(params["memoriaMax"]))
      if (params["precoMin"]) this.filterForm.get("precoMin")?.setValue(Number.parseFloat(params["precoMin"]))
      if (params["precoMax"]) this.filterForm.get("precoMax")?.setValue(Number.parseFloat(params["precoMax"]))
      if (params["rayTracing"] !== undefined)
        this.filterForm.get("rayTracing")?.setValue(params["rayTracing"] === "true")

      // Atualiza os filtros aplicados com o que veio da URL
      this.appliedFilters = this.buildFiltro()

      // Verificar se há filtros aplicados
      if (this.hasActiveFilters()) {
        this.isFilterOpen = true
      }

      // Buscar resultados com os filtros aplicados
      this.searchPlacasDeVideo()
    })

    // Adicionar listener para redimensionamento da janela
    window.addEventListener("resize", this.handleResize.bind(this))
  }

  // Limpar listener ao destruir componente
  ngOnDestroy(): void {
    window.removeEventListener("resize", this.handleResize.bind(this))
  }

  // Ajustar visibilidade do filtro em mobile/desktop
  handleResize(): void {
    if (window.innerWidth >= 992) {
      this.isFilterOpen = true
    } else if (!this.hasActiveFilters()) {
      this.isFilterOpen = false
    }
  }

  searchPlacasDeVideo(): void {
    this.loading = true;

    const filtro = this.appliedFilters;

    const hasSearchText = this.searchText && this.searchText.trim() !== "";
    const hasFilters = this.hasActiveFilters();

    const applyFrontendFilter = (placas: PlacaDeVideo[], textoBusca: string): PlacaDeVideo[] => {
      if (!textoBusca) return placas;

      const termos = textoBusca.toLowerCase().split(/\s+/);

      return placas.filter(placa => {
        const texto =
          (placa.modelo + " " +
            placa.categoria + " " +
            placa.descricao + " " +
            (placa.fornecedor?.nome ?? ""))
            .toLowerCase();

        return termos.every(termo => texto.includes(termo));
      });
    };

    // Função para paginar o array localmente
    const paginate = (items: PlacaDeVideo[], pageIndex: number, pageSize: number): PlacaDeVideo[] => {
      const start = pageIndex * pageSize;
      return items.slice(start, start + pageSize);
    };

    if (hasSearchText) {
      // Busca no backend com filtros
      this.placaDeVideoService.searchPlacas(this.searchText.trim(), filtro, 0, 1000).subscribe({
        next: (data) => {
          // Aplica filtro local para múltiplos termos (caso o backend não faça isso)
          const filtradas = applyFrontendFilter(data, this.searchText.trim());

          this.totalItems = filtradas.length;

          // Pagina localmente com currentPage e pageSize
          this.placasDeVideo = paginate(filtradas, this.currentPage, this.pageSize);

          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao buscar placas de vídeo:", error);
          this.loading = false;
        }
      });
    } else if (hasFilters) {
      // Busca por filtros no backend, sem texto
      this.placaDeVideoService.findByFiltros(filtro, this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.placasDeVideo = data;
          this.totalItems = data.length;
          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao buscar placas de vídeo por filtros:", error);
          this.loading = false;
        }
      });
    } else {
      // Busca todos, sem texto nem filtro
      this.placaDeVideoService.findAll(this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.placasDeVideo = data;
          this.totalItems = data.length;
          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao buscar placas de vídeo:", error);
          this.loading = false;
        }
      });
    }
  }

  

  onApplyFilters(): void {
    this.currentPage = 0

    // Atualiza os filtros aplicados com os valores atuais do formulário
    this.appliedFilters = this.buildFiltro()

    this.updateQueryParams()
  }

  onClearFilters(): void {
    this.filterForm.reset()
    this.currentPage = 0

    // Limpa os filtros aplicados também
    this.appliedFilters = new FiltroPlacaDeVideoDTO()

    this.updateQueryParams()
  }

  private updateQueryParams(): void {
    const queryParams: any = {
      page: this.currentPage,
      pageSize: this.pageSize,
    }

    // Adicionar texto de pesquisa se existir, senão remove
    if (this.searchText && this.searchText.trim() !== "") {
      queryParams.q = this.searchText
    } else {
      queryParams.q = null // Remove parâmetro da URL
    }

    // Adicionar filtros se existirem
    const filtro = this.buildFiltro()
    if (filtro.categoria) queryParams.categoria = filtro.categoria
    else queryParams.categoria = null

    if (filtro.memoriaMin !== undefined) queryParams.memoriaMin = filtro.memoriaMin
    else queryParams.memoriaMin = null

    if (filtro.memoriaMax !== undefined) queryParams.memoriaMax = filtro.memoriaMax
    else queryParams.memoriaMax = null

    if (filtro.precoMin !== undefined) queryParams.precoMin = filtro.precoMin
    else queryParams.precoMin = null

    if (filtro.precoMax !== undefined) queryParams.precoMax = filtro.precoMax
    else queryParams.precoMax = null

    if (filtro.rayTracing !== undefined) queryParams.rayTracing = filtro.rayTracing
    else queryParams.rayTracing = null

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: "merge",
      })
      .then(() => {
        this.searchPlacasDeVideo()
      })
  }

  clearSearch(): void {
    this.searchText = ""
    this.currentPage = 0

    // Limpa filtros aplicados também se quiser limpar tudo (opcional)
    this.appliedFilters = new FiltroPlacaDeVideoDTO()
    this.filterForm.reset()

    this.updateQueryParams()
  }

  toggleFilters(): void {
    this.isFilterOpen = !this.isFilterOpen
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.updateQueryParams()
  }

  private buildFiltro(): FiltroPlacaDeVideoDTO {
    const filtro = new FiltroPlacaDeVideoDTO()

    filtro.categoria = this.filterForm.get("categoria")?.value || undefined
    filtro.memoriaMin = this.filterForm.get("memoriaMin")?.value || undefined
    filtro.memoriaMax = this.filterForm.get("memoriaMax")?.value || undefined
    filtro.precoMin = this.filterForm.get("precoMin")?.value || undefined
    filtro.precoMax = this.filterForm.get("precoMax")?.value || undefined
    filtro.rayTracing = this.filterForm.get("rayTracing")?.value || undefined

    return filtro
  }

  private hasActiveFilters(): boolean {
    // Usa os filtros aplicados para saber se tem algum filtro ativo
    return Object.values(this.appliedFilters).some((value) => value !== undefined)
  }

  getActiveFiltersCount(): number {
    return Object.values(this.buildFiltro()).filter((value) => value !== undefined).length
  }

  getImageUrl(placa: PlacaDeVideo): string {
    if (placa.listaImagem && placa.listaImagem.length > 0) {
      return this.placaDeVideoService.getImagemUrl(placa.listaImagem[0])
    }
    return "https://placehold.co/300x300?text=Sem+Imagem"
  }

  verDetalhes(id: number): void {
    this.router.navigate(["placadevideo-detail/", id])
  }

  adicionarAoCarrinho(placa: PlacaDeVideo): void {
    const itemCarrinho: ItemCarrinho = {
      id: placa.id!,
      modelo: placa.modelo,
      preco: placa.preco,
      fornecedor: placa.fornecedor?.nome ?? "Fornecedor não informado",
      capacidade: placa.memoria.capacidade,
      tipoMemoria: placa.memoria.tipoMemoria,
      larguraBanda: placa.memoria.larguraBanda,
      quantidade: 1,
      imageUrl: placa.listaImagem?.length
        ? this.placaDeVideoService.getImagemUrl(placa.listaImagem[0])
        : "assets/placeholder-gpu.png",
    }

    this.carrinhoService.adicionar(itemCarrinho)
    this.showSnackBarTopPosition("Adicionado ao carrinho")
  }

  adicionarOuRemoverFavorito(placa: PlacaDeVideo): void {
    const itemFavorito: ItemFavorito = {
      id: placa.id!,
      title: placa.modelo,
      fornecedor: placa.fornecedor?.nome ?? "Fornecedor não informado",
      tipoMemoria: placa.memoria.tipoMemoria,
      capacidade: placa.memoria.capacidade,
      larguraBanda: placa.memoria.larguraBanda,
      preco: placa.preco,
      imageUrl: placa.listaImagem?.length
        ? this.placaDeVideoService.getImagemUrl(placa.listaImagem[0])
        : "assets/placeholder-gpu.png",
      quantidade: 1,
    }

    if (this.isFavorito(placa.id!)) {
      this.favoritosService.remover(itemFavorito)
      this.showSnackBarTopPosition("Removido dos favoritos")
    } else {
      this.favoritosService.adicionar(itemFavorito)
      this.showSnackBarTopPosition("Adicionado aos favoritos")
    }
  }

  isFavorito(id: number): boolean {
    return this.favoritosService.obter().some((item) => item.id === id)
  }

  showSnackBarTopPosition(content: string): void {
    this.snackBar.open(content, "Fechar", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
    })
  }

  getFavoritoIcon(id: number): string {
    return this.isFavorito(id) ? "favorite" : "favorite_border"
  }

  getFavoritoColor(id: number): string {
    return this.isFavorito(id) ? "warn" : ""
  }
}
