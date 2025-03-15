import { getDictionary } from '@/app/[lang]/dictionaries';

export async function getMenus(locale: string) {
  const dictionary = await getDictionary(locale);
  const { sidebar } = dictionary;
  return [
    {
      label: sidebar.menu.home,
      children: [
        {
          path: `/${locale}/dashboards/misc`,
          label: sidebar.menuItem.misc,
          icon: 'misc',
        },
        {
          path: `/${locale}/dashboards/crypto`,
          label: sidebar.menuItem.crypto,
          icon: 'crypto',
        },
        {
          path: `/${locale}/dashboards/listing`,
          label: sidebar.menuItem.listing,
          icon: 'listing',
        },
        {
          path: `/${locale}/dashboards/crm`,
          label: sidebar.menuItem.crm,
          icon: 'crm',
        },
        {
          path: `/${locale}/dashboards/intranet`,
          label: sidebar.menuItem.intranet,
          icon: 'intranet',
        },
        {
          path: `/${locale}/dashboards/ecommerce`,
          label: sidebar.menuItem.ecommerce,
          icon: 'ecommerce',
        },
        {
          path: `/${locale}/dashboards/news`,
          label: sidebar.menuItem.news,
          icon: 'news',
        },
      ],
    },

    {
      label: sidebar.menu.card,
      children: [
        {
          path: `/${locale}/widgets`,
          label: sidebar.menuItem.widgets,
          icon: 'widget',
        },
        {
          path: `/${locale}/metrics`,
          label: sidebar.menuItem.metrics,
          icon: 'metric',
        },
      ],
    },
    {
      label: sidebar.menu.user,
      children: [
        {
          path: `/${locale}/user/social-wall`,
          label: sidebar.menuItem.socialWall,
          icon: 'social-wall',
        },
        {
          path: `/${locale}/user/settings/public-profile`,
          label: sidebar.menuItem.settings,
          icon: 'settings-outlined',
        },
      ],
    },
    {
      label: sidebar.menu.userProfiles,
      children: [
        {
          path: `/${locale}/user/profile-1`,
          label: sidebar.menuItem.profile1,
          icon: 'profile',
        },
        {
          path: `/${locale}/user/profile-2`,
          label: sidebar.menuItem.profile2,
          icon: 'profile-2',
        },
        {
          path: `/${locale}/user/profile-3`,
          label: sidebar.menuItem.profile3,
          icon: 'profile-3',
        },
        {
          path: `/${locale}/user/profile-4`,
          label: sidebar.menuItem.profile4,
          icon: 'profile-4',
        },
      ],
    },
    {
      label: sidebar.menu.onboarding,
      children: [
        {
          path: `/${locale}/onboarding-1`,
          label: sidebar.menuItem.onboarding1,
          icon: 'onboarding-1',
        },
        {
          path: `/${locale}/onboarding-2`,
          label: sidebar.menuItem.onboarding2,
          icon: 'onboarding-2',
        },
        {
          path: `/${locale}/onboarding-3`,
          label: sidebar.menuItem.onboarding3,
          icon: 'onboarding-3',
        },
      ],
    },
    {
      label: sidebar.menu.apps,
      children: [
        {
          path: `/${locale}/apps/chat`,
          label: sidebar.menuItem.chat,
          icon: 'chat',
        },
        {
          path: `/${locale}/apps/contact`,
          label: sidebar.menuItem.contact,
          icon: 'contact',
        },
        {
          path: `/${locale}/apps/mail/inbox`,
          label: sidebar.menuItem.mail,
          icon: 'mail',
        },
        {
          path: `/${locale}/apps/invoice`,
          label: 'Invoice',
          icon: 'invoices',
        },
      ],
    },
    {
      label: sidebar.menu.extensions,
      children: [
        {
          label: sidebar.menu.editor,
          collapsible: true,
          icon: 'editor',
          children: [
            {
              path: `/${locale}/extensions/editors/ck`,
              label: sidebar.menuItem.ckEditor,
            },
            {
              path: `/${locale}/extensions/editors/wysiwyg`,
              label: sidebar.menuItem.wysiwygEditor,
            },
          ],
        },
        {
          path: `/${locale}/extensions/dnd`,
          label: sidebar.menuItem.dnd,
          icon: 'dnd',
        },
        {
          path: `/${locale}/extensions/dropzone`,
          label: sidebar.menuItem.dropzone,
          icon: 'dropzone',
        },
        {
          path: `/${locale}/extensions/sweet-alert`,
          label: sidebar.menuItem.sweetAlerts,
          icon: 'sweet-alert',
        },
      ],
    },
    {
      label: sidebar.menu.modules,
      children: [
        {
          label: sidebar.menu.calendar,
          collapsible: true,
          icon: 'calendar',
          children: [
            {
              path: `/${locale}/modules/calendars/basic`,
              label: sidebar.menuItem.basic,
            },
            {
              path: `/${locale}/modules/calendars/culture`,
              label: sidebar.menuItem.cultures,
            },
            {
              path: `/${locale}/modules/calendars/scheduling`,
              label: sidebar.menuItem.scheduling,
            },
            {
              path: `/${locale}/modules/calendars/popup`,
              label: sidebar.menuItem.popup,
            },
            {
              path: `/${locale}/modules/calendars/rendering`,
              label: sidebar.menuItem.rendering,
            },
            {
              path: `/${locale}/modules/calendars/selectable`,
              label: sidebar.menuItem.selectable,
            },
            {
              path: `/${locale}/modules/calendars/timeslot`,
              label: sidebar.menuItem.timeSlots,
            },
          ],
        },
        {
          label: sidebar.menu.charts,
          collapsible: true,
          icon: 'chart',
          children: [
            {
              path: `/${locale}/modules/charts/line`,
              label: sidebar.menuItem.line,
            },
            {
              path: `/${locale}/modules/charts/bar`,
              label: sidebar.menuItem.bar,
            },
            {
              path: `/${locale}/modules/charts/area`,
              label: sidebar.menuItem.area,
            },
            {
              path: `/${locale}/modules/charts/composed`,
              label: sidebar.menuItem.composed,
            },
            {
              path: `/${locale}/modules/charts/pie`,
              label: sidebar.menuItem.pie,
            },
            {
              path: `/${locale}/modules/charts/scatter`,
              label: sidebar.menuItem.scatter,
            },
            {
              path: `/${locale}/modules/charts/radial`,
              label: sidebar.menuItem.radial,
            },
            {
              path: `/${locale}/modules/charts/radar`,
              label: sidebar.menuItem.radar,
            },
            {
              path: `/${locale}/modules/charts/treemap`,
              label: sidebar.menuItem.treeMap,
            },
          ],
        },
        {
          label: sidebar.menu.maps,
          collapsible: true,
          icon: 'map',
          children: [
            {
              path: `/${locale}/modules/maps/simple`,
              label: sidebar.menuItem.simpleMap,
            },
            {
              path: `/${locale}/modules/maps/styled`,
              label: sidebar.menuItem.styledMap,
            },
            {
              path: `/${locale}/modules/maps/geo-location`,
              label: sidebar.menuItem.geoLocation,
            },
            {
              path: `/${locale}/modules/maps/directions`,
              label: sidebar.menuItem.directional,
            },
            {
              path: `/${locale}/modules/maps/overlay`,
              label: sidebar.menuItem.overlay,
            },
            {
              path: `/${locale}/modules/maps/kml`,
              label: sidebar.menuItem.kmLayer,
            },
            {
              path: `/${locale}/modules/maps/popup-info`,
              label: sidebar.menuItem.popupInfo,
            },
            {
              path: `/${locale}/modules/maps/street-view`,
              label: sidebar.menuItem.streetView,
            },
            {
              path: `/${locale}/modules/maps/drawing`,
              label: sidebar.menuItem.drawing,
            },
            {
              path: `/${locale}/modules/maps/clustering`,
              label: sidebar.menuItem.clustering,
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.authPages,
      children: [
        {
          label: sidebar.menu.login,
          collapsible: true,
          icon: 'login',
          children: [
            {
              path: `/${locale}/auth/login-1`,
              label: sidebar.menuItem.login1,
              target: '_blank',
            },
            {
              path: `/${locale}/auth/login-2`,
              label: sidebar.menuItem.login2,
              target: '_blank',
            },
          ],
        },
        {
          label: sidebar.menu.signup,
          collapsible: true,
          icon: 'signup',
          children: [
            {
              path: `/${locale}/auth/signup-1`,
              label: sidebar.menuItem.signup1,
              target: '_blank',
            },
            {
              path: `/${locale}/auth/signup-2`,
              label: sidebar.menuItem.signup2,
              target: '_blank',
            },
          ],
        },
        {
          path: `/${locale}/auth/forgot-password`,
          label: sidebar.menuItem.forgetPassword,
          icon: 'forgot-password',
          target: '_blank',
        },
        {
          path: `/${locale}/auth/reset-password`,
          label: sidebar.menuItem.resetPassword,
          icon: 'reset-password',
          target: '_blank',
        },
      ],
    },
    {
      label: sidebar.menu.extraPages,
      children: [
        {
          path: `/${locale}/extra-pages/about-us`,
          label: sidebar.menuItem.aboutUs,
          icon: 'about-us',
        },
        {
          path: `/${locale}/extra-pages/contact-us`,
          label: sidebar.menuItem.contactUs,
          icon: 'contact-us',
        },
        {
          path: `/${locale}/extra-pages/call-outs`,
          label: sidebar.menuItem.callOuts,
          icon: 'call-outs',
        },
        {
          path: `/${locale}/extra-pages/pricing-plan`,
          label: sidebar.menuItem.pricePlan,
          icon: 'pricing-plan',
        },
        {
          path: `/${locale}/extra-pages/404`,
          label: sidebar.menuItem.error404,
          icon: '404',
          target: '_blank',
        },
        {
          path: `/${locale}/extra-pages/500`,
          label: sidebar.menuItem.error500,
          icon: '500',
          target: '_blank',
        },
        {
          path: `/${locale}/extra-pages/lock-screen`,
          label: sidebar.menuItem.lockScreen,
          icon: 'lock-screen',
          target: '_blank',
        },
      ],
    },
    {
      label: sidebar.menu.listView,
      children: [
        {
          path: `/${locale}/list-views/projects`,
          label: sidebar.menuItem.projects,
          icon: 'projects-list',
        },

        {
          path: `/${locale}/list-views/users`,
          label: sidebar.menuItem.users,
          icon: 'users-list',
        },
      ],
    },
    {
      label: sidebar.menu.gridView,
      children: [
        {
          path: `/${locale}/grid-views/projects`,
          label: sidebar.menuItem.projects,
          icon: 'projects-grid',
        },
        {
          path: `/${locale}/grid-views/users`,
          label: sidebar.menuItem.users,
          icon: 'users-grid',
        },
      ],
    },
  ];
}
