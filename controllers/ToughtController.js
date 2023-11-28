const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    res.render("toughts/home");
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

    // check if user exists
    if (!user) {
      res.redirect("login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    //  console.log("pensamentos do usuario", toughts);

    res.render("toughts/dashboard", { toughts });
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
};
