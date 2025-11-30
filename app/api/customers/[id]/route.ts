import { query } from "@/lib/db"
import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 })
    }

    const results = await query(
      `SELECT * FROM customers WHERE customer_id = ?`,
      [customerId],
    )

    if ((results as any[]).length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ customer: (results as any[])[0] })
  } catch (error) {
    console.error("GET /api/customers/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const customerId = parseInt(id)
    const body = await request.json()
    const { name, phone, email, address } = body

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 })
    }

    const userId = request.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(
        `UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE customer_id = ?`,
        [name, phone || null, email || null, address || null, customerId],
      )
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'UPDATE', 'customers', ?, NOW())`,
          [userId, customerId],
        )
      }
      await conn.commit()
      return NextResponse.json({ message: "Customer updated successfully" })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("PUT /api/customers/[id] error:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 })
    }

    const userId = request.headers.get('X-User-Id')
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(
        `DELETE FROM customers WHERE customer_id = ?`,
        [customerId],
      )
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'DELETE', 'customers', ?, NOW())`,
          [userId, customerId],
        )
      }
      await conn.commit()
      return NextResponse.json({ message: "Customer deleted successfully" })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("DELETE /api/customers/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
