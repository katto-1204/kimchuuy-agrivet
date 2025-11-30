import { query } from "@/lib/db"
import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const results = await query(
      `SELECT customer_id, name, phone, email, address, created_at,
              (SELECT COUNT(*) FROM sales WHERE customer_id = customers.customer_id) as total_purchases
       FROM customers
       ORDER BY name ASC`,
      [],
    )

    return NextResponse.json({ customers: results })
  } catch (error) {
    console.error("GET /api/customers error:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, address } = body

    if (!name) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 })
    }

    const userId = request.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [result] = await conn.query(
        `INSERT INTO customers (name, phone, email, address, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [name, phone || null, email || null, address || null],
      )
      // @ts-ignore
      const insertId = (result as any).insertId
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'CREATE', 'customers', ?, NOW())`,
          [userId, insertId],
        )
      }
      await conn.commit()
      return NextResponse.json({ customer_id: insertId, message: "Customer created successfully" })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("POST /api/customers error:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
