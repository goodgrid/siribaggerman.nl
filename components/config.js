
export const Config = {
    strapiHost: ((process.env.strapiHost!==undefined)?process.env.strapiHost:"https://goodgrid-strapi.sloppy.zone"),
    matomoHost: ((process.env.matomoHost!==undefined)?process.env.matomoHost:"https://goodgrid.nl/matomo/"),
    matomoSiteId: ((process.env.matomoSiteId!==undefined)?process.env.matomoSiteId:3)
}