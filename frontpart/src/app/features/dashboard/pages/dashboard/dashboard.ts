import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PieceData, PieceRoute } from '../../data/models/piece-data.model';
import { Articles } from '../../../article/data/services/articles';
import { DashItem } from '../../ui/dash-item/dash-item';
import { DashUsers } from '../../data/models/dash-user.model';
import { DashUser } from '../../ui/dash-user/dash-user';
import { DashPartners } from '../../data/models/dash-partner.model';
import { DashPartner } from '../../ui/dash-partner/dash-partner';


@Component({
  selector: 'app-dashboard',
  imports: [DashItem, DashUser, DashPartner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{

  protected readonly today = signal<Date>(new Date());

  protected readonly articlesService = inject(Articles);

  readonly article = computed(() => {

    const article = this.articlesService.articles().at(-1);

    if(!article) {
      return null;
    }

    return { ...article, content: article.content.slice(0,100) };

  });

  readonly routeLinks = signal<PieceRoute[]>([
    {
      label: 'Liste des articles', link: '/article'
    },
    {
      label: 'Ajouter un article', link: '/article/add'
    }
  ]);

  readonly data = signal<PieceData>({
    title: 'Joueurs',

    subtitle: 'L',

    graphic: 'licences réglées',

    color: '#079fdb',

    num: 0,
    all: 20,

    stat1: {
      stat: 'Buts',
      val: 0,
    },

    stat2: {
      stat: 'Passes',
      val: 0,
    },
    stat3: {
      stat: 'Concédés',
      val: 0,
    },

    routeLink1: {
      label: 'Liste des joueurs',
      link: '/team',
    },

    routeLink2: {
      label: 'Ajouter un joueur',
      link: '/team/player-add',
    },

    routeLink3: {
      label: 'Gestion de licences',
      link: '/manage-license',
    }
  });

  readonly dataGames = signal<PieceData>({
    title: 'Matchs',

    subtitle: 'J',

    graphic: 'matchs joués',

    color: '#64b484',

    num: 0,
    all: 26,

    stat1: {
      stat: 'V',
      val: 0,
    },

    stat2: {
      stat: 'N',
      val: 0,
    },
    stat3: {
      stat: 'D',
      val: 0,
    },

    routeLink1: {
      label: 'Liste des matchs',
      link: '/championship',
    },

    routeLink2: {
      label: 'Ajouter un match',
      link: '/championship/game-add',
    },

    routeLink3: {
      label: 'Forfaits',
      link: '/championship/forfeit',
    }
  });

  readonly dataUsers = signal<DashUsers>({
    title: 'Utilisateurs',
    color: 'orange',
    all: 1,
    subtitle: 'Admins',
    num: 1,
    connected: {
      user: 0,
      author: 1,
      admin: 1,
    },
    routeLinks: [
      {
        label: 'Gestion des droits',
        link: '/user',
      }
    ],
    stats: [
      {
        stat: 'Utilisateurs',
        val: 0
      },
      {
        stat: 'auteurs',
        val: 1
      },
    ]
  });

  readonly dataPartner = signal<DashPartners>({
    title: 'Partenaires',

    color: '#af61b5',

    routeLinks: [
      {
        label: 'Liste des partenaires',
        link: '/partner',
      },
      {
        label: 'Ajouter un partenaire',
        link: '/partner/new',
      }
    ],

    logos: [
      {
        name: 'Quincaillerie Lecuyer',
        src: 'assets/images/partner-1.jpg',
      },
      {
        name: 'US Créteil Lusitanos',
        src: 'assets/images/partner-2.png',
      }
    ],

    total: 2,

    stats: [
      {
        name: 'Sacs',
        nb: 18
      },
      {
        name: 'Maillots',
        nb: 16
      },
    ],
  });


  ngOnInit(): void {
    this.articlesService.loadArticles();
  }
}
