import { Hono } from 'hono'
import { SignJWT } from 'jose'
import type { Env } from '../index'

export const authRouter = new Hono<{ Bindings: Env }>()

// 管理员登录
authRouter.post('/login', async c => {
  const { username, password } = await c.req.json()

  // 简单的管理员认证（生产环境应该使用更安全的方式）
  if (username === 'admin' && password === 'admin123') {
    const payload = {
      sub: 'admin',
      username: username,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24小时过期
    }

    const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'your-secret-key')
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    return c.json({
      token,
      user: {
        username: username,
        role: 'admin',
      },
    })
  }

  return c.json({ error: 'Invalid credentials' }, 401)
})

// 验证 Token
authRouter.get('/verify', async c => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ error: 'No token provided' }, 401)
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'your-secret-key')

    // 这里应该验证 token，简化处理
    return c.json({ valid: true })
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// 获取当前用户信息
authRouter.get('/me', async c => {
  // 这里应该从 JWT 中获取用户信息
  return c.json({
    username: 'admin',
    role: 'admin',
  })
})
