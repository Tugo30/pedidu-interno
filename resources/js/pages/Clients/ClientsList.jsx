import { useState, useEffect } from "react";
import axios from "axios";

const csrf = () => document.querySelector('meta[name="csrf-token"]').content;

export default function ClientsList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        axios
            .get("/clients/data")
            .then((res) => {
                setClients(res.data);
                const exp = {};
                res.data.forEach((c) => {
                    const key = c.group?.nome ?? "__sem_grupo__";
                    exp[key] = true;
                });
                setExpanded(exp);
            })
            .catch(() => setError("Erro ao carregar clientes."))
            .finally(() => setLoading(false));
    }, []);

    function toggleGroup(key) {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    async function handleToggle(id) {
        try {
            const res = await axios.patch(
                `/clients/${id}/toggle`,
                {},
                {
                    headers: { "X-CSRF-TOKEN": csrf() },
                },
            );
            setClients((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, active: res.data.active } : c,
                ),
            );
        } catch {
            alert("Erro ao atualizar status.");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
        try {
            await axios.delete(`/clients/${id}`, {
                headers: { "X-CSRF-TOKEN": csrf() },
            });
            setClients((prev) => prev.filter((c) => c.id !== id));
        } catch {
            alert("Erro ao excluir.");
        }
    }

    if (loading)
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#888",
                    fontFamily: "DM Sans, sans-serif",
                }}
            >
                Carregando clientes...
            </div>
        );

    if (error)
        return (
            <div
                style={{
                    padding: "20px",
                    color: "#e63946",
                    fontFamily: "DM Sans, sans-serif",
                }}
            >
                {error}
            </div>
        );

    // Agrupa clientes por grupo
    const groups = {};
    clients.forEach((c) => {
        const key = c.group?.nome ?? "__sem_grupo__";
        if (!groups[key])
            groups[key] = { label: c.group?.nome ?? null, clients: [] };
        groups[key].clients.push(c);
    });

    // Grupos com nome primeiro (alfabético), sem grupo por último
    const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (a === "__sem_grupo__") return 1;
        if (b === "__sem_grupo__") return -1;
        return a.localeCompare(b);
    });

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "8px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "22px",
                            fontWeight: "700",
                            color: "#111",
                            margin: 0,
                        }}
                    >
                        Clientes
                    </h1>
                    <p
                        style={{
                            color: "#888",
                            fontSize: "13px",
                            margin: "4px 0 0",
                        }}
                    >
                        {clients.length} cliente(s) ·{" "}
                        {sortedKeys.filter((k) => k !== "__sem_grupo__").length}{" "}
                        grupo(s)
                    </p>
                </div>
                <a
                    href="/clients/create"
                    style={{
                        background: "#e63946",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <i className="fas fa-plus" />
                    Novo Cliente
                </a>
            </div>

            {clients.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px",
                        color: "#aaa",
                    }}
                >
                    <i
                        className="fas fa-building"
                        style={{
                            fontSize: "40px",
                            marginBottom: "12px",
                            display: "block",
                        }}
                    />
                    Nenhum cliente cadastrado ainda.
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {sortedKeys.map((key) => {
                        const group = groups[key];
                        const isOpen = expanded[key] ?? true;
                        const isSemGrupo = key === "__sem_grupo__";

                        return (
                            <div
                                key={key}
                                style={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    background: "#fff",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                }}
                            >
                                {/* Header do grupo */}
                                <div
                                    onClick={() => toggleGroup(key)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "14px 20px",
                                        cursor: "pointer",
                                        background: isOpen ? "#fafafa" : "#fff",
                                        borderBottom: isOpen
                                            ? "1px solid #e2e8f0"
                                            : "none",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "34px",
                                                height: "34px",
                                                borderRadius: "8px",
                                                background: isSemGrupo
                                                    ? "#f1f5f9"
                                                    : "#fff1f2",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <i
                                                className={`fas ${isSemGrupo ? "fa-users" : "fa-users-rectangle"}`}
                                                style={{
                                                    color: isSemGrupo
                                                        ? "#94a3b8"
                                                        : "#e63946",
                                                    fontSize: "14px",
                                                }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontWeight: "700",
                                                fontSize: "14px",
                                                color: isSemGrupo
                                                    ? "#94a3b8"
                                                    : "#111",
                                            }}
                                        >
                                            {isSemGrupo
                                                ? "Sem Grupo"
                                                : group.label}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: "999px",
                                                background: "#f1f5f9",
                                                color: "#475569",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {group.clients.length} cliente(s)
                                        </span>
                                        <i
                                            className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
                                            style={{
                                                color: "#aaa",
                                                fontSize: "13px",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Cards */}
                                {isOpen && (
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill, minmax(280px, 1fr))",
                                            gap: "16px",
                                            padding: "16px 20px",
                                        }}
                                    >
                                        {group.clients.map((client) => (
                                            <div
                                                key={client.id}
                                                style={{
                                                    background: "#fff",
                                                    border: "1px solid #eee",
                                                    borderRadius: "12px",
                                                    padding: "18px",
                                                    boxShadow:
                                                        "0 1px 4px rgba(0,0,0,0.06)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "12px",
                                                    opacity: client.active
                                                        ? 1
                                                        : 0.6,
                                                }}
                                            >
                                                {/* Avatar + Info */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "12px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: "44px",
                                                            height: "44px",
                                                            borderRadius: "50%",
                                                            background:
                                                                client.active
                                                                    ? "#e63946"
                                                                    : "#ccc",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            color: "#fff",
                                                            fontWeight: "700",
                                                            fontSize: "16px",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {client.nome?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div
                                                        style={{
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontWeight:
                                                                    "600",
                                                                fontSize:
                                                                    "15px",
                                                                color: "#111",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                            }}
                                                        >
                                                            {client.nome}
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize:
                                                                    "12px",
                                                                color: "#888",
                                                            }}
                                                        >
                                                            {client.razao_social ??
                                                                client.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Detalhes */}
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#555",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    {(client.cnpj ||
                                                        client.cpf) && (
                                                        <span>
                                                            <i
                                                                className="fas fa-id-card me-2"
                                                                style={{
                                                                    color: "#aaa",
                                                                }}
                                                            />
                                                            {client.cnpj ??
                                                                client.cpf}
                                                        </span>
                                                    )}
                                                    <span>
                                                        <i
                                                            className="fas fa-envelope me-2"
                                                            style={{
                                                                color: "#aaa",
                                                            }}
                                                        />
                                                        {client.email}
                                                    </span>
                                                    {client.telefone && (
                                                        <span>
                                                            <i
                                                                className="fas fa-phone me-2"
                                                                style={{
                                                                    color: "#aaa",
                                                                }}
                                                            />
                                                            {client.telefone}
                                                        </span>
                                                    )}
                                                    {client.cidade && (
                                                        <span>
                                                            <i
                                                                className="fas fa-location-dot me-2"
                                                                style={{
                                                                    color: "#aaa",
                                                                }}
                                                            />
                                                            {client.cidade} -{" "}
                                                            {client.estado}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Badge status */}
                                                <div>
                                                    <span
                                                        style={{
                                                            padding: "3px 10px",
                                                            borderRadius:
                                                                "999px",
                                                            fontSize: "11px",
                                                            fontWeight: "600",
                                                            background:
                                                                client.active
                                                                    ? "#dcfce7"
                                                                    : "#fee2e2",
                                                            color: client.active
                                                                ? "#16a34a"
                                                                : "#dc2626",
                                                        }}
                                                    >
                                                        {client.active
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </span>
                                                </div>

                                                {/* Ações */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <a
                                                        href={`/clients/${client.id}/edit`}
                                                        style={{
                                                            flex: 1,
                                                            textAlign: "center",
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            border: "1px solid #e2e8f0",
                                                            color: "#475569",
                                                            textDecoration:
                                                                "none",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        <i className="fas fa-pen me-1" />{" "}
                                                        Editar
                                                    </a>
                                                    <button
                                                        onClick={() =>
                                                            handleToggle(
                                                                client.id,
                                                            )
                                                        }
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            border: `1px solid ${client.active ? "#fca5a5" : "#86efac"}`,
                                                            background:
                                                                client.active
                                                                    ? "#fff1f2"
                                                                    : "#f0fdf4",
                                                            color: client.active
                                                                ? "#dc2626"
                                                                : "#16a34a",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        <i
                                                            className={`fas ${client.active ? "fa-ban" : "fa-check"} me-1`}
                                                        />
                                                        {client.active
                                                            ? "Bloquear"
                                                            : "Ativar"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                client.id,
                                                            )
                                                        }
                                                        style={{
                                                            padding: "8px 12px",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            border: "1px solid #fca5a5",
                                                            background:
                                                                "#fff1f2",
                                                            color: "#dc2626",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        <i className="fas fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
