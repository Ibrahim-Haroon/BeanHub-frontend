

const order = [
    {
        'CoffeeItem': {
            'item_name': 'coffee',
            'quantity': [1, 2],
            'price': [2.0, 10.0],
            'temp': 'regular',
            'add_ons': ['pumps of caramel', 'whipped cream'],
            'milk_type': 'whole milk',
            'sweeteners': ['sugar'],
            'num_calories': ['(2,10)', '(60,120)'],
            'size': 'regular',
            'cart_action': 'insertion'
        }
    },
    {
        'BakeryItem': {
            'item_name': 'glazed donut',
            'quantity': [1],
            'price': [2.0],
            'num_calories': ['(200,500)'],
            'cart_action': 'insertion'
        }
    }
];

const order1 = [
    {
        'CoffeeItem': {
            'item_name': 'black coffee',
            'quantity': [],
            'price': [2.0],
            'temp': 'regular',
            'add_ons': [],
            'milk_type': 'regular',
            'sweeteners': [],
            'num_calories': ['(2,10)'],
            'size': 'regular',
            'cart_action': 'modification'
        }
    },
    {
        'BakeryItem': {
            'item_name': 'glazed donut',
            'quantity': [1],
            'price': [2.0],
            'num_calories': ['(200,500)'],
            'cart_action': 'insertion'
        }
    }
];

function parseCoffeeOrBeverageItem(item, key) {
    let i = 0;
    let res = {};

    const itemModification = item[key]['cart_action'] === "modification";
    const itemQuantity = item[key]['quantity'][0] || 1;
    res['item_name'] = [item[key]['item_name'],
        itemModification ? -itemQuantity : itemQuantity,
        i < item[key]['price'].length ? item[key]['price'][i++] * itemQuantity : 0];
    res['size'] = item[key]['size'];
    res['temp'] = item[key]['temp'];

    res['add_ons'] = [];
    for (let j = 0; j < item[key]['add_ons'].length; j++) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = item[key]['quantity'][i] || 1;
        res['add_ons'].push([item[key]['add_ons'][j],
            modification ? -quantity : quantity,
            i < item[key]['price'].length ? item[key]['price'][i++] * itemQuantity : 0]);
    }

    res['milk_type'] = [];
    if (item[key]['milk_type']) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = item[key]['quantity'][i] || 1;
        res['milk_type'].push([item[key]['milk_type'],
            modification ? -quantity : quantity,
            i < item[key]['price'].length ? item[key]['price'][i++] * itemQuantity : 0]);
    }

    res['sweeteners'] = [];
    for (let j = 0; j < item[key]['sweeteners'].length; j++) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = item[key]['quantity'][i] || 1;
        res['sweeteners'].push([item[key]['sweeteners'][j],
            modification ? -quantity : quantity,
            i < item[key]['price'].length ? item[key]['price'][i++] * itemQuantity : 0]);
    }

    return res;
}

function parseBakeryOrFoodItem(item, key) {
    const modification = item[key]['cart_action'] === "modification";
    const quantity = item[key]['quantity'].length ? item[key]['quantity'][0] : 1;
    return {
        'item_name': [
            item[key]['item_name'],
            !modification ? quantity : -quantity,
            item[key]['price'].length ? item[key]['price'][0] * quantity : 0
        ]
    };
}

export const parseOrder = (order) => {
    console.log("Entered parseOrder");
    let finalOrder = [];
    for (const item of order) {
        let res = {};
        for (const key in item) {
            if (item[key]['cart_action'] === 'question') {
                console.log('question');
                continue;
            }
            if (key === 'CoffeeItem' || key === 'BeverageItem') {
                console.log('coffee or beverage');
                res = parseCoffeeOrBeverageItem(item, key);
            } else if (key === 'FoodItem' || key === 'BakeryItem') {
                console.log('food or bakery');
                res = parseBakeryOrFoodItem(item, key);
            } else {
                console.log('error');
            }

            console.log(res);
            finalOrder.push(res);
        }
    }
    console.log("Done parsing order");
    return finalOrder;
}


