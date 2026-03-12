import ClientForm from "@/components/ClientForm"

export default function EditClient() {
    const clientId = window.clientId
    return <ClientForm clientId={clientId} />
}