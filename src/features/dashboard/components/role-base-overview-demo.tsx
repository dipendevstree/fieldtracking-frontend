// import { useAppStore } from "@/stores/use-app-store"
// import { useAuthStore } from "@/stores/use-auth-store"

// export function RoleBaseOverview() {
//     const { user, hasPermission, logout } = useAuthStore()
//     const { setPageLoading } = useAppStore()

//     const handleLogout = () => {
//         setPageLoading(true)
//         logout()
//         setPageLoading(false)
//     }

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-gray-600">Welcome back, {user?.name}!</p>
//                 </div>
//                 <button
//                     onClick={handleLogout}
//                     className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                     Logout
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {hasPermission('products') && (
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <h3 className="font-semibold mb-2">Products</h3>
//                         <p className="text-gray-600">Manage your product inventory</p>
//                     </div>
//                 )}

//                 {hasPermission('orders') && (
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <h3 className="font-semibold mb-2">Orders</h3>
//                         <p className="text-gray-600">View and manage orders</p>
//                     </div>
//                 )}

//                 {hasPermission('users') && (
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <h3 className="font-semibold mb-2">User Management</h3>
//                         <p className="text-gray-600">Manage system users</p>
//                     </div>
//                 )}
//             </div>

//             <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold mb-2">Your Roles & Permissions</h3>
//                 <p><strong>Roles:</strong> {user?.roles.map(r => r.name).join(', ')}</p>
//                 <p><strong>User ID:</strong> {user?.id}</p>
//                 <p><strong>Email:</strong> {user?.email}</p>
//             </div>
//         </div>
//     )
// }