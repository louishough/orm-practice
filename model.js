const {Sequelize, DataTypes, Model} = require('sequelize')
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite', logging: false})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

class Restaurant extends Model {}
class Menu extends Model {}
class Item extends Model {}

Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, {sequelize, modelName: 'restaurant'})

Menu.init({
    title: DataTypes.STRING,
    restaurant_id: DataTypes.INTEGER
}, {sequelize, modelName: 'menu'})

Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    menu_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER
}, {sequelize, modelName: 'item'})

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)
Menu.hasMany(Item)
Item.belongsTo(Menu)

module.exports = {Restaurant, Menu, Item, sequelize}

