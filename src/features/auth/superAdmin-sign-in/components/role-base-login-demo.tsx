// import { useState } from 'react'

// import { Navigate } from '@tanstack/react-router'
// import { useAuthStore } from '@/stores/use-auth-store'
// import { UserRole } from '@/components/layout/types'

// export function RoleBaseLogin() {
//     const { login, user, isLoading } = useAuthStore()
//     const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
//     const [error, setError] = useState<string>('')

//     if (user) {
//         return <Navigate to="/" />
//     }

//     const handleLogin = async () => {
//         try {
//             setError('')
//             await login(selectedRole)
//         } catch (_err) {
//             setError('Login failed. Please try again.')
//         }
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
//                 <div>
//                     <h2 className="text-center text-3xl font-extrabold text-gray-900">
//                         Role-Based Login Demo
//                     </h2>
//                 </div>
//                 <div className="space-y-4">
//                     {error && (
//                         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                             {error}
//                         </div>
//                     )}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Select Role
//                         </label>
//                         <select
//                             value={selectedRole}
//                             onChange={(e) => setSelectedRole(e.target.value as UserRole)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                             disabled={isLoading}
//                         >
//                             <option value="admin">Administrator</option>
//                             <option value="merchant">Merchant</option>
//                             <option value="driver">Driver</option>
//                             <option value="business">Business</option>
//                         </select>
//                     </div>
//                     <button
//                         onClick={handleLogin}
//                         disabled={isLoading}
//                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                     >
//                         {isLoading ? 'Logging in...' : `Login as ${selectedRole}`}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }