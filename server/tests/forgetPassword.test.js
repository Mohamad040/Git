// ✅ MOCK nodemailer BEFORE anything else
jest.mock("nodemailer", () => {
  const mockSendMail = jest.fn();
  return {
    createTransport: jest.fn(() => ({
      sendMail: mockSendMail,
    })),
    __mockSendMail: mockSendMail, // export it for use in test
  };
});

// ✅ IMPORTS after mocking
const { authController } = require("../controllers/authController");
const User = require("../models/users");
const nodemailer = require("nodemailer");

jest.mock("../models/users");

describe("Unit Test: forgetPassword (no code changes)", () => {
  let req, res;
  const mockSendMail = nodemailer.__mockSendMail;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockSendMail.mockReset();
  });

  it("❌ should return 400 if email is missing", async () => {
    req.body.email = "";

    await authController.forgetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email is required",
    });
  });

});
