import { useState, useMemo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const csrf = () => document.querySelector('meta[name="csrf-token"]').content;

function getPasswordStrength(password) {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Fraca", color: "#ef4444" };
    if (score <= 4) return { score, label: "Média", color: "#f59e0b" };
    return { score, label: "Forte", color: "#22c55e" };
}

export default function UserProfile() {
    const user = window.authUser ?? {};
    const email = window.authEmail ?? "";

    const [passForm, setPassForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [passErrors, setPassErrors] = useState({});
    const [passSuccess, setPassSuccess] = useState("");
    const [passError, setPassError] = useState("");
    const [passSaving, setPassSaving] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const strength = useMemo(
        () => getPasswordStrength(passForm.new_password),
        [passForm.new_password],
    );

    async function handleChangePassword(e) {
        e.preventDefault();
        setPassSaving(true);
        setPassErrors({});
        setPassSuccess("");
        setPassError("");
        try {
            await axios.post("/profile/password", passForm, {
                headers: { "X-CSRF-TOKEN": csrf() },
            });
            setPassSuccess("Senha alterada com sucesso!");
            setPassForm({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
            setTimeout(() => setPassSuccess(""), 5000);
        } catch (err) {
            if (err.response?.status === 422) {
                setPassErrors(err.response.data.errors ?? {});
            } else if (err.response?.status === 400) {
                setPassError(
                    err.response.data.message ?? "Senha atual incorreta.",
                );
            } else {
                setPassError("Erro ao alterar senha.");
            }
        } finally {
            setPassSaving(false);
        }
    }

    async function handleDeleteAccount(e) {
        e.preventDefault();
        if (deleteConfirm !== "ELIMINAR") {
            setDeleteError("É obrigatório escrever a palavra ELIMINAR");
            return;
        }
        if (
            !confirm(
                "Tem certeza? Esta ação é irreversível e todos os seus dados serão removidos!",
            )
        )
            return;
        setDeleting(true);
        setDeleteError("");
        try {
            await axios.delete("/profile/account", {
                headers: { "X-CSRF-TOKEN": csrf() },
                data: { deleted_confirmation: deleteConfirm },
            });
            window.location.href = "/login";
        } catch (err) {
            setDeleteError(
                err.response?.data?.message ?? "Erro ao eliminar conta.",
            );
            setDeleting(false);
        }
    }

    const initials = user.username?.[0]?.toUpperCase() ?? "U";
    const isAdmin = user.role === "Admin";

    return (
        <div
            style={{
                fontFamily: "'DM Sans', sans-serif",
                maxWidth: "680px",
                margin: "0 auto",
                padding: "24px 8px",
            }}
        >
            {/* Hero card */}
            <div
                style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    marginBottom: "20px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
            >
                {/* Banner */}
                <div
                    style={{
                        height: "80px",
                        background:
                            "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 60%, #e63946 100%)",
                    }}
                />

                {/* Info */}
                <div style={{ background: "#fff", padding: "0 24px 24px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            marginTop: "-32px",
                            marginBottom: "16px",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                background: "#e63946",
                                border: "3px solid #fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "24px",
                                fontWeight: "700",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(230,57,70,0.3)",
                            }}
                        >
                            {initials}
                        </div>

                        {/* Badge role */}
                        <span
                            style={{
                                padding: "4px 12px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: isAdmin ? "#fff1f2" : "#f1f5f9",
                                color: isAdmin ? "#e63946" : "#475569",
                                border: `1px solid ${isAdmin ? "#fca5a5" : "#e2e8f0"}`,
                            }}
                        >
                            <i
                                className={`fas ${isAdmin ? "fa-shield-halved" : "fa-user"} me-1`}
                            />
                            {user.role ?? "Usuário"}
                        </span>
                    </div>

                    <h2
                        style={{
                            margin: "0 0 4px",
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#111",
                        }}
                    >
                        {user.username}
                    </h2>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                        <i
                            className="fas fa-envelope me-2"
                            style={{ color: "#aaa" }}
                        />
                        {email || "—"}
                    </p>
                </div>
            </div>

            {/* Alterar senha */}
            <Card style={{ marginBottom: "20px" }}>
                <CardHeader style={{ paddingBottom: "8px" }}>
                    <CardTitle
                        style={{
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                background: "#fff1f2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <i
                                className="fas fa-lock"
                                style={{ color: "#e63946", fontSize: "13px" }}
                            />
                        </div>
                        Alterar Senha
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {passSuccess && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "#f0fdf4",
                                border: "1px solid #86efac",
                                borderRadius: "8px",
                                padding: "10px 14px",
                            }}
                        >
                            <i
                                className="fas fa-check-circle"
                                style={{ color: "#16a34a" }}
                            />
                            <span
                                style={{ fontSize: "13px", color: "#166534" }}
                            >
                                {passSuccess}
                            </span>
                        </div>
                    )}
                    {passError && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "#fff1f2",
                                border: "1px solid #fca5a5",
                                borderRadius: "8px",
                                padding: "10px 14px",
                            }}
                        >
                            <i
                                className="fas fa-triangle-exclamation"
                                style={{ color: "#e63946" }}
                            />
                            <span
                                style={{ fontSize: "13px", color: "#991b1b" }}
                            >
                                {passError}
                            </span>
                        </div>
                    )}

                    {/* Senha atual */}
                    <div>
                        <Label>Senha Atual</Label>
                        <div style={{ position: "relative" }}>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                value={passForm.current_password}
                                onChange={(e) =>
                                    setPassForm((p) => ({
                                        ...p,
                                        current_password: e.target.value,
                                    }))
                                }
                                placeholder="Digite sua senha atual"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords((v) => !v)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#aaa",
                                    fontSize: "14px",
                                }}
                            >
                                <i
                                    className={`fas ${showPasswords ? "fa-eye-slash" : "fa-eye"}`}
                                />
                            </button>
                        </div>
                        {passErrors.current_password && (
                            <p className="text-red-500 text-sm mt-1">
                                {passErrors.current_password[0]}
                            </p>
                        )}
                    </div>

                    {/* Nova senha + confirmação */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                        }}
                    >
                        <div>
                            <Label>Nova Senha</Label>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                value={passForm.new_password}
                                onChange={(e) =>
                                    setPassForm((p) => ({
                                        ...p,
                                        new_password: e.target.value,
                                    }))
                                }
                                placeholder="Nova senha"
                            />
                            {passErrors.new_password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {passErrors.new_password[0]}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Confirmar Nova Senha</Label>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                value={passForm.new_password_confirmation}
                                onChange={(e) =>
                                    setPassForm((p) => ({
                                        ...p,
                                        new_password_confirmation:
                                            e.target.value,
                                    }))
                                }
                                placeholder="Confirmar senha"
                            />
                            {passErrors.new_password_confirmation && (
                                <p className="text-red-500 text-sm mt-1">
                                    {passErrors.new_password_confirmation[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Indicador de força */}
                    {passForm.new_password.length > 0 && (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "4px",
                                    marginBottom: "4px",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            height: "4px",
                                            borderRadius: "2px",
                                            background:
                                                i <= strength.score
                                                    ? strength.color
                                                    : "#e2e8f0",
                                            transition: "background 0.2s",
                                        }}
                                    />
                                ))}
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "12px",
                                    color: strength.color,
                                    fontWeight: "600",
                                }}
                            >
                                Força da senha: {strength.label}
                            </p>
                        </div>
                    )}

                    <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
                        <i className="fas fa-circle-info me-1" />
                        Mínimo 8 caracteres, com letras maiúsculas, minúsculas e
                        números.
                    </p>

                    <Button
                        className="w-full text-white"
                        onClick={handleChangePassword}
                        disabled={passSaving}
                    >
                        {passSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2" />
                                Salvando...
                            </>
                        ) : (
                            "Alterar Senha"
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Zona de perigo */}
            <Card style={{ border: "1px solid #fca5a5" }}>
                <CardHeader style={{ paddingBottom: "8px" }}>
                    <CardTitle
                        style={{
                            fontSize: "15px",
                            color: "#dc2626",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                background: "#fff1f2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <i
                                className="fas fa-triangle-exclamation"
                                style={{ color: "#e63946", fontSize: "13px" }}
                            />
                        </div>
                        Zona de Perigo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        style={{
                            background: "#fff7f7",
                            borderRadius: "8px",
                            padding: "12px 14px",
                            border: "1px solid #fee2e2",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#666",
                                margin: 0,
                                lineHeight: "1.6",
                            }}
                        >
                            A eliminação da conta é{" "}
                            <strong style={{ color: "#dc2626" }}>
                                permanente e irreversível
                            </strong>
                            . Todos os seus dados serão removidos do sistema sem
                            possibilidade de recuperação. Para confirmar,
                            escreva{" "}
                            <code
                                style={{
                                    background: "#fee2e2",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    color: "#dc2626",
                                    fontWeight: "700",
                                }}
                            >
                                ELIMINAR
                            </code>{" "}
                            abaixo.
                        </p>
                    </div>

                    <div>
                        <Label>Confirmação</Label>
                        <Input
                            placeholder="Digite ELIMINAR para confirmar"
                            value={deleteConfirm}
                            onChange={(e) => {
                                setDeleteConfirm(e.target.value);
                                setDeleteError("");
                            }}
                            style={{
                                borderColor:
                                    deleteConfirm === "ELIMINAR"
                                        ? "#fca5a5"
                                        : undefined,
                            }}
                        />
                        {deleteError && (
                            <p className="text-red-500 text-sm mt-1">
                                {deleteError}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleting || deleteConfirm !== "ELIMINAR"}
                        style={{
                            width: "100%",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: "1px solid #fca5a5",
                            background:
                                deleteConfirm === "ELIMINAR"
                                    ? "#dc2626"
                                    : "#fff1f2",
                            color:
                                deleteConfirm === "ELIMINAR"
                                    ? "#fff"
                                    : "#dc2626",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor:
                                deleteConfirm === "ELIMINAR" && !deleting
                                    ? "pointer"
                                    : "not-allowed",
                            transition: "all 0.2s",
                            opacity: deleting ? 0.6 : 1,
                        }}
                    >
                        {deleting ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2" />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-trash me-2" />
                                Eliminar Conta Permanentemente
                            </>
                        )}
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
