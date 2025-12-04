import { Hono } from 'hono'
import type { Env } from '../index'

export const usersRouter = new Hono<{ Bindings: Env }>()

// 获取所有用户
usersRouter.get('/', async c => {
    const { results } = await c.env.DB.prepare(
        `
    SELECT id, username, email, role, status, created_at, last_login
    FROM users 
    ORDER BY created_at DESC
  `
    ).all()

    return c.json(results)
})

// 获取单个用户详情
usersRouter.get('/:id', async c => {
    const id = c.req.param('id')

    const user = await c.env.DB.prepare(
        `
    SELECT id, username, email, role, status, created_at, last_login
    FROM users WHERE id = ?
  `
    )
        .bind(id)
        .first()

    if (!user) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
})

// 创建用户
usersRouter.post('/', async c => {
    const { username, email, password, role = 'user', status = 'active' } = await c.req.json()

    if (!username || !email) {
        return c.json({ error: 'Username and email are required' }, 400)
    }

    // 检查用户名是否已存在
    const existingUser = await c.env.DB.prepare(
        `
    SELECT id FROM users WHERE username = ? OR email = ?
  `
    )
        .bind(username, email)
        .first()

    if (existingUser) {
        return c.json({ error: 'Username or email already exists' }, 400)
    }

    const result = await c.env.DB.prepare(
        `
    INSERT INTO users (username, email, password_hash, role, status, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `
    )
        .bind(username, email, password, role, status)
        .run()

    const newUser = await c.env.DB.prepare(
        `
    SELECT id, username, email, role, status, created_at
    FROM users WHERE id = ?
  `
    )
        .bind(result.meta.last_row_id)
        .first()

    return c.json(newUser, 201)
})

// 更新用户
usersRouter.put('/:id', async c => {
    const id = c.req.param('id')
    const { username, email, role, status } = await c.req.json()

    await c.env.DB.prepare(
        `
    UPDATE users 
    SET username = COALESCE(?, username),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        status = COALESCE(?, status),
        updated_at = datetime('now')
    WHERE id = ?
  `
    )
        .bind(username, email, role, status, id)
        .run()

    const updatedUser = await c.env.DB.prepare(
        `
    SELECT id, username, email, role, status, created_at, updated_at
    FROM users WHERE id = ?
  `
    )
        .bind(id)
        .first()

    return c.json(updatedUser)
})

// 删除用户
usersRouter.delete('/:id', async c => {
    const id = c.req.param('id')

    await c.env.DB.prepare(
        `
    DELETE FROM users WHERE id = ?
  `
    )
        .bind(id)
        .run()

    return c.json({ message: 'User deleted successfully' })
})
