// Cloudflare Pages Functions
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url)

        // SPA 路由处理 - 所有路径都返回 index.html
        if (
            !url.pathname.startsWith('/assets') &&
            !url.pathname.startsWith('/@') &&
            !url.pathname.startsWith('/node_modules')
        ) {
            return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request))
        }

        // 静态资源直接返回
        return env.ASSETS.fetch(request)
    },
}
