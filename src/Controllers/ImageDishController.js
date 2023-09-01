const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const DiskStorage = require("../providers/diskStorage");

class ImageDishController {
    async update(request, response) {
        const dishImageFileName = request.file?.filename;
        const { dish_id } = request.body;

        const diskStorage = new DiskStorage();

        const dish = await knex("dish").where({ id: dish_id }).first();

        if (dish.img_dish && dishImageFileName) {
            await diskStorage.deleteFile(dish.img_dish);
        }

        if (dishImageFileName) {
            const filename = await diskStorage.saveFile(dishImageFileName);

            dish.img_dish = filename;

            await knex("dish").update(dish).where({ id: dish_id });
        } else {
            await knex("dish").update({
                name: dish.name,
                description: dish.description,
                category: dish.category,
                price: dish.price,
                updated_at: knex.fn.now(),
            }).where({ id: dish_id });
        }

        return response.json(dish);
    }
}

module.exports = ImageDishController;

