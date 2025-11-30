import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import pool from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_archived = FALSE
      ORDER BY p.product_id DESC
    `)
    return NextResponse.json({ products: rows })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      category_id,
      description,
      sku,
      price,
      cost_price,
      stock,
      min_stock,
      expiry_date,
    } = body
    const userId = req.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [res] = await conn.query(
        `INSERT INTO products (category_id, name, description, sku, price, cost_price, stock, min_stock, expiry_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category_id || null,
          name,
          description || null,
          sku || null,
          price || 0,
          cost_price || null,
          stock || 0,
          min_stock || 0,
          expiry_date || null,
        ],
      )
      // @ts-ignore
      const insertId = (res as any).insertId

      // optional audit log
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'CREATE', 'products', ?, NOW())`,
          [userId, insertId],
        )
      }

      const [rows] = await conn.query(
        `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.product_id = ?`,
        [insertId],
      )

      await conn.commit()
      return NextResponse.json((rows as any[])[0])
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
