import { query } from "@/lib/db"
import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const saleId = parseInt(id)

    if (isNaN(saleId)) {
      return NextResponse.json({ error: "Invalid sale ID" }, { status: 400 })
    }

    const saleResults = await query(
      `SELECT s.*, u.full_name as user_name, c.name as customer_name
       FROM sales s
       LEFT JOIN users u ON s.user_id = u.user_id
       LEFT JOIN customers c ON s.customer_id = c.customer_id
       WHERE s.sale_id = ?`,
      [saleId],
    )

    if ((saleResults as any[]).length === 0) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    const itemResults = await query(
      `SELECT si.*, p.name as product_name, p.sku
       FROM sale_items si
       JOIN products p ON si.product_id = p.product_id
       WHERE si.sale_id = ?`,
      [saleId],
    )

    return NextResponse.json({
      sale: (saleResults as any[])[0],
      items: itemResults,
    })
  } catch (error) {
    console.error("GET /api/sales/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch sale" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const saleId = parseInt(id)
    const userId = request.headers.get("X-User-Id")

    if (isNaN(saleId)) {
      return NextResponse.json({ error: "Invalid sale ID" }, { status: 400 })
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // Fetch sale and items to restore stock
      const [saleResults] = await conn.query("SELECT * FROM sales WHERE sale_id = ?", [saleId])
      if ((saleResults as any[]).length === 0) {
        await conn.rollback()
        return NextResponse.json({ error: "Sale not found" }, { status: 404 })
      }

      const [itemResults] = await conn.query("SELECT * FROM sale_items WHERE sale_id = ?", [saleId])

      // Restore stock
      for (const item of itemResults as any[]) {
        await conn.query(`UPDATE products SET stock = stock + ? WHERE product_id = ?`, [item.quantity, item.product_id])
      }

      // Delete sale items
      await conn.query("DELETE FROM sale_items WHERE sale_id = ?", [saleId])

      // Soft delete sale (mark as voided)
      await conn.query("UPDATE sales SET is_voided = TRUE, void_reason = ? WHERE sale_id = ?", ["User voided", saleId])

      // Audit log
      if (userId) {
        await conn.query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at) VALUES (?, 'DELETE', 'sales', ?, NOW())`,
          [userId, saleId],
        )
      }

      await conn.commit()
      return NextResponse.json({ message: "Sale voided successfully" })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("DELETE /api/sales/[id] error:", error)
    return NextResponse.json({ error: "Failed to void sale" }, { status: 500 })
  }
}
