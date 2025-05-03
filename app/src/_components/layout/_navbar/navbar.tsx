
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { 
    Sheet, 
    SheetContent, 
    SheetTrigger 
} from "~/components/ui/sheet";
import { 
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Badge } from "~/components/ui/badge";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "~/components/ui/avatar";
import { 
    Menu, 
    ShoppingBag,  
    ChevronRight,
    User
} from "lucide-react";

// Import auth hook
import { useAuth } from "~/src/hooks/useAuth";


// Definição de tipos
interface MenuItem {
    name: string;
    href: string;
    submenu?: MenuItem[];
}

interface NavigationProps {
    cartItemCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ 
    cartItemCount = 0
}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const pathname = usePathname();
    
    // Use the auth hook to access authentication state and functions

    const { user, isAuthenticated, status, error, logout } = useAuth();
    
    
    // Debug user state - remove in production
    useEffect(() => {
        console.log("Auth status:", status);
        console.log("Is authenticated:", isAuthenticated);
        console.log("User:", user);
        console.log("Error:", error);
    }, [user, isAuthenticated, status, error]);

    useEffect(() => {
        console.log("Navbar user changed:", user);
        console.log("Navbar isAuthenticated changed:", isAuthenticated);
      }, [user, isAuthenticated]);
    
    // Detecta se é dispositivo móvel
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);
    
    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            // Optionally redirect to home page after logout
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    const menuItems: MenuItem[] = [
        { name: "Home", href: "/" },
        { name: "Coleção", href: "/colecao" },
        { 
            name: "Categorias", 
            href: "#",
            submenu: [
                { name: "Novo", href: "/categorias/novo" },
                { name: "Destaques", href: "/categorias/destaques" },
                { name: "Essenciais", href: "/categorias/essenciais" }
            ] 
        },
        { name: "Lookbook", href: "/lookbook" },
        { name: "Sobre", href: "/sobre" }
    ];
    
    const isActive = (path: string): boolean => pathname === path;
    
    // Componente de navegação para desktop - com design minimalista
    const DesktopNav = () => (
        <div className="hidden md:flex justify-between items-center w-full px-12 py-6">
            <Link to="/" className="text-xl font-extralight tracking-widest uppercase">
                Prestige Motors
            </Link>
            
            <NavigationMenu className="mx-6">
                <NavigationMenuList className="gap-10">
                    {menuItems.map((item, index) => (
                        item.submenu ? (
                            <NavigationMenuItem key={index}>
                                <NavigationMenuTrigger 
                                    className={cn(
                                        "font-extralight tracking-wider text-xs uppercase bg-transparent hover:bg-transparent",
                                        isActive(item.href) && "font-normal"
                                    )}
                                >
                                    {item.name}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[180px] gap-1 p-4 border-t border-border">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        to={subItem.href}
                                                        className={cn(
                                                            "block py-2 text-xs font-extralight uppercase tracking-wider hover:bg-transparent",
                                                            isActive(subItem.href) && "font-normal"
                                                        )}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem key={index}>
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "text-xs font-extralight uppercase tracking-wider hover:text-foreground/70 transition-colors",
                                        isActive(item.href) && "font-normal"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            </NavigationMenuItem>
                        )
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center gap-8">
                {isAuthenticated ? (
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger 
                                    className="bg-transparent hover:bg-transparent p-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7 border border-border">
                                            <AvatarImage src={user?.nome || ""} />
                                            <AvatarFallback className="text-xs font-extralight">
                                                {user?.nome ? user.nome.charAt(0) : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-extralight uppercase tracking-wider">Conta</span>
                                    </div>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-1 p-4 border-t border-border">
                                        <li className="mb-2 pb-2 border-b border-border">
                                            <p className="text-xs font-normal">{user?.nome || "Usuário"}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link 
                                                    to="/dashboard" 
                                                    className="flex items-center justify-between py-2 text-xs font-extralight tracking-wider"
                                                >
                                                    <span>Minha conta</span>
                                                    <ChevronRight className="h-3 w-3" />
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link 
                                                    to="/pedidos" 
                                                    className="flex items-center justify-between py-2 text-xs font-extralight tracking-wider"
                                                >
                                                    <span>Meus pedidos</span>
                                                    <ChevronRight className="h-3 w-3" />
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start text-xs font-extralight tracking-wider p-0 h-auto py-2 hover:bg-transparent hover:text-foreground/80" 
                                                onClick={handleLogout}
                                            >
                                                <span>Sair</span>
                                            </Button>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                ) : (
                    <div className="flex gap-6">
                        <Link 
                            to='/login'
                            className="text-xs font-extralight uppercase tracking-wider hover:text-foreground/70 transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link 
                            to="/register" 
                            className="text-xs font-extralight uppercase tracking-wider hover:text-foreground/70 transition-colors"
                        >
                            Registrar
                        </Link>
                    </div>
                )}
                
                <Link to="/carrinho" className="relative">
                    <ShoppingBag className="h-5 w-5 stroke-1" />
                    {cartItemCount > 0 && (
                        <Badge 
                            className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-extralight bg-foreground text-background rounded-full"
                        >
                            {cartItemCount}
                        </Badge>
                    )}
                </Link>
            </div>
        </div>
    );
    
    // Componente de navegação móvel com design minimalista
    const MobileNav = () => (
        <div className="flex md:hidden justify-between items-center w-full px-6 py-5">
            <Link to="/" className="text-lg font-extralight tracking-widest uppercase">
                Prestige
            </Link>
            
            <div className="flex items-center gap-5">
                {isAuthenticated && (
                    <Link to="/dashboard">
                        <User className="h-5 w-5 stroke-1" />
                    </Link>
                )}
                
                <Link to="/carrinho" className="relative">
                    <ShoppingBag className="h-5 w-5 stroke-1" />
                    {cartItemCount > 0 && (
                        <Badge 
                            className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-extralight bg-foreground text-background rounded-full"
                        >
                            {cartItemCount}
                        </Badge>
                    )}
                </Link>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-1">
                            <Menu className="h-5 w-5 stroke-1" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[80%] max-w-[300px] p-0">
                        <div className="flex flex-col h-full">
                            {isAuthenticated && (
                                <div className="flex items-center gap-3 p-6 border-b border-border">
                                    <Avatar className="h-9 w-9 border border-border">
                                        <AvatarImage src={user?.avatar || ""} />
                                        <AvatarFallback className="text-xs font-extralight">
                                            {user?.nome?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-normal">{user?.nome || "Usuário"}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex-1 overflow-auto">
                                <div className="px-6 py-8 space-y-7">
                                    {menuItems.map((item, index) => (
                                        item.submenu ? (
                                            <div key={index} className="space-y-4">
                                                <p className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                                                    {item.name}
                                                </p>
                                                <div className="space-y-4 pl-1">
                                                    {item.submenu.map((subItem, subIndex) => (
                                                        <Link
                                                            key={subIndex}
                                                            to={subItem.href}
                                                            className={cn(
                                                                "block text-xs font-extralight tracking-wider uppercase text-foreground hover:text-muted-foreground transition-colors"
                                                            )}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                key={index}
                                                to={item.href}
                                                className="block text-xs font-extralight tracking-wider uppercase text-foreground hover:text-muted-foreground transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                            
                            <div className="px-6 pt-6 pb-8 space-y-4 border-t border-border">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="block text-xs font-extralight tracking-wider uppercase hover:text-muted-foreground transition-colors"
                                        >
                                            Minha conta
                                        </Link>
                                        <Link
                                            to="/pedidos"
                                            className="block text-xs font-extralight tracking-wider uppercase hover:text-muted-foreground transition-colors"
                                        >
                                            Meus pedidos
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-xs font-extralight tracking-wider uppercase p-0 h-auto hover:bg-transparent hover:text-foreground/80"
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block text-xs font-extralight tracking-wider uppercase hover:text-muted-foreground transition-colors"
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            to="/registrar"
                                            className="block text-xs font-extralight tracking-wider uppercase hover:text-muted-foreground transition-colors"
                                        >
                                            Registrar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
    
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
            {isMobile ? <MobileNav /> : <DesktopNav />}
        </nav>
    );
};

export default Navigation;