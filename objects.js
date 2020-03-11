// POST Child
{"name":"Sheldon", "image":"", "gender":"male", "dateBirth":"25/01/2014"}

// POST FAMILY
{"familyName":"Rodrigues", "image": ""}

// POST AWARDS
{"description": "Buy online games", "point": 60}

// POST CATEGORIES
{"description": "Hygiene"}

// POST GOALS
{
    "description": "Wash your hands before eating",
    "redPoint": 0,
    "yellowPoint": 30,
    "greenPoint": 50,
    "category": "5e6448067781a600122ff5d3"
}

// POST PENALTIES
{"description":"Rude reply to parents", "point": -30 }

// POST ASSOCIATIONS/:childId/goals
[{"_id": "5e644f73ffc3150013eeafb8"}, {"_id": "5e64481e7781a600122ff5d4"}, {"_id": "5e644f4affc3150013eeafb7"}]

// POST REALIZATIONS/:childId/actions
[
    {
        "type": "rescueAward",
        "point": -30,
        "pointType": "blue",
        "award": "5e65ca2bb96159001a70a0b3"
	}, {
		"type": "rescueAward",
        "point": -30,
        "pointType": "blue",
        "award": "5e69285ab69f5b001a8d8661"
	},
	{
		"type": "rescueAward",
        "point": -60,
        "pointType": "blue",
        "award": "5e69286cb69f5b001a8d8662"
	}
]

[
    {
        "type": "bonus",
        "point": 70,
        "pointType": "green",
        "goal": "5e644f73ffc3150013eeafb8"
	}, {
		"type": "bonus",
        "point": 30,
        "pointType": "yellow",
        "goal": "5e64481e7781a600122ff5d4"
	},
	{
		"type": "bonus",
        "point": 0,
        "pointType": "red",
        "goal": "5e644f4affc3150013eeafb7"
	}
]

[
    {
        "type": "penalty",
        "point": -10,
        "pointType": "red",
        "penalty": "5e65b7ce06f7a8001ad440ed"
	}, {
		"type": "penalty",
        "point": -20,
        "pointType": "red",
        "penalty": "5e68fee1284670001ae51d04"
	},
	{
		"type": "penalty",
        "point": -30,
        "pointType": "red",
        "penalty": "5e68ff16284670001ae51d05"
	}
]

[
    {
        "type": "extraPositivePoint",
        "point": 50,
        "pointType": "green"
	}, {
		"type": "extraPositivePoint",
        "point": 50,
        "pointType": "green"
	},
	{
		"type": "extraPositivePoint",
        "point": 50,
        "pointType": "green"
	}
]

[
    {
        "type": "extraNegativePoint",
        "point": -10,
        "pointType": "red"
	}, {
		"type": "extraNegativePoint",
        "point": -10,
        "pointType": "red"
	},
	{
		"type": "extraNegativePoint",
        "point": -10,
        "pointType": "red"
	}
]