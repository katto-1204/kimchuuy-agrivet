import { query } from "@/lib/db"
import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT 
        s.*,
        u.full_name as user_name,
        c.name as customer_name,
        GROUP_CONCAT(
          JSON_OBJECT(
            'sale_item_id', si.sale_item_id,
            'product_id', si.product_id,
            'quantity', si.quantity,
            'unit_price', si.unit_price,
            'subtotal', si.subtotal,
            'product_name', p.name,
            'sku', p.sku
          ) SEPARATOR ','
        ) as items_json
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN customers c ON s.customer_id = c.customer_id
      LEFT JOIN sale_items si ON s.sale_id = si.sale_id
      LEFT JOIN products p ON si.product_id = p.product_id
      GROUP BY s.sale_id
      ORDER BY s.sale_date DESC
      LIMIT 100
    `
    const results = await query(sql, [])
    
    // Parse items_json back to array
    const sales = (results as any[]).map((sale) => {
      const parsed = {
        ...sale,
        items: sale.items_json 
          ? JSON.parse(`[${sale.items_json}]`)
          : [],
      }
      delete parsed.items_json
      return parsed
    })

    return NextResponse.json({ sales })
  } catch (error) {
    console.error("GET /api/sales error:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      customer_id,
      items, // Array of { product_id, quantity }
      discount = 0,
      vat,
      total,
      amount_paid,
      change_amount,
      payment_method,
      reference_number,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart cannot be empty" }, { status: 400 })
    }

    if (!user_id || !payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate subtotal from items
    let subtotal = 0
    const itemsWithPrice = []

    for (const item of items) {
      const productResult = await query("SELECT * FROM products WHERE product_id = ?", [
        item.product_id,
      ])
      const products = productResult as any[]

      if (products.length === 0) {
        return NextResponse.json(
          { error: `Product ${item.product_id} not found` },
          { status: 404 },
        )
      }

      const product = products[0]

      // Check stock
      if (item.quantity > product.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 },
        )
      }

      const itemSubtotal = product.price * item.quantity
      subtotal += itemSubtotal
      itemsWithPrice.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemSubtotal,
      })
    }

    // Use a dedicated connection and transaction to ensure consistency
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [saleResult] = await conn.query(
        `INSERT INTO sales 
          (user_id, customer_id, sale_date, subtotal, discount, vat, total, amount_paid, change_amount, payment_method, reference_number)
          VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          customer_id || null,
          subtotal,
          discount,
          vat || (subtotal - discount) * 0.12,
          total || subtotal - discount + (vat || (subtotal - discount) * 0.12),
          amount_paid,
          change_amount,
          payment_method,
          reference_number || null,
        ],
      )

      const saleId = (saleResult as any).insertId

      // Insert sale items and deduct stock
      for (const item of itemsWithPrice) {
        await conn.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [saleId, item.product_id, item.quantity, item.unit_price, item.subtotal],
        )

        // Deduct stock
        const [updateResult] = await conn.query(
          `UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?`,
          [item.quantity, item.product_id, item.quantity],
        )

        // If stock update affected 0 rows, rollback and return error
        if ((updateResult as any).affectedRows === 0) {
          await conn.rollback()
          conn.release()
          return NextResponse.json(
            { error: `Insufficient stock for product ${item.product_id}` },
            { status: 400 },
          )
        }
      }

      // Audit log (created_at column exists; don't use non-existent `timestamp`)
      await conn.query(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at)
         VALUES (?, 'CREATE', 'sales', ?, NOW())`,
        [user_id, saleId],
      )

      await conn.commit()
      conn.release()

      return NextResponse.json({
        sale_id: saleId,
        message: "Sale recorded successfully",
      })
    } catch (txErr) {
      try {
        await conn.rollback()
      } catch (rbErr) {
        console.error("Rollback failed:", rbErr)
      }
      conn.release()
      console.error("Transaction error in POST /api/sales:", txErr)
      const errMessage = (process.env.NODE_ENV === 'production')
        ? 'Failed to record sale (transaction)'
        : String((txErr as any)?.message || txErr)
      return NextResponse.json({ error: errMessage }, { status: 500 })
    }
  } catch (error) {
    console.error("POST /api/sales error:", error)
    return NextResponse.json({ error: "Failed to record sale" }, { status: 500 })
  }
}
