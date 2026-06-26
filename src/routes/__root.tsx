import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import StoreDevtools from '../lib/demo-store-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

function RootNotFound() {
  return (
    <main className="page-wrap px-4 py-20">
      <section className="island-shell mx-auto max-w-3xl p-8 text-center">
        <p className="island-kicker mb-3">404</p>
        <h1 className="m-0 text-3xl font-bold text-[var(--sea-ink)]">
          页面没有找到
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--sea-ink-soft)]">
          这个地址没有匹配到当前项目路由。你可以返回首页，或通过顶部导航重新进入项目文档、变更图和示例页面。
        </p>
        <a
          className="mt-6 inline-flex rounded-full bg-[var(--sea-ink)] px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_12px_28px_rgba(26,76,72,0.18)] transition hover:-translate-y-0.5"
          href="/"
        >
          返回首页
        </a>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        {children}
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            StoreDevtools,
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
