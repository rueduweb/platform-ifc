import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import {
  ArcElement,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Tooltip,
} from 'chart.js';
import { PieceData } from '../../data/models/piece-data.model';
import { Router } from '@angular/router';


Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
);

@Component({
  selector: 'app-dash-item',
  templateUrl: './dash-item.html',
  styleUrl: './dash-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashItem implements AfterViewInit, OnChanges, OnDestroy {

  readonly data = input.required<PieceData>();

  private readonly router = inject(Router);

  @ViewChild('chartCanvas')
  private readonly chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'doughnut'>;

  get percentage(): number {
    const { num, all } = this.data();

    if (!all || all <= 0) {
      return 0;
    }

    return Math.round(
      Math.min(100, Math.max(0, (num / all) * 100)),
    );
  }

  get remaining(): number {
    return Math.max(0, this.data().all - this.data().num);
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private createChart(): void {
    const canvas = this.chartCanvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const data = this.data();

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',

      data: {
        labels: ['Réalisé', 'Restant'],

        datasets: [
          {
            data: [data.num, this.remaining],

            backgroundColor: [
              data.color,
              'rgba(255, 255, 255, 0.88)',
            ],

            borderColor: [
              data.color,
              '#9d9d9d',
            ],

            borderWidth: 0.6,

            hoverBackgroundColor: [
              data.color,
              'rgba(255, 255, 255, 0.88)',
            ],

            hoverOffset: 0,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: true,

        cutout: '67%',

        animation: {
          duration: 500,
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },
        },

        events: [],
      },
    };

    this.chart = new Chart(context, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    const data = this.data();

    this.chart.data.datasets[0].data = [
      data.num,
      this.remaining,
    ];

    this.chart.data.datasets[0].backgroundColor = [
      data.color,
      'rgba(255, 255, 255, 0.88)',
    ];

    this.chart.data.datasets[0].borderColor = [
      data.color,
      '#9d9d9d',
    ];

    this.chart.update();
  }

  onRedirect(link: string) : void {
    this.router.navigate(['/'+link]);
  }
}

