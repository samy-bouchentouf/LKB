/**
 * Home controller.
 *
 * Handles home page requests and returns
 * knowledge base statistics.
 */

import {
    getStatistics
} from "../services/home.service.js";

async function getHomeStatistics(req, res) {

    try {

        const statistics =
            await getStatistics();

        return res.status(200).json(
            statistics
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve home statistics.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve home statistics."
        });

    }

}

export {
    getHomeStatistics
};