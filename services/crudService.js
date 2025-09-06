class CrudService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const item = new this.model(data);
            return await item.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAll() {
        try {
            return await this.model.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id) {
        try {
            const item = await this.model.findById(id);
            if (!item) throw new Error("Item not found");
            return item;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id, data) {
        try {
            const item = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!item) throw new Error("Item not found");
            return item;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async delete(id, managerSuppression = null) {
        try {
            const item = await this.model.findById(id);
            if (!item) throw new Error("Item not found");

            item.dateSuppression = new Date();
            item.managerSuppression = managerSuppression;
            item.etat = "Supprimé";
            await item.save();

            return { message: "Deleted successfully (soft delete)" };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = CrudService;