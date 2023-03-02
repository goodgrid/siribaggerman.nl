
export const Config = {
    strapiHost: ((process.env.NEXT_PUBLIC_STRAPI_HOST!==undefined)?process.env.NEXT_PUBLIC_STRAPI_HOST:"http://localhost:1337"),
    matomoHost: ((process.env.NEXT_PUBLIC_MATOMO_HOST!==undefined)?process.env.NEXT_PUBLIC_MATOMO_HOST:"https://goodgrid.nl/matomo/"),
    matomoSiteId: ((process.env.NEXT_PUBLIC_MATOMO_SITE_ID!==undefined)?process.env.NEXT_PUBLIC_MATOMO_SITE_ID:3)
}