const {Restaurant, Menu, Item, sequelize} = require('./model')
const data = require("./data.json")

beforeAll(async () => {
    await sequelize.sync().then(async () => {
        const taskQueue = data.map(async (json_restaurant) => {
                const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
                const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                    const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                    const menu = await Menu.create({title: _menu.title})
                    return menu.setItems(items)
                }))
                return await restaurant.setMenus(menus)
            })
        return Promise.all(taskQueue)
    })
})

describe('Restaurant', () => {
    test('can create a restaurant', async () => {
        const restautant = await Restaurant.create({name: 'Ronalds', image: 'http://some.image.url'})
        expect(restautant.id).toBe(9)
    })
})

describe('Menu', () => {
    test('can create a menu', async () => {
        const menu = await Menu.create({title: 'Wine', restautant_id: 1})
        expect(menu.title).toBe("Wine")
    })
})

describe('Item', () => {
    test('can create an item', async () => {
        const item = await Item.create({name: "food", price: 10.00, menu_id: 1, restautant_id: 1})
        expect(item.price).toBe(10.00)
    })
})

describe('Relationships', () => {
    test('restaurants have menus', async () => {
        const restaurantWithMenus = await Restaurant.findOne({where: {name: "Cafe Monico"}, include: "menus"})
        const menus = await restaurantWithMenus.getMenus()
        expect(menus[0].title).toBe("Mains")
    })
    test('menus have items', async () => {
        const restaurantWithMenus = await Restaurant.findOne({where: {name: "Cafe Monico"}, include: "menus"})
        let menus = await restaurantWithMenus.getMenus()
        menus = await Menu.findOne({where: {title: 'Mains'}, include: "items"})
        const items = await menus.getItems()
        expect(items[0].name).toBe("Parnip Soup")
    })
    test("menus belong to restaurants", async () => {
        const menu = await Menu.findOne({where: {title: "Waffle"}})
        expect(menu.restaurantId).toBe(6)
        const menuTwo = await Menu.findOne({where: {title: "Grill"}})
        expect(menuTwo.restaurantId).toBe(1)
    })
    test("items belong to menus", async () => {
        const item = await Item.findOne({where: {name: 'Green bean salad, aged comte, shallots, walnut dressing'}})
        expect(item.menuId).toBe(10)
    })

})
