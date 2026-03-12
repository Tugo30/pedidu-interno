<x-layouts.main-layout pageTitle="Home">
    <div class="container py-4">
        <div id="dashboard-app"></div>
    </div>

    @push('scripts')
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/dashboard.jsx'])
    @endpush
</x-layouts.main-layout>