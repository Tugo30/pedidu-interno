import { useState, useEffect } from "react";

const navigation = [
    { type: "link", name: "Home", href: "/", icon: "fa-house" },
    { type: "separator", label: "Cadastros" },
    { type: "link", name: "Clientes", href: "/clients", icon: "fa-building" },
    {
        type: "link",
        name: "Grupos de Clientes",
        href: "/client-groups",
        icon: "fa-users-rectangle",
    },
    { type: "separator", label: "Catálogo" },
    {
        type: "link",
        name: "Serviços / Produtos",
        href: "/services",
        icon: "fa-box",
    },
    { type: "link", name: "Categorias", href: "/categories", icon: "fa-tags" },
    { type: "separator", label: "Financeiro" },
    { type: "link", name: "Pedidos", href: "/orders", icon: "fa-file-invoice" },
    { type: "link", name: "Pedidos por Cliente", href: "/orders/by-client", icon: "fa-users" },
    {
        type: "link",
        name: "Formas de Pagamento",
        href: "/payment-methods",
        icon: "fa-credit-card",
    },
    { type: "separator", label: "Administrativo" },
    { type: "link", name: "Usuários", href: "/users", icon: "fa-users" },
    {
        type: "link",
        name: "Criar Usuário",
        href: "/create_admin",
        icon: "fa-user-plus",
    },
    { type: "link", name: "Perfil", href: "/profile", icon: "fa-user" },
];

export default function Sidebar() {
    const user = window.authUser ?? {};
    const currentPath = window.location.pathname;
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setOpen(false);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (
                !e.target.closest("#sidebar-panel") &&
                !e.target.closest("#hamburger-btn")
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const sidebarContent = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: "24px 20px",
                    borderBottom: "1px solid #2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <a href="/">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo"
                        style={{ maxHeight: "40px" }}
                    />
                </a>
                {isMobile && (
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#888",
                            fontSize: "20px",
                            cursor: "pointer",
                            padding: "4px",
                        }}
                    >
                        <i className="fas fa-times" />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                {navigation.map((item, index) => {
                    if (item.type === "separator") {
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: "12px 12px 4px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    color: "#444",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                {item.label}
                            </div>
                        );
                    }

                    const isActive = currentPath === item.href;
                    return (
                        <a
                            key={index}
                            href={item.href}
                            onClick={() => isMobile && setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "9px 12px",
                                borderRadius: "8px",
                                marginBottom: "2px",
                                color: isActive ? "#fff" : "#888",
                                background: isActive
                                    ? "#2a2a2a"
                                    : "transparent",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: isActive ? "600" : "400",
                                transition: "all 0.15s ease",
                                borderLeft: isActive
                                    ? "3px solid #e63946"
                                    : "3px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = "#fff";
                                    e.currentTarget.style.background =
                                        "#1f1f1f";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = "#888";
                                    e.currentTarget.style.background =
                                        "transparent";
                                }
                            }}
                        >
                            <i
                                className={`fas ${item.icon}`}
                                style={{
                                    width: "16px",
                                    textAlign: "center",
                                    fontSize: "13px",
                                }}
                            />
                            {item.name}
                        </a>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div
                style={{ padding: "16px 12px", borderTop: "1px solid #2a2a2a" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "#1f1f1f",
                        marginBottom: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#e63946",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "700",
                            flexShrink: 0,
                        }}
                    >
                        {user.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span
                        style={{
                            color: "#ccc",
                            fontSize: "13px",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {user.username ?? "Usuário"}
                    </span>
                </div>
                <a
                    href="/logout"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        color: "#888",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#e63946";
                        e.currentTarget.style.background = "#1f1f1f";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#888";
                        e.currentTarget.style.background = "transparent";
                    }}
                >
                    <i
                        className="fas fa-right-from-bracket"
                        style={{ width: "16px", textAlign: "center" }}
                    />
                    Sair
                </a>
            </div>
        </div>
    );

    return (
        <>
            {/* DESKTOP */}
            {!isMobile && (
                <aside
                    style={{
                        width: "240px",
                        minHeight: "100vh",
                        background:
                            "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)",
                        borderRight: "1px solid #2a2a2a",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 100,
                    }}
                >
                    {sidebarContent}
                </aside>
            )}

            {/* MOBILE */}
            {isMobile && (
                <>
                    {/* Topbar */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 200,
                            height: "56px",
                            background: "#0f0f0f",
                            borderBottom: "1px solid #2a2a2a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 16px",
                        }}
                    >
                        <a href="/">
                            <img
                                src="/assets/images/logo.png"
                                alt="Logo"
                                style={{ maxHeight: "28px" }}
                            />
                        </a>
                        <button
                            id="hamburger-btn"
                            onClick={() => setOpen((o) => !o)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#fff",
                                fontSize: "20px",
                                cursor: "pointer",
                                padding: "8px",
                            }}
                        >
                            <i
                                className={`fas ${open ? "fa-times" : "fa-bars"}`}
                            />
                        </button>
                    </div>

                    {/* Overlay */}
                    {open && (
                        <div
                            onClick={() => setOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 299,
                                background: "rgba(0,0,0,0.5)",
                            }}
                        />
                    )}

                    {/* Drawer */}
                    <aside
                        id="sidebar-panel"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 300,
                            width: "260px",
                            height: "100vh",
                            background:
                                "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)",
                            borderRight: "1px solid #2a2a2a",
                            transform: open
                                ? "translateX(0)"
                                : "translateX(-100%)",
                            transition: "transform 0.25s ease",
                        }}
                    >
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}
