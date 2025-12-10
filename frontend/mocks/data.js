
export const MOCK_RESTAURANTS = [
    { 
        id: '1', 
        name: 'Hamburgueria Code', 
        cuisineType: 'Lanches', 
        estimatedDeliveryTime: '30-40',
        image: 'https://saudelab.com/wp-content/uploads/2023/02/hamburguer-caseiro-artesanal.jpg'
    },
    { 
        id: '2', 
        name: 'Pizza Java', 
        cuisineType: 'Italiana', 
        estimatedDeliveryTime: '45-60',
        image: 'https://blog.123milhas.com/wp-content/uploads/2022/07/pizzarias-tematicas-dia-da-pizza-sao-paulo-conexao123.jpg'
    }
];

export const MOCK_MENUS = {
    '1': [
        { 
            id: '101', 
            name: 'X-Bacon Artesanal', 
            price: 25.00, 
            description: 'Pão brioche, 180g de carne, bacon crocante e queijo cheddar.',
            image: 'https://www.sabornamesa.com.br/media/k2/items/cache/5098e75e57e36807c173cb7490b1b0d2_XL.jpg'
        },
        { 
            id: '102', 
            name: 'Batata Frita Rústica', 
            price: 12.00, 
            description: 'Porção média com ervas finas e maionese da casa.',
            image: 'https://tse1.mm.bing.net/th/id/OIP.p8-QVbq9yuvPAqKntu32uAHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        { 
            id: '103', 
            name: 'Coca-Cola Lata', 
            price: 6.00, 
            description: '350ml gelada.',
            image: 'https://tse3.mm.bing.net/th/id/OIP.QRSMYfbckiJx8KDG5NzrMgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
        }
    ],
    '2': [
        { 
            id: '201', 
            name: 'Pizza Calabresa', 
            price: 45.00, 
            description: 'Molho de tomate, mussarela, calabresa fatiada e cebola.',
            image: 'https://cdn6.campograndenews.com.br/uploads/noticias/2022/03/04/3cb5530b66938475b217183a18974de301f5b0fd.jpg'
        },
        { 
            id: '202', 
            name: 'Pizza 4 Queijos', 
            price: 50.00, 
            description: 'Mussarela, provolone, parmesão e gorgonzola.',
            image: 'https://www.portalumami.com.br/app/uploads/2021/07/Pizza-4-queijos.jpg'
        }
    ]
};