import { useState, useEffect } from "react"
import axios from "axios"

const cards = [
    { key: "total_users",           label: "Total de Usuários",          icon: "fa-users",           color: "#3b82f6", bg: "#eff6ff" },
    { key: "active_users",          label: "Usuários Ativos",            icon: "fa-user-check",       color: "#16a34a", bg: "#f0fdf4" },
    { key: "inactive_users",        label: "Usuários Inativos",          icon: "fa-user-xmark",       color: "#dc2626", bg: "#fff1f2" },
    { key: "total_services",        label: "Serviços / Produtos",        icon: "fa-box",              color: "#e63946", bg: "#fff1f2" },
    { key: "total_categories",      label: "Categorias",                 icon: "fa-tags",             color: "#7c3aed", bg: "#f5f3ff" },
    { key: "total_payment_methods", label: "Formas de Pagamento",        icon: "fa-credit-card",      color: "#0891b2", bg: "#ecfeff" },
]

export default function Dashboard() {
    const [data, setData]       = useState(null)
    const [loading, setLoading] = useState(true)
    const user = window.authUser ?? {}

    useEffect(() => {
        axios.get("/dashboard/data")
            .then(res => setData(res.data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "8px" }}>

            {/* Boas vindas */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111", margin: 0 }}>
                    Olá, {user.username ?? "usuário"} 👋
                </h1>
                <p style={{ color: "#888", fontSize: "14px", margin: "6px 0 0" }}>
                    Aqui está um resumo do sistema.
                </p>
            </div>

            {/* Cards */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
                    Carregando dados...
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                }}>
                    {cards.map(card => (
                        <div key={card.key} style={{
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: "14px",
                            padding: "20px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                background: card.bg, display: "flex", alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <i className={`fas ${card.icon}`} style={{ color: card.color, fontSize: "18px" }} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#111", lineHeight: 1 }}>
                                    {data?.[card.key] ?? 0}
                                </p>
                                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#888" }}>
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}