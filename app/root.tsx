import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Link } from "react-router";
import { motion } from "framer-motion";
import "./app.css";

import { ReduxProviders } from "./src/store/providers";

import { Banner } from "./src/_components/layout/_banner/banner";
import Navigation from "./src/_components/layout/_navbar/navbar";
import { Baseboard } from "./src/_components/layout/_baseboard/baseboard";
import Footer from "./src/_components/layout/_footer/footer";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Descubra a essência da exclusividade automotiva com a Prestige Motors. Veículos de luxo, performance e design sofisticado que redefinem sua experiência ao volante."
        />
        <meta
          name="keywords"
          content="Prestige Motors, carros de luxo, veículos exclusivos, performance automotiva, carros premium, experiência personalizada, sofisticação automotiva"
        />
        <meta
          property="og:title"
          content="Prestige Motors - Exclusividade e Sofisticação Automotiva"
        />
        <meta
          property="og:description"
          content="Explore a linha exclusiva de veículos de alto padrão da Prestige Motors. Conquiste seu próximo carro com performance e estilo incomparáveis."
        />
        <meta
          property="og:image"
          content="https://www.prestigemotors.com/og-image.jpg"
        />
        <meta property="og:url" content="https://www.prestigemotors.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Prestige Motors - Veículos de Luxo e Exclusividade"
        />
        <meta
          name="twitter:description"
          content="Descubra a paixão pela excelência automotiva com a Prestige Motors. Uma experiência única para amantes de carros de alto padrão."
        />
        <meta name="twitter:image" content="/og-image.jpg" />
        <link
          rel="icon"
          href="https://i.pinimg.com/736x/00/e4/e9/00e4e9cc4ffdb2d0326f1cb56c540486.jpg"
        />
        <link
          rel="icon"
          href="https://i.pinimg.com/736x/00/e4/e9/00e4e9cc4ffdb2d0326f1cb56c540486.jpg"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href="https://i.pinimg.com/736x/00/e4/e9/00e4e9cc4ffdb2d0326f1cb56c540486.jpg"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ReduxProviders>
      <Banner />
      <Navigation />
        <Outlet />
      <Baseboard />
      <Footer />
    </ReduxProviders>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center text-center p-8">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <h1 className="text-9xl font-bold mb-4">{message}</h1>
        <p className="text-xl mb-8">{details}</p>
        <Link
          to="/"
          className="border border-white px-6 py-3 inline-block rounded-full"
        >
          Voltar ao Início
        </Link>
      </motion.div>
    </div>
  );
}
