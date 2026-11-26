"use client";
import { useState } from "react";

type Item = { name: string; qty: number; price: number };

export default function InvoiceClient() {
  const [from, setFrom] = useState("THE NEXORA TOOLS\nAyush Chauhan\nDehradun, Uttarakhand\nayushchauhan902704@gmail.com");
  const [to, setTo] = useState("Client Ka Naam\nCompany Name\nCity, State\nclient@gmail.com");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("₹");
  const [tax, setTax] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business! Payment within 7 days.");
  const [items, setItems] = useState<Item[]>([
    { name: "Website Design", qty: 1, price: 5000 },
    { name: "Logo Design", qty: 1, price: 1500 },
  ]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discountAmt = (subtotal * discount) / 100;
  const taxAmt = ((subtotal - discountAmt) * tax) / 100;
  const total = subtotal - discountAmt + taxAmt;

  const updateItem = (idx: number, key: keyof Item, val: any) => {
    const n = [...items]; (n[idx] as any)[key] = key === "name" ? val : Number(val) || 0; setItems(n);
  };
  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const input = (val: string, onChange: any, ph?: string) => (
    <input value={val} onChange={e => onChange(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#080b14", color: "white", outline: "none", boxSizing: "border-box" }} />
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: "900", margin: "8px 0 4px" }}>🧾 Invoice Generator</h1>
        <p style={{ textAlign: "center", color: "#9ba7bd", margin: "0 0 20px" }}>Professional Invoice banao - 2 minute me, 100% Free!</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "18px" }}>
            <h3 style={{ margin: "0 0 10px", color: "#9275ff" }}>From (Tumhara Business)</h3>
            <textarea value={from} onChange={e => setFrom(e.target.value)} rows={5} style={{ width: "100%", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", outline: "none", boxSizing: "border-box" }} />
            <h3 style={{ margin: "16px 0 10px", color: "#51e1d0" }}>To (Client)</h3>
            <textarea value={to} onChange={e => setTo(e.target.value)} rows={5} style={{ width: "100%", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "18px" }}>
            <h3 style={{ margin: "0 0 10px" }}>Invoice Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>Invoice No.</label>{input(invoiceNo, setInvoiceNo)}
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", colorScheme: "dark" }} />
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", colorScheme: "dark" }} />
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>Currency</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["₹", "$", "€", "£"].map(c => <button key={c} onClick={() => setCurrency(c)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: currency === c ? "#9275ff" : "rgba(255,255,255,0.07)", color: "white", fontWeight: "900", cursor: "pointer", fontSize: "16px" }}>{c}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "18px", marginTop: "16px" }}>
          <h3 style={{ margin: "0 0 12px" }}>Items / Services</h3>
          {items.map((it, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 80px 130px 130px 40px", gap: "8px", marginBottom: "8px" }}>
              {input(it.name, (v: string) => updateItem(i, "name", v), "Item name")}
              <input type="number" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }} />
              <input type="number" value={it.price} onChange={e => updateItem(i, "price", e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }} />
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", textAlign: "center", fontWeight: "800" }}>{currency}{ (it.qty * it.price).toLocaleString("en-IN") }</div>
              <button onClick={() => removeItem(i)} style={{ border: "none", background: "#FF6B6B33", color: "#FF6B6B", borderRadius: "10px", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
          ))}
          <button onClick={addItem} style={{ padding: "11px 18px", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.3)", background: "transparent", color: "white", cursor: "pointer", fontWeight: "700" }}>+ Item Add Karo</button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>Discount %</label>
              <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", marginTop: "4px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#9ba7bd" }}>GST / Tax %</label>
              <input type="number" value={tax} onChange={e => setTax(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", marginTop: "4px", borderRadius: "10px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ background: "rgba(146,117,255,0.1)", borderRadius: "14px", padding: "16px", marginTop: "16px", fontSize: "15px", lineHeight: "2" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><b>{currency}{subtotal.toLocaleString("en-IN")}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#FF6B6B" }}><span>Discount ({discount}%)</span><b>- {currency}{discountAmt.toLocaleString("en-IN")}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>GST / Tax ({tax}%)</span><b>+ {currency}{taxAmt.toLocaleString("en-IN")}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "8px", fontSize: "22px" }}><span>Total</span><b style={{ color: "#51e1d0" }}>{currency}{total.toLocaleString("en-IN")}</b></div>
          </div>

          <label style={{ fontSize: "12px", color: "#9ba7bd", display: "block", marginTop: "14px" }}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ width: "100%", marginTop: "6px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", boxSizing: "border-box" }} />
        </div>

        <div style={{ background: "white", color: "black", borderRadius: "18px", padding: "28px", marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><h2 style={{ margin: 0, fontSize: "28px" }}>INVOICE</h2><p style={{ color: "#666", margin: "4px 0" }}>#{invoiceNo}</p></div>
            <div style={{ textAlign: "right", fontSize: "13px", color: "#444" }}><b>Date:</b> {date}<br /><b>Due:</b> {dueDate || "-"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px", fontSize: "13px", lineHeight: "1.7" }}>
            <div><b>FROM</b><pre style={{ margin: "4px 0", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{from}</pre></div>
            <div><b>BILL TO</b><pre style={{ margin: "4px 0", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{to}</pre></div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
            <thead><tr style={{ background: "#080b14", color: "white" }}><th style={{ padding: "10px", textAlign: "left", borderRadius: "8px 0 0 8px" }}>Item</th><th style={{ padding: "10px" }}>Qty</th><th style={{ padding: "10px" }}>Price</th><th style={{ padding: "10px", textAlign: "right", borderRadius: "0 8px 8px 0" }}>Amount</th></tr></thead>
            <tbody>{items.map((it, i) => <tr key={i} style={{ borderBottom: "1px solid #eee" }}><td style={{ padding: "10px" }}>{it.name || "-"}</td><td style={{ padding: "10px", textAlign: "center" }}>{it.qty}</td><td style={{ padding: "10px", textAlign: "center" }}>{currency}{it.price.toLocaleString("en-IN")}</td><td style={{ padding: "10px", textAlign: "right" }}>{currency}{(it.qty * it.price).toLocaleString("en-IN")}</td></tr>)}</tbody>
          </table>
          <div style={{ textAlign: "right", marginTop: "16px", lineHeight: "1.9", fontSize: "14px" }}>
            Subtotal: {currency}{subtotal.toLocaleString("en-IN")}<br />Discount: - {currency}{discountAmt.toLocaleString("en-IN")}<br />GST ({tax}%): + {currency}{taxAmt.toLocaleString("en-IN")}<br /><b style={{ fontSize: "22px" }}>Total: {currency}{total.toLocaleString("en-IN")}</b>
          </div>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "#666", borderTop: "1px solid #eee", paddingTop: "12px" }}>{notes}</p>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#999" }}>Made with THE NEXORA TOOLS - thenexoratools.com</p>
        </div>

        <button onClick={() => window.print()} style={{ width: "100%", padding: "18px", marginTop: "16px", borderRadius: "14px", border: "none", background: "#51e1d0", color: "black", fontWeight: "900", fontSize: "18px", cursor: "pointer" }}>🖨️ PRINT / PDF DOWNLOAD KARO</button>
        <p style={{ textAlign: "center", color: "#77839a", fontSize: "12px", marginTop: "14px" }}>Print dabao → Destination me “Save as PDF” select karo • 100% Free • THE NEXORA TOOLS</p>
      </div>
    </div>
  );
}
