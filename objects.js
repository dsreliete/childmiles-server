const parent = {
    id: 1,
    name: "Eliete",
    familyName: "Rodrigues"
}

const childrenArray = [
    {
        id: 1,
        name: "Sheldon",
        dtNasc: "01-25-2014",
        gender: "male"

    },
    {
        id: 2,
        name: "Amy",
        dtNasc: "06-25-2017",
        gender: "female"
    },
    {
        id: 3,
        name: "Benjamin",
        dtNasc: "04-21-2012",
        gender: "male"

    },
    {
        id: 4,
        name: "Maria Eduarda",
        dtNasc: "09-18-2015",
        gender: "female"
    },
]

const awardsArray = [
    {
        id: 1,
        description: "Go to park",
        point: 30
    },
    {
        id: 2,
        description: "Buy goodies",
        point: 30
    },
    {
        id: 3,
        description: "Buy online games",
        point: 70
    },
    {
        id: 4,
        description: "Visit lovely aunt",
        point: 30
    },
]

const categoriesArray = [
    {
        id: 1,
        description: "Hygiene"
    },
    {
        id: 2,
        description: "Behaviour"
    },
    {
        id: 3,
        description: "School"
    }

]

const goalsArray = [
    {
        id: 1,
        description: "Brush your teeth",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 35,
        category : {
            id: 1,
            description: "Hygiene"
        }
    },
    {
        id: 2,
        description: "Take a rapid shower",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 35,
        category : {
            id: 1,
            description: "Hygiene"
        }
    },
    {
        id: 3,
        description: "Wash your hands before eating",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 30,
        category : {
            id: 1,
            description: "Hygiene"
        }
    },
    {
        id: 4,
        description: "Good behaviour going out",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 35,
        category : {
            id: 2,
            description: "Behaviour"
        }
    },
    {
        id: 5,
        description: "Sleep on time",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 35,
        category : {
            id: 2,
            description: "Behaviour"
        }
    },
    {
        id: 6,
        description: "Wake up on time",
        redPoint: 0,
        yellowPoint: 5,
        greenPoint: 35,
        category : {
            id: 2,
            description: "Behaviour"
        }
    },
    {
        id: 7,
        description: "Willingness to do homework",
        redPoint: 0,
        yellowPoint: 90,
        greenPoint: 135,
        category : {
            id: 2,
            description: "School"
        }
    },
    {
        id: 8,
        description: "Help your sister with homework",
        redPoint: 0,
        yellowPoint: 55,
        greenPoint: 85,
        category : {
            id: 2,
            description: "School"
        }
    },
    {
        id: 9,
        description: "Best grades",
        redPoint: 0,
        yellowPoint: 50,
        greenPoint: 100,
        category : {
            id: 2,
            description: "School"
        }
    }
]

const penaltiesArray = [
    {
        id: 1,
        description: "Speaking bad words",
        point : -50
    },
    {
        id: 2,
        description: "Receive school warning",
        point : -100
    },
    {
        id: 3,
        description: "Rude reply to parents",
        point : -150
    }
]

/*
    Associar um goal a uma crianca:
    objeto goal deve ter um objeto category;
    um objeto association deve ter um objeto child e um objeto goal
    status :indica se determinado goal ja foi associado a determinada 
    criança.
*/
const associationArray = [
    {
        id: 1,
        status: true,
        children: 1,
        goals : 1
    },
    {
        id: 2,
        status: true,
        children: 4,
        goals : 9
    }
]
/*
    Quais sao as realizacoes?
    ActionType: bonificar, penalizar, dar ponto extra positivo, 
    dar ponto extra negativo e premiar

    Ponto extra positivo: 
        child, actiontype: "ponto_extra", 
        point : 1, pointType: "green", dateTime
    
    Ponto extra negativo: 
        child, actiontype: "ponto_extra", 
        point : -1, pointType: "red", dateTime 
    
    Premiar:
        child, award, actionType: premiar, 
        point : 60, pointType: "blue", dateTime 

    Penalizar:
        child, penalty, actionType: penalizar,
        point, pointType: "red", dateTime
    
    Bonificar:
        child, goal, categoryGoal, actionType: bonificar,
        point, pointType: "green or yellow", dateTime
*/

const realizationArray = [
    {
        id: 1,
        dateTime: "date and time",
        actionType: "pontoExtra",
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        }, 
        point : 1,
        pointType: "green"
    },
    {
        id: 2,
        dateTime: "date and time",
        actionType: "pontoExtra",
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        }, 
        point : -1,
        pointType: "red"
    },
    {
        id: 3,
        dateTime: "date and time",
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        }, 
        actionType: "bonificar",
        point : 35,
        pointType: "green",
        goals : {
            id: 1,
            description: "Brush your teeth",
            redPoint: 0,
            yellowPoint: 5,
            greenPoint: 35,
            category : {
                id: 1,
                description: "Hygiene"
            }
        }
        
    },
    {
        id: 4,
        dateTime: "date and time",
        actionType: "penalizar",
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        }, 
        point : 5,
        pointType: "red",
        penalty: {
            id: 2,
            description: "Receive school warning",
            point : -10
        }
    },
    {
        id: 5,
        dateTime: "date and time",
        actionType: "premiar",
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        }, 
        point : 5,
        pointType: "blue",
    },
    {
        id: 6,
        dateTime: "",
        actionType: "pontoExtra",
        child: {
            id: 3,
            name: "Benjamin",
            dtNasc: "04-21-2012",
            gender: "male"
        },
        point: 1,
        pointType: "green" 
    },
    {
        id: 7,
        dateTime: "date and time",
        actionType: "pontoExtra",
        child: {
            id: 3,
            name: "Benjamin",
            dtNasc: "04-21-2012",
            gender: "male"
        }, 
        point : -1,
        pointType: "red"
    }

]
/*
    Na teoria deveria buscar o total de pontos baseado nas realizacoes de 
    cada criança, mas no caso para montar essa tela eu preciso apenas do
    totals de pontos da criança em questao para entao determinar se eu posso 
    fazer o resgate!
    caso tenha ponto suficiente eu diminuo o valor de resgate do total de 
    pontos da crianca senão nao sera possivel fazer nada pq o botao ficará
    desabilitado.   

*/
const rescueAwards = [
    {
        totalPoints: 0,
        child: {
            id: 3,
            name: "Benjamin",
            dtNasc: "04-21-2012",
            gender: "male"
        },
    },
    {
        totalPoints: 35,
        child: {
            id: 1,
            name: "Sheldon",
            dtNasc: "01-25-2014",
            gender: "male"
        },
    },
]