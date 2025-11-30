import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import pool from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rows = await query(
      `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.product_id = ?`,
      [id],
    )
    if (!rows || (rows as any).length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json((rows as any)[0])
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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
      is_archived,
    } = body

    const userId = req.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(
        `UPDATE products SET category_id = ?, name = ?, description = ?, sku = ?, price = ?, cost_price = ?, stock = ?, min_stock = ?, expiry_date = ?, is_archived = ? WHERE product_id = ?`,
        [category_id || null, name, description || null, sku || null, price || 0, cost_price || null, stock || 0, min_stock || 0, expiry_date || null, is_archived ? 1 : 0, id],
      )

      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'UPDATE', 'products', ?, NOW())`,
          [userId, id],
        )
      }

      const [rows] = await conn.query(
        `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.product_id = ?`,
        [id],
      )
      await conn.commit()
      return NextResponse.json((rows as any)[0])
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Soft-delete: mark archived
    const userId = req.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(`UPDATE products SET is_archived = TRUE WHERE product_id = ?`, [id])
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'DELETE', 'products', ?, NOW())`,
          [userId, id],
        )
      }
      await conn.commit()
      return NextResponse.json({ success: true })
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
