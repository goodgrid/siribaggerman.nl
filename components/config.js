
export const Config = {
    strapiHost: ((process.env.NEXT_PUBLIC_STRAPI_HOST!==undefined)?process.env.NEXT_PUBLIC_STRAPI_HOST:"http://localhost:1337"),
    umamiWebsiteId: ((process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID!==undefined)?process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID:"dbb359e7-6c68-4de4-9a24-6383d2aff69d")
}