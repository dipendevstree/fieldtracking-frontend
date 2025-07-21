import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
    // UI State
    sidebarOpen: boolean
    theme: 'light' | 'dark' | 'system'

    // Navigation
    currentRoute: string
    previousRoute: string

    // Loading states
    pageLoading: boolean

    // Actions
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: 'light' | 'dark' | 'system') => void
    setCurrentRoute: (route: string) => void
    setPageLoading: (loading: boolean) => void
}
export const useAppStore = create<AppState>()(
    persist(
        (set, _get) => ({
            // Initial state
            sidebarOpen: true,
            theme: 'system',
            currentRoute: '/',
            previousRoute: '/',
            pageLoading: false,

            // Actions
            setSidebarOpen: (open: boolean) => {
                set({ sidebarOpen: open })
            },

            setTheme: (theme: 'light' | 'dark' | 'system') => {
                set({ theme })
            },

            setCurrentRoute: (route: string) => {
                set((state) => ({
                    previousRoute: state.currentRoute,
                    currentRoute: route
                }))
            },

            setPageLoading: (loading: boolean) => {
                set({ pageLoading: loading })
            }
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
                theme: state.theme
            })
        }
    )
)