const Events = require('../models/events'); // Assuming this is the correct path
const { infoLogger, errorLogger } = require("../logs/logs");
const User = require('../models/users'); // Assuming you're storing user data here
const mongoose = require('mongoose');
const sendMail = require('../utils/mailer');
exports.eventsController = {
    async addEvent(req, res) {
        try {
          const user = await User.findById(req.userId);
          if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
          }
      
          const { callType, city, street, houseNumber,date, description,status } = req.body;
      
          // Validation (basic server-side)
          if (!callType || !city || !street || !description ||!status) {
            return res.status(400).json({ message: "Missing required fields" });
          }
      
          const costumerdetails = [
            `Name: ${user.name}`,
            `Age: ${user.age}`
          ];
      
          const newEvent = new Events({
            callType,
            city,
            street,
            houseNumber: houseNumber || 0,
            date,
            description,
            costumerdetails, // 🧠 This will be stored as an array of strings
            status,
            createdBy: req.userId

            // callID and date will be set automatically
          });
      
          const savedEvent = await newEvent.save();

          user.userCalls = user.userCalls || [];
          user.userCalls.push(newEvent.callID);
          await user.save();
          return res.status(201).json({ message: "Event created successfully", event: savedEvent });
        } catch (err) {
          console.error("❌ Error creating event:", err);
          return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    },
     async unapply(req, res) {
    try {
      const eventId = req.params.id;

      // Build a filter that works whether 'id' is a real ObjectId or your UUID callID
      const filter = mongoose.Types.ObjectId.isValid(eventId)
        ? { _id: eventId }
        : { callID: eventId };

      // Pull this user out of both arrays
      const updated = await Events.findOneAndUpdate(
        filter,
        {
          $pull: {
            applicants: req.userId,
            approvedWorkers: req.userId,
          }
        },
        { new: true }
      );

      if (!updated) {
        // no event found
        return res.status(404).json({ message: 'Call not found' });
      }

      return res.json({ message: 'Unapplied successfully' });
    } catch (err) {
      errorLogger.error(`Error unapplying: ${err}`);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

     async getEvents(req, res) {
        try {
          const filter = req.isAdmin ? {} : { createdBy: req.userId };
          const events = await Events.find(filter).sort({ date: -1 });
          res.json(events);
          infoLogger.info('Fetched calls for user ${req.userId}');
        } catch (err) {
          errorLogger.error(`Error fetching Calls: ${err}`);
          res.status(500).json({
            message: 'Error fetching Calls',
            error  : err.message,
          });
        }
      },

    async getEventsByType(req, res) {
        try {
            
            const events = await Events.find({
              callType: req.params.callType,
            });
            if (events.length > 0) {
                res.json(events);
            } else {
                errorLogger.error(`No events found for call type: ${req.params.callType}`);
                res.status(404).json({ message: "No calls found for this type" });
            }
        } catch (err) {
            errorLogger.error(`Error fetching calls by type: ${err}`);
            res.status(500).json({ message: "Error fetching calls", error: err });
        }
    },
    async updateEvent(req, res) {
        const { callID: eventId } = req.params;
        const { callType, city, street, houseNumber, description, status } = req.body;
    
        try {
            const eventToUpdate = await Events.findOne({ callID: eventId });  // <-- fixed here
    
            if (!eventToUpdate) {
                errorLogger.error(`Call not found: ${eventId}`);
                return res.status(404).json({ message: "Call not found" });
            }
    
            // Update only allowed fields
            eventToUpdate.callType = callType;
            eventToUpdate.city = city;
            eventToUpdate.street = street;
            eventToUpdate.houseNumber = houseNumber;
            eventToUpdate.description = description;
            eventToUpdate.status = status;
    
            await eventToUpdate.save();
    
            infoLogger.info(`Call updated successfully: ${eventId}`);
            res.json({ message: "Call updated successfully", event: eventToUpdate });
    
        } catch (err) {
            errorLogger.error(`Error updating Call: ${err}`);
            res.status(500).json({ message: "Error updating Call", error: err });
        }
    },

    // controllers/eventsController.js
    async cusupdateEvent(req, res) {
      try {
        /* ── 1. build a whitelist of mutable fields ─────────────── */
        const allowed = ['callType', 'city', 'street',
                        'houseNumber', 'description', 'date'];

        const changes = {};
        allowed.forEach(f => {
          if (req.body[f] !== undefined) changes[f] = req.body[f];
        });

        /* ── 2. update ONLY the caller’s own event ──────────────── */
        const event = await Events.findOneAndUpdate(
          { _id: req.params.id, createdBy: req.userId },
          { $set: changes },
          { new: true }
        );

        if (!event) return res.status(404).json({ message: 'Call not found' });

        return res.json({ message: 'Updated', event });
      } catch (err) {
        errorLogger.error(`Update error: ${err}`);
        return res.status(500).json({ message: err.message });
      }
    },

     async deleteEvent(req, res) {
     const param = req.params.id;

     try {
       let deleted;

      // 1) If param is a valid ObjectId, delete by _id
       if (mongoose.Types.ObjectId.isValid(param)) {
         deleted = await Events.findByIdAndDelete(param);
       } else {
        // 2) Otherwise try deleting by your custom callID field
         deleted = await Events.findOneAndDelete({ callID: param });
       }

      // 3) If nothing was deleted, return 404
       if (!deleted) {
         errorLogger.error(`Event not found: ${param}`);
         return res.status(404).json({ message: "Event not found" });
       }

      // 4) Optionally remove that callID from the user's userCalls array
      //    (requires verifyToken to have set req.userId)
       if (req.userId) {
        await User.updateOne(
          { _id: req.userId },
          { $pull: { userCalls: deleted.callID || deleted._id.toString() } }
         );
       }

      infoLogger.info(`Event deleted successfully: ${param}`);
      return res.json({ message: "Event deleted successfully" });

     } catch (err) {
      // 5) Any other error => 500 with the error message
      errorLogger.error(`Error deleting event: ${err.stack}`);
      return res.status(500).json({
        message: "Error deleting event",
        error: err.message
      });
    }
   },
    async getLocationDetails(req, res) {
        try {
            const { lat, lng } = req.body;
            if (!lat || !lng) {
            return res.status(400).json({ message: "Missing coordinates" });
            }

            const [heData, enData] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json()),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json())
            ]);

            const extract = (data) => {
            const a = data.address;
            const city = a.city || a.town || a.village || a.state_district || a.state ;
            const street = a.road || a.street || a.pedestrian || a.footway || a.neighbourhood || "";
            const houseNumber = a.house_number || a.housenumber || "";
            console.log("🧭 Address Fields:", a);

            return { city, street, houseNumber };
            };

            const he = extract(heData);
            const en = extract(enData);

            const fullCity = `${he.city}, ${heData.address.country} | ${en.city}, ${enData.address.country}`;
            const finalStreet = (he.street && he.street.trim())  ? he.street
            : (en.street && en.street.trim()) ? en.street
            : "";
            const finalHouseNumber = he.houseNumber || en.houseNumber || "";

            return res.status(200).json({
            city: fullCity,
            street: finalStreet,
            houseNumber: finalHouseNumber
            });

        } catch (err) {
            console.error("❌ Error reverse-geocoding location:", err);
            return res.status(500).json({ message: "Failed to get location details", error: err.message });
        }
    },
     // returns [{ workerId, name, email, phone, ... }, …]
