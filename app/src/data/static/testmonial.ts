export interface Testimonial {
    id: number
    name: string
    role: string
    text: string
    rating: number
    date: string
}

export const CustomerTestimonials: Testimonial[] = [
    {
        id: 1,
        name: "Carlos Mendes",
        role: "Comprou um Volkswagen Golf 2021",
        text: "Processo de compra incrivelmente fácil. Encontrei exatamente o carro que queria com uma ótima condição.",
        rating: 5,
        date: "15/03/2023"
    },
    {
        id: 2,
        name: "Ana Souza",
        role: "Comprou uma Honda CB 500 2022",
        text: "Atendimento personalizado e transparente. Me senti segura em todas as etapas da negociação.",
        rating: 5,
        date: "22/04/2023"
    },
    {
        id: 3,
        name: "Roberto Almeida",
        role: "Comprou um Fiat Toro 2020",
        text: "Ótimo atendimento pós-venda também. Resolveram rapidamente uma pequena questão que surgiu.",
        rating: 4,
        date: "10/05/2023"
    }
]