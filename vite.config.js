import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    server: {
        host: '127.0.0.1', // ← adicione isso
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
                'resources/js/sidebar.jsx',
                'resources/js/users.jsx',
                'resources/js/edit.jsx',
                'resources/js/payment-methods.jsx',
                'resources/js/categories.jsx',
                'resources/js/services.jsx',
                'resources/js/dashboard.jsx',
                'resources/js/clients.jsx',
                'resources/js/client-create.jsx',
                'resources/js/clientGroups.jsx',
                'resources/js/client-edit.jsx',
                'resources/js/orders.jsx',
                'resources/js/order-create.jsx',
                'resources/js/orders-by-client.jsx',
                'resources/js/profile.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
})