"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  qty: number;
  price: number;
};

type Business = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
};

type Customer = {
  name: string;
  email: string;
  address: string;
};

const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
];

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function makeInvoiceNumber() {
  return `INV-${String(Date.now()).slice(-6)}`;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function dueDateStr(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function InvoiceClient() {
  const [step, setStep] = useState(1);

  const [business, setBusiness] = useState<Business>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    address: "",
  });

  // FIX: Invoice number + date ab state hai, Reset pe naya banega
  const [invoiceNumber, setInvoiceNumber] = useState(makeInvoiceNumber);
  const [date, setDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueDateStr);

  const [currency, setCurrency] = useState("INR");

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", qty: 1, price: 0 },
  ]);

  const [taxStr, setTaxStr] = useState("");
  const [discountStr, setDiscountStr] = useState("");
  const [note, setNote] = useState("");

  // FIX: Teen alag state - pehle ek hi tha
  const [showBusinessAdvanced, setShowBusinessAdvanced] = useState(false);
  const [showCustomerAdvanced, setShowCustomerAdvanced] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");

  const currencyInfo =
    CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const tax = num(taxStr);
  const discount = num(discountStr);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [items]);

  const discountAmount = (subtotal * Math.min(100, discount)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * Math.min(100, tax)) / 100;
  const total = taxableAmount + taxAmount;

  const hasRequiredData =
    business.name.trim() &&
    customer.name.trim() &&
    items.some((item) => item.name.trim() && item.price > 0);

  function updateBusiness(key: keyof Business, value: string) {
    setBusiness((prev) => ({ ...prev, [key]: value }));
  }

  function updateCustomer(key: keyof Customer, value: string) {
    setCustomer((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(id: number, key: keyof Item, value: string | number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]:
                key === "qty"
                  ? Math.max(1, Math.floor(Number(value) || 1))
                  : key === "price"
                  ? Math.max(0, Number(value) || 0)
                  : value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: "", qty: 1, price: 0 },
    ]);
  }

  function removeItem(id: number) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function resetInvoice() {
    setBusiness({ name: "", email: "", phone: "", address: "", gst: "" });
    setCustomer({ name: "", email: "", address: "" });
    setItems([{ id: 1, name: "", qty: 1, price: 0 }]);
    setTaxStr("");
    setDiscountStr("");
    setNote("");
    setCurrency("INR");
    setStep(1);
    setShowBusinessAdvanced(false);
    setShowCustomerAdvanced(false);
    setShowNote(false);
    setShowAdjustments(false);
    setShowPreview(false);
    setCopiedMsg("");
    // Naya invoice number + date
    setInvoiceNumber(makeInvoiceNumber());
    setDate(todayStr());
    setDueDate(dueDateStr());
  }

  function goNext() {
    if (step === 1 && !business.name.trim()) return;
    if (step === 2 && !customer.name.trim()) return;
    setStep((prev) => Math.min(3, prev + 1));
  }

  function goBack() {
    setStep((prev) => Math.max(1, prev - 1));
  }

  function printInvoice() {
    window.print();
  }

  async function copyInvoiceTotal() {
    try {
      await navigator.clipboard.writeText(
        `Invoice ${invoiceNumber}\nTotal: ${money(total)}\nFrom: ${business.name} To: ${customer.name}`
      );
      setCopiedMsg("Copied!");
      window.setTimeout(() => setCopiedMsg(""), 1800);
    } catch {
      setCopiedMsg("Copy not available");
    }
  }

  const money = (value: number) =>
    `${currencyInfo.symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <>
      <div className="invoice-page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">N</div>
            <div>
              <h1 className="brand-name">
                thenexora<span>tools</span> • Invoice Generator
              </h1>
              <div className="brand-sub">
                Create professional invoices online in seconds
              </div>
            </div>
          </div>
          <button className="reset-btn" onClick={resetInvoice} type="button">
            ↻ Reset
          </button>
        </header>

        <div className="progress-wrap" aria-label="Invoice creation progress">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <div><b>Your details</b><small>Business information</small></div>
          </div>
          <div className="progress-line"><div style={{ width: step >= 2 ? "100%" : "0%" }} /></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <div><b>Customer</b><small>Billing information</small></div>
          </div>
          <div className="progress-line"><div style={{ width: step >= 3 ? "100%" : "0%" }} /></div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <div><b>Items</b><small>Products & services</small></div>
          </div>
        </div>

        <main className="main-grid">
          <section className="form-area">
            {step === 1 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon purple">01</div>
                  <div><h2>Your business details</h2><p>Enter the information you want to show on the invoice.</p></div>
                </div>
                <div className="quick-field">
                  <label htmlFor="business-name">Business / Your Name <span>*</span></label>
                  <input id="business-name" autoFocus type="text" value={business.name} onChange={(e) => updateBusiness("name", e.target.value)} placeholder="e.g. Acme Studio" autoComplete="organization" />
                </div>
                <div className="two-col">
                  <div className="quick-field">
                    <label htmlFor="business-email">Email <em>Optional</em></label>
                    <input id="business-email" type="email" value={business.email} onChange={(e) => updateBusiness("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
                  </div>
                  <div className="quick-field">
                    <label htmlFor="business-phone">Phone <em>Optional</em></label>
                    <input id="business-phone" type="tel" value={business.phone} onChange={(e) => updateBusiness("phone", e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                  </div>
                </div>
                <button className="advanced-toggle" onClick={() => setShowBusinessAdvanced(!showBusinessAdvanced)} type="button" aria-expanded={showBusinessAdvanced}>
                  <span>{showBusinessAdvanced ? "−" : "+"} Add business details</span><small>Address, Tax ID & more</small>
                </button>
                {showBusinessAdvanced && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label htmlFor="business-address">Business Address</label>
                      <textarea id="business-address" value={business.address} onChange={(e) => updateBusiness("address", e.target.value)} placeholder="Business address" rows={3} autoComplete="street-address" />
                    </div>
                    <div className="quick-field">
                      <label htmlFor="business-tax-id">GST / Tax ID</label>
                      <input id="business-tax-id" value={business.gst} onChange={(e) => updateBusiness("gst", e.target.value)} placeholder="Tax identification number" />
                    </div>
                  </div>
                )}
                <button className="primary-btn" disabled={!business.name.trim()} onClick={goNext} type="button">Continue to Customer <span>→</span></button>
              </div>
            )}

            {step === 2 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon teal">02</div>
                  <div><h2>Customer details</h2><p>Add the person or business receiving this invoice.</p></div>
                </div>
                <div className="quick-field">
                  <label htmlFor="customer-name">Customer Name <span>*</span></label>
                  <input id="customer-name" autoFocus type="text" value={customer.name} onChange={(e) => updateCustomer("name", e.target.value)} placeholder="e.g. John Smith" autoComplete="name" />
                </div>
                <div className="quick-field">
                  <label htmlFor="customer-email">Email <em>Optional</em></label>
                  <input id="customer-email" type="email" value={customer.email} onChange={(e) => updateCustomer("email", e.target.value)} placeholder="customer@example.com" autoComplete="email" />
                </div>
                <button className="advanced-toggle" onClick={() => setShowCustomerAdvanced(!showCustomerAdvanced)} type="button" aria-expanded={showCustomerAdvanced}>
                  <span>{showCustomerAdvanced ? "−" : "+"} Add customer address</span><small>Optional</small>
                </button>
                {showCustomerAdvanced && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label htmlFor="customer-address">Customer Address</label>
                      <textarea id="customer-address" value={customer.address} onChange={(e) => updateCustomer("address", e.target.value)} placeholder="Customer billing address" rows={3} autoComplete="street-address" />
                    </div>
                  </div>
                )}
                <div className="button-row">
                  <button className="back-btn" onClick={goBack} type="button">← Back</button>
                  <button className="primary-btn" disabled={!customer.name.trim()} onClick={goNext} type="button">Continue to Items <span>→</span></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon orange">03</div>
                  <div><h2>Add products or services</h2><p>Add each item, quantity and price to calculate the total.</p></div>
                </div>

                <div className="currency-row">
                  <div>
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                      ))}
                    </select>
                  </div>
                  <div className="invoice-meta">
                    <div><span>Invoice</span><b>{invoiceNumber}</b></div>
                    <div><span>Date</span><b>{formatDate(date)}</b></div>
                  </div>
                </div>

                <div className="two-col">
                  <div className="quick-field">
                    <label htmlFor="invoice-date">Invoice Date</label>
                    <input id="invoice-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="quick-field">
                    <label htmlFor="due-date">Due Date</label>
                    <input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="items-box">
                  <div className="items-header"><span>ITEM</span><span>QTY</span><span>PRICE</span><span /></div>
                  {items.map((item) => (
                    <div className="item-row" key={item.id}>
                      <input aria-label="Item name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Product or service" />
                      <input aria-label="Quantity" type="number" min="1" step="1" value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} />
                      <div className="price-input">
                        <span>{currencyInfo.symbol}</span>
                        <input aria-label="Price" type="number" min="0" step="0.01" value={item.price || ""} onChange={(e) => updateItem(item.id, "price", e.target.value)} placeholder="0.00" />
                      </div>
                      <button className="remove-item" onClick={() => removeItem(item.id)} disabled={items.length === 1} aria-label="Remove item" type="button">×</button>
                    </div>
                  ))}
                </div>

                <button className="add-item-btn" onClick={addItem} type="button">+ Add another item</button>

                <button className="advanced-toggle adjustment-toggle" onClick={() => setShowAdjustments(!showAdjustments)} type="button" aria-expanded={showAdjustments}>
                  <span>{showAdjustments ? "−" : "+"} Add tax or discount</span><small>Optional</small>
                </button>

                {showAdjustments && (
                  <div className="adjustments">
                    <div className="adjustment-field">
                      <label htmlFor="tax">Tax</label>
                      <div className="percent-input">
                        <input id="tax" type="number" min="0" max="100" step="0.01" value={taxStr} onChange={(e) => setTaxStr(e.target.value)} placeholder="0" />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="adjustment-field">
                      <label htmlFor="discount">Discount</label>
                      <div className="percent-input">
                        <input id="discount" type="number" min="0" max="100" step="0.01" value={discountStr} onChange={(e) => setDiscountStr(e.target.value)} placeholder="0" />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                )}

                <button className="advanced-toggle" onClick={() => setShowNote(!showNote)} type="button" aria-expanded={showNote}>
                  <span>{showNote ? "−" : "+"} Add note</span><small>Optional</small>
                </button>

                {showNote && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label htmlFor="invoice-note">Note / Payment Terms</label>
                      <textarea id="invoice-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Payment due within 15 days." rows={3} />
                    </div>
                  </div>
                )}

                <div className="button-row">
                  <button className="back-btn" onClick={goBack} type="button">← Back</button>
                  <button className="preview-btn" disabled={!hasRequiredData} onClick={() => setShowPreview(true)} type="button">Preview Invoice <span>→</span></button>
                </div>
              </div>
            )}

            <div className="privacy-note"><span>🔒</span> Your invoice is created in your browser. No sign-up required.</div>
          </section>

          <aside className="summary-area">
            <div className="summary-card">
              <div className="summary-top">
                <div><span className="summary-label">TOTAL</span><div className="total">{money(total)}</div></div>
                <div className="currency-badge">{currency}</div>
              </div>
              <div className="summary-lines">
                <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
                {discountAmount > 0 && (<div><span>Discount ({discount}%)</span><b className="discount">−{money(discountAmount)}</b></div>)}
                {taxAmount > 0 && (<div><span>Tax ({tax}%)</span><b>{money(taxAmount)}</b></div>)}
                <div className="summary-total"><span>Total</span><b>{money(total)}</b></div>
              </div>
              <button className="summary-preview" disabled={!hasRequiredData} onClick={() => setShowPreview(true)} type="button">Preview Invoice <span>→</span></button>
              <button className="copy-total-btn" disabled={!hasRequiredData} onClick={copyInvoiceTotal} type="button">{copiedMsg || "Copy Invoice Total"}</button>
            </div>
            <div className="quick-tip">
              <div className="tip-icon">⚡</div>
              <div><b>Fast invoice workflow</b><p>Add the essentials first, then include tax, discounts, addresses or payment terms when needed.</p></div>
            </div>
          </aside>
        </main>

        <section className="seo-content">
          <div className="seo-intro"><span className="eyebrow">FREE ONLINE TOOL</span><h2>Free Invoice Generator Online</h2><p>Create a clean, professional invoice in minutes. Add your business details, customer information, products or services, tax, discounts and payment notes, then preview the finished invoice and print or save it as a PDF.</p></div>
          <div className="seo-grid">
            <article className="info-card"><h3>How to create an invoice</h3><ol><li>Enter your business or personal details.</li><li>Add the customer or client information.</li><li>Add products or services with quantity and price.</li><li>Add tax, discount or payment terms if needed.</li><li>Preview the invoice and print or save it as PDF.</li></ol></article>
            <article className="info-card"><h3>What you can include</h3><ul><li>Business name, email, phone and address</li><li>Customer billing information</li><li>Multiple products or services</li><li>Multiple currencies</li><li>Tax and percentage discounts</li><li>Invoice number, date & due date</li><li>Payment terms and notes</li></ul></article>
            <article className="info-card"><h3>Built for everyday invoicing</h3><p>The generator works for freelancers, consultants, creators, small businesses, shops and service providers. It keeps the workflow simple while giving you enough control to create a useful customer-ready invoice.</p></article>
          </div>
          <div className="faq-section">
            <div className="seo-intro compact"><span className="eyebrow">FAQ</span><h2>Invoice Generator FAQ</h2></div>
            <div className="faq-grid">
              <details><summary>Is this invoice generator free?</summary><p>Yes. You can create an invoice using the tool without a subscription or account.</p></details>
              <details><summary>Can I save the invoice as a PDF?</summary><p>Yes. Open the invoice preview and use Print / Save PDF. Your browser print dialog can save only the invoice as a PDF.</p></details>
              <details><summary>Can I add tax and discounts?</summary><p>Yes. You can add percentage-based tax and discount values. The invoice total updates automatically.</p></details>
              <details><summary>Can I use different currencies?</summary><p>Yes. The calculator supports INR, USD, EUR, GBP, CAD, AUD and JPY currency formats.</p></details>
              <details><summary>Do I need to create an account?</summary><p>No account is required. You can enter the invoice information and create the invoice directly in the browser.</p></details>
              <details><summary>Is my invoice data uploaded?</summary><p>This invoice interface performs its calculations and invoice rendering in the browser. It does not require an account or a server upload to create the invoice.</p></details>
              <details><summary>Can I create invoices for services?</summary><p>Yes. Add a service as an item and enter its quantity and price just like a physical product.</p></details>
              <details><summary>Can I add payment terms?</summary><p>Yes. The optional Note / Payment Terms field lets you add information such as payment deadlines or other customer instructions.</p></details>
            </div>
          </div>
          <div className="related-tools">
            <div><span className="eyebrow">EXPLORE MORE</span><h2>Related thenexoratools</h2></div>
            <div className="related-links">
              <a href="/percentage-calculator">Percentage Calculator</a>
              <a href="/discount-calculator">Discount Calculator</a>
              <a href="/loan-emi-calculator">Loan & EMI Calculator</a>
              <a href="/age-calculator">Age Calculator</a>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div><b>thenexoratools</b><span>Free, fast and simple online tools.</span></div>
          <div className="footer-links"><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy-policy">Privacy</a></div>
        </footer>
      </div>

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)} role="dialog" aria-modal="true" aria-label="Invoice preview">
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-toolbar">
              <div><b>Invoice Preview</b><span>Ready to print or save as PDF</span></div>
              <button className="close-btn" onClick={() => setShowPreview(false)} type="button" aria-label="Close invoice preview">×</button>
            </div>

            <div className="invoice-paper" id="invoice-print">
              <div className="paper-header">
                <div>
                  <h2>{business.name || "Your Business"}</h2>
                  {business.address && <p>{business.address}</p>}
                  {business.email && <p>{business.email}</p>}
                  {business.phone && <p>{business.phone}</p>}
                  {business.gst && <p>GST / Tax ID: {business.gst}</p>}
                </div>
                <div className="invoice-title">
                  <h1>INVOICE</h1>
                  <div><span>Invoice #</span><b>{invoiceNumber}</b></div>
                  <div><span>Date</span><b>{formatDate(date)}</b></div>
                  <div><span>Due Date</span><b>{formatDate(dueDate)}</b></div>
                </div>
              </div>

              <div className="bill-section">
                <div>
                  <span>BILL TO</span>
                  <h3>{customer.name || "Customer"}</h3>
                  {customer.email && <p>{customer.email}</p>}
                  {customer.address && <p>{customer.address}</p>}
                </div>
              </div>

              <table className="invoice-table">
                <thead><tr><th>DESCRIPTION</th><th>QTY</th><th>PRICE</th><th>AMOUNT</th></tr></thead>
                <tbody>
                  {items.filter((item) => item.name.trim() || item.price > 0).map((item) => (
                    <tr key={item.id}><td>{item.name || "Item"}</td><td>{item.qty}</td><td>{money(item.price)}</td><td>{money(item.qty * item.price)}</td></tr>
                  ))}
                </tbody>
              </table>

              {note.trim() && (
                <div className="invoice-note"><span>NOTE / PAYMENT TERMS</span><p>{note}</p></div>
              )}

              <div className="paper-bottom">
                <div className="thank-you"><b>Thank you for your business.</b><p>Created with thenexoratools Invoice Generator.</p></div>
                <div className="paper-totals">
                  <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
                  {discountAmount > 0 && (<div><span>Discount</span><b>−{money(discountAmount)}</b></div>)}
                  {taxAmount > 0 && (<div><span>Tax</span><b>{money(taxAmount)}</b></div>)}
                  <div className="grand-total"><span>Total</span><b>{money(total)}</b></div>
                </div>
              </div>
            </div>

            <div className="preview-actions">
              <button className="secondary-action" onClick={() => setShowPreview(false)} type="button">← Edit Invoice</button>
              <button className="print-action" onClick={printInvoice} type="button">🖨 Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * { box-sizing: border-box; }
        .invoice-page { min-height: 100vh; background: radial-gradient(circle at 50% -10%, rgba(108,92,231,0.08), transparent 38%), radial-gradient(circle at 95% 10%, rgba(14,165,164,0.05), transparent 30%), #f6f7fb; color: #171925; padding: 22px 18px 48px; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        button, input, textarea, select { font-family: inherit; }
        button { -webkit-tap-highlight-color: transparent; }
        .topbar { width: min(1080px,100%); margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; }
        .brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .brand-mark { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; font-weight: 900; font-size: 16px; color: white; background: linear-gradient(135deg,#6c5ce7,#0ea5a4); box-shadow: 0 8px 25px rgba(108,92,231,0.22); flex: 0 0 auto; }
        .brand-name { margin: 0; font-size: 15px; font-weight: 900; letter-spacing: -0.035em; color: #171925; }
        .brand-name span { font-size: 11px; font-weight: 750; color: #777b8c; }
        .brand-sub { color: #858997; font-size: 10px; margin-top: 2px; }
        .reset-btn { border: 1px solid #e3e5ec; background: #fff; color: #666978; padding: 8px 12px; border-radius: 9px; cursor: pointer; font-weight: 750; font-size: 10px; flex: 0 0 auto; }
        .progress-wrap { width: min(1080px,100%); margin: 0 auto 18px; display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #e7e9ef; border-radius: 999px; padding: 8px 11px; box-shadow: 0 7px 24px rgba(31,35,55,0.035); }
        .progress-step { display: flex; align-items: center; gap: 7px; min-width: 140px; opacity: 0.42; }
        .progress-step.active { opacity: 1; }
        .progress-step > span { width: 25px; height: 25px; border-radius: 50%; display: grid; place-items: center; background: #f0f1f5; border: 1px solid #e7e9ef; color: #777b88; font-size: 9px; font-weight: 850; flex: 0 0 auto; }
        .progress-step.active > span { background: #6c5ce7; border-color: #6c5ce7; color: white; box-shadow: 0 0 0 4px rgba(108,92,231,0.08); }
        .progress-step b { display: block; font-size: 10px; color: #171925; }
        .progress-step small { display: block; color: #858997; font-size: 8px; margin-top: 1px; }
        .progress-line { height: 2px; background: #eceef3; flex: 1; max-width: 90px; }
        .progress-line > div { height: 100%; background: linear-gradient(90deg,#6c5ce7,#0ea5a4); }
        .main-grid { width: min(1080px,100%); margin: 0 auto; display: grid; grid-template-columns: minmax(0,1fr) 310px; gap: 18px; align-items: start; }
        .form-area { min-width: 0; }
        .card { background: #fff; border: 1px solid #e6e8ef; border-radius: 17px; box-shadow: 0 15px 50px rgba(31,35,55,0.055); }
        .step-card { padding: 23px; }
        .step-heading { display: flex; gap: 11px; align-items: flex-start; margin-bottom: 22px; }
        .heading-icon { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; font-size: 9px; font-weight: 900; flex: 0 0 auto; }
        .heading-icon.purple { background: #f0edff; color: #6c5ce7; border: 1px solid #e8e3ff; }
        .heading-icon.teal { background: #e6fbf8; color: #0ea5a4; border: 1px solid #c8f0ec; }
        .heading-icon.orange { background: #fff4e5; color: #f59e0b; border: 1px solid #ffe6bf; }
        .step-heading h2 { font-size: 17px; margin: 1px 0 4px; letter-spacing: -0.4px; }
        .step-heading p { margin: 0; color: #858997; font-size: 10px; line-height: 1.5; }
        .quick-field { margin-bottom: 14px; }
        .quick-field label, .currency-row label, .adjustment-field label { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 850; color: #454857; margin-bottom: 6px; }
        label span { color: #ef4444; }
        label em { color: #a0a3ae; font-style: normal; font-weight: 650; font-size: 8px; margin-left: 1px; }
        input, textarea, select { width: 100%; border: 1px solid #e4e6ed; background: #fafbfc; color: #181a25; border-radius: 9px; outline: none; }
        input { height: 40px; padding: 0 11px; font-size: 11px; }
        textarea { padding: 10px 11px; resize: vertical; font-size: 10px; line-height: 1.5; }
        input::placeholder, textarea::placeholder { color: #a8abb8; }
        input:focus, textarea:focus, select:focus { border-color: #aaa0f1; box-shadow: 0 0 0 3px rgba(108,92,231,0.08); background: #fff; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
        .advanced-toggle { width: 100%; border: 1px dashed #d5d0f5; background: #f7f6ff; border-radius: 9px; padding: 9px 11px; color: #6c5ce7; display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-top: 3px; }
        .advanced-toggle span { font-size: 9px; font-weight: 850; }
        .advanced-toggle small { color: #858997; font-size: 8px; }
        .advanced-box { margin-top: 9px; padding: 12px; border: 1px solid #e6e8ef; background: #fafbfc; border-radius: 10px; }
        .advanced-box .quick-field:last-child { margin-bottom: 0; }
        .primary-btn, .preview-btn { border: 0; width: 100%; height: 43px; border-radius: 9px; margin-top: 18px; background: #171925; color: white; font-weight: 850; font-size: 10px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        .button-row { display: grid; grid-template-columns: 90px 1fr; gap: 8px; margin-top: 18px; }
        .button-row .primary-btn, .button-row .preview-btn { margin-top: 0; }
        .back-btn { border: 1px solid #e3e5ec; background: #fff; color: #666978; border-radius: 9px; cursor: pointer; font-weight: 800; font-size: 9px; }
        .currency-row { display: flex; justify-content: space-between; align-items: end; gap: 12px; margin-bottom: 16px; }
        .currency-row > div:first-child { width: 135px; }
        select { height: 38px; padding: 0 9px; font-size: 10px; }
        .invoice-meta { display: flex; gap: 19px; align-items: end; }
        .invoice-meta div { text-align: right; }
        .invoice-meta span { display: block; color: #999ca8; font-size: 7px; font-weight: 750; text-transform: uppercase; letter-spacing: 0.5px; }
        .invoice-meta b { display: block; margin-top: 3px; font-size: 8px; color: #454857; }
        .items-box { border: 1px solid #e6e8ef; border-radius: 10px; overflow: hidden; }
        .items-header { display: grid; grid-template-columns: 1fr 58px 110px 30px; gap: 7px; padding: 8px 9px; background: #f7f7fa; color: #999ca8; font-size: 7px; font-weight: 900; letter-spacing: 0.7px; }
        .item-row { display: grid; grid-template-columns: 1fr 58px 110px 30px; gap: 7px; padding: 8px 9px; border-top: 1px solid #eef0f4; align-items: center; background: #fff; }
        .item-row input { height: 36px; border-radius: 8px; background: #fff; }
        .price-input { height: 36px; display: flex; align-items: center; border: 1px solid #e4e6ed; border-radius: 8px; background: #fff; overflow: hidden; }
        .price-input span { padding-left: 8px; color: #999ca8; font-size: 9px; }
        .price-input input { border: 0; background: transparent; box-shadow: none !important; height: 34px; padding-left: 5px; }
        .remove-item { width: 28px; height: 28px; border: 0; background: transparent; color: #a0a3ae; font-size: 18px; cursor: pointer; border-radius: 7px; }
        .add-item-btn { border: 0; background: transparent; color: #6c5ce7; font-weight: 800; font-size: 9px; padding: 11px 1px 3px; cursor: pointer; }
        .adjustment-toggle { margin-top: 14px; }
        .adjustments { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 11px; margin-top: 8px; border-radius: 9px; border: 1px solid #e6e8ef; background: #fafbfc; }
        .percent-input { height: 36px; display: flex; align-items: center; border: 1px solid #e4e6ed; background: #fff; border-radius: 8px; overflow: hidden; }
        .percent-input input { height: 34px; border: 0; background: transparent; box-shadow: none !important; }
        .percent-input span { padding-right: 9px; color: #999ca8; font-size: 9px; }
        .privacy-note { text-align: center; color: #a0a3ae; font-size: 8px; margin-top: 12px; }
        .summary-area { position: sticky; top: 16px; }
        .summary-card { border: 1px solid #e1e3eb; background: #171925; border-radius: 17px; padding: 17px; color: #fff; }
        .summary-top { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .summary-label { font-size: 8px; font-weight: 900; letter-spacing: 1.2px; color: #999baa; }
        .total { margin-top: 6px; font-size: 25px; line-height: 1; font-weight: 900; letter-spacing: -0.8px; }
        .currency-badge { padding: 6px 8px; border-radius: 7px; background: rgba(255,255,255,0.09); color: #c8c5ff; font-size: 8px; font-weight: 900; }
        .summary-lines { padding: 14px 0 4px; }
        .summary-lines > div { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; }
        .summary-lines span { color: #a1a3b0; font-size: 9px; }
        .summary-lines b { font-size: 9px; color: #f4f4f7; }
        .summary-lines .discount { color: #74e0b2; }
        .summary-total { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 11px; margin-top: 11px; }
        .summary-total b { font-size: 12px; }
        .summary-preview { width: 100%; height: 40px; border: 0; border-radius: 8px; background: #fff; color: #171925; font-size: 9px; font-weight: 850; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 10px; }
        .copy-total-btn { width: 100%; height: 32px; margin-top: 7px; border: 1px solid rgba(255,255,255,0.13); border-radius: 8px; background: rgba(255,255,255,0.06); color: #c9cbd5; font-size: 8px; font-weight: 800; cursor: pointer; }
        .quick-tip { margin-top: 10px; border: 1px solid #e8e9ef; border-radius: 12px; background: #fff; padding: 11px; display: flex; gap: 8px; }
        .tip-icon { width: 27px; height: 27px; border-radius: 8px; background: #e9faf3; display: grid; place-items: center; flex: 0 0 auto; font-size: 12px; }
        .quick-tip b { display: block; font-size: 9px; color: #343642; }
        .quick-tip p { margin: 3px 0 0; color: #9295a1; font-size: 8px; line-height: 1.45; }
        .seo-content { width: min(1080px,100%); margin: 38px auto 0; }
        .seo-intro { max-width: 760px; margin-bottom: 18px; }
        .seo-intro.compact { margin-bottom: 14px; }
        .eyebrow { display: inline-block; color: #6c5ce7; font-size: 8px; font-weight: 900; letter-spacing: 1.2px; margin-bottom: 6px; }
        .seo-intro h2 { margin: 0 0 7px; color: #171925; font-size: 20px; letter-spacing: -0.5px; }
        .seo-intro p { margin: 0; color: #777b88; font-size: 10px; line-height: 1.7; }
        .seo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        .info-card { background: #fff; border: 1px solid #e6e8ef; border-radius: 13px; padding: 16px; }
        .info-card h3 { margin: 0 0 9px; font-size: 11px; color: #242631; }
        .info-card p, .info-card li { color: #777b88; font-size: 9px; line-height: 1.65; }
        .info-card ol, .info-card ul { margin: 0; padding-left: 17px; }
        .faq-section { margin-top: 32px; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .faq-grid details { background: #fff; border: 1px solid #e6e8ef; border-radius: 10px; padding: 11px 13px; }
        .faq-grid summary { cursor: pointer; color: #292b36; font-size: 9px; font-weight: 800; list-style: none; }
        .faq-grid summary::-webkit-details-marker { display: none; }
        .faq-grid summary::after { content: "+"; float: right; color: #6c5ce7; font-size: 12px; }
        .faq-grid details[open] summary::after { content: "−"; }
        .faq-grid p { margin: 8px 0 0; color: #858997; font-size: 8.5px; line-height: 1.6; }
        .related-tools { margin-top: 32px; padding: 17px; background: #fff; border: 1px solid #e6e8ef; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .related-tools h2 { margin: 0; font-size: 15px; }
        .related-links { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
        .related-links a { color: #5c50ca; text-decoration: none; background: #f5f3ff; border: 1px solid #e9e5ff; border-radius: 7px; padding: 7px 9px; font-size: 8px; font-weight: 800; }
        .site-footer { width: min(1080px,100%); margin: 28px auto 0; padding-top: 16px; border-top: 1px solid #e5e7ed; display: flex; align-items: center; justify-content: space-between; gap: 15px; color: #999ca8; }
        .site-footer b { color: #454857; font-size: 9px; }
        .site-footer span { font-size: 8px; }
        .footer-links { display: flex; gap: 12px; }
        .footer-links a { color: #777b88; text-decoration: none; font-size: 8px; }
        .modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(14,15,23,0.58); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 16px; }
        .preview-modal { width: min(880px,100%); max-height: 94vh; background: #f4f5f8; border: 1px solid #e2e4ea; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 30px 100px rgba(0,0,0,0.28); }
        .preview-toolbar { min-height: 58px; padding: 11px 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e4ea; background: #fff; }
        .preview-toolbar b { display: block; font-size: 11px; }
        .preview-toolbar span { display: block; color: #979aa6; font-size: 8px; margin-top: 2px; }
        .close-btn { width: 31px; height: 31px; border: 1px solid #e4e6ec; border-radius: 8px; background: #fff; color: #555865; font-size: 18px; cursor: pointer; }
        .invoice-paper { width: min(740px,calc(100% - 34px)); margin: 16px auto; background: white; color: #182033; padding: 35px; border-radius: 4px; overflow: auto; box-shadow: 0 10px 40px rgba(31,35,55,0.08); }
        .paper-header { display: flex; justify-content: space-between; gap: 25px; padding-bottom: 22px; border-bottom: 1px solid #e6e8ed; }
        .paper-header h2 { margin: 0 0 7px; font-size: 19px; }
        .paper-header p, .bill-section p { margin: 3px 0; color: #6c7483; font-size: 8px; }
        .invoice-title { text-align: right; min-width: 135px; }
        .invoice-title h1 { margin: 0 0 11px; font-size: 24px; letter-spacing: 1px; color: #6c5ce7; }
        .invoice-title div { display: flex; justify-content: space-between; gap: 13px; font-size: 8px; margin-top: 4px; }
        .invoice-title span { color: #8a91a0; }
        .bill-section { padding: 21px 0; }
        .bill-section span { font-size: 7px; font-weight: 900; color: #9298a5; letter-spacing: 1px; }
        .bill-section h3 { margin: 5px 0 3px; font-size: 11px; }
        .invoice-table { width: 100%; border-collapse: collapse; font-size: 8px; }
        .invoice-table th { text-align: left; padding: 8px 7px; background: #f4f5f7; color: #717886; font-size: 7px; letter-spacing: 0.5px; }
        .invoice-table th:nth-child(n+2), .invoice-table td:nth-child(n+2) { text-align: right; }
        .invoice-table td { padding: 10px 7px; border-bottom: 1px solid #eceef1; }
        .invoice-note { margin-top: 18px; padding: 10px 11px; background: #f7f8fa; border-radius: 6px; }
        .invoice-note span { display: block; color: #8a91a0; font-size: 7px; font-weight: 900; letter-spacing: 0.6px; }
        .invoice-note p { margin: 5px 0 0; color: #5d6573; font-size: 8px; line-height: 1.5; white-space: pre-wrap; }
        .paper-bottom { display: flex; justify-content: space-between; gap: 35px; padding-top: 23px; }
        .thank-you { align-self: end; }
        .thank-you b { font-size: 8px; }
        .thank-you p { color: #89909d; font-size: 7px; margin-top: 4px; }
        .paper-totals { width: 205px; }
        .paper-totals div { display: flex; justify-content: space-between; padding: 5px 0; font-size: 8px; }
        .paper-totals span { color: #747b88; }
        .grand-total { border-top: 1px solid #dfe2e6; margin-top: 4px; padding-top: 9px !important; font-size: 10px !important; }
        .grand-total span, .grand-total b { color: #182033; font-weight: 900; }
        .preview-actions { padding: 11px 15px; border-top: 1px solid #e2e4ea; display: flex; justify-content: space-between; gap: 8px; background: #fff; }
        .secondary-action, .print-action { height: 38px; padding: 0 15px; border-radius: 8px; font-size: 9px; font-weight: 850; cursor: pointer; }
        .secondary-action { border: 1px solid #e3e5ec; background: #fff; color: #626574; }
        .print-action { border: 0; background: #171925; color: white; }

        /* PRINT - SIRF INVOICE PRINT HOGA */
        @media print {
          body { background: #fff !important; }
          .invoice-page { display: none !important; }
          .modal-overlay { position: static !important; background: #fff !important; backdrop-filter: none !important; padding: 0 !important; display: block !important; }
          .preview-modal { width: 100% !important; max-height: none !important; border: 0 !important; box-shadow: none !important; overflow: visible !important; }
          .preview-toolbar, .preview-actions { display: none !important; }
          .invoice-paper { width: 100% !important; margin: 0 !important; padding: 20px !important; box-shadow: none !important; border-radius: 0 !important; overflow: visible !important; }
        }

        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; }
          .summary-area { position: static; order: -1; }
          .quick-tip { display: none; }
          .summary-preview { display: none; }
          .seo-grid { grid-template-columns: 1fr 1fr; }
          .related-tools { align-items: flex-start; flex-direction: column; }
          .related-links { justify-content: flex-start; }
        }
        @media (max-width: 650px) {
          .invoice-page { padding: 14px 10px 34px; }
          .progress-step { min-width: 0; }
          .progress-step b, .progress-step small { display: none; }
          .two-col { grid-template-columns: 1fr; }
          .step-card { padding: 16px; }
          .items-header, .item-row { grid-template-columns: 1fr 48px 90px 26px; }
          .seo-grid, .faq-grid { grid-template-columns: 1fr; }
          .invoice-paper { padding: 20px 14px; width: calc(100% - 16px); }
          .paper-header { flex-direction: column; gap: 14px; }
          .invoice-title { text-align: left; }
          .paper-bottom { flex-direction: column; gap: 16px; }
          .paper-totals { width: 100%; }
        }
      `}</style>
    </>
  );
}
