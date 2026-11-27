"use client";

import { useMemo, useState } from "react";

type Item = { id: number; name: string; qty: number; price: number };

export default function InvoiceClient() {
  const [step, setStep] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [business, setBusiness] = useState({ name: "", phone: "", address: "" });
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invDate, setInvDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<Item[]>([{ id: 1, name: "", qty: 1, price: 0 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);
  const discountAmt = subtotal * (discount / 100);
  const taxable = Math.max(0, subtotal - discountAmt);
  const taxAmt = taxable * (tax / 100);
  const total = taxable + taxAmt;

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fillDemo = () => {
    setBusiness({ name: "Ayush Sharma", phone: "98765 43210", address: "Dehradun, Uttarakhand" });
    setCustomer({ name: "Rakesh Kumar", phone: "91234 56780" });
    setItems([{ id: 1, name: "Website Design", qty: 1, price: 5000 }]);
    setInvoiceNo("INV-001");
  };

  const resetAll = () => {
    setBusiness({ name: "", phone: "", address: "" });
    setCustomer({ name: "", phone: "" });
    setItems([{ id: 1, name: "", qty: 1, price: 0 }]);
    setTax(0); setDiscount(0); setGst(""); setNotes(""); setStep(1); setShowPreview(false);
  };

  const updateItem = (id: number, field: keyof Item, val: string | number) => {
    setItems((p) => p.map((it) => it.id === id ? { ...it, [field]: field === "name" ? val : Number(val) } : it));
  };

  const canStep1 = business.name.trim() !== "";
  const canStep2 = customer.name.trim() !== "";
  const canStep3 = items.some((i) => i.name.trim() !== "" && i.price > 0);
  const isReady = canStep1 && canStep2 && canStep3;

  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <div className="badge"><span /> FREE INVOICE MAKER • 100% FREE</div>
          <h1>Invoice Banao<br /><span>2 Minute Me.</span></h1>
          <p>Bas 3 step me - Naam likho, Item likho, Download karo.</p>
          <div className="top-btns">
            <button type="button" onClick={fillDemo} className="demo-btn">✨ Demo Bharo - Dekho Kaise Banta Hai</button>
            <button type="button" onClick={resetAll} className="reset-btn">↻ Reset</button>
          </div>
        </header>

        {/* PROGRESS - BADA AUR SAAF */}
        <div className="steps">
          <button type="button" onClick={() => setStep(1)} className={step === 1 ? "st active" : "st done"}><b>{step > 1 ? "✓" : "1"}</b> Aapka Naam</button>
          <div className="line" />
          <button type="button" onClick={() => canStep1 && setStep(2)} className={step === 2 ? "st active" : step > 2 ? "st done" : "st"}><b>{step > 2 ? "✓" : "2"}</b> Customer</button>
          <div className="line" />
          <button type="button" onClick={() => canStep1 && canStep2 && setStep(3)} className={step === 3 ? "st active" : "st"}><b>3</b> Item + Bill</button>
        </div>

        <div className="total-bar">
          <div><span>TOTAL BILL</span><strong>{fmt(total)}</strong></div>
          <div className="total-small">Item: {fmt(subtotal)} • Tax: {fmt(taxAmt)}</div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <section className="card">
            <div className="card-head"><div className="no">1</div><div><h2>Aapka Naam Kya Hai?</h2><p>Ye naam bill pe upar dikhega.</p></div></div>
            <label>Aapka / Dukaan Ka Naam *</label>
            <input className="big" placeholder="Jaise - Ayush Sharma / NEXORA" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
            <label>Aapka Phone Number</label>
            <input className="big" placeholder="Jaise - 98765 43210" inputMode="numeric" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} />
            <label>Aapka Address (Zaroori Nahi)</label>
            <textarea placeholder="Jaise - Dehradun, Uttarakhand" rows={2} value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} />
            {!canStep1 && <p className="hint">👆 Pehle apna naam likho, fir Aage Badho dabao</p>}
            <button type="button" disabled={!canStep1} onClick={() => setStep(2)} className="next">Aage Badho →</button>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="card">
            <div className="card-head"><div className="no">2</div><div><h2>Kisko Bill Dena Hai?</h2><p>Jisne aapse samaan liya, uska naam likho.</p></div></div>
            <label>Customer Ka Naam *</label>
            <input className="big" placeholder="Jaise - Rakesh Kumar" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <label>Customer Ka Phone (Zaroori Nahi)</label>
            <input className="big" placeholder="Jaise - 91234 56780" inputMode="numeric" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <label>Bill Number</label>
            <input className="big" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            <label>Bill Ki Date</label>
            <input className="big" type="date" value={invDate} onChange={(e) => setInvDate(e.target.value)} />
            <div className="btn-row">
              <button type="button" onClick={() => setStep(1)} className="back">← Peeche</button>
              <button type="button" disabled={!canStep2} onClick={() => setStep(3)} className="next flex1">Aage Badho →</button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="card">
            <div className="card-head"><div className="no">3</div><div><h2>Kya Becha Hai?</h2><p>Cheez ka naam aur kitne ka becha, wo likho.</p></div></div>
            <div className="item-head"><span>CHEZ KA NAAM</span><span>QTY</span><span>PAISA</span><span /></div>
            {items.map((it) => (
              <div className="item-row" key={it.id}>
                <input placeholder="Jaise - Hair Cut / Website" value={it.name} onChange={(e) => updateItem(it.id, "name", e.target.value)} />
                <input type="number" min={1} value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} />
                <div className="price-box"><span>₹</span><input type="number" min={0} placeholder="0" value={it.price || ""} onChange={(e) => updateItem(it.id, "price", e.target.value)} /></div>
                {items.length > 1 && <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="del">×</button>}
              </div>
            ))}
            <button type="button" onClick={() => setItems((p) => [...p, { id: Date.now(), name: "", qty: 1, price: 0 }])} className="add">+ Ek Aur Cheez Jodo</button>

            <button type="button" onClick={() => setShowMore(!showMore)} className="more-btn">{showMore ? "− GST / Discount Band Karo" : "+ GST / Discount / Notes Add Karna Hai?"}</button>
            {showMore && (
              <div className="more-box">
                <div className="two"><div><label>GST Number (Ho to)</label><input placeholder="GST Number" value={gst} onChange={(e) => setGst(e.target.value)} /></div><div><label>Tax %</label><input type="number" placeholder="0" value={tax || ""} onChange={(e) => setTax(Number(e.target.value))} /></div></div>
                <label>Discount %</label><input type="number" placeholder="0" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} />
                <label>Note / Dhanyawad Message</label><textarea placeholder="Jaise - Dhanyawad! Dobara Zaroor Aana." rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            )}

            <div className="bill-box">
              <div><span>Subtotal</span><b>{fmt(subtotal)}</b></div>
              {discount > 0 && <div><span>Discount ({discount}%)</span><b>-{fmt(discountAmt)}</b></div>}
              {tax > 0 && <div><span>Tax ({tax}%)</span><b>{fmt(taxAmt)}</b></div>}
              <div className="grand"><span>Total Bill</span><b>{fmt(total)}</b></div>
            </div>
            {!canStep3 && <p className="hint">👆 Pehle cheez ka naam aur paisa likho</p>}
            <div className="btn-row">
              <button type="button" onClick={() => setStep(2)} className="back">← Peeche</button>
              <button type="button" disabled={!canStep3} onClick={() => setShowPreview(true)} className="next flex1">Bill Dekho →</button>
            </div>
          </section>
        )}

        <footer><span>100% Free</span><span>•</span><span>No Sign-up</span><span>•</span><span>1 Page Invoice</span></footer>
      </div>

      {showPreview && (
        <div className="modal" onClick={() => setShowPreview(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="toolbar"><div><b>Bill Preview</b><span>Check karke Download karo</span></div><div className="t-btns"><button type="button" onClick={() => window.print()} className="print">Print / Save PDF</button><button type="button" onClick={() => setShowPreview(false)} className="close">×</button></div></div>
            <div className="paper">
              <div className="p-top"><div><h2>{business.name || "Your Business"}</h2><p>{business.address}</p><p>{business.phone}</p>{gst && <p>GST: {gst}</p>}</div><div className="p-right"><h1>INVOICE</h1><p><b>#{invoiceNo}</b></p><p>Date: {invDate}</p></div></div>
              <div className="billto"><span>BILL TO</span><b>{customer.name}</b><p>{customer.phone}</p></div>
              <table><thead><tr><th>Cheez</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>{items.filter((i) => i.name.trim() !== "" || i.price > 0).map((i) => (<tr key={i.id}><td>{i.name || "Item"}</td><td>{i.qty}</td><td>{fmt(i.price)}</td><td>{fmt(i.qty * i.price)}</td></tr>))}</tbody></table>
              <div className="p-bottom"><div>{notes && <><b>Note</b><p>{notes}</p></>}</div><div className="p-total"><div><span>Subtotal</span><b>{fmt(subtotal)}</b></div>{discount > 0 && <div><span>Discount</span><b>-{fmt(discountAmt)}</b></div>}{tax > 0 && <div><span>Tax ({tax}%)</span><b>{fmt(taxAmt)}</b></div>}<div className="gt"><span>Total</span><b>{fmt(total)}</b></div></div></div>
              <div className="thanks">Thank You! Dobara Zaroor Aana.</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        *{box-sizing:border-box}
        .page{width:100%;min-height:100vh;overflow-x:hidden;background:#f6f7fb;color:#171925;padding:22px 12px 70px;font-family:"Plus Jakarta Sans",Inter,-apple-system,"Segoe UI",sans-serif}
        .shell{width:100%;max-width:640px;margin:0 auto}
        .hero{text-align:center;margin-bottom:16px}
        .badge{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid #e5e7ef;border-radius:999px;background:#fff;color:#777b8c;font-size:9px;font-weight:800;letter-spacing:.1em}.badge span{width:6px;height:6px;border-radius:50%;background:#16a36a}
        .hero h1{margin:12px 0 6px;font-size:clamp(30px,8vw,42px);line-height:1.05;letter-spacing:-.04em;font-weight:950}.hero h1 span{color:#6c5ce7}
        .hero p{margin:0;color:#858997;font-size:12px;font-weight:500}
        .top-btns{display:flex;gap:8px;justify-content:center;margin-top:12px}.demo-btn{border:0;background:#6c5ce7;color:#fff;padding:10px 14px;border-radius:999px;font-size:10px;font-weight:900;cursor:pointer}.reset-btn{border:1px solid #e3e5ec;background:#fff;color:#666978;padding:10px 14px;border-radius:999px;font-size:10px;font-weight:800;cursor:pointer}
        .steps{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #e7e9ef;border-radius:999px;padding:6px;margin-bottom:12px}.st{display:flex;align-items:center;gap:6px;border:0;background:transparent;color:#999ca8;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap}.st b{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#f0f1f5;color:#777b88;font-size:11px}.st.active{color:#6c5ce7}.st.active b{background:#6c5ce7;color:#fff}.st.done{color:#16a36a}.st.done b{background:#e6f8f0;color:#16a36a}.line{flex:1;height:1px;background:#eceef3;min-width:8px}
        .total-bar{display:flex;justify-content:space-between;align-items:center;background:#171925;color:#fff;padding:14px 16px;border-radius:16px;margin-bottom:12px}.total-bar span{display:block;color:#999baa;font-size:8px;font-weight:900;letter-spacing:.12em}.total-bar strong{display:block;font-size:26px;line-height:1;margin-top:3px}.total-small{font-size:10px;color:#c8c9d1;text-align:right}
        .card{background:#fff;border:1px solid #e6e8ef;border-radius:20px;padding:18px;box-shadow:0 10px 30px rgba(31,35,55,.05)}
        .card-head{display:flex;gap:11px;margin-bottom:16px}.no{display:grid;place-items:center;flex:0 0 auto;width:34px;height:34px;border-radius:11px;background:#6c5ce7;color:#fff;font-size:14px;font-weight:900}.card-head h2{margin:0;font-size:19px;font-weight:900;letter-spacing:-.02em}.card-head p{margin:3px 0 0;color:#999ca8;font-size:11px}
        label{display:block;margin:12px 0 6px;color:#454857;font-size:12px;font-weight:800}
        input,textarea{width:100%;border:1.5px solid #e4e6ed;outline:none;background:#fafbfc;color:#181a25;border-radius:12px;font-family:inherit;font-size:14px;font-weight:700;padding:0 12px}input{height:50px}textarea{padding:12px;resize:vertical}input:focus,textarea:focus{border-color:#6c5ce7;background:#fff;box-shadow:0 0 0 3px rgba(108,92,231,.1)}input::placeholder,textarea::placeholder{color:#b0b3bd;font-weight:600;font-size:13px}.big{height:52px}
        .hint{text-align:center;color:#d33;background:#fff1f1;padding:9px;border-radius:9px;font-size:12px;font-weight:700;margin:12px 0 0}
        .next{width:100%;height:52px;margin-top:16px;border:0;border-radius:14px;background:#171925;color:#fff;font-size:14px;font-weight:900;cursor:pointer}.next:disabled{opacity:.4;cursor:not-allowed}
        .btn-row{display:flex;gap:8px;margin-top:16px}.back{height:52px;padding:0 16px;border:1px solid #e3e5ec;border-radius:14px;background:#fff;color:#555867;font-size:13px;font-weight:800;cursor:pointer}.flex1{flex:1;margin:0}
        .item-head{display:grid;grid-template-columns:1fr 58px 105px 28px;gap:8px;padding:0 2px 6px;color:#999ca8;font-size:8px;font-weight:900;letter-spacing:.06em}
        .item-row{display:grid;grid-template-columns:1fr 58px 105px 28px;gap:8px;margin-bottom:8px;align-items:center}.item-row input{height:50px}.price-box{display:flex;align-items:center;border:1.5px solid #e4e6ed;border-radius:12px;background:#fff;overflow:hidden;height:50px}.price-box span{padding-left:10px;font-weight:900;color:#999ca8}.price-box input{border:0;box-shadow:none!important;padding-left:4px}.del{width:28px;height:50px;border:0;border-radius:10px;background:#fff1f1;color:#dc5757;font-size:20px;cursor:pointer}.add{border:0;background:transparent;color:#6c5ce7;font-size:12px;font-weight:900;cursor:pointer;margin:2px 0 10px}
        .more-btn{width:100%;padding:11px;border:1px dashed #c9c5ee;border-radius:11px;background:#f7f6ff;color:#6c5ce7;font-size:12px;font-weight:800;cursor:pointer}.more-box{margin-top:10px;padding:12px;border-radius:12px;background:#fafbfc;border:1px solid #eee}.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .bill-box{margin-top:14px;padding:12px;border-radius:12px;background:#f7f7fa}.bill-box>div{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px}.bill-box .grand{border-top:1px solid #ddd;padding-top:8px;margin:0;font-size:15px}.bill-box .grand b{color:#6c5ce7;font-size:18px}
        footer{display:flex;justify-content:center;gap:8px;margin-top:18px;color:#a5a8b3;font-size:9px;font-weight:700}
        .modal{position:fixed;inset:0;z-index:1000;display:flex;justify-content:center;padding:14px;background:rgba(14,15,23,.6);backdrop-filter:blur(6px);overflow:auto}.modal-box{width:min(760px,100%);height:fit-content;border-radius:18px;background:#f4f5f8;overflow:hidden}.toolbar{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#fff;border-bottom:1px solid #e2e4ea}.toolbar b{font-size:13px}.toolbar span{display:block;color:#979aa6;font-size:9px}.t-btns{display:flex;gap:7px}.print{height:36px;padding:0 12px;border:0;border-radius:9px;background:#171925;color:#fff;font-size:11px;font-weight:900;cursor:pointer}.close{width:36px;height:36px;border:1px solid #e4e6ec;border-radius:9px;background:#fff;font-size:20px;cursor:pointer}
        .paper{width:calc(100% - 28px);margin:14px auto;background:#fff;padding:30px;box-shadow:0 8px 25px rgba(0,0,0,.06)}.p-top{display:flex;justify-content:space-between;gap:20px;padding-bottom:18px;border-bottom:1px solid #e8e9ee}.p-top h2{margin:0 0 5px;font-size:20px;font-weight:950}.p-top p{margin:2px 0;color:#777a86;font-size:10px}.p-right{text-align:right}.p-right h1{margin:0;color:#6c5ce7;font-size:24px}.billto{margin:16px 0;padding:12px;border-radius:9px;background:#f7f7fa}.billto span{display:block;color:#999ca7;font-size:8px;font-weight:900}.billto b{font-size:13px}.billto p{margin:2px 0;color:#777a86;font-size:10px}table{width:100%;border-collapse:collapse}th{padding:8px 6px;border-bottom:1px solid #e3e5eb;color:#898c98;font-size:8px;text-align:left}th:not(:first-child),td:not(:first-child){text-align:right}td{padding:10px 6px;border-bottom:1px solid #f0f1f4;font-size:11px;font-weight:600}.p-bottom{display:flex;justify-content:space-between;gap:20px;margin-top:18px}.p-total{width:220px}.p-total>div{display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px}.p-total .gt{border-top:1px solid #ddd;padding-top:8px}.p-total .gt b{color:#6c5ce7;font-size:16px}.thanks{margin-top:22px;padding-top:12px;border-top:1px solid #e8e9ee;text-align:center;color:#999ca7;font-size:10px}
        @media(max-width:560px){.page{padding:16px 10px 60px}.hero h1{font-size:30px}.total-bar strong{font-size:22px}.item-head{display:none}.item-row{grid-template-columns:1fr 58px 105px}.item-row input:first-child{grid-column:1/-1}.del{grid-column:1/-1;width:100%;height:36px}.two{grid-template-columns:1fr}.p-top{flex-direction:column}.p-right{text-align:left}.paper{width:calc(100% - 12px);padding:18px 14px}.p-bottom{flex-direction:column}.p-total{width:100%}.st{font-size:9px}.steps{overflow-x:auto}}
        @media print{
          body{background:#fff!important}
          .page{padding:0!important;background:#fff!important}
          .shell,.hero,.steps,.total-bar,.card,footer,.toolbar{display:none!important}
          .modal{position:static!important;padding:0!important;background:#fff!important;overflow:visible!important;display:block!important}
          .modal-box{width:100%!important;max-width:100%!important;background:#fff!important;box-shadow:none!important}
          .paper{width:100%!important;margin:0!important;box-shadow:none!important;padding:20px!important}
          @page{size:A4;margin:12mm}
        }
      `}</style>
    </main>
  );
}
