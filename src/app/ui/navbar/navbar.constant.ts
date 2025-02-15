import { Icon } from '@ui/icon';

type NavLink = {
  label: string;
  path: string;
};

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Projects',
    path: '',
  },
  {
    label: 'Skills',
    path: '',
  },
  {
    label: 'About',
    path: '',
  },
];

type SocialMedia = {
  label: string;
  url: string;
  icon: Icon;
};

export const SOCIAL_MEDIAS: SocialMedia[] = [
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/reginald.mabanta/',
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/egieegie/',
    icon: 'instagram',
  },
  {
    label: 'Linkedin',
    url: 'https://www.linkedin.com/in/reginald-mabanta-641727111',
    icon: 'linkedin',
  },
  {
    label: 'Github',
    url: 'https://github.com/egiev',
    icon: 'github',
  },
];
