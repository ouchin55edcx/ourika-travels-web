"use client";

import { QrCode, Download, Info } from "lucide-react";

type TicketProps = {
    bookingId: string;
    activityTitle: string;
    activitySubtitle?: string;
    date: string;
    time: string;
    guests: string;
    totalPrice: string;
    customerName: string;
    quadRide?: string;
    camelRide?: string;
    onClose: () => void;
};

export default function BookingTicket({
    bookingId,
    activityTitle,
    activitySubtitle,
    date,
    time,
    guests,
    totalPrice,
    customerName,
    quadRide,
    camelRide,
    onClose,
}: TicketProps) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

                .ticket-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(6px);
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

                .ticket-wrapper {
                    display: flex;
                    width: 100%;
                    max-width: 680px;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(180,150,80,0.3);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                }

                /* ── MAIN LEFT PANEL ── */
                .ticket-main {
                    flex: 1;
                    background: #fdf8f0;
                    background-image:
                        radial-gradient(ellipse at 20% 0%, rgba(212,175,55,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 100%, rgba(0,79,50,0.06) 0%, transparent 60%);
                    padding: 2rem 2.5rem 1.75rem;
                    position: relative;
                    border-right: none;
                }

                /* ornamental corner borders */
                .ticket-main::before,
                .ticket-main::after {
                    content: '';
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-color: #c9a84c;
                    border-style: solid;
                    opacity: 0.5;
                }
                .ticket-main::before { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
                .ticket-main::after  { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }

                /* ── HEADER ── */
                .ticket-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                }

                .brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic;
                    font-size: 1.35rem;
                    color: #004f32;
                    letter-spacing: 0.5px;
                    line-height: 1;
                }

                .status-badge {
                    font-family: 'Cinzel', serif;
                    font-size: 0.55rem;
                    letter-spacing: 0.12em;
                    color: #9a6c00;
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    border: 1px solid #d4a017;
                    padding: 4px 10px;
                    border-radius: 2px;
                    text-transform: uppercase;
                }

                /* decorative rule */
                .ornament-rule {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0.6rem 0 1.1rem;
                }
                .ornament-rule span {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #c9a84c88, transparent);
                }
                .ornament-rule i {
                    font-style: normal;
                    color: #c9a84c;
                    font-size: 0.7rem;
                    line-height: 1;
                }

                /* ── TITLE ── */
                .activity-title {
                    font-family: 'Cinzel', serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    line-height: 1.25;
                    margin-bottom: 0.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .activity-subtitle {
                    font-family: 'Cinzel', serif;
                    font-size: 0.65rem;
                    color: #6b5c3e;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-bottom: 1.4rem;
                }

                /* ── GRID INFO ── */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0;
                    border: 1px solid #e8d9b8;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 1.25rem;
                }
                .info-cell {
                    padding: 0.65rem 0.9rem;
                    border-right: 1px solid #e8d9b8;
                    border-bottom: 1px solid #e8d9b8;
                }
                .info-cell:nth-child(even) { border-right: none; }
                .info-cell:nth-last-child(-n+2) { border-bottom: none; }
                .info-label {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.55rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #9a8060;
                    margin-bottom: 3px;
                }
                .info-value {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #1a1a1a;
                }

                /* ── PRICE ROW ── */
                .price-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 1rem;
                    border-top: 1px dashed #c9a84c66;
                }

                .price-label {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.55rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #9a8060;
                    margin-bottom: 4px;
                }
                .price-value {
                    font-family: 'Cinzel', serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #004f32;
                    line-height: 1;
                }

                .qr-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .qr-label {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.5rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #9a8060;
                }

                /* ── BUTTONS ── */
                .btn-row {
                    display: flex;
                    gap: 0.6rem;
                    margin-top: 1.25rem;
                }

                .btn-primary {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #004f32, #006644);
                    color: #f0e6c8;
                    padding: 0.65rem 1rem;
                    border: none;
                    border-radius: 2px;
                    font-family: 'Cinzel', serif;
                    font-size: 0.6rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 2px 12px rgba(0,79,50,0.3);
                }
                .btn-primary:hover { background: linear-gradient(135deg, #003622, #004f32); transform: translateY(-1px); }

                .btn-secondary {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    color: #6b5c3e;
                    padding: 0.65rem 1rem;
                    border: 1px solid #c9a84c88;
                    border-radius: 2px;
                    font-family: 'Cinzel', serif;
                    font-size: 0.6rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover { background: #f5ede0; }

                /* ── TEAR LINE ── */
                .tear-line {
                    width: 1px;
                    background: repeating-linear-gradient(
                        to bottom,
                        #c9a84c44 0px, #c9a84c44 6px,
                        transparent 6px, transparent 12px
                    );
                    position: relative;
                    flex-shrink: 0;
                }
                .tear-line::before,
                .tear-line::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 20px;
                    background: rgba(0,0,0,0.75);
                    border-radius: 50%;
                }
                .tear-line::before { top: -10px; }
                .tear-line::after  { bottom: -10px; }

                /* ── SIDEBAR ── */
                .ticket-sidebar {
                    width: 160px;
                    flex-shrink: 0;
                    background: linear-gradient(160deg, #004f32 0%, #00311f 50%, #002714 100%);
                    background-image:
                        linear-gradient(160deg, #004f32 0%, #002714 100%),
                        repeating-linear-gradient(45deg, transparent 0, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 11px);
                    background-blend-mode: normal, overlay;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1.25rem;
                    position: relative;
                    overflow: hidden;
                }

                /* subtle shimmer pattern */
                .ticket-sidebar::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* OT logo circle */
                .sidebar-logo {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    border: 2px solid #c9a84c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(201,168,76,0.1);
                    margin-bottom: 1.5rem;
                    position: relative;
                    box-shadow: 0 0 0 6px rgba(201,168,76,0.07), inset 0 0 20px rgba(201,168,76,0.05);
                }
                .sidebar-logo span {
                    font-family: 'Cinzel', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #c9a84c;
                    letter-spacing: 0.05em;
                }

                .sidebar-divider {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                    margin-bottom: 1.25rem;
                }
                .sidebar-divider span {
                    flex: 1;
                    height: 1px;
                    background: rgba(201,168,76,0.4);
                }
                .sidebar-divider i {
                    font-style: normal;
                    color: #c9a84c;
                    font-size: 0.6rem;
                }

                .sidebar-heading {
                    font-family: 'Cinzel', serif;
                    font-size: 0.55rem;
                    letter-spacing: 0.18em;
                    color: #c9a84c;
                    text-align: center;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                }

                .sidebar-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 0.65rem;
                }
                .sidebar-list li {
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                }
                .sidebar-bullet {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #c9a84c;
                    margin-top: 4px;
                    flex-shrink: 0;
                }
                .sidebar-list li span {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.62rem;
                    color: rgba(255,255,255,0.75);
                    line-height: 1.45;
                }

                /* ── ACCESS BUTTONS ── */
                .access-btns {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 1.5rem;
                    width: 100%;
                }
                .access-btn {
                    text-align: center;
                    padding: 0.45rem;
                    border-radius: 2px;
                    font-family: 'Cinzel', serif;
                    font-size: 0.5rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }
                .access-btn.boarding {
                    background: linear-gradient(135deg, #004f32, #006644);
                    border: 1px solid #c9a84c66;
                    color: #f0e6c8;
                }
                .access-btn.vip {
                    background: linear-gradient(135deg, #c9a84c, #d4af37);
                    color: #002714;
                    font-weight: 700;
                }
                .access-btn:hover { opacity: 0.9; transform: translateY(-1px); }

                @media (max-width: 540px) {
                    .ticket-wrapper { flex-direction: column; max-width: 360px; }
                    .tear-line { width: 100%; height: 1px; }
                    .tear-line::before, .tear-line::after {
                        top: 50%; left: -10px; transform: translateY(-50%);
                        width: 20px; height: 20px;
                    }
                    .tear-line::after { left: auto; right: -10px; }
                    .ticket-sidebar { width: 100%; padding: 1.5rem; }
                    .sidebar-list { flex-direction: row; flex-wrap: wrap; }
                    .access-btns { flex-direction: row; }
                }
            `}</style>

            <div className="ticket-overlay">
                <div className="ticket-wrapper">

                    {/* ── MAIN PANEL ── */}
                    <div className="ticket-main">

                        <div className="ticket-header">
                            <div className="brand-name">Ourika Travels</div>
                            <div className="status-badge">Unpaid · Pay on Start</div>
                        </div>

                        <div className="ornament-rule">
                            <span />
                            <i>✦</i>
                            <span />
                        </div>

                        <div className="activity-title">{activityTitle}</div>
                        {activitySubtitle && (
                            <div className="activity-subtitle">{activitySubtitle}</div>
                        )}

                        <div className="info-grid">
                            <div className="info-cell">
                                <div className="info-label">Booking Ref</div>
                                <div className="info-value">#{bookingId}</div>
                            </div>
                            <div className="info-cell">
                                <div className="info-label">Departure</div>
                                <div className="info-value">{time}</div>
                            </div>
                            <div className="info-cell">
                                <div className="info-label">Date</div>
                                <div className="info-value">{date}</div>
                            </div>
                            <div className="info-cell">
                                <div className="info-label">Guests</div>
                                <div className="info-value">{guests}</div>
                            </div>
                            {quadRide && (
                                <div className="info-cell">
                                    <div className="info-label">Quad Ride</div>
                                    <div className="info-value">{quadRide}</div>
                                </div>
                            )}
                            {camelRide && (
                                <div className="info-cell">
                                    <div className="info-label">Camel Ride</div>
                                    <div className="info-value">{camelRide}</div>
                                </div>
                            )}
                        </div>

                        <div className="price-row">
                            <div>
                                <div className="price-label">Price</div>
                                <div className="price-value">{totalPrice}</div>
                            </div>
                            <div className="qr-box">
                                <QrCode style={{ width: 56, height: 56, color: '#1a1a1a' }} />
                                <div className="qr-label">Scan for details</div>
                            </div>
                        </div>

                        <div className="btn-row">
                            <button className="btn-primary" onClick={() => window.print()}>
                                <Download size={12} />
                                Download Ticket
                            </button>
                            <button className="btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>

                    {/* ── TEAR LINE ── */}
                    <div className="tear-line" />

                    {/* ── SIDEBAR ── */}
                    <div className="ticket-sidebar">
                        <div className="sidebar-logo">
                            <span>OT</span>
                        </div>

                        <div className="sidebar-divider">
                            <span /><i>✦</i><span />
                        </div>

                        <div className="sidebar-heading">Important<br />Information</div>

                        <ul className="sidebar-list">
                            <li>
                                <div className="sidebar-bullet" />
                                <span>Bring comfortable clothing &amp; closed shoes</span>
                            </li>
                            <li>
                                <div className="sidebar-bullet" />
                                <span>Safety briefing &amp; helmets provided</span>
                            </li>
                            <li>
                                <div className="sidebar-bullet" />
                                <span>Dinner &amp; Live Show included</span>
                            </li>
                        </ul>

                        <div className="access-btns">
                            <button className="access-btn boarding">Boarding Pass</button>
                            <button className="access-btn vip">VIP Access</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}