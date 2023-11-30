const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    const toughtsData = await Tought.findAll({
      include: User,
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    res.render("toughts/home", { toughts });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      // when it catches the user it already brings all his thoughts
      include: Tought,
      plain: true,
    });

    const toughts = user.Toughts.map((result) => result.dataValues);

    //  console.log("pensamentos do usuario", toughts);

    let emptyToughts = true;

    if (toughts.length > 0) {
      emptyToughts = false;
    }

    //console.log("pensamentos", toughts);
    // console.log(emptyToughts);

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Pensamento criado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Ocorreu um erro na criação de pensamento" + err);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Ocorreu um erro!" + err);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    // console.log("edição", tought);

    res.render("toughts/edit", { tought });
  }

  static async updateToughtPost(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Erro ao atualizar pensamento" + err);
    }
  }
};
