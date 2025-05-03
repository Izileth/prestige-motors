import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  ChevronRight,
} from "lucide-react";

interface FooterLinkGroup {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

interface FooterProps {
  companyName?: string;
  showNewsletter?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "MARCA",
  showNewsletter = true
}) => {
  const currentYear = new Date().getFullYear();
  
  const linkGroups: FooterLinkGroup[] = [
    {
      title: "Compre",
      links: [
        { name: "Nova coleção", href: "/colecao/nova" },
        { name: "Mais vendidos", href: "/mais-vendidos" },
        { name: "Promoções", href: "/promocoes" },
        { name: "Categorias", href: "/categorias" }
      ]
    },
    {
      title: "Ajuda",
      links: [
        { name: "Minha conta", href: "/conta" },
        { name: "Rastrear pedido", href: "/rastrear" },
        { name: "Devoluções", href: "/devolucoes" },
        { name: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Institucional",
      links: [
        { name: "Sobre nós", href: "/sobre" },
        { name: "Lojas físicas", href: "/lojas" },
        { name: "Trabalhe conosco", href: "/trabalhe-conosco" },
        { name: "Sustentabilidade", href: "/sustentabilidade" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Youtube", icon: Youtube, href: "https://youtube.com" }
  ];

  const legalLinks = [
    { name: "Termos e condições", href: "/termos" },
    { name: "Política de privacidade", href: "/privacidade" },
    { name: "Política de cookies", href: "/cookies" }
  ];

  return (
    <footer className="bg-background border-t border-border w-full">
      <div className="container px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo e Informações */}
          <div className="flex flex-col space-y-6">
            <Link to="/" className="text-xl font-light tracking-widest">
              {companyName}
            </Link>
            <p className="text-sm font-light text-muted-foreground max-w-xs">
              Experiência de compra exclusiva com produtos de qualidade premium e design atemporal.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  <link.icon className="h-5 w-5 stroke-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Links agrupados */}
          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-6">
              <h3 className="text-sm font-medium uppercase tracking-wide">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {showNewsletter && (
          <div className="mt-16 md:mt-20">
            <Separator className="mb-16" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-lg">
                <h3 className="text-sm font-medium uppercase tracking-wide">
                  Inscreva-se em nossa newsletter
                </h3>
                <p className="text-sm font-light text-muted-foreground">
                  Receba lançamentos, novidades e promoções exclusivas.
                </p>
              </div>
              <div className="w-full md:w-auto flex-1 md:flex-initial flex items-stretch max-w-sm">
                <Input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="rounded-r-none border-r-0 font-light text-sm h-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button 
                  className="rounded-l-none h-10" 
                  size="sm"
                >
                  <span className="sr-only md:not-sr-only md:mr-2 text-xs font-light">
                    Inscrever
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Copyright e links legais */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-light text-muted-foreground">
              © {currentYear} {companyName}. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
