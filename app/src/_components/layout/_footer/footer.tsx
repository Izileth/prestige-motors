import React from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  ChevronRight,
  Mail
} from "lucide-react";


/**
 * Interface for footer link groups
 */
interface FooterLinkGroup {
  /**
   * Title of the link group
   */
  title: string
  /**
   * Array of links in the group
   */
  links: {
    /**
     * Name of the link
     */
    name: string
    /**
     * URL of the link
     */
    href: string
  }[]
}

/**
 * Interface for social media links
 */
interface SocialLink {
  /**
   * Name of the social platform
   */
  name: string
  /**
   * Icon component for the social platform
   */
  icon: React.ElementType
  /**
   * URL of the social profile
   */
  href: string
}

/**
 * Props for the Footer component
 */
interface FooterProps {
  /**
   * Company or brand name
   * @default "BRAND"
   */
  companyName?: string

  /**
   * Company description or tagline
   */
  companyDescription?: string

  /**
   * Whether to show the newsletter section
   * @default true
   */
  showNewsletter?: boolean

  /**
   * Custom link groups to override the default ones
   */
  customLinkGroups?: FooterLinkGroup[]

  /**
   * Custom social links to override the default ones
   */
  customSocialLinks?: SocialLink[]

  /**
   * Custom legal links to override the default ones
   */
  customLegalLinks?: { name: string; href: string }[]

  /**
   * Newsletter title
   * @default "Subscribe to our newsletter"
   */
  newsletterTitle?: string

  /**
   * Newsletter description
   * @default "Receive new releases, news and exclusive promotions."
   */
  newsletterDescription?: string

  /**
   * Newsletter button text
   * @default "Subscribe"
   */
  newsletterButtonText?: string

  /**
   * Newsletter input placeholder
   * @default "Your email"
   */
  newsletterPlaceholder?: string

  /**
   * Custom newsletter submit handler
   */
  onNewsletterSubmit?: (email: string) => void

  /**
   * Additional CSS classes for the footer
   */
  className?: string

  /**
   * Custom logo component
   */
  logo?: React.ReactNode
}

/**
 * A minimalist, responsive footer component
 */
const Footer: React.FC<FooterProps> = ({
  companyName = "PRESTIGE MOTORS",
  companyDescription = "Os catalógos mais diversificados do mundo em um só lugar ",
  showNewsletter = true,
  customLinkGroups,
  customSocialLinks,
  customLegalLinks,
  newsletterTitle = "Se increva em nosso Grupo Especial",
  newsletterDescription = "Receba Informações Sobre os Últimos Lançamentos",
  newsletterButtonText = "Escreva-se",
  newsletterPlaceholder = "Seu Email",
  onNewsletterSubmit,
  className = "",
  logo,
}) => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = React.useState("")

  // Default link groups
  const defaultLinkGroups: FooterLinkGroup[] = [
    {
      title: "Garagem",
      links: [
        { name: "Anunciar", href: "/vehicles/create" },
        { name: "Classes", href: "/vehicles/category" },
        { name: "Veículos", href: "/vehicles/user" },
        { name: "Destaques", href: "/destacts" },
      ],
    },
    {
      title: "Detalhes",
      links: [
        { name: "Conta", href: "/dashboard" },
        { name: "Catálogo", href: "/vehicles" },
        { name: "Anúncios", href: "/vehicles/negociations" },
        { name: "Dúvidas & Repostas", href: "/support" },
      ],
    },
    {
      title: "Nos Conheça",
      links: [
        { name: "Nossa História", href: "/about" },
        { name: "Nossa Missão", href: "/history" },
        { name: "Nosso Suporte", href: "/support" },
        { name: "Nossa Política", href: "/polities/ecological" },
      ],
    },
  ]

  // Default social links
  const defaultSocialLinks: SocialLink[] = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
  ]

  // Default legal links
  const defaultLegalLinks = [
    { name: "Terms & Conditions", href: "/polities/conditions" },
    { name: "Privacy Policy", href: "/polities/privacy" },
    { name: "Cookie Policy", href: "/polities/cookies" },
  ]

  // Use custom links if provided, otherwise use defaults
  const linkGroups = customLinkGroups || defaultLinkGroups
  const socialLinks = customSocialLinks || defaultSocialLinks
  const legalLinks = customLegalLinks || defaultLegalLinks

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  // Handle newsletter submission

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email) {
    toast.error("Por favor, insira um email válido");
    return;
  }

  setIsSubmitting(true);

  // Simula uma requisição assíncrona
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onNewsletterSubmit) {
      onNewsletterSubmit(email);
    } else {
      toast.success("🎉 Inscrição realizada com sucesso!", {
        description: "Redirecionando para a página de confirmação...",
        duration: 3000,
        action: {
          label: "Fechar",
          onClick: () => {}
        },
      });
      
      setSubmitSuccess(true);
        
        // Timeout antes do redirecionamento
        setTimeout(() => {
          navigate("/newsletter", {
            state: { email },
          });
        }, 3500); // 3.5 segundos no total
      }
    } catch (error) {
      toast.error("Ocorreu um erro", {
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
      if (!onNewsletterSubmit) {
        setEmail("");
      }
    }
  };

 
  return (
    <footer className={`bg-background border-t border-border w-full ${className}`}>
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Logo and Information */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {logo ? (
              <div>{logo}</div>
            ) : (
              <Link to="/" className="text-xl font-extralight tracking-widest">
                {companyName}
              </Link>
            )}
            <p className="text-sm font-light text-muted-foreground max-w-xs">{companyDescription}</p>
            <div className="flex space-x-5">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  <link.icon className="h-5 w-5 stroke-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {linkGroups.map((group) => (
              <div key={group.title} className="space-y-5">
                <h3 className="text-xs font-medium uppercase tracking-wider">{group.title}</h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm font-extralight text-muted-foreground hover:text-foreground transition-colors"
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
            <div className="lg:col-span-3 flex flex-col space-y-5">
              <h3 className="text-xs font-medium uppercase tracking-wider">{newsletterTitle}</h3>
              <p className="text-sm font-extralight text-muted-foreground">{newsletterDescription}</p>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div className="flex">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletterPlaceholder}
                      className="pl-10 h-10 font-extralight text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="h-10 w-full transition-all" 
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Inscrito!
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-light">{newsletterButtonText}</span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Copyright and legal links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-extralight text-muted-foreground">
              © {currentYear} {companyName}.Todos os Direitos Reservados.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xs font-extralight text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
