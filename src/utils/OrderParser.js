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
    const res = {};
    const itemModification = item[key]['cart_action'] === "modification";
    const itemQuantity = item[key]['quantity'].length ? item[key]['quantity'][0] : 1;
    res['item_name'] = [item[key]['item_name'],
        !itemModification ? itemQuantity : -itemQuantity,
        i < item[key]['price'].length ? item[key]['price'][i] * itemQuantity : 0];
    i++;
    res['size'] = item[key]['size'];
    res['temp'] = item[key]['temp'];

    for (let j = 0; j < item[key]['add_ons'].length; j++) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = i < item[key]['quantity'].length ? item[key]['quantity'][i] : 1;
        res['add_ons'] = [item[key]['add_ons'][j],
            !modification ? quantity : -quantity,
            i < item[key]['price'].length ? item[key]['price'][i] * quantity : 0];
        i++;
    }

    if (item[key]['milk_type']) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = i < item[key]['quantity'].length ? item[key]['quantity'][i] : 1;
        res['milk_type'] = [item[key]['milk_type'],
            !modification ? quantity : -quantity,
            i < item[key]['price'].length ? item[key]['price'][i] * quantity : 0];
        i++;
    }

    for (let j = 0; j < item[key]['sweeteners'].length; j++) {
        const modification = item[key]['cart_action'] === "modification";
        const quantity = i < item[key]['quantity'].length ? item[key]['quantity'][i] : 1;
        res['sweeteners'] = [item[key]['sweeteners'][j],
            !modification ? quantity : -quantity,
            i < item[key]['price'].length ? item[key]['price'][i] * quantity : 0];
        i++;
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

function parser(order) {
    for (const item of order) {
        let res = {};
        for (const key in item) {
            if (item[key]['cart_action'] === 'question') {
                console.log('question');
                continue;
            }

            if (key === 'CoffeeItem' || key === 'BeverageItem') {
                res = parseCoffeeOrBeverageItem(item, key);
            } else if (key === 'FoodItem' || key === 'BakeryItem') {
                res = parseBakeryOrFoodItem(item, key);
            } else {
                console.log('error');
            }
        }

        console.log(res);
    }
}
