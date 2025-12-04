import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import type { Context } from 'hono'

// 导入路由
import { authRouter } from './routes/auth'
import { domainsRouter } from './routes/domains'
import { certificatesRouter } from './routes/certificates'
import { usersRouter } from './routes/users'

export interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS 配置
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ssl-manager-web.pages.dev', 'https://ssl-manager-admin.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// 健康检查
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 公开路由（不需要认证）
app.route('/api/auth', authRouter)

// JWT 中间件
app.use('/api/*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET || 'your-secret-key',
  })
  return jwtMiddleware(c, next)
})

// 需要认证的路由
app.route('/api/domains', domainsRouter)
app.route('/api/certificates', certificatesRouter)
app.route('/api/users', usersRouter)

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app