import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const csrf = () => document.querySelector('meta[name="csrf-token"]').content

export default function ClientGroupsList() {
    const [groups, setGroups]       = useState([])
    const [loading, setLoading]     = useState(true)
    const [saving, setSaving]       = useState(false)
    const [error, setError]         = useState("")
    const [success, setSuccess]     = useState("")
    const [formError, setFormError] = useState("")
    const [nome, setNome]           = useState("")

    const isAdmin = window.authUser?.role === "Admin"

    useEffect(() => { fetchGroups() }, [])

    async function fetchGroups() {
        try {
            const res = await axios.get("/client-groups/data")
            setGroups(res.data)
        } catch {
            setError("Erro ao carregar grupos.")
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!nome.trim()) { setFormError("O nome é obrigatório."); return }

        setSaving(true)
        setFormError("")
        setSuccess("")

        try {
            const res = await axios.post("/client-groups", { nome }, {
                headers: { "X-CSRF-TOKEN": csrf() }
            })
            setGroups([...groups, res.data])
            setNome("")
            setSuccess("Grupo cadastrado com sucesso!")
            setTimeout(() => setSuccess(""), 4000)
        } catch (err) {
            if (err.response?.status === 422) {
                setFormError(err.response.data.errors?.nome?.[0] ?? "Erro de validação.")
            } else {
                setFormError("Erro ao salvar.")
            }
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm("Tem certeza que deseja excluir este grupo?")) return
        try {
            await axios.delete(`/client-groups/${id}`, { headers: { "X-CSRF-TOKEN": csrf() } })
            setGroups(groups.filter(g => g.id !== id))
        } catch {
            alert("Erro ao excluir. Verifique se não há clientes vinculados.")
        }
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "8px", maxWidth: "800px" }}>
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Grupos de Clientes</h1>
                <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>Organize os clientes por grupos de vendedores</p>
            </div>

            {isAdmin && (
                <Card className="mb-6">
                    <CardHeader><CardTitle className="text-base">Novo Grupo</CardTitle></CardHeader>
                    <CardContent>
                        {success && (
                            <div className="bg-green-100 text-green-800 border border-green-300 rounded px-4 py-2 text-sm mb-4">
                                {success}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <Label>Nome</Label>
                                <Input
                                    placeholder="Ex: MATEUS (vendedor), MENSAL, CANCELADOS..."
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                                />
                                {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
                            </div>
                            <Button onClick={handleSubmit} disabled={saving} className="text-white">
                                {saving ? "Salvando..." : "Cadastrar"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>Carregando...</div>
            ) : error ? (
                <div style={{ color: "#e63946", padding: "12px" }}>{error}</div>
            ) : groups.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
                    <i className="fas fa-users-rectangle" style={{ fontSize: "40px", marginBottom: "12px", display: "block" }} />
                    Nenhum grupo cadastrado ainda.
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                    {groups.map(group => (
                        <div key={group.id} style={{
                            background: "#fff", border: "1px solid #eee", borderRadius: "12px",
                            padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            display: "flex", alignItems: "center", gap: "14px",
                        }}>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                background: "#fff1f2", display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0,
                            }}>
                                <i className="fas fa-users" style={{ color: "#e63946", fontSize: "16px" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111" }}>{group.nome}</p>
                                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#bbb" }}>ID #{group.id}</p>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    style={{
                                        padding: "6px 10px", borderRadius: "8px", cursor: "pointer",
                                        border: "1px solid #fca5a5", background: "#fff1f2",
                                        color: "#dc2626", fontSize: "13px", flexShrink: 0,
                                    }}
                                    title="Excluir"
                                >
                                    <i className="fas fa-trash" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}