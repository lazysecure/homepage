export interface NavItem {
  label: string;
  href: string;
}

export interface InterestField {
  title: string;
  summary: string;
  relatedRepos: string[];
}

export interface AboutSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href?: string;
  note: string;
  copyable?: boolean;
  external?: boolean;
}

export interface SiteConfig {
  identity: {
    githubUsername: string;
    handle: string;
    title: string;
    subtitle: string;
    introduction: string;
    githubUrl: string;
  };
  domains: {
    githubPages: string;
    customDomainLabel: string;
  };
  layout: {
    maxWidthClass: string;
    accentColor: string;
    mutedRuleColor: string;
  };
  navigation: NavItem[];
  interests: InterestField[];
  selectedRepoNames: string[];
  about: {
    lead: string;
    sections: AboutSection[];
  };
  contact: {
    lead: string;
    availabilityNote: string;
    channels: ContactChannel[];
  };
}

/**
 * Central website configuration.
 * Edit this file to customize copy, navigation, selected repositories,
 * theme accent tokens, and contact links independently of UI components.
 */
export const siteConfig: SiteConfig = {
  identity: {
    githubUsername: 'critical-dummy',
    handle: 'critical-dummy',
    title: 'critical-dummy',
    subtitle: 'Software developer & experimental systems builder',
    introduction:
      'Personal workspace and index of public repositories, technical experiments, and ongoing builds on GitHub.',
    githubUrl: 'https://github.com/critical-dummy',
  },
  domains: {
    githubPages: 'critical-dummy.github.io',
    customDomainLabel: 'Custom domain ready (host-agnostic routing)',
  },
  layout: {
    maxWidthClass: 'max-w-[1120px]',
    accentColor: '#ea580c',
    mutedRuleColor: '#a3a2a5',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Activity', href: '/activity' },
    { label: 'Contact', href: '/contact' },
  ],
  interests: [
    {
      title: 'Browser Simulation & Interactive Worlds',
      summary:
        'Exploring physical, environmental, and human simulation directly inside browser runtimes with TypeScript.',
      relatedRepos: ['Project-CHOKEPOINT'],
    },
    {
      title: 'Systems & Compatibility Layers',
      summary:
        'Studying operating system internals, kernel-level tooling, and cross-platform compatibility architectures.',
      relatedRepos: ['macandcheese', 'draft-kernel', 'DetailSU'],
    },
    {
      title: 'Web-Based OS & Shell Environments',
      summary:
        'Designing desktop-inspired interfaces and personal computing environments for the web.',
      relatedRepos: ['reachOS'],
    },
    {
      title: 'Terminal & Presence Tooling',
      summary:
        'Lightweight native utilities in C++ and TypeScript for terminal workflows and status reporting.',
      relatedRepos: ['text.presence'],
    },
  ],
  // Repository names to highlight on the Home page when present in live GitHub data.
  selectedRepoNames: [
    'Project-CHOKEPOINT',
    'macandcheese',
    'reachOS',
    'text.presence',
  ],
  about: {
    lead: 'Developer building experimental systems, simulation software, and web computing environments under the GitHub identity critical-dummy.',
    sections: [
      {
        id: 'profile',
        heading: 'Developer Profile',
        paragraphs: [
          'critical-dummy is an independent developer working across TypeScript, C++, and web platform runtimes. The public repository archive spans browser-based simulation, compatibility layers, OS interface concepts, and compact terminal utilities.',
          'Rather than optimizing for polished marketing wrappers, most work here starts as a direct technical question: testing how a runtime behaves, how low-level mechanics translate across platforms, or how a browser environment can feel like a focused tool.',
        ],
      },
      {
        id: 'interests',
        heading: 'Creative & Technical Interests',
        paragraphs: [
          'Active areas of exploration include real-time simulation in the browser, compatibility layers inspired by Wine, custom shell and OS metaphors on the web, and terminal-native C++ utilities.',
          'Across both web and native codebases, the recurring interest is understanding systems from first principles: stripping away unnecessary abstraction layers so behavior remains observable and modifiable.',
        ],
      },
      {
        id: 'philosophy',
        heading: 'Development Philosophy',
        paragraphs: [
          'Prefer direct implementations over ornamental complexity. Interfaces should expose real underlying data, clearly distinguish missing or unavailable information from zero state, and remain straightforward to inspect and reconfigure.',
          'This website itself is structured around a single central configuration file and live server-side GitHub REST API queries so content, layout, navigation, and domain bindings stay clean and maintainable.',
        ],
      },
    ],
  },
  contact: {
    lead: 'Public profiles and configurable channels for reaching out or following ongoing code changes.',
    availabilityNote:
      'All channels below are managed in config/site.ts and can be added, removed, or reordered without modifying page components.',
    channels: [
      {
        id: 'github',
        label: 'GitHub',
        value: 'github.com/critical-dummy',
        href: 'https://github.com/critical-dummy',
        note: 'Source repositories, forks, and public event history.',
        copyable: true,
        external: true,
      },
      {
        id: 'nekoweb',
        label: 'Personal Web Space',
        value: 'dummy.nekoweb.org',
        href: 'https://dummy.nekoweb.org/',
        note: 'Linked directly from the public GitHub profile.',
        copyable: true,
        external: true,
      },
      {
        id: 'github-pages',
        label: 'GitHub Pages Host',
        value: 'critical-dummy.github.io',
        href: 'https://critical-dummy.github.io',
        note: 'Primary GitHub Pages endpoint configured for this site.',
        copyable: true,
        external: true,
      },
    ],
  },
};
