import { Hono } from 'hono'
import type { Env } from '../types'

export const certificatesRouter = new Hono<{ Bindings: Env }>()

// 获取所有证书
certificatesRouter.get('/', async c => {
    const { results } = await c.env.DB.prepare(
        `
    SELECT c.*, d.name as domain_name 
    FROM certificates c
    LEFT JOIN domains d ON c.domain_id = d.id
    ORDER BY c.valid_to ASC
  `
    ).all()

    return c.json(results)
})

// 获取单个证书详情
certificatesRouter.get('/:id', async c => {
    const id = c.req.param('id')

    const certificate = await c.env.DB.prepare(
        `
    SELECT c.*, d.name as domain_name 
    FROM certificates c
    LEFT JOIN domains d ON c.domain_id = d.id
    WHERE c.id = ?
  `
    )
        .bind(id)
        .first()

    if (!certificate) {
        return c.json({ error: 'Certificate not found' }, 404)
    }

    return c.json(certificate)
})

// 创建证书
certificatesRouter.post('/', async c => {
    const {
        domain_id,
        certificate_data,
        private_key,
        valid_from,
        valid_to,
        status = 'valid',
    } = await c.req.json()

    if (!domain_id || !certificate_data) {
        return c.json({ error: 'Domain ID and certificate data are required' }, 400)
    }

    const result = await c.env.DB.prepare(
        `
    INSERT INTO certificates (domain_id, certificate_data, private_key, valid_from, valid_to, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `
    )
        .bind(domain_id, certificate_data, private_key, valid_from, valid_to, status)
        .run()

    const newCertificate = await c.env.DB.prepare(
        `
    SELECT c.*, d.name as domain_name 
    FROM certificates c
    LEFT JOIN domains d ON c.domain_id = d.id
    WHERE c.id = ?
  `
    )
        .bind(result.meta.last_row_id)
        .first()

    return c.json(newCertificate, 201)
})

// 更新证书状态
certificatesRouter.put('/:id/status', async c => {
    const id = c.req.param('id')
    const { status } = await c.req.json()

    await c.env.DB.prepare(
        `
    UPDATE certificates 
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `
    )
        .bind(status, id)
        .run()

    const updatedCertificate = await c.env.DB.prepare(
        `
    SELECT c.*, d.name as domain_name 
    FROM certificates c
    LEFT JOIN domains d ON c.domain_id = d.id
    WHERE c.id = ?
  `
    )
        .bind(id)
        .first()

    return c.json(updatedCertificate)
})

// 删除证书
certificatesRouter.delete('/:id', async c => {
    const id = c.req.param('id')

    await c.env.DB.prepare(
        `
    DELETE FROM certificates WHERE id = ?
  `
    )
        .bind(id)
        .run()

    return c.json({ message: 'Certificate deleted successfully' })
})
