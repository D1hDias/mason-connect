/**
 * "Próximos encontros" (Painel). Desktop é a fonte canônica — o protótipo
 * mobile mostra apenas os dois primeiros itens; "Jantar de encerramento" só
 * existe em DesktopApp.dc.html e é marcado `desktopOnly`. Onde o mobile
 * omite o local (venue) mas mostra o mesmo evento, o dado completo do
 * desktop é usado como valor único (canônico) para as duas superfícies.
 */

export type MeetingStatus = 'confirmado' | 'pendente' | 'aguardando';

export interface Meeting {
  title: string;
  dateLabel: string;
  venue?: string;
  status: MeetingStatus;
  desktopOnly?: boolean;
}

export const meetings: Meeting[] = [
  {
    title: 'Coworking de setembro',
    dateLabel: 'Quinta, 10 de setembro · 19h',
    venue: 'Café da Praça',
    status: 'confirmado',
  },
  {
    title: 'Rodada de indicações',
    dateLabel: 'Terça, 22 de setembro · 8h',
    venue: 'Sede',
    status: 'pendente',
  },
  {
    title: 'Jantar de encerramento',
    dateLabel: 'Sexta, 2 de outubro · 20h',
    status: 'aguardando',
    desktopOnly: true,
  },
];
