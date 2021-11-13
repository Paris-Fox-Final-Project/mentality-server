const { Topic } = require("../models");

class TopicController {
  static async getItem(req, res, next) {
    try {
      const dataItem = await Topic.findAll({
        order: [["id", "ASC"]],
      });
      res.status(200).json(dataItem);
    } catch (error) {
      next(error);
    }
  }

  static async getItemById(req, res, next) {
    try {
      const { id } = req.params;
      const dataItem = await Topic.findByPk(id);
      if (dataItem) {
        res.status(200).json(dataItem);
      } else {
        next({ name: "NotFound" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async postItem(req, res, next) {
    try {
      const { name } = req.body;
      const createData = await Topic.create({
        name,
      });
      console.log(createData, ">>> topics");
      res.status(201).json(createData);
    } catch (error) {
      console.log(error, " error ");
      next(error);
    }
  }

  static async putItem(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const foundTopic = await Topic.findByPk(id);

      if (foundTopic) {
        const updateTopic = await Topic.update(
          {
            name,
          },
          {
            where: {
              id,
            },
            returning: true,
          }
        );

        if (updateTopic) {
          res.status(200).json(updateTopic[1][0]);
        } else {
          next({
            name: "SequelizeValidationError",
          });
        }
      } else {
        next({
          name: "NotFound",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;

      const foundTopic = await Topic.findByPk(id);

      if (foundTopic) {
        const isDelete = await Topic.destroy({
          where: {
            id,
          },
        });
        if (isDelete) {
          res.status(200).json({
            message: `${foundTopic.name} success to delete`,
          });
        }
      } else {
        next({
          name: "InvalidRequest",
          message: "Invalid data to delete",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TopicController;
