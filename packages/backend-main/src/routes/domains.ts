import { Hono } from 'hono'
import type { Env } from '../index'

export const domainsRouter = new Hono<{ Bindings: Env }>()

// 获取所有域名
domainsRouter.get('/', async c => {
  const { results } = await c.env.DB.prepare(
    `
    SELECT * FROM domains 
    ORDER BY created_at DESC
  `
  ).all()

  return c.json(results)
})

// 获取单个域名详情
domainsRouter.get('/:id', async c => {
  const id = c.req.param('id')

  const domain = await c.env.DB.prepare(
    `
    SELECT * FROM domains WHERE id = ?
  `
  )
    .bind(id)
    .first()

  if (!domain) {
    return c.json({ error: 'Domain not found' }, 404)
  }

  // 获取相关证书
  const certificates = await c.env.DB.prepare(
    `
    SELECT * FROM certificates WHERE domain_id = ?
    ORDER BY valid_to DESC
  `
  )
    .bind(id)
    .all()

  return c.json({
    ...domain,
    certificates: certificates.results,
  })
})

// 创建域名
domainsRouter.post('/', async c => {
  const { name, description, status = 'active' } = await c.req.json()

  if (!name) {
    return c.json({ error: 'Domain name is required' }, 400)
  }

  const result = await c.env.DB.prepare(
    `
    INSERT INTO domains (name, description, status, created_at, updated_at)
    VALUES (?, ?, ?, datetime('now'), datetime('now'))
  `
  )
    .bind(name, description, status)
    .run()

  const newDomain = await c.env.DB.prepare(
    `
    SELECT * FROM domains WHERE id = ?
  `
  )
    .bind(result.meta.last_row_id)
    .first()

  return c.json(newDomain, 201)
})

// 更新域名
domainsRouter.put('/:id', async c => {
  const id = c.req.param('id')
  const { name, description, status } = await c.req.json()

  await c.env.DB.prepare(
    `
    UPDATE domains 
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        updated_at = datetime('now')
    WHERE id = ?
  `
  )
    .bind(name, description, status, id)
    .run()

  const updatedDomain = await c.env.DB.prepare(
    `
    SELECT * FROM domains WHERE id = ?
  `
  )
    .bind(id)
    .first()

  return c.json(updatedDomain)
})

// 删除域名
domainsRouter.delete('/:id', async c => {
  const id = c.req.param('id')

  await c.env.DB.prepare(
    `
    DELETE FROM domains WHERE id = ?
  `
  )
    .bind(id)
    .run()

  return c.json({ message: 'Domain deleted successfully' })
})
