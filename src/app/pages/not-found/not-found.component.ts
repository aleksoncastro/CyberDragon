import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit, AfterViewInit {
  @ViewChild('video404') videoRef!: ElementRef<HTMLVideoElement>;
  showMessage = false;

  ngOnInit(): void {
    this.showMessage = false; // resetar o estado da mensagem
  }

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;
    video.currentTime = 0;
    video.muted = true;        // <- Isso precisa estar garantido antes
    video.load();
  
    // Tenta tocar, mas com fallback em caso de bloqueio
    video.play().catch((err) => {
      console.warn('Vídeo bloqueado pelo navegador:', err);
    });
  }

  onVideoEnded(): void {
    setTimeout(() => {
      this.showMessage = true;
    }, 0); // mostra mensagem 6s depois do vídeo acabar
  }
}
