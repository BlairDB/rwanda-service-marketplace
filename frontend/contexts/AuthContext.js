import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem('isAuthenticated')
      const userData = localStorage.getItem('user')
      
      if (authStatus === 'true' && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      // Mock authentication logic
      let userData = null
      
      if (email === 'admin@servicerw.rw' && password === 'admin123') {
        userData = {
          id: 1,
          email: email,
          name: 'Admin User',
          role: 'admin',
          verified: true,
          permissions: ['manage_users', 'manage_businesses', 'view_analytics'],
          loginTime: new Date().toISOString()
        }
      } else if (email === 'business@servicerw.rw' && password === 'business123') {
        userData = {
          id: 2,
          email: email,
          name: 'Business Owner',
          role: 'business',
          verified: true,
          businessName: 'Kigali Construction Ltd',
          businessSlug: 'kigali-construction-ltd',
          businessCategory: 'construction',
          businessLocation: 'Kigali City',
          businessDescription: 'Leading construction company in Rwanda',
          businessAddress: 'KG 123 Street, Gasabo District, Kigali',
          businessWebsite: 'www.kigaliconstruction.rw',
          permissions: ['manage_profile', 'view_analytics', 'respond_reviews'],
          loginTime: new Date().toISOString()
        }
      } else if (email === 'customer@servicerw.rw' && password === 'customer123') {
        userData = {
          id: 3,
          email: email,
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+250 788 123 456',
          role: 'customer',
          verified: true,
          permissions: ['save_favorites', 'write_reviews', 'book_services'],
          loginTime: new Date().toISOString()
        }
      }
      
      if (userData) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isAuthenticated', 'true')
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        setUser(userData)
        setIsAuthenticated(true)
        
        return { success: true, user: userData }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (formData) => {
    try {
      // Create user data
      const userData = {
        id: Date.now(),
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.userType,
        verified: false,
        registrationDate: new Date().toISOString(),
        permissions: formData.userType === 'business' 
          ? ['manage_profile', 'view_analytics', 'respond_reviews']
          : ['save_favorites', 'write_reviews', 'book_services']
      }

      if (formData.userType === 'business') {
        userData.businessName = formData.businessName
        userData.businessCategory = formData.businessCategory
        userData.businessDescription = formData.businessDescription
        userData.businessLocation = formData.businessLocation
        userData.businessAddress = formData.businessAddress
        userData.businessWebsite = formData.businessWebsite
        userData.businessSlug = formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('rememberMe')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false
  }

  const isRole = (role) => {
    return user?.role === role
  }

  const requireAuth = (redirectTo = '/auth/login') => {
    if (!isAuthenticated) {
      const currentPath = router.asPath
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      return false
    }
    return true
  }

  const requireRole = (requiredRole, redirectTo = '/') => {
    if (!isAuthenticated || user?.role !== requiredRole) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'business':
        return '/business/dashboard'
      case 'customer':
        return '/profile'
      default:
        return '/'
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    isRole,
    requireAuth,
    requireRole,
    getRedirectPath,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
