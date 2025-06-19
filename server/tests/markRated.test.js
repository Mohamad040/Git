const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');

jest.mock('../models/events');

describe('eventsController.markRated', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'eventId123' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    Events.findByIdAndUpdate.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should mark event as rated and return { ok: true }', async () => {
    Events.findByIdAndUpdate.mockResolvedValue({}); // simulate success

    await eventsController.markRated(req, res);

    expect(Events.findByIdAndUpdate).toHaveBeenCalledWith('eventId123', { rated: true });
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

});
