'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../../lib/supabaseClient'
import Navigation from '../../badminton/ui-components/Navigation'
import Header from '../../badminton/ui-components/Header'


export default function AuthPage() {
    const navigation = [
        { name: 'Sign Up', href: '#', current: true },
        { name: 'Login', href: '/auth/login', current: false },
    ]
  return (
    <div className="min-h-full print:block">
        <Navigation navigation={navigation} />
        <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="auth-container">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="dark"
                        providers={['google', 'github']} // or just leave empty for email/password only
                        redirectTo="https://curly-robot-6wpv7jq6gwwcrxvr-3000.app.github.dev/"
                    />
                </div>
            </div>
        </main>
    </div>
  )
}
