const Rating = require('../models/ratings');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.ratingsController = {
    async addRating(req, res) {
        try {
            const { username, usertype, rating } = req.body;

            const newRating = new Rating({
                username,
                usertype,
                rating
            });

            await newRating.save();
            infoLogger.info(`New rating submitted by ${username}`);
            res.status(201).json({ message: "Rating submitted successfully" });
        } catch (error) {
            errorLogger.error("Failed to submit rating:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async getAllRatings(req, res) {
        try {
            const ratings = await Rating.find().sort({ date: -1 }); // Latest first
            res.status(200).json(ratings);
        } catch (error) {
            errorLogger.error("Failed to fetch ratings:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async getAverageRating(req, res) {
        try {
            const result = await Rating.aggregate([
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: { $toDouble: "$rating" } }
                    }
                }
            ]);

            const avgRating = result[0]?.avgRating || 0;
            res.status(200).json({ average: avgRating.toFixed(1) });
        } catch (error) {
            errorLogger.error("Failed to calculate average rating:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    async deleteRating(req, res) {
        try {
            const ratingId = req.params.id;

            const rating = await Rating.findById(ratingId);
            if (!rating) {
                return res.status(404).json({ message: "Rating not found" });
            }

            await Rating.findByIdAndDelete(ratingId);
            infoLogger.info(`Rating deleted with ID: ${ratingId}`);
            res.status(200).json({ message: "Rating deleted successfully" });
        } catch (error) {
            errorLogger.error("Failed to delete rating:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