async getApplicants(req, res) {
  const event = await Events.findById(req.params.id)
    .populate('applicants', 'name email phone workType');
  const approved = await User.find(
    { _id: { $in: event.approvedWorkers } },
    'name email phone workType'
  );
  return res.json({
    applicants: event.applicants,
    approvedWorkers: approved
  });
},
  async applyToCall(req, res) {
  try {
    const { id }   = req.params;       // call _id from the URL
    const workerId = req.userId;       // comes from verifyToken

    /* ① add this worker to applicants (skip duplicates automatically) */
    const event = await Events.findByIdAndUpdate(
      id,
      { $addToSet: { applicants: workerId } },
      { new: true }
    )
      .populate('createdBy',  'name email')     // customer who opened the call
      .populate('applicants', 'name email');    // optional: who else applied

    if (!event) return res.status(404).json({ message: 'Call not found' });

    /* ② fetch the worker’s public details for the mail body */
    const worker = await User.findById(workerId, 'name email workType');

    /* ③ fire an e-mail — don’t crash if it fails */
    try {
      await sendMail(
        event.createdBy.email,
        `New applicant for your ${event.callType} call`,
        `<p>Hi ${event.createdBy.name},</p>
         <p><strong>${worker.name}</strong> (${worker.workType})
            just requested to handle your <em>${event.callType}</em> job.</p>
         <p>Open <strong>My Calls → View Applicants</strong> inside HouseFix
            to review all requests.</p>
         <hr style="border:none;border-top:1px solid #eee"/>
         <p style="font-size:0.85em;color:#777">This is an automated message –
            please do not reply.</p>`
      );
    } catch (mailErr) {
      console.error('❌  Could not send notification mail:', mailErr);
      // we still continue – the request itself succeeded
    }

    return res.json({ message: 'Request sent and customer notified' });
  } catch (err) {
    errorLogger.error(`Error applying to call: ${err}`);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
},


 async approveWorker(req, res) {
  try {
    const { id, workerId } = req.params;

    /*  one atomic update is enough  */
    const event = await Events.findByIdAndUpdate(
      id,
      {
        $addToSet : { approvedWorkers: workerId },
        /* … empty the applicants list so nobody else sees it */
        $set      : { applicants: [],              // ①
        status    : 'in progress',    // ②
        assignedWorker: workerId },
        rated         : false 
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
       try {
     // who was approved?
     const worker   = await User.findById(workerId).select('name email');
     // who approved him?
     const customer = await User.findById(event.createdBy).select('name email');

     if (worker?.email) {
       await sendMail(
         worker.email,
         '✅ Your request was approved!',
         `
    Hi ${worker.name},

   Great news – ${customer?.name || 'a customer'} has approved your request
   for the "${event.callType}" call (#${event.callID}).

   You can now contact the customer through HouseFix to arrange the details.

   Good luck!

   — HouseFix Team
         `.trim()
       );
     }
   } catch (mailErr) {
     errorLogger.error('Could not send approval mail: ' + mailErr);
     /* we log the error but DO NOT fail the API call */
   }


    return res.json({
      message: 'Worker approved & event set to "in progress"',
      event
    });

  } catch (err) {
    errorLogger.error(`Error approving worker: ${err}`);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
},
  async getMyEvents(req, res) {
  try {
    const mine = await Events.find({ createdBy: req.userId }).sort({ date: -1 });
    return res.json(mine);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching your calls", error: err.message });
  }
},

async getMyApplications(req, res) {
  try {
    const apps = await Events.find({
      applicants: req.userId,
      status    : 'Open'                        // 👈 filter!
    }).sort({ date: -1 });
    return res.json(apps);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
},
async getMyApprovedCalls(req, res) {
  try {
    // find all Events where this user is in approvedWorkers
    const calls = await Events.find({ approvedWorkers: req.userId })
                              .sort({ date: -1 })
                              .lean();
    return res.json(calls);
  } catch (err) {
    errorLogger.error(`Error fetching approved calls: ${err}`);
    return res.status(500).json({ message: err.message });
  }
},
  async completeCall(req, res) {
    try {
      const call = await Events.findByIdAndUpdate(
        req.params.id,          // :id parameter
        { status: 'completed' },
        { new: true }           // return the updated doc
      );

      if (!call) {
        return res.status(404).json({ message: 'Call not found' });
      }
         try {
     const customer = await User.findById(call.createdBy)
                                .select('name email');

     const worker   = await User.findById(req.userId)
                                .select('name');

     if (customer?.email) {
       await sendMail(
         customer.email,
         '🎉 Your job is completed!',
         `
Hi ${customer.name},

Great news — ${worker?.name || 'Your worker'} marked the "${call.callType}"
job (#${call.callID}) as completed.

Please check the work and feel free to rate the worker in HouseFix.

Thank you for using HouseFix!

— HouseFix Team
         `.trim()
       );
     }
   } catch (mailErr) {
     errorLogger.error('Could not send “job done” e-mail: ' + mailErr);
     /* the API call itself should still succeed even if mail fails */
   }
 


      res.json(call);           // send updated call back
    } catch (err) {
      errorLogger.error(`completeCall error: ${err}`);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async markRated (req, res) {
    await Events.findByIdAndUpdate(req.params.id, { rated: true });
    res.json({ ok: true });
  }
};