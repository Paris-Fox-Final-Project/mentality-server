const { Topic } = require("../models");

class TopicController {
  static async getItem(req, res, next) {
    try {
      const topics = await Topic.findAll({
        order: [["id", "ASC"]],
      });
      res.status(200).json({ topics: topics });
    } catch (error) {
      next(error);
    }
  }

  static async getItemById(req, res, next) {
    try {
      const { id } = req.params;
      const dataItem = await Topic.findByPk(id);
      if (dataItem) {
        res.status(200).json({ topic: dataItem });
      } else {
        throw { name: "TOPIC_NOT_FOUND" };
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
      res.status(201).json({ topic: createData });
    } catch (error) {
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

        const topic = updateTopic[1][0];
        res.status(200).json({ topic: topic });
      } else {
        throw {
          name: "TOPIC_NOT_FOUND",
        };
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
          name: "TOPIC_NOT_FOUND",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TopicController;
