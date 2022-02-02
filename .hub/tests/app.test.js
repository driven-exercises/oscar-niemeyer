import { _setup } from "../utils/serverRunner";
import fs from "fs";

describe("Usage of controllers", () => {
  it("should be using controllers", () => {
    const authController = fs.readFileSync("./src/controllers/authController.js", "utf8");
    const userController = fs.readFileSync("./src/controllers/userController.js", "utf8");

    expect(authController.length).toBeGreaterThan(1);
    expect(userController.length).toBeGreaterThan(1);
  });
});
