"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  qty: number;
  price: number;
};

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

export default function InvoiceClient() {
  const [currency, setCurrency] = useState("INR");

  const [business, setBusiness] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [invoice, setInvoice] = useState({
    number: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
  });

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", qty: 1, price: 0 },
  ]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    "percent"
  );

  const [showPreview, setShowPreview] = useState(false);

  const currencyInfo =
    CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (discountType === "amount") {
      return Math.min(discount, subtotal);
    }

    return subtotal * (discount / 100);
  }, [discount, discountType, subtotal]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const taxAmount = taxableAmount * (tax / 100);

  const total = taxableAmount + taxAmount;

  const formatMoney = (value: number) => {
    return `${currencyInfo.symbol}${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const updateBusiness = (
    field: keyof typeof business,
    value: string
  ) => {
    setBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCustomer = (
    field: keyof typeof customer,
    value: string
  ) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateItem = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" || field === "price"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        qty: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetInvoice = () => {
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

    setInvoice({
      number: "INV-001",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
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
    setDiscountType("percent");
    setShowPreview(false);
  };

  const printInvoice = () => {
    window.print();
  };

  const isReady =
    business.name.trim() !== "" &&
    customer.name.trim() !== "" &&
    items.some(
      (item) => item.name.trim() !== "" && item.price > 0
    );

  return (
    <main className="invoice-page">
      <div className="invoice-shell">

        {/* HEADER */}
        <header className="top-header">
          <div>
            <div className="eyebrow">
              <span className="dot" />
              FREE INVOICE MAKER
            </div>

            <h1>
              Create an Invoice
              <span> in minutes.</span>
            </h1>

            <p>
              Fill in the details below and get a clean,
              professional invoice ready to download or print.
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              onClick={resetInvoice}
              className="reset-btn"
            >
              ↻ Reset
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="preview-btn"
              disabled={!isReady}
            >
              Preview Invoice →
            </button>
          </div>
        </header>

        {/* QUICK STEPS */}
        <div className="steps">
          <div className="step active">
            <span>1</span>
            Business
          </div>

          <div className="step-line" />

          <div className="step">
            <span>2</span>
            Customer
          </div>

          <div className="step-line" />

          <div className="step">
            <span>3</span>
            Items
          </div>

          <div className="step-line" />

          <div className="step">
            <span>4</span>
            Finish
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">

          {/* LEFT FORM */}
          <section className="form-column">

            {/* BUSINESS */}
            <div className="card">
              <div className="card-header">
                <div className="number">01</div>

                <div>
                  <h2>Your business</h2>
                  <p>
                    Enter the details that should appear on your invoice.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <Field
                  label="Business name"
                  placeholder="e.g. Acme Design Studio"
                  value={business.name}
                  onChange={(v) => updateBusiness("name", v)}
                  required
                />

                <Field
                  label="Email"
                  placeholder="you@business.com"
                  type="email"
                  value={business.email}
                  onChange={(v) => updateBusiness("email", v)}
                />

                <Field
                  label="Phone"
                  placeholder="+91 98765 43210"
                  value={business.phone}
                  onChange={(v) => updateBusiness("phone", v)}
                />

                <Field
                  label="GST / Tax ID"
                  placeholder="Optional"
                  value={business.gst}
                  onChange={(v) => updateBusiness("gst", v)}
                />

                <div className="field full">
                  <label>Business address</label>

                  <textarea
                    value={business.address}
                    onChange={(e) =>
                      updateBusiness("address", e.target.value)
                    }
                    placeholder="Street, city, state, postal code"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="card">
              <div className="card-header">
                <div className="number">02</div>

                <div>
                  <h2>Bill to</h2>
                  <p>
                    Who is this invoice for?
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <Field
                  label="Customer name"
                  placeholder="e.g. Rahul Sharma"
                  value={customer.name}
                  onChange={(v) => updateCustomer("name", v)}
                  required
                />

                <Field
                  label="Customer email"
                  placeholder="customer@email.com"
                  type="email"
                  value={customer.email}
                  onChange={(v) => updateCustomer("email", v)}
                />

                <div className="field full">
                  <label>Customer address</label>

                  <textarea
                    value={customer.address}
                    onChange={(e) =>
                      updateCustomer("address", e.target.value)
                    }
                    placeholder="Customer billing address"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* INVOICE DETAILS */}
            <div className="card">
              <div className="card-header">
                <div className="number">03</div>

                <div>
                  <h2>Invoice details</h2>
                  <p>
                    Give your invoice a number and date.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <Field
                  label="Invoice number"
                  placeholder="INV-001"
                  value={invoice.number}
                  onChange={(v) =>
                    setInvoice((p) => ({
                      ...p,
                      number: v,
                    }))
                  }
                />

                <div className="field">
                  <label>Currency</label>

                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code} — {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Invoice date</label>

                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) =>
                      setInvoice((p) => ({
                        ...p,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Due date</label>

                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) =>
                      setInvoice((p) => ({
                        ...p,
                        dueDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* ITEMS */}
            <div className="card items-card">
              <div className="card-header">
                <div className="number">04</div>

                <div>
                  <h2>What are you charging for?</h2>
                  <p>
                    Add your products or services below.
                  </p>
                </div>
              </div>

              <div className="items-table">
                <div className="item-head">
                  <span>Item / service</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                  <span />
                </div>

                {items.map((item) => (
                  <div className="item-row" key={item.id}>
                    <input
                      className="item-name"
                      placeholder="e.g. Website design"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      className="qty"
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
                        placeholder="0"
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "price",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <strong className="item-total">
                      {formatMoney(item.qty * item.price)}
                    </strong>

                    <button
                      type="button"
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

              <button
                type="button"
                onClick={addItem}
                className="add-item"
              >
                + Add another item
              </button>
            </div>

            {/* TAX + DISCOUNT */}
            <div className="card">
              <div className="card-header">
                <div className="number">05</div>

                <div>
                  <h2>Tax & discount</h2>
                  <p>
                    Optional — leave at 0 if you don't need them.
                  </p>
                </div>
              </div>

              <div className="small-grid">
                <div className="field">
                  <label>Tax</label>

                  <div className="input-suffix">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tax}
                      onChange={(e) =>
                        setTax(Math.max(0, Number(e.target.value)))
                      }
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="field">
                  <label>Discount</label>

                  <div className="discount-control">
                    <input
                      type="number"
                      min="0"
                      value={discount || ""}
                      placeholder="0"
                      onChange={(e) =>
                        setDiscount(
                          Math.max(0, Number(e.target.value))
                        )
                      }
                    />

                    <select
                      value={discountType}
                      onChange={(e) =>
                        setDiscountType(
                          e.target.value as
                            | "percent"
                            | "amount"
                        )
                      }
                    >
                      <option value="percent">%</option>
                      <option value="amount">
                        {currencyInfo.symbol}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTES */}
            <div className="card">
              <div className="card-header compact">
                <div className="number">06</div>

                <div>
                  <h2>Notes</h2>
                  <p>
                    Add payment instructions or a thank-you message.
                  </p>
                </div>
              </div>

              <textarea
                className="notes"
                rows={4}
                placeholder="e.g. Payment is due within 15 days. Thank you for your business!"
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice((p) => ({
                    ...p,
                    notes: e.target.value,
                  }))
                }
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={!isReady}
              className="mobile-preview"
            >
              Preview Invoice →
            </button>
          </section>

          {/* RIGHT SUMMARY */}
          <aside className="summary-column">
            <div className="summary-card">
              <div className="summary-top">
                <div>
                  <span>INVOICE TOTAL</span>
                  <strong>{formatMoney(total)}</strong>
                </div>

                <div className="currency-badge">
                  {currencyInfo.code}
                </div>
              </div>

              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatMoney(subtotal)}</strong>
                </div>

                <div>
                  <span>Discount</span>
                  <strong>
                    -{formatMoney(discountAmount)}
                  </strong>
                </div>

                <div>
                  <span>Tax</span>
                  <strong>{formatMoney(taxAmount)}</strong>
                </div>
              </div>

              <div className="summary-total">
                <span>Total due</span>
                <strong>{formatMoney(total)}</strong>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!isReady}
                className="summary-preview"
              >
                Review Invoice
                <span>→</span>
              </button>

              {!isReady && (
                <p className="summary-help">
                  Add your business, customer and at least one
                  priced item to continue.
                </p>
              )}

              {isReady && (
                <div className="ready">
                  <span>✓</span>
                  Ready to preview
                </div>
              )}
            </div>

            <div className="help-card">
              <div className="help-icon">✓</div>

              <div>
                <strong>Simple & private</strong>

                <p>
                  Your invoice is created directly in your
                  browser. No account required.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer>
          <span>100% Free</span>
          <i>•</i>
          <span>No Sign-up</span>
          <i>•</i>
          <span>Professional Invoices</span>
        </footer>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div
          className="modal-backdrop"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-toolbar">
              <div>
                <strong>Invoice Preview</strong>
                <span>
                  Check everything before printing.
                </span>
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  onClick={printInvoice}
                  className="print-btn"
                >
                  Print / Save PDF
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="invoice-paper">
              <div className="paper-top">
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

                <div className="paper-invoice">
                  <h1>INVOICE</h1>

                  <p>
                    <strong>#{invoice.number}</strong>
                  </p>

                  <p>
                    Date: {formatDate(invoice.date)}
                  </p>

                  {invoice.dueDate && (
                    <p>
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bill-box">
                <span>BILL TO</span>

                <strong>
                  {customer.name || "Customer"}
                </strong>

                {customer.email && (
                  <p>{customer.email}</p>
                )}

                {customer.address && (
                  <p>{customer.address}</p>
                )}
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items
                    .filter(
                      (item) =>
                        item.name.trim() !== "" ||
                        item.price > 0
                    )
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.name || "Item"}
                        </td>

                        <td>{item.qty}</td>

                        <td>
                          {formatMoney(item.price)}
                        </td>

                        <td>
                          {formatMoney(
                            item.qty * item.price
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="paper-bottom">
                <div className="paper-notes">
                  {invoice.notes && (
                    <>
                      <strong>Notes</strong>
                      <p>{invoice.notes}</p>
                    </>
                  )}
                </div>

                <div className="paper-total">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatMoney(subtotal)}
                    </strong>
                  </div>

                  {discountAmount > 0 && (
                    <div>
                      <span>Discount</span>
                      <strong>
                        -{formatMoney(discountAmount)}
                      </strong>
                    </div>
                  )}

                  {taxAmount > 0 && (
                    <div>
                      <span>Tax ({tax}%)</span>
                      <strong>
                        {formatMoney(taxAmount)}
                      </strong>
                    </div>
                  )}

                  <div className="grand-total">
                    <span>Total due</span>
                    <strong>
                      {formatMoney(total)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="paper-thanks">
                Thank you for your business.
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .invoice-page {
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(108, 92, 231, 0.09),
              transparent 35%
            ),
            #f7f8fb;
          color: #171925;
          padding: 26px 14px 70px;
          font-family:
            "Plus Jakarta Sans",
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .invoice-shell {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
        }

        .top-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 20px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #777b8b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6c5ce7;
          box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
        }

        .top-header h1 {
          margin: 10px 0 6px;
          font-size: clamp(28px, 5vw, 40px);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .top-header h1 span {
          color: #6c5ce7;
        }

        .top-header p {
          max-width: 570px;
          margin: 0;
          color: #858997;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex: 0 0 auto;
        }

        button {
          font-family: inherit;
        }

        .reset-btn,
        .preview-btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
        }

        .reset-btn {
          border: 1px solid #e3e5ec;
          background: #fff;
          color: #666978;
        }

        .preview-btn {
          border: 0;
          background: #171925;
          color: #fff;
          box-shadow: 0 8px 22px rgba(23, 25, 37, 0.12);
        }

        .preview-btn:disabled,
        .summary-preview:disabled,
        .mobile-preview:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .steps {
          display: flex;
          align-items: center;
          max-width: 650px;
          margin: 0 auto 18px;
          padding: 8px 12px;
          border: 1px solid #e7e9ef;
          border-radius: 999px;
          background: #fff;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999ca8;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .step span {
          display: grid;
          place-items: center;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: #f0f1f5;
          color: #777b88;
          font-size: 8px;
        }

        .step.active {
          color: #6c5ce7;
        }

        .step.active span {
          background: #6c5ce7;
          color: #fff;
        }

        .step-line {
          flex: 1;
          height: 1px;
          margin: 0 10px;
          background: #eceef3;
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 290px;
          gap: 16px;
          align-items: start;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .card {
          background: #fff;
          border: 1px solid #e6e8ef;
          border-radius: 18px;
          padding: 17px;
          box-shadow: 0 8px 28px rgba(31, 35, 55, 0.035);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 15px;
        }

        .card-header.compact {
          margin-bottom: 12px;
        }

        .number {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 29px;
          height: 29px;
          border-radius: 9px;
          background: #f0edff;
          color: #6c5ce7;
          font-size: 9px;
          font-weight: 950;
        }

        .card-header h2 {
          margin: 0;
          font-size: 14px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .card-header p {
          margin: 3px 0 0;
          color: #999ca8;
          font-size: 9px;
          line-height: 1.4;
          font-weight: 500;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          margin: 0 0 5px;
          color: #555867;
          font-size: 9px;
          font-weight: 850;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #e4e6ed;
          outline: none;
          background: #fafbfc;
          color: #181a25;
          border-radius: 9px;
          font-family: inherit;
          font-size: 10px;
          font-weight: 650;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        input,
        select {
          height: 39px;
          padding: 0 10px;
        }

        textarea {
          padding: 10px;
          resize: vertical;
          min-height: 75px;
          line-height: 1.5;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #aaa0f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.08);
        }

        input::placeholder,
        textarea::placeholder {
          color: #b0b3bd;
          font-weight: 500;
        }

        .items-table {
          width: 100%;
          overflow-x: auto;
        }

        .item-head,
        .item-row {
          display: grid;
          grid-template-columns:
            minmax(150px, 1fr)
            65px
            115px
            105px
            28px;
          gap: 8px;
          align-items: center;
          min-width: 500px;
        }

        .item-head {
          padding: 0 8px 7px;
          color: #999ca8;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .item-row {
          padding: 7px;
          border: 1px solid #eef0f4;
          border-radius: 10px;
          background: #fcfcfd;
          margin-bottom: 7px;
        }

        .item-row input {
          background: #fff;
        }

        .item-name {
          min-width: 0;
        }

        .qty {
          text-align: center;
        }

        .price-input {
          display: flex;
          align-items: center;
          height: 39px;
          border: 1px solid #e4e6ed;
          border-radius: 9px;
          background: #fff;
          overflow: hidden;
        }

        .price-input span {
          padding-left: 9px;
          color: #999ca8;
          font-size: 9px;
          font-weight: 800;
        }

        .price-input input {
          border: 0;
          box-shadow: none !important;
          background: transparent;
          padding-left: 4px;
        }

        .item-total {
          color: #252733;
          font-size: 9px;
          font-weight: 900;
          text-align: right;
        }

        .remove-item {
          display: grid;
          place-items: center;
          width: 27px;
          height: 27px;
          border: 0;
          border-radius: 8px;
          background: #fff1f1;
          color: #dc5757;
          font-size: 16px;
          cursor: pointer;
        }

        .remove-item:disabled {
          opacity: 0.25;
          cursor: default;
        }

        .add-item {
          margin-top: 3px;
          border: 0;
          background: transparent;
          color: #6c5ce7;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .small-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .input-suffix,
        .discount-control {
          display: flex;
          align-items: center;
          height: 39px;
          border: 1px solid #e4e6ed;
          border-radius: 9px;
          background: #fafbfc;
          overflow: hidden;
        }

        .input-suffix input,
        .discount-control input {
          border: 0;
          box-shadow: none !important;
          background: transparent;
        }

        .input-suffix span {
          padding-right: 11px;
          color: #999ca8;
          font-size: 10px;
          font-weight: 900;
        }

        .discount-control select {
          width: 60px;
          border: 0;
          border-left: 1px solid #e4e6ed;
          border-radius: 0;
          background: #fff;
          font-weight: 900;
        }

        .notes {
          min-height: 90px;
        }

        .summary-column {
          position: sticky;
          top: 15px;
        }

        .summary-card {
          padding: 17px;
          border: 1px solid #e1e3eb;
          border-radius: 18px;
          background: #171925;
          color: #fff;
          box-shadow: 0 16px 45px rgba(23, 25, 37, 0.13);
        }

        .summary-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .summary-top span {
          display: block;
          color: #999baa;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .summary-top strong {
          display: block;
          margin-top: 4px;
          font-size: 25px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .currency-badge {
          padding: 5px 7px;
          border-radius: 7px;
          background: rgba(255,255,255,.09);
          color: #c8c5ff;
          font-size: 7px;
          font-weight: 900;
        }

        .summary-lines {
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .summary-lines > div,
        .summary-total {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .summary-lines > div {
          margin-bottom: 8px;
        }

        .summary-lines > div:last-child {
          margin-bottom: 0;
        }

        .summary-lines span {
          color: #a1a3b0;
          font-size: 9px;
          font-weight: 600;
        }

        .summary-lines strong {
          color: #f4f4f7;
          font-size: 9px;
          font-weight: 850;
        }

        .summary-total {
          padding: 14px 0;
          align-items: center;
        }

        .summary-total span {
          color: #fff;
          font-size: 10px;
          font-weight: 850;
        }

        .summary-total strong {
          color: #fff;
          font-size: 16px;
          font-weight: 950;
        }

        .summary-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 42px;
          padding: 0 13px;
          border: 0;
          border-radius: 10px;
          background: #fff;
          color: #171925;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .summary-preview span {
          font-size: 15px;
        }

        .summary-help {
          margin: 9px 0 0;
          color: #9295a2;
          font-size: 8px;
          line-height: 1.5;
        }

        .ready {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 9px;
          color: #74e0b2;
          font-size: 8px;
          font-weight: 800;
        }

        .ready span {
          display: grid;
          place-items: center;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.13);
        }

        .help-card {
          display: flex;
          gap: 9px;
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #e8e9ef;
          border-radius: 14px;
          background: #fff;
        }

        .help-icon {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 25px;
          height: 25px;
          border-radius: 8px;
          background: #e9faf3;
          color: #16a36a;
          font-size: 9px;
          font-weight: 900;
        }

        .help-card strong {
          color: #343642;
          font-size: 9px;
          font-weight: 900;
        }

        .help-card p {
          margin: 3px 0 0;
          color: #9295a1;
          font-size: 8px;
          line-height: 1.45;
        }

        .mobile-preview {
          display: none;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 22px;
          color: #a5a8b3;
          font-size: 8px;
          font-weight: 750;
        }

        footer i {
          font-style: normal;
          color: #d0d2d8;
        }

        /* MODAL */

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(14, 15, 23, 0.58);
          backdrop-filter: blur(8px);
        }

        .preview-modal {
          width: min(900px, 100%);
          max-height: 92vh;
          overflow: auto;
          border-radius: 18px;
          background: #f4f5f8;
          box-shadow: 0 30px 100px rgba(0,0,0,.28);
        }

        .preview-toolbar {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid #e2e4ea;
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(10px);
        }

        .preview-toolbar strong {
          display: block;
          font-size: 11px;
          font-weight: 950;
        }

        .preview-toolbar span {
          display: block;
          margin-top: 2px;
          color: #979aa6;
          font-size: 8px;
        }

        .preview-actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .print-btn {
          height: 34px;
          padding: 0 11px;
          border: 0;
          border-radius: 8px;
          background: #171925;
          color: #fff;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .close-btn {
          width: 34px;
          height: 34px;
          border: 1px solid #e4e6ec;
          border-radius: 8px;
          background: #fff;
          color: #555865;
          font-size: 19px;
          cursor: pointer;
        }

        .invoice-paper {
          width: min(760px, calc(100% - 30px));
          margin: 15px auto;
          padding: 38px;
          background: #fff;
          color: #20212a;
          box-shadow: 0 10px 35px rgba(31,35,55,.08);
        }

        .paper-top {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e8e9ee;
        }

        .paper-top h2 {
          margin: 0 0 7px;
          font-size: 20px;
          font-weight: 950;
        }

        .paper-top p {
          margin: 2px 0;
          color: #777a86;
          font-size: 8px;
          line-height: 1.4;
        }

        .paper-invoice {
          text-align: right;
        }

        .paper-invoice h1 {
          margin: 0 0 7px;
          color: #6c5ce7;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: .03em;
        }

        .paper-invoice p {
          margin: 3px 0;
          color: #777a86;
          font-size: 8px;
        }

        .paper-invoice p strong {
          color: #22232b;
        }

        .bill-box {
          margin: 20px 0;
          padding: 13px;
          border-radius: 9px;
          background: #f7f7fa;
        }

        .bill-box span {
          display: block;
          margin-bottom: 5px;
          color: #999ca7;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .bill-box strong {
          display: block;
          font-size: 10px;
          font-weight: 900;
        }

        .bill-box p {
          margin: 2px 0;
          color: #777a86;
          font-size: 8px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-table th {
          padding: 8px 6px;
          border-bottom: 1px solid #e3e5eb;
          color: #898c98;
          font-size: 7px;
          font-weight: 950;
          text-align: left;
          text-transform: uppercase;
        }

        .invoice-table th:not(:first-child),
        .invoice-table td:not(:first-child) {
          text-align: right;
        }

        .invoice-table td {
          padding: 10px 6px;
          border-bottom: 1px solid #f0f1f4;
          font-size: 8px;
          font-weight: 650;
        }

        .paper-bottom {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin-top: 25px;
        }

        .paper-notes {
          max-width: 300px;
        }

        .paper-notes strong {
          font-size: 8px;
          font-weight: 900;
        }

        .paper-notes p {
          margin: 4px 0 0;
          color: #777a86;
          font-size: 8px;
          line-height: 1.5;
        }

        .paper-total {
          width: 230px;
        }

        .paper-total > div {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .paper-total span {
          color: #777a86;
          font-size: 8px;
        }

        .paper-total strong {
          font-size: 8px;
        }

        .paper-total .grand-total {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #dddfe5;
        }

        .paper-total .grand-total span {
          color: #22232b;
          font-weight: 900;
        }

        .paper-total .grand-total strong {
          color: #6c5ce7;
          font-size: 15px;
          font-weight: 950;
        }

        .paper-thanks {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e8e9ee;
          text-align: center;
          color: #999ca7;
          font-size: 8px;
          font-weight: 650;
        }

        @media print {
          body {
            background: #fff !important;
          }

          .invoice-page,
          .modal-backdrop {
            background: #fff !important;
            padding: 0 !important;
          }

          .preview-modal {
            width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .preview-toolbar {
            display: none !important;
          }

          .invoice-paper {
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }

        @media (max-width: 850px) {
          .main-grid {
            grid-template-columns: 1fr;
          }

          .summary-column {
            position: static;
            order: -1;
          }

          .summary-card {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 12px;
            align-items: center;
          }

          .summary-top {
            border: 0;
            padding: 0;
          }

          .summary-lines,
          .summary-total {
            display: none;
          }

          .summary-preview {
            width: 180px;
          }

          .help-card {
            display: none;
          }
        }

        @media (max-width: 650px) {
          .invoice-page {
            padding: 18px 10px 60px;
          }

          .top-header {
            display: block;
          }

          .header-actions {
            margin-top: 13px;
          }

          .reset-btn,
          .preview-btn {
            flex: 1;
          }

          .steps {
            overflow-x: auto;
            justify-content: flex-start;
          }

          .step {
            flex: 0 0 auto;
          }

          .step-line {
            min-width: 15px;
          }

          .form-grid,
          .small-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .card {
            padding: 14px;
            border-radius: 15px;
          }

          .summary-card {
            display: block;
          }

          .summary-top {
            padding-bottom: 13px;
            border-bottom: 1px solid rgba(255,255,255,.1);
          }

          .summary-lines {
            display: block;
          }

          .summary-total {
            display: flex;
          }

          .summary-preview {
            width: 100%;
          }

          .mobile-preview {
            display: block;
            width: 100%;
            height: 46px;
            border: 0;
            border-radius: 11px;
            background: #171925;
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            cursor: pointer;
          }

          .top-header h1 {
            font-size: 30px;
          }

          footer {
            flex-wrap: wrap;
          }

          .modal-backdrop {
            padding: 0;
          }

          .preview-modal {
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .invoice-paper {
            width: calc(100% - 18px);
            padding: 20px 15px;
            margin: 9px auto;
          }

          .paper-top {
            gap: 15px;
          }

          .paper-top h2 {
            font-size: 15px;
          }

          .paper-invoice h1 {
            font-size: 19px;
          }

          .paper-bottom {
            flex-direction: column;
          }

          .paper-total {
            width: 100%;
            max-width: 280px;
            margin-left: auto;
          }
        }

        @media (max-width: 430px) {
          .top-header h1 {
            font-size: 27px;
          }

          .top-header p {
            font-size: 10px;
          }

          .header-actions {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
          }

          .summary-top strong {
            font-size: 22px;
          }

          .paper-top {
            flex-direction: column;
          }

          .paper-invoice {
            text-align: left;
          }

          .invoice-table th,
          .invoice-table td {
            font-size: 7px;
            padding: 7px 3px;
          }

          .preview-toolbar {
            padding: 10px;
          }

          .preview-toolbar span {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span style={{ color: "#6c5ce7" }}> *</span>}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "—";

  const d = new Date(`${date}T00:00:00`);

  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
