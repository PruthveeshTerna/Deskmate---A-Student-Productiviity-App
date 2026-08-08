import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'DeskMate — Your Complete Academic Workspace, Powered by AI',
  description:
    'DeskMate is an AI-powered student productivity dashboard to manage tasks, schedules, notes, deadlines and exams — plus generate notes, flashcards, quizzes and personalized study plans.',
  keywords: [
    'student productivity',
    'study planner',
    'AI notes',
    'flashcards',
    'academic dashboard',
    'pomodoro',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8ff' },
    { media: '(prefers-color-scheme: dark)', color: '#131318' },
  ],
}

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }}></script>
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

