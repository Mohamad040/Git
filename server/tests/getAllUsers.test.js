const { usersController } = require('../controllers/usersController'); // ✅ controller import
const User = require('../models/users'); // ✅ matches your actual path (lowercase)
jest.mock('../models/users'); // ✅ mock the model

describe('usersController.getAllUsers', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should return all users without passwords', async () => {
    const mockUsers = [
      { _id: '1', name: 'Alice', email: 'alice@example.com' },
      { _id: '2', name: 'Bob', email: 'bob@example.com' }
    ];

    // Simulate .select("-password") chaining
    const selectMock = jest.fn().mockResolvedValue(mockUsers);
    User.find.mockReturnValue({ select: selectMock });

    await usersController.getAllUsers(req, res);

    expect(User.find).toHaveBeenCalled();
    expect(selectMock).toHaveBeenCalledWith("-password");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

});
