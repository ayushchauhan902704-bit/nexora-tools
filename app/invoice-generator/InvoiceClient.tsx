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
];

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function makeInvoiceNumber() {
  return `INV-${String(Date.now()).slice(-6)}`;
}

export default function InvoiceClient() {
  const today = new Date().toISOString().split("T")[0];

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

  const [invoiceNumber] = useState(makeInvoiceNumber);
  const [date] = useState(today);

  const [currency, setCurrency] = useState("INR");

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      name: "",
      qty: 1,
      price: 0,
    },
  ]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const currencyInfo =
    CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.qty * item.price;
    }, 0);
  }, [items]);

  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * tax) / 100;
  const total = taxableAmount + taxAmount;

  const hasRequiredData =
    business.name.trim() &&
    customer.name.trim() &&
    items.some((item) => item.name.trim() && item.price > 0);

  function updateBusiness(key: keyof Business, value: string) {
    setBusiness((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateCustomer(key: keyof Customer, value: string) {
    setCustomer((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateItem(
    id: number,
    key: keyof Item,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]:
                key === "qty" || key === "price"
                  ? Number(value) || 0
                  : value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        qty: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(id: number) {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function resetInvoice() {
    setBusiness({
      name: "",
      email: "",
      phone: "",
      address: "",
      gst: "",
    });

    setCustomer({
      name: "",
      email: "",
      address: "",
    });

    setItems([
      {
        id: 1,
        name: "",
        qty: 1,
        price: 0,
      },
    ]);

    setTax(0);
    setDiscount(0);
    setCurrency("INR");
    setStep(1);
    setShowAdvanced(false);
    setShowAdjustments(false);
    setShowPreview(false);
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

  const money = (value: number) =>
    `${currencyInfo.symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <>
      <div className="invoice-page">
        {/* HEADER */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">N</div>

            <div>
              <div className="brand-name">thenexoratools <span>• Invoice Generator</span></div>
              <div className="brand-sub">
                Create a professional invoice in seconds
              </div>
            </div>
          </div>

          <button className="reset-btn" onClick={resetInvoice}>
            ↻ Reset
          </button>
        </header>

        {/* PROGRESS */}
        <div className="progress-wrap">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <div>
              <b>Your details</b>
              <small>Who are you?</small>
            </div>
          </div>

          <div className="progress-line">
            <div
              style={{
                width: step >= 2 ? "100%" : "0%",
              }}
            />
          </div>

          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <div>
              <b>Customer</b>
              <small>Who are you billing?</small>
            </div>
          </div>

          <div className="progress-line">
            <div
              style={{
                width: step >= 3 ? "100%" : "0%",
              }}
            />
          </div>

          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <div>
              <b>Items</b>
              <small>What did you sell?</small>
            </div>
          </div>
        </div>

        <main className="main-grid">
          {/* LEFT */}
          <section className="form-area">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon purple">01</div>

                  <div>
                    <h1>Your details</h1>
                    <p>
                      Enter the name that should appear on your invoice.
                    </p>
                  </div>
                </div>

                <div className="quick-field">
                  <label>
                    Business / Your Name <span>*</span>
                  </label>

                  <input
                    autoFocus
                    type="text"
                    value={business.name}
                    onChange={(e) =>
                      updateBusiness("name", e.target.value)
                    }
                    placeholder=""
                  />
                </div>

                <div className="two-col">
                  <div className="quick-field">
                    <label>Email <em>Optional</em></label>

                    <input
                      type="email"
                      value={business.email}
                      onChange={(e) =>
                        updateBusiness("email", e.target.value)
                      }
                      placeholder=""
                    />
                  </div>

                  <div className="quick-field">
                    <label>Phone <em>Optional</em></label>

                    <input
                      type="tel"
                      value={business.phone}
                      onChange={(e) =>
                        updateBusiness("phone", e.target.value)
                      }
                      placeholder=""
                    />
                  </div>
                </div>

                <button
                  className="advanced-toggle"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>
                    {showAdvanced ? "−" : "+"} Add business details
                  </span>
                  <small>Address, GST & more</small>
                </button>

                {showAdvanced && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label>Business Address</label>

                      <textarea
                        value={business.address}
                        onChange={(e) =>
                          updateBusiness("address", e.target.value)
                        }
                        placeholder=""
                        rows={3}
                      />
                    </div>

                    <div className="quick-field">
                      <label>GST / Tax ID</label>

                      <input
                        value={business.gst}
                        onChange={(e) =>
                          updateBusiness("gst", e.target.value)
                        }
                        placeholder=""
                      />
                    </div>
                  </div>
                )}

                <button
                  className="primary-btn"
                  disabled={!business.name.trim()}
                  onClick={goNext}
                >
                  Continue to Customer
                  <span>→</span>
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon teal">02</div>

                  <div>
                    <h1>Customer details</h1>
                    <p>
                      Who should receive this invoice?
                    </p>
                  </div>
                </div>

                <div className="quick-field">
                  <label>
                    Customer Name <span>*</span>
                  </label>

                  <input
                    autoFocus
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      updateCustomer("name", e.target.value)
                    }
                    placeholder=""
                  />
                </div>

                <div className="quick-field">
                  <label>Email <em>Optional</em></label>

                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      updateCustomer("email", e.target.value)
                    }
                    placeholder=""
                  />
                </div>

                <button
                  className="advanced-toggle"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>
                    {showAdvanced ? "−" : "+"} Add customer address
                  </span>
                  <small>Optional</small>
                </button>

                {showAdvanced && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label>Customer Address</label>

                      <textarea
                        value={customer.address}
                        onChange={(e) =>
                          updateCustomer("address", e.target.value)
                        }
                        placeholder=""
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="button-row">
                  <button className="back-btn" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    className="primary-btn"
                    disabled={!customer.name.trim()}
                    onClick={goNext}
                  >
                    Continue to Items
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="card step-card">
                <div className="step-heading">
                  <div className="heading-icon orange">03</div>

                  <div>
                    <h1>What did you sell?</h1>
                    <p>
                      Add your products or services and their prices.
                    </p>
                  </div>
                </div>

                {/* CURRENCY */}
                <div className="currency-row">
                  <div>
                    <label>Currency</label>

                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="invoice-meta">
                    <div>
                      <span>Invoice</span>
                      <b>{invoiceNumber}</b>
                    </div>

                    <div>
                      <span>Date</span>
                      <b>{formatDate(date)}</b>
                    </div>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="items-box">
                  <div className="items-header">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>PRICE</span>
                    <span></span>
                  </div>

                  {items.map((item) => (
                    <div className="item-row" key={item.id}>
                      <input
                        autoFocus={items.length === 1 && !item.name}
                        value={item.name}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder=""
                      />

                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "qty",
                            e.target.value
                          )
                        }
                      />

                      <div className="price-input">
                        <span>{currencyInfo.symbol}</span>

                        <input
                          type="number"
                          min="0"
                          value={item.price || ""}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder=""
                        />
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button className="add-item-btn" onClick={addItem}>
                  + Add another item
                </button>

                {/* TAX / DISCOUNT */}
                <button
                  className="advanced-toggle adjustment-toggle"
                  onClick={() =>
                    setShowAdjustments(!showAdjustments)
                  }
                >
                  <span>
                    {showAdjustments ? "−" : "+"} Add tax or discount
                  </span>
                  <small>Optional</small>
                </button>

                {showAdjustments && (
                  <div className="adjustments">
                    <div className="adjustment-field">
                      <label>Tax</label>

                      <div className="percent-input">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={tax}
                          onChange={(e) =>
                            setTax(
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(e.target.value) || 0
                                )
                              )
                            )
                          }
                        />
                        <span>%</span>
                      </div>
                    </div>

                    <div className="adjustment-field">
                      <label>Discount</label>

                      <div className="percent-input">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(e.target.value) || 0
                                )
                              )
                            )
                          }
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTES */}
                <button
                  className="advanced-toggle"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>
                    {showAdvanced ? "−" : "+"} Add note
                  </span>
                  <small>Optional</small>
                </button>

                {showAdvanced && (
                  <div className="advanced-box">
                    <div className="quick-field">
                      <label>Note / Payment Terms</label>

                      <textarea
                        placeholder=""
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="button-row">
                  <button className="back-btn" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    className="preview-btn"
                    disabled={!hasRequiredData}
                    onClick={() => setShowPreview(true)}
                  >
                    Preview Invoice
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            <div className="privacy-note">
              <span>🔒</span>
              Your invoice is created in your browser. No sign-up required. • thenexoratools
            </div>
          </section>

          {/* SUMMARY */}
          <aside className="summary-area">
            <div className="summary-card">
              <div className="summary-top">
                <div>
                  <span className="summary-label">TOTAL</span>

                  <div className="total">
                    {money(total)}
                  </div>
                </div>

                <div className="currency-badge">
                  {currency}
                </div>
              </div>

              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>

                {discountAmount > 0 && (
                  <div>
                    <span>Discount</span>
                    <b className="discount">
                      −{money(discountAmount)}
                    </b>
                  </div>
                )}

                {taxAmount > 0 && (
                  <div>
                    <span>Tax</span>
                    <b>{money(taxAmount)}</b>
                  </div>
                )}

                <div className="summary-total">
                  <span>Total</span>
                  <b>{money(total)}</b>
                </div>
              </div>

              <button
                className="summary-preview"
                disabled={!hasRequiredData}
                onClick={() => setShowPreview(true)}
              >
                Preview Invoice
                <span>→</span>
              </button>
            </div>

            <div className="quick-tip">
              <div className="tip-icon">⚡</div>

              <div>
                <b>Quick invoice</b>

                <p>
                  Only the essentials are required. Add extra details
                  whenever you need them.
                </p>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div
          className="modal-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-toolbar">
              <div>
                <b>Invoice Preview</b>
                <span>Ready to print or save as PDF</span>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>

            <div className="invoice-paper" id="invoice-print">
              <div className="paper-header">
                <div>
                  <h2>
                    {business.name || "Your Business"}
                  </h2>

                  {business.address && (
                    <p>{business.address}</p>
                  )}

                  {business.email && (
                    <p>{business.email}</p>
                  )}

                  {business.phone && (
                    <p>{business.phone}</p>
                  )}

                  {business.gst && (
                    <p>GST / Tax ID: {business.gst}</p>
                  )}
                </div>

                <div className="invoice-title">
                  <h1>INVOICE</h1>

                  <div>
                    <span>Invoice #</span>
                    <b>{invoiceNumber}</b>
                  </div>

                  <div>
                    <span>Date</span>
                    <b>{formatDate(date)}</b>
                  </div>
                </div>
              </div>

              <div className="bill-section">
                <div>
                  <span>BILL TO</span>

                  <h3>
                    {customer.name || "Customer"}
                  </h3>

                  {customer.email && (
                    <p>{customer.email}</p>
                  )}

                  {customer.address && (
                    <p>{customer.address}</p>
                  )}
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>

                <tbody>
                  {items
                    .filter(
                      (item) =>
                        item.name.trim() || item.price > 0
                    )
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.name || "Item"}</td>
                        <td>{item.qty}</td>
                        <td>{money(item.price)}</td>
                        <td>
                          {money(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="paper-bottom">
                <div className="thank-you">
                  <b>Thank you for your business.</b>
                  <p>
                    This invoice was created with thenexoratools.
                  </p>
                </div>

                <div className="paper-totals">
                  <div>
                    <span>Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>

                  {discountAmount > 0 && (
                    <div>
                      <span>Discount</span>
                      <b>
                        −{money(discountAmount)}
                      </b>
                    </div>
                  )}

                  {taxAmount > 0 && (
                    <div>
                      <span>Tax</span>
                      <b>{money(taxAmount)}</b>
                    </div>
                  )}

                  <div className="grand-total">
                    <span>Total</span>
                    <b>{money(total)}</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-actions">
              <button
                className="secondary-action"
                onClick={() => setShowPreview(false)}
              >
                ← Edit Invoice
              </button>

              <button
                className="print-action"
                onClick={printInvoice}
              >
                🖨 Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        /* WHITE TEMPLATE - TEAM TOOL JESA - WORKING SAME HAI */
        .invoice-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(108, 92, 231, 0.10),
              transparent 38%
            ),
            radial-gradient(
              circle at 95% 10%,
              rgba(14, 165, 164, 0.06),
              transparent 30%
            ),
            #f6f7fb;
          color: #171925;
          padding: 28px 22px 60px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .topbar {
          width: min(1120px, 100%);
          margin: 0 auto 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 18px;
          color: white;
          background: linear-gradient(135deg, #6c5ce7, #0ea5a4);
          box-shadow: 0 10px 30px rgba(108, 92, 231, 0.25);
        }

        .brand-name {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #171925;
        }
        .brand-name span {
          font-size: 13px;
          font-weight: 700;
          color: #777b8c;
        }

        .brand-sub {
          color: #858997;
          font-size: 12px;
          margin-top: 3px;
        }

        .reset-btn {
          border: 1px solid #e3e5ec;
          background: #fff;
          color: #666978;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          transition: 0.2s;
        }

        .reset-btn:hover {
          border-color: #c9cce0;
          color: #171925;
        }

        .progress-wrap {
          width: min(1120px, 100%);
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border: 1px solid #e7e9ef;
          border-radius: 999px;
          padding: 10px 14px;
          box-shadow: 0 8px 25px rgba(31,35,55,.04);
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 150px;
          opacity: 0.45;
          transition: 0.25s;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step > span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #f0f1f5;
          border: 1px solid #e7e9ef;
          color: #777b88;
          font-size: 11px;
          font-weight: 800;
        }

        .progress-step.active > span {
          background: #6c5ce7;
          border-color: #6c5ce7;
          color: white;
          box-shadow: 0 0 0 5px rgba(108, 92, 231, 0.1);
        }

        .progress-step b {
          display: block;
          font-size: 12px;
          color: #171925;
        }

        .progress-step small {
          display: block;
          color: #858997;
          font-size: 10px;
          margin-top: 2px;
        }

        .progress-line {
          height: 2px;
          background: #eceef3;
          flex: 1;
          max-width: 100px;
        }

        .progress-line > div {
          height: 100%;
          background: linear-gradient(
            90deg,
            #6c5ce7,
            #0ea5a4
          );
          transition: 0.3s;
        }

        .main-grid {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 22px;
          align-items: start;
        }

        .form-area {
          min-width: 0;
        }

        .card {
          background: #fff;
          border: 1px solid #e6e8ef;
          border-radius: 20px;
          box-shadow: 0 18px 60px rgba(31, 35, 55, 0.07);
        }

        .step-card {
          padding: 28px;
        }

        .step-heading {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 27px;
        }

        .heading-icon {
          width: 45px;
          height: 45px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .heading-icon.purple {
          background: #f0edff;
          color: #6c5ce7;
          border: 1px solid #e8e3ff;
        }

        .heading-icon.teal {
          background: #e6fbf8;
          color: #0ea5a4;
          border: 1px solid #c8f0ec;
        }

        .heading-icon.orange {
          background: #fff4e5;
          color: #f59e0b;
          border: 1px solid #ffe6bf;
        }

        .step-heading h1 {
          font-size: 21px;
          margin: 1px 0 5px;
          letter-spacing: -0.5px;
          color: #171925;
        }

        .step-heading p {
          margin: 0;
          color: #858997;
          font-size: 12px;
          line-height: 1.5;
        }

        .quick-field {
          margin-bottom: 18px;
        }

        .quick-field label,
        .currency-row label,
        .adjustment-field label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 800;
          color: #454857;
          margin-bottom: 8px;
        }

        label span {
          color: #ef4444;
        }

        label em {
          color: #a0a3ae;
          font-style: normal;
          font-weight: 600;
          font-size: 9px;
          margin-left: 2px;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #e4e6ed;
          background: #fafbfc;
          color: #181a25;
          border-radius: 11px;
          outline: none;
          font-family: inherit;
          transition:
            border 0.2s,
            box-shadow 0.2s;
        }

        input {
          height: 45px;
          padding: 0 13px;
          font-size: 13px;
        }

        textarea {
          padding: 12px 13px;
          resize: vertical;
          font-size: 12px;
          line-height: 1.5;
        }

        input::placeholder,
        textarea::placeholder {
          color: #a8abb8;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #aaa0f1;
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.09);
          background: #fff;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .advanced-toggle {
          width: 100%;
          border: 1px dashed #d5d0f5;
          background: #f7f6ff;
          border-radius: 11px;
          padding: 12px 13px;
          color: #6c5ce7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          margin-top: 4px;
          transition: 0.2s;
        }

        .advanced-toggle:hover {
          border-color: #6c5ce7;
          background: #f0edff;
        }

        .advanced-toggle span {
          font-size: 11px;
          font-weight: 800;
        }

        .advanced-toggle small {
          color: #858997;
          font-size: 9px;
        }

        .advanced-box {
          margin-top: 12px;
          padding: 15px;
          border: 1px solid #e6e8ef;
          background: #fafbfc;
          border-radius: 12px;
        }

        .advanced-box .quick-field:last-child {
          margin-bottom: 0;
        }

        .primary-btn,
        .preview-btn {
          border: 0;
          width: 100%;
          height: 48px;
          border-radius: 11px;
          margin-top: 22px;
          background: #171925;
          color: white;
          font-weight: 850;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          box-shadow: 0 12px 30px rgba(23, 25, 37, 0.14);
          transition:
            transform 0.2s,
            opacity 0.2s;
        }

        .primary-btn:hover:not(:disabled),
        .preview-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .button-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 10px;
          margin-top: 22px;
        }

        .button-row .primary-btn,
        .button-row .preview-btn {
          margin-top: 0;
        }

        .back-btn {
          border: 1px solid #e3e5ec;
          background: #fff;
          color: #666978;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 800;
          font-size: 11px;
        }

        .back-btn:hover {
          color: #171925;
          border-color: #c9cce0;
        }

        .preview-btn {
          background: #171925;
          box-shadow: 0 12px 30px rgba(23, 25, 37, 0.14);
        }

        .currency-row {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 15px;
          margin-bottom: 20px;
        }

        .currency-row > div:first-child {
          width: 150px;
        }

        select {
          height: 42px;
          padding: 0 11px;
          font-size: 12px;
        }

        .invoice-meta {
          display: flex;
          gap: 22px;
          align-items: end;
        }

        .invoice-meta div {
          text-align: right;
        }

        .invoice-meta span {
          display: block;
          color: #999ca8;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .invoice-meta b {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          color: #454857;
        }

        .items-box {
          border: 1px solid #e6e8ef;
          border-radius: 12px;
          overflow: hidden;
        }

        .items-header {
          display: grid;
          grid-template-columns: 1fr 70px 130px 35px;
          gap: 10px;
          padding: 10px 12px;
          background: #f7f7fa;
          color: #999ca8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 1fr 70px 130px 35px;
          gap: 10px;
          padding: 10px 12px;
          border-top: 1px solid #eef0f4;
          align-items: center;
          background: #fff;
        }

        .item-row input {
          height: 40px;
          border-radius: 9px;
          background: #fff;
        }

        .price-input {
          height: 40px;
          display: flex;
          align-items: center;
          border: 1px solid #e4e6ed;
          border-radius: 9px;
          background: #fff;
          overflow: hidden;
        }

        .price-input span {
          padding-left: 10px;
          color: #999ca8;
          font-size: 11px;
        }

        .price-input input {
          border: 0;
          background: transparent;
          box-shadow: none !important;
          height: 38px;
          padding-left: 6px;
        }

        .remove-item {
          width: 32px;
          height: 32px;
          border: 0;
          background: transparent;
          color: #a0a3ae;
          font-size: 21px;
          cursor: pointer;
          border-radius: 8px;
        }

        .remove-item:hover:not(:disabled) {
          color: #ef4444;
          background: #fff1f1;
        }

        .add-item-btn {
          border: 0;
          background: transparent;
          color: #6c5ce7;
          font-weight: 800;
          font-size: 11px;
          padding: 14px 2px 5px;
          cursor: pointer;
        }

        .add-item-btn:hover {
          color: #5a4bd6;
        }

        .adjustment-toggle {
          margin-top: 18px;
        }

        .adjustments {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 13px;
          margin-top: 10px;
          border-radius: 11px;
          border: 1px solid #e6e8ef;
          background: #fafbfc;
        }

        .adjustment-field {
          min-width: 0;
        }

        .percent-input {
          height: 40px;
          display: flex;
          align-items: center;
          border: 1px solid #e4e6ed;
          background: #fff;
          border-radius: 9px;
          overflow: hidden;
        }

        .percent-input input {
          height: 38px;
          border: 0;
          background: transparent;
          box-shadow: none !important;
        }

        .percent-input span {
          padding-right: 11px;
          color: #999ca8;
          font-size: 11px;
        }

        .privacy-note {
          text-align: center;
          color: #a0a3ae;
          font-size: 10px;
          margin-top: 16px;
        }

        .privacy-note span {
          margin-right: 5px;
        }

        .summary-area {
          position: sticky;
          top: 20px;
        }

        .summary-card {
          border: 1px solid #e1e3eb;
          background: #171925;
          border-radius: 20px;
          padding: 21px;
          box-shadow: 0 18px 45px rgba(23, 25, 37, 0.13);
          color: #fff;
        }

        .summary-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 19px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .summary-label {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.3px;
          color: #999baa;
        }

        .total {
          margin-top: 7px;
          font-size: 30px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -1px;
          color: #fff;
        }

        .currency-badge {
          padding: 7px 9px;
          border-radius: 8px;
          background: rgba(255,255,255,.09);
          color: #c8c5ff;
          font-size: 9px;
          font-weight: 900;
        }

        .summary-lines {
          padding: 17px 0 5px;
        }

        .summary-lines > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 11px;
        }

        .summary-lines span {
          color: #a1a3b0;
          font-size: 11px;
        }

        .summary-lines b {
          font-size: 11px;
          color: #f4f4f7;
        }

        .summary-lines .discount {
          color: #74e0b2;
        }

        .summary-total {
          border-top: 1px solid rgba(255,255,255,.1);
          padding-top: 13px;
          margin-top: 13px;
        }

        .summary-total span {
          color: #fff;
          font-weight: 800;
        }

        .summary-total b {
          color: white;
          font-size: 14px;
        }

        .summary-preview {
          width: 100%;
          height: 44px;
          border: 0;
          border-radius: 10px;
          background: #fff;
          color: #171925;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          margin-top: 12px;
        }

        .summary-preview:hover:not(:disabled) {
          background: #f0edff;
        }

        .quick-tip {
          margin-top: 13px;
          border: 1px solid #e8e9ef;
          border-radius: 15px;
          background: #fff;
          padding: 14px;
          display: flex;
          gap: 10px;
          box-shadow: 0 8px 25px rgba(31,35,55,.04);
        }

        .tip-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #e9faf3;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .quick-tip b {
          display: block;
          font-size: 10px;
          color: #343642;
        }

        .quick-tip p {
          margin: 4px 0 0;
          color: #9295a1;
          font-size: 9px;
          line-height: 1.5;
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(14, 15, 23, 0.58);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .preview-modal {
          width: min(900px, 100%);
          max-height: 94vh;
          background: #f4f5f8;
          border: 1px solid #e2e4ea;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.28);
        }

        .preview-toolbar {
          min-height: 64px;
          padding: 13px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e4ea;
          background: #fff;
        }

        .preview-toolbar b {
          display: block;
          font-size: 13px;
          color: #171925;
        }

        .preview-toolbar span {
          display: block;
          color: #979aa6;
          font-size: 9px;
          margin-top: 3px;
        }

        .close-btn {
          width: 34px;
          height: 34px;
          border: 1px solid #e4e6ec;
          border-radius: 9px;
          background: #fff;
          color: #555865;
          font-size: 20px;
          cursor: pointer;
        }

        .close-btn:hover {
          color: #171925;
        }

        .invoice-paper {
          width: min(760px, calc(100% - 40px));
          margin: 20px auto;
          background: white;
          color: #182033;
          padding: 42px;
          border-radius: 5px;
          overflow: auto;
          box-shadow: 0 10px 40px rgba(31,35,55,.08);
        }

        .paper-header {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e6e8ed;
        }

        .paper-header h2 {
          margin: 0 0 8px;
          font-size: 22px;
          letter-spacing: -0.5px;
        }

        .paper-header p,
        .bill-section p {
          margin: 3px 0;
          color: #6c7483;
          font-size: 10px;
        }

        .invoice-title {
          text-align: right;
          min-width: 150px;
        }

        .invoice-title h1 {
          margin: 0 0 13px;
          font-size: 28px;
          letter-spacing: 1px;
          color: #6c5ce7;
        }

        .invoice-title div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          font-size: 9px;
          margin-top: 5px;
        }

        .invoice-title span {
          color: #8a91a0;
        }

        .invoice-title b {
          font-weight: 800;
        }

        .bill-section {
          padding: 25px 0;
        }

        .bill-section span {
          font-size: 8px;
          font-weight: 900;
          color: #9298a5;
          letter-spacing: 1px;
        }

        .bill-section h3 {
          margin: 6px 0 4px;
          font-size: 13px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }

        .invoice-table th {
          text-align: left;
          padding: 10px 8px;
          background: #f4f5f7;
          color: #717886;
          font-size: 8px;
          letter-spacing: 0.5px;
        }

        .invoice-table th:nth-child(n + 2),
        .invoice-table td:nth-child(n + 2) {
          text-align: right;
        }

        .invoice-table td {
          padding: 13px 8px;
          border-bottom: 1px solid #eceef1;
        }

        .paper-bottom {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          padding-top: 28px;
        }

        .thank-you {
          align-self: end;
        }

        .thank-you b {
          font-size: 10px;
        }

        .thank-you p {
          color: #89909d;
          font-size: 8px;
          margin-top: 5px;
        }

        .paper-totals {
          width: 220px;
        }

        .paper-totals div {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 9px;
        }

        .paper-totals span {
          color: #747b88;
        }

        .grand-total {
          border-top: 1px solid #dfe2e6;
          margin-top: 5px;
          padding-top: 11px !important;
          font-size: 12px !important;
        }

        .grand-total span,
        .grand-total b {
          color: #182033;
          font-weight: 900;
        }

        .preview-actions {
          padding: 14px 18px;
          border-top: 1px solid #e2e4ea;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          background: #fff;
        }

        .secondary-action,
        .print-action {
          height: 42px;
          padding: 0 18px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .secondary-action {
          border: 1px solid #e3e5ec;
          background: #fff;
          color: #626574;
        }

        .print-action {
          border: 0;
          background: #171925;
          color: white;
        }

        @media (max-width: 850px) {
          .main-grid {
            grid-template-columns: 1fr;
          }

          .summary-area {
            position: static;
            order: -1;
          }

          .summary-card {
            padding: 17px;
          }

          .quick-tip {
            display: none;
          }

          .summary-preview {
            display: none;
          }

          .summary-top {
            padding-bottom: 13px;
          }

          .summary-lines {
            padding-bottom: 0;
          }

          .summary-lines {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 20px;
          }

          .summary-total {
            grid-column: 1 / -1;
          }

          .summary-lines > div {
            margin-bottom: 8px;
          }
        }

        @media (max-width: 650px) {
          .invoice-page {
            padding: 16px 12px 40px;
          }

          .topbar {
            margin-bottom: 20px;
          }

          .brand-mark {
            width: 37px;
            height: 37px;
            border-radius: 10px;
          }

          .brand-name {
            font-size: 14px;
          }
          .brand-name span { display:block; font-size:11px; }

          .brand-sub {
            font-size: 10px;
          }

          .reset-btn {
            padding: 8px 11px;
            font-size: 10px;
          }

          .progress-wrap {
            gap: 5px;
            margin-bottom: 16px;
          }

          .progress-step {
            min-width: 0;
            flex: 1;
            gap: 5px;
          }

          .progress-step > span {
            width: 25px;
            height: 25px;
            font-size: 9px;
          }

          .progress-step div {
            display: none;
          }

          .progress-line {
            max-width: none;
          }

          .step-card {
            padding: 19px 15px;
            border-radius: 16px;
          }

          .step-heading {
            margin-bottom: 21px;
          }

          .heading-icon {
            width: 39px;
            height: 39px;
            border-radius: 11px;
          }

          .step-heading h1 {
            font-size: 18px;
          }

          .step-heading p {
            font-size: 10px;
          }

          .two-col {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .currency-row {
            align-items: stretch;
            flex-direction: column;
          }

          .currency-row > div:first-child {
            width: 100%;
          }

          .invoice-meta {
            justify-content: space-between;
          }

          .items-header {
            grid-template-columns: 1fr 55px 95px 30px;
            gap: 5px;
            padding: 9px 7px;
          }

          .item-row {
            grid-template-columns: minmax(0, 1fr) 55px 95px 30px;
            gap: 5px;
            padding: 8px 7px;
          }

          .item-row input {
            font-size: 11px;
            padding: 0 8px;
          }

          .price-input {
            width: 95px;
          }

          .remove-item {
            width: 28px;
          }

          .adjustments {
            grid-template-columns: 1fr 1fr;
          }

          .button-row {
            grid-template-columns: 90px 1fr;
          }

          .modal-overlay {
            padding: 0;
          }

          .preview-modal {
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .invoice-paper {
            width: calc(100% - 24px);
            padding: 24px 18px;
            margin: 12px auto;
          }

          .paper-header {
            gap: 15px;
          }

          .paper-header h2 {
            font-size: 17px;
          }

          .invoice-title h1 {
            font-size: 21px;
          }

          .invoice-title {
            min-width: 110px;
          }

          .invoice-title div {
            font-size: 7px;
          }

          .invoice-table {
            font-size: 8px;
          }

          .invoice-table th {
            font-size: 7px;
          }

          .invoice-table td {
            padding: 10px 5px;
          }

          .paper-bottom {
            gap: 15px;
            flex-direction: column;
          }

          .paper-totals {
            width: 100%;
          }

          .preview-actions {
            padding: 11px 12px;
          }

          .secondary-action,
          .print-action {
            flex: 1;
            padding: 0 10px;
          }
        }

        @media print {
          body {
            background: white !important;
          }

          .invoice-page {
            display: none !important;
          }

          .modal-overlay {
            position: static !important;
            background: white !important;
            padding: 0 !important;
          }

          .preview-modal {
            width: 100% !important;
            max-height: none !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          .preview-toolbar,
          .preview-actions {
            display: none !important;
          }

          .invoice-paper {
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 25px !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}
