import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  input,
} from '@angular/core';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  LinearScale,
  Tooltip,
} from 'chart.js';

import { DashUsers as DashUserModel } from '../../data/models/dash-user.model';


Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
);


@Component({
  selector: 'app-dash-user',
  templateUrl: './dash-user.html',
  styleUrl: './dash-user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashUser implements AfterViewInit, OnChanges, OnDestroy {

  readonly data = input.required<DashUserModel>();

  @ViewChild('chartCanvas')
  private readonly chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'bar'>;


  /**
   * Aut. = Utilisateurs + Auteurs
   */
  get usersAndAuthors(): number {
    const {
      user,
      author,
    } = this.data().connected;

    return user + author;
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


  /**
   * Plugin ChartJS permettant d'afficher la valeur
   * directement à l'intérieur de chaque barre.
   */
  private readonly valueLabelPlugin = {
    id: 'dashUserValueLabel',

    afterDatasetsDraw: (chart: Chart<'bar'>): void => {

      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      const {
        ctx,
      } = chart;

      ctx.save();

      ctx.font = '500 17px "Nunito", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      meta.data.forEach((bar, index) => {

        const value = dataset.data[index];

        if (typeof value !== 'number') {
          return;
        }

        /*
         * getProps() permet d'obtenir base sans
         * provoquer l'erreur TypeScript rencontrée
         * avec bar.base.
         */
        const {
          x,
          y,
          base,
        } = bar.getProps(
          ['x', 'y', 'base'],
          true,
        );

        /*
         * Position de la valeur vers le bas de la barre.
         */
        const labelY =
          y +
          ((base - y) * 0.86);

        ctx.fillStyle = '#ffffff';

        ctx.fillText(
          String(value),
          x,
          labelY,
        );
      });

      ctx.restore();
    },
  };


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


    const config: ChartConfiguration<'bar'> = {

      type: 'bar',


      data: {

        labels: [
          'Total',
          'Aut.',
          'Adm.',
        ],

        datasets: [
          {
            data: [
              data.all,
              this.usersAndAuthors,
              data.connected.admin,
            ],

            /*
             * Couleurs correspondant à la maquette.
             */
            backgroundColor: [
              '#ff7627',
              '#64b484',
              '#a747ad',
            ],

            borderColor: [
              '#ff7627',
              '#64b484',
              '#a747ad',
            ],

            borderWidth: 0,

            borderRadius: 0,

            /*
             * Largeur des barres.
             */
            barPercentage: 0.78,

            categoryPercentage: 0.78,

            hoverBackgroundColor: [
              '#ff7627',
              '#64b484',
              '#a747ad',
            ],
          },
        ],
      },


      options: {

        responsive: true,

        maintainAspectRatio: false,


        animation: {
          duration: 500,
        },


        layout: {
          padding: {
            top: 0,
            right: 4,
            bottom: 0,
            left: 4,
          },
        },


        scales: {

          x: {

            display: true,

            grid: {
              display: false,
            },

            border: {
              display: false,
            },

            ticks: {

              color: (context) => {

                const colors = [
                  '#ff7627',
                  '#64b484',
                  '#a747ad',
                ];

                return colors[context.index] ?? '#555';
              },

              font: {
                family: '"Nunito", sans-serif',
                size: 17,
                weight: 500,
              },

              padding: 5,

              /*
               * Les labels restent sur une seule ligne.
               */
              autoSkip: false,

              maxRotation: 0,

              minRotation: 0,
            },
          },


          y: {

            display: false,

            beginAtZero: true,

            /*
             * Le maximum correspond au Total.
             */
            max: data.all,

            grid: {
              display: false,
            },

            border: {
              display: false,
            },

            ticks: {
              display: false,
            },
          },
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


      plugins: [
        this.valueLabelPlugin,
      ],
    };


    this.chart = new Chart(
      context,
      config,
    );
  }


  private updateChart(): void {

    if (!this.chart) {
      return;
    }

    const data = this.data();


    this.chart.data.datasets[0].data = [
      data.all,
      this.usersAndAuthors,
      data.connected.admin,
    ];


    this.chart.options.scales!['y']!.max = data.all;


    this.chart.update();
  }
}
