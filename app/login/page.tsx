"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { Github } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInButton } from "@/components/auth-provider"

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let strength = 0
  const feedback = []

  if (password.length >= 8) {
    strength += 1
  } else {
    feedback.push("Password should be at least 8 characters long")
  }

  if (/[A-Z]/.test(password)) {
    strength += 1
  } else {
    feedback.push("Include at least one uppercase letter")
  }

  if (/[a-z]/.test(password)) {
    strength += 1
  } else {
    feedback.push("Include at least one lowercase letter")
  }

  if (/[0-9]/.test(password)) {
    strength += 1
  } else {
    feedback.push("Include at least one number")
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1
  } else {
    feedback.push("Include at least one special character")
  }

  return {
    strength: (strength / 5) * 100,
    feedback: feedback.length > 0 ? feedback : ["Strong password!"],
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, register, signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    login: "",
    register: "",
  })

  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    feedback: [],
  })

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setLoginData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Check password strength on change
  useEffect(() => {
    if (registerData.password) {
      setPasswordStrength(checkPasswordStrength(registerData.password))
    }
  }, [registerData.password])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ ...errors, login: "" })

    if (!loginData.email || !loginData.password) {
      setErrors({ ...errors, login: "Please fill in all fields" })
      return
    }

    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", loginData.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      router.push("/")
    } catch (error) {
      setErrors({ ...errors, login: "Invalid email or password" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ ...errors, register: "" })

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setErrors({ ...errors, register: "Please fill in all fields" })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrors({ ...errors, register: "Passwords do not match" })
      return
    }

    if (passwordStrength.strength < 60) {
      setErrors({ ...errors, register: "Please choose a stronger password" })
      return
    }

    setIsLoading(true)

    try {
      await register(registerData.name, registerData.email, registerData.password)
      router.push("/")
    } catch (error) {
      setErrors({ ...errors, register: "Registration failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn(loginData.email, loginData.password)
      router.push("/")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to LuxeNest</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account or create a new one</p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <SignInButton />

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
