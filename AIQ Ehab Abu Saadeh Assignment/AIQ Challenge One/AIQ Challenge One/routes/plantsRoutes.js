const express = require('express');
const router = express.Router();
const PlantsServices = require('../services/PlantsServices') ;


/**
 * @swagger
 * /api/plants/getTopNByAnnualNetGeneration/{number}:
 *   get:
 *     summary: Retrieve top plants based on a number
 *     description: Returns a list of top plants based on the specified number.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Number of top plants to retrieve
 *     responses:
 *       '200':
 *         description: A JSON array of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       '500':
 *         description: Internal server error
 */
router.get('/api/plants/getTopNByAnnualNetGeneration/:number', async (req, res, next) => {
    const number = parseInt(req.params.number, 10); // Convert to an integer
    if (isNaN(number) || number <= 0) {
        return res.status(400).json({ success: false, result: 'Invalid number parameter' });
    }

    const { success, result } = await PlantsServices.getTopNByAnnualNetGeneration({ number });
    return res.json({ success, result });
});


/**
 * @swagger
 * /api/plants/searchPlantsByState:
 *   get:
 *     summary: Search plants by state
 *     description: Returns a list of plants based on the specified state with pagination.
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State name to search for plants
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: pageIndex
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Index of the page to retrieve
 *     responses:
 *       '200':
 *         description: A JSON array of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       '500':
 *         description: Internal server error
 */
router.get('/api/plants/searchPlantsByState', async (req, res, next) => {
    const { state, pageSize, pageIndex } = req.query; 
    const pageSizeInt = parseInt(pageSize) || 10; // Default page size is 10 if not provided
    const pageIndexInt = parseInt(pageIndex) || 0; // Default page index is 0 if not provided
    const { success, result } = await PlantsServices.searchPlantsByState(state, pageSizeInt, pageIndexInt);
    return res.json({ success, result });
});


/**
 * @swagger
 * /api/plants/getStates:
 *   get:
 *     summary: Get all states with available plants
 *     description: Returns a list of all states for which plants data is available.
 *     responses:
 *       '200':
 *         description: A JSON array of states
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: string
 *       '500':
 *         description: Internal server error
 */
router.get('/api/plants/getStates', async (req, res, next) => {
    const { success, result } = await PlantsServices.getStates();
    return res.json({ success, result });
});






module.exports = router;
